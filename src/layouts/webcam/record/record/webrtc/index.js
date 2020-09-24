import RecordSession from './session';

const { RTCSessionDescription, RTCPeerConnection } = require('wrtc');

class WebRTCRecorder {
  constructor(servers) {
    this.servers = servers;
    this.size = null;
    this.releases = [];
    this.dataChannel = null;
  }

    initInput = async (stream) => {
      try {
        this.session = new RecordSession(this.servers);
        const { localDescription } = await this.session.initSession(10 * 60);
        const peerConnection = new RTCPeerConnection({ });

        await peerConnection.setRemoteDescription(localDescription);
        this.releases.push(
          async () => (this.dataChannel && this.dataChannel.close()),
          async () => this.session.stopRecord(),
          async () => peerConnection.close(),
        );
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });
        const originalAnswer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(
          new RTCSessionDescription({
            type: 'answer',
            sdp: originalAnswer.sdp,
          }),
        );
        this.stream = stream;

        await this.session.remoteDescription(peerConnection.localDescription);

        let waitDataChannel = null;
        const pr = new Promise((resolve) => { waitDataChannel = resolve; });
        peerConnection.ondatachannel = (event) => {
          this.dataChannel = event.channel;
          waitDataChannel();
        };
        await pr;
      } catch (e) {
        console.error(e);
        const err = new Error(e.toString());
        err.name = 'webrtc';
        throw (err);
      }
    }

  startRecord = async () => {
    const settings = this.stream.getVideoTracks()[0].getSettings();
    const { width, height } = settings;
    this.dataChannel.send(`startRecording,${width}x${height}`);
  }

  stopRecord = async () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const f of this.releases) {
      await f();
    }
  }

  getRecord = async () => this.session.loadRecord()
}

export default WebRTCRecorder;
