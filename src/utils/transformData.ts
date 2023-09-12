interface OpenObserveItem {
  event: "started" | "finished" | "result"
  info_task_duration: string;
  info_task_id: string;
  info_webhook_host: string;
  info_webhook_num: string;
  info_worker_num: string;
  info_worker_type: "worker" | "main" | "webhook"
  _timestamp: number
}

export interface Task {
  id: number;
  started?: Date;
  finished?: Date;
  result?: Date;
  worker: number;
  webhook: number;
}

export interface TaskToDraw {
  task: Task;
  started: number;
  finished: number;
  result: number;
  slot: number;
}

const createTask = (item: OpenObserveItem): Task => {
  return {
    id: parseInt(item.info_task_id),
    worker: parseInt(item.info_worker_num),
    webhook: parseInt(item.info_webhook_num),
    [item.event]: new Date(item._timestamp/1000)
  }
}

const fromOpenObserve = (items: OpenObserveItem[]): Task[] => {
  const obj = items.reduce((acc, i) => {
    const id = parseInt(i.info_task_id);
    if (Object.hasOwn(acc, id)) {
      const task = acc[id];
      task[i.event] = new Date(i._timestamp/1000);
    } else {
      acc[id] = createTask(i)
    }
    return acc;
  }, {} as {[key: number]: Task});
  return Object.values(obj);
}

/**
 * Place task to slot
 * @param slots 
 * @param task 
 * @returns Slot index where task was placed
 */
const placeToSlot = (slots: Task[], task: Task): number => {
  let i = 0;
  while (i < slots.length) {
    const slot = slots[i];
    const end = slot.result || slot.finished!;
    if (end < task.started!) {
      slots[i] = task;
      return i;
    }
    i++;
  }
  slots.push(task);
  return slots.length - 1;
}

const setSlot = (tasks: TaskToDraw[]) => {
  const slots: Task[] = [];
  for (let t of tasks) {
    t.slot = placeToSlot(slots, t.task);
  }
}

const createTaskToDraw = (task: Task, firstTime: number): TaskToDraw => {
  const startedTime = task.started!.getTime() - firstTime;
  const finishedTime = task.finished 
    ? task.finished.getTime() - firstTime
    : startedTime;
  const resultTime = task.result
    ? task.result.getTime() - firstTime
    : finishedTime;

  const draw: TaskToDraw = {
    task: task,
    started: startedTime/2,
    finished: finishedTime/2,
    result: resultTime/2,
    slot: -1,
  }

  return draw;

}

const toPlotObjects = (tasks: Task[]): Array<[worker: number, tasks: TaskToDraw[]]> => {
  const sorted = tasks.sort((a, b) => a.started!.getTime() - b.started!.getTime());
  const firstTime = sorted[0].started!.getTime();
  
  const result: TaskToDraw[] = [];

  const groups = Array.from(
    sorted
      .map(i => createTaskToDraw(i, firstTime))
      .reduce((acc, i) => 
        {
          if (!acc.has(i.task.worker)) {
            acc.set(i.task.worker, []);
          }
          acc.get(i.task.worker)!.push(i);
          return acc;
        }, new Map<number, TaskToDraw[]>()
      )
      .entries()
  )
  .sort(([w1], [w2]) => w1 - w2);

  for (const [, group] of groups) {
    setSlot(group);
  }
  return groups;
}

export const convertData = (items: OpenObserveItem[]): Array<[worker: number, tasks: TaskToDraw[]]> => {
  return toPlotObjects(fromOpenObserve(items));
}