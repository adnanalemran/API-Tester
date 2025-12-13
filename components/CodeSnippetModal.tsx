import React from 'react';
import { X, Copy, Check } from 'lucide-react';

interface CodeSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  title: string;
}

const CodeSnippetModal: React.FC<CodeSnippetModalProps> = ({ isOpen, onClose, code, title }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1e293b] w-full max-w-2xl rounded-lg shadow-2xl border border-gray-700 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-[#0f172a]">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="relative group">
            <pre className="p-6 overflow-auto custom-scrollbar font-mono text-sm text-green-400 bg-[#0f172a] max-h-[60vh] whitespace-pre-wrap">
              {code}
            </pre>
            <button 
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-md text-gray-300 transition-colors shadow-lg"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetModal;
