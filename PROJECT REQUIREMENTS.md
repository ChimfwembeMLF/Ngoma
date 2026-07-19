# Ngoma: Complete Platform Requirements Document

**Ngoma: The Heartbeat of African Music**

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Brand & Visual Identity](#2-brand--visual-identity)
3. [Artist-Facing Features](#3-artist-facing-features)
4. [Listener/Fan-Facing Features](#4-listenerfan-facing-features)
5. [Platform Admin Features](#5-platform-admin-features)
6. [Technical & Backend Requirements](#6-technical--backend-requirements)
7. [Payment Integration (PawaPay)](#7-payment-integration-pawapay)
8. [Database Schema](#8-database-schema)
9. [API Architecture](#9-api-architecture)
10. [Security Requirements](#10-security-requirements)
11. [Development Phases](#11-development-phases)
12. [Legal & Compliance](#12-legal--compliance)
13. [Launch Strategy](#13-launch-strategy)

---

## 1. Executive Summary

### 1.1 Platform Overview
**Ngoma** is a comprehensive music management and distribution platform designed specifically for the African music ecosystem, with initial focus on the Zambian market. The platform connects artists directly with their fans through a mobile-first experience, integrating mobile money payments (via PawaPay) as the primary payment method.

### 1.2 Core Values
- **Empowerment:** Artists control their pricing, content, and earnings
- **Authenticity:** Celebrating African music and culture
- **Accessibility:** Mobile-first design with mobile money payments
- **Transparency:** Real-time analytics and clear financial reporting

### 1.3 Target Audience
| Segment | Description |
|---------|-------------|
| **Artists** | Independent musicians, bands, producers, DJs (emerging to established) |
| **Fans** | Music listeners across Africa and the diaspora |
| **Admins** | Platform operators and moderators |

---

## 2. Brand & Visual Identity

### 2.1 Logo Specifications

**Primary Logo: Stylized Drum with Sound Waves**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│         ╔═══════════════╗                          │
│         ║  ◄───────►   ║   ← Sound waves radiating │
│         ║  ┌───────┐   ║      from the drum       │
│         ║  │   █   │   ║                          │
│         ║  │  ███  │   ║   ← Stylized drum        │
│         ║  │ █████ │   ║      silhouette          │
│         ║  │███████│   ║                          │
│         ║  └───────┘   ║                          │
│         ║               ║                          │
│         ╚═══════════════╝                          │
│                                                     │
│              N G O M A                             │
│         The Heartbeat of African Music            │
└─────────────────────────────────────────────────────┘
```

**Logo Variations:**
- **Primary:** Full logo with drum icon and wordmark
- **Secondary:** Icon only (favicon, app icon)
- **Tertiary:** Wordmark only (clean, typographic)

**File Formats:**
- SVG (vector, scalable)
- PNG (transparent background, multiple sizes)
- JPG (white background)
- Favicon (16x16, 32x32, 64x64)

### 2.2 Color Palette

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Terracotta** | `#C0672E` | (192, 103, 46) | Primary brand color, headers, CTAs |
| **Golden Amber** | `#F5A623` | (245, 166, 35) | Accents, highlights, buttons |
| **Deep Indigo** | `#1A2A3A` | (26, 42, 58) | Text, dark backgrounds |
| **Earthy Brown** | `#5D4037` | (93, 64, 55) | Secondary elements |
| **Sunset Orange** | `#E85D3A` | (232, 93, 58) | Alerts, promotions |
| **Warm Cream** | `#FDF6F0` | (253, 246, 240) | Backgrounds |
| **Pure White** | `#FFFFFF` | (255, 255, 255) | Cards, text on dark |
| **Midnight** | `#0D1B2A` | (13, 27, 42) | Footer, dark mode |

### 2.3 Typography

**Primary Font (Headings):**
- **Font Family:** `"Afacad"` or `"Poppins"` with bold weights
- **Weights:** 600, 700, 800
- **Usage:** Headlines, hero text, section titles

**Secondary Font (Body):**
- **Font Family:** `"Inter"` or `"Open Sans"`
- **Weights:** 300, 400, 500, 600
- **Usage:** Body text, descriptions, UI elements

**Font Scale:**
| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| H1 | 48px | 700 | Hero headlines |
| H2 | 36px | 700 | Section headers |
| H3 | 28px | 600 | Sub-headers |
| H4 | 20px | 600 | Card titles |
| Body | 16px | 400 | Paragraphs |
| Small | 14px | 400 | Metadata, captions |
| Tiny | 12px | 400 | Labels, badges |

### 2.4 Brand Voice

**Tone:**
- Warm and welcoming
- Empowering and confident
- Trustworthy and transparent
- Proudly African with global ambition

**Brand Personality:**
- **Nurturing:** Like community elders
- **Vibrant:** Full of energy and life
- **Authentic:** No pretense, honest
- **Pioneering:** Leading African music forward

**Voice Guidelines:**
| Do | Don't |
|----|-------|
| Use inclusive language | Use overly technical jargon |
| Celebrate African culture | Appropriate culture superficially |
| Be encouraging and uplifting | Be condescending or patronizing |
| Speak directly to the user | Sound corporate or bureaucratic |
| Use storytelling | Use marketing clichés |

### 2.5 Visual Elements

**Patterns & Textures:**
- Geometric patterns inspired by African textiles (kitenge, chitenge)
- Sound wave motifs
- Drum texture overlays
- Warm gradient backgrounds

**Imagery Style:**
- Vibrant, high-contrast photography
- Real people in authentic settings
- Music-related imagery (instruments, performances, studios)
- African landscapes and urban scenes
- Warm golden hour lighting

**Iconography:**
- Custom icon set with African-inspired design
- Rounded, friendly edges
- Consistent stroke width (2px)
- Primary color (Terracotta) for active states

---

## 3. Artist-Facing Features

### 3.1 Registration & Profile Setup

#### 3.1.1 Registration Process
```
┌─────────────────────────────────────────────────────────────┐
│                     Welcome to Ngoma                       │
│              The Heartbeat of African Music                │
│                                                           │
│  ┌─────────────────────────────────────────────────┐      │
│  │  👤 Sign Up with Email                         │      │
│  │  📱 Sign Up with Phone                        │      │
│  │  🔵 Continue with Google                     │      │
│  │  ⚫ Continue with Facebook                   │      │
│  │  🐦 Continue with Twitter (X)               │      │
│  └─────────────────────────────────────────────────┘      │
│                                                           │
│  Already have an account? [Sign In]                      │
│                                                           │
│  By signing up, you agree to our Terms of Service        │
│  and Privacy Policy                                      │
└─────────────────────────────────────────────────────────────┘
```

**Registration Fields:**
| Field | Required | Validation |
|-------|----------|------------|
| Email Address | Yes | Valid email format |
| Phone Number | Yes | E.164 format (+260XXXXXXXX) |
| Password | Yes | Min 8 chars, 1 uppercase, 1 number |
| Full Name | Yes | Min 2 chars |
| Artist Name | Yes | Min 2 chars, no special chars |
| Country | Yes | Dropdown selection |
| Role Selection | Yes | Artist/Listener |

#### 3.1.2 Onboarding Flow (Step-by-Step)

**Step 1: Welcome & Account Type**
```
┌──────────────────────────────────────────────────┐
│  🎵 Welcome to Ngoma!                           │
│  Who are you?                                  │
│                                                │
│  ┌──────────────┐  ┌──────────────┐          │
│  │  🎤 Artist   │  │  🎧 Listener │          │
│  │  I make      │  │  I love      │          │
│  │  music       │  │  music       │          │
│  └──────────────┘  └──────────────┘          │
│                                                │
│  Progress: ●○○○○                             │
└──────────────────────────────────────────────────┘
```

**Step 2: Artist Profile Setup**
```
┌──────────────────────────────────────────────────┐
│  ✍️ Tell us about yourself                     │
│                                                │
│  Artist Name: [_____________________]          │
│  Real Name:   [_____________________]          │
│  Bio:         [_____________________]          │
│               [_____________________]          │
│               [_____________________]          │
│                                                │
│  Profile Photo: [Choose Image]                 │
│  Cover Photo:   [Choose Image]                 │
│                                                │
│  Genre:        [Select all that apply]         │
│                ☐ Afrobeats  ☐ Hip Hop        │
│                ☐ R&B        ☐ Jazz           │
│                ☐ Traditional ☐ Gospel        │
│                ☐ Electronic ☐ Other          │
│                                                │
│  Social Links:                                 │
│  Website:      [_____________________]          │
│  Instagram:    [_____________________]          │
│  Twitter/X:    [_____________________]          │
│  YouTube:      [_____________________]          │
│  TikTok:       [_____________________]          │
│  Spotify:      [_____________________]          │
│                                                │
│  Progress: ●●○○○                             │
└──────────────────────────────────────────────────┘
```

**Step 3: Subscription Selection**
```
┌──────────────────────────────────────────────────┐
│  🏆 Choose Your Plan                           │
│  Pick the plan that fits your journey          │
│                                                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│  │ Starter │  │ Pro     │  │ Premium │      │
│  │ Free    │  │ K??/mo  │  │ K??/mo  │      │
│  │         │  │         │  │         │      │
│  │ 3 tracks│  │Unlimited│  │Unlimited│      │
│  │Basic    │  │Detailed │  │All Pro +│      │
│  │analytics│  │analytics│  │Promo    │      │
│  │0% rev   │  │10% rev  │  │5% rev   │      │
│  │share    │  │share    │  │share    │      │
│  │         │  │         │  │Priority │      │
│  │         │  │         │  │support  │      │
│  │ [Select]│  │ [Select]│  │[Select] │      │
│  └─────────┘  └─────────┘  └─────────┘      │
│                                                │
│  Progress: ●●●○○                             │
└──────────────────────────────────────────────────┘
```

**Step 4: Payment Method Setup**
```
┌──────────────────────────────────────────────────┐
│  💳 Payment Setup                              │
│  Connect your mobile money for payouts         │
│                                                │
│  Mobile Money Number:                          │
│  [+260] [_________]                          │
│                                                │
│  Provider:                                     │
│  ┌──────────────────────────────────┐         │
│  │  ◉ MTN   ○ Airtel   ○ Zamtel   │         │
│  └──────────────────────────────────┘         │
│                                                │
│  Will be used for:                            │
│  ✓ Subscription payments                     │
│  ✓ Receiving payouts                        │
│                                                │
│  [Verify Number]                              │
│                                                │
│  Progress: ●●●●○                             │
└──────────────────────────────────────────────────┘
```

**Step 5: First Release**
```
┌──────────────────────────────────────────────────┐
│  🚀 Ready to Release?                         │
│  Upload your first track and start earning     │
│                                                │
│  [Upload First Track]  [Skip for Now]         │
│                                                │
│  Progress: ●●●●● ✓                           │
└──────────────────────────────────────────────────┘
```

#### 3.1.3 Artist Profile Page

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Cover Image - Banner]                                            │
│  ═══════════════════════════════════════════════════════════════ │
│                                                                   │
│  ┌──────────┐                                                    │
│  │ [Profile]│  Ngoma Artist Name                                 │
│  │  Photo   │  ● Verified Artist                                │
│  └──────────┘  "Artist bio description goes here..."            │
│               ────────────────────────────────────────────        │
│               📍 Lusaka, Zambia  🎵 1.2M total plays           │
│               ├─────────┬─────────┬─────────┬─────────┤         │
│               │ 12,345  │  234    │  56K    │  23     │         │
│               │Tracks   │Albums   │Fans     │Singles  │         │
│               └─────────┴─────────┴─────────┴─────────┘         │
│                                                                   │
│  ────────────┬───────────────────────────────────────────         │
│  Social:     │  🌐 [Website]  📷 [IG]  🐦 [X]  ▶️ [YT]      │
│  ────────────┴───────────────────────────────────────────         │
│                                                                   │
│  [Follow]  [Share]  [Tip]  [Contact]                            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │  🎵 Discography                    🎤 Upcoming Shows   │     │
│  │  ─────────────────────────          ─────────────────  │     │
│  │  Album 1  ██████░░░  2024          📅 Dec 15 - Club A │     │
│  │  Album 2  ██████░░░  2023          📅 Jan 20 - Fest B │     │
│  │  Single A ██████░░░  2024          📅 Feb 10 - Venue C │     │
│  │  Single B ██████░░░  2023                              │     │
│  │  EP Title ██████░░░  2023                              │     │
│  │  [View All]                                             │     │
│  └─────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```

**Artist Dashboard Components:**
| Component | Description |
|-----------|-------------|
| **Public Profile** | Displayed to fans and visitors |
| **Profile Settings** | Edit all profile information |
| **Verification Badge** | Blue badge for professional/established artists |
| **Social Links** | Connect all social media platforms |
| **Discography** | Chronological display of all releases |
| **Tour Dates** | Upcoming shows and events |

**Verification Requirements:**
| Criteria | Requirement |
|----------|------------|
| Minimum Followers | 5,000+ |
| Active Releases | At least 5 tracks in last 12 months |
| Account Age | 6+ months active |
| Identity Verification | Government ID submitted |
| Phone Verification | Confirmed mobile number |
| Review Process | Manual admin review |

### 3.2 Subscription & Account Management

#### 3.2.1 Subscription Tiers

| Feature | Starter (Free) | Professional (K??/mo) | Premium (K??/mo) |
|---------|---------------|----------------------|------------------|
| **Tracks Upload** | 3 tracks | Unlimited | Unlimited |
| **Storage** | 500 MB | 10 GB | 50 GB |
| **Revenue Share** | 0% platform fee | 10% platform fee | 5% platform fee |
| **Analytics** | Basic (plays) | Detailed + demographics | Advanced + projections |
| **Fan Insights** | ❌ | ✅ Basic | ✅ Advanced |
| **Priority Support** | ❌ | ❌ | ✅ 24/7 |
| **Promotional Tools** | ❌ | ✅ Basic | ✅ Advanced |
| **Pre-scheduling** | ❌ | ✅ | ✅ |
| **Multiple Albums** | ❌ | ✅ | ✅ |
| **Exclusive Content** | ❌ | ✅ | ✅ |
| **Payout Frequency** | Monthly | Bi-weekly | Weekly |
| **Custom Pricing** | ❌ | ✅ | ✅ |

#### 3.2.2 Payment for Subscription

**Mobile Money Checkout:**
```
┌─────────────────────────────────────────────────────┐
│  💳 Subscribe to Professional Plan                │
│  ────────────────────────────────────────────────  │
│                                                    │
│  Plan: Professional                                │
│  Price: K150.00/month                             │
│                                                    │
│  Pay with Mobile Money:                           │
│  ┌────────────────────────────────────────────┐  │
│  │   Select Provider:                        │  │
│  │   ┌────────────────────────────────────┐  │  │
│  │   │  📱 MTN Mobile Money  ◉            │  │  │
│  │   │  📱 Airtel Money      ○            │  │  │
│  │   │  📱 Zamtel Kwacha     ○            │  │  │
│  │   └────────────────────────────────────┘  │  │
│  │   Phone Number: [+260] [______________]  │  │
│  │                                            │  │
│  │   Amount: K150.00                         │  │
│  │                                            │  │
│  │   [Pay Now]                               │  │
│  └────────────────────────────────────────────┘  │
│                                                    │
│  🔒 Secured by Ngoma - No card details stored     │
│  You'll receive a USSD prompt to confirm payment  │
└─────────────────────────────────────────────────────┘
```

**Billing History:**
```
┌─────────────────────────────────────────────────────┐
│  📜 Billing History                               │
│  ────────────────────────────────────────────────  │
│                                                    │
│  Date          │ Plan        │ Amount │ Status   │
│  ─────────────┼─────────────┼────────┼──────────┤
│  2024-12-01   │ Professional│ K150.00│ ✅ Paid  │
│  2024-11-01   │ Professional│ K150.00│ ✅ Paid  │
│  2024-10-01   │ Professional│ K150.00│ ✅ Paid  │
│  2024-09-01   │ Starter     │ Free   │ ✅ Free  │
│                                                    │
│  [Download Invoice] [View All]                    │
│                                                    │
│  Next billing date: 2025-01-01                    │
│  Payment method: MTN Mobile Money (****2345)      │
└─────────────────────────────────────────────────────┘
```

#### 3.2.3 Account Management Settings

```
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️ Account Settings                                             │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  ┌─ Profile ─────────────────────────────────────────────────┐   │
│  │  Artist Name: [Ngoma Artist] [Edit]                     │   │
│  │  Email: artist@example.com [Change]                     │   │
│  │  Phone: +260 97XXXXXXX [Change]                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─ Security ──────────────────────────────────────────────┐   │
│  │  Password: ******** [Change Password]                   │   │
│  │  2-Factor Auth: [Enable/Disable]                        │   │
│  │  Active Sessions: [View All]                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─ Payment Settings ─────────────────────────────────────┐   │
│  │  Mobile Money: MTN (+260 97XXXXXXX) [Update]           │   │
│  │  Payout Method: Same as payment                        │   │
│  │  Tax Information: [Add/Update]                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─ Notifications ────────────────────────────────────────┐   │
│  │  Email Notifications: [✓] [✗]                         │   │
│  │  SMS Notifications: [✓] [✗]                           │   │
│  │  Push Notifications: [✓] [✗]                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─ Subscription ─────────────────────────────────────────┐   │
│  │  Current Plan: Professional                            │   │
│  │  Next Billing: 2025-01-01                            │   │
│  │  [Change Plan] [Cancel Subscription]                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─ Account Actions ─────────────────────────────────────┐   │
│  │  [Download My Data] [Deactivate Account] [Delete]     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 Music Upload & Management

#### 3.3.1 Track Upload Interface

```
┌─────────────────────────────────────────────────────────────────────┐
│  📤 Upload New Track                                            │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  ┌─ Audio File ───────────────────────────────────────────┐    │
│  │                                                        │    │
│  │      ┌────────────────────────────┐                   │    │
│  │      │   📁 Drop audio file here  │                   │    │
│  │      │   or click to browse       │                   │    │
│  │      │                            │                   │    │
│  │      │   Supported: MP3, WAV,     │                   │    │
│  │      │   FLAC, AAC, OGG          │                   │    │
│  │      │   Max size: 200MB         │                   │    │
│  │      └────────────────────────────┘                   │    │
│  │                                                        │    │
│  │  [Upload File]                                        │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Track Details ──────────────────────────────────────┐    │
│  │  Track Title: [________________________]             │    │
│  │  Artist: [Ngoma Artist - primary]                    │    │
│  │  Featured Artists: [________________________]        │    │
│  │  Album: [Select or Create New] ▼                    │    │
│  │  Genre: [Select all that apply] ▼                   │    │
│  │  Release Date: [📅 2024-12-25]                     │    │
│  │  Language: [Select Language(s)] ▼                   │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Artwork ─────────────────────────────────────────────┐    │
│  │  Cover Art: [Choose Image]                           │    │
│  │  Requirements: 3000x3000px, JPG or PNG              │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Pricing Model ─────────────────────────────────────┐    │
│  │  ◉ Set Price: [K] [___5.00___] per download       │    │
│  │  ○ Pay What You Want: Min [K] [___1.00___]        │    │
│  │  ○ Free Download (Ad-supported)                    │    │
│  │  ○ Exclusive Content (Subscription only)          │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Credits & Lyrics ───────────────────────────────────┐    │
│  │  Writers: [________________________]                │    │
│  │  Producers: [________________________]              │    │
│  │  Copyright: [________________________]              │    │
│  │  Lyrics: [________________________]                │    │
│  │         [________________________]                │    │
│  │         [________________________]                │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Distribution Settings ─────────────────────────────┐    │
│  │  ◉ Publish Immediately                             │    │
│  │  ○ Schedule Release: [📅 2024-12-25] [⏰ 10:00]  │    │
│  │  ○ Save as Draft                                   │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Discard] [Save Draft] [Submit for Review]                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### 3.3.2 Track Management Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  📁 My Music                                                     │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  [Upload New] [Import] [Manage Albums]                          │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Search: [_________________]  Filter: [All ▼] Sort: [▼]  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  ☐ │ Track          │ Album   │ Plays │ Price │ Status │   ││
│  │  ──┼────────────────┼─────────┼───────┼───────┼────────│   ││
│  │  ☐ │ Track 1        │ Album A │ 1.2K  │ K5.00 │ 🟢 Live│   ││
│  │  ☐ │ Track 2        │ Album A │ 850   │ K3.00 │ 🟢 Live│   ││
│  │  ☐ │ Track 3        │ Single  │ 2.3K  │ Free  │ 🟢 Live│   ││
│  │  ☐ │ Track 4        │ Album B │ 45    │ K10.00│ 🟡Draft│   ││
│  │  ☐ │ Track 5        │ Album B │ 12    │ K7.00 │ 🔵Sched│   ││
│  │  ☐ │ Track 6        │ Single  │ 0     │ K2.00 │ 🔴Unpub│   ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                   │
│  Showing 1-6 of 24 tracks    [< Prev] 1 2 3 4 [Next >]          │
│                                                                   │
│  Bulk Actions: [Edit ▼] [Delete]                                 │
└─────────────────────────────────────────────────────────────────────┘
```

#### 3.3.3 Track Detail/Edit View

```
┌─────────────────────────────────────────────────────────────────────┐
│  🎵 Track 1 - Detail View                                       │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  ┌──────────────────────────┐  ┌────────────────────────────┐   │
│  │  [Album Art]             │  │  Track Title: Track 1      │   │
│  │                          │  │  Artist: Ngoma Artist      │   │
│  │  3000x3000px            │  │  Album: Album A            │   │
│  │                          │  │  Genre: Afrobeats, Hip Hop │   │
│  │                          │  │  Released: 2024-11-15     │   │
│  │                          │  │  Price: K5.00             │   │
│  │                          │  │  Plays: 1,234             │   │
│  │                          │  │  Downloads: 567           │   │
│  │                          │  │  Revenue: K2,835.00       │   │
│  └──────────────────────────┘  └────────────────────────────┘   │
│                                                                   │
│  ┌─ Actions ─────────────────────────────────────────────┐    │
│  │  [Edit Track] [Unpublish] [Delete] [Share]           │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Analytics Snapshot ──────────────────────────────────┐    │
│  │  Plays by Day:  ██████████░░░░░░░░░░░░░░░░           │    │
│  │  ────────────────────────────────────────────        │    │
│  │  Top Countries: Kenya (45%), Nigeria (20%),         │    │
│  │                South Africa (15%), Zambia (10%)     │    │
│  │  ────────────────────────────────────────────        │    │
│  │  Age Demographics: 18-24 (40%), 25-34 (35%),        │    │
│  │                     35-44 (15%), 45+ (10%)          │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.4 Analytics & Reporting

#### 3.4.1 Real-Time Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  📊 Artist Dashboard                                            │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐      │
│  │  💰 Total    │  📥 Total    │  👥 Active   │  ⭐ Total   │      │
│  │  Earnings    │  Downloads   │  Fans        │  Plays      │      │
│  │              │              │              │             │      │
│  │  K12,450.00 │  2,345      │  1,234      │  45,678     │      │
│  │  ▲ 23% vs    │  ▲ 15% vs   │  ▲ 8% vs    │  ▲ 32% vs   │      │
│  │  last month  │  last month  │  last month  │  last month  │      │
│  └─────────────┴─────────────┴─────────────┴─────────────┘      │
│                                                                   │
│  ┌─ Earnings Chart ──────────────────────────────────────┐      │
│  │  K3,000 ┤                                    ████    │      │
│  │  K2,500 ┤                                ████████   │      │
│  │  K2,000 ┤                              ██████████  │      │
│  │  K1,500 ┤                  ██████    ████████████  │      │
│  │  K1,000 ┤        ████████████████████████████████  │      │
│  │  K500   ┤  ██████████████████████████████████████  │      │
│  │     0   └────────────────────────────────────────── │      │
│  │         Jan  Feb  Mar  Apr  May  Jun  Jul  Aug     │      │
│  │  Total: K12,450.00  |  Projected: K15,200.00     │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Top Tracks ─────────────────────────────────────────┐      │
│  │  #│ Track          │ Plays │ Downloads │ Revenue   │      │
│  │  ─┼────────────────┼───────┼───────────┼───────────│      │
│  │  1│ Track 1        │ 1.2K  │ 567      │ K2,835   │      │
│  │  2│ Track 3        │ 2.3K  │ 234      │ Free     │      │
│  │  3│ Track 2        │ 850   │ 189      │ K567     │      │
│  │  4│ Track 5        │ 45    │ 12       │ K84      │      │
│  │  5│ Track 6        │ 12    │ 8        │ K16      │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Fan Insights ───────────────────────────────────────┐      │
│  │  Top Countries:                                      │      │
│  │  🇰🇪 Kenya 45%   🇳🇬 Nigeria 20%   🇿🇦 S.Africa 15% │      │
│  │  🇿🇲 Zambia 10%  🇬🇭 Ghana 5%     Other 5%          │      │
│  │                                                    │      │
│  │  Age Distribution:                                 │      │
│  │  18-24 ████████████████████░░░░ 40%               │      │
│  │  25-34 ████████████████░░░░░░░ 35%               │      │
│  │  35-44 ██████░░░░░░░░░░░░░░░░░ 15%               │      │
│  │  45+   ████░░░░░░░░░░░░░░░░░░░ 10%               │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Export Reports] [Download CSV] [Schedule Reports]             │
└─────────────────────────────────────────────────────────────────────┘
```

#### 3.4.2 Financial Reports

```
┌─────────────────────────────────────────────────────────────────────┐
│  💰 Financial Reports                                            │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  Report Period: [Jan 2024 ▼] to [Dec 2024 ▼] [Generate]        │
│                                                                   │
│  ┌─ Summary ────────────────────────────────────────────┐      │
│  │  Total Revenue:        K12,450.00                   │      │
│  │  Platform Fees (10%):  K1,245.00                    │      │
│  │  Net Earnings:         K11,205.00                   │      │
│  │  Pending Payouts:      K2,800.00                    │      │
│  │  Payouts Completed:    K8,405.00                    │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Earnings by Track ──────────────────────────────────┐      │
│  │  Track          │ Downloads │ Price  │ Revenue    │      │
│  │  ───────────────┼───────────┼────────┼────────────│      │
│  │  Track 1        │ 567       │ K5.00  │ K2,835.00 │      │
│  │  Track 2        │ 189       │ K3.00  │ K567.00   │      │
│  │  Track 3        │ 234       │ Free   │ K0.00     │      │
│  │  Track 4        │ 0         │ K10.00 │ K0.00     │      │
│  │  Track 5        │ 12        │ K7.00  │ K84.00    │      │
│  │  Track 6        │ 8         │ K2.00  │ K16.00    │      │
│  │  Total          │ 1,010     │        │ K3,502.00 │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Payout History ───────────────────────────────────┐      │
│  │  Date          │ Amount  │ Status     │ Reference  │      │
│  │  ──────────────┼─────────┼────────────┼────────────│      │
│  │  2024-12-01    │ K2,100  │ ✅ Paid    │ PAY-001   │      │
│  │  2024-11-01    │ K1,850  │ ✅ Paid    │ PAY-002   │      │
│  │  2024-10-01    │ K1,500  │ ✅ Paid    │ PAY-003   │      │
│  │  2024-09-01    │ K1,200  │ ✅ Paid    │ PAY-004   │      │
│  │  2024-08-01    │ K955    │ ✅ Paid    │ PAY-005   │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Download Full Report (PDF)] [Download CSV]                    │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.5 Payouts & Royalties

#### 3.5.1 Earnings Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  💳 Earnings & Payouts                                           │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  ┌────────────┬──────────────────────────────────────────┐      │
│  │  Balance   │  Available:    K8,405.00                │      │
│  │            │  Pending:      K2,800.00                │      │
│  │            │  This Period:  K1,245.00                │      │
│  │            │                                          │      │
│  │            │  [Request Payout]                        │      │
│  └────────────┴──────────────────────────────────────────┘      │
│                                                                   │
│  ┌─ Transaction History ─────────────────────────────────┐      │
│  │  Date          │ Description    │ Amount  │ Type    │      │
│  │  ──────────────┼────────────────┼─────────┼─────────│      │
│  │  2024-12-15    │ Track 1 DL     │ +K5.00  │ Sale    │      │
│  │  2024-12-15    │ Track 3 DL     │ Free    │ Free    │      │
│  │  2024-12-14    │ Tip from Fan   │ +K20.00 │ Tip     │      │
│  │  2024-12-14    │ Track 2 DL     │ +K3.00  │ Sale    │      │
│  │  2024-12-13    │ Track 1 DL     │ +K5.00  │ Sale    │      │
│  │  2024-12-13    │ Platform Fee   │ -K1.00  │ Fee     │      │
│  │  [Load More]                                          │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Payout Settings ───────────────────────────────────┐      │
│  │  Payout Method: MTN Mobile Money                    │      │
│  │  Account Number: +260 97XXXXXXX                     │      │
│  │  Minimum Payout: K100.00                            │      │
│  │  Payout Schedule: Monthly (1st of each month)      │      │
│  │  [Update Payment Method]                            │      │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

#### 3.5.2 Payout Schedule

| Tier | Frequency | Processing Time | Minimum Payout |
|------|-----------|-----------------|----------------|
| Starter | Monthly | 5-7 business days | K200 |
| Professional | Bi-weekly | 3-5 business days | K100 |
| Premium | Weekly | 1-3 business days | K50 |

### 3.6 Fan Engagement

#### 3.6.1 Tipping/Support Interface

```
┌─────────────────────────────────────────────────────────────────────┐
│  💝 Support Ngoma Artist                                         │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  Show your appreciation with a tip!                              │
│                                                                   │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐      │
│  │  K5.00     │  K10.00     │  K25.00     │  K50.00     │      │
│  │  [Select]  │  [Select]   │  [Select]   │  [Select]   │      │
│  └─────────────┴─────────────┴─────────────┴─────────────┘      │
│                                                                   │
│  Or custom amount: K[________]                                   │
│                                                                   │
│  Message (optional):                                             │
│  [____________________________________]                          │
│  [____________________________________]                          │
│                                                                   │
│  Pay with Mobile Money:                                          │
│  ┌──────────────────────────────────────┐                      │
│  │  Provider: [MTN ▼]                   │                      │
│  │  Phone: [+260] [__________________] │                      │
│  └──────────────────────────────────────┘                      │
│                                                                   │
│  [Send Tip]                                                      │
│                                                                   │
│  🔒 100% goes to the artist (minus standard payment fees)      │
└─────────────────────────────────────────────────────────────────────┘
```

#### 3.6.2 Sharing Tools

```
┌─────────────────────────────────────────────────────────────────────┐
│  📤 Share This Track                                            │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  Share Track: Track 1 by Ngoma Artist                          │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Copy Link: https://ngoma.africa/track/abc123           │    │
│  │  [📋 Copy]                                              │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Share on Social:                                                │
│  ┌───────┬───────┬───────┬───────┬───────┬───────┐             │
│  │  📱   │  🐦   │  📷   │  ▶️   │  📘   │  🔗   │             │
│  │WhatsApp│Twitter│IG    │YouTube│FB    │More  │             │
│  └───────┴───────┴───────┴───────┴───────┴───────┘             │
│                                                                   │
│  Embed Code:                                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  <iframe src="https://ngoma.africa/embed/abc123"       │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Generate QR Code]                                              │
└─────────────────────────────────────────────────────────────────────┘
```

#### 3.6.3 Messaging (Optional)

```
┌─────────────────────────────────────────────────────────────────────┐
│  💬 Messages                                                    │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  ┌─────────────┬─────────────────────────────────────────┐      │
│  │  Inbox      │  Fan Name                              │      │
│  │  ───────────│  ──────────────────────────────────────│      │
│  │  📧 Fan A   │  "Love your new track! When's the..." │      │
│  │  📧 Fan B   │  "Can we collab? Here's my work..."   │      │
│  │  📧 Fan C   │  "Will you be performing in Lusaka?"   │      │
│  │  📧 Fan D   │  "Just tipped you! Keep making..."    │      │
│  │  📧 Fan E   │  "Your music changed my life..."      │      │
│  │             │                                        │      │
│  │  [Settings] │  Type a message... [Send]              │      │
│  └─────────────┴─────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Listener/Fan-Facing Features

### 4.1 Music Discovery

#### 4.1.1 Homepage/Discovery Feed

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔥 Discover New Music                                          │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  [Search] [Browse] [Charts] [Playlists] [Profile]                │
│                                                                   │
│  ┌─ Featured For You ────────────────────────────────────┐      │
│  │  🔥 Trending Now                                      │      │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │      │
│  │  │[Cover] │ │[Cover] │ │[Cover] │ │[Cover] │       │      │
│  │  │Track 1 │ │Track 2 │ │Track 3 │ │Track 4 │       │      │
│  │  │Artist A│ │Artist B│ │Artist C│ │Artist D│       │      │
│  │  └────────┘ └────────┘ └────────┘ └────────┘       │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Top Charts ─────────────────────────────────────────┐      │
│  │  🏆 Top 10 This Week                                │      │
│  │  1. Track Name - Artist Name  ████████████░░░░░░  │      │
│  │  2. Track Name - Artist Name  ██████████░░░░░░░░  │      │
│  │  3. Track Name - Artist Name  ████████░░░░░░░░░░  │      │
│  │  4. Track Name - Artist Name  ███████░░░░░░░░░░░  │      │
│  │  5. Track Name - Artist Name  ██████░░░░░░░░░░░░  │      │
│  │  [View All Charts]                                  │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ New Releases ─────────────────────────────────────┐      │
│  │  📅 Just Dropped                                  │      │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │      │
│  │  │[Cover] │ │[Cover] │ │[Cover] │ │[Cover] │    │      │
│  │  │New EP  │ │New EP  │ │New EP  │ │New EP  │    │      │
│  │  │Artist E│ │Artist F│ │Artist G│ │Artist H│    │      │
│  │  └────────┘ └────────┘ └────────┘ └────────┘    │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Recommended for You ───────────────────────────────┐      │
│  │  Based on your listening history                   │      │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │      │
│  │  │[Cover] │ │[Cover] │ │[Cover] │ │[Cover] │    │      │
│  │  │Track A │ │Track B │ │Track C │ │Track D │    │      │
│  │  │Artist I│ │Artist J│ │Artist K│ │Artist L│    │      │
│  │  └────────┘ └────────┘ └────────┘ └────────┘    │      │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

#### 4.1.2 Search & Browse

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔍 Search Music                                                │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  [🔍 Search artists, tracks, albums, genres...]                 │
│                                                                   │
│  Categories:                                                     │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐           │
│  │ 🎵 All  │ 🎤 Artists│ 💿 Albums │ 🎧 Tracks│ 📁 Genres│      │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘           │
│                                                                   │
│  ┌─ Search Results for "Afrobeats" ──────────────────┐         │
│  │  Artists (12):                                     │         │
│  │  ┌────────────────────────────────────┐          │         │
│  │  │  🎤 Artist A (2.3M plays)         │          │         │
│  │  │  🎤 Artist B (1.1M plays)         │          │         │
│  │  │  🎤 Artist C (890K plays)         │          │         │
│  │  └────────────────────────────────────┘          │         │
│  │  Tracks (45):                                     │         │
│  │  ┌────────────────────────────────────┐          │         │
│  │  │  🎵 Track 1 - Artist A (K5.00)   │          │         │
│  │  │  🎵 Track 2 - Artist B (Free)    │          │         │
│  │  │  🎵 Track 3 - Artist C (K3.00)   │          │         │
│  │  └────────────────────────────────────┘          │         │
│  │  Albums (8):                                      │         │
│  │  ┌────────────────────────────────────┐          │         │
│  │  │  💿 Album A - Artist A (2024)     │          │         │
│  │  │  💿 Album B - Artist B (2023)     │          │         │
│  │  └────────────────────────────────────┘          │         │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

#### 4.1.3 Charts

```
┌─────────────────────────────────────────────────────────────────────┐
│  📈 Charts & Rankings                                          │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  [Top 50] [New Releases] [Trending] [Genres] [Countries]         │
│                                                                   │
│  ┌─ Ngoma Top 50 - Zambia ──────────────────────────────┐      │
│  │  Updated: Dec 20, 2024                              │      │
│  │  ┌──────────────────────────────────────────────────┐│      │
│  │  │ # │ Track                 │ Artist    │ Plays  ││      │
│  │  │───┼──────────────────────┼───────────┼────────││      │
│  │  │ 1 │ Summer Vibes         │ Artist A  │ 2.3M   ││      │
│  │  │ 2 │ Niyambe              │ Artist B  │ 1.8M   ││      │
│  │  │ 3 │ African Queen        │ Artist C  │ 1.5M   ││      │
│  │  │ 4 │ Zambian Dream        │ Artist D  │ 1.2M   ││      │
│  │  │ 5 │ Mwala                │ Artist E  │ 980K   ││      │
│  │  │ 6 │ Bemba Beat           │ Artist F  │ 876K   ││      │
│  │  │ 7 │ Nyanja Nights        │ Artist G  │ 765K   ││      │
│  │  │ 8 │ Ku Chalo             │ Artist H  │ 654K   ││      │
│  │  │ 9 │ Tiyende              │ Artist I  │ 543K   ││      │
│  │  │10 │ Twende                │ Artist J  │ 432K   ││      │
│  │  └──────────────────────────────────────────────────┘│      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [View All Charts] [Share Charts]                                │
└─────────────────────────────────────────────────────────────────────┘
```

#### 4.1.4 Playlists

```
┌─────────────────────────────────────────────────────────────────────┐
│  🎵 Playlists                                                   │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  [Create Playlist] [Curated Playlists] [My Playlists]            │
│                                                                   │
│  ┌─ Curated by Ngoma ───────────────────────────────────┐      │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │      │
│  │  │[Cover] │ │[Cover] │ │[Cover] │ │[Cover] │      │      │
│  │  │ Afrobeats│ │ Zambian │ │ Gospel │ │  Hip   │      │      │
│  │  │  Hits   │ │  Gold   │ │  Glory │ │  Hop   │      │      │
│  │  │ 45 songs │ │ 32 songs│ │ 28 songs│ │ 50 songs│      │      │
│  │  └────────┘ └────────┘ └────────┘ └────────┘      │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Trending Playlists ────────────────────────────────┐      │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │      │
│  │  │[Cover] │ │[Cover] │ │[Cover] │ │[Cover] │      │      │
│  │  │Workout │ │Chill   │ │Party   │ │Focus   │      │      │
│  │  │Beats   │ │Vibes   │ │Anthems │ │Flow    │      │      │
│  │  │ 30 songs│ │ 25 songs│ │ 40 songs│ │ 20 songs│      │      │
│  │  └────────┘ └────────┘ └────────┘ └────────┘      │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ User Playlists (You Follow) ──────────────────────┐      │
│  │  ┌────────────────────────────────────┐          │      │
│  │  │  🎧 My Road Trip Mix - by Fan A   │          │      │
│  │  │  🎧 African Grooves - by Fan B    │          │      │
│  │  │  🎧 Sunday Morning - by Fan C     │          │      │
│  │  └────────────────────────────────────┘          │      │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Music Access

#### 4.2.1 Music Player

```
┌─────────────────────────────────────────────────────────────────────┐
│  🎵 Now Playing                                                 │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐       │
│  │               ┌────────────┐                        │       │
│  │               │  Album Art  │                        │       │
│  │               │            │                        │       │
│  │               │    🎵     │                        │       │
│  │               └────────────┘                        │       │
│  │                                                    │       │
│  │  Track Title                                      │       │
│  │  Artist Name  ·  2024                            │       │
│  │                                                    │       │
│  │  ───────────●─────────────────────────────────     │       │
│  │  1:23                              3:45           │       │
│  │                                                    │       │
│  │  ◄◄     ⏸️     ►►     🔁     🔀                  │       │
│  │                                                    │       │
│  │  Volume: ████████░░░░░░░  🔊                      │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                   │
│  ┌─ Track Info ─────────────────────────────────────────┐       │
│  │  Genre: Afrobeats  |  Released: 2024-11-15         │       │
│  │  Price: K5.00  |  Label: Independent               │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Like] [Add to Playlist] [Share] [Download] [Tip Artist]       │
└─────────────────────────────────────────────────────────────────────┘
```

#### 4.2.2 Download Interface

```
┌─────────────────────────────────────────────────────────────────────┐
│  ⬇️ Download Track                                              │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  Track: Summer Vibes                                             │
│  Artist: Ngoma Artist                                            │
│                                                                   │
│  ┌─ Pricing ────────────────────────────────────────────┐       │
│  │  Price: K5.00                                        │       │
│  │  Format: MP3 320kbps (High Quality)                  │       │
│  │  File Size: 8.5 MB                                   │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Payment ────────────────────────────────────────────┐       │
│  │  Pay with Mobile Money:                             │       │
│  │  Provider: [MTN Mobile Money ▼]                     │       │
│  │  Phone: [+260] [__________________]                 │       │
│  │                                                    │       │
│  │  [Pay K5.00]                                       │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  or                                                              │
│  [Sign in to use saved payment method]                          │
│                                                                   │
│  🔒 Secure payment via Ngoma - Your music, your way            │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.3 Payment & Checkout

#### 4.3.1 Checkout Flow

**Step 1: Review Items**
```
┌─────────────────────────────────────────────────────────────────────┐
│  🛒 Checkout                                                    │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  Order Summary:                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  🎵 Summer Vibes - Ngoma Artist       K5.00             │    │
│  │  🎵 African Queen - Artist C           K3.00             │    │
│  │  💝 Tip for Ngoma Artist               K10.00            │    │
│  │  ─────────────────────────────────────────────────         │    │
│  │  Subtotal:                               K18.00           │    │
│  │  Platform Fee:                           K0.00            │    │
│  │  Total:                                  K18.00           │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Continue to Payment]                                           │
└─────────────────────────────────────────────────────────────────────┘
```

**Step 2: Payment Method**
```
┌─────────────────────────────────────────────────────────────────────┐
│  💳 Payment Method                                              │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  ┌─ Mobile Money ───────────────────────────────────────┐       │
│  │  Select Provider:                                    │       │
│  │  ┌──────────────────────────────┐                  │       │
│  │  │  📱 MTN Mobile Money    ◉    │                  │       │
│  │  │  📱 Airtel Money        ○    │                  │       │
│  │  │  📱 Zamtel Kwacha       ○    │                  │       │
│  │  └──────────────────────────────┘                  │       │
│  │                                                    │       │
│  │  Phone Number: [+260] [__________________]        │       │
│  │                                                    │       │
│  │  💡 You'll receive a USSD prompt to confirm       │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Pay K18.00]                                                    │
│                                                                   │
│  [Continue as Guest] [Sign In]                                   │
└─────────────────────────────────────────────────────────────────────┘
```

**Step 3: Confirmation**
```
┌─────────────────────────────────────────────────────────────────────┐
│  ✅ Payment Successful                                          │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  🎉 Thank you for your purchase!                                │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Order #: NG-2024-12-20-001                           │    │
│  │  Date: 2024-12-20 14:30                              │    │
│  │  Amount: K18.00                                      │    │
│  │  Payment Method: MTN Mobile Money                   │    │
│  │  Reference: MOMO-REF-123456                        │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Your downloads are ready:                                      │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  🎵 Summer Vibes - Ngoma Artist    [Download Now]      │    │
│  │  🎵 African Queen - Artist C         [Download Now]     │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Continue Listening] [View Order History]                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### 4.3.2 Guest Checkout

```
┌─────────────────────────────────────────────────────────────────────┐
│  👤 Guest Checkout                                              │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  You're checking out as a guest.                                 │
│                                                                   │
│  ┌─ Contact Information ───────────────────────────────┐       │
│  │  Email: [____________________] (for receipt)        │       │
│  │  Phone: [+260] [__________________]                │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Payment ────────────────────────────────────────────┐       │
│  │  Provider: [MTN Mobile Money ▼]                     │       │
│  │  Phone: [+260] [__________________]                │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Pay K18.00]                                                    │
│                                                                   │
│  💡 Create an account to track purchases and get recommendations │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.4 User Account

#### 4.4.1 Registration/Login

**Sign Up:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  Create Your Account                                            │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Full Name: [______________________]                    │    │
│  │  Email: [______________________]                       │    │
│  │  Password: [______________________]                    │    │
│  │  Confirm Password: [______________________]            │    │
│  │  Phone: [+260] [__________________]                    │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Preferences ─────────────────────────────────────────┐      │
│  │  Favorite Genres: (Select all that apply)             │      │
│  │  ☐ Afrobeats  ☐ Hip Hop  ☐ R&B  ☐ Jazz             │      │
│  │  ☐ Gospel     ☐ Traditional ☐ Electronic ☐ Other    │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Create Account]                                                │
│                                                                   │
│  or continue with:                                              │
│  [Google] [Facebook] [Apple]                                    │
│                                                                   │
│  Already have an account? [Sign In]                             │
└─────────────────────────────────────────────────────────────────────┘
```

#### 4.4.2 Library

```
┌─────────────────────────────────────────────────────────────────────┐
│  📚 My Library                                                  │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  [Downloads] [Purchases] [Wishlist] [Playlists] [History]       │
│                                                                   │
│  ┌─ Downloaded Tracks ──────────────────────────────────┐      │
│  │  ┌──────────────────────────────────────────────┐   │      │
│  │  │ 🎵 Summer Vibes - Artist A  🗑️  ▶️         │   │      │
│  │  │ 🎵 African Queen - Artist C  🗑️  ▶️         │   │      │
│  │  │ 🎵 Zambian Dream - Artist D  🗑️  ▶️         │   │      │
│  │  │ 🎵 Mwala - Artist E          🗑️  ▶️         │   │      │
│  │  └──────────────────────────────────────────────┘   │      │
│  │  Used: 45 MB of 500 MB                             │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Purchase History ──────────────────────────────────┐      │
│  │  Date          │ Item              │ Amount │ Status│      │
│  │  ──────────────┼───────────────────┼────────┼───────│      │
│  │  2024-12-20    │ Summer Vibes      │ K5.00  │ ✅   │      │
│  │  2024-12-20    │ African Queen     │ K3.00  │ ✅   │      │
│  │  2024-12-18    │ Tip - Artist A    │ K10.00 │ ✅   │      │
│  │  2024-12-15    │ Album B - Artist A│ K25.00 │ ✅   │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Wishlist ──────────────────────────────────────────┐      │
│  │  🎵 Track 1 - Artist A    [Add to Cart]            │      │
│  │  🎵 Track 2 - Artist B    [Add to Cart]            │      │
│  │  💿 Album C - Artist C    [Add to Cart]            │      │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Platform Admin Features

### 5.1 Admin Dashboard

#### 5.1.1 Overview Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  📊 Admin Dashboard                                              │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  [Overview] [Users] [Content] [Finance] [Settings]              │
│                                                                   │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐      │
│  │  👥 Total    │  🎵 Total    │  💰 Platform  │  📊 Active │      │
│  │  Users      │  Tracks     │  Revenue    │  Artists   │      │
│  │             │             │             │            │      │
│  │  12,345     │  2,567      │  K45,678   │  234       │      │
│  │  ▲ 12% vs   │  ▲ 18% vs   │  ▲ 25% vs  │  ▲ 8% vs   │      │
│  │  last month │  last month │  last month│  last month│      │
│  └─────────────┴─────────────┴─────────────┴─────────────┘      │
│                                                                   │
│  ┌─ Revenue Chart ───────────────────────────────────────┐      │
│  │  K10K ┤                        ████████             │      │
│  │  K8K  ┤                  ██████████████             │      │
│  │  K6K  ┤              ██████████████████             │      │
│  │  K4K  ┤      ██████████████████████████             │      │
│  │  K2K  ┤  ██████████████████████████████             │      │
│  │  0    └─────────────────────────────────────────     │      │
│  │        Jan  Feb  Mar  Apr  May  Jun  Jul  Aug       │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Recent Activity ───────────────────────────────────┐      │
│  │  🔔 15 new users registered today                   │      │
│  │  🔔 23 tracks uploaded in last 24 hours             │      │
│  │  🔔 78 transactions processed today                │      │
│  │  🔔 2 reports pending review                       │      │
│  │  🔔 5 payout requests pending approval             │      │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

#### 5.1.2 User Management

```
┌─────────────────────────────────────────────────────────────────────┐
│  👥 User Management                                             │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  [All Users] [Artists] [Listeners] [Pending Verification]       │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │  Search: [______________]  Filter: [All ▼] Sort: [▼] │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  User │ Role  │ Joined │ Status │ Tracks │ Actions │      ││
│  │  ─────┼───────┼────────┼────────┼────────┼─────────│      ││
│  │  UserA│Artist │ Jan 24│ 🟢Active│ 23    │ [View]  │      ││
│  │  UserB│Artist │ Feb 24│ 🟡Pending│ 0     │ [Verify]│      ││
│  │  UserC│Listener│Mar 24│ 🟢Active│ -     │ [View]  │      ││
│  │  UserD│Artist │ Apr 24│ 🔴Suspended│12 │ [View]  │      ││
│  │  UserE│Listener│May 24│ 🟢Active│ -     │ [View]  │      ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                   │
│  Showing 1-25 of 12,345 users    [< Prev] 1 2 3 4 [Next >]     │
│                                                                   │
│  Bulk Actions: [Suspend] [Delete]                               │
└─────────────────────────────────────────────────────────────────────┘
```

#### 5.1.3 Content Moderation

```
┌─────────────────────────────────────────────────────────────────────┐
│  🎵 Content Moderation                                          │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  [Pending Review] [Approved] [Rejected] [Reported]              │
│                                                                   │
│  ┌─ Pending Approval ──────────────────────────────────┐       │
│  │  Track              │ Artist   │ Submitted │ Actions │       │
│  │  ───────────────────┼──────────┼───────────┼─────────│       │
│  │  Track Title 1      │ Artist A │ Dec 20   │ [Approve│       │
│  │                     │          │          │ [Reject] │       │
│  │  Track Title 2      │ Artist B │ Dec 20   │ [Approve│       │
│  │                     │          │          │ [Reject] │       │
│  │  Track Title 3      │ Artist C │ Dec 19   │ [Approve│       │
│  │                     │          │          │ [Reject] │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Reported Content ──────────────────────────────────┐       │
│  │  Track              │ Reporter │ Reason    │ Actions │       │
│  │  ───────────────────┼──────────┼───────────┼─────────│       │
│  │  Track Title 4      │ User X   │ Copyright │ [Review]│       │
│  │  Track Title 5      │ User Y   │ Offensive │ [Review]│       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Bulk Approve] [Bulk Reject]                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Financial Management

#### 5.2.1 Revenue Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  💰 Revenue Dashboard                                           │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐      │
│  │  💳 Total    │  📊 Platform │  💼 Artist  │  ⏳ Pending │      │
│  │  Revenue     │  Fees       │  Payouts   │  Payouts   │      │
│  │             │             │             │            │      │
│  │  K45,678   │  K4,568    │  K41,110   │  K8,234    │      │
│  └─────────────┴─────────────┴─────────────┴─────────────┘      │
│                                                                   │
│  ┌─ Revenue Breakdown ──────────────────────────────────┐      │
│  │  Revenue Source      │ Amount    │ Percentage │      │      │
│  │  ────────────────────┼───────────┼────────────│      │      │
│  │  Track Downloads     │ K30,456  │ 66.7%      │      │      │
│  │  Tips                │ K8,234   │ 18.0%      │      │      │
│  │  Subscriptions       │ K4,568   │ 10.0%      │      │      │
│  │  Other               │ K2,420   │ 5.3%       │      │      │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Monthly Trend ──────────────────────────────────────┐      │
│  │  Month    │ Revenue │ Fees │ Payouts               │      │
│  │  ─────────┼─────────┼──────┼───────────────────────│      │
│  │  Jan 2024 │ K2,345  │ K234 │ K2,111               │      │
│  │  Feb 2024 │ K3,456  │ K345 │ K3,111               │      │
│  │  Mar 2024 │ K4,567  │ K456 │ K4,111               │      │
│  │  Apr 2024 │ K5,678  │ K567 │ K5,111               │      │
│  │  May 2024 │ K6,789  │ K678 │ K6,111               │      │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

#### 5.2.2 Payout Management

```
┌─────────────────────────────────────────────────────────────────────┐
│  💳 Payout Management                                          │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  [Pending] [Approved] [Completed] [Failed]                      │
│                                                                   │
│  ┌─ Pending Payouts ───────────────────────────────────┐       │
│  │  Artist   │ Amount │ Requested │ Payment Method │ Actions │       │
│  │  ─────────┼────────┼───────────┼───────────────┼─────────│       │
│  │  Artist A │ K2,100 │ Dec 20   │ MTN Momo     │ [Approve│       │
│  │           │        │           │ (+260 97XXX) │ [Reject]│       │
│  │  Artist B │ K1,850 │ Dec 20   │ Airtel Money │ [Approve│       │
│  │           │        │           │ (+260 95XXX) │ [Reject]│       │
│  │  Artist C │ K1,500 │ Dec 19   │ Zamtel Kwacha│ [Approve│       │
│  │           │        │           │ (+260 96XXX) │ [Reject]│       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Process Selected] [Process All] [Export Report]               │
│                                                                   │
│  ┌─ Payout Summary ────────────────────────────────────┐       │
│  │  Total Pending: K8,234    │  This Month: K12,234 │       │
│  │  Last Processed: Dec 15   │  Next Process: Jan 1 │       │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

#### 5.2.3 Fee Configuration

```
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️ Fee Configuration                                           │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  ┌─ Platform Fees ──────────────────────────────────────┐       │
│  │  Starter Tier:      [0%]                            │       │
│  │  Professional Tier: [10%]                           │       │
│  │  Premium Tier:      [5%]                            │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Subscription Pricing ──────────────────────────────┐       │
│  │  Professional: K[150.00] / month                   │       │
│  │  Premium:      K[300.00] / month                   │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Payout Settings ────────────────────────────────────┐       │
│  │  Minimum Payout:    K[100.00]                      │       │
│  │  Payout Frequency:  [Monthly ▼]                    │       │
│  │  Processing Fee:    K[0.00]                        │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Save Changes] [Reset to Defaults]                             │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.3 Configuration & Settings

#### 5.3.1 Payment Gateway Configuration

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔧 Payment Gateway Configuration                               │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  ⚠️ This configuration is for administrators only.              │
│                                                                   │
│  ┌─ PawaPay Configuration ──────────────────────────────┐       │
│  │  Environment:                                        │       │
│  │  ◉ Sandbox  ○ Production                            │       │
│  │                                                    │       │
│  │  API Token: [••••••••••••••••••••••••••••••••]    │       │
│  │                                                    │       │
│  │  Callback URLs:                                    │       │
│  │  Deposit Callback: [https://api.ngoma.africa/...] │       │
│  │  Withdrawal Callback: [https://api.ngoma.africa/.]│       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Mobile Money Providers ─────────────────────────────┐       │
│  │  Provider       │ Enabled │ Correspondent ID        │       │
│  │  ───────────────┼─────────┼────────────────────────│       │
│  │  MTN Mobile Money│ ✅ Yes │ MTN_MOMO_UGA          │       │
│  │  Airtel Money   │ ✅ Yes │ AIRTEL_MOMO_UGA       │       │
│  │  Zamtel Kwacha  │ ✅ Yes │ ZAMTEL_MOMO_ZAM       │       │
│  │  Vodafone Cash  │ ○ No   │ VODAFONE_CASH_TZA     │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Test Connection] [Save Configuration]                         │
└─────────────────────────────────────────────────────────────────────┘
```

#### 5.3.2 Country & Currency Configuration

```
┌─────────────────────────────────────────────────────────────────────┐
│  🌍 Country & Currency Configuration                           │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  ┌─ Supported Countries ────────────────────────────────┐       │
│  │  Country      │ Currency │ Mobile Money │ Status    │       │
│  │  ─────────────┼──────────┼──────────────┼───────────│       │
│  │  Zambia      │ ZMW      │ ✅ MTN/Airtel│ ✅ Active │       │
│  │  Nigeria     │ NGN      │ ✅ MTN/Airtel│ ✅ Active │       │
│  │  Kenya       │ KES      │ ✅ MTN/Safaric│ ✅ Active│       │
│  │  Tanzania    │ TZS      │ ✅ Vodacom    │ ✅ Active│       │
│  │  South Africa│ ZAR      │ ✅ All        │ ✅ Active│       │
│  │  Ghana       │ GHS      │ ✅ MTN        │ ○ Pending│       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Default Settings ───────────────────────────────────┐       │
│  │  Default Country: [Zambia ▼]                        │       │
│  │  Default Currency: [ZMW (K) ▼]                      │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Add Country] [Save Changes]                                   │
└─────────────────────────────────────────────────────────────────────┘
```

#### 5.3.3 General Settings

```
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️ General Platform Settings                                  │
│  ──────────────────────────────────────────────────────────────── │
│                                                                   │
│  ┌─ Platform Info ──────────────────────────────────────┐       │
│  │  Platform Name: [Ngoma]                            │       │
│  │  Support Email: [support@ngoma.africa]             │       │
│  │  Support Phone: [+260 97XXXXXXX]                  │       │
│  │  Website URL: [https://ngoma.africa]              │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Branding ───────────────────────────────────────────┐       │
│  │  Logo: [Current Logo] [Upload New]                 │       │
│  │  Favicon: [Current] [Upload New]                   │       │
│  │  Primary Color: [#C0672E] [Color Picker]          │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Features ───────────────────────────────────────────┐       │
│  │  ✅ Artist Verification (Blue Badge)                │       │
│  │  ✅ Tipping System                                  │       │
│  │  ✅ Messaging System                                │       │
│  │  ✅ Guest Checkout                                  │       │
│  │  ○ Streaming Tier (Free)                            │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─ Security ───────────────────────────────────────────┐       │
│  │  Rate Limiting: [100] requests/minute               │       │
│  │  Session Timeout: [60] minutes                     │       │
│  │  2FA Required for Admins: [✅]                     │       │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Save Changes]                                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Technical & Backend Requirements

### 6.1 Technology Stack

#### 6.1.1 Frontend
| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Framework** | React 18+ with Vite | Fast SPA development, mobile-first, same stack as `mako/client` |
| **UI Library** | Tailwind CSS | Utility-first, responsive, customizable |
| **Component Lib** | shadcn/ui + Radix UI | Accessible, customizable components |
| **State Management** | Zustand + React Query | Simple state, server-state management |
| **Form Handling** | React Hook Form + Zod | Performant forms with validation |
| **Animations** | Framer Motion | Smooth, performant animations |
| **Audio Player** | Howler.js | Cross-browser audio playback |
| **PWA Support** | vite-plugin-pwa | Offline support, installable |

#### 6.1.2 Backend
| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Runtime** | Node.js 20+ | JavaScript full-stack, NPM ecosystem |
| **Framework** | NestJS 11+ | Modular architecture, DI, same stack as `mako/api` |
| **ORM** | TypeORM | PostgreSQL-native entities, migrations, repository pattern |
| **Auth** | @nestjs/jwt + Passport | JWT guards, strategies, refresh tokens |
| **API Style** | RESTful | Standard, documented via Swagger |
| **Validation** | class-validator + class-transformer | DTO validation via NestJS ValidationPipe |
| **File Upload** | Multer + Supabase Storage / S3 | Efficient file handling |
| **Queue System** | @nestjs/bullmq (BullMQ) | Background job processing |
| **Logging** | NestJS Logger | Structured application logging |
| **Rate Limiting** | @nestjs/throttler | API protection with Redis-backed throttling |

#### 6.1.3 Database
| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Database** | PostgreSQL 15+ | Reliable, feature-rich, ACID compliant |
| **Caching** | Redis | Session storage, rate limiting, queues |
| **Search** | PostgreSQL Full-Text / Elasticsearch | Efficient content search |
| **Storage** | AWS S3 / Supabase Storage | Scalable file storage |

#### 6.1.4 Infrastructure
| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Hosting** | AWS / Hetzner / static CDN | React SPA + NestJS API deployment |
| **Container** | Docker + Docker Compose | Consistent environments |
| **CI/CD** | GitHub Actions | Automated testing and deployment |
| **Monitoring** | Sentry + LogRocket | Error tracking, user analytics |
| **Analytics** | Plausible / PostHog | Privacy-focused analytics |

### 6.2 System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     N G O M A  S Y S T E M  A R C H I T E C T U R E  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────┐                                              │
│  │   Web Client  │  (React + Vite + Tailwind)                  │
│  │   (Browser)   │                                              │
│  └───────┬───────┘                                              │
│          │ HTTPS                                                │
│          ▼                                                      │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐     │
│  │   CDN/Edge    │──│   NestJS API  │  │   Media       │     │
│  │   (CloudFlare)│  │   (api/)      │  │   Storage    │     │
│  └───────────────┘  └───────┬───────┘  │   (S3)      │     │
│                              │          └───────────────┘     │
│                              ▼                                │
│  ┌───────────────────────────────────────────────────────┐    │
│  │                    Application Layer                  │    │
│  ├───────────┬───────────┬───────────┬──────────────────┤    │
│  │  Auth     │  Music    │  Payment  │  Analytics       │    │
│  │  Service  │  Service  │  Service  │  Service         │    │
│  └───────────┴───────────┴───────────┴──────────────────┘    │
│                              │                                │
│                              ▼                                │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐     │
│  │  PostgreSQL   │  │    Redis      │  │  Elasticsearch│     │
│  │  (Main DB)    │  │  (Cache/Queue)│  │  (Search)    │     │
│  └───────────────┘  └───────────────┘  └───────────────┘     │
│                                                                   │
│  ┌───────────────────────────────────────────────────────┐       │
│  │              External Services                       │       │
│  ├───────────┬───────────┬───────────┬──────────────────┤       │
│  │  PawaPay  │   Email   │   SMS     │  Social Auth    │       │
│  │  (Mobile  │  Service  │  Service  │  (Google/FB)   │       │
│  │   Money)  │          │          │                 │       │
│  └───────────┴───────────┴───────────┴──────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
```

#### 6.2.1 NestJS API Project Structure

The Ngoma API follows the same modular NestJS layout as `mako/api`:

```
api/
├── src/
│   ├── main.ts                    # Bootstrap, CORS, ValidationPipe, Swagger
│   ├── app.module.ts              # Root module — imports all feature modules
│   ├── setup-swagger.ts           # OpenAPI documentation
│   ├── config/                    # App configuration helpers
│   ├── database/                  # TypeORM config (ormconfig)
│   ├── common/                    # Shared guards, DTOs, utilities, audit
│   ├── decorators/                # Custom parameter/method decorators
│   ├── filters/                   # Global exception filters
│   ├── guards/                    # App-level guards
│   ├── interceptors/              # Request/response interceptors
│   ├── exceptions/                # Custom HTTP exceptions
│   ├── providers/                 # Shared providers
│   └── modules/                   # Feature modules (one domain per folder)
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── guards/
│       │   ├── strategies/
│       │   ├── dto/
│       │   └── entities/
│       ├── user/
│       ├── payments/
│       ├── tracks/
│       ├── artists/
│       ├── subscriptions/
│       ├── analytics/
│       ├── media/
│       ├── health/
│       └── ...
├── database/
│   └── migrations/                # TypeORM migration files
├── test/                          # E2E tests
├── scripts/                       # Seed, deploy, migration helpers
├── config/                        # External config files
├── public/                        # Static assets served by API
├── uploads/                       # Local upload storage (dev)
├── Dockerfile
├── nest-cli.json
├── tsconfig.json
└── package.json
```

**Module convention** (each feature under `src/modules/<name>/`):

| File | Purpose |
|------|---------|
| `<name>.module.ts` | Registers controller, service, TypeORM entities |
| `<name>.controller.ts` | REST endpoints under `/api/v1/...` |
| `<name>.service.ts` | Business logic, repository access |
| `entities/` | TypeORM entity definitions |
| `dto/` | Request/response DTOs with class-validator decorators |
| `guards/` | Module-specific authorization guards (optional) |

**React client structure** (aligned with `mako/client`):

```
client/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/                       # API client, utilities
│   └── stores/
├── vite.config.ts                 # Dev proxy to NestJS API (:4000)
├── Dockerfile
└── package.json
```

### 6.3 API Architecture

#### 6.3.1 API Structure
```
├── /api/v1/
│   ├── /auth/
│   │   ├── /register          (POST)  - User registration
│   │   ├── /login             (POST)  - User login
│   │   ├── /logout            (POST)  - User logout
│   │   ├── /refresh           (POST)  - Refresh token
│   │   └── /me                (GET)   - Get current user
│   │
│   ├── /users/
│   │   ├── /profile           (GET)   - Get user profile
│   │   ├── /profile           (PUT)   - Update profile
│   │   ├── /settings          (GET)   - Get settings
│   │   └── /settings          (PUT)   - Update settings
│   │
│   ├── /artists/
│   │   ├── /                  (GET)   - List artists
│   │   ├── /:id               (GET)   - Get artist details
│   │   ├── /:id/tracks        (GET)   - Get artist tracks
│   │   ├── /:id/albums        (GET)   - Get artist albums
│   │   └── /verify            (POST)  - Submit verification
│   │
│   ├── /tracks/
│   │   ├── /                  (GET)   - List tracks
│   │   ├── /                  (POST)  - Upload track
│   │   ├── /:id               (GET)   - Get track details
│   │   ├── /:id               (PUT)   - Update track
│   │   ├── /:id               (DELETE)- Delete track
│   │   ├── /:id/download      (GET)   - Download track
│   │   └── /:id/stream        (GET)   - Stream track
│   │
│   ├── /payments/
│   │   ├── /deposit           (POST)  - Create payment
│   │   ├── /webhook           (POST)  - PawaPay webhook
│   │   ├── /history           (GET)   - Payment history
│   │   └── /status/:id        (GET)   - Check payment status
│   │
│   ├── /subscriptions/
│   │   ├── /plans             (GET)   - List subscription plans
│   │   ├── /current           (GET)   - Current subscription
│   │   ├── /subscribe         (POST)  - Subscribe to plan
│   │   └── /cancel            (POST)  - Cancel subscription
│   │
│   ├── /analytics/
│   │   ├── /dashboard         (GET)   - Artist dashboard
│   │   ├── /earnings          (GET)   - Earnings breakdown
│   │   ├── /fans              (GET)   - Fan insights
│   │   └── /download          (GET)   - Export report
│   │
│   ├── /payouts/
│   │   ├── /                  (GET)   - List payouts
│   │   ├── /request           (POST)  - Request payout
│   │   └── /:id               (GET)   - Get payout details
│   │
│   ├── /discovery/
│   │   ├── /trending          (GET)   - Trending tracks
│   │   ├── /new-releases      (GET)   - New releases
│   │   ├── /recommended       (GET)   - Recommended tracks
│   │   └── /charts            (GET)   - Chart data
│   │
│   └── /admin/
│       ├── /users             (GET)   - List users
│       ├── /users/:id         (PUT)   - Update user
│       ├── /users/:id         (DELETE)- Delete user
│       ├── /reports           (GET)   - Content reports
│       ├── /reports/:id       (PUT)   - Review report
│       ├── /payouts           (GET)   - List payout requests
│       └── /payouts/:id       (PUT)   - Process payout
```

#### 6.3.2 API Security
| Feature | Implementation |
|---------|---------------|
| **Authentication** | JWT tokens (expiry: 24h, refresh: 7d) |
| **Authorization** | Role-based (Artist, Listener, Admin) |
| **Rate Limiting** | 100 req/min per IP, 500 req/min for admins |
| **CORS** | Whitelisted domains only |
| **HTTPS** | Enforce TLS 1.2+ |
| **Input Validation** | class-validator DTOs via ValidationPipe |
| **SQL Injection** | Parameterized queries (TypeORM) |
| **XSS Protection** | Helmet (NestJS), input sanitization |

#### 6.3.3 Rate Limiting Plan
| User Type | Requests/Minute | Burst Limit |
|-----------|-----------------|-------------|
| Public/Anonymous | 30 | 50 |
| Authenticated User | 100 | 150 |
| Artist | 150 | 200 |
| Premium Artist | 200 | 300 |
| Admin | 500 | 1000 |

---

## 7. Payment Integration (PawaPay)

### 7.1 Complete Implementation Guide

#### 7.1.1 System Requirements
| Requirement | Specification |
|-------------|---------------|
| **PHP Version** | 8.0 or higher |
| **Node.js Version** | 18+ (for webhook handler) |
| **Composer** | For PHP dependency management |
| **cURL** | Enabled for API calls |
| **OpenSSL** | Enabled for secure communication |
| **SSL Certificate** | Valid, production-ready |
| **PostgreSQL** | 13+ for database |

#### 7.1.2 Installation
```bash
# Install NestJS API dependencies
cd api && yarn install

# Install React client dependencies
cd client && yarn install
```

#### 7.1.3 Environment Configuration
```env
# Application
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@localhost:5432/ngoma

# PawaPay Configuration
PAWAPAY_ENVIRONMENT=sandbox  # or production
PAWAPAY_SANDBOX_API_TOKEN=your_sandbox_token_here
PAWAPAY_PRODUCTION_API_TOKEN=your_production_token_here

# Webhook URLs
PAWAPAY_WEBHOOK_URL=https://api.ngoma.africa/api/v1/payments/webhook

# Security
JWT_SECRET=your_jwt_secret_key
WEBHOOK_SECRET=your_webhook_secret_key
```

#### 7.1.4 Payment Service Implementation (NestJS)

```typescript
// src/modules/payments/pawapay.client.ts
import axios, { AxiosInstance } from 'axios';
import { randomUUID } from 'crypto';

export class PawaPayClient {
  private readonly client: AxiosInstance;

  constructor(
    private readonly environment: string,
    private readonly apiToken: string,
    private readonly webhookUrl: string,
  ) {
    const baseUrl =
      environment === 'production'
        ? 'https://api.pawapay.io'
        : 'https://api.sandbox.pawapay.io';

    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async createDeposit(params: {
    amount: number;
    currency: string;
    payerMsisdn: string;
    correspondentId: string;
  }) {
    const depositId = `DEP-${Date.now()}-${randomUUID().slice(0, 8)}`;

    const response = await this.client.post('/deposits', {
      depositId,
      amount: String(params.amount),
      currency: params.currency,
      payerMsisdn: this.formatPhoneNumber(params.payerMsisdn),
      correspondentId: params.correspondentId,
      callbackUrl: this.webhookUrl,
    });

    return {
      depositId,
      transactionId: response.data.transactionId,
      status: response.data.status,
      paymentReference: response.data.paymentReference,
    };
  }

  async getDepositStatus(depositId: string) {
    const response = await this.client.get(`/deposits/${depositId}`);
    return {
      status: response.data.status,
      transactionId: response.data.transactionId,
      amount: response.data.amount,
      currency: response.data.currency,
    };
  }

  formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) cleaned = '260' + cleaned.slice(1);
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  }

  getCorrespondents() {
    return [
      { id: 'MTN_MOMO_UGA', name: 'MTN Mobile Money', countries: ['UG', 'ZM'] },
      { id: 'AIRTEL_MOMO_UGA', name: 'Airtel Money', countries: ['UG', 'ZM'] },
      { id: 'ZAMTEL_MOMO_ZAM', name: 'Zamtel Kwacha', countries: ['ZM'] },
      { id: 'VODACOM_MOMO_TZA', name: 'Vodacom M-Pesa', countries: ['TZ'] },
      { id: 'SAFARICOM_MOMO_KEN', name: 'Safaricom M-Pesa', countries: ['KE'] },
    ];
  }
}
```

#### 7.1.5 Webhook Handler Implementation

```typescript
// src/modules/payments/payments.service.ts (excerpt)
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { DownloadAccess } from '../tracks/entities/download-access.entity';
import { Earnings } from '../artists/entities/earnings.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>,
    @InjectRepository(DownloadAccess)
    private readonly downloadAccessRepo: Repository<DownloadAccess>,
    @InjectRepository(Earnings)
    private readonly earningsRepo: Repository<Earnings>,
  ) {}

  async handlePawaPayWebhook(body: { event: string; data: Record<string, unknown> }) {
    const { event, data } = body;
    this.logger.log(`Webhook received: ${event}`);

    switch (event) {
      case 'deposit.success':
        await this.handleDepositSuccess(data);
        break;
      case 'deposit.failed':
        await this.handleDepositFailed(data);
        break;
      case 'deposit.pending':
        await this.handleDepositPending(data);
        break;
      default:
        this.logger.warn(`Unknown webhook event: ${event}`);
    }

    return { received: true };
  }

  private async handleDepositSuccess(data: Record<string, unknown>) {
    const { depositId, transactionId, amount, currency } = data as {
      depositId: string;
      transactionId: string;
      amount: string;
      currency: string;
    };

    const payment = await this.paymentsRepo.findOne({ where: { depositId } });
    if (!payment) return;

    payment.status = 'COMPLETED';
    payment.transactionId = transactionId;
    payment.completedAt = new Date();
    await this.paymentsRepo.save(payment);

    if (payment.purpose === 'TRACK_DOWNLOAD') {
      await this.downloadAccessRepo.save({
        userId: payment.userId,
        trackId: payment.trackId,
        paymentId: payment.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }

    if (payment.purpose === 'TIP' || payment.purpose === 'TRACK_DOWNLOAD') {
      const amountInZmw = parseFloat(amount) / 100;
      const artistShare =
        payment.purpose === 'TIP'
          ? amountInZmw * 0.95
          : amountInZmw * 0.90;

      await this.earningsRepo.save({
        artistId: payment.artistId,
        userId: payment.userId,
        trackId: payment.trackId,
        amount: artistShare,
        platformFee: amountInZmw - artistShare,
        source: payment.purpose,
        paymentId: payment.id,
      });
    }
  }

  private async handleDepositFailed(data: Record<string, unknown>) {
    const { depositId, errorCode, errorMessage } = data as {
      depositId: string;
      errorCode: string;
      errorMessage: string;
    };

    await this.paymentsRepo.update(
      { depositId },
      { status: 'FAILED', errorCode, errorMessage },
    );
  }

  private async handleDepositPending(data: Record<string, unknown>) {
    const { depositId } = data as { depositId: string };
    await this.paymentsRepo.update({ depositId }, { status: 'PENDING' });
  }
}
```

```typescript
// src/modules/payments/payments.controller.ts (webhook endpoint)
import { Body, Controller, Post } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('webhook')
  @ApiExcludeEndpoint()
  webhook(@Body() body: { event: string; data: Record<string, unknown> }) {
    return this.payments.handlePawaPayWebhook(body);
  }
}
```

#### 7.1.6 Payment Controller

```typescript
// src/modules/payments/payments.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@ApiTags('Payments')
@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  initiatePayment(@Body() dto: InitiatePaymentDto, @Req() req: Request) {
    return this.payments.initiatePayment(dto, req.user?.['sub'] as string);
  }

  @Get('status/:depositId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  checkPaymentStatus(@Param('depositId') depositId: string) {
    return this.payments.checkDepositStatus(depositId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getPaymentHistory(
    @Req() req: Request,
    @Query('limit') limit = 50,
    @Query('offset') offset = 0,
  ) {
    return this.payments.getPaymentHistory(
      req.user?.['sub'] as string,
      Number(limit),
      Number(offset),
    );
  }
}
```

```typescript
// src/modules/payments/dto/initiate-payment.dto.ts
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class InitiatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  provider: string;

  @IsString()
  purpose: string;

  @IsUUID()
  itemId: string;
}
```

#### 7.1.7 Testing Phone Numbers (Sandbox)

| Phone Number | Status | Description |
|--------------|--------|-------------|
| +256783456789 | Success | Simulates successful payment |
| +256783456790 | Failed | Simulates failed payment |
| +256783456791 | Pending | Simulates pending payment |
| +256783456792 | Success | With specific error handling |

---

## 8. Database Schema

### 8.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     N G O M A  D A T A B A S E  S C H E M A          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐          ┌──────────────┐                     │
│  │    User      │          │   Artist     │                     │
│  ├──────────────┤          ├──────────────┤                     │
│  │ id           │1──────1  │ id           │                     │
│  │ email        │          │ userId       │                     │
│  │ password     │          │ bio          │                     │
│  │ phone        │          │ genres       │                     │
│  │ name         │          │ socialLinks  │                     │
│  │ role         │          │ verified     │                     │
│  │ country      │          │ subscription │                     │
│  └──────────────┘          └──────────────┘                     │
│         │                            │                           │
│         │1                           │1                           │
│         │                            │                           │
│         │                            │                           │
│  ┌──────▼──────────┐          ┌──────▼──────────┐              │
│  │   Payment       │          │     Track       │              │
│  ├─────────────────┤          ├─────────────────┤              │
│  │ id              │          │ id              │              │
│  │ userId          │          │ artistId        │              │
│  │ depositId       │          │ albumId         │              │
│  │ amount          │          │ title           │              │
│  │ currency        │          │ description     │              │
│  │ provider        │          │ genre           │              │
│  │ status          │          │ price           │              │
│  │ purpose         │          │ pricingType     │              │
│  │ itemId          │          │ releaseDate     │              │
│  │ transactionId   │          │ coverArt        │              │
│  │ completedAt     │          │ audioFile       │              │
│  └─────────────────┘          │ plays           │              │
│         │1                    │ downloads       │              │
│         │                     │ isActive        │              │
│         │                     └─────────────────┘              │
│         │                            │                           │
│         │                            │                           │
│  ┌──────▼───────────────────┐       │1                          │
│  │   DownloadAccess         │       │                           │
│  ├──────────────────────────┤       │                           │
│  │ id                       │       │                           │
│  │ userId                   │◄──────┘                           │
│  │ trackId                  │                                   │
│  │ paymentId                │                                   │
│  │ expiresAt                │                                   │
│  └──────────────────────────┘                                   │
│                                                                   │
│  ┌──────────────┐          ┌──────────────┐                     │
│  │   Earnings   │          │  Payouts     │                     │
│  ├──────────────┤          ├──────────────┤                     │
│  │ id           │          │ id           │                     │
│  │ artistId     │          │ artistId     │                     │
│  │ userId       │          │ amount       │                     │
│  │ trackId      │          │ currency     │                     │
│  │ amount       │          │ status       │                     │
│  │ platformFee  │          │ requestedAt  │                     │
│  │ source       │          │ processedAt  │                     │
│  │ createdAt    │          │ reference    │                     │
│  └──────────────┘          └──────────────┘                     │
│                                                                   │
│  ┌──────────────┐          ┌──────────────┐                     │
│  │  Playlist    │          │  Album       │                     │
│  ├──────────────┤          ├──────────────┤                     │
│  │ id           │          │ id           │                     │
│  │ userId       │          │ artistId     │                     │
│  │ name         │          │ title        │                     │
│  │ description  │          │ description  │                     │
│  │ isPublic     │          │ coverArt     │                     │
│  │ createdAt    │          │ releaseDate  │                     │
│  └──────────────┘          └──────────────┘                     │
│         │                            │                           │
│         │m                           │1                          │
│         │                            │                           │
│  ┌──────▼──────────┐          ┌──────▼──────────┐              │
│  │ PlaylistTrack   │          │    Tip          │              │
│  ├─────────────────┤          ├─────────────────┤              │
│  │ id              │          │ id              │              │
│  │ playlistId      │          │ artistId        │              │
│  │ trackId         │          │ userId          │              │
│  │ position        │          │ amount          │              │
│  └─────────────────┘          │ paymentId       │              │
│                               │ message         │              │
│                               │ createdAt       │              │
│                               └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.2 Complete SQL Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'LISTENER' CHECK (role IN ('LISTENER', 'ARTIST', 'ADMIN')),
  country VARCHAR(50),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Artists Table
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artist_name VARCHAR(100) NOT NULL,
  bio TEXT,
  genres TEXT[],
  social_links JSONB,
  website VARCHAR(255),
  cover_image_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_submitted BOOLEAN DEFAULT FALSE,
  subscription_tier VARCHAR(20) DEFAULT 'STARTER' CHECK (subscription_tier IN ('STARTER', 'PROFESSIONAL', 'PREMIUM')),
  subscription_expires_at TIMESTAMP,
  total_plays BIGINT DEFAULT 0,
  total_downloads BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Albums Table
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_art_url TEXT,
  release_date DATE,
  type VARCHAR(20) DEFAULT 'SINGLE' CHECK (type IN ('SINGLE', 'EP', 'ALBUM')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracks Table
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  genre VARCHAR(50),
  language VARCHAR(50),
  pricing_type VARCHAR(20) DEFAULT 'SET_PRICE' CHECK (pricing_type IN ('SET_PRICE', 'PAY_WHAT_YOU_WANT', 'FREE', 'EXCLUSIVE')),
  price DECIMAL(10, 2),
  min_price DECIMAL(10, 2),
  audio_file_url TEXT NOT NULL,
  cover_art_url TEXT,
  duration INTEGER,
  lyrics TEXT,
  credits JSONB,
  release_date DATE,
  release_time TIME,
  is_published BOOLEAN DEFAULT FALSE,
  is_draft BOOLEAN DEFAULT TRUE,
  is_scheduled BOOLEAN DEFAULT FALSE,
  scheduled_release TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  plays BIGINT DEFAULT 0,
  downloads BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_artist_published (artist_id, is_published)
);

-- Playlists Table
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  cover_art_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  is_curated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Playlist Tracks Junction Table
CREATE TABLE playlist_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  position INTEGER,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(playlist_id, track_id)
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deposit_id VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZMW',
  provider VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'INITIATED' CHECK (status IN ('INITIATED', 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
  purpose VARCHAR(50) CHECK (purpose IN ('TRACK_DOWNLOAD', 'ALBUM_PURCHASE', 'SUBSCRIPTION', 'TIP')),
  item_id UUID,
  transaction_id VARCHAR(255),
  error_code VARCHAR(50),
  error_message TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Download Access Table
CREATE TABLE download_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  expires_at TIMESTAMP,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, track_id)
);

-- Earnings Table
CREATE TABLE earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) DEFAULT 0,
  source VARCHAR(20) CHECK (source IN ('DOWNLOAD', 'TIP', 'SUBSCRIPTION')),
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  is_paid_out BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payouts Table
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZMW',
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
  payment_method VARCHAR(50),
  phone_number VARCHAR(20),
  reference VARCHAR(255),
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  completed_at TIMESTAMP,
  notes TEXT
);

-- Tips Table
CREATE TABLE tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content Reports Table
CREATE TABLE content_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  reason VARCHAR(50) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'DISMISSED', 'ACTION_TAKEN')),
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions Table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('STARTER', 'PROFESSIONAL', 'PREMIUM')),
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Activity Log
CREATE TABLE admin_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  details JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_tracks_artist_release ON tracks(artist_id, release_date DESC);
CREATE INDEX idx_tracks_genre ON tracks(genre);
CREATE INDEX idx_earnings_artist_paid ON earnings(artist_id, is_paid_out);
CREATE INDEX idx_payments_user_status ON payments(user_id, status);
CREATE INDEX idx_payouts_artist_status ON payouts(artist_id, status);
CREATE INDEX idx_download_access_user_track ON download_access(user_id, track_id);
CREATE INDEX idx_tips_artist_created ON tips(artist_id, created_at DESC);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON tracks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON albums FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON playlists FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
```

---

## 9. API Architecture

### 9.1 API Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │  Client  │───▶│  Login   │───▶│  JWT     │───▶│  Access │   │
│  │  (Frontend)│   │  Request │    │  Generated│    │  Resource│   │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘   │
│       │               │               │               │           │
│       │               │               │               │           │
│       ▼               ▼               ▼               ▼           │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  1. POST /api/v1/auth/login                             │    │
│  │     Body: { email, password }                           │    │
│  │                                                          │    │
│  │  2. Server validates credentials                        │    │
│  │                                                          │    │
│  │  3. Server generates JWT (access + refresh)             │    │
│  │                                                          │    │
│  │  4. Client stores JWT (httpOnly cookie or localStorage) │    │
│  │                                                          │    │
│  │  5. Client sends JWT in Authorization header            │    │
│  │     Authorization: Bearer <token>                       │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.2 API Response Format

```javascript
// Success Response
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful",
  "timestamp": "2024-12-20T10:00:00Z"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": {
      "email": "Email is required"
    }
  },
  "timestamp": "2024-12-20T10:00:00Z"
}

// Paginated Response
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "total": 100,
      "limit": 20,
      "offset": 0,
      "next": "/api/v1/tracks?limit=20&offset=20",
      "prev": null
    }
  },
  "message": "Success",
  "timestamp": "2024-12-20T10:00:00Z"
}
```

### 9.3 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_001 | 401 | Invalid credentials |
| AUTH_002 | 401 | Token expired |
| AUTH_003 | 403 | Insufficient permissions |
| VAL_001 | 400 | Validation error |
| VAL_002 | 400 | Invalid input format |
| RES_001 | 404 | Resource not found |
| RES_002 | 409 | Resource conflict |
| PAY_001 | 400 | Payment failed |
| PAY_002 | 402 | Insufficient funds |
| PAY_003 | 503 | Payment service unavailable |
| DB_001 | 500 | Database error |
| SYS_001 | 500 | Internal server error |

---

## 10. Security Requirements

### 10.1 Security Checklist

| Category | Requirement | Status |
|----------|-------------|--------|
| **Authentication** | JWT with short expiry (24h) | ✅ |
| | Refresh token rotation | ✅ |
| | 2FA for admin accounts | ✅ |
| | Password hashing (bcrypt) | ✅ |
| | Account lockout (5 attempts) | ✅ |
| | Session timeout (30 min) | ✅ |
| **Authorization** | Role-based access control | ✅ |
| | Resource-level permissions | ✅ |
| | Admin-only endpoints | ✅ |
| **Data Protection** | HTTPS enforced | ✅ |
| | Data encryption at rest | ✅ |
| | PII data masked in logs | ✅ |
| | GDPR compliance ready | ✅ |
| **API Security** | Rate limiting | ✅ |
| | CORS whitelist | ✅ |
| | Input validation (class-validator) | ✅ |
| | SQL injection protection | ✅ |
| | XSS protection | ✅ |
| | CSRF protection (forms) | ✅ |
| **Infrastructure** | Environment variables | ✅ |
| | Secrets management | ✅ |
| | Regular security audits | ✅ |
| | DDoS protection | ✅ |
| | WAF in front of API | ✅ |
| **Monitoring** | Security logging | ✅ |
| | Failed login alerts | ✅ |
| | Suspicious activity alerts | ✅ |
| | Audit trail for admins | ✅ |

### 10.2 JWT Implementation

```typescript
// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
```

```typescript
// src/modules/auth/auth.service.ts (excerpt)
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  generateTokens(user: { id: string; email: string; role: string; artistId?: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      artistId: user.artistId,
    };

    const accessToken = this.jwt.sign(payload);
    const refreshToken = this.jwt.sign(
      { sub: user.id },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string) {
    try {
      return this.jwt.verify(token);
    } catch {
      return null;
    }
  }

  refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwt.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
      return this.generateTokens({ id: decoded.sub, email: '', role: '' });
    } catch {
      return null;
    }
  }
}
```

### 10.3 Rate Limiting Configuration

```typescript
// src/app.module.ts (excerpt)
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppThrottlerGuard } from './common/guards/app-throttler.guard';
import { throttleOptionsFromConfig } from './common/throttle.config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [throttleOptionsFromConfig(config)],
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: AppThrottlerGuard },
  ],
})
export class AppModule {}
```

```typescript
// src/common/throttle.config.ts
import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

