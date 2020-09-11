const sleep = async (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const photosLoop = function sendPhotos(ws, takePhoto) {
  let running = true;
  (async () => {
    while (running) {
      // eslint-disable-next-line no-await-in-loop
      const blob = await new Promise((resolve) => takePhoto(resolve, false));
      if (blob.size) {
        console.log(blob);
        ws.send(blob);
      }

      await sleep(200);
    }
  })();
  return () => { running = false; };
};
function createLiveness(servers, takePhoto, onCommand) {
  const ws = (() => {
    // eslint-disable-next-line no-restricted-syntax
    for (const address of servers) {
      try {
        return new WebSocket(`${address}/selfie`);
      } catch (e) {
        console.log(e);
      }
    }
    throw new Error('Liveness server error');
  })();

  let stop = null;

  const st = () => stop && stop();
  ws.onopen = () => {
    console.log('facing WS open');
    stop = photosLoop(ws, takePhoto);
  };

  ws.onclose = (e) => {
    console.log('facing WS close', e);
    st();
  };
  ws.onmessage = (event) => {
    console.log(JSON.parse(event.data));
    onCommand(JSON.parse(event.data));
  };
  return () => {
    console.log('facing WS our close');
    ws.close();
  };
}

export default createLiveness;
