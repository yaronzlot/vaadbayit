import React from 'react';
import { COLORS, SPACING, RADIUS } from '../theme/colors';

// ─── ICON ─────────────────────────────────────────────────────────────────────
// Maps Ionicons names → Material Symbols names
const iconMap = {
  'business': 'apartment', 'business-outline': 'apartment',
  'home': 'home', 'home-outline': 'home',
  'cash': 'payments', 'cash-outline': 'payments',
  'megaphone': 'campaign', 'megaphone-outline': 'campaign',
  'construct': 'build', 'construct-outline': 'build',
  'people': 'group', 'people-outline': 'group',
  'person': 'person', 'person-outline': 'person',
  'settings': 'settings', 'settings-outline': 'settings',
  'log-out': 'logout', 'log-out-outline': 'logout',
  'mail': 'mail', 'mail-outline': 'mail',
  'lock-closed': 'lock', 'lock-closed-outline': 'lock',
  'eye': 'visibility', 'eye-outline': 'visibility',
  'eye-off': 'visibility_off', 'eye-off-outline': 'visibility_off',
  'call': 'call', 'call-outline': 'call',
  'add': 'add', 'add-outline': 'add',
  'add-circle': 'add_circle', 'add-circle-outline': 'add_circle',
  'chevron-back': 'chevron_right', 'chevron-forward': 'chevron_left',
  'arrow-back': 'arrow_forward', 'arrow-forward': 'arrow_back',
  'checkmark': 'check', 'checkmark-circle': 'check_circle',
  'close': 'close', 'close-circle': 'cancel',
  'trash': 'delete', 'trash-outline': 'delete_outline',
  'create': 'edit', 'create-outline': 'edit',
  'star': 'star', 'star-outline': 'star_border',
  'star-half': 'star_half',
  'warning': 'warning', 'warning-outline': 'warning',
  'information-circle': 'info', 'information-circle-outline': 'info',
  'refresh': 'refresh',
  'search': 'search', 'search-outline': 'search',
  'filter': 'filter_list',
  'time': 'schedule', 'time-outline': 'schedule',
  'calendar': 'calendar_month', 'calendar-outline': 'calendar_month',
  'location': 'location_on', 'location-outline': 'location_on',
  'phone-portrait': 'smartphone',
  'stats-chart': 'bar_chart',
  'trending-up': 'trending_up',
  'wallet': 'account_balance_wallet', 'wallet-outline': 'account_balance_wallet',
  'receipt': 'receipt', 'receipt-outline': 'receipt',
  'document-text': 'description', 'document-text-outline': 'description',
  'chatbubble': 'chat', 'chatbubble-outline': 'chat',
  'notifications': 'notifications', 'notifications-outline': 'notifications_none',
  'briefcase': 'work', 'briefcase-outline': 'work_outline',
  'hammer': 'hardware', 'hammer-outline': 'hardware',
  'wrench': 'build_circle',
  'pricetag': 'label', 'pricetag-outline': 'label',
  'pin': 'push_pin', 'pin-outline': 'push_pin',
  'ellipsis-vertical': 'more_vert',
  'open': 'open_in_new',
  'shield-checkmark': 'verified_user',
  'menu': 'menu',
  'storefront': 'storefront', 'storefront-outline': 'storefront',
};

