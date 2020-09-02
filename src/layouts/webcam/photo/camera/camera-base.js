/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
import { Component } from 'react';
import PropTypes from 'prop-types';
import frameRenderer from './helpers';

const calculateMaskPoition = (width, height, ratio = width / height, zoom = 1) => {
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
        width: { min: 1024, ideal: 1024 },
        height: { min: 1024, ideal: 1024 },
        facingMode: { exact: this.props.facingMode },
      },
    };
    try {
      return [
        await navigator.mediaDevices.getUserMedia(params),
        this.props.facingMode,
      ];
    } catch (e) {
      console.error(e);
      try {
        params.video.facingMode = 'user';
        return [
          await navigator.mediaDevices.getUserMedia(params),
          'user',
        ];
      } catch (ee) {
        console.error(ee);
        delete params.video.facingMode;
        return [
          await navigator.mediaDevices.getUserMedia(params),
          '',
        ];
      }
    }
  }

  setSrc = async (ref) => {
    this.ref = ref;
    if (!ref) {
      return;
    }
    try {
      const [stream, mode] = await this.getStream();
      this.ref.srcObject = stream;
      const intervalId = setInterval(() => {
        if (ref.readyState === 4 || ref.readyState > 0) {
          const settings = stream.getVideoTracks()[0].getSettings();
          const height = this.ref.videoHeight || settings.height;
          const width = this.ref.videoWidth || settings.width;
          const {
            left, right, top, bottom,
          } = calculateMaskPoition(width, height, this.props.ratio, 0.8);
          this.setState({
            width, height, left, right, top, bottom, mode,
          });

          clearInterval(intervalId);
          this.props.onReady(frameRenderer(ref, {
            left, right, top, bottom,
          }));
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
  ratio: PropTypes.number.isRequired,
};
export default CameraBase;
