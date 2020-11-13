import G6 from '@antv/g6'

/**
 * 布局
 * 1.向下延展
 * 2.向右延展
 */

// 自定义布局
const layout = () => {

  G6.registerLayout('bigraph-layout', {
    execute () {
      const self = this;
      const center = self.center || [0, 0];
      const biSep = self.biSep || 100;
      const nodeSep = self.nodeSep || 20;
      const nodeSize = self.nodeSize || 20;
      const direction = self.direction || 'horizontal';


      let part1Pos = 0;
      let part2Pos = 0;
      let part3Pos = 0;
      if (direction === 'horizontal') {
        part1Pos = center[0] - biSep / 2;
        part2Pos = center[0] + biSep / 2;
        part3Pos = center[0] + biSep;
      }
      const { nodes, edges, combos } = self;

      // 为空提示
      if (!Array.isArray(combos) || combos.length === 0) {
        console.error('tip:数据combo需为数组并元素大于1')
        return
      }

      // 根据combo定义相应数量的群
      const comboArr = combos.map((combo, index) => {
        if (index === 0) {
          return {
            partPos: 0, // 位置
            partNodes: [], //群节点
            partNodeMap: new Map()
          }
        }
      })

      console.log(2222, combos)
      const part1Nodes = [];
      const part2Nodes = [];
      const part3Nodes = [];
      const part1NodeMap = new Map();
      const part2NodeMap = new Map();
      const part3NodeMap = new Map();
      // separate the nodes and init the positions
      nodes.forEach(function (node, i) {
        if (node.comboId === 'A') {
          part1Nodes.push(node);
          part1NodeMap.set(node.id, i);
        } else if (node.comboId === 'B') {
          part2Nodes.push(node);
          part2NodeMap.set(node.id, i);
        } else if (node.comboId === 'C') {
          part3Nodes.push(node);
          part3NodeMap.set(node.id, i);
        }
      });

      // order the part1 node
      part1Nodes.forEach(function (p1n) {
        let index = 0;
        let adjCount = 0;
        edges.forEach(function (edge) {
          const sourceId = edge.source;
          const targetId = edge.target;
          if (sourceId === p1n.id) {
            index += part2NodeMap.get(targetId);
            adjCount += 1;
          } else if (targetId === p1n.id) {
            index += part2NodeMap.get(sourceId);
            adjCount += 1;
          }
        });
        index /= adjCount;
        p1n.index = index;
      });
      part1Nodes.sort(function (a, b) {
        return a.index - b.index;
      });
      // part2Nodes.forEach(function (p2n) {
      //   let index = 0;
      //   let adjCount = 0;
      //   edges.forEach(function (edge) {
      //     const sourceId = edge.source;
      //     const targetId = edge.target;
      //     if (sourceId === p2n.id) {
      //       index += part1NodeMap.get(targetId);
      //       adjCount += 1;
      //     } else if (targetId === p2n.id) {
      //       index += part1NodeMap.get(sourceId);
      //       adjCount += 1;
      //     }
      //   });
      //   index /= adjCount;
      //   p2n.index = index;
      // });
      // part2Nodes.sort(function (a, b) {
      //   return a.index - b.index;
      // });

      // place the nodes
      const hLength = part1Nodes.length > part2Nodes.length ? part1Nodes.length : part2Nodes.length;
      const height = hLength * (nodeSep + nodeSize);
      let begin = center[1] - height / 2;
      if (direction === 'vertical') {
        begin = center[0] - height / 2;
      }
      part1Nodes.forEach(function (p1n, i) {
        if (direction === 'horizontal') {
          p1n.x = part1Pos;
          p1n.y = begin + i * (nodeSep + nodeSize);
        } else {
          p1n.x = begin + i * (nodeSep + nodeSize);
          p1n.y = part1Pos;
        }
      });
      part2Nodes.forEach(function (p2n, i) {
        if (direction === 'horizontal') {
          p2n.x = part2Pos;
          p2n.y = begin + i * (nodeSep + nodeSize);
        } else {
          p2n.x = begin + i * (nodeSep + nodeSize);
          p2n.y = part2Pos;
        }
      });

      part3Nodes.forEach(function (p2n, i) {
        if (direction === 'horizontal') {
          p2n.x = part3Pos;  //更改combo X方向
          p2n.y = begin + i * (nodeSep + nodeSize) + 200;  // 改更comboY方向
        } else {
          p2n.x = begin + i * (nodeSep + nodeSize);
          p2n.y = part3Pos;
        }
      });
    },
  });
}

export {
  layout
}