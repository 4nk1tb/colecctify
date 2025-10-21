import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { BookmarkCard } from './components/BookmarkCard';
import { MobileNav } from './components/MobileNav';
import { CollectionsDrawer } from './components/CollectionsDrawer';
import { CollectionForm } from './components/CollectionForm';
import { BookmarkForm } from './components/BookmarkForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import { EmptyState } from './components/UI';
import { Collection as CollectionIcon } from './components/Icons';
import { useDebounce } from './hooks/useAppHooks';
import { getData, saveData } from './lib/storage';
import type { AppData, Bookmark, Collection } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(getData());
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollectionsDrawerOpen, setIsCollectionsDrawerOpen] = useState(false);
  const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isBookmarkFormOpen, setIsBookmarkFormOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [deletingBookmark, setDeletingBookmark] = useState<Bookmark | null>(null);
  
  const { collections, bookmarks } = data;
  const mainScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // A simple way to sync data across tabs
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'colecctify:v1') {
            setData(getData());
        }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  useEffect(() => {
    saveData(data);
  }, [data]);

  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const filteredBookmarks = useMemo(() => {
    const lowercasedQuery = debouncedSearchQuery.toLowerCase().trim();
    
    const bookmarksInView = selectedCollectionId
      ? bookmarks.filter(b => b.collectionId === selectedCollectionId)
      : bookmarks;

    if (!lowercasedQuery) {
      return bookmarksInView;
    }

    if (selectedCollectionId) {
      return bookmarksInView.filter(b => 
        b.title.toLowerCase().includes(lowercasedQuery) || 
        b.url.toLowerCase().includes(lowercasedQuery)
      );
    }

    const matchingCollectionIds = new Set(collections
      .filter(c => c.name.toLowerCase().includes(lowercasedQuery))
      .map(c => c.id));

    return bookmarks.filter(b => 
      b.title.toLowerCase().includes(lowercasedQuery) ||
      b.url.toLowerCase().includes(lowercasedQuery) ||
      matchingCollectionIds.has(b.collectionId)
    );
  }, [bookmarks, collections, selectedCollectionId, debouncedSearchQuery]);

  const currentCollection = useMemo(() => {
    return collections.find(c => c.id === selectedCollectionId) || null;
  }, [collections, selectedCollectionId]);

  const handleSelectCollection = (id: string | null) => {
    setSelectedCollectionId(id);
    setIsCollectionsDrawerOpen(false);
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleNewBookmark = () => {
    setEditingBookmark(null);
    setIsBookmarkFormOpen(true);
  };
  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setIsBookmarkFormOpen(true);
  };

  const handleRequestDeleteBookmark = (bookmark: Bookmark) => {
    setDeletingBookmark(bookmark);
  };

  const handleConfirmDelete = () => {
    if (!deletingBookmark) return;
    setData(prevData => ({
        ...prevData,
        bookmarks: prevData.bookmarks.filter(b => b.id !== deletingBookmark.id),
    }));
    setDeletingBookmark(null);
  };
  
  const handleReorderCollections = (newOrder: Collection[]) => {
      setData(prev => ({...prev, collections: newOrder }));
  };

  const handleNewCollection = () => {
    setEditingCollection(null);
    setIsCollectionFormOpen(true);
  };
  
  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setIsCollectionFormOpen(true);
  };
  
  const handleSaveCollection = (collectionData: Omit<Collection, 'createdAt' | 'updatedAt'>) => {
      setData(prevData => {
          const now = new Date().toISOString();
          const existingIndex = prevData.collections.findIndex(c => c.id === collectionData.id);
          
          if (existingIndex > -1) {
              // Update existing
              const newCollections = [...prevData.collections];
              newCollections[existingIndex] = {
                  ...newCollections[existingIndex],
                  ...collectionData,
                  updatedAt: now,
              };
              return { ...prevData, collections: newCollections };
          } else {
              // Create new
              const newCollection: Collection = {
                  ...collectionData,
                  createdAt: now,
                  updatedAt: now,
              };
              return { ...prevData, collections: [...prevData.collections, newCollection] };
          }
      });
      setIsCollectionFormOpen(false);
  };

  const handleSaveBookmark = (bookmarkData: Omit<Bookmark, 'createdAt' | 'updatedAt' | 'faviconUrl'>) => {
      setData(prevData => {
          const now = new Date().toISOString();
          const existingIndex = prevData.bookmarks.findIndex(b => b.id === bookmarkData.id);
          let faviconUrl = 'https://www.google.com/s2/favicons?domain=example.com';
          try {
              faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(bookmarkData.url).hostname}`;
          } catch(e) { console.error("Invalid URL for favicon:", bookmarkData.url); }
          
          if (existingIndex > -1) {
              // Update existing
              const newBookmarks = [...prevData.bookmarks];
              newBookmarks[existingIndex] = {
                  ...newBookmarks[existingIndex],
                  ...bookmarkData,
                  faviconUrl,
                  updatedAt: now,
              };
              return { ...prevData, bookmarks: newBookmarks };
          } else {
              // Create new
              const newBookmark: Bookmark = {
                  ...bookmarkData,
                  faviconUrl,
                  createdAt: now,
                  updatedAt: now,
              };
              return { ...prevData, bookmarks: [...prevData.bookmarks, newBookmark] };
          }
      });
      setIsBookmarkFormOpen(false);
  };


  return (
    <div className="bg-transparent text-gray-900 dark:text-gray-100 min-h-screen font-sans antialiased">
      <Sidebar
        collections={collections}
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={handleSelectCollection}
        onReorderCollections={handleReorderCollections}
        onNewCollection={handleNewCollection}
        onEditCollection={handleEditCollection}
      />

      <main className="lg:pl-72 transition-all duration-300">
        <div ref={mainScrollRef} className="h-screen overflow-y-auto">
            <TopBar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearchFocus={() => {}}
                scrollRef={mainScrollRef}
            />

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <motion.div layout className="mb-6">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
                        {selectedCollectionId ? currentCollection?.name : 'All Bookmarks'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {filteredBookmarks.length} {filteredBookmarks.length === 1 ? 'item' : 'items'}
                    </p>
                </motion.div>

                <AnimatePresence>
                    {filteredBookmarks.length > 0 ? (
                        <motion.div 
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
                        >
                            {filteredBookmarks.map(bookmark => (
                                <BookmarkCard 
                                    key={bookmark.id} 
                                    bookmark={bookmark} 
                                    onEdit={handleEditBookmark}
                                    onDelete={handleRequestDeleteBookmark}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <div className="pt-20">
                          <EmptyState 
                              icon={<CollectionIcon className="w-16 h-16"/>}
                              title={debouncedSearchQuery ? "No results found" : "No bookmarks here"}
                              description={debouncedSearchQuery ? `Your search for "${debouncedSearchQuery}" did not return any results.` : "This collection is empty. Add a bookmark to get started!"}
                          />
                        </div>
                    )}
                </AnimatePresence>
            </div>
            {/* Spacer for mobile nav */}
            <div className="h-24 lg:hidden" />
        </div>
      </main>

      <MobileNav
        isHomeSelected={selectedCollectionId === null}
        onHomeClick={() => handleSelectCollection(null)}
        onCollectionsClick={() => setIsCollectionsDrawerOpen(true)}
        onNewBookmarkClick={handleNewBookmark}
      />

      <CollectionsDrawer
        isOpen={isCollectionsDrawerOpen}
        onClose={() => setIsCollectionsDrawerOpen(false)}
        collections={collections}
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={handleSelectCollection}
        onEditCollection={handleEditCollection}
        onNewCollection={handleNewCollection}
      />
      
      <CollectionForm
        isOpen={isCollectionFormOpen}
        onClose={() => setIsCollectionFormOpen(false)}
        onSave={handleSaveCollection}
        initialData={editingCollection}
      />

      <BookmarkForm
        isOpen={isBookmarkFormOpen}
        onClose={() => setIsBookmarkFormOpen(false)}
        onSave={handleSaveBookmark}
        initialData={editingBookmark}
        collections={collections}
        defaultCollectionId={selectedCollectionId}
      />

      <ConfirmDialog
        isOpen={!!deletingBookmark}
        onClose={() => setDeletingBookmark(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Bookmark?"
        message={
          <>
            Are you sure you want to delete "<strong>{deletingBookmark?.title}</strong>"?
            This action cannot be undone.
          </>
        }
      />
    </div>
  );
};

export default App;