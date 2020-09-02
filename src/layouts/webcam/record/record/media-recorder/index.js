class MediaStreamRecorder {
  constructor() {
    this.mediaRecorder = null;
  }

    initInput = async (stream) => {
      if (!MediaRecorder || !MediaRecorder.isTypeSupported || !MediaRecorder.isTypeSupported('video/mp4')) {
        throw new Error('MediaRecorder is not supported');
      }
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/mp4' });
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

  getRecord = async () => {
    console.log(this.chunks[0]);
    return this.chunks[0];
  }
}

export default MediaStreamRecorder;
