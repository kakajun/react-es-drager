import React, { useRef, useEffect } from 'react';
import Upload from './Upload'; // 假设Upload组件已经适配了React

type ResultType = 'text' | 'json' | 'image' | 'custom';
export type UploadOption = {
  resultType: ResultType;
  accept?: string;
  onChange?: (e: any) => void;
};

const uploadRef = useRef<React.ReactInstance>(null);

export const $upload = (option: UploadOption) => {
  if (!uploadRef.current) {
    const container = document.createElement('div');
    document.body.appendChild(container); // 假设这里使用body作为容器，实际使用时应根据具体情况调整

    uploadRef.current = React.createElement(Upload, { option });

    ReactDOM.render(uploadRef.current, container);
  } else {
    (uploadRef.current as any).props.open(option);
  }
};
