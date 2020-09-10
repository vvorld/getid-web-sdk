const sleep = async (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const photosLoop = function sendPhotos(ws, takePhoto) {
  let running = true;
  let count = 0;
  const st = Date.now();
  (async () => {
    console.log('photosLoop');
    while (running) {
      const start = new Date();
      // eslint-disable-next-line no-await-in-loop
      const blob = await new Promise((resolve) => takePhoto(resolve, true));
      count++;
      if (blob.size) {
        ws.send(blob);
      }
      const took = new Date() - start;
      const timeout = 100;
      await sleep(took >= timeout ? 0 : timeout - took);
      console.log(count, Date.now() - st);
    }
    console.log('stop photosLoop');
  })();
  return () => { running = false; };
};
function createLiveness(servers, takePhoto, onCommand) {
  const ws = (() => {
    // eslint-disable-next-line no-restricted-syntax
    for (const address of servers) {
      try {
        return new WebSocket(`${address}/liveness`);
      } catch (e) {
        console.log(e);
      }
    }
    throw new Error('Liveness server error');
  })();

  let stop = null;

  const st = () => {
    stop && stop();
    stop = null;
  };
  ws.onopen = () => ws.send('giveMeTask');

  ws.onclose = () => st();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    if (data.messageType === 'taskComplete') {
      ws.send('giveMeTask');
    }
    if (data.messageType === 'success') {
      onCommand(data);
      ws.close();
    }

    if (data.messageType === 'task') {
      onCommand(data);
      st();
      stop = photosLoop(ws, takePhoto);
    }

    if (data.messageType === 'warning') {
      st();
      onCommand(data, () => ws.send('giveMeTask'));
    }

    if (data.messageType === 'failure') {
      st();
      ws.close();
      onCommand(data);
    }
  };
  return () => {
    ws.close();
  };
}

export default createLiveness;
