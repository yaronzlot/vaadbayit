import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { paymentsService, announcementsService, maintenanceService } from '../../services/firebaseService';
import { Card, Badge, Icon, Spinner } from '../../components/UI';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { format } from 'date-fns';

const priorityLabel = p => ({ high: 'דחוף', medium: 'בינוני', low: 'נמוך' }[p] || 'בינוני');
const priorityColor = p => ({ high: 'danger', medium: 'warning', low: 'success' }[p] || 'info');

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ pending: 0, paid: 0 });
  const [announcements, setAnnouncements] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  const loadData = async () => {
    if (!user?.buildingId) return;
    try {
      const [sum, ann, maint] = await Promise.all([
        paymentsService.getSummary(user.buildingId),
        announcementsService.getAll(user.buildingId),
        maintenanceService.getAll(user.buildingId),
      ]);
      setSummary(sum);
      setAnnouncements(ann.slice(0, 3));
      setMaintenance(maint.filter(m => m.status === 'open').slice(0, 3));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'בוקר טוב' : hour < 17 ? 'צהריים טובים' : 'ערב טוב';

  if (loading) return <Spinner />;

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #0D47C4)`, padding: SPACING.lg, paddingBottom: 40 }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
            <button onClick={() => { logout(); navigate('/login'); }} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: RADIUS.md, padding: '8px 14px', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="log-out" size={16} color="#fff" /> יציאה
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{greeting},</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{user?.name || 'דייר'}</div>
              </div>
              <div onClick={() => navigate('/profile')} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, fontWeight: 700, color: '#fff' }}>
                {(user?.name || 'U')[0]}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { label: 'שולם', value: `₪${summary.paid?.toLocaleString() || 0}`, icon: 'checkmark-circle', color: '#10B981' },
              { label: 'ממתין', value: `₪${summary.pending?.toLocaleString() || 0}`, icon: 'time', color: '#F59E0B' },
              { label: 'תקלות פתוחות', value: maintenance.length, icon: 'construct', color: '#EF4444' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: RADIUS.md, padding: 14, textAlign: 'center' }}>
                <Icon name={s.icon} size={24} color={s.color} />
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '6px 0 2px' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: SPACING.md }}>
        {/* Admin Quick Actions */}
        {isAdmin && (
          <div style={{ marginBottom: SPACING.lg }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: SPACING.sm }}>ניהול</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, background: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
              {[
                { icon: 'people', label: 'דיירים', color: COLORS.primary, path: '/admin/residents' },
                { icon: 'stats-chart', label: 'כספים', color: COLORS.success, path: '/admin/finances' },
                { icon: 'megaphone', label: 'הודעה', color: COLORS.warning, path: '/announcements/add' },
                { icon: 'construct', label: 'תחזוקה', color: COLORS.danger, path: '/maintenance' },
              ].map(a => (
                <div key={a.label} onClick={() => navigate(a.path)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: a.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={a.icon} size={26} color={a.color} />
                  </div>
                  <span style={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: 500 }}>{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nav icons for tenants */}
        {!isAdmin && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, background: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.lg, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
            {[
              { icon: 'cash', label: 'תשלומים', path: '/payments' },
              { icon: 'megaphone', label: 'הודעות', path: '/announcements' },
              { icon: 'construct', label: 'תחזוקה', path: '/maintenance' },
              { icon: 'storefront', label: 'ספקים', path: '/vendors' },
            ].map(a => (
              <div key={a.label} onClick={() => navigate(a.path)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={a.icon} size={26} color={COLORS.primary} />
                </div>
                <span style={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: 500 }}>{a.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Announcements */}
        <div style={{ marginBottom: SPACING.lg }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm }}>
            <span onClick={() => navigate('/announcements')} style={{ fontSize: 13, color: COLORS.primary, cursor: 'pointer', fontWeight: 600 }}>הכל ›</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>הודעות אחרונות</h3>
          </div>
          {announcements.length === 0 ? (
            <Card><p style={{ textAlign: 'center', color: COLORS.textMuted, fontSize: 14 }}>אין הודעות</p></Card>
          ) : announcements.map(ann => (
            <Card key={ann.id} onClick={() => navigate(`/announcements/${ann.id}`, { state: { announcement: ann } })} style={{ marginBottom: SPACING.sm }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {ann.isPinned && <Icon name="pin" size={14} color={COLORS.danger} />}
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>{ann.createdAt?.toDate ? format(ann.createdAt.toDate(), 'dd/MM/yyyy') : ''}</span>
                </div>
                <Badge label={ann.category || 'כללי'} type="info" />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, textAlign: 'right' }}>{ann.title}</p>
            </Card>
          ))}
        </div>

        {/* Open Maintenance */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm }}>
            <span onClick={() => navigate('/maintenance')} style={{ fontSize: 13, color: COLORS.primary, cursor: 'pointer', fontWeight: 600 }}>הכל ›</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>תקלות פתוחות</h3>
          </div>
          {maintenance.length === 0 ? (
            <Card><p style={{ textAlign: 'center', color: COLORS.textMuted, fontSize: 14 }}>אין תקלות פתוחות 🎉</p></Card>
          ) : maintenance.map(m => (
            <Card key={m.id} style={{ marginBottom: SPACING.sm }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge label={priorityLabel(m.priority)} type={priorityColor(m.priority)} />
                <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{m.title}</p>
              </div>
              <p style={{ fontSize: 12, color: COLORS.textMuted, textAlign: 'right', marginTop: 4 }}>{m.location} • {m.createdAt?.toDate ? format(m.createdAt.toDate(), 'dd/MM') : ''}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
