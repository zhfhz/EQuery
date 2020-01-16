# Reports 使用说明
### 前言
``` Reports并没有设计为React组件，而是设计为相关React组件的生成器。这是由于设计上，希望在使用过程中，组件能够以最少的依赖，放在任何需要它的地方。如果不明白，在Demo目录中的示例可以比较好的表达这个优势。```

``` 但是Reports定制化的查询模式可能并不适用于所有场景。 ```

``` Reports 内默认加载和关联了所有的查询条件组件和数据表格，使得他们之间得以处理常规交互和数据流通。 ```

### API

Reports 的构造器提供3个参数：

    1. conditionNames
      指明所需的查询条件组件名称，例如['Select']

    2. columns
      传入表头的配置JSON数组，可以是基于ANTD Columns的扩展

    3. dataSources
      传入数据源的配置数组格式：[
        {
          id： 'dataList', // 数据源ID
          (data: [] | url: '' | doAction: func): any,
          method?: '',
        }
      ]

Reports 的构造器提供2个函数：

    1. getTable
      返回关联数据源后的表格组件

    2. getConditions
      返回关联数据源后的conditionNames 查询组件

    3. getDataSource
      返回DataSource实例。
      DataSource实例，提供一些API供外部处理，可以查看代码注释

Reports 简单示例：

    const report = new Reports(
      ['Select'],
      [
        {
          title: '编号',
          dataIndex: 'ruleModelCode',
          key: 'ruleModelCode',
          hidden: true,
        },
      ],
      [
        {
          id: 'ruleList',
          doAction: queryRuleList,
          params: {},
          isMaster: true,
          targetData: 'resultData.list',
          targetPage: 'resultData.page',
        },
      ]
    );
    const { Select } = report.getConditions();
    const Table = report.getTable();

    class RuleList extends PureComponent {
      render() {
        <div>
          <header>
            <Select />
          </header>
          <Table />
        </div>
      }
    }

### Reperts 做了哪些工作？

  1. 创建数据源共享池

  2. 获取查询条件组件并关联数据共享池

  3. 获取表格组件并关联到数据共享池

  4. Columns组件解析columns配置为纯粹的Antd配置

  5. 将解析后的Antd配置作为内置的数据源，命名为columns

  6. 先初始化非Master数据源的数据, 再初始化Master数据源的数据

  7. 数据源数据初始化后，更新到内置的ReduxStore, 在Redux的订阅中更新到各个组件