import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name (default: 'images')
 * @returns The public URL of the uploaded image, or null if upload fails
 */
export const uploadImage = async (file: File, bucket: string = 'images'): Promise<string | null> => {
    if (!isSupabaseConfigured()) {
        console.error('Supabase is not configured');
        return null;
    }

    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            return null;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Upload failed:', error);
        return null;
    }
};

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The full URL of the image to delete
 * @param bucket - The storage bucket name (default: 'images')
 */
export const deleteImage = async (imageUrl: string, bucket: string = 'images'): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        return false;
    }

    try {
        // Extract file path from URL
        const urlParts = imageUrl.split('/');
        const filePath = urlParts[urlParts.length - 1];

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error('Delete error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Delete failed:', error);
        return false;
    }
};
