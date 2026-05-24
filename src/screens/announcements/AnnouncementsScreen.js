import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { announcementsService } from '../../services/firebaseService';
import { Card, Badge, ScreenHeader, EmptyState, Icon, Spinner } from '../../components/UI';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { format } from 'date-fns';

const CATEGORIES = ['הכל', 'כללי', 'תחזוקה', 'דחוף', 'אירועים'];
const categoryColor = c => ({ 'דחוף': 'danger', 'תחזוקה': 'warning', 'כללי': 'info', 'אירועים': 'success' }[c] || 'info');

export default function AnnouncementsScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState('הכל');
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  const load = async () => {
    if (!user?.buildingId) return;
    const data = await announcementsService.getAll(user.buildingId);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(i => cat === 'הכל' || i.category === cat);
  const sorted = [...filtered.filter(i => i.isPinned), ...filtered.filter(i => !i.isPinned)];

  const handleDelete = async (id) => {
    if (!window.confirm('למחוק הודעה זו?')) return;
    await announcementsService.delete(id);
    load();
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background }}>
      <ScreenHeader
        title="לוח הודעות"
        onBack={() => navigate('/')}
        action={isAdmin && (
          <button onClick={() => navigate('/announcements/add')} style={{ background: COLORS.primaryLight, border: 'none', borderRadius: RADIUS.full, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22, color: COLORS.primary }}>+</button>
        )}
      />

      <div style={{ maxWidth: 700, margin: '0 auto', padding: SPACING.md }}>
        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end', marginBottom: SPACING.md }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${cat === c ? COLORS.primary : COLORS.border}`, background: cat === c ? COLORS.primary : COLORS.surface, color: cat === c ? '#fff' : COLORS.textSecondary, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {c}
            </button>
          ))}
        </div>

        {loading ? <Spinner /> : sorted.length === 0 ? (
          <EmptyState icon="megaphone-outline" title="אין הודעות" subtitle="לא נמצאו הודעות" />
        ) : sorted.map(item => (
          <Card key={item.id} onClick={() => navigate(`/announcements/${item.id}`, { state: { announcement: item } })} style={{ marginBottom: SPACING.sm }}>
            {item.isPinned && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                <Icon name="pin" size={12} color={COLORS.danger} />
                <span style={{ fontSize: 11, color: COLORS.danger, fontWeight: 600 }}>מוצמד</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>{item.createdAt?.toDate ? format(item.createdAt.toDate(), 'dd/MM/yyyy') : ''}</span>
              <Badge label={item.category || 'כללי'} type={categoryColor(item.category)} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, textAlign: 'right', marginBottom: 4 }}>{item.title}</p>
            <p style={{ fontSize: 13, color: COLORS.textSecondary, textAlign: 'right', lineHeight: 1.6 }}>{item.body?.slice(0, 120)}{item.body?.length > 120 ? '...' : ''}</p>
            {isAdmin && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 16, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COLORS.border}` }} onClick={e => e.stopPropagation()}>
                <button onClick={() => { announcementsService.pin(item.id, !item.isPinned); load(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.primary, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                  <Icon name={item.isPinned ? 'pin' : 'pin-outline'} size={16} color={COLORS.primary} /> {item.isPinned ? 'בטל הצמדה' : 'הצמד'}
                </button>
                <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.danger, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
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
