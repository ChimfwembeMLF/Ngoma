import * as React from 'react';
import { cn } from '@/lib/utils';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

interface FileUploadZoneProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in bytes
  label?: string;
  description?: string;
  selectedFile?: File | null;
}

export function FileUploadZone({
  onFileSelect,
  accept,
  maxSize,
  label = 'Click or drag file to this area to upload',
  description = 'Support for a single or bulk upload.',
  selectedFile,
  className,
  ...props
}: FileUploadZoneProps) {
  const [isDragActive, setIsDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (maxSize && file.size > maxSize) {
      alert(`File is too large. Max size is ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }
    // Very basic accept check
    if (accept) {
      const acceptedTypes = accept.split(',').map((t) => t.trim());
      const fileType = file.type;
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase();
        }
        if (type.endsWith('/*')) {
          const baseType = type.split('/')[0];
          return fileType.startsWith(baseType + '/');
        }
        return fileType === type;
      });

      if (!isAccepted) {
        alert('Invalid file type.');
        return;
      }
    }

    onFileSelect(file);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-border bg-muted/50 hover:bg-muted/80',
          selectedFile && 'border-solid border-border bg-card hover:bg-card'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !selectedFile && inputRef.current?.click()}
      >
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
          ref={inputRef}
          {...props}
        />

        {selectedFile ? (
          <div className="flex w-full items-center justify-between gap-4 rounded-md border border-border bg-muted p-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileIcon className="h-5 w-5" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-foreground">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UploadCloud className="h-6 w-6" />
            </div>
            <p className="mb-1 text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
