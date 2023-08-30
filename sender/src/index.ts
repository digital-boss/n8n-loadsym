#!/usr/bin/env node

import { exit } from "process";
import readline from 'readline';

const backgroundTasks: Promise<void>[] = [];
let terminate = false;

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function send_log(data: string): Promise<void> {
  const response = await fetch('http://localhost:5080/api/org1/stream1/_json', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from('root@example.com:Complexpass#123').toString('base64'),
      'Content-Type': 'application/json',
    },
    body: '['+data+']',
  });
}

async function start_task(id: number, duration: number): Promise<void> {
  console.log(`New task: id=${id}, duration=${duration}`);
  const response = await fetch(`http://localhost:5679/webhook/start-task?id=${id}&duration=${duration}`);
  const responseBody = await response.text();
  console.log(`Response for id=${id}, duration=${duration}:`);
  console.log(responseBody);
  await send_log(responseBody);
}

async function wait_for_background_tasks(): Promise<void> {
  console.log('Waiting for background tasks to finish...');
  await Promise.all(backgroundTasks);
  console.log('All background tasks finished');
}

async function send_requests(startId: number = 1): Promise<void> {
  let id = startId;

  while (!terminate) {
    const duration = getRandomNumber(2, 5);
    const pause = getRandomNumber(0, 1);

    const child = start_task(id, duration);
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

await send_requests(startId);

exit(0);