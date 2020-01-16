/**
 * @Author: zhangfeng
 * @Descripter: 组件关联和数据传递
 * @Date: 2020-01-14 08:52:20
 * @Last Modified by: zhangfeng
 * @Last Modified time: 2020-01-14 12:21:57
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createStore } from 'redux';
import _ from 'lodash';

export default function DataSource(setting, allowOuterControl) {
  // 存储查询参数
  let queryParams = {};
  const DataSet = {};
  // paramsListener
  const paramsChangeListeners = [];
  // reduxState
  const initState = {};
  // report reducer
  const dataSourceFactory = (state = initState, action) => {
    switch (action.type) {
      case 'update':
        console.info('update reports state: ', action);
        return {
          ...state,
          ...action.payload,
        };
      default:
        return state;
    }
  };
  // redux store
  let store = null;
  /**
   * 添加dataSources配置，配置中指定 isMaster数据源配置是 表格的数据源
   */
  this.add = (dataSources) => {
    _.map(dataSources, (item) => {
      const {
        id, // 数据源标识
        doAction, // 外部dispatch, 确保effects 中的generator函数始终return response;
        params = {}, // 数据源初始化请求时的基础参数
        targetData = 'data', // 指定数据源response中的数据路径
        isMaster, // 主数据源，表格数据源
        targetPage = 'page', // 指定数据源response中的分页信息路径
        url = '', // 指定数据源的URL配置（与doAction排斥）
        method = 'get', // 指定数据源的URL配置，请求方式
        data, // 指定静态数据源的数据，与url|doAction互斥
      } = item;

      const targetDataPath = typeof targetData === 'function' ? targetData : res => _.get(res, targetData);
      const targetPagePath = typeof targetPage === 'function' ? targetPage : res => _.get(res, targetPage);

      // 默认的doAjax 模拟一个Promise
      // 处理静态数据源，传入cb, 用于可能的静态数据源筛选（比如：动态表格列）
      let doAjax = async ({ cb = () => true }) => ({ data: _.filter(data, cb) });
      if (typeof doAction === 'function') {
        // 处理 外部的 redux dispatch函数
        doAjax = (query = {}) => doAction({ ...params, ...query });
      } else if (url) {
        // 处理 ajax配置
        doAjax = query => axios({
          method,
          url,
          data: { ...query },
        });
      }
      initState[id] = {};

      // 常量数据源直接存入state
      if (data) {
        initState[id] = {
          list: data,
        };
      }

      DataSet[id] = {
        // 公共的获取数据的方法
        // isOuter 调用者是不是从外部来的
        get: (query, isOuter) => {
          const newParams = { ...params, ...query };
          if (allowOuterControl && !isOuter) {
            // 允许外部控制查询 但是调用者是内部，就只通知外部更新，但是自己不做更新
            _.forEach(paramsChangeListeners, listener => listener({ ...newParams }));
            return;
          } else if (allowOuterControl && isOuter) {
            // 允许外部控制查询 调用者也是外部，不通知外部，直接更新
          } else if (!allowOuterControl && isOuter){
            // 不允许外部控制, 只做外部通知
            _.forEach(paramsChangeListeners, listener => listener({ ...newParams }));
            return;
          } else if (!allowOuterControl && !isOuter){
            // 不允许外部控制，但是是内部更新 外部通知并更新
            _.forEach(paramsChangeListeners, listener => listener({ ...newParams }));
          }

          doAjax(newParams).then(res => ({
            list: targetDataPath(res),
            page: targetPagePath(res),
          })).then((res) => {
            store.dispatch({
              type: 'update',
              payload: {
                [id]: { ...res },
                queryParams: newParams,
              },
            });
            return res;
          });
        },
      };
      // 标记主数据源为master,用作全局操作
      if (isMaster) {
        DataSet.master = DataSet[id];
      }
    });
    // 创建reduxStore
    store = createStore(dataSourceFactory);
  };
  this.add(setting);

  // store订阅器
  const Connect = (mapStateToProps, mapDispatchToProps = {}) => Component => (connnectProps) => {
    const [state, setState] = useState(store.getState());
    const listener = () => {
      const newState = store.getState();
      setState(newState);
    };
    // store.subscribe返回取消订阅回调，在组件销毁时，删除订阅函数
    useEffect(() => store.subscribe(listener));
    const newProps = mapStateToProps(state);
    return (
      <Component {...connnectProps} {...newProps} {...mapDispatchToProps} />
    );
  };

  return {
    get DataSet() {
      // 提供给外部调用的所有数据源引用
      return DataSet;
    },
    onParamsChange(listener) {
      // master触发查询时回调
      paramsChangeListeners.push(listener);
      let index = paramsChangeListeners.length - 1;
      let len = 1;
      // 移除监听
      return function removeListener() {
        paramsChangeListeners.splice(index, len);
        // 避免反复删除
        index = null;
        len = null;
      };
    },
    setParams(query) {
      // 提供给外部定参数的方法，会触发查询（为了保持内外参数一致，直接覆盖内部参数）
      queryParams = {
        ...query,
      };
      // true 标记此请求为外部更新
      DataSet.master.get(queryParams, true);
    },
    add: this.add,
    ConnectDataSource: (dataSourceProps) => {
      const { component, ...restProps } = dataSourceProps;
      const Component = component;
      const { dataSource, queryEvent, columns } = restProps;
      const newDispatch = {
        [queryEvent]: (query = {}) => {
          queryParams = {
            ...queryParams,
            ...query,
          };
          DataSet.master.get(queryParams);
        },
      };
      if (dataSource) {
        // 组件数据源的查询函数
        newDispatch.DataSetGet = DataSet[dataSource].get;
        // 表头配置数据源的筛选函数（暂时没有实现判断不同的组件类型传入不同的数据，因为这不利于扩展）
        newDispatch.ColumnsFilter = DataSet.columns.get;
      }
      const ConncetComponent = Connect(
        state => ({
          dataSet: state[dataSource], // 订阅所需的数据源数据
          columns: state[columns], // 所有组件订阅默认的数据源columns
          queryParams: state.queryParams, // 所有组件订阅报表查询条件
        }),
        newDispatch,
      )(Component);
      return (
        <ConncetComponent {...restProps} />
      );
    },
  };
}
