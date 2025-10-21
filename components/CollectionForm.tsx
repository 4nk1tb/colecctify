import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, Input, GlassButton } from './UI';
import { iconMap, DynamicIcon, Check } from './Icons';
import { COLOR_PALETTE } from '../constants';
import type { Collection } from '../types';

interface CollectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collection: Omit<Collection, 'createdAt' | 'updatedAt'>) => void;
  initialData?: Collection | null;
}

const availableIcons = Object.keys(iconMap).filter(key => 
  !['Plus', 'Search', 'X', 'Trash', 'Edit', 'Home', 'Squares2x2', 'Spinner', 'Check'].includes(key)
);

export const CollectionForm: React.FC<CollectionFormProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = React.useState('');
  const [color, setColor] = React.useState(COLOR_PALETTE[8]);
  const [icon, setIcon] = React.useState('Collection');
  
  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setColor(initialData.color || COLOR_PALETTE[8]);
        setIcon(initialData.icon || 'Collection');
      } else {
        // Reset form for new collection
        setName('');
        setColor(COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]);
        setIcon('Collection');
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: initialData?.id || `c${Date.now()}`,
      name: name.trim(),
      color,
      icon,
    });
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Collection' : 'New Collection'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="collection-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Collection Name
          </label>
          <Input
            id="collection-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Design Systems"
            required
            autoFocus
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
            </label>
            <div className="grid grid-cols-8 gap-2">
                {COLOR_PALETTE.map(c => (
                    <motion.button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className="relative w-full aspect-square rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-violet-500"
                        style={{ backgroundColor: c }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {color === c && (
                            <motion.div layoutId="color-check" className="absolute inset-0 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Icon
            </label>
            <div className="grid grid-cols-8 gap-2">
                 {availableIcons.map(iconName => (
                    <motion.button
                        key={iconName}
                        type="button"
                        onClick={() => setIcon(iconName)}
                        className={`relative w-full aspect-square rounded-lg flex items-center justify-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-violet-500 ${icon === iconName ? 'bg-violet-500/20' : 'bg-gray-200/50 dark:bg-gray-700/50'}`}
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.9 }}
                    >
                        <DynamicIcon name={iconName} className={`w-5 h-5 ${icon === iconName ? 'text-violet-600 dark:text-violet-300' : 'text-gray-600 dark:text-gray-400'}`} />
                    </motion.button>
                ))}
            </div>
        </div>

        <div className="pt-2 flex justify-end">
          <GlassButton type="submit">
            {initialData ? 'Save Changes' : 'Create Collection'}
          </GlassButton>
        </div>
      </form>
    </Dialog>
  );
};
