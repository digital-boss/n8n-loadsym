import { Component, For } from "solid-js";
import { TaskToDraw } from "../utils/transformData";
import { Worker } from "./Worker";
import { taskHeight } from './Task';

interface GanttProps {
  groups: Array<[worker: number, tasks: TaskToDraw[]]>
}

const getCumulativeSumArray = (arr: number[]) => {
  let acc = 0;
  return arr.map(i => {acc = i + acc; return acc;});
}

export const Gantt: Component<GanttProps> = p => {
  const slotsCount = p.groups
    .map(([, group]) => group.reduce((acc, i) => Math.max(acc, i.slot), 0))
    .map(i => i + 1);
  
  const cummulativeMargins = getCumulativeSumArray(
    [0, ...slotsCount.slice(0, -1)]
  ).map(i => i * taskHeight * 1.3);

  return <>
    <For each={p.groups}>{([worker, group], i) => 
      <g transform={`translate(0 ${cummulativeMargins[i()]})`}>
        <rect width="100%" height={slotsCount[i()] * taskHeight} fill="#e0e39f"></rect>
        <Worker items={group}></Worker>
      </g>
    }</For>
  </>
}
