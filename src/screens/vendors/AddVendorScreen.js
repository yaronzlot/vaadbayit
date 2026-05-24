import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vendorsService } from '../../services/firebaseService';
import { Button, Input, ScreenHeader, Select } from '../../components/UI';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';

export default function AddVendorScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', trade: 'אינסטלטור', notes: '' });
  const [loading, setLoading] = useState(false);
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone) { alert('נא למלא שם וטלפון'); return; }
    try {
      setLoading(true);
      await vendorsService.add({ ...form, buildingId: user.buildingId });
      navigate('/vendors');
    } catch { alert('שגיאה בשמירה'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background }}>
      <ScreenHeader title="הוספת ספק" onBack={() => navigate('/vendors')} />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: SPACING.md }}>
        <div style={{ background: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.lg, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <Input label="שם הספק *" value={form.name} onChangeText={v => update('name', v)} placeholder="שם מלא / חברה" icon="person-outline" />
          <Input label="טלפון *" value={form.phone} onChangeText={v => update('phone', v)} type="tel" placeholder="050-0000000" icon="call-outline" />
          <Input label="אימייל" value={form.email} onChangeText={v => update('email', v)} type="email" placeholder="vendor@email.com" icon="mail-outline" />
          <Select label="תחום מקצועי" value={form.trade} onChange={v => update('trade', v)} options={['אינסטלטור','חשמלאי','מעלית','גינון','ניקיון','אחר'].map(t => ({ value: t, label: t }))} />
          <div style={{ marginBottom: SPACING.md }}>
            <label style={{ display: 'block', fontSize: 13, color: COLORS.textSecondary, marginBottom: 6, fontWeight: 500 }}>הערות</label>
            <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={3} placeholder="הערות נוספות..." style={{ width: '100%', padding: 14, borderRadius: RADIUS.md, border: `1.5px solid ${COLORS.border}`, fontSize: 15, color: COLORS.text, direction: 'rtl', resize: 'vertical', outline: 'none', fontFamily: 'Heebo, Arial, sans-serif', background: COLORS.surface }} />
          </div>
          <Button title="הוסף ספק" onClick={handleSubmit} loading={loading} icon="add-circle" />
        </div>
      </div>
    </div>
  );
}
