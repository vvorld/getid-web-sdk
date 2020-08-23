import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const Form = () => (
  <>
    <h3>Flow</h3>
    <div className="step">
      <label>
        <input type="checkbox" />
        Form
      </label>
    </div>
  </>
);

//       label: 'Date of expiry',
//       type: 'date',
//       value: '1991-08-15',
//       name: 'Date of expiry',
//       required: true,
//       hidden: true,
//
//     },

class ConfigPanel extends Component {
  render() {
    const config = {};
    return (
      <div>
        <Form />
        <div className="step">
          <label>
            <input type="checkbox" />
            Recording
          </label>
        </div>
        <div className="step">
          <label>
            <input type="checkbox" />
            Document
          </label>
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

        </div>
        <div className="step">

          <label>
            <input type="checkbox" />
            Selfie
          </label>
        </div>
        <div className="step">

          <label>
            <input type="checkbox" />
            Form Prefill
          </label>
        </div>
        <div className="step">

          <label>
            <input type="checkbox" />
            Thank you
          </label>
        </div>
        <div>
          <textarea>{JSON.stringify(config)}</textarea>
        </div>
        <div>
          <button>Try</button>
        </div>

      </div>
    );
  }
}

// eslint-disable-next-line react/no-render-return-value
export default (id) => ReactDOM.render(
  <ConfigPanel />,
  document.getElementById(id),
);
