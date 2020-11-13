import insertCss from 'insert-css';


// insertCss(`
//   .g6-tooltip {
//     border: 1px solid #e2e2e2;
//     border-radius: 4px;
//     font-size: 12px;
//     color: #545454;
//     background-color: rgba(255, 255, 255, 0.9);
//     padding: 10px 8px;
//     box-shadow: rgb(174, 174, 174) 0px 0px 10px;
//   }
//   #g6ContextMenuUl {
//     position:relative;
//     margin-top:30px;
//     background-color: rgba(255, 255, 255, 1);
//     border: 1px solid #e2e2e2;
//   }
//   #g6ContextMenu {
//     position: absolute;
//     list-style-type: none;
//     left: -150px;
//     font-size: 12px;
//     color: #545454;
//     background:rgba(0,0,0,0);
//   }
//   #g6ContextMenu li {
//     width:206px;
//     line-height:42px;
//     font-size:14px;
//     text-align:center;
//     cursor: pointer;
//     background:white;
//     margin-left: 0px;
//     overflow: hidden;
//     padding:0 12px;
//     display: -webkit-box;
//     -webkit-line-clamp: 1;
//     -webkit-box-orient: vertical;
//     border-bottom:1px solid #D9D9D9;
//   }
//   #g6ContextMenu li:hover {
//     color: #0486FE;
//   }

//   #g6ContextMenuUl:after, #g6ContextMenuUl:before {
//     bottom: 100%;
//     left: 50%;
//     border: solid transparent;
//     content: " ";
//     height: 0;
//     width: 0;
//     position: absolute;
//     pointer-events: none;
//   }

//   #g6ContextMenuUl:after {
//     border-color: rgba(245, 245, 245, 0);
//     border-bottom-color: white;
//     border-width: 5px;
//     margin-left: -5px;
//   }
//   #g6ContextMenuUl:before {
//     border-color: rgba(10, 1, 4, 0);
//     border-bottom-color:#D9D9D9;
//     border-width: 6px;
//     margin-left: -6px;
//   }


// `);

// 展开收缩图 - 号 icon
const COLLAPSE_ICON = function COLLAPSE_ICON (x, y, r) {
  return [
    ['M', x - r, y],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x - r + 4, y],
    ['L', x - r + 2 * r - 4, y],
  ];
};
// + 号 icon
const EXPAND_ICON = function EXPAND_ICON (x, y, r) {
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

export { COLLAPSE_ICON, EXPAND_ICON }