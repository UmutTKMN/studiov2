export interface Post {
  post_id: number;
  post_title: string;
  post_slug: string;
  post_excerpt?: string;
  post_content: string;
  post_author: number;
  post_category?: number;
  post_tags?: string;
  post_likes: number;
  post_comments: number;
  post_views: number;
  post_image?: string;
  post_status: 'draft' | 'published' | 'archived';
  post_createdAt: string;
  post_updatedAt: string;
}

export interface Category {
  category_id: number;
  category_name: string;
  category_description?: string;
  category_createdAt: string;
  category_updatedAt: string;
}

export interface Projects {
  project_id: number;
  project_title: string;
  project_slug: string;
  project_description: string;
  project_image: string;
  projeect_status: 'draft' | 'published' | 'archived';
  project_tags: string;
  project_budget: number;
  project_start_date: string;
  project_end_date: string;
  project_createdAt: string;
  project_updatedAt: string;
}