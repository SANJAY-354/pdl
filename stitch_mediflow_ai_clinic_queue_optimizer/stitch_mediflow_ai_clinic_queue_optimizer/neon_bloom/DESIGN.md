---
name: Neon Bloom
colors:
  surface: '#fdf8ff'
  surface-dim: '#ddd5fc'
  surface-bright: '#fdf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f1ff'
  surface-container: '#f1ebff'
  surface-container-high: '#ece4ff'
  surface-container-highest: '#e6deff'
  on-surface: '#1c1734'
  on-surface-variant: '#484555'
  inverse-surface: '#312c4a'
  inverse-on-surface: '#f4eeff'
  outline: '#797587'
  outline-variant: '#c9c4d8'
  surface-tint: '#5e3be7'
  primary: '#5d39e5'
  on-primary: '#ffffff'
  primary-container: '#7657ff'
  on-primary-container: '#fffdff'
  inverse-primary: '#c9beff'
  secondary: '#506600'
  on-secondary: '#ffffff'
  secondary-container: '#c7ee55'
  on-secondary-container: '#536b00'
  tertiary: '#a92d51'
  on-tertiary: '#ffffff'
  tertiary-container: '#ca4669'
  on-tertiary-container: '#fffeff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6deff'
  primary-fixed-dim: '#c9beff'
  on-primary-fixed: '#1b0063'
  on-primary-fixed-variant: '#4612cf'
  secondary-fixed: '#caf158'
  secondary-fixed-dim: '#afd43e'
  on-secondary-fixed: '#161f00'
  on-secondary-fixed-variant: '#3b4d00'
  tertiary-fixed: '#ffd9de'
  tertiary-fixed-dim: '#ffb2bf'
  on-tertiary-fixed: '#3f0015'
  on-tertiary-fixed-variant: '#8b133b'
  background: '#fdf8ff'
  on-background: '#1c1734'
  surface-variant: '#e6deff'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  title-card:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  data-tabular:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
  badge-label:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system establishes an unapologetically vibrant, editorial healthcare interface designed to eliminate the sterile, clinical fatigue common in medical software. It blends high-performance SaaS precision with modern editorial energy, projecting proactive intelligence, calm mastery, and clinical empathy.

The core visual signature pairs soft, atmospheric pastel canvas backdrops with hyper-saturated chromatic accents—notably vivid orchid and electric acid lime. This contrast creates distinct focal anchors for busy clinical staff, triage directors, and medical practitioners navigating high-throughput patient queues. The emotional response is one of controlled dynamism, instantaneous clarity, and computational optimism.

## Colors

The palette operates under a hierarchical role taxonomy designed specifically for complex triage states, real-time queues, and algorithmic predictions:

- **Electric Orchid (`#7657FF`)**: The primary brand anchor and active workhorse. Used for primary interactions, high-intent action buttons, tab indicators, active navigation states, and key interactive toggles.
- **Acid Lime (`#D7FF64`)**: The AI intelligence accent. Applied with intent to predictive badges, machine-learning queue recommendations, live availability pulses, and optimized scheduling states. Pair strictly with Deep Plum text for WCAG AAA legibility.
- **Pop Coral (`#FF6F91`)**: High urgency signal. Used for critical wait-time thresholds, abrupt cancellations, no-show alerts, and acute priority status.
- **Mint Pulse (`#42D6C5`)**: Vitality and resolution. Signifies completed visits, on-time schedules, intake confirmations, and positive procedural throughput.
- **Solar Amber (`#FFBF69`)**: Triage caution. Applied to patient delays, active holding bays, pending insurance runs, and warning telemetry.
- **Deep Plum (`#25203D`)**: The foundational dark anchor. Applied across deep sidebar navigation panels, primary body text, table row headers, and prominent display labels.
- **Cloud Lilac (`#F7F5FF`)**: The default atmospheric canvas foundation. Provides a soft, glare-free background that keeps eyes rested during prolonged shifts.
- **Pure White (`#FFFFFF`)**: The elevated foreground container token for structured data tables, patient profile modals, and metric cards.
- **Muted Lavender Gray (`#817C98`)**: Secondary typography, patient IDs, timestamp prefixes, and table column headers.
- **Soft Border (`#E8E3F3`)**: Structural hairline borders (`1px`) delineating dense information without visual noise.

## Typography

The type scale bifurcates roles strictly by content density:

- **Display & Headings (Plus Jakarta Sans)**: Infuses optimistic, geometric character into clinical dashboards, operational metric totals, and specialty view headers. Tight letter-tracking (-0.015em to -0.03em) keeps large titles crisp and editorial.
- **Interface & Clinical Data (Inter)**: Delivers unmatched legibility for patient triage, medical record numbers, drug doses, and fast-updating queue timers. Tabular figures (`font-variant-numeric: tabular-nums`) must be activated for all queue timestamps, delay offsets, and scheduling slots to prevent visual jitter during live updates.
- **Micro-Labels (`label-caps`)**: Styled with `uppercase` transform and wide tracking (+0.06em) in Muted Lavender Gray to provide clear categorization without competing with live clinical data.

## Layout & Spacing

The layout employs a responsive 12-column grid system running atop a constant 4px/8px micro-grid. 

- **Desktop (1280px+)**: 12 columns, 280px fixed navigation rail in Deep Plum, `gutter: 1.5rem`, `margin: 2rem`. Specialized multi-column layouts split evenly into Patient Queue (5 cols), Specialty Room Distribution (4 cols), and AI Predictive Diagnostics (3 cols).
- **Tablet (768px - 1279px)**: 8 columns, collapsible rail turning into an icon drawer, `gutter: 1rem`, `margin: 1.5rem`. Secondary panels convert to off-canvas sheets.
- **Mobile (< 768px)**: 4 columns, bottom navigation bar, `gutter: 0.75rem`, `margin: 1rem`. Queue views switch to single-column stacked triage cards with sticky emergency triage actions.

