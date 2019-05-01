import { Vec2 } from "three";
import { EventHandler } from "../Utils/EventEmitter";
import { deepMerge } from "../Utils/Utils";
import { GUIComponent, GUIComponentProperties, Point } from "./GUIComponent";
import { defaultGridLayoutOptions, GUIGridLayout, GUIGridLayoutOptions, GUIGridLayoutComputerProperties } from "./GUIGridLayout";
import { GUIImageButton } from "./GUIImageButton";
import { dark_theme } from "./GUIProperties";
import { defaultTextOptions, GUITextOptions } from "./GUITextBox";
import { ImageStore } from "./ImageStore";

export interface GUIModalWindowOptions extends GUIGridLayoutOptions {
    title: string,
    text_options: Partial<GUITextOptions>,
    header_height: number,
    modal: boolean,
    header_color: string
}

export interface GUIModalWindowComputedProperties extends GUIGridLayoutComputerProperties {
    title: string,
    text_options: Partial<GUITextOptions>,
    header_height: number,
    modal: boolean,
    header_color: string
}

export const defaultModalWindowOptions: GUIModalWindowOptions = {
    title: 'Modal Window',
    visible: false,
    header_height: 10,
    header_color: dark_theme ? 'white' : 'black',
    text_options: defaultTextOptions,
    modal: true,
    border: TextTrackCue,
    ...defaultGridLayoutOptions
};

export class GUIModalWindow<
    P extends GUIModalWindowOptions = GUIModalWindowOptions,
    C extends GUIModalWindowComputedProperties = GUIModalWindowComputedProperties
    > extends GUIGridLayout<P, C> {

    protected last_pos: Vec2;
    protected over_header = false;
    protected moving = false;
    protected just_closed = false;

    constructor(options?: Partial<P>) {
        super(deepMerge(
            {},
            defaultModalWindowOptions,
            options
        ) as P);

        this.addCloseButton();
    }

    protected async addCloseButton() {

        const images = ImageStore.getCloseButton({
            bg_color: this.computedProperties.header_color,
            text_color: this.computedProperties.text_options.text_color
        });

        const close_btn = new GUIImageButton(
            await images.idle,
            {
                border: false,
                hover_color: 'transparent',
                click_color: 'transparent',
                on_hover_img: await images.hovered,
                on_click_img: await images.cliked,
                width: 22,
                height: 22,
                left: 6,
                top: 6,
                position: 'absolute'
            }
        );

        this.add(close_btn);

        close_btn.onClick(() => {
            this.close();
        });
    }

    public add(...children: GUIComponent[]): void {

        for (const child of children) {
            child.setOption('visible', this.properties.visible);
            // child.setOption(
            //     'top',
            //     (child.computedProperties.top as number) + this.computedProperties.header_height
            // );
        }

        super.add(...children);
    }

    public open(): void {
        this.setOption('visible', true);
        this.needs_rerender = true;
        this.emit('open');
    }

    public onOpen(handler: EventHandler): void {
        this.on('open', handler);
    }

    public close(): void {
        this.setOption('visible', false);
        document.body.style.cursor = 'auto';
        this.just_closed = true;
        this.emit('close');
    }

    public onClose(handler: EventHandler): void {
        this.on('close', handler);
    }

    public toggle(): void {
        this.computed_props.visible = !this.computed_props.visible;
        this.updateChilden('visible', this.computed_props.visible);
        this.needs_rerender = true;
    }

    protected renderHeader(ctx: CanvasRenderingContext2D): void {

        if (this.computedProperties.header_height > 0) {

            if (this.computedProperties.bg_color !== this.computedProperties.header_color) {
                ctx.beginPath();
                ctx.fillStyle = this.computedProperties.header_color;
                ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.computedProperties.header_height);
                ctx.closePath();
                ctx.fill();
            } else if (this.computedProperties.border) {
                ctx.beginPath();
                ctx.lineWidth = this.computedProperties.border_size;
                console.log(this.computedProperties.border_size);
                ctx.strokeStyle = this.computedProperties.border_color;
                ctx.moveTo(this.x - this.width / 2, this.y - this.height / 2 + this.computedProperties.header_height);
                ctx.lineTo(this.x + this.width / 2, this.y - this.height / 2 + this.computedProperties.header_height);
                ctx.closePath();
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.fillStyle = this.computedProperties.text_options.text_color;
            ctx.font = this.computedProperties.text_options.font;
            ctx.textAlign = this.computedProperties.text_options.text_align;
            ctx.fillText(
                this.computedProperties.title,
                this.x,
                this.y - this.height / 2 + this.computedProperties.header_height / 2 + ctx.measureText('M').width / 2
            );
            ctx.closePath();
            ctx.fill();
        }
    }

    public setOption(key: keyof GUIComponentProperties, value: any): boolean {
        const children_updated = this.updateChilden(key, value);
        const updated = super.setOption(key, value);

        return children_updated || updated;
    }

    public render(ctx: CanvasRenderingContext2D): void {

        this.just_closed = false;

        if (!this.computedProperties.visible) return;
        super.render(ctx);
        this.renderHeader(ctx);

        // render children
        for (const child of this.children) {
            child.render(ctx);
        }

        this.needs_rerender = false;
    }

    public needsReRender(): boolean {
        if (!this.just_closed && !this.computedProperties.visible) return false;
        if (this.just_closed || this.moving || this.needs_rerender) return true;

        for (const child of this.children) {
            if (child.needsReRender()) {
                return true;
            }
        }

        return false;
    }

    protected handleMouseMove(pos: Point): void {

        if (pos.y - this.y + this.height / 2 < this.computedProperties.header_height) {
            document.body.style.cursor = 'grab';
            this.over_header = true;
        } else {
            document.body.style.cursor = 'auto';
            this.over_header = false;
        }

        if (this.moving) {
            const delta = {
                x: pos.x - this.last_pos.x,
                y: pos.y - this.last_pos.y
            };

            this.last_pos.x = pos.x;
            this.last_pos.y = pos.y;

            this.translate(delta.x, delta.y);
        }
    }

    protected handleMouseExit(pos: Point): void {
        if (this.over_header) {
            document.body.style.cursor = 'auto';
        }
    }

    public translate(x: number, y: number): void {

        this.translation.x += x;
        this.translation.y += y;
        this.bounding_rect = undefined;
        this.updateProperties();

        for (const child of this.children) {
            child.reRender();
        }
    }

    public get x(): number {
        return this.translation.x + super.x;
    }

    public get y(): number {
        return super.y + this.translation.y;
    }

    protected handleMouseDown(pos: Point): void {
        if (this.over_header && !this.moving) {
            this.moving = true;
            this.intersection_check = false;
            this.last_pos = { ...pos };
        }
    }

    protected handleMouseUp(pos: Point): void {
        if (this.moving) {
            this.moving = false;
            this.intersection_check = true;
        }
    }
}