import G6 from '@antv/g6';
// 自定义节点
import { tableNode } from './Node/TableNode'
// 自定义布局
import { layout } from './layout'
// 自定义群
import { registerCombo } from './combo.js'
// 自定义边
import { customCubicHorizontal } from './edge/cubicHorizontal'

layout()
tableNode()
registerCombo()
customCubicHorizontal()

const modeData = require('./data.json')

console.log('data', modeData)

export default class RelationGraph {
  constructor({
    el,
    data
  }) {
    this.initGraph(el, data)
  }

  initGraph (el) {
    const data = {
      nodes: [
        {
          id: 'A0',
          label: 'A0',
          cluster: 'part1',
          comboId: 'A',
          data: {
            id: 'A0',
            label: 'A0',
            cluster: 'part1',
          }
        },
        {
          id: 'A1',
          label: 'A1',
          cluster: 'part1',
          comboId: 'A',
          data: {
            id: 'A1',
            label: 'A1',
            cluster: 'part1',
          }
        },
        {
          id: 'A3',
          label: 'A3',
          comboId: 'A',
          data: {
            id: 'A3',
            label: 'A3',
          }
        },
        {
          id: 'B0',
          label: 'B0',
          comboId: 'B',
          cluster: 'part2',
          data: {
            id: 'B0',
            label: 'B0',
            cluster: 'part2',
          }
        },
        {
          id: 'B1',
          label: 'B1',
          comboId: 'B',
          cluster: 'part2',
          data: {
            id: 'B1',
            label: 'B1',
            cluster: 'part2',
          }
        },
        {
          id: 'C0',
          label: 'C0',
          comboId: 'C',
          data: {
            id: 'C0',
            label: 'C0',
          }
        },
        {
          id: 'C1',
          label: 'C1',
          comboId: 'C',
          data: {
            id: 'C1',
            label: 'C1',
          }
        },
      ],
      edges: [
        {
          source: 'A0',
          target: 'B1',
          label: 'edge 3',
          labelCfg: {
            autoRotate: true,
            style: {
              fill: 'red',
              // stroke: 'red',
              stroke: 'blue',  // 给文本添加白边和白色背景
              lineWidth: 5,     // 文本白边粗细
              fill: 'yellow',  // 文本颜色
              // width:
            }
          }
        },
        {
          source: 'A1',
          target: 'B0',
        },
        {
          source: 'A3',
          target: 'C1',
        },
        {
          source: 'A1',
          target: 'C0',
        },
      ],
      combos: [
        {
          id: 'A',
          label: 'A-combo',
        },
        {
          id: 'B',
          label: 'B-combo',
        },
        {
          id: 'C',
          label: 'C-combo',
        },
      ],
    };

    const width = document.getElementById('container').scrollWidth;
    const height = document.getElementById('container').scrollHeight || 500;
    const graph = new G6.Graph({
      container: el,
      width,
      height,
      modes: {
        default: ['drag-canvas', 'node', 'zoom-canvas'],
      },
      layout: {
        type: 'bigraph-layout',
        biSep: 300,
        nodeSep: 20,
        nodeSize: 20,
      },
      animate: true,
      defaultNode: {
        type: 'table-node',
        size: [100, 40],
        style: {
          fill: '#C6E5FF',
          stroke: '#5B8FF9',
        },
      },
      defaultEdge: {
        type: 'custom-cubic-horizontal',
        size: 1,
        color: '#873bf4',
        style: {
          endArrow: {
            path: G6.Arrow.vee(5, 10, 5),
            fill: '#873bf4',
          },
        },
      },
      defaultCombo: {
        // The type of the combos. You can also assign type in the data of combos
        type: 'cRect',
        // ... Other global configurations for combos
      },
    });
    graph.data(data);
    graph.render();
  }

}


