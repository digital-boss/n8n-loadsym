import { Component, For } from "solid-js";
import { TaskToDraw } from "../utils/transformData";
import styles from "./Task.module.css";

export const taskHeight = 200;

export const Task: Component<TaskToDraw> = p => {
  const width = p.result - p.started;
  const text = `${p.task.id}: ${p.task.webhook}=>${p.task.worker}`;
  return <g transform={`translate(${p.started} ${p.slot * taskHeight})`}>
    <rect width={width} height={taskHeight} fill="#ddb47a"></rect>
    <text class={styles.text} y={taskHeight}>{text}</text>
  </g>
}
