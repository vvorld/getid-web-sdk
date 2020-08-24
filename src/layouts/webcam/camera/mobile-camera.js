import React from 'react';
import PropTypes from 'prop-types';
import CameraBase from './camera-base';

class MobileCamera extends CameraBase {
  componentWillUnmount() {
    this.stopRecord();
  }

  render() {
    const { Overlay, next, back } = this.props;
    const {
      mode, width, height, left,
      top,
      bottom,
      right,
    } = this.state;
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: 'black',
      }}
      >
        <div style={{
          position: 'relative',
          minHeight: window.innerHeight, // ;// '100vh',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          width: '100%',
        }}
        >
          <div style={{ flexGrow: 1 }} />
          <div style={{ position: 'relative' }}>
            <video
              style={{
                transform: mode === 'user' ? 'scale(-1, 1)' : 'scale(1, 1)',
                maxHeight: '80vh',
              }}
              width="100%"
              playsInline
              autoPlay
              muted
              ref={this.setSrc}
            >
              <track kind="captions" />
            </video>
            {Overlay && (
              <Overlay
                width={width}
                height={height}
                left={left}
                top={top}
                bottom={bottom}
                right={right}
                style={{ maxHeight: '80vh' }}
              />

            )}
          </div>
          <div style={{ flexGrow: 1 }} />
          <div
            className="getid-footer__container"
            style={{
              bottom: 0, left: 0, right: 0, background: 'balck', padding: '30px',
            }}
          >
            <div className="getid-button__wrapper">
              <button
                type="button"
                className="getid-button__main"
                style={{
                  width: '100%',
                  padding: '21px',
                  fontSize: '16px',
                  height: 'inherit',
                }}
                onClick={next.onClick}
              >
                take photo
              </button>
            </div>
            <button type="button" onClick={back.onClick} className="getid-btn__back" style={{ marginTop: '20px' }}>cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

MobileCamera.propTypes = {
  Overlay: PropTypes.any.isRequired,
  onError: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
};
export default MobileCamera;
