import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

export default function Rows({
  columns = {}, // 表头设置
  dataSet,
  ...restProps
}) {
  return (
    <Table
      columns={columns.list || []}
      {...restProps}
      dataSource={dataSet.list}
      pagination={false}
    />
  );
}

Rows.propTypes = {
  dataSet: PropTypes.object.isRequired,
  columns: PropTypes.string.isRequired,
};

export const bindDataSource = ConnectDataSource => props => (
  <ConnectDataSource component={Rows} {...props} />
);
