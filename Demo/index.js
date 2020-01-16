/**
 * @Author: zhangfeng
 * @Descripter: 这一层组件其实是各子组件装配后的组件, 对于不同样式的的报表，需要修改个组件的位置。
 * 为了减少配置，我将会在这一层的上层（页面层），集中抽取本组件所需的的配置参数
 * @Date: 2019-12-24 10:52:46
 * @Last Modified by: zhangfeng
 * @Last Modified time: 2020-01-13 18:01:19
 */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Reports from '../Reports';

export default class DataReport extends PureComponent {
  static propTypes = {
    headerConditions: PropTypes.array.isRequired,
    dataSources: PropTypes.array.isRequired,
    columns: PropTypes.string.isRequired,
    footerConditions: PropTypes.array.isRequired,
    conditionList: PropTypes.array.isRequired,
    rowDataSource: PropTypes.string.isRequired,
  }
  constructor(props) {
    super(props);
    const {
      dataSources,
      conditionList,
      columns,
    } = props;
    this.reports = new Reports(conditionList, columns, dataSources);
  }
  componentDidMount() {
    this.reports.initDataSource();
  }
  renderCondition = (conditions) => {
    const components = this.reports.getConditions();
    return (
      <Fragment>
        {
          _.map(conditions, (it) => {
            const { type, ...rest } = it;
            const Comp = components[type];
            return (
              <Comp key={rest.name} {...rest} />
            );
          })
        }
      </Fragment>
    );
  }
  render() {
    const {
      headerConditions,
      footerConditions,
      rowDataSource,
    } = this.props;
    const TableRows = this.reports.getTable();

    return (
      <div>
        <header>
          {this.renderCondition(headerConditions)}
        </header>
        <article>
          <TableRows
            dataSource={rowDataSource}
            columns="columns"
          />
        </article>
        <footer>
          {this.renderCondition(footerConditions)}
        </footer>
      </div>
    );
  }
}
