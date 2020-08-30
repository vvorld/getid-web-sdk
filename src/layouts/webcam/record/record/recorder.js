import WebRTCRecorder from './webrtc';
import MediaStreamRecorder from './media-recorder';

class CombineRecorder {
  constructor(fallbackServer) {
    this.recorder = new MediaStreamRecorder();
    this.sessionActive = false;
    this.stream = null;
    this.fallbackServer = fallbackServer;
  }

    initInput = async (el) => {
      if (this.sessionActive) {
        return;
      }
      const stream = await window.navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { mandatory: { maxWidth: 320 } },
      });
      try {
        await this.recorder.initInput(stream);
      } catch (e) {
        this.recorder = new WebRTCRecorder(this.fallbackServer);
        await this.recorder.initInput(stream);
      }
      this.stream = stream;
      el.srcObject = stream;
      this.sessionActive = true;
    }

  startRecord = async () => this.recorder.startRecord()

  stopRecord = async () => {
    alert(1);
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
