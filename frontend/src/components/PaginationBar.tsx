import React, { useState } from 'react';

interface PaginationBarProps {
  totalPages: number;
  currentPage: number;
  onPage:Function;
}

export default function PaginationBar({ totalPages, currentPage, onPage }: PaginationBarProps) {
  const [showFullPagination, setShowFullPagination] = useState(false);
  const MAX_PAGES_SHOWN = 5;
  const RETRACT_THRESHOLD = 8;

  const generatePageLinks = () => {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return pageNumbers.map((pageNumber) => (
      <li key={pageNumber} aria-current={(pageNumber === currentPage) ? 'page' : undefined}>
        <button
          className={`relative block rounded-xl bg-transparent font-sans font-semibold px-5 py-3 text-lg text-surface hover:translate-y-[-1px] hover:shadow-md transition-all duration-450 ease-in-out  ${
            pageNumber === currentPage
              ? 'bg-blue-100 text-blue-700 '
              : ' hover:bg-slate-50'
          }`}
          onClick={(e)=>{e.stopPropagation();
            if(pageNumber!=currentPage) onPage(pageNumber);}}
        >
          {pageNumber}
          {(pageNumber === currentPage) && (
           <span
           className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"
           >(current)</span>
          )}
        </button>
      </li>
    ));
  };

  return (
    <div>
      <nav aria-label="Page navigation example">
        <ul className="list-style-none flex">
          {(currentPage>1) ? <button
          className ="hover:bg-slate-50 relative block rounded-xl bg-transparent font-sans font-md px-5 py-3 text-lg text-surface hover:translate-y-[-1px] hover:shadow-md transition-all duration-450 ease-in-out "
          onClick={(e)=>{e.stopPropagation();onPage(currentPage-1)}}
            >&laquo;</button>:
            <button
            className ="relative block rounded-xl bg-transparent text-gray-300 font-sans font-md px-5 py-3 text-lg text-surface "
              >&laquo;</button>
          }

          {totalPages > RETRACT_THRESHOLD && !showFullPagination ? (
            <>
              {generatePageLinks().slice(0, MAX_PAGES_SHOWN)}
              <li>
                <button
                  className="px-3 py-2 text-gray-500 hover:bg-neutral-100"
                >
                  ...
                </button>
              </li>
              {generatePageLinks().slice(-1)}
            </>
          ) : (
            generatePageLinks()
          )}

          {(currentPage<totalPages) ? <button
            className ="hover:bg-slate-50 relative block rounded-xl bg-transparent font-sans font-md px-5 py-3 text-lg text-surface hover:translate-y-[-1px] hover:shadow-md transition-all duration-450 ease-in-out "
            onClick={(e)=>{e.stopPropagation();onPage(currentPage+1)}}
            >&raquo;</button>:
              <button
              className ="relative block rounded-xl bg-transparent text-gray-300 font-sans font-md px-5 py-3 text-lg text-surface "
                >&raquo;</button>
          }
        </ul>
      </nav>
    </div>
  );
}

