import { useSearchParams } from 'react-router-dom';
import { useNavigateSearch } from '../../../../functions/useNavigateSearch';
import { ArticleItem, OperationItem, ProductItem } from '../../../../storage/orderView';
import { useAppDispatch } from '../../../../store/hooks';
import { setSelectOperationData } from '../../previewOrdersSlice';
import { OperationCard } from '../OperationCard/ui';
import {
  setIsOpenOperationVideoModal,
  setTimeOperationVideoModal,
} from '../OperationVideoModal/operationVideoModalSlice';
import styles from './articleCard.module.scss';

type PropsType = {
  dataByDays: ArticleItem;
  data: ProductItem;
  article: string;
  setProductData: (data: ProductItem) => void;
};

export const ArticleCard: React.FC<PropsType> = ({ dataByDays, article, setProductData, data }) => {
  const [searchParams] = useSearchParams();
  const navigateSearch = useNavigateSearch();
  const dispatch = useAppDispatch();

  const handleClickToOperation = (operationData: OperationItem) => {
    dispatch(setSelectOperationData(operationData));
    dispatch(setIsOpenOperationVideoModal(true));
    dispatch(setTimeOperationVideoModal(operationData));
    setProductData(data);

    const queryParams = Object.fromEntries([...searchParams]);
    const newQueryParams = {
      ...queryParams,
      product_id: data.id.toString(),
      operation_id: operationData.operationId.toString(),
    };

    navigateSearch('/orders-view', newQueryParams);
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{article}</p>

      <div className={styles.block}>
        {Object.keys(dataByDays).map((operationDate, index) => (
          <div key={index}>
            <p className={styles.operationDate}>{operationDate}</p>

            <div className={styles.list}>
              {dataByDays[operationDate].map((operation, index) => {
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