export function Icon({ name, size = 20, color = COLORS.textMuted, style }) {
  const mapped = iconMap[name] || name?.replace(/-outline$/, '').replace(/-/g, '_') || 'help';
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: size,
        color,
        userSelect: 'none',
        verticalAlign: 'middle',
        fontVariationSettings: "'FILL' 0, 'wght' 400",
        lineHeight: 1,
        ...style,
      }}
    >
      {mapped}
    </span>
  );
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
export function Button({ title, onClick, onPress, variant = 'primary', loading, disabled, icon, style }) {
  const handler = onClick || onPress;
  const variants = {
    primary: { background: COLORS.primary, color: '#fff', border: 'none' },
    secondary: { background: COLORS.primaryLight, color: COLORS.primary, border: 'none' },
    danger: { background: COLORS.dangerLight, color: COLORS.danger, border: 'none' },
    outline: { background: 'transparent', color: COLORS.primary, border: `1.5px solid ${COLORS.primary}` },
    ghost: { background: 'transparent', color: COLORS.primary, border: 'none' },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button
      onClick={handler}
      disabled={disabled || loading}
      style={{
        padding: '12px 20px',
        borderRadius: RADIUS.md,
        fontSize: 15,
        fontWeight: 600,
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        opacity: (disabled || loading) ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        transition: 'opacity 0.15s, transform 0.1s',
        ...v,
        border: v.border,
        ...style,
      }}
    >
      {loading ? (
        <span style={{ display: 'inline-block', width: 18, height: 18, border: `2px solid ${v.color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      ) : (
        <>
          {icon && <Icon name={icon} size={18} color={v.color} />}
          {title}
        </>
      )}
    </button>
  );
}

// ─── INPUT ────────────────────────────────────────────────────────────────────
export function Input({ label, error, icon, style, value, onChange, onChangeText, type = 'text', placeholder, disabled, ...props }) {
  const handleChange = (e) => {
    if (onChange) onChange(e);
    if (onChangeText) onChangeText(e.target.value);
  };
  return (
    <div style={{ marginBottom: SPACING.md }}>
      {label && <label style={{ display: 'block', fontSize: 13, color: COLORS.textSecondary, marginBottom: 6, fontWeight: 500 }}>{label}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: COLORS.surface, borderRadius: RADIUS.md, border: `1.5px solid ${error ? COLORS.danger : COLORS.border}`, padding: '0 14px' }}>
        {icon && <Icon name={icon} size={18} color={COLORS.textMuted} style={{ marginLeft: 8, flexShrink: 0 }} />}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: 15,
            color: COLORS.text,
            background: 'transparent',
            padding: '13px 0',
            direction: 'rtl',
            width: '100%',
            ...style,
          }}
          {...props}
        />
      </div>
      {error && <p style={{ fontSize: 12, color: COLORS.danger, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
export function Card({ children, style, onClick, onPress }) {
  const handler = onClick || onPress;
  return (
    <div
      onClick={handler}
      style={{
        background: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
        cursor: handler ? 'pointer' : 'default',
        transition: handler ? 'box-shadow 0.15s, transform 0.1s' : undefined,
        ...style,
      }}
      onMouseEnter={handler ? (e) => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)'; } : undefined}
      onMouseLeave={handler ? (e) => { e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; } : undefined}
    >
      {children}
    </div>
  );
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
export function Badge({ label, type = 'info' }) {
  const types = {
    success: { bg: COLORS.successLight, color: COLORS.success },
    warning: { bg: COLORS.warningLight, color: COLORS.warning },
    danger: { bg: COLORS.dangerLight, color: COLORS.danger },
    info: { bg: COLORS.infoLight, color: COLORS.info },
    default: { bg: COLORS.border, color: COLORS.textSecondary },
  };
  const t = types[type] || types.default;
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: RADIUS.full, fontSize: 12, fontWeight: 600, background: t.bg, color: t.color }}>
      {label}
    </span>
  );
}

// ─── SCREEN HEADER ────────────────────────────────────────────────────────────
export function ScreenHeader({ title, onBack, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: `${SPACING.md}px`, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, gap: SPACING.sm }}>
      {onBack && (
        <button onClick={onBack} style={{ padding: 6, borderRadius: RADIUS.sm, cursor: 'pointer', display: 'flex', color: COLORS.primary }}>
          <Icon name="chevron-back" size={22} color={COLORS.primary} />
        </button>
      )}
      <h2 style={{ flex: 1, fontSize: 18, fontWeight: 700, color: COLORS.text }}>{title}</h2>
      {action}
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
export function EmptyState({ icon = 'document-text-outline', title, subtitle, action }) {
  return (
    <div style={{ textAlign: 'center', padding: `${SPACING.xxl}px ${SPACING.lg}px`, color: COLORS.textMuted }}>
      <Icon name={icon} size={56} color={COLORS.border} />
      <p style={{ marginTop: SPACING.md, fontSize: 16, fontWeight: 600, color: COLORS.textSecondary }}>{title}</p>
      {subtitle && <p style={{ marginTop: SPACING.xs, fontSize: 14 }}>{subtitle}</p>}
      {action && <div style={{ marginTop: SPACING.lg }}>{action}</div>}
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
export function Modal({ visible, onClose, title, children }) {
  if (!visible) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div
        style={{ background: COLORS.surface, borderRadius: `${RADIUS.xl}px ${RADIUS.xl}px 0 0`, width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto', padding: SPACING.lg }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose}><Icon name="close" size={22} color={COLORS.textMuted} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── SELECT ───────────────────────────────────────────────────────────────────
export function Select({ label, value, onChange, options, style }) {
  return (
    <div style={{ marginBottom: SPACING.md }}>
      {label && <label style={{ display: 'block', fontSize: 13, color: COLORS.textSecondary, marginBottom: 6, fontWeight: 500 }}>{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '13px 14px',
          borderRadius: RADIUS.md,
          border: `1.5px solid ${COLORS.border}`,
          background: COLORS.surface,
          fontSize: 15,
          color: COLORS.text,
          direction: 'rtl',
          outline: 'none',
          cursor: 'pointer',
          ...style,
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── SPINNER ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 40, color = COLORS.primary }) {
  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
        <div style={{ width: size, height: size, border: `3px solid ${COLORS.border}`, borderTopColor: color, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    </>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', background: COLORS.surfaceAlt, borderRadius: RADIUS.md, padding: 4, gap: 4 }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: RADIUS.sm,
            fontSize: 14,
            fontWeight: 600,
            transition: 'all 0.15s',
            background: active === tab ? COLORS.primary : 'transparent',
            color: active === tab ? '#fff' : COLORS.textSecondary,
            cursor: 'pointer',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
