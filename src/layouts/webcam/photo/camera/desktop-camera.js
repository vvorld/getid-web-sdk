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

    const fill = 'var(--getid-accent-color)';
    const blob = (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 6C0 2.68629 2.68629 0 6 0H26C29.3137 0 32 2.68629 32 6V26C32 29.3137 29.3137 32 26 32H6C2.68629 32 0 29.3137 0 26V6Z" fill={fill} />
        <path d="M10 15C10 11.6863 12.6863 9 16 9C17.4327 9 18.7481 9.50214 19.7798 10.34" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M10.2589 18.236C10.143 18.4338 9.8571 18.4338 9.74121 18.236L7.5531 14.5021C7.4359 14.3021 7.58013 14.0504 7.81193 14.0504L12.1882 14.0504C12.42 14.0504 12.5642 14.3021 12.447 14.5021L10.2589 18.236Z" fill="white" />
        <path d="M21.7411 12.178C21.857 11.9803 22.1429 11.9803 22.2588 12.178L24.4469 15.912C24.5641 16.112 24.4199 16.3637 24.1881 16.3637H19.8118C19.58 16.3637 19.4358 16.112 19.553 15.912L21.7411 12.178Z" fill="white" />
        <path d="M22 16C22 19.3137 19.3137 22 16 22C14.5673 22 13.2519 21.4979 12.2202 20.66" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );

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
        {(this.devices && this.devices.length > 1) && (
        <button
          type="button"
          className="getid-camera__request"
          onClick={this.setDevice}
        >
            {blob}
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
