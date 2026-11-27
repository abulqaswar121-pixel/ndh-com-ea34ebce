import { PHOTO_FONTS, PHOTO_GATEWAY, type PhotoTemplate } from './photo-catalog';
import { paintPhotoFlyer } from './photo-layout';
async function image(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => { const img = new Image(); img.crossOrigin = 'anonymous'; img.onload = () => resolve(img); img.onerror = () => reject(new Error('Photo could not load. Please try again.')); img.src = src; });
}
export async function renderPhoto(canvas: HTMLCanvasElement, t: PhotoTemplate, headline: string, subhead: string, approved: boolean) {
  canvas.width = 1080; canvas.height = 1350;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Image drawing is unavailable.');
  if (approved) { const img = await image(t.artwork); ctx.drawImage(img, 0, 0, 1080, 1350); }
  else {
    await Promise.all(PHOTO_FONTS.map(async (url, i) => { const weight = [400, 700, 800][i] ?? 400; const font = new FontFace(`NDHPhoto${weight}`, `url(${url})`, { weight: String(weight) }); await font.load(); document.fonts.add(font); }));
    const [photo, logo] = await Promise.all([image(t.photo), image(PHOTO_GATEWAY)]);
    paintPhotoFlyer(ctx, t, headline, subhead, () => { const h = photo.height * 1080 / photo.width; ctx.drawImage(photo, 0, 500 - (h - 520) / 2, 1080, h); }, () => ctx.drawImage(logo, 40, 20, 128, 128));
  }
  return new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not export flyer.')), 'image/png'));
}