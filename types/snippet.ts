export type Snippet = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  language: string;
  complexity?: string;
  code: string;
  tags: Tags[];
  views?: number;
  createdAt: string | Date;
  author: SnippetAuthor;
};
type SnippetAuthor = {
  username: string;
  name?: string;
  avatarUrl?: string;
  id: string;
};

export type Tags = {
  tag: {
    name: string;
    slug: string;
    id: string;
  };
};

export type SnippetDTO = {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  fileName?: string;
  complexity?: string;
  isPublic: boolean;
  views: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
    bio?: string;
  };
  authorId: string;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

export type SnippetListItem = {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  fileName?: string;
  complexity?: string;
  isPublic: boolean;
  views: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
  };
  tags: Array<{ id: string; name: string; slug: string }>;
};
