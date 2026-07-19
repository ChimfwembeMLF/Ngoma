# API Contract: Admin (delta for 002)

**Module**: `api/src/modules/admin/`  
**Base path**: `/api/v1/admin`

All routes require `JwtAuthGuard` + `Roles(ADMIN)`.

## GET /users

**Auth**: Bearer (ADMIN)

**Query**: `limit` (default 50), `offset` (default 0), `role` (optional filter)

### Response 200

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "Jane Doe",
      "role": "LISTENER",
      "isActive": true,
      "createdAt": "2026-07-19T10:00:00Z",
      "lastLogin": null
    }
  ],
  "pagination": { "total": 120, "limit": 50, "offset": 0 }
}
```

---

## POST /users/:id/deactivate

**Auth**: Bearer (ADMIN)

### Response 200

```json
{
  "success": true,
  "data": { "id": "uuid", "isActive": false }
}
```

### Errors

| Code | HTTP | Description |
|------|------|-------------|
| ADM_001 | 403 | Cannot deactivate own account |
| ADM_002 | 404 | User not found |

---

## Client route

| Path | Page |
|------|------|
| `/admin/users` | `AdminUsersPage.tsx` |
