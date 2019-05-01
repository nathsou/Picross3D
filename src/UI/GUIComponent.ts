import { Disposable } from "../Screens/Screen";
import EventEmitter from "../Utils/EventEmitter";
import { GUIComponentContainer } from "./GUIComponentContainer";
import { computeProperties, dark_theme, defaultProperties, GUIComputedProperties, GUIProperties } from "./GUIProperties";

export interface BoundingRect {
    min_x: number,
    max_x: number,
    min_y: number,
    max_y: number,
}

export interface Point {
    x: number,
    y: number
}

export interface GUIComponentProperties extends GUIProperties {
    bg_color: string,
    border_color: string,
    border: boolean,
    border_size: number,
    visible: boolean
}

export interface GUIComponentComputedProperties extends GUIComputedProperties {
    bg_color: string,
    border_color: string,
    border: boolean,
    border_size: number,
    visible: boolean
}

export enum GUIEventType {
    MOUSE_MOVE,
    MOUSE_DOWN,
    MOUSE_UP,
    CLICK
}


export const defaultComponentProperties: GUIComponentProperties = {
    visible: true,
    bg_color: dark_theme ? 'black' : 'white',
    border: true,
    border_color: dark_theme ? 'white' : 'black',
    border_size: 3,
    ...defaultProperties
};

