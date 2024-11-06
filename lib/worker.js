import { parentPort, workerData } from 'worker_threads'
import { blubber } from './blubber.js'

blubber(workerData)
  .then((result) => {
    parentPort.postMessage(result);
  })
  .catch((error) => {
    console.error(error);
    parentPort.postMessage({ error: 'An error occurred' });
  });
