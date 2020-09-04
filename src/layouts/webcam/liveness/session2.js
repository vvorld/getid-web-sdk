const sleep = async (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const photosLoop = function sendPhotos(ws, takePhoto) {
  let running = true;
  (async () => {
    await sleep(1000);
    while (running) {
      // eslint-disable-next-line no-await-in-loop
      const blob = await new Promise((resolve) => takePhoto(resolve));
      if (blob.size) {
        ws.send(blob);
      }
      await sleep(200);
    }
  })();
  return () => { running = false; };
};
async function createLiveness(servers, takePhoto, onCommand) {
  const ws = (() => {
    // eslint-disable-next-line no-restricted-syntax
    for (const address of ['ws://10.10.10.59:1988/selfie']) {
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
  ws.onopen = () => {
    stop = photosLoop(ws, takePhoto);
  };

  ws.onclose = () => st();

  ws.onmessage = (event) => {
    console.log(event.data);
  };
}

export default createLiveness;
