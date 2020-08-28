/* eslint-disable max-classes-per-file */
import React, { Component, useState, useEffect } from 'react';
import Api from './api';
import VideoClient from './client';
import Footer from '~/components/blocks/footer/footer';
import Popup from '~/components/popup';
import './record.css';

const normalizeNumber = (n) => (n < 10 ? `0${n}` : `${n}`);
const Timer = () => {
  const [time, updateTime] = useState(0);
  useEffect(() => {
    setTimeout(
      () => updateTime(time + 1),
      1000,
    );
  });
  return (
    <div className="getid-timer_contaner">
      <div className="getid-timer_dot" />
      {`${normalizeNumber(Math.round(time / 60))}:${normalizeNumber(Math.round(time % 60))}`}
    </div>
  );
};

export const TextLinesFooter = ({
  next, back, phrases, step,
}) => {
  const [activeLine, setActiveLine] = useState(0);
  const [textMod, setTextMod] = useState('show');
  const changeLine = (newValue) => {
    setTextMod('hide');

    setTimeout(() => {
      setTextMod('show');
      setActiveLine(newValue);
    }, 600);
  };

  const nextInfo = activeLine === phrases.length - 1
    ? next
    : { onClick: () => changeLine(activeLine + 1), text: 'next string' };

  const backInfo = activeLine === 0
    ? back
    : { onClick: () => changeLine(activeLine - 1), text: 'previous string' };

  return (
    <div>
      {activeLine < phrases.length && (
        <>
          <div style={{
            background: '#7861A2',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            fontSize: '1.6em',
            marginTop: '-25px',
            borderRadius: '5px',
            position: 'relative',

          }}
          >

            <div style={{
              color: 'white',
              padding: '20px',
              borderRadius: '15px',
            }}
            >
              <div style={{ fontSize: '0.8em' }}>Please speak it: </div>
              <div style={{
                fontWeight: 'bold',
                marginTop: '20px',
                transition: 'opacity 0.6s',
                opacity: textMod === 'hide' ? 0 : 1,
              }}
              >
                {phrases[activeLine]}
              </div>
            </div>
          </div>
        </>
      )}
      <Footer
        step={step}
        next={nextInfo}
        back={backInfo}
      />
    </div>
  );
};

export default (pr) => {
  let recording = false;
  const { back, phrases } = pr;
  const api = new Api(pr.server);
  const client = new VideoClient(api);

  const rerenders = [];
  const change = (rec, fin) => {
    if (!recording && rec) {
      client.startRecord();
    }
    recording = rec;
    if (fin) {
      client.stop();
      pr.next.onClick(api.loadRecord);
      return;
    }
    for (const r of rerenders) {
      r();
    }
  };

  class WebRTCCamera extends Component {
    componentWillMount() {
      rerenders.push(() => this.forceUpdate());
    }

    componentWillUnmount() {
      this.stop();
    }

    setSrc = async (el) => {
      if (el) {
        await client.start();
        client.setEl(el);
        this.props.onReady(this.stop);
      }
    }

    stop = async () => {
      await client.stop();
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
          >
            <track kind="captions" />
          </video>
        </div>
      );
    }
  }

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
  return {
    Camera: (props) => (
      props.isMobile
        ? (
          <Popup visible={props.visible}>
            <WebRTCCamera {...pr} {...props} />
          </Popup>
        )
        : <WebRTCCamera {...pr} {...props} />
    ),
    CameraFooter: (props) => (props.isMobile ? null : <CameraFooter {...props} />), // ,
  };
};

/* const iceServers = [
  { urls: 'stun:stun.getid.dev:3478' },
  {
    urls: 'turn:stun.getid.dev:3478',
    username: 'getid',
    credential: 'aA123456',
  },
]; */
