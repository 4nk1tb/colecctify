import React from 'react';
import { motion, Reorder } from 'framer-motion';
import { Plus, DynamicIcon, Home, Edit } from './Icons';
import type { Collection } from '../types';

interface SidebarProps {
  collections: Collection[];
  selectedCollectionId: string | null;
  onSelectCollection: (id: string | null) => void;
  onReorderCollections: (collections: Collection[]) => void;
  onNewCollection: () => void;
  onEditCollection: (collection: Collection) => void;
}

const CollectionItem: React.FC<{
  collection: Collection,
  isSelected: boolean,
  onSelect: () => void,
  onEdit: (e: React.MouseEvent) => void;
}> = ({ collection, isSelected, onSelect, onEdit }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <Reorder.Item
      value={collection}
      id={collection.id}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full rounded-lg transition-colors duration-200 cursor-pointer group focus-within:ring-2 focus-within:ring-violet-500 focus:outline-none ${
        isSelected ? 'bg-violet-500/20 text-violet-700 dark:text-violet-300' : 'hover:bg-gray-500/10'
      }`}
      whileDrag={{ scale: 1.05, boxShadow: '0px 5px 15px rgba(0,0,0,0.2)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button onClick={onSelect} className="flex items-center w-full text-left p-3 space-x-3">
        <div className="w-6 h-6 flex items-center justify-center rounded-md" style={{ backgroundColor: collection.color || '#6b7280' }}>
            <DynamicIcon name={collection.icon || 'Collection'} className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium text-gray-800 dark:text-gray-200 flex-1 truncate pr-6">{collection.name}</span>
      </button>
      <motion.button
        onClick={onEdit}
        className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-500/20 focus:outline-none focus:ring-2 focus:ring-violet-500"
        aria-label={`Edit ${collection.name}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
        transition={{ duration: 0.15 }}
      >
        <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </motion.button>
    </Reorder.Item>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  collections,
  selectedCollectionId,
  onSelectCollection,
  onReorderCollections,
  onNewCollection,
  onEditCollection,
}) => {
  return (
    <motion.aside 
        className="hidden lg:block fixed top-0 left-0 h-full w-72 p-4 bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-xl border-r border-white/30 dark:border-gray-700/50"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">colecctify</h1>
        </div>

        <div className="mb-4">
          <motion.button
            onClick={() => onSelectCollection(null)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center w-full text-left p-3 space-x-3 rounded-lg font-medium transition-colors ${
              selectedCollectionId === null ? 'bg-violet-500/20 text-violet-700 dark:text-violet-300' : 'hover:bg-gray-500/10 text-gray-800 dark:text-gray-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>All Bookmarks</span>
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase tracking-wider">Collections</h2>
            <Reorder.Group axis="y" values={collections} onReorder={onReorderCollections} className="space-y-1">
                {collections.map(collection => (
                    <CollectionItem
                        key={collection.id}
                        collection={collection}
                        isSelected={selectedCollectionId === collection.id}
                        onSelect={() => onSelectCollection(collection.id)}
                        onEdit={(e) => { e.stopPropagation(); onEditCollection(collection); }}
                    />
                ))}
            </Reorder.Group>
        </div>

        <div className="mt-auto pt-4 border-t border-black/10 dark:border-white/10">
          <motion.button
            onClick={onNewCollection}
            className="flex items-center justify-center w-full p-3 rounded-lg font-semibold text-white bg-violet-500 hover:bg-violet-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 dark:focus:ring-offset-gray-800 focus:ring-violet-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Collection
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};