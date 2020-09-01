const sleep = async (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const photosLoop = function sendPhotos(ws, takePhoto) {
  let running = true;
  (async () => {
    await sleep(1000);
    while (running) {
      const start = new Date();
      // eslint-disable-next-line no-await-in-loop
      const blob = await new Promise((resolve) => takePhoto(resolve));
      if (blob.size) {
        ws.send(blob);
      }
      const took = new Date() - start;
      const timeout = 100;
      await sleep(took >= timeout ? 0 : timeout - took);
    }
  })();
  return () => { running = false; };
};
async function createLiveness(servers, takePhoto, onCommand) {
  const ws = (() => {
    for (const address of servers) {
      try {
        return new WebSocket(address);
      } catch (e) {
        console.log(e);
      }
    }
    throw new Error('Liveness server error');
  })();

  let stop = null;

  const st = () => stop && stop();
  ws.onopen = () => ws.send('giveMeTask');

  ws.onclose = () => st();

  ws.onmessage = (event) => {
    if (event.data === 'taskComplete') {
      ws.send('giveMeTask');
    }
    if (event.data === 'success') {
      onCommand({ text: 'SUCCESS!', type: 'success' });
      ws.close();
    }

    if (event.data.startsWith('task:')) {
      onCommand({ text: event.data.replace('task:', ''), type: 'task' });
      st();
      stop = photosLoop(ws, takePhoto);
    }

    if (event.data.startsWith('warning:')) {
      if (event.data.startsWith('warning:otherAction:')) {
        st();
      }
      onCommand({
        text: event.data.replace('warning:', ''),
        type: 'warning',
        next: () => ws.send('giveMeTask'),
      });
    }

    if (event.data.startsWith('failure:')) {
      ws.close();
      onCommand({ text: event.data.replace('failure:', ''), type: 'fail' });
    }
  };
}

export default createLiveness;
