import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

type Availability = 'available' | 'limited' | 'unavailable';

export function TalentProfileEditor() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [vetting, setVetting] = useState<string>('pending');
  const [form, setForm] = useState({
    headline: '',
    bio: '',
    skills: '',
    hourly_rate: '',
    currency: 'NGN',
    availability: 'available' as Availability,
  });

  useEffect(() => {
    if (!user) return;
    let active = true;
    void (async () => {
      const { data } = await (supabase as any)
        .from('talent_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!active) return;
      if (data) {
        setForm({
          headline: data.headline ?? '',
          bio: data.bio ?? '',
          skills: (data.skills ?? []).join(', '),
          hourly_rate: data.hourly_rate == null ? '' : String(data.hourly_rate),
          currency: data.currency ?? 'NGN',
          availability: (data.availability ?? 'available') as Availability,
        });
        setVetting(data.vetting_status ?? 'pending');
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setNotice('');
    const payload = {
      user_id: user.id,
      headline: form.headline.trim() || null,
      bio: form.bio.trim() || null,
      skills: form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
      currency: form.currency,
      availability: form.availability,
    };
    const { error } = await (supabase as any)
      .from('talent_profiles')
      .upsert(payload, { onConflict: 'user_id' });
    setSaving(false);
    setNotice(error ? error.message : 'Profile saved.');
  }

  if (loading) return <div className="empty-card">Loading your profile…</div>;

  return (
    <form className="auth-form" onSubmit={save}>
      <p className="admin-note">Vetting status: {vetting}</p>
      <label>
        Headline
        <input
          value={form.headline}
          placeholder="Senior brand designer"
          onChange={(e) => setForm({ ...form, headline: e.target.value })}
        />
      </label>
      <label>
        About you
        <textarea
          value={form.bio}
          placeholder="A short summary of your experience and the work you do best."
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </label>
      <label>
        Skills (separate with commas)
        <input
          value={form.skills}
          placeholder="Branding, Figma, Webflow"
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
        />
      </label>
      <label>
        Hourly rate
        <input
          type="number"
          min="0"
          step="500"
          value={form.hourly_rate}
          onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
        />
      </label>
      <label>
        Currency
        <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
          <option value="NGN">NGN</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
        </select>
      </label>
      <label>
        Availability
        <select
          value={form.availability}
          onChange={(e) => setForm({ ...form, availability: e.target.value as Availability })}
        >
          <option value="available">Available for work</option>
          <option value="limited">Limited availability</option>
          <option value="unavailable">Not available</option>
        </select>
      </label>
      <button className="button" disabled={saving}>
        {saving ? 'Saving…' : 'Save profile'}
      </button>
      {notice && <p>{notice}</p>}
    </form>
  );
}
