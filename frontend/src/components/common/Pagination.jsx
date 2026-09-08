import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        marginTop: '2.5rem',
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="btn btn-outline btn-sm"
        style={{ padding: '0.4rem 0.6rem' }}
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`btn btn-sm ${p === currentPage ? 'btn-primary' : 'btn-outline'}`}
          style={{ minWidth: '36px', padding: '0.4rem 0.6rem' }}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="btn btn-outline btn-sm"
        style={{ padding: '0.4rem 0.6rem' }}
        aria-label="Next Page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
