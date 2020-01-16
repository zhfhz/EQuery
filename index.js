import React from 'react';
import _ from 'lodash';
import { bindDataSource } from './common/TableRows';
import DataSource from './common/DataSource';
import getConditions from './components/Condition';
import Column from './common/Column/v1';

/**
 *
 * @param {*} conditionNames 要使用的查询条件列表
 * @param {*} columns 表头配置项列表
 * @param {*} dataSources 数据源配置列表
 * @param {*} allowOuterControl 允许外部控制表格更新
 */
export default function Reports(conditionNames, columns, dataSources, allowOuterControl) {
  const dataSourceInstance = new DataSource(dataSources, allowOuterControl);
  const { ConnectDataSource, DataSet } = dataSourceInstance;
  const TableRows = bindDataSource(ConnectDataSource);
  const conditions = getConditions(conditionNames, ConnectDataSource);
  const conditionMap = _.reduce(conditionNames, (preIt, curIt, index) => {
    const newPreIte = { ...preIt };
    newPreIte[curIt] = conditions[index];
    return newPreIte;
  }, {});
  const antdColumns = new Column(columns, conditionMap);
  // 添加一个内置的数据源columns
  dataSourceInstance.add([{
    id: 'columns',
    data: antdColumns.parse(),
  }]);
  this.getConditions = () => conditionMap;
  let masterDataSource = '';
  const WrapTableRows = (props) => {
    const newProps = { ...props };
    const {
      DataSetGet,
      onQuery,
      ...restProps } = newProps;
    // 获取表格数据源名称
    masterDataSource = restProps.dataSource;
    return (
      <TableRows {...restProps} />
    );
  };
  this.getTable = () => WrapTableRows;
  this.getDataSource = () => dataSourceInstance;
  this.initDataSource = () => {
    const all = [];
    _.mapKeys(DataSet, ({ get }, key) => {
      if (masterDataSource !== key && key !== 'master') {
        all.push(get({}));
      }
      if (key === 'columns') {
        all.push(get({
          cb: it => !it.hidden,
        }));
      }
    });
    Promise.all(all).then(() => {
      DataSet.master.get({});
    });
  };
  this.initDataSource();
}
