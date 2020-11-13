import G6 from '@antv/g6';
import { COLLAPSE_ICON, EXPAND_ICON } from './icon/icon.js'
import { get } from 'lodash'
import { tableNode } from './node/tableNode'
import { flowLine, defaultEdgeStyle } from './edge/edge'

interface G6Type { }

G6 as G6Type

/**
 * 1.边位置对应节点位置可控（done）
 * 2.支持多条边不同位置（done）
 * 3.支持多分类，最后到数据(done)
 * 4.节点样式、图标(50%)
 * 5.切换节点更改图数据
 * 6.边弧线(done)
 * 7.每个节点之间的动态间隔(done)
 * 8.支持出口有箭头
 * 
 * 
 * 基础类 
 *  自动适应画布
 *  可以接受外部自定义注册节点
 *  可以接受外部自定义注册边
 *  抛出节点点击事件
 */

const _window = window as any
_window.TREE_GRAPH = require('../package.json').version

// 节点样式
const nodeStyle = {
  width: 180,
  height: 38,
};



/**
 * 查看树的父节点和祖节点
 *
 * @param {*} node 节点item
 * @param {*} tree 节点树
 * @param {*} [parentNodes=[]] 存放找到的父类节点
 * @param {number} [index=0]
 * @returns {array} parentNodes
 */
function findAllParent(node, tree, parentNodes = [], index = 0) {
  const model = node._cfg.model;
  if (!model || model.fid === undefined) {
    return;
  }
  findParent(node, parentNodes, tree);
  let parentNode = parentNodes[index];
  findAllParent(parentNode, tree, parentNodes, ++index);
  return parentNodes;
}

function findParent(node, parentNodes, tree) {
  for (let i = 0; i < tree.length; i++) {
    let item = tree[i];
    const itemId = item._cfg.model.id;
    const nodeFid = node._cfg.model.fid;
    if (itemId === nodeFid) {
      parentNodes.push(item);
      return;
    }
    if (item.children && item.children.length > 0) {
      findParent(node, parentNodes, item.children);
    }
  }
}

/* 节点方法 */
const nodeBasicMethod = {
  createNodeBox: function createNodeBox(group, config, width, height, cfg) {
    const haveConextMenu =
      Array.isArray(cfg.data.conextMenu) && cfg.data.conextMenu.length > 0;
    const { level } = cfg;
    /* 最外面的大矩形 */
    const container = group.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        // anchorPoints: [[0, 1], [1, 1]],
        width: level === 0 ? width - 20 : width,
        height,
      },
      name: 'container-rect-shape',
    });
    /* 矩形 */
    group.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width: width - 20,
        height,
        fill: config.bgColor,
        stroke: config.borderColor,
        radius: 5,
        ...config,
      },
      name: 'rect-shape',
    });
    if (haveConextMenu) {
      group.addShape('image', {
        attrs: {
          x: nodeStyle.width - 45,
          y: 10,
          height: 22,
          width: 20,
          img: config.icon,
          cursor: 'pointer',
          opacity: 1,
        },
        name: 'ip-cp-icon',
      });
    }

    return container;
  },
  /* 生成树上的 marker */
  createNodeMarker: function createNodeMarker(group, collapsed, x, y) {
    if (group.cfg.item._cfg.model.level === 0) {
      return;
    }
    group.addShape('circle', {
      attrs: {
        x: x + 10,
        y,
        r: 13,
        fill: 'rgba(47, 84, 235, 0.05)',
        opacity: 0,
        zIndex: -2,
      },
      name: 'collapse-icon-bg',
    });
    group.addShape('marker', {
      attrs: {
        x: x + 10,
        y,
        r: 7,
        symbol: collapsed ? EXPAND_ICON : COLLAPSE_ICON,
        stroke: '#02A8F4',
        fill: 'rgba(0,0,0,0)',
        lineWidth: 1,
        cursor: 'pointer',
      },
      name: 'collapse-icon',
    });
  },
  afterDraw: function afterDraw(cfg, group, graph) {
    /* 操作 marker 的背景色显示隐藏 +-号背景 */
    const icon = group.find(
      (element) => element.get('name') === 'collapse-icon'
    );
    if (icon) {
      const bg = group.find(
        (element) => element.get('name') === 'collapse-icon-bg'
      );
      icon.on('mouseenter', function () {
        bg.attr('opacity', 1);
        graph.get('canvas').draw();
      });
      icon.on('mouseleave', function () {
        bg.attr('opacity', 0);
        graph.get('canvas').draw();
      });
    }
  },
  setState: function setState(name, value, item, graph) {
    if (name === 'dark') {
      const group = item.get('group');
      group.attr('opacity', 0.2);
      graph.setAutoPaint(true);
    } else if (name === 'highlight') {
      const group = item.get('group');
      group.attr('opacity', 1);
      graph.setAutoPaint(true);
    }
  },
};