export const throttleOptionsFromConfig = (
  config: ConfigService,
): ThrottlerModuleOptions => ({
  throttlers: [
    {
      name: 'default',
      ttl: config.get<number>('THROTTLE_TTL', 60_000),
      limit: config.get<number>('THROTTLE_LIMIT', 100),
    },
  ],
});

// Per-route overrides via @Throttle() decorator:
// @Throttle({ default: { limit: 10, ttl: 900_000 } })  // auth endpoints
// @Throttle({ default: { limit: 500, ttl: 60_000 } }) // admin endpoints
// @Throttle({ default: { limit: 5, ttl: 60_000 } })    // upload endpoints
// @Throttle({ default: { limit: 10, ttl: 60_000 } })   // payment endpoints
```

---

## 11. Development Phases

### 11.1 Phase 1: MVP (Months 1-3)

#### Week 1-2: Foundation
- [ ] Set up development environment
- [ ] Initialize `api/` (NestJS) and `client/` (React + Vite) repositories using `mako/api` project structure
- [ ] Configure CI/CD pipeline
- [ ] Set up database (PostgreSQL) with TypeORM migrations
- [ ] Design database schema and TypeORM entities
- [ ] Set up authentication system (@nestjs/jwt + Passport)

#### Week 3-4: User Management
- [ ] User registration (email/phone/social)
- [ ] User login/logout
- [ ] JWT token management
- [ ] User profile management
- [ ] Role-based access control
- [ ] Artist registration flow
- [ ] Artist profile setup

#### Week 5-6: Artist Features
- [ ] Track upload (basic)
- [ ] Track metadata management
- [ ] Album creation
- [ ] Track pricing (Set Price)
- [ ] Track management (edit/delete)
- [ ] Basic artist dashboard

#### Week 7-8: Payment Integration
- [ ] PawaPay SDK integration
- [ ] Mobile money checkout flow
- [ ] Payment webhook handler
- [ ] Payment status tracking
- [ ] Subscription payments
- [ ] Payment history

#### Week 9-10: Listener Features
- [ ] Music discovery (browse)
- [ ] Basic search
- [ ] Track playback (in-browser player)
- [ ] Track download
- [ ] Guest checkout
- [ ] User library
- [ ] Purchase history

#### Week 11-12: Admin & Deployment
- [ ] Admin dashboard (basic)
- [ ] User management
- [ ] Content moderation
- [ ] Testing (unit, integration, E2E)
- [ ] Deployment to staging
- [ ] Performance optimization
- [ ] Launch to production

**MVP Success Criteria:**
- ✅ Artists can register and upload up to 3 tracks
- ✅ Listeners can discover music and download tracks
- ✅ Mobile money payments work end-to-end
- ✅ Admin can manage users and content
- ✅ Core platform functions are stable and performant

### 11.2 Phase 2: Growth & Engagement (Months 4-6)

#### Week 13-14: Enhanced Analytics
- [ ] Real-time artist dashboard
- [ ] Earnings breakdown by track
- [ ] Fan demographics and insights
- [ ] Download count analytics
- [ ] Export reports (CSV/PDF)

#### Week 15-16: Pricing Models
- [ ] "Pay What You Want" pricing
- [ ] Free downloads (ad-supported)
- [ ] Exclusive content (subscription gate)
- [ ] Tipping system
- [ ] Bulk pricing for albums

#### Week 17-18: Discovery Features
- [ ] Algorithmic recommendations
- [ ] Trending charts
- [ ] New releases section
- [ ] User-generated playlists
- [ ] Curated playlists
- [ ] Share links and social sharing

#### Week 19-20: Community Features
- [ ] Artist following system
- [ ] Track/artist favorites
- [ ] Fan engagement notifications
- [ ] Messaging system (optional)
- [ ] Review and ratings (optional)

#### Week 21-22: Automated Payouts
- [ ] Automated payout scheduling
- [ ] Batch payout processing
- [ ] Payout reports
- [ ] Tax document generation
- [ ] Email notifications for payouts

#### Week 23-24: Phase 2 Polish
- [ ] Performance optimization
- [ ] Mobile responsiveness improvements
- [ ] Bug fixes and stability
- [ ] User feedback integration
- [ ] Documentation updates
- [ ] Phase 2 launch

### 11.3 Phase 3: Scale & Sophistication (Months 7-12)

#### Month 7: Advanced Rights Management
- [ ] Songwriter/publisher attribution
- [ ] Royalty distribution system
- [ ] Rights management dashboard
- [ ] License management
- [ ] Copyright claims handling

#### Month 8: AI-Powered Features
- [ ] AI music recommendations
- [ ] Playlist generation
- [ ] Smart search
- [ ] Personalized artist discovery
- [ ] Predictive analytics

#### Month 9: Gamification
- [ ] Artist badges and achievements
- [ ] Fan loyalty program
- [ ] Challenges and contests
- [ ] Leaderboards
- [ ] Exclusive rewards

#### Month 10: Platform Expansion
- [ ] Additional country support
- [ ] More payment providers
- [ ] Multi-language support
- [ ] Regional content curation
- [ ] Partnership integrations

#### Month 11: Mobile Apps
- [ ] iOS mobile app development
- [ ] Android mobile app development
- [ ] Push notifications
- [ ] Offline listening (limited)
- [ ] Mobile-first features

#### Month 12: Scale & Optimization
- [ ] Infrastructure scaling
- [ ] Performance optimization
- [ ] Security audit
- [ ] Compliance review
- [ ] Phase 3 launch

### 11.4 Infrastructure Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ngoma
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ngoma
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ngoma"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache & Queue
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # NestJS API (mako/api structure)
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    environment:
      NODE_ENV: ${NODE_ENV}
      DATABASE_URL: postgresql://ngoma:${DB_PASSWORD}@postgres:5432/ngoma
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      PAWAPAY_ENVIRONMENT: ${PAWAPAY_ENVIRONMENT}
      PAWAPAY_SANDBOX_API_TOKEN: ${PAWAPAY_SANDBOX_API_TOKEN}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    ports:
      - "4000:4000"
    volumes:
      - ./api:/app
      - /app/node_modules

  # React Client (Vite)
  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    environment:
      VITE_API_BASE_URL: http://api:4000
      VITE_ENVIRONMENT: ${NODE_ENV}
    ports:
      - "5173:5173"
    depends_on:
      - api
    volumes:
      - ./client:/app
      - /app/node_modules

  # Nginx (Reverse Proxy)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - client
      - api

volumes:
  postgres_data:
  redis_data:
```

