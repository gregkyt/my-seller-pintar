import Image from "next/image";
import Pagination from "./pagination";

export enum SortBy {
  ASC = "ASC",
  DESC = "DESC",
}
interface TableProps {
  columns: Record<string, string>;
  data: Record<string, any>[];
  isRow?: boolean;
  isPagination?: boolean;
  totalPage?: number;
  currentPage?: number;
  limit?: number;
  className?: string;
  sortBy?: SortBy | undefined;
  columnSortId?: string;
  onSortClick?: (id: string, sortBy: SortBy | undefined) => void;
  onLimitChange?: (count: number) => void;
  onPageChange?: (page: number) => void;
  onActionClick?: (
    data: Record<string, any>,
    menu: Record<string, any>
  ) => void;
}

function Head({ columns }: { columns: Record<string, string> }) {
  return (
    <thead>
      <tr>
        {Object.keys(columns).map((item, index) => (
          <th
            key={index}
            id={item}
            className={`bg-brand-slate-200 justify-center items-center`}
          >
            <div className="flex justify-center items-center gap-2">
              <p
                className={`text-brand-gray-900 text-sm font-medium text-center`}
              >
                {columns[item]}
              </p>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}

function Body({
  data,
  columns,
  onActionClick,
}: {
  data: Record<string, any>[];
  columns: Record<string, string>;
  onActionClick?: (
    data: Record<string, any>,
    menu: Record<string, any>
  ) => void;
}) {
  return (
    <tbody>
      {data.map((item, dataIndex) => {
        return (
          <Row
            key={dataIndex}
            item={item}
            dataIndex={dataIndex}
            columns={columns}
            onActionClick={onActionClick}
          />
        );
      })}
    </tbody>
  );
}

function Row({
  item,
  dataIndex,
  columns,
  onActionClick,
}: {
  item: Record<string, any>;
  dataIndex: number;
  columns: Record<string, string>;
  onActionClick?: (
    data: Record<string, any>,
    menu: Record<string, any>
  ) => void;
}) {
  const thumbnailItem = (item: any) => {
    return (
      <Image
        src={`/api/image?url=${encodeURIComponent(item ?? "")}`}
        width={60}
        height={60}
        alt={item}
      />
    );
  };

  const lastItem = (
    itemRow: Record<string, any>,
    item: Record<string, any>[]
  ) => {
    return (
      <div className="flex gap-2">
        {item.map((menu, index) => {
          return (
            <div
              key={index}
              className={`cursor-pointer btn-link ${
                menu.key === "delete" ? "text-error" : "text-brand-blue-500"
              }`}
              onClick={() => {
                if (onActionClick) onActionClick(itemRow, menu);
              }}
            >
              {menu.value}
            </div>
          );
        })}
      </div>
    );
  };

  const itemCell = (item: any) => {
    return <div className="text-brand-gray-900">{item}</div>;
  };

  const cell = (item: any, column: string) => {
    switch (column) {
      case "thumbnails":
        return thumbnailItem(item[column]);
      case "actions":
        return lastItem(item, item[column]);
      default:
        return itemCell(item[column]);
    }
  };

  return (
    <tr key={dataIndex} className={`hover`}>
      {Object.keys(columns).map((column, columnIndex) => {
        return <td key={columnIndex}>{cell(item, column)}</td>;
      })}
    </tr>
  );
}

function Table(props: TableProps) {
  const {
    columns,
    data,
    isPagination = true,
    totalPage = 1,
    currentPage = 1,
    className,
    onPageChange,
    onActionClick,
  } = props;

  return (
    <div className="overflow-auto">
      <table
        className={`table table-auto rounded-xl table-zebra w-full shadow ${className}`}
      >
        <Head columns={columns} />
        {data && (
          <Body data={data} columns={columns} onActionClick={onActionClick} />
        )}
      </table>
      <div className="flex mt-4 w-full items-center justify-center">
        {isPagination && (
          <Pagination
            currentPage={currentPage}
            totalPage={totalPage}
            onClick={(value) => {
              if (onPageChange) onPageChange(value);
            }}
          />
        )}
      </div>
      <div className="h-12" />
    </div>
  );
}

export default Table;
