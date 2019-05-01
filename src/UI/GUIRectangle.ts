import { GUIComponent, GUIComponentProperties, GUIComponentComputedProperties } from "./GUIComponent";


export class GUIRectangle<
    P extends GUIComponentProperties,
    C extends GUIComponentComputedProperties
    >
    extends GUIComponent<P, C> {

    constructor(optns?: Partial<P>) {
        super(optns);
    }

    public render(ctx: CanvasRenderingContext2D): void {

        if (!this.computed_props.visible) return;

        ctx.beginPath();
        // this.bounding_rect = undefined;
        const rect = this.boundingRect;
        ctx.fillStyle = this.computed_props.bg_color;
        ctx.fillRect(rect.min_x, rect.min_y, this.width, this.height);

        if (this.computed_props.border) {
            ctx.strokeStyle = this.computed_props.border_color;
            ctx.lineWidth = this.computedProperties.border_size;
            ctx.rect(rect.min_x, rect.min_y, this.width, this.height);
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        this.needs_rerender = false;
    }

    protected computeBoundingRect(): void {

        const half_w = this.width / 2;
        const half_h = this.height / 2;

        const x = this.x;
        const y = this.y;

        this.bounding_rect = {
            min_x: x - half_w,
            min_y: y - half_h,
            max_x: x + half_w,
            max_y: y + half_h
        };
    }

    public get width(): number {
        return this.computedProperties.width as number;
    }

    public get height(): number {
        return this.computedProperties.height as number;
    }

}