import React, { useState, useRef, useEffect } from 'react';
import TextEditor from '../editor/TextEditor';
import html2canvas from 'html2canvas';
import JsPdf from 'jspdf';
import dayjs from 'dayjs';
import { pickStyle } from '../../utils';
import { useEditorStore } from '../../store';

interface ElementProps {
  component: React.ComponentType<any>;
  props: any;
  style: any;
  text?: string;
}

const Element: React.FC<ElementProps> = ({ component: Component, props, style, text }) => {
  return (
    <Component {...props} style={{ ...style, ...pickStyle(props.style, false), ...pickStyle(style) }}>
      {text && <TextEditor text={text} style={pickStyle(style)} />}
    </Component>
  );
};

const PreviewDialog: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorStyle, setEditorStyle] = useState({});
  const store = useEditorStore();
  const scaleRatio = store.data.container?.scaleRatio || 1;

  useEffect(() => {
    const { width, height } = store.data.container.style;
    setEditorStyle({
      ...store.data.container.style,
      width: `${width}px`,
      height: `${height}px`,
      transform: `scale(${scaleRatio})`,
      transformOrigin: 'top left'
    });
  }, [store.data.container.style, scaleRatio]);

  const handleExport = (type: 'png' | 'jpg' | 'pdf') => {
    const { width, height } = store.data.container.style;
    const filename = dayjs().format('YYYY-MM-DD') + '-es-drager-editor.' + type;
    if (editorRef.current) {
      html2canvas(editorRef.current).then(canvas => {
        if (type === 'pdf') {
          const doc = new JsPdf('l', 'pt', 'a4');
          const imageData = canvas.toDataURL();
          doc.addImage(imageData, 'PNG', 0, 0, +width!, +height!);
          doc.save(filename);
        } else {
          canvas.toBlob(blob => {
            const link = document.createElement('a');
            link.download = filename;
            const href = URL.createObjectURL(blob!);
            link.href = href;
            link.click();
            URL.revokeObjectURL(href);
          });
        }
      });
    }
  };

  return (
    <div className="el-dialog draggable fullscreen">
      <div className="es-preview-tools">
        <button type="primary" onClick={() => handleExport('png')}>
          导出PNG
        </button>
        <button type="primary" onClick={() => handleExport('jpg')}>
          导出JPG
        </button>
        <button type="primary" onClick={() => handleExport('pdf')}>
          导出PDF
        </button>
      </div>
      <div className="es-preview-body" style={editorStyle}>
        <div ref={editorRef} className="es-editor preview" style={editorStyle}>
          {store.data.elements.map((item, index) => (
            <Element
              key={index}
              component={item.component}
              props={item.props}
              style={{
                ...pickStyle(item.style, false),
                width: `${item.width}px`,
                height: `${item.height}px`,
                position: 'absolute',
                left: `${item.left}px`,
                top: `${item.top}px`
              }}
              text={item.text}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviewDialog;
