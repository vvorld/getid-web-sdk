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

  getStream = async (maxWidth) => {
    const createStream = async (variants) => {
      for (let i = 0; i < variants.length; i += 1) {
        const { width, height, exact } = variants[i];
        try {
          return [
            await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: { width, height, facingMode: exact && { exact } },
            }),
            exact,
          ];
        } catch (e) {
          if (i === (variants.length - 1)) {
            throw e;
          }
          console.error(e);
        }
      }
      throw new Error('Video does not supported');
    };

    const width = { min: 640, ideal: maxWidth };
    const height = { min: 480, ideal: maxWidth };
    const exact = this.props.facingMode;
    const isSupportedQuadro = supportedQuadro();
    const variants = [
      isSupportedQuadro ? { exact, width, height } : null,
      { exact, width },
      (isSupportedQuadro && exact !== 'user') ? { exact: 'user', width, height } : null,
      exact !== 'user' ? { exact: 'user', width } : null,
      isSupportedQuadro ? { width, height } : null,
      { width },
      {},
    ].filter((x) => x);
    return createStream(variants);
  }

  setSrc = async (ref) => {
    this.ref = ref;
    if (!ref) {
      return;
    }
    try {
      const [stream, mode] = await this.getStream(1024);
      stream.getVideoTracks()[0].getSettings(); // check UC browser
      this.ref.srcObject = stream;
      const intervalId = setInterval(() => {
        if (ref.readyState === 4 || ref.readyState > 0) {
          try {
            const track = stream.getVideoTracks()[0];
            const settings = track.getSettings();
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
          } catch (e) {
            console.error(e);
            this.props.onError(e);
          }
        }
      }, 100);
    } catch (err) {
      console.error(err);
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
