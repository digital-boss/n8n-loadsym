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

const checkQueueSize = async () => {
  const waiting = await queue.client.llen(queue.toKey('wait'));
  const active = await queue.client.llen(queue.toKey('active'));
  const queueSize = await queue.getJobCounts();
  process.stdout.cursorTo(0, 0); // Move cursor to the beginning of the console
  process.stdout.clearScreenDown(); // Clear the screen from the cursor position downward
  console.log('Press Enter (empty line) to exit')
  console.log('Queue size:', waiting, active, queueSize);
};

// Call checkQueueSize periodically
setInterval(checkQueueSize, 100);
