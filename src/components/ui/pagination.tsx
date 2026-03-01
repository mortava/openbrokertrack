'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  // Build page number array with ellipsis
  function getPageNumbers(): (number | 'ellipsis-start' | 'ellipsis-end')[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [1];
    if (currentPage > 3) pages.push('ellipsis-start');
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('ellipsis-end');
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="flex items-center justify-between gap-4 text-xs text-gray-600">
      {/* Item count */}
      <div className="flex items-center gap-2 shrink-0">
        {totalItems > 0 ? (
          <span>
            {start} &ndash; {end} of {totalItems} items
          </span>
        ) : (
          <span>No items</span>
        )}

        {/* Page size selector */}
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-gray-400">Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="border border-gray-200 rounded-md px-1.5 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]/30 bg-white cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            'p-1.5 rounded-md border transition-colors',
            currentPage <= 1
              ? 'border-gray-100 text-gray-300 cursor-not-allowed'
              : 'border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50'
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, idx) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <span
                key={`${page}-${idx}`}
                className="w-7 h-7 flex items-center justify-center text-gray-400 select-none"
              >
                &hellip;
              </span>
            );
          }
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'w-7 h-7 flex items-center justify-center rounded-md border text-xs font-medium transition-colors',
                isActive
                  ? 'bg-[#171717] border-[#171717] text-white'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            'p-1.5 rounded-md border transition-colors',
            currentPage >= totalPages
              ? 'border-gray-100 text-gray-300 cursor-not-allowed'
              : 'border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50'
          )}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
