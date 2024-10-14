import React, { useMemo } from 'react';
import { getIcon } from './index';

interface IconProps {
  name: string;
  size?: string | number;
  color?: string;
}

const IconComponent: React.FC<IconProps> = ({ name, size, color }) => {
  const icon = useMemo(() => getIcon(name), [name]);
  const style = useMemo(() => {
    if (!size && !color) return {};

    return {
      fontSize: typeof size === 'string' ? size : `${size}px`,
      color: color || undefined,
    };
  }, [size, color]);

  return (
    <i className="es-icon" style={style} dangerouslySetInnerHTML={{ __html: icon }} />
  );
};

export default IconComponent;
