import { ProductItem } from '../../../../storage/orderView';
import { ArticleCard } from '../ArticleCard';
import { StatusLable } from '../StatusLable';
import styles from './productCatd.module.scss';

type PropsType = {
  index: number;
  data: ProductItem;
};

export const ProductCatd: React.FC<PropsType> = ({ index, data }) => {
  const sortOperations = data.operations.reduce((prev, curr, index, arr) => {
    const dateToString = (date: string) => new Date(date).toLocaleDateString();

    const filter = arr.filter(
      (el) => dateToString(el.operationTime) === dateToString(curr.operationTime)
    );

    return {
      ...prev,
      [dateToString(curr.operationTime)]: filter,
    };
  }, {});

  return (
    <div key={index}>
      <div className={styles.wrapper}>
        <span className={styles.productTitle}>Product&nbsp;·&nbsp; </span>

        <StatusLable status={data.status} type="text" />
      </div>

      <h2 className={styles.title}>{`${index}. ${data.productName}`}</h2>

      {data.operations.length ? (
        <div className={styles.list}>
          <ArticleCard data={sortOperations} article={data.operationArticle} />
        </div>
      ) : null}
    </div>
  );
};
