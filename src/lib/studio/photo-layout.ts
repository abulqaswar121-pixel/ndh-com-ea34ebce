import { PHOTO_PALETTE as P, type PhotoTemplate } from './photo-catalog';

// A narrow canvas contract shared by browser Canvas and the pure-JS server renderer.
export type PhotoContext = Pick<CanvasRenderingContext2D, 'fillStyle' | 'strokeStyle' | 'lineWidth' | 'font' | 'textAlign' | 'fillRect' | 'fillText' | 'measureText' | 'beginPath' | 'moveTo' | 'lineTo' | 'closePath' | 'stroke' | 'fill' | 'arc'>;
function text(ctx: PhotoContext, value: string, x: number, y: number, width: number, size: number, maxLines: number, color: string, weight = 800) {
  let lines: string[] = [];
  for (; size >= 18; size -= 2) {
    ctx.font = `${weight} ${size}px NDHPhoto${weight}`;
    lines = []; let line = '';
    for (const word of value.split(/\s+/)) {
      const next = line ? line + ' ' + word : word;
      if (ctx.measureText(next).width > width && line) { lines.push(line); line = word; } else line = next;
    }
    if (line) lines.push(line);
    if (lines.length <= maxLines && lines.every(l => ctx.measureText(l).width <= width)) break;
  }
  ctx.fillStyle = color;
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * size * 1.12));
}
export function paintPhotoFlyer(ctx: PhotoContext, t: PhotoTemplate, headline: string, subhead: string, drawPhoto: () => void, drawLogo: () => void) {
  ctx.fillStyle = P.navy; ctx.fillRect(0, 0, 1080, 1350);
  drawPhoto();
  ctx.fillStyle = P.navy; ctx.fillRect(0, 0, 1080, 172);
  drawLogo();
  text(ctx, 'NAJEEB DIGITAL HUB', 192, 64, 800, 25, 1, P.muted, 400);
  text(ctx, t.name.toUpperCase(), 192, 120, 820, 52, 1, P.white);
  // Integrated sector badge, never replacing or redrawing the Gateway mark.
  ctx.fillStyle = P.blue; ctx.beginPath(); ctx.arc(147, 40, 24, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = P.white; ctx.lineWidth = 3; ctx.beginPath();
  if (t.brandId === 'academy') { ctx.moveTo(130, 38); ctx.lineTo(147, 29); ctx.lineTo(164, 38); ctx.lineTo(147, 47); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(137, 43); ctx.lineTo(137, 52); ctx.lineTo(157, 52); ctx.lineTo(157, 43); ctx.stroke(); }
  else { ctx.moveTo(139, 30); ctx.lineTo(131, 40); ctx.lineTo(139, 50); ctx.moveTo(155, 30); ctx.lineTo(163, 40); ctx.lineTo(155, 50); ctx.stroke(); }
  ctx.fillStyle = P.paper; ctx.fillRect(0, 172, 1080, 328);
  text(ctx, headline, 52, 262, 975, 88, 2, P.navy);
  text(ctx, subhead, 54, 424, 970, 37, 2, P.navy, 400);
  ctx.fillStyle = P.navy; ctx.fillRect(0, 1020, 1080, 330);
  t.bullets.slice(0, 3).forEach((b, i) => {
    const x = 44 + i * 350;
    ctx.fillStyle = P.blue; ctx.beginPath(); ctx.arc(x + 16, 1072, 15, 0, Math.PI * 2); ctx.fill();
    text(ctx, b, x + 45, 1076, 270, 28, 2, P.white, 700);
  });
  ctx.fillStyle = P.blue; ctx.fillRect(140, 1160, 800, 82);
  ctx.textAlign = 'center'; text(ctx, t.cta, 540, 1216, 740, 36, 1, P.white, 800);
  text(ctx, t.url.replace('https://', ''), 540, 1300, 970, 28, 1, P.white, 700); ctx.textAlign = 'left';
}