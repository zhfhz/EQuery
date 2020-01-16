import React from 'react';
import { SingleFilter } from '@lego/lego-react-filter/src';
import Condition from '../../common/Condition';

class Select extends Condition {
  renderCondition() {
    const { DataSetGet, ...restProps } = this.props;
    return (
      <SingleFilter
        {...restProps}
      />
    );
  }
}

// 存储全局
Condition.register('Select', Select);
