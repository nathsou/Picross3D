import { deepMerge } from "../Utils/Utils";
import { defaultButtonOptions } from "./GUIButtton";
import { GUIComponentProperties, GUIComponentComputedProperties } from "./GUIComponent";
import { dark_theme } from "./GUIProperties";
import { GUIRectangle } from "./GUIRectangle";

export interface GUITextOptions {
    text_color: string,
    font: string,
    text_align: 'start' | 'left' | 'center' | 'right' | 'end',
    hover_text_color: string
}

export interface GUITextBoxOptions extends GUIComponentProperties {
    text: string,
    text_options: Partial<GUITextOptions>
}

export interface GUITextBoxComputedProperties extends GUIComponentComputedProperties {
    text: string,
    text_options: Partial<GUITextOptions>
}

export const defaultTextOptions: GUITextOptions = {
    font: 'bold 14px Consolas, monaco, monospace',
    text_color: dark_theme ? 'white' : 'black',
    text_align: 'center',
    hover_text_color: '#000000'
};

export const defaultTextBoxOptions: GUITextBoxOptions = {
    ...defaultButtonOptions,
    text: 'button',
    text_options: { ...defaultTextOptions }
};

export class GUITextBox<
    P extends GUITextBoxOptions,
    C extends GUITextBoxComputedProperties
    > extends GUIRectangle<P, C> {

    constructor(optns?: Partial<P>) {
        super(deepMerge(
            {},
            defaultTextBoxOptions,
            optns
        ) as P);

    }

    public render(ctx: CanvasRenderingContext2D): void {

        if (!this.computed_props.visible) return;

        super.render(ctx);

        ctx.beginPath();
        ctx.fillStyle = this.computedProperties.text_options.text_color;
        ctx.textAlign = this.computedProperties.text_options.text_align;
        ctx.font = this.computedProperties.text_options.font;

        const height = this.y + ctx.measureText('M').width / 2;

        ctx.fillText(this.computedProperties.text, this.x, height, this.width);
        ctx.closePath();
        ctx.fill();

        this.needs_rerender = false;
    }


}
