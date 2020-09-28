const wsUri = 'wss://ws.dev.getid.dev/';

class WSRoom {
  async open(uri, config, onRoomInfo, setDeviceChanged) {
    const websocket = new WebSocket(`${uri}new_room?mask=${config.apiUrl}/device?room=\${id}`, 'asdasda');
    let reject = null;
    let resolve = null;
    const w = new Promise((res, rej) => {
      reject = rej,
      resolve = res;
    });
    websocket.onopen = () => {
      console.log('CONNECTED');
      websocket.send(JSON.stringify({
        from: 'master', to: 'server', action: 'get-qr-code', data: '',
      }));
      resolve();
    };
    websocket.onclose = () => {
      reject();
    };
    websocket.onerror = () => {
      reject();
    };
    await w;
    this.websocket = websocket;
    websocket.onopen = this.onOpen;
    websocket.onclose = this.onClose;
    let aliveTimeout;
    websocket.onmessage = (evt) => {
      const message = JSON.parse(evt.data);
      console.log(message);
      switch (message.action) {
        case 'server-response':
          onRoomInfo(message.data);
          break;
        case 'get-config':
          websocket.send(JSON.stringify({
            from: 'master', to: 'slave', action: 'set-config', data: config,
          }));
          break;
        case 'change':
          setDeviceChanged(true);
          aliveTimeout = setTimeout(() => {
            setDeviceChanged(false);
          }, 5000);
          break;
        case 'alive':
          clearTimeout(aliveTimeout);
          aliveTimeout = setTimeout(() => {
            setDeviceChanged(false);
          }, 5000);
          setDeviceChanged(true);
          break;
        case 'complete':
          alert('OK');
          break;
        default:
          console.error(`I don\t know what to do: ${message.action}`);
      }
    };
    websocket.onerror = this.onError;
    websocket.onPing = this.onPing;
  }

  onClose= (evt) => { console.log(evt); }

  onError = (evt) => {}
}
let r = null;
export default (config) => (onRoomInfo, setDeviceChanged) => {
  if (!r) {
    r = new WSRoom();
    r.open(wsUri, config, onRoomInfo, setDeviceChanged);
  }
  return r;
};
