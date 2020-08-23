const { RTCSessionDescription, RTCPeerConnection } = require('wrtc');

class VideoClient {
  constructor(api) {
    this.api = api;
    this.releases = [];
  }

    start = async () => {
      const { localDescription, id } = await this.api.initConnect(3);
      const peerConnection = new RTCPeerConnection({ sdpSemantics: 'unified-plan' });
      await peerConnection.setRemoteDescription(localDescription);
      this.releases.push(
        async () => await this.api.stopRecord(),
        async () => peerConnection.close(),
      );

      const localStream = await window.navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          mandatory: {
            maxWidth: 320,
          },
        },
      });
      localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
      this.localStream = localStream;
      this.releases.push(
        async () => localStream.getTracks().forEach((track) => track.stop()),
      );
      const originalAnswer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(
        new RTCSessionDescription({
          type: 'answer',
          sdp: originalAnswer.sdp,
          /* iceServers: [
            { urls: 'stun:164.90.223.220:3478' },
          ], */
        }),
      );
      await this.api.remoteDescription(peerConnection.localDescription);
    }

    stop = async () => {
      for (const f of this.releases) {
        await f();
      }
    }

    setEl = (el) => {
      el.srcObject = this.localStream;
    }
}

export default VideoClient;