---

## 12. Legal & Compliance

### 12.1 Terms of Service

**Key Sections:**

1. **Introduction**
   - Welcome to Ngoma platform
   - Acceptance of terms
   - Eligibility requirements

2. **User Accounts**
   - Account creation and security
   - User responsibilities
   - Account termination

3. **Content Ownership**
   - Artist retains ownership of music
   - Platform license to distribute
   - User content rights

4. **Payments & Royalties**
   - Payment processing terms
   - Revenue share and fees
   - Payout schedule and minimums
   - Taxes and withholding

5. **Prohibited Content**
   - Copyright infringement
   - Offensive or harmful material
   - Fraudulent activities

6. **Privacy & Data Protection**
   - Data collection practices
   - User rights (GDPR)
   - Cookie policy

7. **Limitation of Liability**
   - Platform liability caps
   - User indemnification

8. **Dispute Resolution**
   - Arbitration clause
   - Governing law (Zambia)

### 12.2 Privacy Policy

**Data Collected:**
| Type | Examples | Purpose |
|------|----------|---------|
| **Personal** | Name, email, phone, address | Account management, communication |
| **Payment** | Mobile money numbers | Transaction processing |
| **Music** | Audio files, metadata | Platform content |
| **Behavioral** | Listening history, downloads | Recommendations, analytics |
| **Device** | IP address, browser, device | Security, performance |

