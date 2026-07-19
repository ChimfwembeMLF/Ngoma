# API Contract: Auth

**Base path**: `/api/v1/auth`  
**Module**: `api/src/modules/auth/`

## POST /register

Register a new user.

**Auth**: Public  
**Rate limit**: 10 / 15 min

### Request

```json
{
  "email": "artist@example.com",
  "phone": "+260971234567",
  "password": "SecurePass1",
  "fullName": "Jane Banda",
  "country": "ZM",
  "role": "ARTIST"
}
```

### Response 201

```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "role": "ARTIST" },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Errors

| Code | HTTP | Description |
|------|------|-------------|
| VAL_001 | 400 | Validation failed |
| RES_002 | 409 | Email or phone already exists |

---

## POST /login

**Auth**: Public

### Request

```json
{ "email": "artist@example.com", "password": "SecurePass1" }
```

### Response 200

Same token shape as register.

---

## POST /refresh

**Auth**: Public (refresh token body)

### Request

```json
{ "refreshToken": "..." }
```

---

## GET /me

**Auth**: Bearer JWT

### Response 200

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "...",
    "phone": "+260...",
    "fullName": "...",
    "role": "ARTIST",
    "artistId": "uuid-or-null"
  }
}
```
