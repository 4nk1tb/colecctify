
import React from 'react';
import { Collection as DefaultIcon } from './Icons';

interface FaviconProps {
  url: string;
  title: string;
  className?: string;
}

export const Favicon: React.FC<FaviconProps> = ({ url, title, className = 'w-6 h-6' }) => {
  const [error, setError] = React.useState(false);

  const faviconUrl = React.useMemo(() => {
    if (error) return null;
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      setError(true);
      return null;
    }
  }, [url, error]);

  if (error || !faviconUrl) {
    return (
      <div className={`${className} flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400`}>
        <DefaultIcon className="w-4 h-4" />
      </div>
    );
  }

  return (
    <img
      src={faviconUrl}
      alt={`${title} favicon`}
      className={`${className} rounded-md object-contain`}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};