Padding within actionable cards adheres to `space-lg` (24px) for desktop and `space-md` (16px) for compact views, ensuring ample white space that keeps dense patient medical context digestible under pressure.

## Elevation & Depth

Visual hierarchy uses a refined balance of soft lavender-tinted diffusion, layered planar surfaces, and selective luminescence rather than stark drop shadows:

- **Layer 0 (Canvas Base)**: Flat Cloud Lilac (`#F7F5FF`).
- **Layer 1 (Card Baseline)**: Pure White (`#FFFFFF`) surface framed with a crisp `1px solid #E8E3F3` stroke. Shadow: `0px 4px 20px -2px rgba(118, 87, 255, 0.05)`.
- **Layer 2 (Hover / Active State)**: Lifted Pure White surface. Shadow: `0px 10px 30px -4px rgba(118, 87, 255, 0.12), 0px 2px 8px -2px rgba(37, 32, 61, 0.04)`.
- **Layer 3 (Modals, Overlays & Flyout Drawer)**: High-altitude surface. Shadow: `0px 24px 48px -8px rgba(37, 32, 61, 0.18), 0px 4px 16px -2px rgba(118, 87, 255, 0.08)`.
- **Luminous AI Accentuation**: Dedicated AI insight cards feature an ambient rim glow: `0px 0px 20px 0px rgba(215, 255, 100, 0.35)` paired with a soft top-edge gradient border transitioning from Acid Lime into transparent Electric Orchid. Subtle horizontal shimmer animations across the top rim (3s ease-in-out infinite alternate) signify active background queue optimization.

## Shapes

The interface embraces a modern, friendly geometry balancing approachability with operational rigor. Core radius assignments:
- Large Content Containers & Modals: `20px` to `24px` (`rounded-xl` to custom max), lending a smooth, welcoming aesthetic to otherwise sterile medical software.
- Standard Cards, Data Pods, and Queue Tiles: `16px` (`rounded-lg`).
- Interactive Controls (Buttons, Form Inputs, Filter Pills): `10px` to `12px` for precise fingertip and cursor targeting.
- Status Badges, Live Queue Counters, and Metric Chips: Full pill styling (`9999px`) to emphasize transient, dynamic data points.

## Components

### Buttons
- **Primary Action**: Electric Orchid (`#7657FF`) background, Pure White text, `font-weight: 600`. Height: 44px (default) / 36px (compact). Padding: `0 20px`. Border-radius: 12px. Hover: shifts to `#6343F0` with `0px 4px 14px rgba(118, 87, 255, 0.35)` elevation.
- **AI Recommendation Action**: Acid Lime (`#D7FF64`) background with Deep Plum (`#25203D`) text. Features an integrated Lucide `Sparkles` icon. Subtle scale transformation (`scale(1.02)`) on hover.
- **Secondary / Ghost**: Pure White container with `1px solid #E8E3F3` outline, Deep Plum text. Hover: Cloud Lilac background with Electric Orchid text.
- **Destructive / Urgent Alert**: Pop Coral (`#FF6F91`) surface with Pure White text, reserved for acute wait breaches and cancellations.

### Status Badges & Queue Chips
- **Structure**: Height 26px, padding `0 10px`, pill-shaped (`border-radius: 9999px`), typography `badge-label`.
- **States**:
  - *AI Optimized / Live*: Acid Lime background (`#D7FF64`) with Deep Plum (`#25203D`) text and an animated pulsating green dot indicator.
  - *Completed / In Room*: Mint Pulse tint (`rgba(66, 214, 197, 0.15)`) with `#1CA091` deep mint text.
  - *Delayed / In Waiting*: Solar Amber tint (`rgba(255, 191, 105, 0.20)`) with `#C47C10` deep amber text.
  - *Critical / Triage Alert*: Pop Coral tint (`rgba(255, 111, 145, 0.18)`) with `#D43860` deep coral text.

### Interactive Form Inputs
- Background: Pure White (`#FFFFFF`). Border: `1px solid #E8E3F3`. Border radius: 10px. Typography: Inter `body-base` in Deep Plum.
- Placeholder text in Muted Lavender Gray (`#817C98`).
- Focus state: `1.5px solid #7657FF` with an electric outer aura: `box-shadow: 0 0 0 4px rgba(118, 87, 255, 0.15)`.

### Checkboxes & Radios
- Size: 18px × 18px with 5px radius (checkbox) or circular (radio).
- Default: Pure White fill with `1.5px solid #E8E3F3`.
- Checked: Electric Orchid (`#7657FF`) fill with crisp Pure White SVG checkmark icon.

### Patient Queue Cards
- Container: White background, 16px radius, `1px solid #E8E3F3` border, inner padding `space-md` (16px).
- Left-edge visual accent: 4px vertical bar colored according to wait urgency (Mint Pulse for on-time, Solar Amber for 10m+ delay, Pop Coral for urgent).
- Right-side cluster: tabular arrival timer, assigned specialty tag, and quick-action menu (Lucide `MoreVertical`).

### AI Predictive Optimization Banners
- Surface: Deep Plum (`#25203D`) background featuring an inset subtle gradient (`linear-gradient(135deg, rgba(118,87,255,0.2) 0%, rgba(215,255,100,0.15) 100%)`).
- Typography: Pure White headline with Acid Lime metrics callout.
- Border: `1px solid rgba(215, 255, 100, 0.3)`. Border-radius: 18px.