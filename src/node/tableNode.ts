import G6 from '@antv/g6';
import { get } from 'lodash'
import { fittingString } from '../utils'
import { COLLAPSE_ICON, EXPAND_ICON } from '../icon/icon.js'


const tableNode = (nodeConfig) => {
  G6.registerNode('table-node', {
    draw: function drawShape(cfg, group) {
      console.log('节点数据', cfg)
      const r = 5;
      const color = '#0486FE';
      const iconColor = '#ABD6FF'
      const { x, y } = cfg
      const w = 160;

      const nodeData = get(cfg, 'data.node', [])
      const tableItemHeight = 38
      const h = tableItemHeight * (nodeData.length || 1);
      // 列表单元格盒子
      const shape = group.addShape('rect', {
        attrs: {
          x: -w / 2,
          y: -h / 2,
          width: w, //200,
          height: h, // 60
          stroke: color,
          fill: color
        },
        name: 'main-box',
        draggable: true,
      });
      const colors = [
        { bg: color, font: 'white' },
        { bg: 'white', font: color },
        { bg: 'white', font: color },

      ]

      // 获取节点对应元素的颜色
      function getColorAttr(index, attr) {
        return index + 1 === nodeData.length
          ? colors[2][attr]
          : index ? colors[1][attr] : colors[0][attr]
      }

      /**
       * 节点里每个单元格样式
       * 每个单元格根据表名/类名/数据区分颜色
       * */
      nodeData.forEach((item, index) => {
        // console.log(index)
        group.addShape('rect', {
          attrs: {
            lineWidth: 1,
            x: -w / 2,
            y: -h / 2 + tableItemHeight * index,
            width: w, //200,
            height: tableItemHeight, // 60
            fill: getColorAttr(index, 'bg'),
            stroke: color,
            // 定义圆角。支持整数或数组形式，[0, 0, r, r]分别对应左上、右上、右下、左下角的半径：
            // radius: index + 1 === nodeData.length ? [0, 0, r, r] : 0,

          },
          name: 'title-box',
          draggable: true,
        });

        if (nodeData.length - 1 === index) {
          group.addShape('rect', {
            attrs: {
              lineWidth: 0.1,
              x: w / 2 - 16,
              y: -h / 2 + tableItemHeight * index,
              width: 16, //200,
              height: tableItemHeight, // 60
              fill: iconColor
            },
            name: 'more',
            draggable: true,
          });

          group.addShape('image', {
            attrs: {
              x: w / 2 - 16,
              y: -h / 2 + tableItemHeight * index + 14,
              width: 16, //200,
              height: 16, // 60
              img: nodeConfig.icon
            },
            // must be assigned in G6 3.3 and later versions. it can be any value you want
            name: 'image-shape'
          });
        }

        // 列表序号
        group.addShape('text', {
          attrs: {
            x: -w / 2 + (index ? 10 : 80),
            y: -h / 2 + 25 + tableItemHeight * index,
            lineHeight: 20,
            textAlign: index ? 'start' : 'center',
            text: fittingString(item, nodeData.length - 1 === index ? 18 : 22),
            fill: getColorAttr(index, 'font')
          },
          name: 'title',
        });
      })

      //节点初始化加收缩节点icon 
      console.log('cfg', cfg)
      if (cfg.children) {
        group.addShape('marker', {
          attrs: {
            x: w / 2,
            y: 0,
            r: 6,
            cursor: 'pointer',
            symbol: cfg.collapsed ? EXPAND_ICON : COLLAPSE_ICON,
            stroke: '#666',
            lineWidth: 1,
            fill: '#fff',
          },
          name: 'collapse-icon',
        });
      }
      return shape;
    },
    setState(name, value, item) {
      if (name === 'collapsed') {
        const marker = item.get('group').find((ele) => ele.get('name') === 'collapse-icon');
        const icon = value ? G6.Marker.expand : G6.Marker.collapse;
        marker.attr('symbol', icon);
      }
    },
  });
}


export { tableNode }