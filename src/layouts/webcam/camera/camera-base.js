/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
import { Component } from 'react';
import PropTypes from 'prop-types';
import frameRenderer from './helpers';

class CameraBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      mode: '',
    };
  }

  stopRecord() {
    const { ref } = this;
    if (ref && ref.srcObject) {
      const stream = ref.srcObject;
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  getStream = async () => {
    const params = {
      audio: false,
      video: {
        width: 2048,
        facingMode: { exact: this.props.facingMode },
      },
    };
    try {
      return [
        await navigator.mediaDevices.getUserMedia(params),
        this.props.facingMode,
      ];
    } catch (e) {
      params.video.facingMode = 'user';
      return [
        await navigator.mediaDevices.getUserMedia(params),
        'user',
      ];
    }
  }

  setSrc = async (ref) => {
    this.ref = ref;
    if (!ref) {
      return;
    }
    try {
      navigator.mediaDevices.enumerateDevices().then(console.log);
      const [stream, mode] = await this.getStream();
      const settings = stream.getVideoTracks()[0].getSettings();
      const { width, height } = settings;
      this.setState({ width, height, mode });
      this.ref.srcObject = stream;
      const intervalId = setInterval(() => {
        if (ref.readyState === 4) {
          clearInterval(intervalId);
          this.props.onReady(frameRenderer(ref, width, height));
        }
      }, 100);
    } catch (err) {
      this.props.onError(err);
    }
  }
}

CameraBase.propTypes = {
  onError: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
  facingMode: PropTypes.any.isRequired,
};
export default CameraBase;
