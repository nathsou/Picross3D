import { defaultComponentProperties, GUIComponent, GUIComponentComputedProperties, GUIComponentProperties, Point } from "./GUIComponent";
import { GUIComponentContainer } from "./GUIComponentContainer";

export interface GUIGridLayoutOptions extends GUIComponentProperties {
    grid_cols: number | 'auto'
}

export interface GUIGridLayoutComputerProperties extends GUIComponentComputedProperties {
    grid_cols: number | 'auto'
}

export const defaultGridLayoutOptions: GUIGridLayoutOptions = {
    grid_cols: 'auto',
    ...defaultComponentProperties
};

export class GUIGridLayout<
    P extends GUIGridLayoutOptions = GUIGridLayoutOptions,
    C extends GUIGridLayoutComputerProperties = GUIGridLayoutComputerProperties>
    extends GUIComponentContainer<P, C> {

    protected translation: Point = { x: 0, y: 0 };
    protected last_comp: {
        center: Point,
        total_width: number,
        total_height: number,
        margin_left: number,
        margin_right: number
    };

    constructor(optns?: Partial<P>) {
        super({
            ...defaultGridLayoutOptions,
            ...optns
        });

        this.computeBoundingRect();
    }

    public add(...children: GUIComponent[]): void {

        for (const child of children) {
            child.setOption('visible', this.computed_props.visible);
            child.setParent(this);
            child.updateProperties();
            const { x, y } = this.computeComponentCenter(child, this.children.length);
            // child.moveTo(this.boundingRect.min_x + x, this.boundingRect.min_y + y);
            child.setOffset(x, y);
            this.children.push(child);
        }
    }

    protected computeComponentCenter(comp: GUIComponent, idx: number): Readonly<Point> {

        if (comp.computedProperties.position === 'absolute') {
            return {
                x: (comp.properties.left as number),
                y: (comp.properties.top as number)
            };
        }

        const w = comp.computeTotalWidth();
        const h = comp.computeTotalHeight();

        let x, y;

        if (this.last_comp !== undefined) {
            x = this.last_comp.center.x + this.last_comp.total_width / 2 + w / 2;
            y = this.last_comp.center.y - this.last_comp.total_height / 2 + h / 2;

            x += this.last_comp.margin_right + this.last_comp.margin_left;
        } else {
            x = w / 2 + (comp.computedProperties.margin_right as number);
            y = h / 2 + (comp.computedProperties.margin_bottom as number);
        }

        // go down if x is bigger than the grid's width
        if (
            ((this.computedProperties.grid_cols === 'auto') &&
                ((x + w / 2) > (this.computedProperties.width as number))
            ) ||
            (idx % (this.computedProperties.grid_cols as number) === 0)
        ) {
            x = w / 2 + (comp.computedProperties.margin_right as number);
            if (idx !== 0) {
                y += h + (comp.computedProperties.margin_bottom as number);
            }
        }

        this.last_comp = {
            center: { x: Math.floor(x), y: Math.floor(y) },
            total_width: w,
            total_height: h,
            margin_left: comp.computedProperties.margin_left as number,
            margin_right: comp.computedProperties.margin_right as number
        };

        return this.last_comp.center;
    }

    public updateProperties(): Readonly<C> {
        super.updateProperties();

        this.last_comp = undefined;
        let i = 0;
        for (const child of this.children) {
            child.resetOffset();
            const { x, y } = this.computeComponentCenter(child, i++);
            child.setOffset(x, y);
            child.updateProperties();
        }

        return this.computedProperties;
    }

}