import RecordSession from './session';

const { RTCSessionDescription, RTCPeerConnection } = require('wrtc');

class WebRTCRecorder {
  constructor(server) {
    this.session = new RecordSession(server);
    this.size = null;
    this.releases = [];
    this.dataChannel = null;
  }

    initInput = async (stream) => {
      const { localDescription } = await this.session.initSession(3);
      const peerConnection = new RTCPeerConnection({ });

      peerConnection.ondatachannel = (event) => {
        this.dataChannel = event.channel;
      };

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