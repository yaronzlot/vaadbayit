import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Icon } from '../../components/UI';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';

export default function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email || !password) { setError('נא למלא את כל השדות'); return; }
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/');
    } catch {
      setError('אימייל או סיסמה שגויים');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: COLORS.background, padding: SPACING.md }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, borderRadius: RADIUS.xl, padding: `${SPACING.xl}px ${SPACING.lg}px`, textAlign: 'center', marginBottom: SPACING.lg, color: '#fff' }}>
          <div style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.2)', borderRadius: RADIUS.xl, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Icon name="business" size={36} color="#fff" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>ועד הבית</h1>
          <p style={{ opacity: 0.85, fontSize: 15 }}>ניהול חכם לבניין שלך</p>
        </div>

        {/* Form */}
        <div style={{ background: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.lg, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: SPACING.lg, color: COLORS.text }}>כניסה לחשבון</h2>

          {error && (
            <div style={{ background: COLORS.dangerLight, color: COLORS.danger, borderRadius: RADIUS.md, padding: `${SPACING.sm}px ${SPACING.md}px`, marginBottom: SPACING.md, fontSize: 14, fontWeight: 500 }}>
              {error}
            </div>
          )}

          <Input label="אימייל" value={email} onChangeText={setEmail} type="email" placeholder="your@email.com" icon="mail-outline" />

          <div style={{ position: 'relative' }}>
            <Input label="סיסמה" value={password} onChangeText={setPassword} type={showPass ? 'text' : 'password'} placeholder="הכנס סיסמה" icon="lock-closed-outline" />
            <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', left: 14, top: 38, cursor: 'pointer', color: COLORS.textMuted }}>
              <Icon name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textMuted} />
            </button>
          </div>

          <Button title="כניסה" onClick={handleLogin} loading={loading} style={{ marginBottom: SPACING.md }} />

          <p style={{ textAlign: 'center', fontSize: 14, color: COLORS.textSecondary }}>
            אין לך חשבון?{' '}
            <span onClick={() => navigate('/register')} style={{ color: COLORS.primary, fontWeight: 600, cursor: 'pointer' }}>הרשמה</span>
          </p>
        </div>
      </div>
    </div>
  );
}
