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
    prefix={<SearchOutlined />}
    placeholder="Search files by name"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={className}
  />
);