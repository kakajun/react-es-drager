import React from 'react';

type ComponentType = {
  id: string;
  component: React.ComponentType<any>;
  props: any;
  groupStyle?: React.CSSProperties;
  text?: string;
};

const EsGroup: React.FC<{ elements: ComponentType[] }> = ({ elements }) => {
  return (
    <div className="es-group">
      {elements.map((item) => (
        <item.component
          key={item.id}
          id={item.id}
          {...item.props}
          style={item.groupStyle}
        >
          {item.text}
        </item.component>
      ))}
    </div>
  );
};

export default EsGroup;
