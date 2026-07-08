export function createWatermarkDataUrl(text, opts = {}) {
  const font = opts.font || 'bold 20px system-ui, Arial';
  const rotate = opts.rotate ?? -25; // degrees
  const padding = opts.padding ?? 30;
  const color = opts.color || 'rgba(255,255,255,0.18)';

  // create a canvas sized to hold rotated text
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(parseInt(font.match(/(\d+)px/)?.[1] || 20, 10));

  const w = textWidth + padding * 2;
  const h = textHeight + padding * 2;
  canvas.width = w;
  canvas.height = h;

  // draw text centered
  ctx.clearRect(0, 0, w, h);
  ctx.translate(w / 2, h / 2);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = font;
  ctx.fillText(text, 0, 0);

  return canvas.toDataURL('image/png');
}
