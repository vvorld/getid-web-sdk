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
function supportedQuadro() {
  if (navigator.appVersion && /iPhone OS 1[012]/.test(navigator.appVersion)) {
    return false;
  }
  return true;
}
const getError = (name) => {
  if (name === 'NotAllowedError') {
    return 'camera_not_allowed';
  }
  if (name === 'NotFoundError') {
    return 'no_camera';
  }
  return 'camera_generic';
};
class CameraBase extends Component {
  constructor(props) {
    super(props);
    this.devices = [];
    this.cameraIndex = 0;
    this.state = {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      mode: '',
      cameraSwitchBlob: null,
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

  onCamSwitch = (ref, callback) => {
    const { width, height } = this.state;
    const {
      left, right, top, bottom,
    } = calculateMaskPoition(width, height, 1.5, 1);

    const additionalVOffset = (bottom - top) * 0.1 > top ? top : (bottom - top) * 0.1;
    const additionalHOffset = (right - left) * 0.1 > left ? left : (right - left) * 0.1;

    const t = top - additionalVOffset;
    const l = left - additionalHOffset;
    const r = right + additionalHOffset;
    const b = bottom + additionalVOffset;

    const canvas = document.createElement('canvas');
    canvas.width = r - l;
    canvas.height = b - t;
    const context = canvas.getContext('2d');

    context.drawImage(ref,
      l,
      t,
      r - l,
      b - t,
      0, 0, canvas.width, canvas.height);
    canvas.toBlob(callback, 'image/jpeg', 0.7);
  }

  setDevice = async () => {
    this.onCamSwitch(this.ref, async (blob) => {
      await this.setState({ cameraSwitchBlob: blob });
      this.cameraIndex += 1;
      if (!this.devices[this.cameraIndex]) {
        this.cameraIndex = 0;
      }
      await this.setSrc(this.ref);
    });
  }

  getStream = async (maxWidth) => {
    const createStream = async (variants) => {
      const id = (this.devices[this.cameraIndex] && this.devices[this.cameraIndex].deviceId) || '';

      for (let i = 0; i < variants.length; i += 1) {
        const { width, height, facingMode } = variants[i];
        try {
          return [await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              width, height, facingMode: this.state.cameraSwitchBlob ? '' : facingMode, deviceId: id,
            },
          }), this.state.cameraSwitchBlob ? '' : facingMode];
        } catch (e) {
          if (i === (variants.length - 1)) {
            throw e;
          }
          console.error(e);
        }
      }
      throw new Error('Video does not supported');
    };

    const width = maxWidth;
    const height = maxWidth;
    const { facingMode } = this.props;
    const isSupportedQuadro = supportedQuadro();
    const variants = [
      isSupportedQuadro ? { facingMode, width, height } : null,
      { facingMode, width },
      isSupportedQuadro ? { width, height } : null,
      { width },
      {},
    ].filter((x) => x);
    return createStream(variants);
  }

  checkDevices = () => {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        devices.forEach((device) => {
          if (device.kind === 'videoinput') {
            this.devices.push(device);
          }
        });
      })
      .catch((err) => {
        console.log(`${err.name}: ${err.message}`);
      });
  }

  setSrc = async (ref) => {
    this.ref = ref;
    if (!ref) {
      return;
    }
    try {
      this.stopRecord();
      const [stream, requestMode] = await this.getStream(this.props.width || 1024);
      stream.getVideoTracks()[0].getSettings(); // check UC browser

      this.ref.srcObject = stream;
      const intervalId = setInterval(() => {
        if (ref.readyState === 4 || ref.readyState > 0) {
          try {
            const track = stream.getVideoTracks()[0];
            const settings = track.getSettings();
            const getMode = () => {
              if (track.getCapabilities) {
                const { facingMode = [] } = track.getCapabilities();
                return facingMode[0] || '';
              }
              return requestMode;
            };

            const height = this.ref.videoHeight || settings.height;
            const width = this.ref.videoWidth || settings.width;

            const {
              left, right, top, bottom,
            } = calculateMaskPoition(width, height, this.props.ratio, 0.8);

            this.setState({
              width, height, left, right, top, bottom, mode: getMode(),
            });

            clearInterval(intervalId);

            this.props.onReady(frameRenderer(ref, {
              left, right, top, bottom,
            }));
            this.setState({ cameraSwitchBlob: null });
          } catch (e) {
            console.error(e);
            this.props.onError(getError(e.name));
          }
        }
      }, 100);
    } catch (err) {
      console.error(err);
      this.props.onError(getError(err.name));
    }
  }
}

CameraBase.propTypes = {
  onError: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
  facingMode: PropTypes.any.isRequired,
  ratio: PropTypes.number.isRequired,
  width: PropTypes.number,
};
CameraBase.defaultProps = {
  width: 1024,
};
export default CameraBase;
