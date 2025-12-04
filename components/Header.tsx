import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full p-6 border-b border-cyan-900 bg-black/80 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-900 rounded-lg flex items-center justify-center neon-border">
             {/* Abstract AR Logo Representation */}
             <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
                <path d="M12 2L2 22h20L12 2zm0 3.8L18.4 19H5.6L12 5.8z"/>
                <path d="M10 13h4v2h-4z"/>
             </svg>
          </div>
          <div>
            <h1 className="text-3xl font-brand font-bold text-white tracking-widest neon-text">
              AR CONTROL
            </h1>
            <p className="text-cyan-400 text-xs tracking-[0.3em] font-bold">
              INTELIGENTE
            </p>
          </div>
        </div>
        
        <div className="text-right hidden md:block">
          <h2 className="text-white font-bold text-lg">GENERADOR ARDUINO CORE</h2>
          <p className="text-gray-500 text-sm">By chrisrey91</p>
          <a href="https://www.arcontrolinteligente.com" target="_blank" rel="noreferrer" className="text-cyan-600 hover:text-cyan-400 text-xs transition-colors">
            www.arcontrolinteligente.com
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;