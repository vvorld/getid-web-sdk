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
    console.log('stop');
    stop && stop();
    stop = null;
  };
  ws.onopen = () => {
    console.log('WS open');
    ws.send('giveMeTask');
  };

  ws.onclose = (e) => {
    console.log('WS close signal', e);
    st();
  };

  ws.onmessage = (event) => {
    console.log(event);
    const data = JSON.parse(event.data);
    if (data.messageType === 'taskComplete') {
      onCommand(data);
      setTimeout(() => {
        ws.send('giveMeTask');
      }, 2000);
    }
    if (data.messageType === 'success') {
      onCommand(data);
      console.log('liveness success');
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
      console.log('liveness failure');
      ws.close();
      onCommand(data);
    }
  };
  return () => {
    console.log('our failure');
    ws.close();
  };
}

export default createLiveness;
