import { GUIRectangle } from "./GUIRectangle";
import { Point, GUIComponent, GUIComponentProperties, GUIEventType, GUIComponentComputedProperties } from "./GUIComponent";

export abstract class GUIComponentContainer<
    P extends GUIComponentProperties,
    C extends GUIComponentComputedProperties,
    > extends GUIRectangle<P, C> {

    protected children: GUIComponent[];

    constructor(optns?: Partial<P>) {
        super(optns);
        this.children = [];
    }

    public add(...children: GUIComponent<P, C>[]): void {
        for (const child of children) {
            // set position relative to this container
            // child.translate(this.x, this.y);
            child.setOption('visible', this.computed_props.visible);
            child.setParent(this);
            this.children.push(child);
        }
    }

    protected updateChilden(prop: keyof GUIComponentProperties, value: any): boolean {
        let updated = false;
        for (const child of this.children) {
            updated = child.setOption(prop, value) || updated;
        }

        return updated;
    }


    public triggerEvent(type: GUIEventType, pos: Point): void {
        if (!this.computed_props.visible) return;

        super.triggerEvent(type, pos);
        // propagate events to children
        for (const child of this.children) {
            child.triggerEvent(type, pos);
        }
    }

    public needsReRender(): boolean {
        if (this.computedProperties.visible && this.needs_rerender) return true;

        for (const c of this.children) {
            if (c.needsReRender()) {
                return true;
            }
        }

        return false;
    }

    public resize(size: GUIComponentContainer<P, C> | { width: number, height: number }): void {
        this.setParent(size);
        this.updateProperties();
        this.needs_rerender = true;
        for (const child of this.children) {
            child.resize(this);
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {

        if (!this.computed_props.visible) return;
        super.render(ctx);

        // render children
        for (const child of this.children) {
            child.render(ctx);
        }

        this.needs_rerender = false;
    }
}