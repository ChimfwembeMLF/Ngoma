import { useState } from 'react';
import { useUpdateArtistProfile } from '@/hooks/usePayments';
import { useAuth } from '@/hooks/useAuth';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function ArtistProfilePage() {
  const { meQuery } = useAuth();
  const update = useUpdateArtistProfile();
  const [artistName, setArtistName] = useState(meQuery.data?.data.artistName ?? '');
  const [bio, setBio] = useState('');
  const [genres, setGenres] = useState('Afrobeats, Amapiano');
  const [message, setMessage] = useState('');

  const save = async () => {
    await update.mutateAsync({
      artistName,
      bio,
      genres: genres.split(',').map((g) => g.trim()).filter(Boolean),
    });
    setMessage('Profile updated');
  };

  return (
    <AppShell maxWidth="2xl">
      <h1 className="mb-6 text-[22px] font-medium text-foreground">Artist profile</h1>

      <Card className="space-y-4 p-6">
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
        <div className="space-y-2">
          <Label htmlFor="artistName">Artist name</Label>
          <Input
            id="artistName"
            placeholder="Artist name"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="genres">Genres</Label>
          <Input
            id="genres"
            placeholder="Genres (comma separated)"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
          />
        </div>
        <Button type="button" variant="default" onClick={save} disabled={update.isPending}>
          Save profile
        </Button>
      </Card>
    </AppShell>
  );
}
