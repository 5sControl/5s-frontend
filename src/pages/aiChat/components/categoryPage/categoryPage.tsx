import React from 'react';
import styles from './categoryPage.module.scss';
import { HeaderMain } from '../../../../components/header';
import { useNavigate, useParams } from 'react-router-dom';

const CategoryPage = () => {
  const navigate = useNavigate();
  const { category } = useParams();

  return (
    <div className={styles.wrapper}>
      <HeaderMain title={'AI Chat'}>
        <section className={styles.tabs}>
          <div
            className={`${styles.tab} ${styles.noActive}`}
            onClick={() => navigate('/ai-chat?tab=chat')}
          >
            <span>Chat</span>
          </div>
          <div
            className={`${styles.tab} ${styles.active}`}
            onClick={() => navigate('/ai-chat?tab=base')}
          >
            <span>Knowledge base</span>
          </div>
        </section>
      </HeaderMain>
      <span className={styles.plainText}>{`AI Chat / @${category}`}</span>
      <span style={{ marginTop: '20px' }} className={styles.categoryTitle}>{`@${category}`}</span>
      <span style={{ marginTop: '10px' }} className={styles.plainText}>
        Place for category description
      </span>
      <span style={{ marginTop: '20px' }} className={styles.title}>
        Learning...
      </span>
    </div>
  );
};

export default CategoryPage;
