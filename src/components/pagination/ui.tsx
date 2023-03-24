import React from 'react';
import { PaginationBase } from './components/PaginationBase';

export interface PropsType {
  page: number;
  totalPages: number;
  handleSetPages: (updatePage: number) => void;
}

export const PaginationContainer: React.FC<PropsType> = ({ page, totalPages, handleSetPages }) => {
  const handlePages = (updatePage: number) => {
    handleSetPages(updatePage);
  };

  return <PaginationBase page={page} totalPages={totalPages} handlePagination={handlePages} />;
};
