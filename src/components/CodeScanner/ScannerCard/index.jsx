import React, { useState, useEffect } from 'react';

import {
  Space,
  Modal,
  Close,
  Image,
  Title,
  Subtitle,
  Description,
  Button,
} from '../Card';

import Sorting from './Sorting';



const ScannerPrompt= ({
  prompt,
  onClose,
  onCageClick,
  setAction,
  categories,
  ...props
}) => {
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    setQuantities({});
  }, [prompt]);

  return (
    <Modal id={prompt ? prompt.id : 'prompt'} {...props}>
      {prompt ? (
        <>
          <Close onClick={onClose} />
          {prompt.image ? <Image src={prompt.image} /> : null}
          <Title>{prompt.title}</Title>
          {prompt.subtitle ? <Subtitle>{prompt.subtitle}</Subtitle> : null}
          {prompt.description ? <Description>{prompt.description}</Description> : null}
          {prompt.id === 'SORTING' ? (
            <Sorting categories={categories} value={quantities} onChange={setQuantities} />
          ) : null}
          {prompt.actions.length ? <Space h={50} /> : null}
          {prompt.actions.map((item, i) => (
            <Button
              key={item.id}
              title={item.title}
              index={i}
              onClick={() => {
                if (item.id === 'CLOSE') {
                  onClose();
                } else if (item.id === 'CAGE' && prompt.cage) {
                  onCageClick(prompt.cage._id);
                  onClose();
                } else {
                  setAction({
                    action: item.id,
                    quantities: prompt.id === 'SORTING' ? quantities : undefined,
                  });
                }
              }}
            />
          ))}
          <Space h={10} />
        </>
      ) : null}
    </Modal>
  );
};

export default ScannerPrompt;
