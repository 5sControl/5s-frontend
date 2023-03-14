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

  // const sortOperations = data.reduce((prev, current) => {
  //   return [...prev, { date: current.operationTime }];
  // }, []);

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{article}</p>

      <div className={styles.list}>
        {data.map((operationData) => (
          <div key={operationData.operationId}>
            <p className={styles.operationDate}>{operationData.operationTime}</p>

            <OperationCard data={operationData} onClick={handleClickToOperation} />
          </div>
        ))}
      </div>
    </div>
  );
};
