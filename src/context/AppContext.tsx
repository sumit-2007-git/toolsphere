import React, { createContext, useContext, useState, useEffect } from 'react';
import { ToolItem, ToastNotification } from '../types/tools';
import { TOOLS, CATEGORIES } from '../data/toolsRegistry';

export type AppView = 'home' | 'category' | 'tool';
export type SortMode = 'popular' | 'alpha' | 'newest';
export type ViewLayout = 'grid' | 'compact';

interface AppContextType {
  currentView: AppView;
  activeToolId: string | null;
  activeCategory: string;
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  viewLayout: ViewLayout;
  setViewLayout: (layout: ViewLayout) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  favorites: string[];
  toggleFavorite: (toolId: string) => void;
  recentTools: string[];
  addRecentTool: (toolId: string) => void;
  toasts: ToastNotification[];
  addToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  removeToast: (id: string) => void;
  currentTool: ToolItem | null;

  // High-level navigation methods
  navigateToHome: () => void;
  navigateToCategory: (categoryId: string) => void;
  navigateToTool: (toolId: string) => void;
  setActiveToolId: (id: string | null) => void;
  setActiveCategory: (category: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Parse initial route from URL hash
  const parseHash = () => {
    const raw = window.location.hash.replace('#', '').trim();
    if (!raw || raw === 'home') {
      return { view: 'home' as AppView, toolId: null, category: 'all' };
    }
    if (raw.startsWith('category-')) {
      const cat = raw.replace('category-', '');
      return { view: 'category' as AppView, toolId: null, category: cat };
    }
    if (raw === 'pdf' || raw === 'utilities' || raw === 'dev' || raw === 'favorites') {
      return { view: 'category' as AppView, toolId: null, category: raw };
    }
    let cleanId = raw;
    if (cleanId === 'ppt-to-pdf') cleanId = 'powerpoint-to-pdf';
    if (cleanId === 'pdf-to-ppt') cleanId = 'pdf-to-powerpoint';
    const matchingTool = TOOLS.find(t => t.id === cleanId);
    if (matchingTool) {
      return { view: 'tool' as AppView, toolId: matchingTool.id, category: matchingTool.category };
    }
    return { view: 'home' as AppView, toolId: null, category: 'all' };
  };

  const initialRoute = parseHash();
  const [currentView, setCurrentView] = useState<AppView>(initialRoute.view);
  const [activeToolId, setActiveToolIdState] = useState<string | null>(initialRoute.toolId);
  const [activeCategory, setActiveCategoryState] = useState<string>(initialRoute.category);
  const [sortMode, setSortMode] = useState<SortMode>('popular');
  const [viewLayout, setViewLayout] = useState<ViewLayout>('grid');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('toolsphere_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('toolsphere_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toolsphere_favorites');
      return saved ? JSON.parse(saved) : ['merge-pdf', 'qr-generator', 'image-compressor', 'word-counter'];
    } catch {
      return ['merge-pdf', 'qr-generator', 'image-compressor', 'word-counter'];
    }
  });

  useEffect(() => {
    localStorage.setItem('toolsphere_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (toolId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(toolId);
      const updated = exists ? prev.filter(id => id !== toolId) : [...prev, toolId];
      addToast(
        exists ? 'info' : 'success',
        exists ? 'Removed from favorites' : 'Added to favorites'
      );
      return updated;
    });
  };

  // Recent tools state
  const [recentTools, setRecentTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toolsphere_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addRecentTool = (toolId: string) => {
    setRecentTools(prev => {
      const filtered = prev.filter(id => id !== toolId);
      const updated = [toolId, ...filtered].slice(0, 8);
      localStorage.setItem('toolsphere_recent', JSON.stringify(updated));
      return updated;
    });
  };

  // High-Level Navigation Methods
  const navigateToHome = () => {
    setCurrentView('home');
    setActiveToolIdState(null);
    setActiveCategoryState('all');
    history.pushState("", document.title, window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (categoryId: string) => {
    setCurrentView('category');
    setActiveCategoryState(categoryId);
    setActiveToolIdState(null);
    window.location.hash = `category-${categoryId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTool = (toolId: string) => {
    let cleanId = toolId;
    if (cleanId === 'ppt-to-pdf') cleanId = 'powerpoint-to-pdf';
    if (cleanId === 'pdf-to-ppt') cleanId = 'pdf-to-powerpoint';
    const tool = TOOLS.find(t => t.id === cleanId);
    if (tool) {
      setCurrentView('tool');
      setActiveToolIdState(cleanId);
      setActiveCategoryState(tool.category);
      window.location.hash = cleanId;
      addRecentTool(cleanId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setActiveToolId = (id: string | null) => {
    if (id) {
      navigateToTool(id);
    } else {
      navigateToHome();
    }
  };

  const setActiveCategory = (category: string) => {
    if (category === 'all') {
      navigateToHome();
    } else {
      navigateToCategory(category);
    }
  };

  // Listen to browser back/forward button hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash();
      setCurrentView(parsed.view);
      setActiveToolIdState(parsed.toolId);
      setActiveCategoryState(parsed.category);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Dynamic SEO Meta Tags updater based on currentView and route
  useEffect(() => {
    if (currentView === 'tool' && activeToolId) {
      const tool = TOOLS.find(t => t.id === activeToolId);
      if (tool) {
        document.title = `${tool.name} Online Free – Fast & 100% Private | ToolSphere`;
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', `${tool.description} Free, fast, in-browser utility with 100% privacy guarantee. Zero file uploads.`);
        }
        
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', `${tool.name} Online Free | ToolSphere`);
        }

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
          ogDesc.setAttribute('content', `${tool.description} Free online tool running completely in your browser.`);
        }
      }
    } else if (currentView === 'category') {
      const categoryInfo = CATEGORIES.find(c => c.id === activeCategory);
      const catName = categoryInfo ? categoryInfo.name : 'Tools';
      const catDesc = categoryInfo ? categoryInfo.shortDesc : 'All smart utility tools';

      document.title = `${catName} – Free Online Suite | ToolSphere`;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `${catDesc}. 100% client-side, private, and free online utilities on ToolSphere.`);
      }
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${catName} – ToolSphere`);
      }
    } else {
      document.title = 'ToolSphere – 100% Free Online PDF Suite & Daily Smart Utilities';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'ToolSphere is your free, 100% private, all-in-one suite for PDF editing, daily smart utilities, and developer tools. Fast, secure, and running directly in your browser.');
      }
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', 'ToolSphere – 100% Free Online PDF Suite & Daily Smart Utilities');
      }
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', 'All-in-one suite with 42+ high-performance client-side tools for documents, calculations, text formatting, and developer workflows.');
      }
    }
  }, [currentView, activeToolId, activeCategory]);

  // Keyboard shortcut for Cmd+K / Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toasts
  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const currentTool = activeToolId ? TOOLS.find(t => t.id === activeToolId) || null : null;

  return (
    <AppContext.Provider
      value={{
        currentView,
        activeToolId,
        setActiveToolId,
        activeCategory,
        setActiveCategory,
        sortMode,
        setSortMode,
        viewLayout,
        setViewLayout,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        theme,
        toggleTheme,
        favorites,
        toggleFavorite,
        recentTools,
        addRecentTool,
        toasts,
        addToast,
        removeToast,
        currentTool,
        navigateToHome,
        navigateToCategory,
        navigateToTool,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

