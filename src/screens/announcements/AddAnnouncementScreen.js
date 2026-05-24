import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { announcementsService } from '../../services/firebaseService';
import { Button, Input, ScreenHeader, Select } from '../../components/UI';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';

export default function AddAnnouncementScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', body: '', category: 'כללי' });
  const [loading, setLoading] = useState(false);
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title || !form.body) { alert('נא למלא כותרת ותוכן'); return; }
    try {
      setLoading(true);
      await announcementsService.add({ ...form, buildingId: user.buildingId, authorName: user.name });
      navigate('/announcements');
    } catch (e) { alert('שגיאה בשמירה'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background }}>
      <ScreenHeader title="הודעה חדשה" onBack={() => navigate('/announcements')} />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: SPACING.md }}>
        <div style={{ background: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.lg, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <Input label="כותרת *" value={form.title} onChangeText={v => update('title', v)} placeholder="כותרת ההודעה" icon="megaphone-outline" />
          <Select label="קטגוריה" value={form.category} onChange={v => update('category', v)} options={['כללי', 'תחזוקה', 'דחוף', 'אירועים'].map(c => ({ value: c, label: c }))} />
          <div style={{ marginBottom: SPACING.md }}>
            <label style={{ display: 'block', fontSize: 13, color: COLORS.textSecondary, marginBottom: 6, fontWeight: 500 }}>תוכן ההודעה *</label>
            <textarea value={form.body} onChange={e => update('body', e.target.value)} rows={6} placeholder="כתוב את תוכן ההודעה כאן..." style={{ width: '100%', padding: 14, borderRadius: RADIUS.md, border: `1.5px solid ${COLORS.border}`, fontSize: 15, color: COLORS.text, direction: 'rtl', resize: 'vertical', outline: 'none', fontFamily: 'Heebo, Arial, sans-serif', background: COLORS.surface }} />
          </div>
          <Button title="פרסם הודעה" onClick={handleSubmit} loading={loading} icon="megaphone" />
        </div>
      </div>
    </div>
  );
}
