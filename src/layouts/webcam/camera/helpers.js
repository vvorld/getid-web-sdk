const frameRenderer = (webcam, width, height) => (callback) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(webcam, 0, 0);
  canvas.toBlob(callback, 'image/jpeg', 1.0);
};

export default frameRenderer;
