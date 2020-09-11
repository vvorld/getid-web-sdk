class MediaStreamRecorder {
  constructor() {
    this.mediaRecorder = null;
  }

    initInput = async (stream) => {
      if (!MediaRecorder || !MediaRecorder.isTypeSupported) {
        throw new Error('MediaRecorder is not supported');
      }
      if (MediaRecorder.isTypeSupported('video/webm;codecs="vp9"')) {
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs="vp9"' });
        return;
      }
      if (MediaRecorder.isTypeSupported('video/webm;codecs="vp8"')) {
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs="vp8"' });
        return;
      }
      if (MediaRecorder.isTypeSupported('video/webm')) {
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        return;
      }
      throw new Error('MediaRecorder is not supported video/webm');
    }

  startRecord = async () => {
    this.chunks = [];
    this.mediaRecorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };
    this.mediaRecorder.start();
  }

  stopRecord = async () => {
    if (this.mediaRecorder.state === 'active') {
      this.mediaRecorder.stop();
    }
  }

  getRecord = async () => new Blob(this.chunks, { type: 'video/webm;codecs="vp9"' })
}

export default MediaStreamRecorder;
