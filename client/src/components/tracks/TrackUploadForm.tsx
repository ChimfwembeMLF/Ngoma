import { useState } from 'react';
import {
  useCreateTrack,
  useUploadTrackFiles,
  useUpdateTrack,
  type PricingType,
} from '../../hooks/useTracks';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const PRICING_OPTIONS: { value: PricingType; label: string }[] = [
  { value: 'SET_PRICE', label: 'Set price' },
  { value: 'PAY_WHAT_YOU_WANT', label: 'Pay what you want' },
  { value: 'FREE', label: 'Free' },
];

export function TrackUploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const createTrack = useCreateTrack();
  const uploadFiles = useUploadTrackFiles();
  const updateTrack = useUpdateTrack();
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Afrobeats');
  const [pricingType, setPricingType] = useState<PricingType>('SET_PRICE');
  const [price, setPrice] = useState('10');
  const [minPrice, setMinPrice] = useState('1');
  const [audio, setAudio] = useState<File | null>(null);
  const [error, setError] = useState('');

  const submit = async (publish: boolean) => {
    setError('');
    try {
      const body: Parameters<typeof createTrack.mutateAsync>[0] = {
        title,
        genre,
        pricingType,
      };
      if (pricingType === 'SET_PRICE') {
        body.price = Number(price);
      } else if (pricingType === 'PAY_WHAT_YOU_WANT') {
        body.minPrice = Number(minPrice);
      }

      const result = await createTrack.mutateAsync(body);
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
    <Card className="space-y-4">
      <h3 className="text-base font-semibold text-ink">Upload track</h3>
      {error && <p className="text-sm text-error">{error}</p>}
      <Input
        label="Track title"
        placeholder="Track title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        label="Genre"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-ink">Pricing</legend>
        <div className="flex flex-wrap gap-4">
          {PRICING_OPTIONS.map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="pricingType"
                value={option.value}
                checked={pricingType === option.value}
                onChange={() => setPricingType(option.value)}
                className="accent-primary"
              />
              <span className="text-ink">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {pricingType === 'SET_PRICE' && (
        <Input
          label="Price (ZMW)"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Price (ZMW)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      )}

      {pricingType === 'PAY_WHAT_YOU_WANT' && (
        <Input
          label="Minimum price (ZMW)"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Minimum (ZMW)"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      )}

      <div className="space-y-1">
        <label htmlFor="track-audio" className="block text-sm font-medium text-ink">
          Audio file
        </label>
        <input
          id="track-audio"
          type="file"
          accept="audio/*"
          onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-muted file:mr-3 file:rounded-sm file:border file:border-hairline file:bg-surface-soft file:px-3 file:py-2 file:text-sm file:text-ink"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => submit(false)}
          disabled={!title || createTrack.isPending}
        >
          Save draft
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() => submit(true)}
          disabled={!title || !audio || createTrack.isPending}
        >
          Publish
        </Button>
      </div>
    </Card>
  );
}
