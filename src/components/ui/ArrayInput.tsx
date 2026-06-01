'use client';

import { Input } from './Input';
import { Button } from './Button';
import { useState } from 'react';

interface ArrayInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  buttonLabel?: string;
}

export function ArrayInput({ label, items, onChange, placeholder, buttonLabel = 'Add' }: ArrayInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="type-label-caps text-[var(--color-on-surface-variant)]">{label}</label>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
        </div>
        <Button type="button" variant="secondary" onClick={handleAdd}>
          {buttonLabel}
        </Button>
      </div>
      
      {items.length > 0 && (
        <ul className="flex flex-col gap-2 mt-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start justify-between gap-4 p-3 border border-[rgba(229,229,229,0.1)] bg-[rgba(255,255,255,0.02)]">
              <span className="type-body-md text-[var(--color-on-surface)] break-words break-all flex-1">{item}</span>
              <button 
                type="button"
                onClick={() => handleRemove(index)}
                className="text-[var(--color-outline)] hover:text-[var(--color-error)] transition-colors p-1"
                aria-label="Remove item"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
