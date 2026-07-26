import { useState } from 'react';
import { useUpdatePlaylist, useUploadPlaylistCover, type PlaylistDetail } from '@/hooks/usePlaylists';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export function EditPlaylistDialog({ playlist, onClose }: { playlist: PlaylistDetail; onClose: () => void }) {
  const updatePlaylist = useUpdatePlaylist();
  const uploadCover = useUploadPlaylistCover();

  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description || '');
  const [isPublic, setIsPublic] = useState(playlist.isPublic);
  const [coverArt, setCoverArt] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const isPending = updatePlaylist.isPending || uploadCover.isPending;

  const handleCoverSelect = (file: File | null) => {
    setCoverArt(file);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    try {
      await updatePlaylist.mutateAsync({
        id: playlist.id,
        name: name.trim(),
        description: description.trim() || undefined,
        isPublic,
      });

      if (coverArt) {
        await uploadCover.mutateAsync({
          id: playlist.id,
          coverArt,
        });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update playlist');
    }
  };

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 text-foreground">Edit Playlist</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-playlist-name">Name</Label>
          <Input
            id="edit-playlist-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-playlist-desc">Description (optional)</Label>
          <Textarea
            id="edit-playlist-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-playlist-cover">Cover Image (optional)</Label>
          <Input
            id="edit-playlist-cover"
            type="file"
            accept="image/*"
            onChange={(e) => handleCoverSelect(e.target.files?.[0] ?? null)}
            className="text-sm text-muted-foreground file:mr-3 file:rounded-sm file:border file:border-border file:bg-muted file:px-3 file:py-2 file:text-sm file:text-foreground"
          />
          {coverPreview && (
            <img src={coverPreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md border border-border" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="edit-playlist-public"
            checked={isPublic}
            onCheckedChange={(checked) => setIsPublic(checked === true)}
          />
          <Label htmlFor="edit-playlist-public" className="font-normal">
            Public playlist
          </Label>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="default" disabled={isPending}>
            {isPending ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
