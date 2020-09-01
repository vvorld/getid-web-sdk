import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Landscape from '~/assets/icons/views/landscape.svg';
import Translate from '~/components/blocks/translations';
import './popup.css';

class Popup extends Component {
  onpopstate = (event) => {
    this.props.back.onClick();
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.visible) {
      this.originalMaxWidth = document.body.style.maxWidth;
      this.originalWidth = document.body.style.width;
      this.originalDisplay = document.body.style.display;
      this.originalHeight = document.body.style.maxHeight;
      this.originalOverflow = document.body.style.overflow;
      this.originalOnpopstate = window.onpopstate;
      document.body.style.maxWidth = window.screen.width;
      document.body.style.width = window.screen.width;
      document.body.style.maxHeight = window.screen.height;
      document.body.style.display = 'block';
      document.body.style.overflow = 'hidden';

      try {
        window.history.pushState({ }, null, '#getid_step=popup');
      } catch (e) {
        console.log(e);
      }
      window.onpopstate = this.onpopstate;
    } else {
      document.body.style.maxWidth = this.originalMaxWidth;
      document.body.style.width = this.originalWidth;
      document.body.style.display = this.originalDisplay;
      document.body.style.maxHeight = this.originalHeight;
      document.body.style.overflow = this.originalOverflow;
      window.onpopstate = this.originalOnpopstate;
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div
        className="getid-popup"
        style={{
          width: window.screen.width,
          minHeight: window.screen.height,
        }}
      >
        <div className="getid-landscape">
          <div className="getid-landscape__content">
            <img
              src={Landscape}
              alt="mobile landscape"
              data-role="mobile-landscape"
            />
            <div className="getid-header__small">
              <Translate step="mobileCamera" element="landscape" />
            </div>
          </div>
        </div>
        <div className="getid-popup_contnet">
          {children}
        </div>
      </div>
    );
  }
}

Popup.propTypes = {
  children: PropTypes.any.isRequired,
  visible: PropTypes.bool.isRequired,
  back: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
  }).isRequired,
};
export default Popup;
