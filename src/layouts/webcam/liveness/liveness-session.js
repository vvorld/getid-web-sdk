const sleep = async (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const photosLoop = function sendPhotos(ws, takePhoto) {
  let running = true;
  (async () => {
    console.log('photosLoop');
    while (running) {
      const start = new Date();
      // eslint-disable-next-line no-await-in-loop
      const blob = await new Promise((resolve) => takePhoto(resolve, true));
      // eslint-disable-next-line no-plusplus
      if (blob.size) {
        ws.send(blob);
      }
      const took = new Date() - start;
      const timeout = 100;
      await sleep(took >= timeout ? 0 : timeout - took);
    }
    console.log('stop photosLoop');
  })();
  return () => {
    running = false;
  };
};
async function createLiveness(servers, takePhoto, onCommand, onError, onReady) {
  const createSerever = async (address) => {
    // eslint-disable-next-line no-restricted-syntax
    const ws = new WebSocket(`${address}/liveness`);
    let resolve = null;
    let reject = null;

    const wait = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    const timeout = null;

    ws.onopen = () => { resolve(); };
    ws.onerror = (e) => { reject(e); };
    await wait;

    let stop = () => {};

    ws.send('giveMeTask');
    ws.onclose = (e) => {
      console.log('facing WS close', e);
      stop();
      ws.close();
      clearTimeout(timeout);
    };
    ws.onerror = (e) => {
      console.error(e);
      ws.onclose();
      clearTimeout(timeout);
      const err = new Error('Liveness server error');
      err.name = 'server_unavailable';
      onError(err);
    };
    ws.onmessage = (event) => {
      stop();
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.messageType === 'taskComplete') {
        onCommand(data);
        setTimeout(() => {
          ws.send('giveMeTask');
        }, 2000);
      }
      if (data.messageType === 'success') {
        onCommand(data);
        ws.onclose();
        console.log('liveness success');
      }

      if (data.messageType === 'task') {
        onCommand(data);
        stop = photosLoop(ws, takePhoto);
      }

      if (data.messageType === 'warning') {
        onCommand(data, () => ws.send('giveMeTask'));
      }

      if (data.messageType === 'failure') {
        console.log('liveness failure');
        onCommand(data);
        ws.onclose();
      }
    };
    return () => {
      console.log('facing WS our close');
      ws.onclose();
    };
  };
  for (const address of servers) {
    try {
      const stop = await createSerever(address);
      onReady(stop);
      return;
    } catch (e) {
      console.error(e);
    }
  }
  const err = new Error('Liveness server error');
  err.name = 'server_unavailable';
  onError(err);
}

export default createLiveness;
