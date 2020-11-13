import G6 from '@antv/g6'

const registerCombo = () => {

  G6.registerCombo(
    'cRect',
    {
      drawShape: function drawShape (cfg, group) {
        const self = this;
        // Get the padding from the configuration
        cfg.padding = cfg.padding || [50, 0, 0, 0];
        // Get the shape's style, where the style.width and style.height correspond to the width and height in the figure of Illustration of Built-in Rect Combo
        const style = self.getShapeStyle(cfg);
        // Add a rect shape as the keyShape which is the same as the extended rect Combo
        const rect = group.addShape('rect', {
          attrs: {
            ...style,
            x: -style.width / 2 - (cfg.padding[3] - cfg.padding[1]) / 2,
            y: -style.height / 2 - (cfg.padding[0] - cfg.padding[2]) / 2,
            width: style.width,
            height: style.height,
            stroke: '#666',
            lineWidth: 1,
            fill: '#5B8FF9',
          },
          draggable: true,
          name: 'combo-keyShape',
        });
        return rect;
      },
      // Define the updating logic of the right circle
      afterUpdate: function afterUpdate (cfg, combo) {
        const group = combo.get('group');
        // Find the circle shape in the graphics group of the Combo by name
        const marker = group.find((ele) => ele.get('name') === 'combo-marker-shape');
        // Update the position of the right circle
        // marker.attr({
        //   // cfg.style.width and cfg.style.heigth correspond to the innerWidth and innerHeight in the figure of Illustration of Built-in Rect Combo
        //   x: cfg.style.width / 2 + cfg.padding[1],
        //   y: (cfg.padding[2] - cfg.padding[0]) / 2,
        //   // The property 'collapsed' in the combo data represents the collapsing state of the Combo
        //   // Update the symbol according to 'collapsed'
        //   symbol: cfg.collapsed ? expandIcon : collapseIcon,
        // });
      },
    },
    'rect',
  );
}
export { registerCombo }