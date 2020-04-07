import { getScriptLink } from './services/api';
import { createPublicTokenProvider } from './index';

const init = async (cfg, token) => {
  const { scriptLink } = await getScriptLink(cfg.apiUrl, cfg.apiKey);
  if (!scriptLink) {
    throw new Error('Script link is missing.');
  }
  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.src = scriptLink;

  document.getElementsByTagName('body')[0].appendChild(script);

  script.onload = () => {
    if (window.getidWebSdk) {
      window.getidWebSdk.init(cfg, token);
    }
  };
};

export { init, createPublicTokenProvider };
