import { useState } from 'react';
import { useCreatePlaylist, useMyPlaylists } from '@/hooks/usePlaylists';
import { AppShell } from '@/components/layout/AppShell';
import { PlaylistCard } from '@/components/playlists/PlaylistCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export function PlaylistsPage() {
  const { data, isLoading } = useMyPlaylists();
  const createPlaylist = useCreatePlaylist();
  const playlists = data?.data ?? [];

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    try {
      await createPlaylist.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        isPublic,
      });
      setName('');
      setDescription('');
      setIsPublic(true);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create playlist');
    }
  };

  return (
    <AppShell maxWidth="4xl">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold text-foreground">My playlists</h1>
        <Button variant="default" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Create playlist'}
        </Button>
      </header>

      {showForm && (
        <Card className="mb-8 p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="playlist-name">Name</Label>
              <Input
                id="playlist-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="playlist-description">Description (optional)</Label>
              <Textarea
                id="playlist-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="playlist-public"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked === true)}
              />
              <Label htmlFor="playlist-public" className="font-normal">
                Public playlist
              </Label>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" variant="default" disabled={createPlaylist.isPending}>
              {createPlaylist.isPending ? 'Creating…' : 'Create'}
            </Button>
          </form>
        </Card>
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Loading playlists…</p>}

      {!isLoading && playlists.length === 0 && (
        <Card className="p-6">
          <p className="text-muted-foreground">No playlists yet.</p>
          {!showForm && (
            <Button variant="default" className="mt-4" onClick={() => setShowForm(true)}>
              Create your first playlist
            </Button>
          )}
        </Card>
      )}

      {!isLoading && playlists.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              name={playlist.name}
              trackCount={playlist.trackCount}
              coverArtUrl={playlist.coverArtUrl}
              href={`/playlists/${playlist.id}`}
              subtitle={playlist.description ?? undefined}
              badge={
                <span className="shrink-0 rounded-sm bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {playlist.isPublic ? 'Public' : 'Private'}
                </span>
              }
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
