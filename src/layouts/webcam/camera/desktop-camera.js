import React, { Component } from 'react';
import PropTypes from 'prop-types';
import frameRenderer from './helpers';

class DesktopCamera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
  }

  setSrc = async (ref) => {
    this.ref = ref;

    if (!ref) {
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { deviceId: true, width: 4096 },
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

  render() {
    const { Overlay } = this.props;
    const { width, height } = this.state;
    return (
      <div style={{ position: 'relative', transform: 'scale(-1, 1)' }}>
        <video
          width="100%"
          playsInline
          ref={this.setSrc}
          muted
          autoPlay
        >
          <track kind="captions" />
        </video>
        {Overlay && <Overlay width={width} height={height} />}
      </div>
    );
  }
}

DesktopCamera.propTypes = {
  Overlay: PropTypes.any.isRequired,
  onError: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
};

export default DesktopCamera;
