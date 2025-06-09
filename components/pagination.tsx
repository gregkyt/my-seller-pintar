import { ReactNode } from "react";

interface PaginationProps {
  className?: string;
  currentPage: number;
  totalPage: number;
  onClick: (value: number) => void;
}

function PageItem({
  currentPage,
  totalPage,
  onPageClick,
}: {
  currentPage: number;
  totalPage: number;
  onPageClick: (value: number) => void;
}) {
  const delta = 2;
  const left = currentPage - delta;
  const right = currentPage + delta + 1;
  const range = [];
  const rangeWithDots = [];
  let index;

  for (let i = 1; i <= totalPage; i++) {
    if (i == 1 || i == totalPage || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (index) {
      if (i - index === 2) {
        rangeWithDots.push(index + 1);
      } else if (i - index !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    index = i;
  }

  const pages: ReactNode[] = [];
  rangeWithDots.map((item, index) => {
    pages.push(
      <button
        key={index}
        className={`join-item btn btn-square ${
          currentPage === item && "bg-blue-500 text-white"
        }`}
        disabled={item === "..."}
        onClick={() => onPageClick(Number(item))}
      >
        {item}
      </button>
    );
  });

  return pages;
}

export default function Pagination(props: PaginationProps) {
  const { className, currentPage, totalPage, onClick } = props;

  return (
    <div className={`join ${className}`}>
      <PageItem
        currentPage={currentPage}
        totalPage={totalPage}
        onPageClick={(value) => onClick(value)}
      />
    </div>
  );
}
