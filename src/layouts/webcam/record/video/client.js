const { RTCSessionDescription, RTCPeerConnection } = require('wrtc');

class VideoClient {
  constructor(api) {
    this.api = api;
    this.releases = [];
    this.dataChannel = null;
    this.active = false;
  }

    start = async () => {
      if (this.active) {
        return;
      }
      this.active = true;
      const { localDescription, id } = await this.api.initConnect(3);
      const peerConnection = new RTCPeerConnection({ });

      peerConnection.ondatachannel = (event) => {
        this.dataChannel = event.channel;
        this.dataChannel.addEventListener('message', (ev) => {
          const message = ev.data;
          console.log('message - ', message);
        });
      };

      await peerConnection.setRemoteDescription(localDescription);
      this.releases.push(
        async () => (this.dataChannel && this.dataChannel.close()),
        async () => this.api.stopRecord(),
        async () => peerConnection.close(),
      );

      const localStream = await window.navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true, /* {
          mandatory: {
            maxWidth: 320,
          },
        }, */
      });
      await new Promise((resolve) => setTimeout(() => {
        const settings = localStream.getVideoTracks()[0].getSettings();
        console.log(settings);
        resolve();
      }, 1000));
      localStream.getVideoTracks().forEach((track) => console.log(track.getSettings())),
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
        }),
      );

      await this.api.remoteDescription(peerConnection.localDescription);
    }

    startRecord = async () => {
      this.dataChannel.send('startRecording');
    }

    stop = async () => {
      this.active = false;
      for (const f of this.releases) {
        await f();
      }
    }

    setEl = (el) => {
      el.addEventListener('loadedmetadata', function () {
        console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
      });
      el.srcObject = this.localStream;
    }
}

export default VideoClient;
