import { ref } from 'vue';
import { GridRect } from '@es-drager/editor';
import Drager, { DragData, MarklineData } from 'es-drager';
import { useTranslation } from 'react-i18next'

type ComponentType = {
  id?: string;
  component: string;
  text?: string;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  angle?: number;
  style?: CSSProperties;
};

interface EditorState {
  componentList: ComponentType[];
}

function App() {
  const markLineData = ref<MarklineData>({ left: null, top: null });
  const { t } = useTranslation()
  const data = ref<EditorState>({
    componentList: [
      {
        id: 'div1',
        component: 'div',
        text: 'div1',
        width: 100,
        height: 100,
        left: 0,
        top: 0
      },
      {
        id: 'div2',
        component: 'div',
        text: 'div2',
        width: 100,
        height: 100,
        top: 100,
        left: 100
      }
    ]
  });

  const command = useCommand(data);

  function onDragend() {
    command.record();
  }

  function onChange(dragData: DragData, item: any) {
    Object.keys(dragData).forEach(key => {
      ;(item as any)[key] = dragData[key as keyof DragData];
    });
  }

  function useCommand(data: Ref<EditorState>) {
    const queue: ComponentType[] = [];
    let current = -1;

    const redo = () => {
      if (current < queue.length - 1) {
        current++;
        data.value.componentList = deepCopy(queue[current]);
      }
    };

    const undo = () => {
      if (current >= 0) {
        current--;
        if (queue[current]) {
          data.value.componentList = deepCopy(queue[current]);
        }
      }
    };

    const record = () => {
      queue[++current] = deepCopy(data.value.componentList);
    };

    record();

    const onKeydown = (e: KeyboardEvent) => {
      const { ctrlKey, key } = e;
      if (ctrlKey) {
        if (key === 'z') undo();
        else if (key === 'y') redo();
      }
    };

    window.addEventListener('keydown', onKeydown);

    return {
      redo,
      undo,
      record
    };
  }

  function deepCopy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  function onMarkline(data: MarklineData) {
    markLineData.value = data;
  }

  return (
    <div class="es-container">
      <div class="es-tools">
        <el-button type="primary" onClick={() => command.undo()}>
          {t('examples.undo')}
        </el-button>
        <el-button type="primary" onClick={() => command.redo()}>
          {t('examples.redo')}
        </el-button>
      </div>
      <div class="es-editor">
        {data.value.componentList.map(item => (
          <Drager
            {...item}
            snap
            snapThreshold={10}
            markline
            onChange={(e) => onChange(e, item)}
            onDragEnd={() => onDragend()}
          >
            <component is={item.component}>{item.text}</component>
          </Drager>
        ))}

        <Drager
          width={100}
          height={100}
          left={200}
          top={200}
          snap
          markline={onMarkline}
        >
          custom markline
        </Drager>

        <div
          vShow={markLineData.value.left}
          class="es-editor-markline-left"
          style={{ left: `${markLineData.value.left}px` }}
        ></div>
        <div
          vShow={markLineData.value.top}
          class="es-editor-markline-top"
          style={{ top: `${markLineData.value.top}px` }}
        ></div>
        <GridRect class="grid-rect" />
      </div>
    </div>
  );
}

export default App;
