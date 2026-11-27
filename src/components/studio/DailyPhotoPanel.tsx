import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { BellRing, Check, Copy, Download, ImageIcon, Loader2, Mail, RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dailyStudio } from '@/lib/studio/daily.functions';
import { PHOTO_TEMPLATES, photoTemplate, photoCaption } from '@/lib/studio/photo-catalog';
import { renderPhoto } from '@/lib/studio/photo-browser';
import { downloadBlob } from '@/lib/studio/archive';
import { useStudio } from './studio-context';

export function DailyPhotoPanel() {
  const { notify } = useStudio(); const run = useServerFn(dailyStudio); const cache = useQueryClient();
  const query = useQuery({ queryKey: ['daily-photo-studio'], queryFn: () => run({ data: { action: 'read' } }), retry: false });
  const [templateId, setTemplateId] = useState('graphic-design'); const t = photoTemplate(templateId);
  const [headline, setHeadline] = useState(t.headline); const [subhead, setSubhead] = useState(t.subhead);
  const [approved, setApproved] = useState(true); const canvas = useRef<HTMLCanvasElement>(null);
  const [blob, setBlob] = useState<Blob | null>(null); const [renderError, setRenderError] = useState(''); const [working, setWorking] = useState(false);
  const [recipient, setRecipient] = useState(''); const [senderDomain, setSenderDomain] = useState(''); const [enabled, setEnabled] = useState(true); const [brands, setBrands] = useState<string[]>(['academy', 'agency']);
  useEffect(() => { if (query.data) { setRecipient(query.data.config.recipient_email); setSenderDomain(query.data.config.sender_domain); setEnabled(query.data.config.enabled); setBrands(query.data.config.brand_ids); } }, [query.data?.config]);
  useEffect(() => { let active = true; setBlob(null); setRenderError(''); const element = canvas.current; if (!element) return;
    void renderPhoto(element, t, headline, subhead, approved).then(result => { if (active) setBlob(result); }).catch(error => { if (active) setRenderError(error instanceof Error ? error.message : 'Could not load photo.'); });
    return () => { active = false; };
  }, [t, headline, subhead, approved]);
  async function action(data: { action: 'today' } | { action: 'create'; templateId: string; headline: string; subhead: string; approved: boolean } | { action: 'settings'; recipient: string; senderDomain: string; enabled: boolean; brands: ('academy' | 'agency')[] } | { action: 'email'; id: string }) {
    setWorking(true);
    try { const result = await run({ data }); cache.setQueryData(['daily-photo-studio'], result);
      if (result.notification && !result.notification.sent) notify(`Flyer saved. ${result.notification.error ?? 'Email is pending.'}`);
      else notify(data.action === 'settings' ? 'Delivery settings saved' : result.notification?.sent ? 'Flyer saved and email accepted for delivery' : 'Today’s flyer is saved');
    } catch (error) { notify(error instanceof Error ? error.message : 'Could not finish. Please try again.', 'error'); }
    finally { setWorking(false); }
  }
  const caption = photoCaption({ ...t, headline, subhead });
  return <section className="studio-panel">
    <div className="studio-panel-head"><div><p className="studio-eyebrow"><ImageIcon size={14} /> Daily photo studio</p><h2>Ready for your next post.</h2></div><Button variant="outline" disabled={working || !query.data} onClick={() => void action({ action: 'today' })}><RefreshCw /> Create today’s flyer</Button></div>
    {query.isPending ? <p role="status"><Loader2 className="inline animate-spin" size={16} /> Loading private archive…</p> : null}
    {query.error ? <p className="studio-error" role="alert">{query.error.message}<Button variant="outline" onClick={() => void query.refetch()}>Retry</Button></p> : null}
    <div className="daily-template-grid" aria-label="Photo templates">{PHOTO_TEMPLATES.map(item => <Button key={item.id} variant="outline" className={`daily-template${templateId === item.id ? ' is-selected' : ''}`} aria-pressed={templateId === item.id} onClick={() => { setTemplateId(item.id); setHeadline(item.headline); setSubhead(item.subhead); setApproved(true); }}><img src={item.artwork} alt="" loading="lazy" /><span>{item.headline}</span></Button>)}</div>
    <div className="studio-flyer-layout"><div className="studio-flyer-preview"><div className="daily-photo-canvas"><canvas ref={canvas} aria-label="Photo flyer preview" /></div><p className="studio-canvas-meta">1080 × 1350 · Portrait</p>{renderError ? <p className="studio-error" role="alert">{renderError}</p> : !blob ? <p role="status">Preparing photo…</p> : null}</div>
      <div className="studio-flyer-controls"><div className="studio-chips"><Button variant="outline" aria-pressed={approved} onClick={() => { setApproved(true); setHeadline(t.headline); setSubhead(t.subhead); }}>Original photo design</Button><Button variant="outline" aria-pressed={!approved} onClick={() => setApproved(false)}>Edit photo version</Button></div>
        <label className="studio-field"><span>Headline</span><input disabled={approved} value={headline} maxLength={70} onChange={e => setHeadline(e.target.value)} /></label>
        <label className="studio-field"><span>Supporting line</span><textarea disabled={approved} value={subhead} maxLength={160} rows={3} onChange={e => setSubhead(e.target.value)} /></label>
        <label className="studio-field"><span>Caption</span><textarea value={caption} readOnly rows={8} /></label>
        <div className="studio-actions"><Button disabled={!blob} onClick={() => { if (blob) downloadBlob(blob, `ndh-${templateId}.png`); }}><Download /> Download PNG</Button><Button variant="outline" onClick={() => void navigator.clipboard.writeText(caption).then(() => notify('Caption copied')).catch(() => notify('Please select and copy the caption.', 'error'))}><Copy /> Copy caption</Button><Button variant="outline" disabled={working || !blob || !query.data} onClick={() => void action({ action: 'create', templateId, headline, subhead, approved })}>{working ? <Loader2 className="animate-spin" /> : <Save />} Save &amp; email me</Button></div>
      </div></div>
    <div className="daily-delivery"><div><p className="studio-eyebrow"><BellRing size={14} /> Morning delivery</p><h3>One flyer, every day at 8:00 AM.</h3><p>West Africa Time · Runs even when the studio is closed.</p><p className="studio-note">Photo templates use no AI generation credits. Cloud storage and email usage still apply. Islamic celebrations stay manual until their dates are confirmed.</p></div><div className="studio-flyer-controls">
      <label className="studio-field"><span>Send to</span><input type="email" value={recipient} onChange={e => setRecipient(e.target.value)} /></label>
      <label className="studio-field"><span>Verified email sender domain</span><input value={senderDomain} placeholder="Complete email setup, then enter the verified domain" onChange={e => setSenderDomain(e.target.value.trim().toLowerCase())} /></label>
      <label className="daily-check"><input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} /> Create a flyer each morning</label>
      <div className="flex flex-wrap gap-4">{['academy', 'agency'].map(brand => <label className="daily-check" key={brand}><input type="checkbox" checked={brands.includes(brand)} onChange={e => setBrands(e.target.checked ? [...brands, brand] : brands.filter(b => b !== brand))} /> {brand === 'academy' ? 'Academy' : 'Agency'}</label>)}</div>
      {!senderDomain ? <p className="studio-note" role="status">Flyers can be created now. Email delivery is waiting for a verified sender domain.</p> : null}
      <Button variant="outline" disabled={working || !query.data || !brands.length || !recipient} onClick={() => void action({ action: 'settings', recipient, senderDomain, enabled, brands: brands as ('academy' | 'agency')[] })}><Check /> Save delivery settings</Button>
    </div></div>
    <div className="studio-panel-head"><div><p className="studio-eyebrow">Private cloud archive</p><h3>Your latest flyers</h3></div></div>
    <div className="daily-archive">{query.data?.flyers.length === 0 ? <p>No saved flyers yet.</p> : null}{query.data?.flyers.map(row => <article className="daily-archive-item" key={row.id}>{row.downloadUrl ? <img src={row.downloadUrl} alt={row.headline} loading="lazy" /> : <ImageIcon size={24} />}<div><strong>{row.headline}</strong><p>{row.day} · {row.state === 'ready' ? 'Saved' : row.state === 'failed' ? 'Creation failed' : 'Creating'}</p><p>{row.email_state === 'sent' ? 'Email accepted for delivery' : row.email_state === 'failed' ? 'Email needs attention' : 'Email pending'}</p><div className="studio-actions">{row.downloadUrl ? <Button asChild variant="outline" size="sm"><a href={row.downloadUrl} download><Download /> Download</a></Button> : null}<Button variant="outline" size="sm" onClick={() => void navigator.clipboard.writeText(row.caption).then(() => notify('Saved caption copied'))}><Copy /> Caption</Button><Button variant="outline" size="sm" disabled={working || row.state !== 'ready' || row.email_state === 'sent'} onClick={() => void action({ action: 'email', id: row.id })}><Mail /> Email</Button></div></div></article>)}</div>
  </section>;
}