import React, { useState, useRef, useEffect } from 'react';
import ProviderIcon from './ProviderIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { LLMProvider } from '../types';

interface ModelSelectorProps {
  items: { value: string; label: string; provider?: LLMProvider | string }[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  label: string;
  disabled?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ items, selectedValue, onSelect, label, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find(item => item.value === selectedValue) || (items.length > 0 ? items[0] : null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full bg-card border border-border rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-primary flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
      >
        <span className="flex items-center gap-2 capitalize">
          {selectedItem?.provider && <ProviderIcon provider={selectedItem.provider} />}
          <span className="truncate">{selectedItem?.label || 'Select...'}</span>
        </span>
        <ChevronDownIcon className={`w-4 h-4 text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 w-full mt-1 bg-card-hover border border-border rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none"
          role="listbox"
        >
          {items.map((item) => (
            <li
              key={item.value}
              onClick={() => handleSelect(item.value)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-accent hover:text-accent-foreground cursor-pointer capitalize"
              role="option"
              aria-selected={item.value === selectedValue}
            >
              {item.provider && <ProviderIcon provider={item.provider} />}
              <span className="truncate">{item.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModelSelector;
