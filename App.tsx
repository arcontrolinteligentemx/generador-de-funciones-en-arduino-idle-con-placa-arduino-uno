import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ConfigForm from './components/ConfigForm';
import CodePreview from './components/CodePreview';
import GeminiAssistant from './components/GeminiAssistant';
import { AppConfig, ButtonMapping } from './types';
import { generateArduinoCode } from './services/arduinoGenerator';

// Default Initial State
const initialConfig: AppConfig = {
  useKeyboardLib: false, // Default to serial for Uno
  baudRate: 9600,
  coin: {
    pin: 2, // Interrupt pin usually
    pulsesPerCredit: 1,
    creditValue: 1,
    bounceTime: 50
  },
  buttons: [
    { id: 'start', pin: 4, key: '1', description: 'Botón Start (P1)' },
    { id: 'coin_btn', pin: 5, key: '5', description: 'Botón Crédito Manual' },
    { id: 'a', pin: 6, key: 'z', description: 'Botón A' },
    { id: 'b', pin: 7, key: 'x', description: 'Botón B' }
  ],
  customLogic: ''
};

function App() {
  const [config, setConfig] = useState<AppConfig>(initialConfig);
  const [generatedCode, setGeneratedCode] = useState('');

  // Auto-regenerate code when config changes
  useEffect(() => {
    const code = generateArduinoCode(config);
    setGeneratedCode(code);
  }, [config]);

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed bg-center">
      <div className="min-h-screen bg-black/85 backdrop-blur-sm flex flex-col">
        <Header />
        
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Configuration */}
          <section className="lg:col-span-5 flex flex-col gap-4 h-[calc(100vh-140px)]">
            <div className="flex-1 overflow-hidden flex flex-col">
               <ConfigForm config={config} setConfig={setConfig} />
            </div>
            <div className="flex-shrink-0">
               <GeminiAssistant config={config} setConfig={setConfig} />
            </div>
          </section>

          {/* Right Column: Code Preview */}
          <section className="lg:col-span-7 h-[600px] lg:h-[calc(100vh-140px)]">
            <CodePreview code={generatedCode} />
          </section>
        </main>

        <footer className="w-full text-center py-4 text-gray-600 text-xs border-t border-gray-900 bg-black">
          <p>© 2024 AR CONTROL INTELIGENTE | Generador AR Arduino Core</p>
          <p>Creado por chrisrey91</p>
        </footer>
      </div>
    </div>
  );
}

export default App;