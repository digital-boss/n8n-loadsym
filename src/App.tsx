import type { Component } from "solid-js";
import {
  createSignal,
  createEffect,
  createRenderEffect,
  createResource,
  Show,
  For,
} from "solid-js";
import logo from "./logo.svg";
import styles from "./App.module.css";
import { Matrix, PanZoom } from "./components/PanZoom";
import { convertData } from "./utils/transformData";
import { Gantt } from "./components/Gantt";
import { Label } from "./components/Label";

const fetchData = async (): Promise<any> => {
  return fetch("http://localhost:5080/api/org1/_search?type=logs", {
    headers: {
      authorization:
        "Basic " + btoa("root@example.com" + ":" + "Complexpass#123"),
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: {
        sql: 'select * from "stream1" ',
        size: 3000,
      },
    }),
    method: "POST",
  })
    .then((res) => res.json())
    .then((res) => convertData(res.hits));
};

const App: Component = () => {
  const [matrix, setMatrix] = createSignal<Matrix>([1, 0, 0, 1, 0, 0]);
  const [data] = createResource(fetchData);

  const viewBox = [0, 0, 15000, 6000];
  const centerX = viewBox[2] / 2;
  const centerY = viewBox[3] / 2;

  const pan = (dx: number, dy: number) => {
    setMatrix((old) => {
      const m: Matrix = [...old];
      m[4] += dx;
      m[5] += dy;
      return m;
    });
  };

  const zoom = (scale: number) => {
    setMatrix((old) => {
      const m: Matrix = [...old];
      for (var i = 0; i < 6; i++) {
        m[i] *= scale;
      }

      m[4] += (1 - scale) * centerX;
      m[5] += (1 - scale) * centerY;
      return m;
    });
  };

  createEffect(() => {
    console.log("data:");
    // console.log(data());

    if (data()) {
      console.log(data()[0][1][0]);
    }
  });

  const x = 1;

  return (
    <div>
      <svg viewBox={viewBox.join(" ")} id="map-svg">
        {/* <PanZoom matrix={matrix} setMatrix={setMatrix}> */}
        <Show when={data()}>
          <Gantt groups={data()}></Gantt>
        </Show>
        {/* </PanZoom> */}
        {/* <g>
          <circle cx="25" cy="25" r="21" fill="white" opacity="0.75" />
          <path
            class={styles.button}
            onclick={() => pan(0, 25)}
            d="M25 5 l6 10 a20 35 0 0 0 -12 0z"
          />
          <path
            class={styles.button}
            onclick={() => pan(25, 0)}
            d="M5 25 l10 -6 a35 20 0 0 0 0 12z"
          />
          <path
            class={styles.button}
            onclick={() => pan(0, -25)}
            d="M25 45 l6 -10 a20, 35 0 0,1 -12,0z"
          />
          <path
            class={styles.button}
            onclick={() => pan(-25, 0)}
            d="M45 25 l-10 -6 a35 20 0 0 1 0 12z"
          />

          <circle class={styles.compass} cx="25" cy="25" r="10" />
          <circle
            class={styles.button}
            cx="25"
            cy="20.5"
            r="4"
            onclick={() => zoom(0.8)}
          />
          <circle
            class={styles.button}
            cx="25"
            cy="29.5"
            r="4"
            onclick={() => zoom(1.25)}
          />

          <rect
            class={styles["plus-minus"]}
            x="23"
            y="20"
            width="4"
            height="1"
          />
          <rect
            class={styles["plus-minus"]}
            x="23"
            y="29"
            width="4"
            height="1"
          />
          <rect
            class={styles["plus-minus"]}
            x="24.5"
            y="27.5"
            width="1"
            height="4"
          />
        </g> */}
      </svg>
    </div>
  );
};

export default App;
