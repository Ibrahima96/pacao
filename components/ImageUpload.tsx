import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImage } from '../lib/imageUpload';

interface ImageUploadProps {
    currentImage?: string;
    onImageChange: (imageUrl: string) => void;
    label?: string;
    className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    currentImage,
    onImageChange,
    label = "Image",
    className = ""
}) => {
    const [uploading, setUploading] = useState(false);
    const [urlInput, setUrlInput] = useState(currentImage || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner une image valide');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('L\'image ne doit pas dépasser 5MB');
            return;
        }

        setUploading(true);
        try {
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                onImageChange(imageUrl);
                setUrlInput(imageUrl);
            } else {
                alert('Échec de l\'upload. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Erreur lors de l\'upload');
        } finally {
            setUploading(false);
        }
    };

    const handleUrlChange = (newUrl: string) => {
        setUrlInput(newUrl);
        onImageChange(newUrl);
    };

    return (
        <div className={`space-y-3 ${className}`}>
            <label className="block text-white/70 text-sm font-medium mb-2">{label}</label>

            {/* URL Input */}
            <div className="space-y-2">
                <label className="block text-white/50 text-xs">URL de l'image</label>
                <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-black/20 border border-white/10 p-3 text-white rounded text-sm"
                    value={urlInput}
                    onChange={(e) => handleUrlChange(e.target.value)}
                />
            </div>

            {/* Separator */}
            <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-white/30 text-xs uppercase">ou</span>
                <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
                <label className="block text-white/50 text-xs">Upload depuis l'ordinateur</label>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full bg-black/20 border border-white/10 p-3 text-white rounded hover:bg-white/5 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Upload en cours...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4" />
                            Choisir une image
                        </>
                    )}
                </button>
                <p className="text-xs text-white/40">
                    JPG, PNG, GIF, WebP - Max 5MB
                </p>
            </div>

            {/* Image Preview */}
            {(currentImage || urlInput) && (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-white/10 bg-black/20 mt-3">
                    <img
                        src={currentImage || urlInput}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Invalid';
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            onImageChange('');
                            setUrlInput('');
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};
