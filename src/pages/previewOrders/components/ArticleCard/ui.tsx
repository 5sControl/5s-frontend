import { ArticleItem, OperationItem } from '../../../../storage/orderView';
import { useAppDispatch } from '../../../../store/hooks';
import { setIsOpenOperationModal, setSelectOperationData } from '../../previewOrdersSlice';
import { OperationCard } from '../OperationCard/ui';
import styles from './articleCard.module.scss';

type PropsType = {
  data: ArticleItem;
  article: string;
  setProductData: () => void;
};

export const ArticleCard: React.FC<PropsType> = ({ data, article, setProductData }) => {
  const dispatch = useAppDispatch();

  const handleClickToOperation = (operationData: OperationItem) => {
    dispatch(setSelectOperationData(operationData));
    dispatch(setIsOpenOperationModal(true));
    setProductData();
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{article}</p>

      <div className={styles.block}>
        {Object.keys(data).map((operationDate, index) => (
          <div key={index}>
            <p className={styles.operationDate}>{operationDate}</p>

            <div className={styles.list}>
              {data[operationDate].map((operation, index) => {
                return (
                  <OperationCard key={index} data={operation} onClick={handleClickToOperation} />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
