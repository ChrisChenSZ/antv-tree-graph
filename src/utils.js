/**
 * 判断数组是否为空
 *
 * @export
 * @param {array} v
 * @returns boolean
 */
export function isArrayEmpty (v) {
  return Array.isArray(v) && v.length > 0;
}

/**
 *文字超长加...
 *
 * @param {string}} str 要处理的文字
 * @param {number} n 截取多少长度
 * @returns {string} 返回处理后的字符串
 * 注意点：cavans 下英文和数字的长度竟然会不一样,目前没找到好的方法只能先按数字的长度算，在某种情况会致导显示数字和字母截的长度不一致
 */
export function fittingString (str, n) {
  if (!str) return ''
  var r = /[^\x00-\xff]/g
  if (str.replace(r, 'mm').length <= n) {
    return str
  }
  var m = Math.floor(n / 2)
  for (var i = m; i < str.length; i++) {
    if (str.substr(0, i).replace(r, 'mm').length >= n) {
      return str.substr(0, i) + `...`
    }
  }
  return str
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
export function findAllParent (node, tree, parentNodes = [], index = 0) {
  const model = node._cfg.model;
  if (!model || model.fid === undefined) {
    return;
  }
  findParent(node, parentNodes, tree);
  let parentNode = parentNodes[index];
  findAllParent(parentNode, tree, parentNodes, ++index);
  return parentNodes;
}

function findParent (node, parentNodes, tree) {
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
