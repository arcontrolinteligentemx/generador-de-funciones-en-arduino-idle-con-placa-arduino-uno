import React from 'react';
import { AppConfig, ButtonMapping } from '../types';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid';

interface Props {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const ConfigForm: React.FC<Props> = ({ config, setConfig }) => {
  
  const handleCoinChange = (field: keyof typeof config.coin, value: number) => {
    setConfig(prev => ({
      ...prev,
      coin: { ...prev.coin, [field]: value }
    }));
  };

  const handleUseKeyboardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({ ...prev, useKeyboardLib: e.target.checked }));
  };

  const addButton = () => {
    const newId = config.buttons.length + 1;
    const newBtn: ButtonMapping = {
      id: `btn_${newId}`,
      pin: 4 + config.buttons.length,
      key: 'A',
      description: 'Botón Nuevo'
    };
    setConfig(prev => ({ ...prev, buttons: [...prev.buttons, newBtn] }));
  };

  const removeButton = (index: number) => {
    const newBtns = [...config.buttons];
    newBtns.splice(index, 1);
    setConfig(prev => ({ ...prev, buttons: newBtns }));
  };

  const updateButton = (index: number, field: keyof ButtonMapping, value: string | number) => {
    const newBtns = [...config.buttons];
    newBtns[index] = { ...newBtns[index], [field]: value };
    setConfig(prev => ({ ...prev, buttons: newBtns }));
  };

  return (
    <div className="bg-gray-900/50 border border-cyan-900/50 p-6 rounded-xl backdrop-blur-sm h-full overflow-y-auto">
      <h2 className="text-xl font-brand text-cyan-400 mb-6 border-b border-cyan-900 pb-2">
        <span className="mr-2">⚙️</span> Configuración Hardware
      </h2>

      {/* General Settings */}
      <div className="mb-8 space-y-4">
        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Placa & Comunicación</h3>
        <div className="flex items-center gap-4 bg-black/40 p-3 rounded-lg border border-gray-800">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={config.useKeyboardLib} 
              onChange={handleUseKeyboardChange}
              className="w-5 h-5 accent-cyan-500 rounded focus:ring-cyan-500 bg-gray-700"
            />
            <span className="text-sm text-gray-300">Emular Teclado HID (Leonardo/Micro)</span>
          </label>
        </div>
        {!config.useKeyboardLib && (
          <p className="text-xs text-yellow-500/80 italic">
            * Modo Serial activo. Recomendado para Arduino Uno usando software bridge.
          </p>
        )}
      </div>

      {/* Coin Acceptor */}
      <div className="mb-8">
        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>🪙</span> Monedero / Coin Acceptor
        </h3>
        <div className="grid grid-cols-2 gap-4 bg-black/40 p-4 rounded-lg border border-gray-800">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Pin de Señal</label>
            <input 
              type="number" 
              value={config.coin.pin}
              onChange={(e) => handleCoinChange('pin', parseInt(e.target.value) || 2)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Pulsos por Crédito</label>
            <input 
              type="number" 
              value={config.coin.pulsesPerCredit}
              onChange={(e) => handleCoinChange('pulsesPerCredit', parseInt(e.target.value) || 1)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="col-span-2">
             <label className="block text-xs text-gray-400 mb-1">Anti-rebote (ms)</label>
             <input 
              type="number" 
              value={config.coin.bounceTime}
              onChange={(e) => handleCoinChange('bounceTime', parseInt(e.target.value) || 50)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Buttons Mapping */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
            <span>🕹️</span> Mapeo de Botones
            </h3>
            <button 
                onClick={addButton}
                className="flex items-center gap-1 text-xs bg-cyan-900/50 hover:bg-cyan-800 text-cyan-200 px-2 py-1 rounded border border-cyan-700 transition-all"
            >
                <PlusIcon className="w-3 h-3" /> Agregar
            </button>
        </div>
        
        <div className="space-y-3">
          {config.buttons.map((btn, idx) => (
            <div key={idx} className="bg-black/40 p-3 rounded-lg border border-gray-800 flex gap-2 items-end group hover:border-cyan-900/50 transition-colors">
              <div className="flex-1">
                <label className="block text-[10px] text-gray-500 mb-1">Descripción</label>
                <input 
                  type="text" 
                  value={btn.description}
                  onChange={(e) => updateButton(idx, 'description', e.target.value)}
                  className="w-full bg-transparent border-b border-gray-700 text-sm text-white focus:border-cyan-500 focus:outline-none pb-1"
                />
              </div>
              <div className="w-16">
                <label className="block text-[10px] text-gray-500 mb-1">Pin</label>
                <input 
                  type="number" 
                  value={btn.pin}
                  onChange={(e) => updateButton(idx, 'pin', parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-center text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div className="w-16">
                <label className="block text-[10px] text-gray-500 mb-1">Tecla</label>
                <input 
                  type="text" 
                  value={btn.key}
                  onChange={(e) => updateButton(idx, 'key', e.target.value)}
                  maxLength={1}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-center text-cyan-300 font-bold focus:border-cyan-500 focus:outline-none uppercase"
                />
              </div>
              <button 
                onClick={() => removeButton(idx)}
                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                title="Eliminar botón"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {config.buttons.length === 0 && (
            <div className="text-center py-8 text-gray-600 text-sm border border-dashed border-gray-800 rounded-lg">
                No hay botones configurados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigForm;