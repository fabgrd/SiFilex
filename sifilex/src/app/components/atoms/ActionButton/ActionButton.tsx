import React from 'react';
import { Button, Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';

export interface ActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip: string;
  placement?: TooltipPlacement;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  onClick,
  tooltip,
  placement = 'top',
  className
}) => (
  <Tooltip title={tooltip} placement={placement}>
    <Button 
      type="text"
      icon={icon}
      onClick={onClick}
      className={className}
    />
  </Tooltip>
);