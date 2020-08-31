/* eslint-disable max-classes-per-file */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Footer from '~/components/blocks/footer/footer';
import Popup from '~/components/popup';
import './record.css';

import Timer from './timer';
import Translate from '~/components/blocks/translations';
import CombineRecorder from './recorder';

export default (pr) => {
  let recording = false;
  const {
    back, next, phrases, server, onError, onReady,
  } = pr;

  const recorder = new CombineRecorder(server);
  const rerenders = [];

  const change = async (rec) => {
    if (!recording && rec) {
      await recorder.startRecord();
    }
    recording = rec;
    // eslint-disable-next-line no-restricted-syntax
    for (const r of rerenders) {
      r();
    }
  };

  let activeLine = 0;
  const rerenderPhrases = [];
  const changeLine = (newValue) => {
    activeLine = newValue;
    for (const r of rerenderPhrases) {
      r();
    }
  };

  class RecordingCamera extends Component {
    componentWillMount() {
      rerenders.push(() => this.forceUpdate());
    }

    componentWillUnmount() {
      this.stop();
    }

    setSrc = async (el) => {
      if (el) {
        try {
          await recorder.initInput(el);
          onReady(this.stop);
        } catch (e) {
          onError(e);
        }
      }
    }

    stop = async () => {
      await recorder.stop();
    }

    render() {
      return (
        <div style={{ position: 'relative' }}>
          {recording && <Timer />}
          <video
            width="100%"
            playsInline
            ref={this.setSrc}
            muted
            autoPlay
          />
        </div>
      );
    }
  }

  class Phrases extends Component {
    constructor(props) {
      super(props);
      this.state = {
        textMod: 'hide',
        visible: false,
      };
    }

    componentWillMount() {
      rerenderPhrases.push(() => {
        this.setState({ textMod: 'hide' });
      });
    }

    render() {
      if (!recording) {
        return null;
      }
      const { step } = this.props;
      const { textMod, visible } = this.state;

      if (textMod === 'hide' || !visible) {
        setTimeout(() => {
          this.setState({ textMod: 'show', visible: true });
        }, 50);
      }
      return (
        <div>
          {activeLine < phrases.length && (
            <>
              <div className={`getid-phrases__contaner${!visible ? ' getid-phrases_begin' : ''}`}>
                <div className="getid-phrases__title">
                  <Translate step={step} element="phrasesHeader" />
                </div>
                <div className={`getid-phrases__content getid-animation${textMod === 'show' ? ' getid-visible_1' : ''}`}>
                  {phrases[activeLine]}
                </div>
              </div>
            </>
          )}
        </div>
      );
    }
  }
  class CameraFooter extends Component {
    componentWillMount() {
      rerenders.push(() => this.forceUpdate());
      rerenderPhrases.push(() => this.forceUpdate());
    }

    render() {
      if (!recording) {
        return (
          <Footer
            step={this.props.step}
            next={{
              onClick: async () => {
                await change(true);
                changeLine(0);
              },
            }}
            back={back}
          />
        );
      }
      const nextInfo = activeLine === phrases.length - 1
        ? {
          ...pr.next,
          onClick: async () => {
            await recorder.stopRecord();
            pr.next.onClick(recorder.getRecord);
          },
        }
        : { onClick: () => changeLine(activeLine + 1), translate: 'nextPhrase' };

      const backInfo = activeLine === 0
        ? back
        : { onClick: () => changeLine(activeLine - 1), translate: 'prevPhrase' };

      const { step } = this.props;
      return (

        <Footer
          step={step}
          next={nextInfo}
          back={backInfo}
          disableAnmation={activeLine > 0}
        />
      );
    }
  }
  CameraFooter.propTypes = {
    step: PropTypes.string.isRequired,
  };
  return {
    Camera: (props) => (
      props.isMobile
        ? (
          <Popup visible={props.visible}>
            <RecordingCamera {...pr} {...props} />
            <Phrases {...props} />
            <CameraFooter {...pr} {...props} />
          </Popup>
        )
        : (
          <>
            <RecordingCamera {...pr} {...props} />
            <Phrases {...props} />
          </>
        )
    ),
    CameraFooter: (props) => (props.isMobile ? null : <CameraFooter {...props} />),
  };
};
