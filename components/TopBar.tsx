import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Input } from './UI';
import { Search } from './Icons';

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchFocus: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export const TopBar: React.FC<TopBarProps> = ({ searchQuery, setSearchQuery, onSearchFocus, scrollRef }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const { scrollY } = useScroll({ container: scrollRef });
  
  const backdropBlur = useTransform(scrollY, [0, 50], [12, 20]);
  const boxShadow = useTransform(
    scrollY,
    [0, 50],
    ['0 1px 2px 0 rgb(0 0 0 / 0.00)', '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)']
  );

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === '/' && (event.target as HTMLElement).tagName !== 'INPUT') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.header 
        className="sticky top-0 z-30 p-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div 
        className="relative max-w-2xl mx-auto"
        style={{
          backdropFilter: `blur(${backdropBlur.get()}px)`,
          WebkitBackdropFilter: `blur(${backdropBlur.get()}px)`,
          boxShadow,
        }}
      >
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search bookmarks or collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={onSearchFocus}
          icon={<Search className="w-5 h-5" />}
          className="w-full !bg-white/70 dark:!bg-gray-800/70"
        />
      </motion.div>
    </motion.header>
  );
};