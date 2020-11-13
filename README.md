##### tree-graph 基于 G6 的开箱即用应用

> ##### 安装

yarn add tree-graph --save --registry https://nexus.alltosea.com/repository/nhc-npm-group/

> ##### 主要实现功能

-  右键菜单
-  节点 hover 效果
- 数据驱动
- 画布自适应

> ##### demo

```
 import TreeGraph from 'tree-graph';
 const data = {

    "id": "0",
    "level": 0,
    "collapsed": false,
    "dataType": "root",
    "name": "2020.03.12 13:03 hwx测试",
    "data": {},
    "children": [
      {
        "id": "1336529001644064",
        "fid": "0",
        "level": 1,
        "collapsed": true,
        "dataType": "",
        "name": "2020.03.12 13:03 申请资源名称2",
         "conextMenu": []
        "data": {
          "isImmediate": true,

        },
        "children": [
          {
            "id": "1336534944972832",
            "fid": "1336529001644064",
            "level": 2,
            "collapsed": true,
            "dataType": "",
            "name": "测试三",
            "data": {}
          }
        ]
      },
      {
        "id": "1336528909369376",
        "fid": "0",
        "level": 1,
        "collapsed": true,
        "dataType": "",
        "name": "2020.03.12 13:03 申请资源名称",
        "conextMenu": [
            {
              "name": "资源表:来穗人口调查",
              "data": {}
            },
            {
              "name": "附件",
              "data": {}
            }
          ]
        "data": {

        }
      },
      {
        "id": "1336532740866080",
        "fid": "0",
        "level": 1,
        "collapsed": true,
        "dataType": "",
        "name": "测试",
        "data": {}
      }
    ]

}
 const config = { data:data, container:'container'};
 console.log('config', config);
 const taskRelationshipDiagram = new TreeGraph(config);
```

#### API

##### data

| 参数              | 说明                           | 类型    | 默认值 | require |
| ----------------- | ------------------------------ | ------- | ------ | ------- |
| id                | 节点唯一标识                   | string  | -      | true    |
| fid               | 父节点 id（最顶层节点可不传）  | string  | -      | true    |
| level             | 节点层次                       | number  | -      | false   |
| collapsed         | 是否展开                       | boolean | false  | false   |
| name              | 节点 title                     | string  | -      | false   |
| data              | 模型数据                       | object  | -      | false   |
| conextMenu        | 右键菜单                       | array   | -      | false   |
| children          | 子节点                         | object  | -      | false   |
| disableExpandIcon | 隐藏展开收宿 icon              | boolean | false  | false   |

##### data.conextMenu

| 参数 | 说明               | 类型   | 默认值 | require |
| ---- | ------------------ | ------ | ------ | ------- |
| name | 右键菜单列表 title | string | -      | true    |
| data | 右键菜单列表数据   | object | -      | false   |

##### treeGraph.Graph

返回图表的载体,等同 G6.Graph 用  法可参考 https://g6.antv.vision/zh/docs/api/Graph

#### 回调参数

##### treeGraph.conextMenuClick

右键菜单回调函数

| 名称 | 类型   | 描述                 |
| ---- | ------ | -------------------- |
| data | object | conextMenu.data 数据 |

```
例：treeGraph.conextMenuClick(
  function(data) {}
)
```
