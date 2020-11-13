import G6 from '@antv/g6'
import isNumber from '@antv/util/lib/is-number';

const defaultEdgeStyle = {
  stroke: 'rgb(51, 153, 255)',
  endArrow: {
    path: 'M 0,0 L 12, 6 L 9,0 L 12, -6 Z',
    fill: 'rgb(51, 153, 255)',
    d: 0,
  },
};

const customCubicHorizontal = () => {
  G6.registerEdge(
    'custom-cubic-horizontal',
    {
      curvePosition: [1 / 2, 1 / 2],
      getControlPoints(cfg) {
        const { startPoint, endPoint } = cfg;
        if (cfg.curvePosition !== undefined) this.curvePosition = cfg.curvePosition;
        if (isNumber(this.curvePosition))
          this.curvePosition = [this.curvePosition, 1 - this.curvePosition];
        const innerPoint1 = {
          x: (endPoint.x - startPoint.x) * this.curvePosition[0] + startPoint.x,
          y: startPoint.y,
        };
        const innerPoint2 = {
          x: (endPoint.x - startPoint.x) * this.curvePosition[1] + startPoint.x,
          y: endPoint.y,
        };
        const controlPoints = [innerPoint1, innerPoint2];
        return controlPoints;
      },
      // draw (cfg, group) {
      //   const startPoint = cfg.startPoint;
      //   const endPoint = cfg.endPoint;
      //   // const stroke = (cfg.style && cfg.style.stroke) || this.options.style.stroke;
      //   const shape = group.addShape('path', {
      //     attrs: {
      //       stroke: 'red',
      //       path: [
      //         ['M', startPoint.x, startPoint.y],
      //         ['L', endPoint.x, endPoint.y],
      //       ],
      //     },
      //     name: 'path-shape',
      //   });


      //   group.addShape('text', {
      //     attrs: {
      //       text: '8888888',
      //       fill: '#595959',
      //       textAlign: 'start',
      //       textBaseline: 'middle',
      //       x: startPoint.x,
      //       y: startPoint.y - 10,
      //     },
      //     name: 'left-text-shape',
      //   });

      //   // the right label
      //   group.addShape('text', {
      //     attrs: {
      //       text: '101011010101',
      //       fill: '#595959',
      //       textAlign: 'end',
      //       textBaseline: 'middle',
      //       x: endPoint.x,
      //       y: endPoint.y - 10,
      //     },
      //     name: 'right-text-shape',
      //   });

      //   // return the keyShape
      //   return shape;
      // },
    },
    'cubic',
  );
}


const flowLine = (nodeConfig) => {

  G6.registerEdge('flow-line', {
    draw(cfg, group) {
      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;

      // 转角弧度
      const corner = 10
      // 转角是在上方还是下方 20 上 -20 下 0 平
      const cornerDirection = function () {
        if (startPoint.y === endPoint.y) return 0
        return startPoint.y > endPoint.y ? corner : -corner
      }()


      const { style } = cfg;

      // 折线位置
      const cornerPosition = (startPoint.x + endPoint.x) / 2

      const shape = group.addShape('path', {
        attrs: {
          lineWidth: 2,
          stroke: style.stroke,
          endArrow: style.endArrow,
          // startArrow: style.endArrow,
          path: [
            // 出发点
            ['M', startPoint.x, startPoint.y],
            //折点 转弯完的竖线起点
            ['L', cornerPosition - corner, startPoint.y],
            // 二次贝塞尔曲线 直角点x,y  结束点x,y 
            ['Q', cornerPosition, startPoint.y, cornerPosition, startPoint.y - cornerDirection],
            // 折点 转弯完的竖线结束点
            ['L', cornerPosition, startPoint.y - cornerDirection],
            // 折点 转弯前的竖线起点
            ['L', cornerPosition, endPoint.y + cornerDirection],
            // 二次贝塞尔曲线 直角点x,y  结束点x,y 
            ['Q', cornerPosition, endPoint.y, cornerPosition + corner, endPoint.y],
            // 折点 转弯完的竖线结束点
            ['L', cornerPosition + corner, endPoint.y],
            //结束点
            ['L', endPoint.x, endPoint.y],
          ],
        },
      });

      return shape;
    },
  });
}


const treeEdge = () => {
  /* 是否显示 sofarouter，通过透明度来控制 */
  G6.registerEdge(
    'tree-edge',
    {
      draw: function draw(cfg: any, group) {
        const targetNode = cfg.targetNode.getModel();
        const edgeError = !!targetNode.edgeError;

        const { startPoint, endPoint } = cfg;

        const controlPoints = this.getControlPoints(cfg);
        let points = [startPoint]; // 添加起始点
        // 添加控制点
        if (controlPoints) {
          points = points.concat(controlPoints);
        }
        // 添加结束点
        points.push(endPoint);
        const path = this.getPath(points);
        const { style } = cfg
        group.addShape('path', {
          attrs: {
            path,

            lineWidth: 12,
            stroke: edgeError
              ? 'rgba(245,34,45,0.05)'
              : 'rgba(47,84,235,0.05)',
            opacity: 0,
            zIndex: 0,
          },
          name: 'line-bg',
        });
        const keyShape = group.addShape('path', {
          attrs: {
            endArrow: style.endArrow,
            path,
            lineWidth: 1,
            stroke: '#FAFAFA;',
            zIndex: 1,
            lineAppendWidth: 12,
          },
          edgeError: !!edgeError,
          name: 'path-shape',
        });

        return keyShape;
      },

      /* 操作 线 的背景色显示隐藏 */
      afterDraw: function afterDraw(cfg, group) {
        // /* 背景色 */
        // const lineBG = group.get('children')[0]; // 顺序根据 draw 时确定
        // /* 线条 */
        // const line = group.get('children')[1];
        // line.on('mouseenter', function () {
        //   lineBG.attr('opacity', '1');
        //   graph.get('canvas').draw();
        // });
        // line.on('mouseleave', function () {
        //   lineBG.attr('opacity', '0');
        //   graph.get('canvas').draw();
        // });
      },
      setState: function setState(name, value, item) {
        // const group = item.get('group');
        // if (name === 'dark' && value) {
        //   group.attr('opacity', 0.2);
        //   graph.setAutoPaint(true);
        //   graph.get('canvas').draw();
        // } else if (name === 'highlight' && value) {
        //   group.attr('opacity', 1);
        //   graph.setAutoPaint(true);
        //   graph.get('canvas').draw();
        // }
      },
      update: null,
    },
    'cubic-horizontal'
  );
}
export { customCubicHorizontal, flowLine, defaultEdgeStyle, treeEdge }

