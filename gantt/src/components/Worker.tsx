import { Component, For } from "solid-js";
import { TaskToDraw } from "../utils/transformData";
import { Task } from "./Task";

interface WorkerProps {
  items: TaskToDraw[]
}

export const Worker: Component<WorkerProps> = p => {
  return <>
    <For each={p.items}>{(item) => <Task {...item}></Task>}</For>
  </>
}
