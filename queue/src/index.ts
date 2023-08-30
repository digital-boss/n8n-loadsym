import readline from "readline";
import Queue from 'bull';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input: string) => {
  if (input.trim() === "") {
    process.exit(0);
  }
});

const queue = new Queue('jobs', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

console.log(queue.toKey('waiting'));

const checkQueueSize = async () => {
  const waiting = await queue.client.llen(queue.toKey('wait'));
  const active = await queue.client.llen(queue.toKey('active'));
  const queueSize = await queue.getJobCounts();
  console.log('Queue size:', waiting, active, queueSize);
};

// Call checkQueueSize periodically
setInterval(checkQueueSize, 1000);

console.log('Press Enter (empty line) to exit')