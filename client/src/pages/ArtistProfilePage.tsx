import { useState } from 'react';
import { useUpdateArtistProfile } from '../hooks/usePayments';
import { useAuth } from '../hooks/useAuth';
import { DesignSystemLayout } from '../components/layout/DesignSystemLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

const textareaClassName = cn(
  'w-full min-h-[120px] rounded-sm border border-hairline bg-canvas px-3 py-2 text-base text-ink',
  'placeholder:text-muted-soft',
  'focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-primary/20',
);

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
    <DesignSystemLayout maxWidth="2xl">
      <h1 className="mb-6 text-[22px] font-medium text-ink">Artist profile</h1>

      <Card className="space-y-4">
        {message && <p className="text-sm text-muted">{message}</p>}
        <Input
          label="Artist name"
          placeholder="Artist name"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
        />
        <div className="space-y-1">
          <label htmlFor="bio" className="block text-sm font-medium text-ink">
            Bio
          </label>
          <textarea
            id="bio"
            className={textareaClassName}
            placeholder="Bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <Input
          label="Genres"
          placeholder="Genres (comma separated)"
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
        />
        <Button type="button" variant="primary" onClick={save} disabled={update.isPending}>
          Save profile
        </Button>
      </Card>
    </DesignSystemLayout>
  );
}
