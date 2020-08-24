const frameRenderer = (webcam, {
  left, right, top, bottom,
}) => (callback) => {
  const canvas = document.createElement('canvas');
  canvas.width = right - left;
  canvas.height = bottom - top;
  const context = canvas.getContext('2d');

  const additionalVOffset = top * 0.1;
  const additionalHOffset = left * 0.1;
  context.drawImage(webcam,
    left - additionalHOffset,
    top - additionalVOffset,
    right - left + 2 * additionalHOffset,
    bottom - top + 2 * additionalVOffset,
    0, 0, canvas.width, canvas.height);
  canvas.toBlob(callback, 'image/jpeg', 1.0);
};

export default frameRenderer;
