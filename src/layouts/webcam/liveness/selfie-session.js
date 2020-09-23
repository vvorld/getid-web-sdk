const sleep = async (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const photosLoop = function sendPhotos(ws, takePhoto) {
  let running = true;
  (async () => {
    while (running) {
      // eslint-disable-next-line no-await-in-loop
      const blob = await new Promise((resolve) => takePhoto(resolve, false));
      if (blob.size) {
        ws.send(blob);
      }

      await sleep(200);
    }
  })();
  return () => { running = false; };
};
async function createSelfieSession(servers, takePhoto, onCommand, onError, onReady) {
  const createSerever = async (address) => {
    // eslint-disable-next-line no-restricted-syntax
    const ws = new WebSocket(`${address}/selfie`);
    let resolve = null;
    let reject = null;

    const wait = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    let timeout = null;
    ws.onopen = () => { resolve(); };
    ws.onerror = (e) => { reject(e); };
    setTimeout(() => {
      reject(new Error('connect timeout'));
    }, 5000);
    await wait;
    const stop = photosLoop(ws, takePhoto);

    ws.onclose = (e) => {
      console.log('WS close', e);
      clearTimeout(timeout);
      stop();
    };
    ws.onerror = (e) => {
      console.error(e);
      ws.close();
      stop();
      clearTimeout(timeout);
      const err = new Error('Liveness server error');
      err.name = 'server_unavailable';
      onError(err);
    };
    ws.onmessage = (event) => {
      onCommand(JSON.parse(event.data));
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (ws.readyState === 1) {
          ws.onerror(new Error('Liveness server timeout'));
        }
      }, 5000);
    };
    return () => {
      clearTimeout(timeout);
      ws.close();
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

export default createSelfieSession;