**User Rights (GDPR):**
- Right to access
- Right to rectification
- Right to erasure
- Right to restrict processing
- Right to data portability
- Right to object
- Right to withdraw consent

### 12.3 Data Retention Policy

| Data Type | Retention Period | Justification |
|-----------|------------------|---------------|
| User Account | Active + 30 days | User management |
| Payment Data | 7 years | Regulatory compliance |
| Transaction History | 7 years | Financial audit |
| Audio Files | Active + 30 days | Content delivery |
| Analytics Data | 2 years | Trend analysis |
| Logs | 90 days | Security monitoring |

### 12.4 Compliance Checklist

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| **GDPR (EU)** | ✅ | User data rights, consent management |
| **Data Protection Act (Zambia)** | ✅ | Local data protection compliance |
| **ZICTA Regulations** | ✅ | Telecommunications compliance |
| **Money Laundering Act** | ✅ | KYC for payouts over K10,000 |
| **Anti-Money Laundering** | ✅ | Transaction monitoring |
| **Copyright Act** | ✅ | DMCA-style takedown process |
| **Consumer Protection** | ✅ | Refund policy, clear pricing |

---

## 13. Launch Strategy

### 13.1 Pre-Launch Checklist

**Technical:**
- [ ] All core features tested and stable
- [ ] Security audit completed
- [ ] Load testing performed
- [ ] Disaster recovery plan in place
- [ ] Monitoring and alerting configured
- [ ] SSL certificates valid
- [ ] Payment integration fully functional
- [ ] Webhook endpoints verified

