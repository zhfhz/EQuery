import React from 'react';
import { Pagination } from 'antd';
import Condition from '../../common/Condition';

class Pager extends Condition {
  handlePagerChange = (current, pageSize) => {
    const { pageSize: sizeName, current: currentName = 'pageNum' } = this.props;
    this.query({
      [sizeName]: pageSize,
      [currentName]: current,
    });
  }

  renderCondition() {
    const { pageTotal = 'total', current: currentName, pageSize: pageSizeName, dataSet: { page = {} } } = this.props;
    return (
      <Pagination
        total={page[pageTotal]}
        current={page[currentName]}
        pageSize={page[pageSizeName]}
        onChange={this.handlePagerChange}
        onShowSizeChange={(current, pageSize) => this.handlePagerChange(1, pageSize)}
      />
    );
  }
}

Condition.register('Pager', Pager);
