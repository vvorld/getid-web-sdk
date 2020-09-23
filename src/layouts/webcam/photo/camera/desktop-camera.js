import React from 'react';
import PropTypes from 'prop-types';
import CameraBase from './camera-base';

class DesktopCamera extends CameraBase {
  componentWillUnmount() {
    this.stopRecord();
  }

  componentDidMount() {
    this.checkDevices();
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
          className="getid-camera__video"
          style={{ transform: mode !== 'environment' ? 'scale(-1, 1)' : undefined }}
          playsInline
          ref={this.setSrc}
          muted
          autoPlay
        />
        {this.devices && (
        <button
            type="button"
          style={{
            position: 'absolute', zIndex: '100', top: '5px', right: '5px',
          }}
          onClick={this.setDevice}
        >
          check cams
        </button>
        )}
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
