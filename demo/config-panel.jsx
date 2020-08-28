import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { init, createPublicTokenProvider } from '../src/index';
import defConfig from './config';

const StepHeader = ({
  label, enable, setOpen, onChange,
}) => (
  <div style={{ display: 'flex' }}>
    <label style={{ flexGrow: 1, cursor: 'pointer' }}>
      <input type="checkbox" checked={enable} onClick={() => onChange(!enable)} />
      {label}
    </label>
    <span style={{ color: 'blue', cursor: 'pointer' }}> [settings]</span>
  </div>
);

const Form = ({ enable, onChange }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="step">
      <StepHeader label="Profile" enable={enable} onChange={onChange} setOpen={setOpen} />
    </div>
  );
};
const Recording = ({ enable, onChange }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="step">
      <StepHeader label="Record" enable={enable} onChange={onChange} setOpen={setOpen} />
    </div>
  );
};
const Liveness = ({ enable, onChange }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="step">
      <StepHeader label="Liveness" enable={enable} onChange={onChange} setOpen={setOpen} />
    </div>
  );
};
const Selfie = ({ enable, onChange }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="step">
      <StepHeader label="Selfie" enable={enable} onChange={onChange} setOpen={setOpen} />
    </div>
  );
};
const ThankYou = ({ enable, onChange }) => (
  <div className="step">
    <label>
      <input type="checkbox" checked={enable} onClick={() => onChange(!enable)} />
      Thank You
    </label>
  </div>
);
const DocumentPhoto = ({ enable, onChange }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="step">
      <StepHeader label="Document" enable={enable} onChange={onChange} setOpen={setOpen} />
      {isOpen
        ? (
          <div className="subsettings">
            <div>
              <label>
                <input type="checkbox" />
                Rules
              </label>
            </div>
            <div>

              <label>
                <input type="checkbox" />
                Interactive
              </label>
            </div>
            <div>

              <label>
                <input type="checkbox" />
                EnableCheckPhoto
              </label>
            </div>
            <div>
              <input type="text" value="ee" placeholder="country" />

            </div>
            <div>
              <select>
                <option value="" />
                <option value="residence-permit">residence-permit</option>
                <option value="id-card">id-card</option>
                <option value="passport">passport</option>
              </select>
            </div>
          </div>
        )
        : null}
    </div>
  );
};

const defaultConfig = () => {
  try {
    // You can use custom.js for customising config object
    // Example:
    //
    // export default {
    //   apiUrl: 'http://localhost:3001',
    //   apiKey: '1231223',
    // };

    // eslint-disable-next-line global-require
    const custom = require('./custom.js').default;
    return { ...defConfig, ...custom };
  } catch (e) {
    console.log(`Error: ${e}`);
  }
  return { ...defConfig };
};
const getFromStorage = (name, def) => {
  try {
    return JSON.parse(window.localStorage.getItem(name));
  } catch (e) {
    return def;
  }
};
class ConfigPanel extends Component {
  constructor(props) {
    super(props);
    const defaultCfg = defaultConfig();
    const flow = getFromStorage('flow_config', null);
    this.state = {
      defaultCfg,
      customerId: Math.floor(Math.random() * 1000000),
      flow: flow || Object.assign({}, ...defaultCfg.flow.map((x) => ({ [x.component]: true }))),
    };
  }

  try = () => {
    const { customerId } = this.state;
    const config = this.generateConfig();
    const tokenProvider = createPublicTokenProvider(config.apiUrl, config.apiKey, customerId);
    init(config, tokenProvider);
  }

  generateConfig = () => {
    const { defaultCfg, flow } = this.state;
    const cfg = { ...defaultCfg };
    cfg.flow = cfg.flow.filter((x) => flow[x.component]);
    return cfg;
  }

  setFlow = (name, enable) => {
    const currFlow = this.state.flow;
    const flow = { ...currFlow, [name]: enable };
    window.localStorage.setItem('flow_config', JSON.stringify(flow));
    this.setState({ flow });
  }

  render() {
    const { flow } = this.state;
    const config = this.generateConfig();
    return (
      <>
        <div className="controls_container">
          <div>Flow</div>
          <hr />
          <Form enable={flow.Form} onChange={(value) => this.setFlow('Form', value)} />
          <DocumentPhoto enable={flow.DocumentPhoto} onChange={(value) => this.setFlow('DocumentPhoto', value)} />
          <Recording enable={flow.Record} onChange={(value) => this.setFlow('Record', value)} />
          <Liveness enable={flow.Liveness} onChange={(value) => this.setFlow('Liveness', value)} />
          <Selfie enable={flow.Selfie} onChange={(value) => this.setFlow('Selfie', value)} />
          <ThankYou enable={flow.ThankYou} onChange={(value) => this.setFlow('ThankYou', value)} />
          <br />
          <div>Config</div>
          <hr />
          <div>
            <code>{JSON.stringify(config, null, 2)}</code>
          </div>

        </div>
        <button className="try_button" onClick={this.try}>>></button>
      </>
    );
  }
}

// eslint-disable-next-line react/no-render-return-value
export default (id) => ReactDOM.render(
  <ConfigPanel />,
  document.getElementById(id),
);
