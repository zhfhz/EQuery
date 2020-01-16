/**
 * @Author: zhangfeng
 * @Descripter: 以ANTD Table Columns 配置作为基础，每个子类实现一个自定义属性
 * @Date: 2019-12-23 15:50:27
 * @Last Modified by: zhangfeng
 * @Last Modified time: 2020-01-13 17:46:44
 */
// import React, { Fragment } from 'react';
// import _ from 'lodash';

export default class ColumnV0 {
  constructor(columns, conditions) {
    // 存储表头配置
    this.columns = columns;
    // 存储查询条件组件集合
    this.conditions = conditions;
  }

  /**
   * 解析表头配置，可以重写，打算以继承的方式拓展表头自定义配置的解析
   */
  parse() {
    return this.columns;
  }
}

// class ColumnVer1 extends Column {
//   constructor(columns, conditions) {
//     super(columns, conditions);
//     this.parse(conditions);
//   }
//   parse(conditions) {
//     super.parse(conditions);
//     const { Sort } = conditions;
//     this.columns = _.map(this.columns, (col) => {
//       let cpCol = { ...col };
//       const { sortable, title } = cpCol;
//       delete cpCol.sortable;
//       if (sortable) {
//         // TODO 处理可排序Columns
//         cpCol = {
//           ...cpCol,
//           title: (
//             <Fragment>
//               <span>
//                 {title}
//               </span>
//               <span>
//                 <Sort {...sortable} />
//               </span>
//             </Fragment>

//           )
//         }
//       }
//     });
//   }
// }

// export { ColumnVer1 };

