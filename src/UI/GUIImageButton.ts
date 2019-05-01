import { GUIButton, GUIButtonOptions, GUIButtonComputedProperties } from "./GUIButtton";
import { Point } from "./GUIComponent";

export interface GUIImageButtonOptions extends GUIButtonOptions {
    fit_img: boolean,
    img_pos: 'center' | 'bottom_left',
    on_hover_img?: CanvasImageSource,
    on_click_img?: CanvasImageSource
}

export interface GUIImageButtonComputedProperties extends GUIButtonComputedProperties {
    fit_img: boolean,
    img_pos: 'center' | 'bottom_left',
    on_hover_img?: CanvasImageSource,
    on_click_img?: CanvasImageSource
}

export const defaultImageButtonOptions = {
    fit_img: true,
    img_pos: 'center'
};

export class GUIImageButton<
    P extends GUIImageButtonOptions,
    C extends GUIImageButtonComputedProperties

    > extends GUIButton<P, C> {

    private img: CanvasImageSource;
    private drawn_img: CanvasImageSource;

    constructor(
        img: CanvasImageSource,
        optns?: Partial<P>
    ) {
        super({
            ...defaultImageButtonOptions,
            ...optns
        });

        this.img = img;
        this.drawn_img = img;
    }

    public render(ctx: CanvasRenderingContext2D): void {

        if (!this.computed_props.visible) return;

        super.render(ctx);

        let img_pos: Point;

        if (this.computedProperties.img_pos === 'center') {
            img_pos = { x: this.x - this.width / 2, y: this.y - this.height / 2 };
        } else {
            img_pos = { x: this.x, y: this.y };
        }

        if (this.computedProperties.fit_img) {
            ctx.drawImage(this.drawn_img, img_pos.x, img_pos.y, this.width, this.height);
        } else {
            ctx.drawImage(this.drawn_img, img_pos.x, img_pos.y);
        }

        this.needs_rerender = false;
    }

    protected handleMouseMove(pos: Point): void {
        super.handleMouseMove(pos);
        if (this.hovered && this.computedProperties.on_hover_img !== undefined) {
            this.drawn_img = this.computedProperties.on_hover_img;
            this.needs_rerender = true;
        }
    }

    protected handleMouseExit(pos: Point): void {
        super.handleMouseExit(pos);
        this.drawn_img = this.img;
        this.needs_rerender = true;
    }

    protected handleMouseDown(pos: Point): void {
        super.handleMouseDown(pos);
        if (this.computedProperties.on_click_img !== undefined) {
            this.drawn_img = this.computedProperties.on_click_img;
            this.needs_rerender = true;
        }
    }

    protected handleMouseUp(pos: Point): void {
        super.handleMouseUp(pos);
        if (this.computedProperties.on_click_img !== undefined) {
            this.drawn_img = this.img;
            this.needs_rerender = true;
        }
    }
}