import { ArticleItem } from '../../../../storage/orderView';
import { useAppDispatch } from '../../../../store/hooks';
import { setIsOpenOperationModal } from '../../previewOrdersSlice';
import { OperationCard } from '../OperationCard/ui';
import styles from './articleCard.module.scss';

type PropsType = {
  data: ArticleItem;
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

      <div className={styles.block}>
        {Object.keys(data).map((operationDate) => (
          <div key={operationDate}>
            <p className={styles.operationDate}>{operationDate}</p>

            <div className={styles.list}>
              {data[operationDate].map((operation) => {
                return (
                  <OperationCard
                    key={operation.operationId}
                    data={operation}
                    onClick={handleClickToOperation}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
