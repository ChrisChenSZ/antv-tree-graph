// import TreeGraph from '../src/TreeGraph.ts';
// import TreeGraph from '../lib/index.min.js';
import TreeGraph from 'tree-graph';
import axios from 'axios';

const MENU_ICON =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAJ9JREFUWAljYBgFoyEwwCHACLNfavN/rtffv2nC+LSkRTm5rj/zZfwGsoMFZhHI8r///p+B8WlJA+0yAZp/FmQHEy0tIsZseAiAggXqMmL0UaQGHAUUmTCqeTiFAF3KAeR8jx548FxAy3IAOd+jO2BklAOj+R493kf5yCFAk3IAX75HthzEpkk5gC/foztgeJYDo/kePZ5H+aMhMKhDAACX/EnSjrj89QAAAABJRU5ErkJggg==';

// 节点样式
function nodeConfig (node) {
  let config = {};
  // console.log('node', node)
  const status = node.data.taskStateName === '已完成';
  switch (node.dataType) {
    // 主节点
    case 'root': {
      config = {
        basicColor: '#E3E6E8',
        fontColor: 'white',
        borderColor: '#02A8F4',
        bgColor: '#02A8F4',
        cursor: 'pointer',
      };
      break;
    }
    // 新增协作
    case 'add': {
      config = {
        basicColor: '#E3E6E8',
        fontColor: '#02A8F4',
        borderColor: '#02A8F4',
        bgColor: 'white',
        lineDash: [2, 2],
        cursor: 'pointer',
      };
      break;
    }
    // 子节点
    default:
      config = {
        basicColor: '#2F54EB',
        fontColor: '#333333',
        borderColor: status ? 'rgb(72, 189, 15' : '#02A8F4',
        bgColor: 'white',
        cursor: node.level === 2 ? '' : 'pointer',
        icon: MENU_ICON,
      };
      break;
  }
  return config;
}

try {
  axios.get('/static/treeGraph.json').then((res) => {
    const config = { data: res.data.data, container: 'container' };
    console.log('config', config);
    const taskRelationshipDiagram = new TreeGraph(config);
    taskRelationshipDiagram.conextMenuClick((e) => {
      console.log(e);
    });
    console.log(taskRelationshipDiagram);
    taskRelationshipDiagram.graph.on('node:contextmenu', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      const data = evt.get('model').data;
      console.log(evt, `${evt.x + 20}px`, `${evt.y}px`), data;
    });
  });
} catch (e) {
  console.log(e);
}

// import G6 from '@antv/g6';

// /**
//  * 该案例演示，当点击叶子节点时，如何动态向树图中添加多条数据。
//  * 主要演示changeData的用法。
//  */
// const width = document.getElementById('container').scrollWidth;
// const height = document.getElementById('container').scrollHeight || 500;
// const graph = new G6.TreeGraph({
//   container: 'container',
//   width,
//   height,
//   modes: {
//     default: ['collapse-expand', 'drag-canvas'],
//   },
//   fitView: true,
//   layout: {
//     type: 'compactBox',
//     direction: 'LR',
//     defalutPosition: [],
//     getId: function getId(d) {
//       return d.id;
//     },
//     getHeight: function getHeight() {
//       return 16;
//     },
//     getWidth: function getWidth() {
//       return 16;
//     },
//     getVGap: function getVGap() {
//       return 50;
//     },
//     getHGap: function getHGap() {
//       return 100;
//     },
//   },
// });
// graph.node(function (node) {
//   return {
//     size: 16,
//     anchorPoints: [
//       [0, 0.5],
//       [1, 0.5],
//     ],
//     style: {
//       fill: '#DEE9FF',
//       stroke: '#5B8FF9',
//     },
//     label: node.id,
//     labelCfg: {
//       position: node.children && node.children.length > 0 ? 'left' : 'right',
//     },
//   };
// });
// let i = 0;
// graph.edge(function () {
//   i++;
//   return {
//     type: 'cubic-horizontal',
//     color: '#A3B1BF',
//     label: i,
//   };
// });

// const data = {
//   isRoot: true,
//   id: 'Root',
//   style: {
//     fill: 'red',
//   },
//   children: [
//     {
//       id: 'SubTreeNode1',
//       raw: {},
//       children: [
//         {
//           id: 'SubTreeNode1.1',
//         },
//         {
//           id: 'SubTreeNode1.2',
//           children: [
//             {
//               id: 'SubTreeNode1.2.1',
//             },
//             {
//               id: 'SubTreeNode1.2.2',
//             },
//             {
//               id: 'SubTreeNode1.2.3',
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: 'SubTreeNode2',
//       children: [
//         {
//           id: 'SubTreeNode2.1',
//         },
//       ],
//     },
//     {
//       id: 'SubTreeNode3',
//       children: [
//         {
//           id: 'SubTreeNode3.1',
//         },
//         {
//           id: 'SubTreeNode3.2',
//         },
//         {
//           id: 'SubTreeNode3.3',
//         },
//       ],
//     },
//     {
//       id: 'SubTreeNode4',
//     },
//     {
//       id: 'SubTreeNode5',
//     },
//     {
//       id: 'SubTreeNode6',
//     },
//   ],
// };
// graph.data(data);
// graph.render();

// let count = 0;

// graph.on('node:click', function (evt) {
//   const item = evt.item;

//   const nodeId = item.get('id');
//   const model = item.getModel();
//   const children = model.children;
//   debugger;
//   if (!children || children.length === 0) {
//     const childData = [
//       {
//         id: 'child-data-' + count,
//         type: 'rect',
//       },
//       {
//         id: 'child-data1-' + count,
//       },
//     ];

//     const parentData = graph.findDataById(nodeId);
//     if (!parentData.children) {
//       parentData.children = [];
//     }
//     // 如果childData是一个数组，则直接赋值给parentData.children
//     // 如果是一个对象，则使用parentData.children.push(obj)
//     parentData.children = childData;
//     graph.changeData();
//     count++;
//   }
// });
