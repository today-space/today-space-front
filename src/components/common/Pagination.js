import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAngleLeft, faAngleRight, faAnglesRight } from "@fortawesome/free-solid-svg-icons";

function Pagination({ itemsPerPage, pagePerDisplay, totalItems, totalPages, URL, onChangePage }) {
  
  const [searchParams, setSearchParams] = useSearchParams();
  const initPage = parseInt(searchParams.get("page")) || 1; 
  const [currentPage, setCurrentPage] = useState(initPage);
  const [displayPageGroup, setDisplayPageGroup] = useState(Math.ceil(currentPage / pagePerDisplay));
  const [pageGroup, setPageGroup] = useState({
    first: (displayPageGroup - 1) * pagePerDisplay + 1,
    last: Math.min(displayPageGroup * pagePerDisplay, totalPages)
  });
  const [pageNumbers, setPageNumbers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setDisplayPageGroup(Math.ceil(currentPage / pagePerDisplay));
  }, [currentPage]);

  useEffect(() => {
    setPageGroup({
      first: (displayPageGroup - 1) * pagePerDisplay + 1,
      last: Math.min(displayPageGroup * pagePerDisplay, totalPages)
    });
  }, [displayPageGroup, totalPages]);

  useEffect( () => {

    let pages = [];

    for (let i = pageGroup.first; i <= pageGroup.last; i++) {
      pages.push(i);
    }

    setPageNumbers(pages);

  }, [pageGroup]);

  useEffect( () => {

    setCurrentPage(initPage);
    onChangePage(initPage);

  }, [initPage]);

  const handleClickPageNum = (e) => {

    setCurrentPage(e.target.value);
    onChangePage(e.target.value);

    return navigate(`${URL}?page=${e.target.value}`);
  };

  const handleClickIcon = (e) => {

    let page;

    if (e.currentTarget.value === -1) {
      page = currentPage - 1;
    }

    if (e.currentTarget.value === 0) {
      page = currentPage + 1;
    }

    if (e.currentTarget.value !== -1 && e.currentTarget.value !== 0) {
      page = e.currentTarget.value
    }

    setCurrentPage(page);
    onChangePage(page);

    return navigate(`${URL}?page=${page}`);
  };

  return (
    <>
      {totalItems > itemsPerPage 
      ? <section className="pagination-container">
          {currentPage > 1 
          ? <ul>
              <li className="pagination-container-icon" onClick={handleClickIcon} value={1}><FontAwesomeIcon icon={faAnglesLeft} /></li>
              <li className="pagination-container-icon" onClick={handleClickIcon} value={-1}><FontAwesomeIcon icon={faAngleLeft} /></li>
            </ul>
          : null}
 
          <ul onClick={handleClickPageNum}>
            {pageNumbers.map( (el) => {
              return <li 
                        key={el} 
                        className={currentPage === el ? "pagination-container-page-number-active" : "pagination-container-page-number"}
                        value={el}
                      >
                        {el}
                      </li>
            })}
          </ul>

          {currentPage < totalPages
          ? <ul>
              <li className="pagination-container-icon" onClick={handleClickIcon} value={0}><FontAwesomeIcon icon={faAngleRight} /></li>
              <li className="pagination-container-icon" onClick={handleClickIcon} value={totalPages}><FontAwesomeIcon icon={faAnglesRight} /></li>
            </ul>
          : null}
        </section>
      : null}
    </>
  );
}

export default Pagination;