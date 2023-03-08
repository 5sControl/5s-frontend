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

      <div className={styles.list}>
        {data.articles.map((articleData) => (
          <ArticleCard key={articleData.articlesId} data={articleData} />
        ))}
      </div>
    </div>
  );
};
