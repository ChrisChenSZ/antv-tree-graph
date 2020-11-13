import G6 from '@antv/g6';
import insertCss from 'insert-css';
// 节点样式
const nodeStyle = {
  width: 180,
  height: 38,
};

insertCss(`
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
  #g6ContextMenuUl {
    position:relative;
    margin-top:30px;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid #e2e2e2;
  }
  #g6ContextMenu {
    position: absolute;
    list-style-type: none;
    left: -150px;
    font-size: 12px;
    color: #545454;
    background:rgba(0,0,0,0);
  }
  #g6ContextMenu li {
    width:206px;
    line-height:42px;
    font-size:14px;
    text-align:center;
    cursor: pointer;
    background:white;
    margin-left: 0px;
    overflow: hidden;
    padding:0 12px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    border-bottom:1px solid #D9D9D9;
  }
  #g6ContextMenu li:hover {
    color: #0486FE;
  }

  #g6ContextMenuUl:after, #g6ContextMenuUl:before {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  
  #g6ContextMenuUl:after {
    border-color: rgba(245, 245, 245, 0);
    border-bottom-color: white;
    border-width: 5px;
    margin-left: -5px;
  }
  #g6ContextMenuUl:before {
    border-color: rgba(10, 1, 4, 0);
    border-bottom-color:#D9D9D9;
    border-width: 6px;
    margin-left: -6px;
  }
  

`);

// 展开收缩图 - 号 icon
const COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
  return [
    ['M', x - r, y],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x - r + 4, y],
    ['L', x - r + 2 * r - 4, y],
  ];
};
// + 号 icon
const EXPAND_ICON = function EXPAND_ICON(x, y, r) {
  return [
    ['M', x - r, y],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x - r + 4, y],
    ['L', x - r + 2 * r - 4, y],
    ['M', x - r + r, y - r + 4],
    ['L', x, y + r - 4],
  ];
};

/**
 *文字超长加...
 *
 * @param {string}} str 要处理的文字
 * @param {number} n 截取多少长度
 * @returns {string} 返回处理后的字符串
 * 注意点：cavans 下英文和数字的长度竟然会不一样,目前没找到好的方法只能先按数字的长度算，在某种情况会致导显示数字和字母截的长度不一致
 */
