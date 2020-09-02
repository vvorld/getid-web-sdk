import React from 'react';
import PropTypes from 'prop-types';
import CameraBase from './camera-base';

class DesktopCamera extends CameraBase {
  componentWillUnmount() {
    this.stopRecord();
  }

  render() {
    const { Overlay } = this.props;
    const {
      width, height, left,
      top,
      bottom,
      right,
      mode,
    } = this.state;

    return (
      <div className="getid-camera__container">
        <video
          style={{
            transform: mode === 'user' ? 'scale(-1, 1)' : 'scale(1, 1)',
          }}
          width="100%"
          playsInline
          ref={this.setSrc}
          muted
          autoPlay
        />
        {Overlay && (
        <Overlay
          width={width}
          height={height}
          left={left}
          top={top}
          bottom={bottom}
          right={right}
        />
        )}
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
