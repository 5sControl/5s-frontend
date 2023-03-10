import { OperationItem } from '../../../../storage/orderView';
import { OperationCard } from '../OperationCard/ui';
import styles from './articleCard.module.scss';

type PropsType = {
  data: OperationItem[];
  article: string;
};

export const ArticleCard: React.FC<PropsType> = ({ data, article }) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{article}</p>

      <div className={styles.list}>
        {data.map((operationData) => (
          <OperationCard key={operationData.operationId} data={operationData} />
        ))}
      </div>
    </div>
  );
};
