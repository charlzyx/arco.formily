import { Pagination, Table } from "@arco-design/web-react";
import type { ArrayField } from "@formily/core";
import { RecursionField, observer, useField } from "@formily/react";
import React, {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePrefixCls } from "../__builtins__";
import { ArrayBase, ArrayBaseMixins } from "../array-base";
import {
  useAddition,
  useArrayTableColumns,
  useArrayTableSources,
  useSortable,
} from "./hooks";
import "./style";
import { isColumnComponent } from "./utils";
type IQueryTableProps = React.ComponentProps<typeof Table>;

interface PaginationAction {
  totalPage?: number;
  pageSize?: number;
  changePage?: (page: number) => void;
}

const PaginationContext = createContext<PaginationAction>({});
const usePagination = () => {
  return useContext(PaginationContext);
};

const usePage = (dataSource: any[], page: IQueryTableProps["pagination"]) => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(
    typeof page === "object" ? page?.pageSize || 10 : 10,
  );
  const total = dataSource?.length || 0;
  const cls = usePrefixCls("formily-array-table-formily-pagination");

  const startIndex = (current - 1) * pageSize;
  const totalPage = Math.ceil(total / pageSize);
  const endIndex = current * pageSize;

  useEffect(() => {
    if (totalPage > 0 && totalPage < current) {
      setCurrent(totalPage);
    }
  }, [totalPage, current]);

  const ctx = {
    totalPage,
    pageSize,
    changePage: setCurrent,
  };

  const renderPage = () => {
    return (
      <div className={cls}>
        {total > pageSize ? (
          <Pagination
            showTotal
            showJumper
            sizeCanChange
            size="small"
            {...(page as object)}
            total={total}
            current={current}
            onPageSizeChange={setPageSize}
            onChange={setCurrent}
          />
        ) : null}
      </div>
    );
  };

  return {
    slice: dataSource.slice(startIndex, endIndex),
    ctx,
    renderPage,
  };
};

export const ArrayTable: React.FC<IQueryTableProps> &
  ArrayBaseMixins & {
    Column?: React.FC<React.PropsWithChildren>;
  } = observer((props: IQueryTableProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperCls = usePrefixCls("formily-array-table");

  const field = useField<ArrayField>();

  const dataSource = Array.isArray(field.value) ? field.value.slice() : [];
  const {
    slice,
    renderPage,
    ctx: pageCtx,
  } = usePage(dataSource, props.pagination);

  const defaultRowKey = (record: any) => {
    return dataSource.indexOf(record);
  };

  const sortableBody = useSortable(wrapperRef);

  const sources = useArrayTableSources();
  const columns = useArrayTableColumns(field, sources, dataSource);

  const addtion = useAddition();

  return (
    <div ref={wrapperRef} className={wrapperCls}>
      <PaginationContext.Provider value={pageCtx}>
        <ArrayBase>
          <Table
            rowKey={defaultRowKey}
            {...props}
            onRow={(row, idx) => {
              const pre = props?.onRow?.(row, idx) || {};
              (pre as any)["data-row-sort-index"] = idx;
              return pre;
            }}
            columns={columns}
            loading={props.loading}
            components={{
              body: sortableBody,
            }}
            data={slice}
            pagination={false}
          />
          {sources.map((column, key) => {
            if (!isColumnComponent(column.schema)) return;
            return React.createElement(RecursionField, {
              name: column.name,
              schema: column.schema,
              onlyRenderSelf: true,
              key,
            });
          })}{" "}
          {renderPage()}
          {addtion}
        </ArrayBase>
      </PaginationContext.Provider>
    </div>
  );
}) as any;

ArrayBase?.mixin?.(ArrayTable);

ArrayTable.Column = () => {
  return <Fragment />;
};
const BaseAddition = ArrayBase.Addition!;
const Addition: ArrayBaseMixins["Addition"] = (props) => {
  const array = ArrayBase.useArray?.();
  const { totalPage = 0, pageSize = 10, changePage } = usePagination();
  return (
    <BaseAddition
      {...props}
      onClick={(e) => {
        // nextick
        setTimeout(() => {
          // 如果添加数据后将超过当前页，则自动切换到下一页
          const total = array?.field?.value.length || 0;
          if (
            total >= totalPage * pageSize + 1 &&
            typeof changePage === "function"
          ) {
            changePage(totalPage + 1);
          }
          props.onClick?.(e);
        });
      }}
    />
  );
};
ArrayTable.Addition = Addition;
