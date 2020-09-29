import React, { Component } from 'react';

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
      deviceChaged: false,
    };
    getWSRoom(this.props.config)(
      ({ qrCode, url }) => this.setState({ qrCode, url }),
      (deviceChaged) => this.setState({ deviceChaged }),
    );
  }

  onBack = () => {
    stopWSRoom();
    this.setState({
      qrCode: null,
      url: null,
      deviceChaged: null,
    });
    this.props.onBack();
  }

  render() {
    const { deviceChaged, url, qrCode } = this.state;
    return (
      <>
        <Header step="MagicLink" />
        <Content step="MagicLink">
          {
            !deviceChaged ? (
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
                    <img src={Copy} />
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

export default MagicLink;
