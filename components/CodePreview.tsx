import React from 'react';
import { ClipboardDocumentIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface Props {
  code: string;
}

const CodePreview: React.FC<Props> = ({ code }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert("Código copiado al portapapeles");
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "ar_control_system.ino";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl shadow-cyan-900/20">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-xs font-mono text-gray-400">ar_control_system.ino</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            <ClipboardDocumentIcon className="w-4 h-4" /> Copiar
          </button>
          <button 
            onClick={downloadCode}
            className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-black hover:text-gray-900 bg-cyan-500 hover:bg-cyan-400 rounded transition-colors"
          >
            <ArrowDownTrayIcon className="w-4 h-4" /> Descargar
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-[#0a0a0a] p-4">
        <pre className="font-mono text-xs sm:text-sm text-green-400 leading-relaxed whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodePreview;