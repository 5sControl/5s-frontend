import { ArticleItem } from '../../../../storage/orderView';
import { OperationCard } from '../OperationCard/ui';
import styles from './articleCard.module.scss';

type PropsType = {
  data: ArticleItem;
};

export const ArticleCard: React.FC<PropsType> = ({ data }) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{data.articlesName}</p>

      <div className={styles.list}>
        {data.operations.map((operationData) => (
          <OperationCard key={operationData.operationId} data={operationData} />
        ))}
      </div>
    </div>
  );
};
