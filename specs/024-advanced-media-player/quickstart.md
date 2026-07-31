# Quickstart Validation Guide: Advanced Media Player & Playlists

## Prerequisites
- Local API server running (`yarn dev:api` or `cd api && yarn start:dev`)
- Local Client running (`yarn dev:client` or `cd client && yarn dev`)
- A test user account with at least one uploaded video and a few tracks in a playlist.

## Validation Scenarios

### Scenario 1: Playback Queue & Repeat
1. Log in to the client application.
2. Navigate to a track or album and click "Play".
3. Verify the mini-player appears at the bottom.
4. Add another track to the queue using an "Add to Queue" button.
5. In the mini-player, toggle the "Repeat" button until it is set to "Repeat Track" (usually indicated by a `(1)` or similar icon).
6. Fast forward the track to the end.
7. **Expected Outcome**: The same track restarts automatically.
8. Toggle "Repeat" to "Off".
9. Fast forward the track to the end.
10. **Expected Outcome**: The next track in the queue starts playing automatically.

### Scenario 2: Playlist Reordering & Autoplay
1. Navigate to a saved playlist you own that has at least 2 tracks.
2. Play the playlist from the beginning.
3. Fast forward the first track to the end.
4. **Expected Outcome**: The second track starts playing automatically.
5. Reorder the tracks in the playlist by moving the second track above the first track.
6. Verify the UI updates to reflect the new order.
7. Refresh the page.
8. **Expected Outcome**: The new order persists.

### Scenario 3: Video External Link
1. As an artist user, navigate to your videos section and edit a video.
2. Enter an external URL (e.g., `https://example.com`) in the newly added `externalUrl` field and save.
3. Navigate to the video view page as a normal listener.
4. **Expected Outcome**: An external link is visible alongside or below the video player. Clicking it opens the URL in a new tab.

### Scenario 4: Interactive Player Queue Drawer
1. With music playing and multiple items in your queue, click the Queue (`ListMusic`) icon button on the far right of the AudioPlayer.
2. **Expected Outcome**: A clean popover/drawer appears over the player listing all tracks currently in the queue, letting you view or jump between tracks without leaving your current page.

### Scenario 5: In-Page Playlist Track Addition
1. Navigate to a playlist you own (`/playlists/:id`).
2. Locate the "Add Tracks" section within the playlist management view.
3. Search or browse available tracks directly inside the panel and click "Add" next to a song.
4. **Expected Outcome**: The song is immediately appended to the playlist and displayed in the track list above, completely within the same view.
