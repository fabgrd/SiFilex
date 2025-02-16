import React from 'react';
import { Progress } from 'antd';

export interface ProgressBarProps {
  progress: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className }) => (
  <Progress 
    percent={progress} 
    size="small" 
    className={className}
    strokeColor={{
      '0%': '#108ee9',
      '100%': '#87d068',
    }}
  />
);