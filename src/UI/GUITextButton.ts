import { deepMerge } from "../Utils/Utils";
import { defaultButtonOptions, GUIButton, GUIButtonOptions, GUIButtonComputedProperties } from "./GUIButtton";
import { dark_theme } from "./GUIProperties";
import { defaultTextOptions, GUITextOptions } from "./GUITextBox";

export interface GUITextButtonOptions extends GUIButtonOptions {
    text: string,
    text_options: Partial<GUITextOptions>
}

export interface GUITextButtonComputedProperties extends GUIButtonComputedProperties {
    text: string,
    text_options: Partial<GUITextOptions>
}

export const defaultTextButtonOptions: GUITextButtonOptions = {
    ...defaultButtonOptions,
    text: 'button',
    text_options: {
        ...defaultTextOptions,
        text_color: dark_theme ? 'black' : 'white',
        hover_text_color: dark_theme ? 'white' : 'black'
    }
};

export class GUITextButton<
    P extends GUITextButtonOptions = GUITextButtonOptions,
    C extends GUITextButtonComputedProperties = GUITextButtonComputedProperties
    > extends GUIButton<P, C> {

    constructor(optns?: Partial<P>) {
        super(deepMerge(
            {},
            defaultTextButtonOptions,
            optns
        ) as P);
    }

    public render(ctx: CanvasRenderingContext2D): void {

        if (!this.computed_props.visible) return;

        super.render(ctx);

        ctx.beginPath();
        const text_color = this.hovered ? this.computedProperties.text_options.hover_text_color :
            this.computedProperties.text_options.text_color;

        ctx.fillStyle = text_color;
        ctx.textAlign = this.computedProperties.text_options.text_align;
        ctx.font = this.computedProperties.text_options.font;

        const height = this.y + ctx.measureText('M').width / 2;

        ctx.fillText(this.computedProperties.text, this.x, height, this.width);
        ctx.closePath();
        ctx.fill();

        this.needs_rerender = false;
    }

}
