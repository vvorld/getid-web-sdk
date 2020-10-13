import React, { Component } from 'react';

import propTypes from 'prop-types';
import Footer from '~/components/blocks/footer';
import Header from '~/components/blocks/header/header';
import Content from '~/components/blocks/content';
import { getWSRoom, stopWSRoom } from './room';
import Copy from '~/assets/icons/copy.svg';

class MagicLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrCode: null,
      url: null,
      deviceChanged: false,
    };
    getWSRoom(this.props.config)(
      ({ qrCode, url }) => this.setState({ qrCode, url }),
      (deviceChanged) => this.setState({ deviceChanged }),
    );
  }

  onBack = () => {
    stopWSRoom();
    this.setState({
      qrCode: null,
      url: null,
      deviceChanged: null,
    });
    this.props.onBack();
  }

  render() {
    const { deviceChanged, url, qrCode } = this.state;
    return (
      <>
        <Header step="MagicLink" />
        <Content step="MagicLink">
          {
            !deviceChanged ? (
              <div style={{ display: 'flex', alignSelf: 'center', flexDirection: 'column' }}>
                <div>
                  <img src={qrCode} alt="magic link" />
                </div>
                <div style={{ margin: '20px' }}>OR</div>
                <div style={{ display: 'flex' }}>
                  <input
                    style={{
                      borderRadius: '5px',
                      fontSize: '14px',
                      color: '#1B336177',
                      background: '#FBFBFB',
                      border: '1px solid #ECECEC',
                      padding: '10px',
                      width: '250px',
                    }}
                    value={url}
                  />
                  <button
                    type="button"
                    style={{
                      marginLeft: '20px',
                      padding: '0px 20px 0px 10px',
                      width: 'inherit',
                      minWidth: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    className="getid-button__main"
                  >
                    <img alt="copy" src={Copy} />
                    Copy link
                  </button>
                </div>

              </div>
            ) : (<> Device changed</>)
          }
        </Content>
        <Footer
          step="MagicLink"
          back={{ onClick: () => this.onBack() }}
        />

      </>
    );
  }
}

MagicLink.propTypes = {
  config: propTypes.shape({}),
  onBack: propTypes.func,
};

MagicLink.defaultProps = {
  config: {},
  onBack: null,
};

export default MagicLink;
