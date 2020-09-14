/* eslint-disable max-classes-per-file */
import React, { Component } from 'react';

import Footer from '~/components/blocks/footer';
import Header from '~/components/blocks/header/header';

import './record.css';

import Timer from './timer';
import Translate from '~/components/blocks/translations';
import CombineRecorder from './recorder';

export default (pr) => {
  let recording = false;
  const {
    back, phrases, server, onError, onReady,
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
    rerenderPhrases.forEach((r) => r());
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
      await recorder.stopRecord();
    }

    render() {
      return (
        <div className="record_camera">
          {recording && <Timer />}
          <video
            style={{ transform: 'scale(-1, 1)' }}
            width="100%"
            playsInline
            ref={this.setSrc}
            muted
            autoPlay
          />
          <Phrases {...this.props} />
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
              <div className={`getid-phrases__container${!visible ? ' getid-phrases_begin' : ''}`}>
                <div className="getid-phrases__content">
                  <div className="getid-phrases__title">
                    <Translate step="Recording_recording" element="phrasesHeader" />
                  </div>
                  <div className={`getid-animation${textMod === 'show' ? ' getid-visible_1' : ''}`}>
                    {phrases[activeLine]}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      );
    }
  }
  class CameraHeader extends Component {
    componentWillMount() {
      rerenders.push(() => this.forceUpdate());
    }

    render() {
      if (!recording) {
        return <Header step="Recording_record" />;
      }
      return <Header step="Recording_recording" />;
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
            step="Recording_record"
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
          translate: 'lastPhrase',
          onClick: async () => {
            await recorder.stopRecord();
            pr.next.onClick(recorder.getRecord);
          },
        }
        : { onClick: () => changeLine(activeLine + 1), translate: 'nextPhrase' };

      const backInfo = activeLine === 0
        ? back
        : { onClick: () => changeLine(activeLine - 1), translate: 'prevPhrase' };

      return (

        <Footer
          step="Recording_recording"
          next={nextInfo}
          back={backInfo}
          disableAnimation={activeLine > 0}
        />
      );
    }
  }
  return {
    Camera: (props) => (
      <>
        <RecordingCamera {...pr} {...props} />
      </>
    ),
    CameraHeader,
    CameraFooter,
  };
};