export default class TaskRelationshipDiagram {

  data: object
  container: string
  nodeConfig: object
  graph: any
  conextMenuContainer: any
  conextMenuContainerUl: any
  getAttribute: any
  /**
   *Creates an instance of TaskRelationshipDiagram.
   * @memberof TaskRelationshipDiagram
  */
  constructor({ data, nodeConfig = null, container }) {
    // 引入定制线
    flowLine(nodeConfig)
    // 引入定制节点
    tableNode(nodeConfig)



    // 存入data
    this.data = data;

    this.container = container;

    // 节点样式
    if (nodeConfig) this.nodeConfig = nodeConfig;

    // 初始化脑图
    this.graph = this.initGraph(arguments[0]);
  }

  initGraph({ data, layout = {} }) {
    const { CANVAS_WIDTH, CANVAS_HEIGHT } = this.getCanvasStyle();

    // 创建右键菜单
    const conextMenuContainer = (this.conextMenuContainer = document.createElement(
      'div'
    ));
    const conextMenuContainerUl = (this.conextMenuContainerUl = document.createElement(
      'ul'
    ));
    conextMenuContainer.id = 'g6ContextMenu';
    conextMenuContainerUl.id = 'g6ContextMenuUl';
    conextMenuContainer.appendChild(conextMenuContainerUl);
    document.getElementById(this.container).appendChild(conextMenuContainer);

    let selectedItem;
    let graph: any
    graph = (this.graph = new G6.TreeGraph({
      // renderer: 'svg',
      container: this.container,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      // fitView: true,
      // zoom: 1,
      nodeStateStyles: {
        highlight: {
          opacity: 1,
        },
        dark: {
          opacity: 0.2,
        },
      },
      modes: {
        // 设置初始展开收缩节点
        default: [
          {
            type: 'collapse-expand',
            shouldBegin: function shouldBegin(e) {
              // if (e.item._cfg.model.level === 3) return false;

              /* 点击 node 禁止展开收缩 */
              if (e.target.get('name') !== 'collapse-icon') {
                return false;
              }
              return true;
            },
            onChange: function onChange(item, collapsed) {
              console.log('item', item, collapsed)
              // 赋值 collapsed后设置展开收缩箭头样式
              selectedItem = item;
              const icon = item
                .get('group')
                .find((element) => element.get('name') === 'collapse-icon');
              if (collapsed) {
                icon.attr('symbol', EXPAND_ICON);
              } else {
                icon.attr('symbol', COLLAPSE_ICON);
              }
            },
          },
          'drag-canvas',
          'zoom-canvas',
        ],
      },
      defaultNode: {
        type: 'table-node',
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
      },
      defaultEdge: {
        type: 'flow-line',
        style: defaultEdgeStyle,
      },
      layout: {
        type: 'compactBox',
        direction: 'LR',
        getId: (d) => d.id,
        getWidth: () => 150,
        getVGap: (data, item) => {
          console.log('data', data, item)
          const nodesData = get(data, 'data.node', [])

          return nodesData.length > 0 ? 30 * nodesData.length / 2 : 20
        },
        getHGap: () => 50,
        ...layout
      },
      edgeStateStyles: {
        highlight: {
          stroke: '#999',
        },
      },
    }));



    // 清除交互效果
    function clearAllStats() {
      graph.setAutoPaint(false);
      graph.getNodes().forEach(function (node) {
        graph.setItemState(node, 'highlight', true);
      });
      graph.getEdges().forEach(function (edge) {
        graph.setItemState(edge, 'highlight', true);
      });
      graph.paint();
      graph.setAutoPaint(true);
    }

    // 高亮节点效果
    function hoverNodeHighlight(evt) {
      const item = evt.item;
      graph.setAutoPaint(false);
      const allNodes = graph.getNodes();
      allNodes.forEach(function (node) {
        console.log('V0.0.2');
        graph.clearItemStates(node, 'dark');
        graph.clearItemStates(node, 'highlight');

        graph.setItemState(node, 'dark', true);
      });
      graph.setItemState(item, 'dark', false);
      graph.setItemState(item, 'highlight', true);

      const parentNodes = findAllParent(item, allNodes);

      // 当前节点线高亮 其他节点线变透明
      graph.getEdges().forEach(function (edge) {
        graph.clearItemStates(edge, 'highlight');
        graph.clearItemStates(edge, 'dark');
        if (edge.getTarget() === item) {
          graph.setItemState(edge, 'highlight', true);
        } else {
          graph.setItemState(edge, 'dark', true);
        }
      });

      // 父节点和祖节点高亮
      Array.isArray(parentNodes) &&
        parentNodes.forEach((parentNodeitem) => {
          graph.setItemState(parentNodeitem, 'highlight', true);
          // 相邻节点线高亮 id为0的第一个节点相邻线不处理
          if (parentNodeitem._cfg.model.id === '0') return;
          const edges = parentNodeitem.getEdges();
          edges.forEach((edge) => {
            if (edge.getTarget()._cfg.model.fid === item._cfg.model.fid) return;
            graph.setItemState(edge, 'highlight', true);
          });
        });
      graph.paint();
      graph.setAutoPaint(true);
    }

    let timer = null;
    // node hover 事件
    graph.on('node:mouseenter', (evt) => {
      timer = setTimeout(() => {
        hoverNodeHighlight(evt);
      }, 150);
    });

    graph.on('node:mouseleave', (evt) => {
      clearTimeout(timer);
      clearAllStats();
      conextMenuContainer.style.display = 'none';
    });

    graph.get('canvas').set('localRefresh', false);

    this.render(data);

    this.autoFix();

    return graph;
  }

