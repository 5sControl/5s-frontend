import React from 'react';
import classNames from 'classnames';

import styles from './paginationBase.module.scss';

export interface Props {
  page: number;
  totalPages: number;
  handlePagination: (page: number) => void;
}

export const PaginationBase: React.FC<Props> = ({ page, totalPages, handlePagination }) => {
  return (
    <div className={styles.pagination}>
      <div className={styles.paginationWrapper}>
        <button
          onClick={() => handlePagination(page - 1)}
          type="button"
          className={classNames([styles.pageItem, styles.sides].join(' '))}
          disabled={page === 1}
        >
          &lt;
        </button>
        <p>
          {page} of {totalPages}
        </p>
        <button
          onClick={() => handlePagination(page + 1)}
          type="button"
          disabled={page === totalPages}
          className={[styles.pageItem, styles.sides].join(' ')}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
