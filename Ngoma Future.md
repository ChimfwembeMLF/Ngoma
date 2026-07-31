# Ngoma Product Vision & Roadmap

## Executive Summary

Ngoma is **not just another music download website**. It is a **music commerce platform** designed specifically for African artists, enabling them to publish, market, monetize, and manage their music from a single ecosystem.

Unlike traditional platforms that charge artists simply to upload music, Ngoma focuses on **helping artists earn money** while giving them the tools to grow their audience.

The core philosophy is simple:

> **Helping African artists earn money directly through mobile money while giving them the tools to market themselves effectively.**

---

# Product Vision

Ngoma combines three major pillars:

* **Music Distribution**
* **Music Commerce**
* **Artist Growth**

Instead of only hosting music, Ngoma becomes the business platform that independent artists use to build sustainable careers.

---

# Core Value Proposition

Every feature should answer one question:

> **Does this help artists make more money or reach more fans?**

Everything else supports this mission.

---

# Product Roadmap

---

# Phase 1 — Minimum Viable Product (MVP)

The first release focuses on publishing music, selling music, and paying artists.

## Artist Features

Artists should be able to:

* Register and verify their account
* Create an artist profile
* Upload songs
* Upload albums and EPs
* Upload cover artwork
* Upload music videos
* Set pricing options:

  * Free
  * Fixed Price
  * Pay What You Want
* View analytics

  * Downloads
  * Streams
  * Earnings
* Receive tips
* Withdraw earnings

---

## Fan Features

Listeners should be able to:

* Browse music
* Search artists
* Search albums
* Stream music
* Watch music videos
* Purchase songs
* Download purchased songs
* Tip artists
* Create playlists
* Build a personal music library

---

# Payments (PawaPay)

Payments are the heart of Ngoma.

Every purchase should follow a completely automated flow.

```text
Fan

↓

Clicks Buy

↓

Creates Order

↓

Initiates PawaPay Deposit

↓

Waiting for Payment

↓

Webhook Received

↓

Verify Transaction

↓

Grant Download Access

↓

Credit Artist Wallet
```

No polling.

No refreshing pages.

Everything should happen automatically using PawaPay webhooks.

---

# Artist Wallet

Instead of paying artists immediately, earnings accumulate inside a wallet.

```text
Music Sales

↓

Artist Wallet

↓

Withdrawal Request

↓

(Optional Admin Approval)

↓

PawaPay Payout
```

Benefits:

* Better financial control
* Easier reconciliation
* Fraud prevention
* Support for refunds
* Tax reporting

---

# Phase 2 — Artist Growth

Once commerce is stable, the focus shifts to helping artists grow.

---

## Artist Analytics

Dashboard metrics should include:

* Revenue
* Downloads
* Streams
* Top countries
* Top cities
* Top-performing songs
* Daily earnings
* Weekly earnings
* Monthly earnings
* Returning listeners
* Conversion rates

---

## Promotion Marketplace

Instead of charging artists to upload music, Ngoma charges for promotion.

Example promotion packages:

| Promotion             | Price     |
| --------------------- | --------- |
| Homepage Feature      | K100/day  |
| Trending Boost        | K50/day   |
| Genre Spotlight       | K75/week  |
| Homepage Banner       | K250/week |
| Social Media Campaign | K500+     |

Artists pay for visibility instead of permission.

---

## Ad-Supported Downloads

Artists may choose to make songs free.

Instead of charging fans:

```text
Artist selects

Free Download

↓

Fan watches

20-second advertisement

↓

Download unlocked

↓

Platform keeps advertising revenue
```

This allows artists to maximize reach while Ngoma generates revenue from advertising.

---

## Curated Playlists

Music discovery should be playlist-driven.

Examples:

* Trending Zambia
* New This Week
* Afrobeat Hits
* Gospel Collection
* Copperbelt Hits
* Love Songs
* Workout Mix
* Hip Hop Essentials

---

# Phase 3 — Music Economy

The final phase transforms Ngoma into a complete music ecosystem.

---

## Artist Subscriptions

Fans subscribe directly to artists.

```text
K20/month

↓

Exclusive Songs

↓

Early Releases

↓

Behind-the-Scenes Content

↓

Private Community
```

---

## Live Events

Artists can sell:

* Concert tickets
* Virtual concerts
* Live streams
* VIP experiences

---

## Merchandise

Artists can sell:

* Shirts
* Hoodies
* Posters
* CDs
* Vinyl
* Accessories

Payments use the same wallet system.

---

## Fan Communities

Every artist gets a community.

Features include:

* Posts
* Comments
* Announcements
* Exclusive content
* Live sessions
* Fan discussions

---

# Technical Architecture

A modular architecture keeps the platform maintainable and scalable.

```text
Identity
├── Users
├── Artists
├── Roles
├── Authentication

Music
├── Tracks
├── Albums
├── Genres
├── Videos
├── Lyrics

Commerce
├── Orders
├── Payments
├── Wallets
├── Tips
├── Payouts

Streaming
├── Player
├── Downloads
├── Queue
├── Playlists

Discovery
├── Search
├── Trending
├── Recommendations
├── Charts

Administration
├── Moderation
├── Reports
├── Promotions
├── Configuration
```