  conextMenuClick(callBack) {
    const self = this as any;
    // node点击事件
    self.graph.on('node:click', (evt) => {
      console.log('evt', evt)
      if (evt.target.get('name') !== 'ip-cp-icon') return;

      evt.preventDefault();
      evt.stopPropagation();

      self.conextMenuContainer.style.left = `${
        evt.canvasX - nodeStyle.width / 2
        }px`;

      self.conextMenuContainer.style.top = `${evt.canvasY}px`;
      self.conextMenuContainer.style.display = 'block';
      self.conextMenuContainerUl.innerHTML = '';
      const conextMenu = evt.item._cfg.model.data.conextMenu;

      Array.isArray(conextMenu) &&
        conextMenu.forEach((item, index: any) => {
          const li = document.createElement('li');
          li.style.minWidth = nodeStyle.width + 'px';
          li.style.height = nodeStyle.height + 'px';
          li.innerText = item.name;
          li.setAttribute('index', index);

          li.onclick = function () {
            const index = self.getAttribute('index');
            callBack(conextMenu[index]);
          };
          this.conextMenuContainerUl.appendChild(li);
        });
    });
  }

  /**
   * node节点样式设置
   *
   * @param {object} node
   * @returns {object}
   * @memberof TaskRelationshipDiagram
   */
  getNodeConfig(node) {
    if (typeof this.nodeConfig === 'function') {
      return this.nodeConfig(node);
    }

    // 默认样式
    return {
      basicColor: '#2F54EB',
      fontColor: '#333333',
      borderColor: '#02A8F4',
      bgColor: 'white',
    };
  }

  /**
   * 获取画布宽高尺寸
   *
   * @returns object
   * @memberof TaskRelationshipDiagram
   */
  getCanvasStyle() {
    return {
      CANVAS_HEIGHT: document.getElementById(this.container).offsetHeight,
      CANVAS_WIDTH: document.getElementById(this.container).offsetWidth,
    };
  }

  /**
   * 画布自动适应
   *
   * @memberof TaskRelationshipDiagram
   */
  autoFix() {
    let timer;
    window.onresize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.changeCanvasSize()
      }, 500);
    };
  }

  /**
   * 
   * @param data 
   */
  changeCanvasSize() {
    const { CANVAS_WIDTH, CANVAS_HEIGHT } = this.getCanvasStyle();
    this.graph.changeSize(CANVAS_WIDTH, CANVAS_HEIGHT);
  }
  /**
   *渲染脑图
   *
   * @param {*} data
   * @memberof TaskRelationshipDiagram
   */
  render(data) {
    this.graph.data(data);
    this.graph.render();
    // this.graph.fitView();
    // 平移中间
    this.graph.fitCenter();
    // this.graph.zoom(0.7)
  }
}
