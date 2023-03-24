import React from 'react';
import styles from './paginationBase.module.scss';
import { ArrowRight, ArrowLeft } from '../../../../assets/svg/SVGcomponent';

export interface Props {
  page: number;
  totalPages: number;
  handlePagination: (page: number) => void;
}

export const PaginationBase: React.FC<Props> = ({ page, totalPages, handlePagination }) => {
  return (
    <div className={styles.paginationWrapper}>
      <button
        onClick={() => handlePagination(page - 1)}
        type="button"
        disabled={page === 1}
        className={[styles.pageItem, page === 1 ? styles.disabled : ''].join(' ')}
      >
        <ArrowLeft />
      </button>

      <p className={styles.info}>
        {page} of {totalPages}
      </p>

      <button
        onClick={() => handlePagination(page + 1)}
        type="button"
        disabled={page === totalPages}
        className={[styles.pageItem, page === totalPages ? styles.disabled : ''].join(' ')}
      >
        <ArrowRight />
      </button>
    </div>
  );
};
