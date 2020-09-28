import React, { Component } from 'react';

import Footer from '~/components/blocks/footer';
import Header from '~/components/blocks/header/header';
import Content from '~/components/blocks/content';

class MagicLink extends Component {
  render() {
    const [{ qrCode, url }, setRoom] = useState({});
    const [deviceChaged, setDeviceChanged] = useState(false);
    const { translations: dictionary, getWSRoom } = useContext(TranslationsContext);

    getWSRoom(setRoom, setDeviceChanged);

    return (
      <>
        <Header step="MagicLink" />
        <Content step="MagicLink">
          {
            !deviceChaged ? (
              <>
                <a href={url}>{url}</a>
                <img src={qrCode} />
              </>
            )
              : (
                <>
                  Device changed
                </>
              )
          }
        </Content>
        <Footer
          step="MagicLink"
          next={{
            onClick: () => finishStep({
              country: currCountry,
              documentType: currDocumentType,
            }),
          }}
          back={{ onClick: prevStep }}
        />

      </>
    );
  }
}

export default MagicLink;
