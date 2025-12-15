# Supabase Storage Setup for Profile Pictures

This document explains how to set up the Supabase storage bucket for profile pictures.

## 1. Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Enable (so profile pictures are publicly accessible)
   - **File size limit**: 2MB (recommended)
   - **Allowed MIME types**: `image/*` (or specifically: `image/jpeg`, `image/png`, `image/webp`)

## 2. Set Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies:

### Policy 1: Public Read Access
Allow anyone to view profile pictures:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );
```

### Policy 2: Authenticated Upload
Allow authenticated users to upload their own avatars:

```sql
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 3: Authenticated Update
Allow users to update their own avatars:

```sql
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 4: Authenticated Delete
Allow users to delete their own avatars:

```sql
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 3. File Naming Convention

Files will be stored with the following structure:
```
avatars/
  └── {user_id}/
      └── avatar.{extension}
```

Example: `avatars/123e4567-e89b-12d3-a456-426614174000/avatar.jpg`

## 4. Verify Setup

To verify your setup is working:

1. Go to **Storage** → **avatars** bucket
2. Try uploading a test image manually
3. Check if the image is publicly accessible via its URL
4. The URL format will be:
   ```
   https://{project-ref}.supabase.co/storage/v1/object/public/avatars/{user_id}/avatar.{ext}
   ```

## 5. Integration

The app will automatically:
- Upload images to `avatars/{user_id}/avatar.{extension}`
- Store the public URL in the `profiles.avatar_url` column
- Display the avatar throughout the app
- Delete old avatars when uploading new ones

## Notes

- Maximum file size is set to 2MB to keep storage costs low
- Only image files are allowed
- Old avatars are automatically deleted when uploading new ones
- If a user doesn't have an avatar, their initials will be displayed instead
