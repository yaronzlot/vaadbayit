import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { maintenanceService } from '../../services/firebaseService';
import { Card, Badge, ScreenHeader, EmptyState, Icon, Tabs, Spinner } from '../../components/UI';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { format } from 'date-fns';

const statusMap = { 'פתוח': 'open', 'בטיפול': 'in_progress', 'סגור': 'closed' };
const statusLabel = { open: 'פתוח', in_progress: 'בטיפול', closed: 'סגור' };
const statusColor = { open: 'danger', in_progress: 'warning', closed: 'success' };
const priorityLabel = { high: 'דחוף', medium: 'בינוני', low: 'נמוך' };
const priorityColor = { high: 'danger', medium: 'warning', low: 'success' };

export default function MaintenanceScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState('הכל');
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  const load = async () => {
    if (!user?.buildingId) return;
    const data = await maintenanceService.getAll(user.buildingId);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(i => tab === 'הכל' || i.status === statusMap[tab]);

  const handleStatusUpdate = async (item) => {
    const next = item.status === 'open' ? 'in_progress' : item.status === 'in_progress' ? 'closed' : 'open';
    if (!window.confirm(`לשנות סטטוס ל"${statusLabel[next]}"?`)) return;
    await maintenanceService.updateStatus(item.id, next);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('למחוק קריאה זו?')) return;
    await maintenanceService.delete(id);
    load();
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background }}>
      <ScreenHeader
        title="קריאות תחזוקה"
        onBack={() => navigate('/')}
        action={
          <button onClick={() => navigate('/maintenance/add')} style={{ background: COLORS.primaryLight, border: 'none', borderRadius: RADIUS.full, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22, color: COLORS.primary }}>+</button>
        }
      />

      <div style={{ maxWidth: 700, margin: '0 auto', padding: SPACING.md }}>
        <div style={{ marginBottom: SPACING.md }}>
          <Tabs tabs={['הכל', 'פתוח', 'בטיפול', 'סגור']} active={tab} onChange={setTab} />
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <EmptyState icon="construct-outline" title="אין קריאות" subtitle="לא נמצאו קריאות תחזוקה" />
        ) : filtered.map(item => (
          <Card key={item.id} style={{ marginBottom: SPACING.sm }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Badge label={statusLabel[item.status] || item.status} type={statusColor[item.status] || 'info'} />
                <Badge label={priorityLabel[item.priority] || 'בינוני'} type={priorityColor[item.priority] || 'info'} />
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{item.title}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{item.location} • דירה {item.apartment}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{item.createdAt?.toDate ? format(item.createdAt.toDate(), 'dd/MM/yyyy') : ''}</div>
              </div>
            </div>
            {item.description && <p style={{ fontSize: 13, color: COLORS.textSecondary, textAlign: 'right', marginTop: SPACING.sm, lineHeight: 1.6 }}>{item.description}</p>}
            {isAdmin && (
              <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: 10, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.border}` }}>
                <button onClick={() => handleStatusUpdate(item)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: COLORS.primaryLight, border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: COLORS.primary }}>
                  <Icon name="refresh" size={16} color={COLORS.primary} /> עדכן סטטוס
                </button>
                <button onClick={() => handleDelete(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: COLORS.dangerLight, border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: COLORS.danger }}>
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
