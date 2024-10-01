import { ProductItem } from '../../../../storage/orderView';
import { useAppDispatch } from '../../../../store/hooks';
import { sortOperations } from '../../previewOrdersHelper';
import { setSelectProductData } from '../../previewOrdersSlice';
import { ArticleCard } from '../ArticleCard';
import { StatusLable } from '../StatusLable';
import styles from './productCatd.module.scss';

type PropsType = {
  index: number;
  data: ProductItem;
};

export const ProductCatd: React.FC<PropsType> = ({ index, data }) => {
  const dispatch = useAppDispatch();

  const setProductData = (data: ProductItem) => {
    dispatch(setSelectProductData(data));
  };

  return (
    <div key={index}>
      <div className={styles.wrapper}>
        <span className={styles.productTitle}>Product&nbsp;·&nbsp; </span>

        <StatusLable
          title={data.status}
          status={
            data.status === 'Completed'
              ? 'completed'
              : data.status === 'Started'
              ? 'error'
              : 'undefined'
          }
          type='text'
        />
      </div>

      <h2 className={styles.title}>{`${index}. ${data.productName}`}</h2>

      {data.operations.length ? (
        <div className={styles.list}>
          <ArticleCard
            dataByDays={sortOperations(data)}
            data={data}
            article={data.operationArticle}
            setProductData={setProductData}
          />
        </div>
      ) : null}
    </div>
  );
};
