import React, { useState, useEffect } from 'react';

const selector = `es-editor-container-1996`;

type EditorContainerType = {
  container: HTMLElement;
  selector: string;
};

export const useEditorContainer = (): EditorContainerType => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!container && !document.querySelector(`#${selector}`)) {
      const newContainer = document.createElement('div');
      newContainer.id = selector;
      setContainer(newContainer);
      document.body.appendChild(newContainer);

      // 清理函数，防止内存泄漏
      return () => {
        if (newContainer.parentNode) {
          newContainer.parentNode.removeChild(newContainer);
        }
      };
    }
  }, [container, selector]);

  return {
    container: container!,
    selector
  };
};