---

# Integrating Mako

Ngoma and Mako naturally complement one another.

Rather than operating as separate products:

* **Ngoma becomes the Music Commerce Engine**
* **Mako becomes the Artist Marketing Engine**

Together they create a complete growth platform for African musicians.

---

# System Architecture

```text
                 MAKO
        (Marketing Platform)
                 │
 ┌───────────────┼────────────────┐
 │               │                │
Facebook     Instagram      WhatsApp
 │               │                │
 └───────────────┼────────────────┘
                 │
          Ngoma Integration API
                 │
        ┌────────┴────────┐
        │                 │
     Artist          Music Store
```

Artists upload music **once** to Ngoma.

Mako handles promotion everywhere else.

---

# One-Click Promotion

After publishing a song:

```text
✅ Song Published

[ Promote with Mako ]
```

Selecting the button automatically opens Mako with the release preloaded.

Mako can instantly generate:

* Facebook posts
* Instagram captions
* WhatsApp campaigns
* X (Twitter) posts
* LinkedIn announcements
* Press releases

---

# AI Content Generation

After uploading:

* Song Title
* Genre
* Cover Artwork
* Description

Mako automatically creates promotional content.

Example:

> 🎵 **New Release!**
>
> "Lost Without You" is now available on Ngoma.
>
> Listen now:
>
> [Link]

Content variations:

* Casual
* Professional
* Hype
* Gospel
* Afrobeat
* Amapiano

---

# Smart Campaign Builder

Artists choose:

```text
Promotion Budget

K100

Platforms

☑ Facebook

☑ Instagram

☑ WhatsApp

Audience

☑ Zambia

☑ Malawi

☑ South Africa
```

Mako manages scheduling and publishing automatically.

---

# Smart Links & Tracking

Instead of sharing:

```text
ngoma.africa/song/123
```

Mako generates:

```text
mako.link/abc123
```

Track:

* Clicks
* Streams
* Purchases
* Downloads
* Conversion rates

Artists finally know which campaigns actually generate revenue.

---

# AI Recommendations

Using historical performance, Mako recommends:

* Best posting times
* Best-performing platforms
* Suggested advertising budgets
* Hashtags
* Target countries

Example:

> Gospel releases perform best on Sunday mornings.

Recommendation:

```text
Schedule Release

Sunday

08:00 CAT
```

---

# Automated Marketing

Whenever a release goes live:

Automatically publish to:

* Facebook
* Instagram
* WhatsApp
* Telegram
* Discord
* Email subscribers

No manual posting required.

---

# Fan CRM

Mako maintains audience intelligence.

```text
Fan

↓

Purchased Song A

↓

Likes Gospel

↓

Lives in Lusaka

↓

Subscribed

↓

Lifetime Spend: K250
```

When a new Gospel release arrives:

```text
Notify All Matching Fans
```

Marketing becomes personalized instead of generic.

---

# Unified Analytics

Ngoma provides:

* Streams
* Downloads
* Sales
* Tips
* Earnings

Mako provides:

* Reach
* Engagement
* Campaign performance
* Clicks
* Conversion rates

Combined dashboard:

```text
Campaign

Reached:
24,000

Clicks:
3,500

Purchases:
280

Revenue:
K8,450

ROI:
312%
```

Artists can measure the financial impact of every campaign.

---

# AI Marketing Assistant

Inside Ngoma:

> **Promote this song**

Mako automatically:

* Generates social media content
* Creates artwork variations
* Suggests hashtags
* Recommends posting times
* Builds campaigns
* Schedules content
* Tracks performance
* Optimizes future campaigns

---

# Tekrem Identity Platform

Both products should share a unified identity.

```text
Tekrem ID

↓

Single Sign-On

↓

Ngoma

↓

Mako

↓

Future Tekrem Products
```

Artists authenticate once and seamlessly access the entire ecosystem.

---

# Tekrem Ecosystem

```text
               Tekrem Ecosystem

             ┌──────────────┐
             │   Tekrem ID  │
             └──────┬───────┘
                    │
      ┌─────────────┼─────────────┐
      │                           │
   Ngoma                      Mako
Music & Commerce        AI Marketing & Growth
      │                           │
      └─────────────┬─────────────┘
                    │
 Facebook • Instagram • WhatsApp • Telegram • Email
```

---

# Long-Term Vision

Ngoma is not intended to compete solely with music download sites. Its goal is to become the infrastructure that powers independent artists across Africa.

By combining:

* Music hosting
* Mobile money commerce
* Artist wallets
* AI-powered marketing
* Audience analytics
* Fan relationship management
* Promotion marketplace
* Automated payouts

Ngoma evolves from a simple distribution platform into a complete digital business platform for musicians. With Mako integrated as the marketing layer, artists gain a unified system where they can publish music, grow their audience, monetize their work, and manage their careers from one ecosystem.
