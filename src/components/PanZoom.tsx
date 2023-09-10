import type { Component, ParentComponent, Setter, Accessor, JSX } from "solid-js";
import { createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";

export type Matrix = [number, number, number, number, number, number];

export type PanZoomProps = JSX.GSVGAttributes<SVGGElement> & {
  matrix: Accessor<Matrix>, 
  setMatrix: Setter<Matrix>
}

interface Store {
  mouseDown?: {
    clientX: number,
    clientY: number,
    matrixE: number,
    matrixF: number,
  }
}

export const PanZoom: ParentComponent<PanZoomProps> = ({matrix, setMatrix, children, ...rest}) => {
  
  const transform = () => "matrix(" + matrix().join(" ") + ")";

  const [state, setState] = createStore<Store>({})

  const pan = (dx: number, dy: number) => {
    setMatrix(old => {
      const m: Matrix = [...old]
      m[4] = state.mouseDown!.matrixE + dx;
      m[5] = state.mouseDown!.matrixF + dy;
      return m;
    });
  }

  const onMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    setState('mouseDown', {
      clientX: event.clientX,
      clientY: event.clientY,
      matrixE: matrix()[4],
      matrixF: matrix()[5],
    })
  }

  const onMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    if (state.mouseDown) {
      const dx = event.clientX - state.mouseDown.clientX;
      const dy = event.clientY - state.mouseDown.clientY;

      const target = event.target as any;
      const svg = target.closest('svg');
      const {left, top, width, height} = svg.getBoundingClientRect();

      const scaleX = width / svg.viewBox.baseVal.width;
      const scaleY = height / svg.viewBox.baseVal.height;
    
      console.log(`dx: ${dx}, dy: ${dy}, ${scaleX}, ${scaleY}`);
      pan(dx/scaleX, dy/scaleY);
    }
  }
  
  const onMouseUp = (event: MouseEvent) => {
    event.preventDefault();
    setState('mouseDown', undefined);
  }

  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    const delta = Math.sign(event.deltaY) * 0.1;
    setMatrix(old => {
      const m: Matrix = [...old]
      m[0] -= delta;
      m[3] -= delta;
      return m;
    });
  }

  // const getPoint = (x, y) => {
  //   const {left, top, width, height} = svg.getBoundingClientRect();
  //   const scaleX = width / svg.viewBox.baseVal.width;
  //   const scaleY = height / svg.viewBox.baseVal.height;
  
  //   return {
  //     x: (x - left) / scaleX + viewBox[0],
  //     y: (y - top) / scaleY + viewBox[1]
  //   };
  // }
  
  
  return <g transform={transform()} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onWheel={onWheel} {...rest}>
    <rect width="100%" height="100%" style="fill: transparent"></rect>
    {children}
  </g>
}