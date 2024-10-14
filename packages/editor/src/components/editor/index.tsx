import React, { useState, useRef, useEffect } from 'react';
import ESDrager, { DragData } from 'es-drager';
import 'es-drager/lib/style.css';
import { omit, events, pickStyle } from '../../utils';
import { EditorDataType, ComponentType } from '../../types';
import GridRect from './GridRect';
import Area from './Area';
import TextEditor from './TextEditor';
import { useArea, CommandStateType, useActions } from '../../hooks';
import { useEditorStore } from '../../store';

const EsEditor: React.FC<{ modelValue: EditorDataType; commands: CommandStateType['commands'] }> = ({
  modelValue,
  commands,
}) => {
  const editorRef = useRef<HTMLElement | null>(null);
  const areaRef = useRef(null);
  const store = useEditorStore();

  const [data, setData] = useState(modelValue);
  const [extraDragData, setExtraDragData] = useState({
    startX: 0,
    startY: 0,
    disX: 0,
    disY: 0,
  });
  const [current, setCurrent] = useState<ComponentType | null>(null);

  const gridSize = data.container?.gridSize || 10;
  const scaleRatio = data.container?.scaleRatio || 1;

  const editorStyle = useMemo(() => {
    const { width, height } = data.container.style;
    return {
      ...data.container.style,
      width: `${width}px`,
      height: `${height}px`,
      transform: `scale(${scaleRatio})`,
      transformOrigin: 'top left',
    };
  }, [data, scaleRatio]);

  const { areaSelected, onEditorMouseDown, onAreaMove, onAreaUp } = useArea(data, areaRef);

  const { editorRect, onContextmenu, onEditorContextMenu } = useActions(data, editorRef);

  const onDragstart = (element: ComponentType) => {
    setCurrent(element);
    if (!areaSelected) {
      const selectedItems = data.elements.filter((item) => item.selected);
      if (selectedItems.length === 1) {
        data.elements.forEach((item) => (item.selected = false));
      }
    }

    current?.selected = true;
    setExtraDragData({
      startX: current?.left!,
      startY: current?.top!,
    });

    events.emit('dragstart');
  };

  const onDragend = () => {
    events.emit('dragend');
  };

  const onDrag = (dragData: DragData) => {
    const disX = dragData.left - extraDragData.startX;
    const disY = dragData.top - extraDragData.startY;

    data.elements.forEach((item: ComponentType) => {
      if (item.selected && current?.id !== item.id) {
        item.left! += disX;
        item.top! += disY;
      }
    });

    setExtraDragData({
      startX: dragData.left,
      startY: dragData.top,
    });
  };

  const onChange = (dragData: DragData, item: ComponentType) => {
    Object.keys(dragData).forEach((key) => {
      ;(item as any)[key] = dragData[key as keyof DragData];
    });
  };

  const globalEventMap = {
    dblclick: () => {
      if (!current || !current.selected) return;
      current.editable = true;
    },
    click: () => {
      if (!current) return;
      current.editable = false;
    },
  };

  const setGlobalEvents = (flag: 'on' | 'off' = 'on') => {
    const eventTypes = ['dblclick', 'click'];
    eventTypes.forEach((type) => {
      if (flag === 'on') {
        document.addEventListener(type, (globalEventMap as any)[type]);
      } else {
        document.removeEventListener(type, (globalEventMap as any)[type]);
      }
    });
  };

  useEffect(() => {
    setGlobalEvents();
    return () => {
      setGlobalEvents('off');
    };
  }, []);

  return (
    <div
      ref={editorRef}
      className="es-editor"
      style={editorStyle}
      onMouseDown={onEditorMouseDown}
      onContextMenu={(e) => {
        e.preventDefault();
        onEditorContextMenu(e);
      }}
    >
      {data.elements.map((item) => (
        <ESDrager
          key={item.id}
          rotatable
          {...omit(item, ['style', 'props'])}
          gridX={gridSize}
          gridY={gridSize}
          scaleRatio={scaleRatio}
          boundary
          markline={data.container.markline.show}
          snap
          snapThreshold={data.container.gridSize}
          onDragStart={() => onDragstart(item)}
          onDragEnd={onDragend}
          onDrag={onDrag}
          onChange={(e) => onChange(e, item)}
          onContextMenu={(e) => {
            e.stopPropagation();
            onContextmenu(e, item);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <component
            is={item.component}
            element={item}
            {...item.props}
            style={{
              ...pickStyle(item.style, false),
              width: '100%',
              height: '100%',
            }}
          >
            {item.text && (
              <TextEditor
                editable={item.editable}
                text={item.text}
                style={pickStyle(item.style)}
              />
            )}
          </component>
        </ESDrager>
      ))}

      {data.container.snapToGrid && (
        <GridRect
          grid={data.container.gridSize}
          borderColor={data.container.gridColor}
        />
      )}

      <Area ref={areaRef} onMove={onAreaMove} onUp={onAreaUp} />
    </div>
  );
};

export default EsEditor;
