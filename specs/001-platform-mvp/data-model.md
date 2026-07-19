# Data Model: 001-platform-mvp

**Date**: 2026-07-19

## Overview

MVP entities derived from PROJECT REQUIREMENTS §8. Implemented as TypeORM entities under `api/src/modules/<domain>/entities/`. All primary keys are UUID. Timestamps use `timestamptz`.

## Entity Relationship (MVP subset)

```text
User 1──1 Artist
User 1──* Payment
User 1──* DownloadAccess
Artist 1──* Track
Artist 1──* Album
Album 1──* Track (optional)
Track 1──* DownloadAccess
Payment 1──0..1 DownloadAccess
Payment 1──0..* Earnings
Artist 1──* Earnings
```

## Entities

### User (`users`)

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| email | string | unique, required |
| passwordHash | string | bcrypt |
| phone | string | unique, E.164 |
| fullName | string | |
| role | enum | LISTENER, ARTIST, ADMIN |
| country | string | optional |
| avatarUrl | string | optional |
| isActive | boolean | default true |
| isVerified | boolean | default false |
| emailVerified | boolean | |
| phoneVerified | boolean | |
| createdAt | timestamptz | |
| updatedAt | timestamptz | |
| lastLogin | timestamptz | nullable |

**Validation**: email format; phone E.164; password min 8 chars, 1 upper, 1 number.

### Artist (`artists`)

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| userId | UUID | FK → User, unique |
| artistName | string | public display name |
| bio | text | optional |
| genres | string[] | |
| socialLinks | jsonb | optional |
| coverImageUrl | string | optional |
| isVerified | boolean | default false |
| subscriptionTier | enum | STARTER (MVP default) |
| totalPlays | bigint | default 0 |
| totalDownloads | bigint | default 0 |
| createdAt | timestamptz | |
| updatedAt | timestamptz | |

**State**: Created after artist registration or first profile setup.

### Album (`albums`) — MVP basic

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| artistId | UUID | FK → Artist |
| title | string | |
| description | text | optional |
| coverArtUrl | string | optional |
| releaseDate | date | optional |
| type | enum | SINGLE, EP, ALBUM |
| isActive | boolean | default true |

### Track (`tracks`)

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| artistId | UUID | FK → Artist |
| albumId | UUID | FK → Album, nullable |
| title | string | |
| description | text | optional |
| genre | string | |
| pricingType | enum | SET_PRICE, FREE (MVP); others later |
| price | decimal | required when SET_PRICE |
| audioFileUrl | string | storage URL |
| coverArtUrl | string | optional |
| duration | integer | seconds |
| isPublished | boolean | default false |
| isDraft | boolean | default true |
| isActive | boolean | default true |
| plays | bigint | default 0 |
| downloads | bigint | default 0 |
| releaseDate | date | optional |

**State transitions**:
- Draft → Published (`isDraft=false`, `isPublished=true`)
- Published → Unpublished (`isPublished=false`)

### Payment (`payments`)

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| userId | UUID | FK → User |
| depositId | string | unique, PawaPay id |
| amount | decimal | |
| currency | string | default ZMW |
| provider | string | e.g. MTN_MOMO |
| status | enum | INITIATED, PENDING, COMPLETED, FAILED |
| purpose | enum | TRACK_DOWNLOAD (MVP) |
| itemId | UUID | track id |
| transactionId | string | nullable |
| errorCode | string | nullable |
| errorMessage | text | nullable |
| completedAt | timestamptz | nullable |

### DownloadAccess (`download_access`)

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| userId | UUID | FK → User |
| trackId | UUID | FK → Track |
| paymentId | UUID | FK → Payment, nullable (free tracks) |
| expiresAt | timestamptz | default +7 days for paid |
| downloadCount | integer | default 0 |

**Unique**: (userId, trackId)

### Earnings (`earnings`)

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| artistId | UUID | FK → Artist |
| userId | UUID | FK → User (buyer) |
| trackId | UUID | FK → Track |
| amount | decimal | artist share |
| platformFee | decimal | |
| source | enum | DOWNLOAD |
| paymentId | UUID | FK → Payment |

## Deferred (schema hooks only, not MVP implementation)

- Payouts, Tips, Subscriptions, Playlists, ContentReports — tables defined in requirements but not built in MVP tasks.

## Migration Strategy

1. `001-InitialUsersArtists.ts` — users, artists
2. `002-TracksAlbums.ts` — albums, tracks
3. `003-PaymentsAccess.ts` — payments, download_access, earnings

Run via `yarn migrations:run` in `api/`.

## Indexes (MVP)

- `users(email)`, `users(phone)`
- `tracks(artist_id, is_published)`
- `payments(deposit_id)`, `payments(user_id, created_at)`
- `download_access(user_id, track_id)` unique
