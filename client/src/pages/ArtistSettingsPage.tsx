import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUpdateUserAccount, useUpdateArtistProfile, useUploadImage } from '@/hooks/useSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUploadZone } from '@/components/ui/file-upload-zone';
import { AppShell } from '@/components/layout/AppShell';

export function ArtistSettingsPage() {
  const { meQuery } = useAuth();
  const user = meQuery.data?.data;

  const updateUser = useUpdateUserAccount();
  const updateArtist = useUpdateArtistProfile();
  const uploadImage = useUploadImage();

  // Account State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  
  // Profile State
  const [artistName, setArtistName] = useState(user?.artistName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [coverImageUrl, setCoverImageUrl] = useState(user?.coverImageUrl || '');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser.mutateAsync({ fullName, email, password: password || undefined, avatarUrl });
    setPassword(''); // clear password on success
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateArtist.mutateAsync({ artistName, bio, coverImageUrl });
  };

  const handleImageUpload = async (file: File | undefined, setUrl: (url: string) => void) => {
    if (!file) return;
    try {
      const url = await uploadImage.mutateAsync(file);
      setUrl(url);
    } catch (e) {
      console.error('Image upload failed', e);
    }
  };

  if (meQuery.isLoading) return <div>Loading...</div>;

  return (
    <AppShell>
      <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account and public artist profile.</p>
        </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="profile">Artist Profile</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
              <CardDescription>
                This information will be displayed publicly on your artist page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="flex flex-col gap-4">
                    {coverImageUrl && (
                      <div className="flex items-center gap-4">
                        <img src={coverImageUrl} alt="Cover" className="w-24 h-24 object-cover rounded-md border border-border" />
                        <Button type="button" variant="outline" size="sm" onClick={() => setCoverImageUrl('')}>Remove</Button>
                      </div>
                    )}
                    <FileUploadZone
                      accept="image/*"
                      onFileSelect={(file) => handleImageUpload(file ?? undefined, setCoverImageUrl)}
                      label="Click or drag cover image"
                      description="Upload a high-quality cover photo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="artistName">Artist Name</Label>
                  <Input
                    id="artistName"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="Your stage name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell your fans about yourself..."
                    className="min-h-[150px]"
                  />
                </div>

                <Button type="submit" disabled={updateArtist.isPending}>
                  {updateArtist.isPending ? 'Saving...' : 'Save Profile'}
                </Button>
                {updateArtist.isSuccess && <span className="ml-4 text-sm text-green-500">Profile saved!</span>}
                {updateArtist.isError && <span className="ml-4 text-sm text-red-500">Error saving profile.</span>}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>
                Update your login credentials and personal information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAccountSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Profile Avatar</Label>
                  <div className="flex flex-col gap-4">
                    {avatarUrl && (
                      <div className="flex items-center gap-4">
                        <img src={avatarUrl} alt="Avatar" className="w-16 h-16 object-cover rounded-full border border-border" />
                        <Button type="button" variant="outline" size="sm" onClick={() => setAvatarUrl('')}>Remove</Button>
                      </div>
                    )}
                    <FileUploadZone
                      accept="image/*"
                      onFileSelect={(file) => handleImageUpload(file ?? undefined, setAvatarUrl)}
                      label="Click or drag profile avatar"
                      description="Upload a profile picture"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your legal name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">New Password (optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <Button type="submit" disabled={updateUser.isPending}>
                  {updateUser.isPending ? 'Saving...' : 'Save Account'}
                </Button>
                {updateUser.isSuccess && <span className="ml-4 text-sm text-green-500">Account saved!</span>}
                {updateUser.isError && <span className="ml-4 text-sm text-red-500">Error saving account.</span>}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </AppShell>
  );
}
