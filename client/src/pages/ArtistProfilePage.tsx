import { useState } from 'react';
import { useUpdateArtistProfile } from '@/hooks/usePayments';
import { useAuth } from '@/hooks/useAuth';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GENRE_OPTIONS } from '@/lib/constants';
import { GoogleAdUnit } from '@/components/ads/GoogleAdUnit';
import { useAdsConfig } from '@/hooks/useAds';

export function ArtistProfilePage() {
  const { meQuery } = useAuth();
  const update = useUpdateArtistProfile();
  const { data: adsConfigData } = useAdsConfig();
  const [artistName, setArtistName] = useState(meQuery.data?.data.artistName ?? '');
  const [bio, setBio] = useState('');
  const [genre, setGenre] = useState('Afrobeats');
  const [message, setMessage] = useState('');

  const save = async () => {
    await update.mutateAsync({
      artistName,
      bio,
      genres: [genre],
    });
    setMessage('Profile updated');
  };

  return (
    <AppShell maxWidth="2xl">
      <h1 className="mb-6 text-[22px] font-medium text-foreground">Artist profile</h1>

      {adsConfigData?.data?.googleAdsEnabled !== false &&
        import.meta.env.VITE_ADSENSE_SLOT_ARTIST && (
          <div className="mb-6 max-w-full overflow-hidden">
            <GoogleAdUnit
              slotId={import.meta.env.VITE_ADSENSE_SLOT_ARTIST}
              format="leaderboard"
              className="my-4"
            />
          </div>
        )}

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
          <Label htmlFor="genres">Primary Genre</Label>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger id="genres" className="w-full">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              {GENRE_OPTIONS.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="button" variant="default" onClick={save} disabled={update.isPending}>
          Save profile
        </Button>
      </Card>
    </AppShell>
  );
}
