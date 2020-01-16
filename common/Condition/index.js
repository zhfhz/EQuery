/**
 * @Author: zhangfeng
 * @Descripter: 查询条件组件的父类组件，抽取相对固定的业务逻辑，配置时除了基础约定的参数，
 * 允许扩展任意配置项，新增的配置项，各组件内自行处理。
 * @Date: 2020-01-02 09:58:31
 * @Last Modified by: zhangfeng
 * @Last Modified time: 2020-01-14 09:49:58
 */


import React, { PureComponent, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const RegisterMap = {};

class Condition extends PureComponent {
  /**
   * 用于扩展组件的接口
   * @param {*} typeName 查询条件组件名
   * @param {*} antdStyleComponent 查询条件外部组件
   */
  static register(typeName, antdStyleComponent) {
    if (RegisterMap[typeName]) {
      console.warn(`Condition中已存在${typeName}的同名组件。不会进行替换`);
      return;
    }
    RegisterMap[typeName] = antdStyleComponent;
  }

  static propTypes = {
    DataSetGet: PropTypes.func, // 数据源对象， 由父组件动态传入，不必操作
    dataSource: PropTypes.string.isRequired, // 数据源名,或者常量数组
    dataSet: PropTypes.object.isRequired, // 订阅的数据 { list, page }
    queryEvent: PropTypes.string.isRequired, // 触发查询的事件名
    targetPage: PropTypes.string, // 数据源分页信息路径
    targetData: PropTypes.string, // 数据源数据路径
    queryParams: PropTypes.object, // 当前查询参数, 用于某些组件用户输入的回填
  }

  static defaultProps = {
    DataSetGet: () => {},
    targetPage: '',
    targetData: '',
    queryEvent: '',
    queryParams: {},
  }

  constructor(props) {
    super(props);
    const { queryEvent } = props;
    this.query = (query) => {
      props[queryEvent](query);
    };
  }

  render() {
    return this.renderCondition();
  }
}
/**
 *
 * @param {*} typeNames 要导出的查询条件
 * @param {*} ConnectDataSource 导出时关联数据源
 */
export const getConditions = (typeNames, ConnectDataSource) => {
  // 处理共享参数
  return _.map(typeNames, (typeName) => {
    const Component = RegisterMap[typeName];
    const WrapComponent = (props) => {
      if (ConnectDataSource) {
        return (
          <ConnectDataSource component={Component} {...props} />
        );
      }
      return (
        <Component {...props} />
      );
    };
    WrapComponent.propTypes = {
      queryEvent: PropTypes.string,
      name: PropTypes.string,
    };
    WrapComponent.defaultProps = {
      queryEvent: '',
      name: '',
    };
    return WrapComponent;
  });
};
export default Condition;
