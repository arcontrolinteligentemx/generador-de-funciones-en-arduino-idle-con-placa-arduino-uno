import React, { useState } from 'react';
import { AppConfig, GeminiStatus } from '../types';
import { generateCustomLogic } from '../services/geminiService';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface Props {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const GeminiAssistant: React.FC<Props> = ({ config, setConfig }) => {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<GeminiStatus>(GeminiStatus.IDLE);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setStatus(GeminiStatus.LOADING);
    setError('');
    
    try {
      const logic = await generateCustomLogic(prompt, config);
      setConfig(prev => ({
        ...prev,
        customLogic: logic
      }));
      setStatus(GeminiStatus.SUCCESS);
    } catch (err) {
      setError('Error al conectar con Gemini. Verifica tu API Key o intenta más tarde.');
      setStatus(GeminiStatus.ERROR);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-black border border-cyan-900/30 p-4 rounded-xl mt-4">
      <div className="flex items-center gap-2 mb-3">
        <SparklesIcon className="w-5 h-5 text-purple-400 animate-pulse" />
        <h3 className="text-white font-brand text-sm">Asistente IA (Gemini)</h3>
      </div>
      
      <p className="text-gray-400 text-xs mb-3">
        Describe una función especial (ej: "Enciende el LED en pin 13 cuando llegue a 10 créditos" o "Reinicia si mantengo presionado Botón 1").
      </p>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Escribe tu lógica personalizada aquí..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button 
          onClick={handleGenerate}
          disabled={status === GeminiStatus.LOADING}
          className={`px-4 py-2 rounded text-sm font-bold text-white transition-all ${
            status === GeminiStatus.LOADING 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]'
          }`}
        >
          {status === GeminiStatus.LOADING ? 'Generando...' : 'Generar'}
        </button>
      </div>
      
      {status === GeminiStatus.SUCCESS && (
        <p className="text-green-400 text-xs mt-2">✓ Lógica generada e inyectada en el código.</p>
      )}
      {status === GeminiStatus.ERROR && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  );
};

export default GeminiAssistant;