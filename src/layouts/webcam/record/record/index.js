/* eslint-disable max-classes-per-file */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Footer from '~/components/blocks/footer/footer';
import Popup from '~/components/popup';
import './record.css';

import Timer from './timer';
import TextLinesFooter from './text-footer';
import CombineRecorder from './recorder';

export default (pr) => {
  let recording = false;
  const {
    back, phrases, server, onError, onReady,
  } = pr;

  const recorder = new CombineRecorder(server);
  const rerenders = [];
  const change = async (rec, fin) => {
    if (!recording && rec) {
      await recorder.startRecord();
    }
    recording = rec;
    if (fin) {
      await recorder.stopRecord();
      pr.next.onClick(recorder.getRecord);
      return;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const r of rerenders) {
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

  RecordingCamera.propTypes = {
    onReady: PropTypes.func.isRequired,
  };

  class CameraFooter extends Component {
    componentWillMount() {
      rerenders.push(() => this.forceUpdate());
    }

    render() {
      if (recording) {
        return (
          <TextLinesFooter
            step={this.props.step}
            phrases={phrases}
            next={{
              onClick: () => change(false, true),
              text: 'Finish record',
            }}
            back={back}
          />
        );
      }

      return (
        <Footer
          step={this.props.step}
          next={{ onClick: () => change(true, false), text: 'Start record' }}
          back={back}
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
            <CameraFooter {...props} />
          </Popup>
        )
        : <RecordingCamera {...pr} {...props} />
    ),
    CameraFooter: (props) => (props.isMobile ? null : <CameraFooter {...props} />),
  };
};
