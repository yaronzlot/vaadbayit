import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vendorsService } from '../../services/firebaseService';
import { Card, Badge, ScreenHeader, EmptyState, Icon, Spinner } from '../../components/UI';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';

const TRADES = ['הכל', 'אינסטלטור', 'חשמלאי', 'מעלית', 'גינון', 'ניקיון', 'אחר'];

export default function VendorsScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [trade, setTrade] = useState('הכל');
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  const load = async () => {
    if (!user?.buildingId) return;
    const data = await vendorsService.getAll(user.buildingId);
    setVendors(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = vendors.filter(v => trade === 'הכל' || v.trade === trade);

  const Stars = ({ rating = 0 }) => (
    <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: 2 }}>
      {[1,2,3,4,5].map(i => <Icon key={i} name={i <= rating ? 'star' : 'star-outline'} size={14} color={COLORS.accent} />)}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background }}>
      <ScreenHeader
        title="ספקים ותחזוקה"
        onBack={() => navigate('/')}
        action={isAdmin && (
          <button onClick={() => navigate('/vendors/add')} style={{ background: COLORS.primaryLight, border: 'none', borderRadius: RADIUS.full, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22, color: COLORS.primary }}>+</button>
        )}
      />

      <div style={{ maxWidth: 700, margin: '0 auto', padding: SPACING.md }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end', marginBottom: SPACING.md }}>
          {TRADES.map(t => (
            <button key={t} onClick={() => setTrade(t)} style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${trade === t ? COLORS.primary : COLORS.border}`, background: trade === t ? COLORS.primary : COLORS.surface, color: trade === t ? '#fff' : COLORS.textSecondary, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t}</button>
          ))}
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <EmptyState icon="storefront-outline" title="אין ספקים" subtitle="לא נמצאו ספקים. הוסף ספק חדש." />
        ) : filtered.map(item => (
          <Card key={item.id} style={{ marginBottom: SPACING.sm }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: SPACING.sm }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="briefcase" size={24} color={COLORS.primary} />
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  {item.isPreferred && <Badge label="מועדף" type="warning" />}
                  <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>{item.name}</span>
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>{item.trade} • {item.jobCount || 0} עבודות</div>
                <Stars rating={item.rating || 0} />
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: SPACING.sm, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href={`tel:${item.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.success, fontSize: 13, fontWeight: 500, textDecoration: 'none', justifyContent: 'flex-end' }}>
                {item.phone} <Icon name="call" size={16} color={COLORS.success} />
              </a>
              {item.email && (
                <a href={`mailto:${item.email}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.primary, fontSize: 13, fontWeight: 500, textDecoration: 'none', justifyContent: 'flex-end' }}>
                  {item.email} <Icon name="mail" size={16} color={COLORS.primary} />
                </a>
              )}
            </div>
            {isAdmin && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 16, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COLORS.border}` }}>
                <button onClick={() => { if (window.confirm(`למחוק את ${item.name}?`)) vendorsService.delete(item.id).then(load); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.danger, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                  <Icon name="trash-outline" size={16} color={COLORS.danger} /> מחק
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
