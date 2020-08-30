import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Footer from '~/components/blocks/footer/footer';

const TextLinesFooter = ({
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

TextLinesFooter.propTypes = {
  next: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
  phrases: PropTypes.array.isRequired,
  step: PropTypes.string.isRequired,
};
export default TextLinesFooter;
