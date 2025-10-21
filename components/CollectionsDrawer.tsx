import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DynamicIcon, Edit, Plus, X } from './Icons';
import type { Collection } from '../types';

interface CollectionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  selectedCollectionId: string | null;
  onSelectCollection: (id: string | null) => void;
  onEditCollection: (collection: Collection) => void;
  onNewCollection: () => void;
}

export const CollectionsDrawer: React.FC<CollectionsDrawerProps> = ({
  isOpen,
  onClose,
  collections,
  selectedCollectionId,
  onSelectCollection,
  onEditCollection,
  onNewCollection,
}) => {
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden"
          aria-modal="true"
        >
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-h-[80vh] bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-t-2xl shadow-2xl border-t border-white/20 dark:border-gray-700/50 flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: 'spring', stiffness: 350, damping: 40 }}
          >
            <div className="flex-shrink-0 p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Collections</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500"
                aria-label="Close collections"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {collections.map(collection => (
                <CollectionItem
                  key={collection.id}
                  collection={collection}
                  isSelected={selectedCollectionId === collection.id}
                  onSelect={() => onSelectCollection(collection.id)}
                  onEdit={(e) => { e.stopPropagation(); onEditCollection(collection); }}
                />
              ))}
            </div>
            <div className="flex-shrink-0 p-4 border-t border-black/10 dark:border-white/10">
                <motion.button
                    onClick={() => {
                        onNewCollection();
                        onClose();
                    }}
                    className="flex items-center justify-center w-full p-3 rounded-lg font-semibold text-white bg-violet-500 hover:bg-violet-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-violet-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Collection
                </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CollectionItem: React.FC<{
  collection: Collection,
  isSelected: boolean,
  onSelect: () => void,
  onEdit: (e: React.MouseEvent) => void;
}> = ({ collection, isSelected, onSelect, onEdit }) => (
  <div className="relative group">
    <button
      onClick={onSelect}
      className={`flex items-center w-full text-left p-3 space-x-4 rounded-lg font-medium transition-colors ${
        isSelected
          ? 'bg-violet-500/20 text-violet-700 dark:text-violet-300'
          : 'hover:bg-gray-500/10 text-gray-800 dark:text-gray-200'
      }`}
    >
      <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ backgroundColor: collection.color || '#6b7280' }}>
        <DynamicIcon name={collection.icon || 'Collection'} className="w-5 h-5 text-white" />
      </div>
      <span className="flex-1 truncate">{collection.name}</span>
    </button>
    <button
        onClick={onEdit}
        className="absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-full bg-gray-500/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-violet-500"
        aria-label={`Edit ${collection.name}`}
      >
        <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>
  </div>
);