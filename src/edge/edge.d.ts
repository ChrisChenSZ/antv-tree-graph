declare const defaultEdgeStyle: {
    stroke: string;
    endArrow: {
        path: string;
        fill: string;
        d: number;
    };
};
declare const customCubicHorizontal: () => void;
declare const flowLine: (nodeConfig: any) => void;
declare const treeEdge: () => void;
export { customCubicHorizontal, flowLine, defaultEdgeStyle, treeEdge };
