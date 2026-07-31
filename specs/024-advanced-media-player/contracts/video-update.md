# Video Update API Contract

**Endpoint**: `PATCH /api/v1/videos/:id`

**Description**: Updates a video entity.

**Auth Required**: Yes (JWT - User must own the video)

**Request Body** (partial/optional fields):
```json
{
  "title": "New Title",
  "description": "New description",
  "externalUrl": "https://example.com/tickets"
}
```

**Response (200 OK)**:
```json
{
  "id": "<uuid>",
  "title": "New Title",
  "description": "New description",
  "externalUrl": "https://example.com/tickets",
  "createdAt": "...",
  "updatedAt": "..."
}
```
