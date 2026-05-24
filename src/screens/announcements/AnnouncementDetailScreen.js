import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScreenHeader, Badge } from '../../components/UI';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { format } from 'date-fns';

const categoryColor = c => ({ 'דחוף': 'danger', 'תחזוקה': 'warning', 'כללי': 'info', 'אירועים': 'success' }[c] || 'info');

export default function AnnouncementDetailScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const ann = state?.announcement;

  if (!ann) return <div style={{ padding: 40, textAlign: 'center', color: COLORS.textMuted }}>הודעה לא נמצאה</div>;

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background }}>
      <ScreenHeader title="הודעה" onBack={() => navigate('/announcements')} />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: SPACING.md }}>
        <div style={{ background: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.lg, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
            <span style={{ fontSize: 13, color: COLORS.textMuted }}>{ann.createdAt?.toDate ? format(ann.createdAt.toDate(), 'dd/MM/yyyy HH:mm') : ''}</span>
            <Badge label={ann.category || 'כללי'} type={categoryColor(ann.category)} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, textAlign: 'right', marginBottom: SPACING.md }}>{ann.title}</h2>
          <p style={{ fontSize: 15, color: COLORS.textSecondary, textAlign: 'right', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{ann.body}</p>
          {ann.authorName && <p style={{ fontSize: 13, color: COLORS.textMuted, textAlign: 'right', marginTop: SPACING.lg, paddingTop: SPACING.md, borderTop: `1px solid ${COLORS.border}` }}>פורסם על ידי: {ann.authorName}</p>}
        </div>
      </div>
    </div>
  );
}
