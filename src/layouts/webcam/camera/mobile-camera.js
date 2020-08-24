import React from 'react';
import PropTypes from 'prop-types';
import CameraBase from './camera-base';
import Landscape from '../../../assets/icons/views/landscape.svg';
import Translate from '../../../components/blocks/translations';

class MobileCamera extends CameraBase {
  componentWillUnmount() {
    this.stopRecord();
    document.body.style.maxWidth = this.originalWidth;
    document.body.style.display = this.originalDisplay;
  }

  componentWillMount() {
    this.stopRecord();
  }

  onpopstate = (event) => {
    this.props.back.onClick();
    //    alert(`location: ${document.location}, state: ${JSON.stringify(event.state)}`);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.visible) {
      this.originalWidth = document.body.style.maxWidth;
      this.originalDisplay = document.body.style.display;
      this.originalHeight = document.body.style.maxHeight;
      this.originalOverflow = document.body.style.overflow;
      this.originalOnpopstate = window.onpopstate;
      document.body.style.maxWidth = '100vw';
      document.body.style.maxHeight = '100vh';
      document.body.style.display = 'block';
      document.body.style.overflow = 'hidden';

      try {
        history.pushState({ }, null, '#getid_step=record');
      } catch (e) {
        console.log(e);
      }
      window.onpopstate = this.onpopstate;
    } else {
      document.body.style.maxWidth = this.originalWidth;
      document.body.style.display = this.originalDisplay;
      document.body.style.maxHeight = this.originalHeight;
      document.body.style.overflow = this.originalOverflow;
      window.onpopstate = this.originalOnpopstate;
    }
  }

  componentDidMount() {
    window.addEventListener('orientationchange', () => {
      this.setState({ orientation: window.orientation !== 0 });
    }, false);
  }

  render() {
    const { Overlay, next, back } = this.props;
    const {
      orientation,
      mode, width, height, left,
      top,
      bottom,
      right,
    } = this.state;

    if (orientation) {
      return (
        <div>
          <img
            src={Landscape}
            alt="mobile landscape"
            data-role="mobile-landscape"
          />
          <div className="getid-header__small">
            <Translate step="mobileCamera" element="landscape" />
          </div>
        </div>
      );
    }

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100vw',
        background: 'black',
      }}
      >
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          width: '100%',
        }}
        >
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
