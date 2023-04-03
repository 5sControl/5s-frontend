import React from 'react';
import styles from './pagination.module.scss';
import { ArrowRight, ArrowLeft } from '../../assets/svg/SVGcomponent';

export interface Props {
  page: number;
  totalPages: number;
  handlePagination: (page: number) => void;
  disabled?: boolean;
}

export const Pagination: React.FC<Props> = ({
  page,
  totalPages,
  handlePagination,
  disabled = false,
}) => {
  return (
    <div className={styles.paginationWrapper}>
      <button
        onClick={() => handlePagination(page - 1)}
        type="button"
        disabled={page === 1 || disabled}
        className={[styles.pageItem, page === 1 || disabled ? styles.disabled : ''].join(' ')}
      >
        <ArrowLeft />
      </button>

      <p className={styles.info}>
        {page} of {totalPages}
      </p>

      <button
        onClick={() => handlePagination(page + 1)}
        type="button"
        disabled={page === totalPages || disabled || totalPages < page}
        className={[
          styles.pageItem,
          page === totalPages || disabled || totalPages < page ? styles.disabled : '',
        ].join(' ')}
      >
        <ArrowRight />
      </button>
    </div>
  );
};
