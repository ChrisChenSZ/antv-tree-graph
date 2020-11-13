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


      let partPos = 0;
      const { nodes, edges, combos } = self;

      // 为空提示
      if (!Array.isArray(combos) || combos.length === 0) {
        console.error('tip:数据combo需为数组并元素大于1')
        return
      }

      // 根据combo定义相应数量的群
      const comboArr = combos.map((data, index) => {
        // if (index === 0) {
        return {
          data,
          partPos: 0, // 位置
          partNodes: [], //群节点
          partNodeMap: new Map()
        }
        // }
      })

      console.log(2222, combos)
      // separate the nodes and init the positions

      comboArr.forEach(combo => {
        console.log('combo', combo)
        nodes.forEach(function (node, i) {
          if (node.comboId === combo.data.id) {
            combo.partNodes.push(node);
            combo.partNodeMap.set(node.id, i);
          }
        })
      })

      // place the nodes
      const height = nodeSep + nodeSize
      let begin = center[1] - height / 2;
      if (direction === 'vertical') {
        begin = center[0] - height / 2;
      }
      console.log(comboArr)
      comboArr.forEach((combo, index) => {
        // x轴计算
        if (index === 0) {
          partPos = center[0] - biSep / 2;
        } else {
          partPos = center[0] + (biSep / 2)
        }
        combo.partNodes.forEach(function (p1n, i) {
          p1n.x = partPos;
          p1n.y = begin + i * (nodeSep + nodeSize) + index * i * (nodeSep + nodeSize);
        });
      })

      // const height = nodeSep + nodeSize
      // let begin = center[1] - height / 2;
      // if (direction === 'vertical') {
      //   begin = center[0] - height / 2;
      // }
      // part1Nodes.forEach(function (p1n, i) {
      //   p1n.x = part1Pos;
      //   p1n.y = begin + i * (nodeSep + nodeSize);
      // });
      // part2Nodes.forEach(function (p2n, i) {
      //   p2n.x = part2Pos;
      //   p2n.y = begin + i * (nodeSep + nodeSize);
      // });

      // part3Nodes.forEach(function (p2n, i) {
      //   p2n.x = part3Pos;  //更改combo X方向
      //   p2n.y = begin + i * (nodeSep + nodeSize) + 200;  // 改更comboY方向
      // });

    },
  });
}

export {
  layout
}