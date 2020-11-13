export default class TaskRelationshipDiagram {
    data: object;
    container: string;
    nodeConfig: object;
    graph: any;
    conextMenuContainer: any;
    conextMenuContainerUl: any;
    getAttribute: any;
    /**
     *Creates an instance of TaskRelationshipDiagram.
     * @memberof TaskRelationshipDiagram
    */
    constructor({ data, nodeConfig, container }: {
        data: any;
        nodeConfig?: any;
        container: any;
    });
    initGraph({ data, layout }: {
        data: any;
        layout?: {};
    }): any;
    conextMenuClick(callBack: any): void;
    /**
     * node节点样式设置
     *
     * @param {object} node
     * @returns {object}
     * @memberof TaskRelationshipDiagram
     */
    getNodeConfig(node: any): any;
    /**
     * 获取画布宽高尺寸
     *
     * @returns object
     * @memberof TaskRelationshipDiagram
     */
    getCanvasStyle(): {
        CANVAS_HEIGHT: number;
        CANVAS_WIDTH: number;
    };
    /**
     * 画布自动适应
     *
     * @memberof TaskRelationshipDiagram
     */
    autoFix(): void;
    /**
     *
     * @param data
     */
    changeCanvasSize(): void;
    /**
     *渲染脑图
     *
     * @param {*} data
     * @memberof TaskRelationshipDiagram
     */
    render(data: any): void;
}
