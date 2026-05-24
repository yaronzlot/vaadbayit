import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ScreenHeader, Icon } from '../../components/UI';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!window.confirm('להתנתק מהחשבון?')) return;
    await logout();
    navigate('/login');
  };

  const menuItems = [
    ...(user?.role === 'admin' ? [
      { icon: 'stats-chart', label: 'דוח כספי', path: '/admin/finances' },
      { icon: 'people', label: 'ניהול דיירים', path: '/admin/residents' },
    ] : []),
    { icon: 'cash', label: 'תשלומים', path: '/payments' },
    { icon: 'megaphone', label: 'הודעות', path: '/announcements' },
    { icon: 'construct', label: 'תחזוקה', path: '/maintenance' },
    { icon: 'storefront', label: 'ספקים', path: '/vendors' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background }}>
      <ScreenHeader title="פרופיל" onBack={() => navigate('/')} />

      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Hero */}
        <div style={{ background: COLORS.surface, padding: `${SPACING.xl}px ${SPACING.lg}px`, textAlign: 'center', marginBottom: SPACING.md }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 32, fontWeight: 800, color: '#fff' }}>
            {(user?.name || 'U')[0]}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>{user?.name}</div>
          <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>{user?.email}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: COLORS.primaryLight, padding: '5px 12px', borderRadius: 20 }}>
              <Icon name="home" size={12} color={COLORS.primary} />
              <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.primary }}>דירה {user?.apartment || '-'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: user?.role === 'admin' ? COLORS.accentLight : COLORS.primaryLight, padding: '5px 12px', borderRadius: 20 }}>
              <Icon name={user?.role === 'admin' ? 'star' : 'person'} size={12} color={user?.role === 'admin' ? COLORS.accent : COLORS.primary} />
              <span style={{ fontSize: 12, fontWeight: 600, color: user?.role === 'admin' ? COLORS.accent : COLORS.primary }}>
                {user?.role === 'admin' ? 'מנהל ועד' : 'דייר'}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div style={{ background: COLORS.surface, margin: `0 ${SPACING.md}px ${SPACING.md}px`, borderRadius: RADIUS.lg, padding: SPACING.md, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          {[
            { icon: 'call-outline', label: 'טלפון', value: user?.phone || '-' },
            { icon: 'business-outline', label: 'מזהה בניין', value: user?.buildingId || '-' },
          ].map((row, i, arr) => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{row.value}</span>
              <span style={{ flex: 1, fontSize: 13, color: COLORS.textMuted, textAlign: 'right' }}>{row.label}</span>
              <Icon name={row.icon} size={18} color={COLORS.textMuted} />
            </div>
          ))}
        </div>

        {/* Menu */}
        <div style={{ background: COLORS.surface, margin: `0 ${SPACING.md}px ${SPACING.md}px`, borderRadius: RADIUS.lg, padding: SPACING.md, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          {menuItems.map((item, i) => (
            <div key={item.label} onClick={() => navigate(item.path)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: i < menuItems.length - 1 ? `1px solid ${COLORS.border}` : 'none', cursor: 'pointer' }}>
              <Icon name="chevron-back" size={18} color={COLORS.textMuted} />
              <span style={{ flex: 1, fontSize: 14, color: COLORS.text, textAlign: 'right' }}>{item.label}</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={item.icon} size={18} color={COLORS.primary} />
              </div>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: 'calc(100% - 32px)', margin: `0 ${SPACING.md}px ${SPACING.md}px`, padding: SPACING.md, background: COLORS.dangerLight, border: 'none', borderRadius: RADIUS.lg, cursor: 'pointer', fontSize: 15, fontWeight: 600, color: COLORS.danger }}>
          <Icon name="log-out" size={20} color={COLORS.danger} /> יציאה מהחשבון
        </button>
      </div>
    </div>
  );
}
