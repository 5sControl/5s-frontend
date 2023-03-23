import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { getOrdersIdAsync } from '../../pages/previewOrders/previewOrdersSlice';
import { useAppDispatch } from '../../store/hooks';
import { PaginationBase } from './components/PaginationBase';

export interface PropsType {
  page: number;
  totalPages: number;
}

export const PaginationContainer: React.FC<PropsType> = ({ page, totalPages }) => {
  const [currentPage, setCurrentPage] = useState(page);
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['token']);

  const handlePages = (updatePage: number) => {
    setCurrentPage(updatePage);
    dispatch(
      getOrdersIdAsync({
        token: cookies.token,
        hostname: window.location.hostname,
        page: updatePage,
      })
    );
  };

  return (
    <div className="container">
      <PaginationBase page={currentPage} totalPages={totalPages} handlePagination={handlePages} />
    </div>
  );
};
