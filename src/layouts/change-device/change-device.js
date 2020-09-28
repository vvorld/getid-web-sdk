import React, { Component } from 'react';

import ContinueOnPhone from '~/assets/icons/views/continue-on-phone.svg.svg';

import Footer from '~/components/blocks/footer';
import Header from '~/components/blocks/header/header';
import Content from '~/components/blocks/content';

class ChangeDevice extends Component {
  render() {
    return (
      <>
        <Header step="ChangeDevice" />
        <Content step="ChangeDevice">
          <ContinueOnPhone />
        </Content>
        <Footer
          step="ChangeDevice"
          next={{
            onClick: () => finishStep({
              country: currCountry,
              documentType: currDocumentType,
            }),
            disable: !currDocumentType || !docTypeMapping[currDocumentType],
          }}
          back={{ onClick: prevStep }}
        />

      </>
    );
  }
}

export default ChangeDevice;
