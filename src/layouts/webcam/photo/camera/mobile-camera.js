import React from 'react';
import PropTypes from 'prop-types';
import CameraBase from './camera-base';
import Popup from '~/components/popup';

class MobileCamera extends CameraBase {
  componentWillUnmount() {
    this.stopRecord();
  }

  componentWillMount() {
    this.stopRecord();
  }

  onpopstate = (event) => {
    this.props.back.onClick();
    //    alert(`location: ${document.location}, state: ${JSON.stringify(event.state)}`);
  }

  render() {
    const {
      Overlay, next, back, visible,
    } = this.props;
    const {
      mode, width, height, left,
      top,
      bottom,
      right,
    } = this.state;
    return (
      <Popup visible={visible}>
        <div style={{ position: 'relative', height: '70vh' }}>
          <video
            style={{
              transform: mode === 'user' ? 'scale(-1, 1)' : 'scale(1, 1)',
              maxHeight: '70vh',
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
            style={{ maxHeight: '70vh' }}
          />
          )}
        </div>
        <div
          className="getid-footer__container"
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            background: 'balck',
            maxHeight: '20vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="">
            <button
              type="button"
              className="getid-button__main"
              style={{
                width: '100%',
                padding: '3vh',
                fontSize: '2vh',
                height: 'inherit',
              }}
              onClick={next.onClick}
            >
              take photo
            </button>
          </div>
          <button
            type="button"
            onClick={back.onClick}
            className="getid-btn__back"
            style={{
              lineHeight: '2.5vh',
              fontSize: '2.5vh',
            }}
          >
            cancel
          </button>
        </div>
      </Popup>
    );
  }
}

MobileCamera.propTypes = {
  Overlay: PropTypes.any.isRequired,
  onError: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
};
export default MobileCamera;
