#!/usr/bin/env node

import { exit } from "process";
import readline from 'readline';

const backgroundTasks: Promise<void>[] = [];
let terminate = false;

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface Context {
  stream: string;
}

let logger: (data: string) => Promise<void> = () => Promise.resolve();

const createLogger = (ctx: Context) => async (data: string): Promise<void> => {
  const response = await fetch(`http://localhost:5080/api/org1/${ctx.stream}/_json`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from('root@example.com:Complexpass#123').toString('base64'),
      'Content-Type': 'application/json',
    },
    body: '['+data+']',
  });
}

async function start_task(id: number, duration: number, ctx: Context): Promise<void> {
  console.log(`New task: id=${id}, duration=${duration}`);
  const response = await fetch(`http://localhost:5679/webhook/start-task?id=${id}&duration=${duration}&stream=${ctx.stream}`);
  const responseBody = await response.text();
  console.log(`Response for id=${id}, duration=${duration}:`);
  console.log(responseBody);
  await logger(responseBody);
}

async function wait_for_background_tasks(): Promise<void> {
  console.log('Waiting for background tasks to finish...');
  await Promise.all(backgroundTasks);
  console.log('All background tasks finished');
}

async function send_requests(startId: number = 1, ctx: Context): Promise<void> {
  let id = startId;

  while (!terminate) {
    const duration = getRandomNumber(10, 15);
    const pause = getRandomNumber(1, 1);

    const child = start_task(id, duration, ctx);
    backgroundTasks.push(child);

    id++;
    console.log(`Waiting for ${pause} seconds before next request...`);
    await new Promise(resolve => setTimeout(resolve, pause * 1000));
  }

  await wait_for_background_tasks();
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', () => {
  terminate = true;
});

var args = process.argv.slice(2);

const startId = args[0] ? Number(args[0]) : 1;
const stream = args[1] ? args[1] : "stream1";

const ctx: Context = {
  stream
}

logger = createLogger(ctx);

await send_requests(startId, ctx);

exit(0);