import React from "react";
import '../componentStyles/Pagination.css';

function Pagination({
  currentPage,
  onPageChange,
  totalPages,
  activeClass = 'active',
  nextPageText = "Next",
  prevPageText = "Prev",
  firstPageText = '1st',
  lastPageText = 'Last'
}) {
  console.log("Pagination rendered — totalPages:", totalPages, "currentPage:", currentPage);

  if (!totalPages || totalPages <= 1) return null;

  const pageNumbers = [];
  const pageWindow = 2;
  for (
    let i = Math.max(1, currentPage - pageWindow);
    i <= Math.min(totalPages, currentPage + pageWindow);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <>
          <button className="pagination-btn" onClick={() => onPageChange(1)}>{firstPageText}</button>
          <button className="pagination-btn" onClick={() => onPageChange(currentPage - 1)}>{prevPageText}</button>
        </>
      )}

      {pageNumbers.map((number) => (
        <button
          className={`pagination-btn ${currentPage === number ? activeClass : ''}`}
          key={number}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      {currentPage < totalPages && (
        <>
          <button className="pagination-btn" onClick={() => onPageChange(currentPage + 1)}>{nextPageText}</button>
          <button className="pagination-btn" onClick={() => onPageChange(totalPages)}>{lastPageText}</button>
        </>
      )}
    </div>
  );
}

export default Pagination;