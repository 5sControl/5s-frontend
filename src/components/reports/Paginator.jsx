import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

export const Paginator = ({ data, setCurrentPage, currentPage }) => {
  return (
    <>
      <div className="dashboard__paginator">
        <span>{`Reports per page: ${
          currentPage === Math.ceil(data.count / 20) ? data.count % 20 : 20
        }`}</span>
        <div className="dashboard__paginator_container">
          <button
            className={
              currentPage === 1
                ? 'dashboard__paginator_button_noactive'
                : 'dashboard__paginator_button'
            }
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <AiOutlineLeft />
          </button>
          <span className="dashboard__paginator_text">
            {' '}
            {`${currentPage} of ${Math.ceil(data.count / 20)}`}
          </span>
          <button
            className={
              currentPage === Math.ceil(data.count / 20)
                ? 'dashboard__paginator_button_noactive'
                : 'dashboard__paginator_button'
            }
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <AiOutlineRight />
          </button>
        </div>
      </div>
    </>
  );
};
