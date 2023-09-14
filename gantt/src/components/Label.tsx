import { Component, For } from "solid-js";
import { TaskToDraw } from "../utils/transformData";
import styles from "./Task.module.css";

export const Label: Component<TaskToDraw> = p => {
  console.log(p);
  return <div>
    <p>{p.task.id} wrk: {p.task.worker} hook: {p.task.webhook}</p>
  </div>
}
