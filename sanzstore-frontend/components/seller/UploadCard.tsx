
import React, { useState, useCallback } from 'react';
import { UploadCloud, X, FileText } from '../Icons';

interface UploadCardProps {
    onFileSelect: (file: File | null) => void;
}

const UploadCard: React.FC<UploadCardProps> = ({ onFileSelect }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (selectedFile: File | null) => {
        if (selectedFile) {
            setFile(selectedFile);
            onFileSelect(selectedFile);
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setPreview(null);
            }
        }
    };
    
    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            handleFileChange(event.dataTransfer.files[0]);
        }
    }, []);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const removeFile = () => {
        setFile(null);
        setPreview(null);
        onFileSelect(null);
    }
    
    return (
        <div 
            className="w-full p-6 border-2 border-dashed border-slate-600 hover:border-primary rounded-xl text-center transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, application/pdf"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
            {!file ? (
                <label htmlFor="file-upload" className="cursor-pointer">
                    <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                    <p className="mt-2 text-sm text-slate-300">
                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">PNG, JPG, or PDF (MAX. 5MB)</p>
                </label>
            ) : (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                        ) : (
                            <FileText className="w-12 h-12 text-slate-400" />
                        )}
                        <div>
                            <p className="text-sm font-semibold text-white text-left truncate max-w-xs">{file.name}</p>
                            <p className="text-xs text-slate-400 text-left">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button onClick={removeFile} className="p-2 text-red-500 rounded-full hover:bg-red-500/10">
                        <X className="w-5 h-5"/>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadCard;
