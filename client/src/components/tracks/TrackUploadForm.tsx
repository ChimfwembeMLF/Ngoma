import { useState } from 'react';
import { useCreateTrack, useUploadTrackFiles, useUpdateTrack } from '../../hooks/useTracks';

export function TrackUploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const createTrack = useCreateTrack();
  const uploadFiles = useUploadTrackFiles();
  const updateTrack = useUpdateTrack();
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Afrobeats');
  const [price, setPrice] = useState('10');
  const [audio, setAudio] = useState<File | null>(null);
  const [error, setError] = useState('');

  const submit = async (publish: boolean) => {
    setError('');
    try {
      const result = await createTrack.mutateAsync({
        title,
        genre,
        pricingType: 'SET_PRICE',
        price: Number(price),
      });
      const trackId = result.data.id;
      if (audio) {
        await uploadFiles.mutateAsync({ id: trackId, audio });
      }
      if (publish) {
        await updateTrack.mutateAsync({ id: trackId, isPublished: true });
      }
      setTitle('');
      setAudio(null);
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    }
  };

  return (
    <div className="rounded-xl border border-indigo-800/40 bg-indigo-950/30 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-cream">Upload track</h3>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <input
        className="w-full rounded-lg bg-indigo-950 border border-indigo-700 px-3 py-2 text-cream"
        placeholder="Track title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="w-full rounded-lg bg-indigo-950 border border-indigo-700 px-3 py-2 text-cream"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />
      <input
        className="w-full rounded-lg bg-indigo-950 border border-indigo-700 px-3 py-2 text-cream"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="Price (ZMW)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
        className="text-cream text-sm"
      />
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => submit(false)}
          disabled={!title || createTrack.isPending}
          className="px-4 py-2 rounded-lg border border-indigo-600 text-cream"
        >
          Save draft
        </button>
        <button
          type="button"
          onClick={() => submit(true)}
          disabled={!title || !audio || createTrack.isPending}
          className="px-4 py-2 rounded-lg bg-terracotta text-white"
        >
          Publish
        </button>
      </div>
    </div>
  );
}
