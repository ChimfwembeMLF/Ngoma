# Playlist Reorder API Contract

**Endpoint**: `PATCH /api/v1/playlists/:id/reorder`

**Description**: Updates the position of tracks within a playlist.

**Auth Required**: Yes (JWT - User must own the playlist)

**Request Body**:
```json
{
  "trackIds": ["<uuid-1>", "<uuid-2>", "<uuid-3>"]
}
```
*(The array of track IDs represents the new order of tracks. The `position` of each track will be updated to match its index in this array.)*

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Playlist reordered successfully"
}
```
