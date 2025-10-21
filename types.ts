
export interface Collection {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  faviconUrl: string;
  collectionId: string;
  createdAt: string;
  updatedAt: string;
}

export type AppData = {
  collections: Collection[];
  bookmarks: Bookmark[];
};
