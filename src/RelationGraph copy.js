import G6 from '@antv/g6';
// 自定义节点
import { tableNode } from './Node/TableNode'
// 自定义布局
import { layout } from './layout'

tableNode()
layout()

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
          data: {
            id: 'A1',
            label: 'A1',
            cluster: 'part1',
          }
        },
        {
          id: 'B0',
          label: 'B0',
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
          cluster: 'part2',
          data: {
            id: 'B1',
            label: 'B1',
            cluster: 'part2',
          }
        },
      ],
      edges: [
        {
          source: 'A0',
          target: 'B1',
        },
        {
          source: 'A1',
          target: 'B0',
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
        default: ['drag-canvas', 'node'],
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
        size: 1,
        color: '#873bf4',
        style: {
          endArrow: {
            path: 'M 0,0 L 8,4 L 8,-4 Z',
            fill: '#873bf4',
          },
        },
      },
    });
    graph.data(data);
    graph.render();
  }

}


