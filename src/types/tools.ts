export type ToolCategory = 'pdf' | 'utilities' | 'dev';

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  categoryName: string;
  description: string;
  detailedDescription?: string;
  badge?: string;
  icon: string;
  tags: string[];
  popular?: boolean;
  featured?: boolean;
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  shortDesc: string;
  icon: string;
  accentColor: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
