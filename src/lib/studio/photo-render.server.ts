import * as PImage from 'pureimage';
import * as opentype from 'opentype.js';
import { Readable, Writable } from 'node:stream';
import { PHOTO_FONTS, PHOTO_GATEWAY, type PhotoTemplate } from './photo-catalog';
import { paintPhotoFlyer, type PhotoContext } from './photo-layout';

async function bytes(url: string, origin: string) {
  const response = await fetch(new URL(url, origin));
  if (!response.ok) throw new Error(`Photo asset unavailable (${response.status}).`);
  return new Uint8Array(await response.arrayBuffer());
}
async function jpeg(url: string, origin: string) { return PImage.decodeJPEGFromStream(Readable.from([await bytes(url, origin)])); }
export async function renderServerPhoto(t: PhotoTemplate, headline: string, subhead: string, approved: boolean, origin: string) {
  if (approved) return { bytes: await bytes(t.artwork, origin), extension: 'jpg', mime: 'image/jpeg' };
  const fonts = await Promise.all(PHOTO_FONTS.map(url => bytes(url, origin)));
  fonts.forEach((data, i) => {
    const weight = [400, 700, 800][i] ?? 400;
    const registered = PImage.registerFont('', 'NDHPhoto', weight);
    registered.font = opentype.parse(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer); registered.loaded = true;
  });
  const [photo, logo] = await Promise.all([jpeg(t.photo, origin), bytes(PHOTO_GATEWAY, origin).then(data => PImage.decodePNGFromStream(Readable.from([data])))]);
  const bitmap = PImage.make(1080, 1350); const ctx = bitmap.getContext('2d');
  paintPhotoFlyer(ctx as unknown as PhotoContext, t, headline, subhead,
    () => { const h = photo.height * 1080 / photo.width; ctx.drawImage(photo, 0, 500 - (h - 520) / 2, 1080, h); },
    () => ctx.drawImage(logo, 40, 20, 128, 128));
  const chunks: Buffer[] = []; const stream = new Writable({ write(chunk, _encoding, next) { chunks.push(Buffer.from(chunk)); next(); } });
  await PImage.encodeJPEGToStream(bitmap, stream, 92);
  return { bytes: new Uint8Array(Buffer.concat(chunks)), extension: 'jpg', mime: 'image/jpeg' };
}