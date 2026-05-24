import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { maintenanceService } from '../../services/firebaseService';
import { Button, Input, ScreenHeader, Select } from '../../components/UI';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';

export default function AddMaintenanceScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', location: '', priority: 'medium' });
  const [loading, setLoading] = useState(false);
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title || !form.location) { alert('נא למלא כותרת ומיקום'); return; }
    try {
      setLoading(true);
      await maintenanceService.add({ ...form, buildingId: user.buildingId, apartment: user.apartment || '', reportedBy: user.name });
      navigate('/maintenance');
    } catch { alert('שגיאה בשמירה'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background }}>
      <ScreenHeader title="דיווח תקלה" onBack={() => navigate('/maintenance')} />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: SPACING.md }}>
        <div style={{ background: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.lg, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <Input label="כותרת התקלה *" value={form.title} onChangeText={v => update('title', v)} placeholder="תאור קצר של התקלה" icon="construct-outline" />
          <Input label="מיקום *" value={form.location} onChangeText={v => update('location', v)} placeholder="כניסה ראשית, חניה, גג..." icon="location-outline" />
          <Select label="עדיפות" value={form.priority} onChange={v => update('priority', v)} options={[{ value: 'low', label: 'נמוך' }, { value: 'medium', label: 'בינוני' }, { value: 'high', label: 'דחוף' }]} />
          <div style={{ marginBottom: SPACING.md }}>
            <label style={{ display: 'block', fontSize: 13, color: COLORS.textSecondary, marginBottom: 6, fontWeight: 500 }}>תיאור מפורט</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} placeholder="תאור מפורט של הבעיה..." style={{ width: '100%', padding: 14, borderRadius: RADIUS.md, border: `1.5px solid ${COLORS.border}`, fontSize: 15, color: COLORS.text, direction: 'rtl', resize: 'vertical', outline: 'none', fontFamily: 'Heebo, Arial, sans-serif', background: COLORS.surface }} />
          </div>
          <Button title="שלח דיווח" onClick={handleSubmit} loading={loading} icon="construct" />
        </div>
      </div>
    </div>
  );
}
