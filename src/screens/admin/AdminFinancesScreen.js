import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { paymentsService, residentsService } from '../../services/firebaseService';
import { Card, Badge, ScreenHeader, Button, Input, EmptyState, Modal, Icon, Spinner } from '../../components/UI';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { format } from 'date-fns';

export default function AdminFinancesScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [residents, setResidents] = useState([]);
  const [summary, setSummary] = useState({ paid: 0, pending: 0, total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPayment, setNewPayment] = useState({ description: '', amount: '', dueDate: '', apartment: '' });
  const updateNew = (k, v) => setNewPayment(p => ({ ...p, [k]: v }));

  const load = async () => {
    if (!user?.buildingId) return;
    const [pData, rData, sum] = await Promise.all([
      paymentsService.getAll(user.buildingId),
      residentsService.getAll(user.buildingId),
      paymentsService.getSummary(user.buildingId),
    ]);
    setPayments(pData);
    setResidents(rData);
    setSummary(sum);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAddPayment = async () => {
    if (!newPayment.description || !newPayment.amount || !newPayment.apartment) { alert('נא למלא תיאור, סכום ומספר דירה'); return; }
    const resident = residents.find(r => r.apartment === newPayment.apartment);
    await paymentsService.add({ ...newPayment, amount: parseFloat(newPayment.amount), buildingId: user.buildingId, userId: resident?.id || '' });
    setShowModal(false);
    setNewPayment({ description: '', amount: '', dueDate: '', apartment: '' });
    load();
  };

  const handleMarkPaid = async (p) => {
    if (!window.confirm(`לסמן כשולם ₪${p.amount}?`)) return;
    await paymentsService.markPaid(p.id);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('למחוק תשלום זה?')) return;
    await paymentsService.delete(id);
    load();
  };

  const collectionRate = summary.total > 0 ? Math.round((summary.paid / summary.total) * 100) : 0;
  const pending = payments.filter(p => p.status === 'pending');
  const paid = payments.filter(p => p.status === 'paid');

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background }}>
      <ScreenHeader
        title="ניהול כספים"
        onBack={() => navigate('/')}
        action={
          <button onClick={() => setShowModal(true)} style={{ background: COLORS.primaryLight, border: 'none', borderRadius: RADIUS.full, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22, color: COLORS.primary }}>+</button>
        }
      />

      <div style={{ maxWidth: 700, margin: '0 auto', padding: SPACING.md }}>
        {loading ? <Spinner /> : (
          <>
            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: SPACING.md }}>
              {[
                { label: 'סה״כ לגבייה', value: `₪${summary.total?.toLocaleString()}`, color: COLORS.primary },
                { label: 'שולם', value: `₪${summary.paid?.toLocaleString()}`, color: COLORS.success },
                { label: 'ממתין', value: `₪${summary.pending?.toLocaleString()}`, color: COLORS.warning },
                { label: 'אחוז גבייה', value: `${collectionRate}%`, color: collectionRate > 80 ? COLORS.success : COLORS.danger },
              ].map(s => (
                <div key={s.label} style={{ background: COLORS.surface, borderRadius: RADIUS.md, padding: 14, textAlign: 'center', borderTop: `3px solid ${s.color}`, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{ background: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: COLORS.textMuted }}>{collectionRate}% נגבה</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>התקדמות גבייה</span>
              </div>
              <div style={{ height: 10, background: COLORS.border, borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${collectionRate}%`, background: collectionRate > 80 ? COLORS.success : COLORS.warning, borderRadius: 5, transition: 'width 0.5s' }} />
              </div>
            </div>

            {/* Pending */}
            <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, textAlign: 'right', marginBottom: SPACING.sm }}>⏳ ממתינים ({pending.length})</h3>
            {pending.length === 0 ? (
              <Card style={{ marginBottom: SPACING.md }}><p style={{ textAlign: 'center', color: COLORS.textMuted }}>🎉 כל התשלומים שולמו!</p></Card>
            ) : pending.map(p => (
              <Card key={p.id} style={{ marginBottom: SPACING.sm }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: COLORS.text }}>₪{p.amount?.toLocaleString()}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{p.description}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>דירה {p.apartment} • {p.dueDate ? format(new Date(p.dueDate), 'dd/MM/yy') : 'ללא תאריך'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: 10, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COLORS.border}` }}>
                  <button onClick={() => handleMarkPaid(p)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: COLORS.successLight, border: 'none', borderRadius: RADIUS.sm, padding: '8px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: COLORS.success }}>
                    <Icon name="checkmark-circle" size={16} color={COLORS.success} /> סמן כשולם
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: COLORS.dangerLight, border: 'none', borderRadius: RADIUS.sm, padding: '8px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: COLORS.danger }}>
                    <Icon name="trash-outline" size={16} color={COLORS.danger} /> מחק
                  </button>
                </div>
              </Card>
            ))}

            {/* Paid */}
            <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, textAlign: 'right', margin: `${SPACING.md}px 0 ${SPACING.sm}px` }}>✅ שולמו ({paid.length})</h3>
            {paid.slice(0, 10).map(p => (
              <Card key={p.id} style={{ marginBottom: SPACING.sm }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.success }}>₪{p.amount?.toLocaleString()}</span>
                    <Badge label="שולם" type="success" />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{p.description}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>דירה {p.apartment} • {p.paidAt?.toDate ? format(p.paidAt.toDate(), 'dd/MM/yy') : ''}</div>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>

      <Modal visible={showModal} onClose={() => setShowModal(false)} title="הוספת תשלום">
        <Input label="תיאור *" value={newPayment.description} onChangeText={v => updateNew('description', v)} placeholder="ועד בית חודש מרץ" icon="document-text-outline" />
        <Input label="סכום (₪) *" value={newPayment.amount} onChangeText={v => updateNew('amount', v)} type="number" placeholder="350" icon="cash-outline" />
        <Input label="מספר דירה *" value={newPayment.apartment} onChangeText={v => updateNew('apartment', v)} type="number" placeholder="12" icon="home-outline" />
        <Input label="תאריך יעד" value={newPayment.dueDate} onChangeText={v => updateNew('dueDate', v)} type="date" icon="calendar-outline" />
        <Button title="הוסף תשלום" onClick={handleAddPayment} icon="add-circle" />
      </Modal>
    </div>
  );
}
