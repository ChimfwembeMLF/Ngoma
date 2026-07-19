import { useState } from 'react';
import { useUpdateArtistProfile } from '../hooks/usePayments';
import { useAuth } from '../hooks/useAuth';

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
    <div className="max-w-xl mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold text-cream">Artist profile</h1>
      {message && <p className="text-green-400 text-sm">{message}</p>}
      <input
        className="w-full rounded-lg bg-indigo-950 border border-indigo-700 px-3 py-2 text-cream"
        placeholder="Artist name"
        value={artistName}
        onChange={(e) => setArtistName(e.target.value)}
      />
      <textarea
        className="w-full rounded-lg bg-indigo-950 border border-indigo-700 px-3 py-2 text-cream"
        placeholder="Bio"
        rows={4}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <input
        className="w-full rounded-lg bg-indigo-950 border border-indigo-700 px-3 py-2 text-cream"
        placeholder="Genres (comma separated)"
        value={genres}
        onChange={(e) => setGenres(e.target.value)}
      />
      <button
        type="button"
        onClick={save}
        className="px-4 py-2 rounded-lg bg-terracotta text-white"
      >
        Save profile
      </button>
    </div>
  );
}