export abstract class GUIComponent<
    P extends GUIComponentProperties = GUIComponentProperties,
    C extends GUIComponentComputedProperties = GUIComponentComputedProperties>
    extends EventEmitter implements Disposable {

    protected bounding_rect: BoundingRect;
    protected computed_props: C;
    protected needs_rerender = true;
    protected hovered = false;
    protected intersection_check = true;
    protected _parent: { width: number, height: number } | GUIComponentContainer<P, C>;
    protected props: Readonly<P>;
    protected pos: Point;
    protected offset: Point;

    // TODO: Get rid of position, compute using properties
    constructor(props?: Partial<P>) {
        super();

        this._parent = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.props = {
            ...defaultComponentProperties as P,
            ...props
        };

        this.computed_props = computeProperties(this);

        this.pos = {
            x: this.left,
            y: this.top
        };

        // movement relative to min_x, min_y
        this.offset = { x: 0, y: 0 };
    }

    public updateProperties(): Readonly<C> {
        this.computed_props = computeProperties(this);

        if ((this._parent as GUIComponentContainer<P, C>).boundingRect) {
            const bounding_rect = (this._parent as GUIComponentContainer<P, C>).boundingRect;
            this.pos.x = this.left + this.offset.x + bounding_rect.min_x;
            this.pos.y = this.top + this.offset.y + bounding_rect.min_y;
        } else {
            this.pos.x = this.left + this.offset.x;
            this.pos.y = this.top + this.offset.y;
        }

        this.computeBoundingRect();
        return this.computedProperties;
    }

    public resetOffset(): void {
        this.offset.x = 0;
        this.offset.y = 0;
    }

    public setParent(parent: GUIComponentContainer<P, C> | { width: number, height: number }): void {
        this._parent = parent;
    }

    public resize(size: GUIComponentContainer<P, C> | { width: number, height: number }): void {
        this.setParent(size);
        this.updateProperties();
        this.needs_rerender = true;
    }

    public triggerEvent(type: GUIEventType, pos: Point, ignore_intersection_check = false): void {

        if (!this.computed_props.visible) return;

        if (!ignore_intersection_check && ((this.intersection_check) && !this.pointIntersects(pos))) {
            if (this.hovered) {
                this.handleMouseExit(pos);
                this.emit('mouseexit', pos);
                this.hovered = false;
            }
            return;
        }

        switch (type) {
            case GUIEventType.CLICK:
                this.handleClick(pos);
                this.emit('click', pos);
                break;
            case GUIEventType.MOUSE_DOWN:
                this.handleMouseDown(pos);
                this.emit('mousedown', pos);
                break;
            case GUIEventType.MOUSE_UP:
                this.handleMouseUp(pos);
                this.emit('mouseup', pos);
                break;
            case GUIEventType.MOUSE_MOVE:
                this.handleMouseMove(pos);
                this.hovered = true;
                this.emit('mousemove', pos);
                break;
        }

    }

    protected pointIntersects(p: Point): boolean {
        return this.computed_props.visible &&
            p.x >= this.boundingRect.min_x &&
            p.x <= this.boundingRect.max_x &&
            p.y >= this.bounding_rect.min_y &&
            p.y <= this.boundingRect.max_y;
    }

    public needsReRender(): boolean {
        return this.needs_rerender && this.computedProperties.visible;
    }

    public reRender(): void {
        this.needs_rerender = true;
        this.bounding_rect = undefined;
    }

    public abstract render(ctx: CanvasRenderingContext2D): void;

    protected abstract computeBoundingRect(): void;

    public moveTo(x: number, y: number): void {
        if (this.x !== x || this.y !== y) {
            this.needs_rerender = true;
        }

        this.x = x;
        this.y = y;
        this.bounding_rect = undefined;
    }

    public get x(): number {
        return this.pos.x;
    }

    public set x(val: number) {
        this.bounding_rect = undefined;
        this.pos.x = val;
    }

    public get y(): number {
        return this.pos.y;
    }

    public set y(val: number) {
        this.bounding_rect = undefined;
        this.pos.y = val;
    }

    public get left(): number {
        return this.props.right !== 'auto' ?
            (this.computed_props.right as number) :
            this.computed_props.left as number;
    }

    public get top(): number {
        return this.props.bottom !== 'auto' ?
            this.computed_props.bottom as number :
            this.computed_props.top as number
    }


    public setOffset(x: number, y: number) {
        this.offset.x += x;
        this.offset.y += y;
        this.moveTo(this.x + x, this.y + y);
    }

    public get boundingRect(): Readonly<BoundingRect> {
        if (this.bounding_rect === undefined) {
            this.computeBoundingRect();
        }

        return this.bounding_rect;
    }

    public get parent(): { width: number, height: number } {
        return this._parent;
    }

    // Event Listeners

    public onClick(handler: (pos: Point) => any): void {
        this.on('click', handler);
    }

    public onMouseDown(handler: (pos: Point) => any): void {
        this.on('mousedown', handler);
    }

    public onMouseUp(handler: (pos: Point) => any): void {
        this.on('mouseup', handler);
    }

    public onMouseMove(handler: (pos: Point) => any): void {
        this.on('mousemove', handler);
    }

    public onMouseExit(handler: (pos: Point) => any): void {
        this.on('mouseexit', handler);
    }

    // Event handlers

    protected handleClick(pos: Point): void { }
    protected handleMouseMove(pos: Point): void { }
    protected handleMouseExit(pos: Point): void { }
    protected handleMouseDown(pos: Point): void { }
    protected handleMouseUp(pos: Point): void { }

    public get computedProperties(): Readonly<C> {
        return this.computed_props;
    }

    public get properties(): Readonly<P> {
        return this.props;
    }

    public setOption(optn: keyof C, value: any): boolean {
        if (this.computed_props[optn] !== undefined && this.computed_props[optn] !== value) {
            this.computed_props[optn] = value;
            this.needs_rerender = true;
            return true;
        }

        return false;
    }

    public dispose(): void {
        this.removeListeners();
    }

    public computeTotalWidth(): number { // px
        const content_width = this.computedProperties.width as number;
        const margin = (this.computedProperties.margin_left as number) +
            (this.computedProperties.margin_right as number);

        return content_width + 2 * margin;
    }

    public computeTotalHeight(): number { // px
        const content_height = this.computedProperties.height as number;
        const margin = (this.computedProperties.margin_top as number) +
            (this.computedProperties.margin_bottom as number);

        return content_height + 2 * margin;
    }

}