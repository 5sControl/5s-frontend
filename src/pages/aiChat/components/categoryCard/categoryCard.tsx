import React, { FC } from 'react';
import styles from './categoryCard.module.scss';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  description: string;
  sources: number;
}

const CategoryCard: FC<Props> = ({ title, description, sources }) => {
  return (
    <Link to={`base/${title}`} className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>{`@${title}`}</span>
        <span className={styles.plainText}>{description}</span>
      </div>
      <span className={styles.plainText}>{`Sources: ${sources}`}</span>
    </Link>
  );
};

export default CategoryCard;
