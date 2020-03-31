import { getScriptLink } from './services/api';

export const launcher = async (url, key) => {
  const { scriptLink } = await getScriptLink(url, key);
  if (!scriptLink) {
    throw new Error('Script link is missing.');
  }
  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.src = scriptLink;
  document.getElementsByTagName('head')[0].appendChild(script);
};
