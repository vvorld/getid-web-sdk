const cameraEnable = (flow) => flow.some((view) => ['Selfie', 'DocumentPhoto', 'IdCaptureBack', 'Liveness', 'Record'].includes(view.component));

export const cameraAchievable = (options) => {
  if (!cameraEnable(options.flow)) {
    return true;
  }
  const isIOSChrome = navigator.userAgent.match('CriOS');
  return ((navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) && !isIOSChrome);
};

export const cameraExist = async (options) => {
  if (!cameraEnable(options.flow)) {
    return true;
  }
  const divices = await navigator.mediaDevices.enumerateDevices();
  return !!(divices && divices.find((x) => x.kind === 'videoinput'));
};