function fittingString(str, n, fontSize) {
  if (!str) return '';
  var r = /[^\x00-\xff]/g;
  if (str.replace(r, 'mm').length <= n) {
    return str;
  }
  var m = Math.floor(n / 2);
  for (var i = m; i < str.length; i++) {
    if (str.substr(0, i).replace(r, 'mm').length >= n) {
      return str.substr(0, i) + '...';
    }
  }
  return str;
}

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
  /**
     *Creates an instance of TaskRelationshipDiagram.
     * @param {*} { data, nodeConfig = null }
     * example:
     *  {
     *   data: {
     *      id: 区分节点的唯一id,require
            level: 所在节点的层级,
            collapsed: 收缩, require
            dataType: 节点类型,
            name: 节点名称,
            data: 节点数据，
            fid: 父节点id
     *    },
     *   nodeConfig:function(node) {
     *    return {
     *        basicColor: '#E3E6E8',
              fontColor: 'white',
              borderColor: '#02A8F4',
              bgColor: '#02A8F4'}
     *  }
     * @memberof TaskRelationshipDiagram
     */
  constructor({ data, nodeConfig = null, container }) {
    // 存入data
    this.data = data;

    this.container = container;

    // 节点样式
    if (nodeConfig) this.nodeConfig = nodeConfig;

    // 初始化脑图
    this.graph = this.initGraph(data);
  }

  initGraph(data) {
    const SIMPLE_TREE_NODE = 'simple-tree-node';

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
    const graph = (this.graph = new G6.TreeGraph({
      //  renderer:'svg',
      container: this.container,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      // fitView: true,
      zoom: 1,
      nodeStateStyles: {
        highlight: {
          opacity: 1,
        },
        dark: {
          opacity: 0.2,
        },
      },
      modes: {
        default: [
          {
            type: 'collapse-expand',
            shouldBegin: function shouldBegin(e) {
              if (e.item._cfg.model.level === 3) return false;

              /* 点击 node 禁止展开收缩 */
              if (e.target.get('name') !== 'collapse-icon') {
                return false;
              }
              return true;
            },
            onChange: function onChange(item, collapsed) {
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
            animate: {
              callback: function callback() {
                graph.focusItem(selectedItem);
              },
            },
          },
          'drag-canvas',
          'zoom-canvas',
        ],
      },
      defaultNode: {
        type: SIMPLE_TREE_NODE,
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
      },
      defaultEdge: {
        type: 'tree-edge',
        style: {
          stroke: '#A3B1BF',
        },
      },
      layout: {
        type: 'mindmap',
        direction: 'H',
        getId: (d) => d.id,
        getWidth: () => 100,
        getVGap: () => 24,
        getHGap: () => 50,
        getSide: (node) => {
          console.log('node', node);
          return 'right';
        },
      },
      edgeStateStyles: {
        highlight: {
          stroke: '#999',
        },
      },
    }));

    /* 精简节点 */
    G6.registerNode(
      SIMPLE_TREE_NODE,
      {
        drawShape: (cfg, group) => {
          const config = this.getNodeConfig(cfg);

          const haveConextMenu =
            Array.isArray(cfg.data.conextMenu) &&
            cfg.data.conextMenu.length > 0;

          const container = nodeBasicMethod.createNodeBox(
            group,
            config,
            nodeStyle.width,
            nodeStyle.height,
            cfg
          );

          /* name */
          group.addShape('text', {
            attrs: {
              text: fittingString(
                cfg.name,
                haveConextMenu ? nodeStyle.width - 166 : nodeStyle.width - 164,
                14
              ),
              x: 10,
              y: 19,
              fontSize: 14,
              // fontWeight: 700,
              textAlign: 'left',
              // fontFamily: 'italic arial,sans-serif',
              textBaseline: 'middle',
              fill: config.fontColor,
              cursor: 'pointer',
            },
            name: 'name-text-shape',
          });

          const hasChildren = cfg.children && cfg.children.length > 0;
          if (hasChildren) {
            nodeBasicMethod.createNodeMarker(group, cfg.collapsed, 164, 19);
          }
          return container;
        },
        afterDraw: (cfg, group) => {
          nodeBasicMethod.afterDraw(cfg, group, this.graph);
        },
        setState: (name, value, item) => {
          nodeBasicMethod.setState(name, value, item, this.graph);
        },
      },
      'single-node'
    );

    /* 是否显示 sofarouter，通过透明度来控制 */
    G6.registerEdge(
      'tree-edge',
      {
        draw: function draw(cfg, group) {
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
              path,
              lineWidth: 1,
              stroke: '#02A8F4',
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
          /* 背景色 */
          const lineBG = group.get('children')[0]; // 顺序根据 draw 时确定
          /* 线条 */
          const line = group.get('children')[1];
          line.on('mouseenter', function () {
            lineBG.attr('opacity', '1');
            graph.get('canvas').draw();
          });
          line.on('mouseleave', function () {
            lineBG.attr('opacity', '0');
            graph.get('canvas').draw();
          });
        },
        setState: function setState(name, value, item) {
          const group = item.get('group');
          if (name === 'dark' && value) {
            group.attr('opacity', 0.2);
            graph.setAutoPaint(true);
            graph.get('canvas').draw();
          } else if (name === 'highlight' && value) {
            group.attr('opacity', 1);
            graph.setAutoPaint(true);
            graph.get('canvas').draw();
          }
        },
        update: null,
      },
      'cubic-horizontal'
    );

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
    // node点击事件
    this.graph.on('node:click', (evt) => {
      if (evt.target.get('name') !== 'ip-cp-icon') return;

      evt.preventDefault();
      evt.stopPropagation();

      this.conextMenuContainer.style.left = `${
        evt.canvasX - nodeStyle.width / 2
      }px`;

      this.conextMenuContainer.style.top = `${evt.canvasY}px`;

      this.conextMenuContainer.style.display = 'block';

      this.conextMenuContainerUl.innerHTML = '';

      const conextMenu = evt.item._cfg.model.data.conextMenu;

      Array.isArray(conextMenu) &&
        conextMenu.forEach((item, index) => {
          const li = document.createElement('li');
          li.style.minWidth = nodeStyle.width + 'px';
          li.style.height = nodeStyle.height + 'px';
          li.innerText = item.name;
          li.setAttribute('index', index);

          li.onclick = function () {
            const index = this.getAttribute('index');
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
    // console.log(document.getElementById('container'))
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
        const { CANVAS_WIDTH, CANVAS_HEIGHT } = this.getCanvasStyle();
        this.graph.changeSize(CANVAS_WIDTH, CANVAS_HEIGHT);
      }, 500);
    };
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
    this.graph.fitView();
    // this.graph.zoom(0.7)
  }
}
