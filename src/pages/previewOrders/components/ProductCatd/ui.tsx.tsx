import { Product } from '../../../../storage/orderView';
import { ArticleCard } from '../ArticleCard';
import styles from './productCatd.module.scss';

type PropsType = {
  index: number;
  data: Product;
};

export const ProductCatd: React.FC<PropsType> = ({ index, data }) => {
  return (
    <div>
      <h2 className={styles.title}>{`${index}. ${data.productName}`}</h2>

      {data.operations.length ? (
        <div className={styles.list}>
          <ArticleCard data={data.operations} article={data.operationArticle} />
        </div>
      ) : null}
    </div>
  );
};
