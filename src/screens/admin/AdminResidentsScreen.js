import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { residentsService } from '../../services/firebaseService';
import { Card, Badge, ScreenHeader, EmptyState, Icon, Spinner } from '../../components/UI';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';

export default function AdminResidentsScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user?.buildingId) return;
    const data = await residentsService.getAll(user.buildingId);
    setResidents(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = residents.filter(r =>
    r.name?.includes(search) || r.email?.includes(search) || r.apartment?.includes(search)
  );

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background }}>
      <ScreenHeader title="ניהול דיירים" onBack={() => navigate('/')} />

      <div style={{ maxWidth: 700, margin: '0 auto', padding: SPACING.md }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: SPACING.md }}>
          {[
            { label: 'דיירים', value: residents.filter(r => r.role !== 'admin').length, color: COLORS.primary },
            { label: 'מנהלים', value: residents.filter(r => r.role === 'admin').length, color: COLORS.accent },
            { label: 'דירות', value: new Set(residents.map(r => r.apartment)).size, color: COLORS.success },
          ].map(s => (
            <div key={s.label} style={{ background: COLORS.surface, borderRadius: RADIUS.md, padding: 14, textAlign: 'center', border: `1.5px solid ${s.color}40` }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: SPACING.md }}>
          <Icon name="search-outline" size={18} color={COLORS.textMuted} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם, אימייל, דירה..."
            style={{ width: '100%', padding: '13px 46px 13px 14px', borderRadius: RADIUS.md, border: `1.5px solid ${COLORS.border}`, fontSize: 14, color: COLORS.text, direction: 'rtl', outline: 'none', background: COLORS.surface, boxSizing: 'border-box' }}
          />
          {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}><Icon name="close" size={18} color={COLORS.textMuted} /></button>}
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <EmptyState icon="people-outline" title="אין דיירים" subtitle="לא נמצאו דיירים רשומים" />
        ) : filtered.map(item => (
          <Card key={item.id} style={{ marginBottom: SPACING.sm }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: COLORS.primary, flexShrink: 0 }}>
                {(item.name || 'U')[0]}
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Badge label={item.role === 'admin' ? 'ועד' : 'דייר'} type={item.role === 'admin' ? 'warning' : 'info'} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>{item.name}</span>
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>{item.email}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>{item.phone} • דירה {item.apartment}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
