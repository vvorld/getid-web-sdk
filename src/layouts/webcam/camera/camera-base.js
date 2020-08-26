/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
import { Component } from 'react';
import PropTypes from 'prop-types';
import frameRenderer from './helpers';

const calculateMaskPoition = (width, height, ratio, zoom) => {
  const streamRatio = width / height;
  const [fwidth, fheight] = streamRatio < ratio
    ? [width * zoom, ((width * zoom) / ratio)]
    : [(height * zoom) * ratio, height * zoom];

  const left = (width - fwidth) / 2;
  const top = (height - fheight) / 2;
  return {
    left,
    top,
    bottom: height - top,
    right: width - left,
  };
};
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
        facingMode: { exact: this.props.facingMode, width: 2048 },
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
      const [stream, mode] = await this.getStream();

      setTimeout(() => {
        const settings = stream.getVideoTracks()[0].getSettings();
        const { width, height } = settings;
        const {
          left, right, top, bottom,
        } = calculateMaskPoition(width, height, this.props.ratio, 0.8);
        this.setState({
          width, height, left, right, top, bottom, mode,
        });
        this.ref.srcObject = stream;
        const intervalId = setInterval(() => {
          if (ref.readyState === 4 || ref.readyState > 0) {
            clearInterval(intervalId);
            this.props.onReady(frameRenderer(ref, {
              left, right, top, bottom,
            }));
          }
        }, 100);
      }, 1000);
    } catch (err) {
      this.props.onError(err);
    }
  }
}

CameraBase.propTypes = {
  onError: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
  facingMode: PropTypes.any.isRequired,
  ratio: PropTypes.number.isRequired,
};
export default CameraBase;
