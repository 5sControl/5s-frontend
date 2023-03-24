import React from 'react';
import { setOrdersViewPage } from '../../pages/previewOrders/previewOrdersSlice';
import { useAppDispatch } from '../../store/hooks';
import { PaginationBase } from './components/PaginationBase';

export interface PropsType {
  page: number;
  totalPages: number;
  handleSetPages: (updatePage: number) => void;
}

export const PaginationContainer: React.FC<PropsType> = ({ page, totalPages, handleSetPages }) => {
  // const [currentPage, setCurrentPage] = useState(page);
  const dispatch = useAppDispatch();

  const handlePages = (updatePage: number) => {
    dispatch(setOrdersViewPage(updatePage));
    handleSetPages(updatePage);
  };

  return <PaginationBase page={page} totalPages={totalPages} handlePagination={handlePages} />;
};
