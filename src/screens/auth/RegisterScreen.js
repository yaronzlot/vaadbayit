import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, ScreenHeader, Select } from '../../components/UI';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';

export default function RegisterScreen() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', buildingId: '', apartment: '', role: 'tenant' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.buildingId) { setError('נא למלא את כל השדות החובה'); return; }
    if (form.password.length < 6) { setError('הסיסמה חייבת להכיל לפחות 6 תווים'); return; }
    try {
      setLoading(true);
      setError('');
      await register(form);
      navigate('/');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background }}>
      <ScreenHeader title="הרשמה" onBack={() => navigate('/login')} />
      <div style={{ maxWidth: 500, margin: '0 auto', padding: SPACING.md }}>
        {error && (
          <div style={{ background: COLORS.dangerLight, color: COLORS.danger, borderRadius: RADIUS.md, padding: `${SPACING.sm}px ${SPACING.md}px`, marginBottom: SPACING.md, fontSize: 14 }}>
            {error}
          </div>
        )}

        <div style={{ background: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.textSecondary, marginBottom: SPACING.md }}>פרטים אישיים</h3>
          <Input label="שם מלא *" value={form.name} onChangeText={v => update('name', v)} icon="person-outline" placeholder="ישראל ישראלי" />
          <Input label="אימייל *" value={form.email} onChangeText={v => update('email', v)} icon="mail-outline" type="email" placeholder="your@email.com" />
          <Input label="טלפון" value={form.phone} onChangeText={v => update('phone', v)} icon="call-outline" type="tel" placeholder="050-0000000" />
          <Input label="סיסמה *" value={form.password} onChangeText={v => update('password', v)} icon="lock-closed-outline" type="password" placeholder="לפחות 6 תווים" />
          <Select
            label="תפקיד"
            value={form.role}
            onChange={v => update('role', v)}
            options={[{ value: 'tenant', label: 'דייר' }, { value: 'admin', label: 'מנהל ועד' }]}
          />
        </div>

        <div style={{ background: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.textSecondary, marginBottom: SPACING.md }}>פרטי דירה</h3>
          <Input label="מזהה בניין *" value={form.buildingId} onChangeText={v => update('buildingId', v)} icon="business-outline" placeholder="BLDG-001" />
          <Input label="מספר דירה" value={form.apartment} onChangeText={v => update('apartment', v)} icon="home-outline" type="number" placeholder="12" />
        </div>

        <Button title="הרשמה" onClick={handleRegister} loading={loading} />

        <p style={{ textAlign: 'center', fontSize: 14, color: COLORS.textSecondary, marginTop: SPACING.md }}>
          כבר יש לך חשבון?{' '}
          <span onClick={() => navigate('/login')} style={{ color: COLORS.primary, fontWeight: 600, cursor: 'pointer' }}>כניסה</span>
        </p>
      </div>
    </div>
  );
}
