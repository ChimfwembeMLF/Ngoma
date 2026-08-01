# Research Decisions & Architectural Integration Guide: Tekrem & Mako

**Feature**: Tekrem & Mako Ecosystem Integration (`025-tekrem-mako-integration`)  
**Created**: 2026-08-01  

## Overview
This document consolidates key architectural findings and technical decisions for connecting Ngoma with **Tekrem ID** (Auth) and **Mako** (Marketing Engine) without causing breaking changes or database mutations in either external codebase.

---

## 1. Zero-Breakage Tekrem Auth Integration (SSO / Identity)

- **Decision**: Integrate Ngoma as a standard OpenID Connect (OIDC 1.0) / OAuth 2.0 Relying Party (client application), using the Authorization Code Flow with PKCE.
- **Rationale**: Review of the `Tekrem Auth` repository confirmed it is an Actix Web (Rust) identity server issuing signed RS256 JWT access and ID tokens. By registering Ngoma as an OAuth client in Tekrem Auth (`TEKREM_CLIENT_ID` and `TEKREM_CLIENT_SECRET`), Ngoma consumes Tekrem identity claims (`sub`, `email`, `profile`, `roles`) via standard endpoints (`/oauth/authorize`, `/oauth/token`, `/oauth/userinfo`).
- **SSO Across Ecosystem**: Because Mako also relies on Tekrem ID as an external Identity Provider, an artist authenticated in Ngoma will have an active OIDC session in Tekrem Auth. When navigating from Ngoma to Mako (e.g., clicking "Promote with Mako"), Mako automatically validates the user's existing token session via SSO without prompting for new credentials or requiring internal cross-database queries between Ngoma and Mako.
- **Alternatives Considered**: Direct PostgreSQL cross-schema querying or creating custom login hooks in Rust. Rejected immediately because it violates microservice separation, breaks database encapsulation, and causes maintenance bottlenecks in Tekrem Auth.

---

## 2. Zero-Breakage Mako Marketing Engine Integration (One-Click Promotion)

- **Decision**: Implement One-Click Song Promotion by passing structured release metadata (track title, artist display name, cover artwork URL, streaming landing link, genre tag) via standard API pre-filling or authenticated Deep Linking into Mako's dedicated Social Dashboard (`/social/create` or `/social/campaigns`).
- **Rationale**: Examination of the `mako` codebase confirmed Mako operates on a multi-tenant business model with workspaces (`tenants`, `workspaces`, `content_campaigns`, `social_inbox`). Altering Mako's core data schema to natively understand music industry concepts (albums, ISRC codes, royalty wallets) would break Mako's non-music corporate usage. By mapping Ngoma artists to standard Mako tenants/workspaces and pre-filling campaign payloads via Mako's REST APIs, Mako operates cleanly as a general-purpose AI social publishing and campaign engine.
- **Alternatives Considered**: Forking Mako or embedding specialized music entity tables inside Mako's database. Rejected because it violates the design constraint to keep Mako reusable and unbroken for general businesses.

---

## 3. Smart Link Attribution & Commerce Conversion Tracking

- **Decision**: Generate shortened marketing smart links directly in Ngoma (`/link/:slug` or `/api/v1/marketing/smart-links/:slug`) that log referral metadata (channel, timestamp, campaign identifier `mako_cid`) into a dedicated TypeORM entity (`SmartLinkAttribution`), storing an anonymous referral token in local session state or cookies.
- **Rationale**: When listeners visit an artist's smart link from WhatsApp, Telegram, Facebook, or Instagram and proceed to purchase a song, album, or tip the artist via Mobile Money/PawaPay in Ngoma, Ngoma's payment service inspects the session token and ties the revenue event to the originating promotional campaign ID.
- **Alternatives Considered**: Forcing third-party social networks or Mako to track checkout conversions inside Ngoma. Rejected due to cross-domain privacy limits and ad blockers. Handling attribution natively inside Ngoma's TypeORM backend ensures 100% conversion accuracy and customer privacy.

---

## 4. Unified ROI Analytics & Fan CRM Segmentation

- **Decision**: Compute campaign ROI natively inside Ngoma's dashboard service by querying Mako's analytics endpoints for campaign expenditure, impressions, and click volumes (via authenticated REST server-to-server fetch), compositing those numbers with Ngoma's confirmed TypeORM purchase and tip revenues:
  $$\text{Net ROI \%} = \frac{\text{Gross Ngoma Commerce Revenue} - \text{Mako Campaign Expenditure}}{\text{Mako Campaign Expenditure}} \times 100$$
- **Rationale**: Keeps commerce financial wallets inside Ngoma while reading advertising performance from Mako. For Fan CRM, Ngoma synthesizes transaction logs and listening habits into audience segments (e.g., "High-Value Afrobeat Supporters") and exports these segment lists to Mako as custom contact segments for targeted outreach when an artist promotes their next release.
- **Alternatives Considered**: Duplicating Ngoma's transactional accounting database inside Mako. Rejected because financial records must remain under strict access controls within Ngoma's domain.
