import React from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Dialog, Input, Textarea, Select, GlassButton } from './UI';
import { useDebounce } from '../hooks/useAppHooks';
import type { Bookmark, Collection } from '../types';
import { Spinner } from './Icons';

interface BookmarkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookmark: Omit<Bookmark, 'createdAt' | 'updatedAt' | 'faviconUrl'>) => void;
  initialData?: Bookmark | null;
  collections: Collection[];
  defaultCollectionId?: string | null;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const isValidUrl = (str: string) => {
    try {
        new URL(str);
        return true;
    } catch (_) {
        return false;
    }
};

export const BookmarkForm: React.FC<BookmarkFormProps> = ({ isOpen, onClose, onSave, initialData, collections, defaultCollectionId }) => {
  const [url, setUrl] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [collectionId, setCollectionId] = React.useState<string>(collections[0]?.id || '');
  
  const [isFetchingMetadata, setIsFetchingMetadata] = React.useState(false);
  const [metadataError, setMetadataError] = React.useState<string | null>(null);

  const debouncedUrl = useDebounce(url, 500);

  const titleRef = React.useRef(title);
  const descriptionRef = React.useRef(description);
  
  React.useEffect(() => {
    titleRef.current = title;
    descriptionRef.current = description;
  }, [title, description]);

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setUrl(initialData.url);
        setTitle(initialData.title);
        setDescription(initialData.description || '');
        setCollectionId(initialData.collectionId);
      } else {
        // Reset form for new bookmark
        setUrl('');
        setTitle('');
        setDescription('');
        setCollectionId(defaultCollectionId || collections[0]?.id || '');
      }
      setIsFetchingMetadata(false);
      setMetadataError(null);
    }
  }, [isOpen, initialData, collections, defaultCollectionId]);
  
  React.useEffect(() => {
    const fetchMetadata = async () => {
      if (isValidUrl(debouncedUrl)) {
        setIsFetchingMetadata(true);
        setMetadataError(null);
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Extract the title and a short, one-sentence description from the content of this webpage: ${debouncedUrl}.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: 'The main title of the web page.' },
                            description: { type: Type.STRING, description: 'A concise, one-sentence summary of the page content.' }
                        }
                    },
                },
            });
            const text = response.text.trim();
            const metadata = JSON.parse(text);

            if (metadata.title && !titleRef.current) {
                setTitle(metadata.title);
            }
            if (metadata.description && !descriptionRef.current) {
                setDescription(metadata.description);
            }
        } catch (error) {
            console.error('Failed to fetch metadata:', error);
            setMetadataError('Could not fetch details for this URL.');
        } finally {
            setIsFetchingMetadata(false);
        }
      }
    };

    if (debouncedUrl && !initialData) { // Only auto-fetch for new bookmarks
        fetchMetadata();
    }
  }, [debouncedUrl, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim() || !collectionId) return;
    onSave({
      id: initialData?.id || `b${Date.now()}`,
      url: url.trim(),
      title: title.trim(),
      description: description.trim(),
      collectionId,
    });
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Bookmark' : 'New Bookmark'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bookmark-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            URL
          </label>
          <Input
            id="bookmark-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            autoFocus
            endIcon={isFetchingMetadata && <Spinner className="w-5 h-5" />}
          />
          {metadataError && <p className="text-sm text-red-500 mt-1">{metadataError}</p>}
        </div>
        <div>
          <label htmlFor="bookmark-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <Input
            id="bookmark-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. My Awesome Link"
            required
          />
        </div>
         <div>
          <label htmlFor="bookmark-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <Textarea
            id="bookmark-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="(Optional) A short summary..."
          />
        </div>
         <div>
          <label htmlFor="bookmark-collection" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Collection
          </label>
          <Select
            id="bookmark-collection"
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            required
          >
            {collections.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="pt-2 flex justify-end">
          <GlassButton type="submit" disabled={isFetchingMetadata}>
            {isFetchingMetadata ? 'Fetching...' : (initialData ? 'Save Changes' : 'Create Bookmark')}
          </GlassButton>
        </div>
      </form>
    </Dialog>
  );
};
