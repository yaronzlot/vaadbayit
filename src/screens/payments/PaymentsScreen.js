import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { paymentsService } from '../../services/firebaseService';
import { Card, Badge, Button, ScreenHeader, EmptyState, Tabs, Spinner } from '../../components/UI';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { format } from 'date-fns';

export default function PaymentsScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [tab, setTab] = useState('הכל');
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  const load = async () => {
    if (!user?.buildingId) return;
    try {
      const data = isAdmin
        ? await paymentsService.getAll(user.buildingId)
        : await paymentsService.getByUser(user.uid, user.buildingId);
      setPayments(data);
    } catch { alert('לא ניתן לטעון תשלומים'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = payments.filter(p => {
    if (tab === 'הכל') return true;
    if (tab === 'ממתין') return p.status === 'pending';
    if (tab === 'שולם') return p.status === 'paid';
    return true;
  });

  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  const handlePay = async (payment) => {
    if (!window.confirm(`לאשר תשלום של ₪${payment.amount} עבור ${payment.description}?`)) return;
    await paymentsService.markPaid(payment.id);
    load();
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background }}>
      <ScreenHeader
        title="תשלומים"
        onBack={() => navigate('/')}
        action={isAdmin && (
          <button onClick={() => navigate('/admin/finances')} style={{ background: COLORS.primaryLight, border: 'none', borderRadius: RADIUS.full, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22, color: COLORS.primary }}>+</button>
        )}
      />

      <div style={{ maxWidth: 700, margin: '0 auto', padding: SPACING.md }}>
        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: SPACING.md }}>
          <div style={{ background: COLORS.warningLight, borderRadius: RADIUS.md, padding: 14, textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.warning }}>ממתין לתשלום</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.warning }}>₪{totalPending.toLocaleString()}</div>
          </div>
          <div style={{ background: COLORS.successLight, borderRadius: RADIUS.md, padding: 14, textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.success }}>שולם</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.success }}>₪{totalPaid.toLocaleString()}</div>
          </div>
        </div>

        <div style={{ marginBottom: SPACING.md }}>
          <Tabs tabs={['הכל', 'ממתין', 'שולם']} active={tab} onChange={setTab} />
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <EmptyState icon="receipt-outline" title="אין תשלומים" subtitle="לא נמצאו תשלומים בקטגוריה זו" />
        ) : filtered.map(item => (
          <Card key={item.id} style={{ marginBottom: SPACING.sm }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Badge label={item.status === 'paid' ? 'שולם' : 'ממתין'} type={item.status === 'paid' ? 'success' : 'warning'} />
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{item.description}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
                  {item.dueDate ? format(new Date(item.dueDate), 'dd/MM/yyyy') : ''} • דירה {item.apartment}
                </div>
              </div>
              <div style={{ background: COLORS.primaryLight, borderRadius: RADIUS.md, padding: '8px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.primary }}>₪{item.amount?.toLocaleString()}</div>
              </div>
            </div>
            {item.status === 'pending' && (
              <Button title="שלם עכשיו" variant="secondary" onClick={() => handlePay(item)} style={{ marginTop: 10, padding: '10px 20px' }} />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
