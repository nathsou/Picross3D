import { defaultComponentProperties, GUIComponentComputedProperties, GUIComponentProperties, Point } from "./GUIComponent";
import { dark_theme } from "./GUIProperties";
import { GUIRectangle } from "./GUIRectangle";

export enum GUIButtonBehavior {
    SIMPLE,
    TOGGLE
}

export interface GUIButtonOptions extends GUIComponentProperties {
    hover_color: string,
    click_color: string,
    behavior: GUIButtonBehavior
}

export interface GUIButtonComputedProperties extends GUIComponentComputedProperties {
    hover_color: string,
    click_color: string,
    behavior: GUIButtonBehavior
}

export const defaultButtonOptions: GUIButtonOptions = {
    ...defaultComponentProperties,
    bg_color: dark_theme ? 'white' : 'black',
    hover_color: dark_theme ? 'black' : 'white',
    click_color: dark_theme ? 'black' : 'white',
    border: true,
    border_color: dark_theme ? 'white' : 'black',
    border_size: 3,
    behavior: GUIButtonBehavior.SIMPLE
};

export abstract class GUIButton<
    P extends GUIButtonOptions,
    C extends GUIButtonComputedProperties>
    extends GUIRectangle<P, C> {

    protected toggled = false;
    protected old_bg_color: string;

    constructor(optns?: Partial<P>) {
        super({
            ...defaultButtonOptions,
            ...optns
        });
    }

    protected handleClick(pos: Point): void {
        if (this.computedProperties.behavior === GUIButtonBehavior.TOGGLE) {
            this.toggled = !this.toggled;
        }
    }

    protected handleMouseMove(pos: Point): void {
        const old_bg_color = this.computedProperties.bg_color;
        if (this.old_bg_color === undefined && this.setOption('bg_color', this.computedProperties.hover_color)) {
            this.old_bg_color = old_bg_color;
        }
    }

    protected handleMouseExit(pos: Point): void {
        if (!this.toggled) {
            this.setOption('bg_color', this.old_bg_color);
            this.old_bg_color = undefined;
        }
    }

    protected handleMouseDown(pos: Point): void {
        this.setOption('bg_color', this.computedProperties.click_color);
    }

    protected handleMouseUp(pos: Point): void {
        if (this.hovered) {
            this.setOption('bg_color', this.computedProperties.hover_color);
        } else {
            this.setOption('bg_color', this.computedProperties.bg_color);
        }
    }
}