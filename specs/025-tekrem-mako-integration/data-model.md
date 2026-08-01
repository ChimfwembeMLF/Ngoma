# Data Model: Tekrem & Mako Ecosystem Integration

**Feature**: Tekrem & Mako Ecosystem Integration (`025-tekrem-mako-integration`)  
**Created**: 2026-08-01  

## Overview
This document specifies the TypeORM entities required in Ngoma to maintain federated identity links with Tekrem Auth, coordinate promotional campaigns with Mako, log smart link referral attributions, and store Fan CRM segmentation profiles.

---

## 1. TypeORM Entities

### `TekremAccountLink`
Maps an internal Ngoma artist or user account to their unique Tekrem ID (`sub` UUID) without modifying Tekrem Auth's tables.

| Field Name | Type | Options | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, Auto-generate | Unique identity mapping ID |
| `userId` | `uuid` | Foreign Key (User) | Reference to internal Ngoma user profile |
| `tekremSub` | `varchar(255)` | Unique, Not Null | Tekrem Auth subject UUID (`sub` claim) |
| `email` | `varchar(255)` | Index, Not Null | Email confirmed via Tekrem OIDC |
| `makoWorkspaceId` | `varchar(255)` | Nullable | Linked Mako tenant/workspace ID for promotion |
| `createdAt` | `timestamp` | Current Timestamp | Creation timestamp |
| `updatedAt` | `timestamp` | On Update Current | Last token sync or profile modification |

---

### `MakoPromotionCampaign`
Tracks promotional actions initiated from Ngoma into Mako, saving release metadata and external Mako campaign identifiers.

| Field Name | Type | Options | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, Auto-generate | Internal campaign reference ID |
| `artistId` | `uuid` | Index, Foreign Key (User) | Artist initiating the promotion |
| `releaseId` | `uuid` | Index, Not Null | ID of published track, album, or music video |
| `makoCampaignId`| `varchar(255)` | Unique, Nullable | Associated campaign ID assigned by Mako |
| `releaseTitle` | `varchar(255)` | Not Null | Snapshot of song or album title |
| `artworkUrl` | `text` | Not Null | Cover graphic URI sent to Mako |
| `targetGenre` | `varchar(100)` | Not Null | Genre tag used for AI campaign optimization |
| `status` | `enum` | `DRAFT`, `ACTIVE`, `ENDED`| Current state of the promotional campaign |
| `totalSpend` | `decimal(10,2)` | Default: `0.00` | Ad campaign spending synced from Mako |
| `createdAt` | `timestamp` | Current Timestamp | Creation time of one-click promotion |
| `updatedAt` | `timestamp` | On Update Current | Last status sync from Mako |

---

### `SmartLinkAttribution`
Logs visit events when listeners open an artist's smart link from external social messaging channels, enabling conversion attribution when a tip or track purchase follows.

| Field Name | Type | Options | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, Auto-generate | Unique visit record ID |
| `slug` | `varchar(100)` | Index, Not Null | Shortened smart link URL handle |
| `campaignId` | `uuid` | Foreign Key (Campaign) | Originating Mako promotional campaign ID |
| `releaseId` | `uuid` | Index, Not Null | Target release being streamed or purchased |
| `referralChannel`| `varchar(50)` | Nullable | Source platform (WhatsApp, IG, Facebook, Telegram) |
| `visitorToken` | `varchar(255)` | Index, Not Null | Anonymous browser hash / session tracking token |
| `converted` | `boolean` | Default: `false` | True if visitor completed a tip or purchase |
| `conversionAmount`| `decimal(10,2)`| Nullable | Revenue in account currency generated from visit |
| `createdAt` | `timestamp` | Current Timestamp | Timestamp of visit event |

---

### `FanSegment`
Aggregates listener interaction metrics into structured CRM segments to power targeted promotional outreach on subsequent releases.

| Field Name | Type | Options | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, Auto-generate | Unique audience segment record ID |
| `artistId` | `uuid` | Index, Foreign Key (User) | Artist who owns this audience relationship |
| `fanUserId` | `uuid` | Nullable, Foreign Key | Registered listener ID (null if anonymous buyer)|
| `contactEmail` | `varchar(255)` | Nullable | Verified listener contact email for announcements |
| `phoneContact` | `varchar(50)` | Nullable | Verified mobile phone number for WhatsApp outreach|
| `preferredGenre`| `varchar(100)` | Index, Not Null | Predominant genre based on listening and purchase stats |
| `totalSpent` | `decimal(10,2)` | Default: `0.00` | Lifetime purchasing and tip expenditure |
| `interactionsCount`| `int` | Default: `0` | Total stream occurrences, link visits, and sales |
| `supporterTier`| `enum` | `CASUAL`, `FAN`, `VIP`| Categorization based on frequency and revenue |
| `updatedAt` | `timestamp` | On Update Current | Timestamp of last engagement event |

---

## 2. Entity Relationships & Rules

1. **Strict Tenant & Artist Isolation**: All queries against `MakoPromotionCampaign`, `SmartLinkAttribution`, and `FanSegment` MUST include an `where: { artistId }` filter enforced via NestJS services and `JwtAuthGuard` user tokens.
2. **Cascading Behavior**: Deleting a user account cleanly cascades to remove associated `TekremAccountLink` and `FanSegment` data per privacy requirements, while preserving financial transaction ledgers with nullified personal identification.
3. **Index Efficiency**: High-traffic lookups (such as `slug`, `visitorToken`, and `tekremSub`) must be covered by database indexes created in the accompanying TypeORM migration file.
