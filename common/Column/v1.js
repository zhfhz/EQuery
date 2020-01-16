/**
 * @Author: zhangfeng
 * @Descripter: V1 处理 bold 自定义属性
 * @Date: 2020-01-13 17:46:09
 * @Last Modified by: zhangfeng
 * @Last Modified time: 2020-01-13 17:57:25
 */

import React from 'react';
import _ from 'lodash';
import V0 from './v0';

export default class V1 extends V0 {
  constructor(columns, conditions) {
    super(columns, conditions);
    // 存储表头配置
    this.columns = columns;
    // 存储查询条件组件集合
    this.conditions = conditions;
  }

  /**
   * 解析表头配置，可以重写，打算以继承的方式拓展表头自定义配置的解析
   */
  parse() {
    // 获取上一级类中的解析结果
    this.columns = super.parse();
    // parse
    this.columns = _.map(this.columns, (col) => {
      const bold = col.bold;
      if (bold) {
        // 删除自定义属性
        const newCol = { ...col };
        delete newCol.bold;
        const title = newCol.title;
        newCol.title = (
          <span style={{ fontWeight: 'bolder' }}>
            {title}
          </span>
        );
        return newCol;
      }
      return col;
    });
    return this.columns;
  }
}
