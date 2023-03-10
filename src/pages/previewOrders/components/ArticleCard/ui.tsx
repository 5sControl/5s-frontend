import { OperationItem } from '../../../../storage/orderView';
import { useAppDispatch } from '../../../../store/hooks';
import { setIsOpenOperationModal } from '../../previewOrdersSlice';
import { OperationCard } from '../OperationCard/ui';
import styles from './articleCard.module.scss';

type PropsType = {
  data: OperationItem[];
  article: string;
};

export const ArticleCard: React.FC<PropsType> = ({ data, article }) => {
  const dispatch = useAppDispatch();

  const handleClickToOperation = () => {
    dispatch(setIsOpenOperationModal(true));
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{article}</p>

      <div className={styles.list}>
        {data.map((operationData) => (
          <OperationCard
            key={operationData.operationId}
            data={operationData}
            onClick={handleClickToOperation}
          />
        ))}
      </div>
    </div>
  );
};
