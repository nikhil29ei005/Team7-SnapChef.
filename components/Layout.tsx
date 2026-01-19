
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-orange-500 text-white p-2 rounded-lg">
              <i className="fa-solid fa-utensils text-xl"></i>
            </div>
            <h1 className="text-2xl font-serif text-stone-800">SnapChef</h1>
          </div>
          <nav className="hidden sm:flex space-x-6 text-sm font-medium text-stone-600">
            <a href="#" className="hover:text-orange-500 transition">My Kitchen</a>
            <a href="#" className="hover:text-orange-500 transition">Recipes</a>
            <a href="#" className="hover:text-orange-500 transition">History</a>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-stone-200 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-stone-500 text-sm">
            © {new Date().getFullYear()} SnapChef AI. Turn your leftovers into masterpieces.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
