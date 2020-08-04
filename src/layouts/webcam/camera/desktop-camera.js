import React from 'react';
import PropTypes from 'prop-types';
import CameraBase from './camera-base';

class DesktopCamera extends CameraBase {
  componentWillUnmount() {
    this.stopRecord();
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
