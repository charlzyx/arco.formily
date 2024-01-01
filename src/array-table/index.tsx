import { ArrayBaseMixins, ArrayBase } from "../array-base";
import type { ArrayField } from "@formily/core";
import { observer, useField } from "@formily/react";
import {
  Table,
  PaginationProps,
  Pagination,
  Space,
} from "@arco-design/web-react";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAddition, useColumnsAndSourceRender, useSortable } from "./hooks";
import { usePrefixCls } from "../__builtins__";

import "./style";

type IQueryTableProps = React.ComponentProps<typeof Table>;

export const showTotal = (total: number, range: number[]) =>
  `第 ${range[-1]}-${range[1]} 条, 共 ${total} 条数据`;

const usePage = (dataSource: any[], page: IQueryTableProps["pagination"]) => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(
    typeof page == "object" ? page?.pageSize || 10 : 10
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

  const renderPage = () => {
    return (
      <div className={cls}>
        {total > pageSize ? (
          <Pagination
            size="small"
            total={total}
            current={current}
            showTotal
            showJumper
            sizeCanChange
            onPageSizeChange={setPageSize}
            onChange={setCurrent}
          />
        ) : null}
      </div>
    );
  };

  return {
    slice: dataSource.slice(startIndex, endIndex),
    renderPage,
    pageSize,
  };
};

export const ArrayTable: React.FC<IQueryTableProps> &
  ArrayBaseMixins & {
    Column?: React.FC<React.PropsWithChildren<{}>>;
  } = observer((props: IQueryTableProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperCls = usePrefixCls("formily-array-table");

  const field = useField<ArrayField>();

  const dataSource = Array.isArray(field.value) ? field.value.slice() : [];
  const { slice, renderPage, pageSize } = usePage(dataSource, props.pagination);

  const defaultRowKey = (record: any) => {
    return dataSource.indexOf(record);
  };

  const sortableBody = useSortable(wrapperRef);

  const [columns, renderSources] = useColumnsAndSourceRender(field);

  const addtion = useAddition();

  return (
    <div ref={wrapperRef} className={wrapperCls}>
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
        {renderSources()}
        {renderPage()}
        {addtion}
      </ArrayBase>
    </div>
  );
}) as any;

ArrayBase?.mixin?.(ArrayTable);

ArrayTable.Column = () => {
  return <Fragment />;
};
