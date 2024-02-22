import React, { FC } from 'react';
import styles from './promptTemplateCard.module.scss';
import { Delete, Download } from '../../../../assets/svg/SVGcomponent';
import { useAppDispatch } from '../../../../store/hooks';
import { removePromptTemplateAction } from '../../aiChatSlice';

interface Props {
  title: string;
  description: string;
  callback: () => void;
}

const PromptTemplateCard: FC<Props> = ({ title, description, callback }) => {
  const dispatch = useAppDispatch();

  return (
    <div onClick={callback} className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>{`#${title}`}</span>
        <span className={styles.plainText}>{description}</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Download />
        <div
          onClick={(e) => {
            e.stopPropagation();
            dispatch(removePromptTemplateAction(title));
          }}
        >
          <Delete />
        </div>
      </div>
    </div>
  );
};

export default PromptTemplateCard;