**Content:**
- [ ] 50+ artists onboarded
- [ ] 200+ tracks available
- [ ] Curated playlists created
- [ ] Platform content guidelines published

**Legal:**
- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] Cookie policy published
- [ ] Copyright policy published
- [ ] Contracts signed with artists

**Marketing:**
- [ ] Website launch page live
- [ ] Social media accounts active
- [ ] Press kit prepared
- [ ] Press releases ready
- [ ] Influencer partnerships identified
- [ ] Launch event planned

### 13.2 Launch Timeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                    L A U N C H  T I M E L I N E                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Week -4 to -1: Pre-Launch Activities                           │
│  ├── Beta testing with 50 artists                               │
│  ├── Bug fixes and performance tuning                          │
│  ├── Content finalization                                       │
│  ├── Marketing materials ready                                  │
│  └── Team training                                              │
│                                                                   │
│  Week 0: Launch Day                                             │
│  ├── Platform goes live at 10:00 AM CAT                        │
│  ├── Press release distribution                                  │
│  ├── Social media campaign starts                                │
│  ├── Email blast to waitlist                                     │
│  └── Launch event (virtual/in-person)                            │
│                                                                   │
│  Week 1-2: Post-Launch                                          │
│  ├── Monitor system performance                                 │
│  ├── Address urgent issues                                       │
│  ├── Collect user feedback                                       │
│  ├── Initial analytics review                                   │
│  └── First wave of feature improvements                         │
│                                                                   │
│  Week 3-4: Stabilization                                        │
│  ├── Bug fixes and patches                                       │
│  ├── Performance optimizations                                   │
│  ├── Content onboarding intensifies                              │
│  ├── User growth acceleration                                    │
│  └── Partnership announcements                                   │
│                                                                   │
│  Month 2-3: Growth                                              │
│  ├── Phase 2 features development                                │
│  ├── Marketing campaigns                                         │
│  ├── Artist outreach programs                                    │
│  ├── Community engagement                                        │
│  └── Revenue analysis                                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 13.3 Marketing Strategy

