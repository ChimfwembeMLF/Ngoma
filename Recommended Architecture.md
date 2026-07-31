Neither. The artist should have **one Tekrem account**, and that account gives them access to both Ngoma and Mako. Think of it like Google: you don't create a separate account for Gmail, Drive, and YouTube.

## Recommended Architecture

```text
                Tekrem ID
                     │
      ┌──────────────┴──────────────┐
      │                             │
   Ngoma                       Mako
Music Commerce          AI Marketing Platform
```

When an artist signs up on **Ngoma**, a Tekrem account is created (or linked if they already have one). By default:

* ✅ They can upload and sell music in Ngoma.
* ✅ They get access to Mako's basic marketing features.
* 🔒 Advanced Mako features can be part of a premium plan.

This creates a much smoother experience than asking artists to register twice.

---

## User Journey

### Step 1: Register

```text
Sign Up

↓

Tekrem ID Created

↓

Artist Profile Created

↓

Ngoma Dashboard
```

The artist doesn't even need to know Mako exists yet.

---

### Step 2: Upload Music

```text
Upload Song

↓

Publish

↓

Song Live
```

---

### Step 3: Promote

Now Ngoma introduces Mako naturally.

```text
✅ Song Published

Your song is live!

[ Promote with Mako ]
```

The artist clicks the button.

No login.

No new account.

No reconnecting anything.

Because they're already authenticated through Tekrem ID.

---

## What happens behind the scenes?

Ngoma sends Mako the song metadata:

```json
{
  "trackId": "123",
  "title": "Lost Without You",
  "artist": "John Doe",
  "coverArt": "...",
  "genre": "Afrobeats",
  "description": "...",
  "url": "https://ngoma.africa/song/123"
}
```

Mako opens with everything pre-filled.

---

## Mako becomes a feature, not another product

From the artist's perspective:

```text
Ngoma

├── Upload Music
├── Earnings
├── Wallet
├── Analytics
├── Playlists
└── Promote  ← Opens Mako
```

They don't think:

> "I'm using two systems."

They think:

> "Ngoma has powerful marketing tools."

That reduces friction significantly.

---

## When should someone go directly to Mako?

Not every Mako user will be a musician.

For example:

* Restaurants
* Retail stores
* NGOs
* Churches
* SMEs
* Event organizers

Those users can sign up directly on Mako because they don't need Ngoma.

So you have:

```text
                 Tekrem ID
                      │
        ┌─────────────┴─────────────┐
        │                           │
   Musician                    Business
        │                           │
     Ngoma                      Mako
        │                           │
   Promote Song              Promote Business
        │                           │
        └─────────────┬─────────────┘
                      │
              Same Marketing Engine
```

## My recommendation

Treat **Ngoma as a vertical application built on top of Mako**, not as two unrelated products.

* **Tekrem ID** handles authentication and user identity.
* **Ngoma** owns music, payments, artists, and fans.
* **Mako** provides marketing services through APIs and embedded UI.

This keeps the artist experience simple: **one account, one login, one dashboard**, with marketing capabilities appearing exactly when they're needed. That's a much cleaner product experience than forcing artists to manage separate accounts for publishing and promotion.
