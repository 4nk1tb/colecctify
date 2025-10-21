import type { AppData } from './types';

export const STORAGE_KEY = 'colecctify:v1';

export const COLOR_PALETTE = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
  '#10b981', // emerald-500
  '#14b8a6', // teal-500
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#a855f7', // purple-500
  '#d946ef', // fuchsia-500
  '#ec4899', // pink-500
  '#f43f5e', // rose-500
  '#78716c', // stone-500
];


export const INITIAL_DATA: AppData = {
  collections: [
    {
      id: 'c1',
      name: 'Design Inspiration',
      color: '#3b82f6', // blue-500
      icon: 'Palette',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'c2',
      name: 'Tech Reading',
      color: '#8b5cf6', // violet-500
      icon: 'BookOpen',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'c3',
      name: 'Utilities',
      color: '#10b981', // emerald-500
      icon: 'Tool',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  bookmarks: [
    {
      id: 'b1',
      collectionId: 'c1',
      url: 'https://dribbble.com',
      title: 'Dribbble - Discover the World’s Top Designers & Creative Professionals',
      faviconUrl: 'https://www.google.com/s2/favicons?domain=dribbble.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'b2',
      collectionId: 'c1',
      url: 'https://www.awwwards.com',
      title: 'Awwwards - Website Awards - Best Web Design Trends',
      faviconUrl: 'https://www.google.com/s2/favicons?domain=awwwards.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'b3',
      collectionId: 'c2',
      url: 'https://react.dev',
      title: 'React',
      faviconUrl: 'https://www.google.com/s2/favicons?domain=react.dev',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'b4',
      collectionId: 'c2',
      url: 'https://www.builder.io/blog/visual-copilot',
      title: 'Visual Copilot: AI that turns Figma designs into clean code',
      faviconUrl: 'https://www.google.com/s2/favicons?domain=builder.io',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
     {
      id: 'b5',
      collectionId: 'c3',
      url: 'https://tinypng.com',
      title: 'TinyPNG – Compress WebP, PNG and JPEG images intelligently',
      faviconUrl: 'https://www.google.com/s2/favicons?domain=tinypng.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'b6',
      collectionId: 'c3',
      url: 'https://caniuse.com',
      title: 'Can I use... Support tables for HTML5, CSS3, etc',
      faviconUrl: 'https://www.google.com/s2/favicons?domain=caniuse.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};