**Pre-Launch:**
- Waitlist with early access incentives
- Artist ambassador program
- Social media teaser campaign
- Content creator partnerships
- Early bird promotions

**Launch:**
- Press coverage (tech, music, lifestyle)
- Influencer endorsements
- Launch event (virtual + in-person)
- Promotional offers (free uploads)
- Social media takeover by artists

**Post-Launch:**
- Ongoing content marketing (blog, podcast)
- Email marketing campaigns
- Referral program (fans invite artists)
- Paid advertising (social media, Google)
- Events and sponsorships

### 13.4 Key Metrics

**Success Metrics:**
| Metric | Target (Month 3) | Target (Month 6) |
|--------|------------------|------------------|
| Total Users | 5,000 | 15,000 |
| Active Artists | 200 | 500 |
| Tracks Uploaded | 1,000 | 3,000S |
| Total Downloads | 10,000 | 50,000 |
| Monthly Revenue | K25,000 | K100,000 |
| Platform Fee Revenue | K2,500 | K10,000 |
| Artist Payouts | K22,500 | K90,000 |
| User Retention | 40% | 50% |
| Artist Retention | 70% | 75% |

### 13.5 Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Payment failures | High | Thorough testing, multiple providers, fallback |
| Technical downtime | High | Monitoring, auto-scaling, backup servers |
| Copyright disputes | Medium | DMCA process, content review, legal team |
| Low artist adoption | Medium | Onboarding support, promotions, incentives |
| Security breach | High | Security audit, monitoring, incident response |
| Regulatory issues | Medium | Legal consultation, compliance review |

