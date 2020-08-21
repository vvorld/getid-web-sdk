import React, { Component, useState, useEffect } from 'react';
import Api from './api';
import VideoClient from './client';
import Footer from '../../../components/blocks/footer/footer';

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
    <div style={{
      position: 'absolute', top: '10px', padding: '10px', borderRadius: '15px', color: 'white', left: '10px', background: 'red',
    }}
    >
      <div style={{
        marginRight: '5px', background: 'white', borderRadius: '50%', display: 'inline-block', width: '10px', height: '10px',
      }}
      />
      {`${normalizeNumber(Math.round(time / 60))}:${normalizeNumber(Math.round(time % 60))}`}
    </div>
  );
};

export const TextLinesFooter = ({ next, back, phrases }) => {
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
        next={nextInfo}
        back={backInfo}
      />
    </div>
  );
};

export default (pr) => {
  let recording = false;
  let finish = false;
  const { next, back, phrases } = pr;

  const rerenders = [];
  const change = (rec, fin) => {
    console.log(rec, fin);
    recording = rec;
    finish = fin;
    for (const r of rerenders) {
      r();
    }
  };
  const api = new Api(pr.server);
  const client = new VideoClient(api);

  class WebRTCCamera extends Component {
    componentWillMount() {
      console.log(2);

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
    constructor(props) {
      super(props);
    }

    componentWillMount() {
      rerenders.push(() => this.forceUpdate());
    }

    render() {
      if (recording) {
        return (
          <TextLinesFooter
            phrases={phrases}
            next={{
              onClick: () => change(false, true),
              text: 'Finish record',
            }}
            back={back}
          />
        );
      }
      if (finish) {
        return (
          <Footer
            next={{
              onClick: async () => {
                this.stop();
                next.onClick(this.api.loadRecord);
              },
              text: next.text,
            }}
            back={{ onClick: () => change(recording, false) }}
          />
        );
      }
      return (
        <Footer
          next={{ onClick: () => change(true, false), text: 'Start record' }}
          back={back}
        />
      );
    }
  }
  return {
    Camera: () => <WebRTCCamera {...pr} />,
    CameraFooter: () => <CameraFooter />,
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
