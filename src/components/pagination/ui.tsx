import React, { useState } from 'react';
import { PaginationBase } from './components/PaginationBase';

export interface PropsType {
  page: number;
  totalPages: number;
  handleSetPages: (updatePage: number) => void;
}

export const PaginationContainer: React.FC<PropsType> = ({ page, totalPages, handleSetPages }) => {
  const [currentPage, setCurrentPage] = useState(page);

  const handlePages = (updatePage: number) => {
    setCurrentPage(updatePage);
    handleSetPages(updatePage);
  };

  return (
    <PaginationBase page={currentPage} totalPages={totalPages} handlePagination={handlePages} />
  );
};