---

## Appendix A: Provider IDs for PawaPay

| Country | Provider | Correspondent ID |
|---------|----------|------------------|
| Uganda | MTN Mobile Money | `MTN_MOMO_UGA` |
| Uganda | Airtel Money | `AIRTEL_MOMO_UGA` |
| Uganda | Zamtel Kwacha | `ZAMTEL_MOMO_UGA` |
| Zambia | MTN Mobile Money | `MTN_MOMO_ZAM` |
| Zambia | Airtel Money | `AIRTEL_MOMO_ZAM` |
| Zambia | Zamtel Kwacha | `ZAMTEL_MOMO_ZAM` |
| Tanzania | Vodacom M-Pesa | `VODACOM_MOMO_TZA` |
| Kenya | Safaricom M-Pesa | `SAFARICOM_MOMO_KEN` |

## Appendix B: Error Codes (PawaPay)

| Code | Description | Action |
|------|-------------|--------|
| `PAYMENT_INSUFFICIENT_FUNDS` | Insufficient balance | User to add funds |
| `PAYMENT_INVALID_MSISDN` | Invalid phone number | Ask user to re-enter |
| `PAYMENT_PROVIDER_ERROR` | Provider issues | Retry or use alternative |
| `PAYMENT_TIMEOUT` | Request timed out | Retry after 2 minutes |
| `PAYMENT_CANCELLED` | User cancelled | Display cancelled message |
| `PAYMENT_PENDING` | Awaiting confirmation | Wait for webhook notification |
| `PAYMENT_COMPLETED` | Successful | Grant access |

---

**End of Requirements Document**

*Ngoma: The Heartbeat of African Music*