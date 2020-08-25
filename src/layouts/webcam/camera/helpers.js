const frameRenderer = (webcam, {
  left, right, top, bottom,
}) => (callback) => {
  const additionalVOffset = top * 0.1;
  const additionalHOffset = left * 0.1;

  const t = top - additionalVOffset;
  const l = left - additionalHOffset;
  const r = right + additionalHOffset;
  const b = bottom + additionalVOffset;

  const canvas = document.createElement('canvas');
  canvas.width = r - l;
  canvas.height = b - t;
  const context = canvas.getContext('2d');

  context.drawImage(webcam,
    l,
    t,
    r - l,
    b - t,
    0, 0, canvas.width, canvas.height);
  canvas.toBlob(callback, 'image/jpeg', 1.0);
};

export default frameRenderer;
