import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/layout/SearchModal';
import { ToastContainer } from './components/common/Toast';
import { Hero } from './components/home/Hero';
import { ToolView } from './components/tools/ToolView';
import { CategoryView } from './components/home/CategoryView';

const MainLayout: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchModal />
      <ToastContainer />

      <main className="flex-1">
        {currentView === 'tool' && <ToolView />}
        {currentView === 'category' && <CategoryView />}
        {currentView === 'home' && <Hero />}
      </main>

      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
