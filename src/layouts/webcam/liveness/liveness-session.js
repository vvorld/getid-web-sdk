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
async function createLiveness(servers, jwt = 'jwt', takePhoto, onCommand, onError, onReady) {
  const createSerever = async (address) => {
    // eslint-disable-next-line no-restricted-syntax
    const ws = new WebSocket(`${address}/0.3/liveness/${jwt}`);
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

    ws.send('needArtifacts');
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
      onError('server_unavailable');
    };
    let waitBinnary = false;
    let binnaryKind = '';
    const artifacts = {};
    ws.onmessage = (event) => {
      stop();
      if (waitBinnary) {
        waitBinnary = false;
        try {
          artifacts[binnaryKind] = new Blob([event.data.slice(0)], { type: binnaryKind === 'video' ? 'video/mp4' : 'image/jpeg' });
        } catch (e) {
          artifacts[binnaryKind] = event.data;
        }
        return;
      }
      const data = JSON.parse(event.data);

      switch (data.messageType) {
        case 'taskComplete':
          onCommand(data);
          setTimeout(() => {
            ws.send('giveMeTask');
          }, 2000);
          return;
        case 'success':
          data.artifacts = artifacts;
          onCommand(data);
          ws.onclose();
          console.log('liveness success');
          return;
        case 'task':
          onCommand(data);
          stop = photosLoop(ws, takePhoto);
          return;
        case 'warning':
          onCommand(data, () => ws.send('giveMeTask'));
          return;
        case 'failure':
          console.log('liveness failure');
          onCommand(data);
          ws.onclose();
          return;
        case 'artifactInfo':
          waitBinnary = true;
          binnaryKind = data.artifactInfo.kind;
          return;
        default:
          console.error('Wrong event:', data);
          break;
      }

      console.log('artefatc', data);
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
  onError('server_unavailable');
}

export default createLiveness;
