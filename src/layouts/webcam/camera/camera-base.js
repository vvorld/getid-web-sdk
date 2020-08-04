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

  setSrc = async (ref) => {
    this.ref = ref;
    if (!ref) {
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { deviceId: true, width: 2048 },
      });

      const { width, height } = stream.getVideoTracks()[0].getSettings();
      this.setState({ width, height });
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
};
export default CameraBase;
