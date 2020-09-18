import WebRTCRecorder from './webrtc';
import MediaStreamRecorder from './media-recorder';

class CombineRecorder {
  constructor(fallbackServers) {
    this.recorder = new MediaStreamRecorder();
    this.sessionActive = false;
    this.stream = null;
    this.fallbackServers = fallbackServers;
  }

    initInput = async (el) => {
      if (this.sessionActive) {
        return;
      }
      let stream = null;
      try {
        stream = await window.navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { width: 320, height: 340 },
        });
      } catch (e) {
        console.error(e);
        stream = await window.navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { width: 320 },
        });
      }

      try {
        await this.recorder.initInput(stream);
      } catch (e) {
        console.error(e);
        this.recorder = new WebRTCRecorder(this.fallbackServers);
        await this.recorder.initInput(stream);
      }
      this.stream = stream;
      // eslint-disable-next-line no-param-reassign
      el.srcObject = stream;
      this.sessionActive = true;
    }

  startRecord = async () => this.recorder.startRecord()

  stopRecord = async () => {
    this.sessionActive = false;
    await this.recorder.stopRecord();
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    this.stream = null;
  }

  getRecord = async () => this.recorder.getRecord()
}

export default CombineRecorder;
