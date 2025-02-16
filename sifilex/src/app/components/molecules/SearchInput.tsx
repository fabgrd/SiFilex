import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, className }) => (
  <Input
    prefix={<SearchOutlined className="search-icon" />}
    placeholder="Rechercher un fichier par nom"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`search-input ${className || ''}`}
  />
);