class MediaStreamRecorder {
  constructor() {
    this.mediaRecorder = null;
  }

    initInput = async (stream) => {
      if (!MediaRecorder || !MediaRecorder.isTypeSupported || !MediaRecorder.isTypeSupported('video/webm')) {
        throw new Error('MediaRecorder is not supported');
      }
      this.mediaRecorder = new MediaRecorder(stream);
    }

  startRecord = async () => {
    this.chunks = [];
    this.mediaRecorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };
    this.mediaRecorder.start();
  }

  stopRecord = async () => {
    this.mediaRecorder.stop();
  }

  getRecord = async () => new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' })
}

export default MediaStreamRecorder;
