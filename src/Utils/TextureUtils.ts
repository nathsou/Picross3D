import { CanvasTexture, Color } from "three";
import { HintType, LineHint } from "../PicrossShape";
import { color2string, getContrastYIQ, colors } from "./Utils";

export namespace TextureUtils {

    export interface TextureOptions {
        size?: number,
        anisotropy?: number,
        text_color?: Color,
        line_color?: Color,
        fill_color?: Color,
        line_width?: number
    }

    export function generateHintTexture(hint: LineHint, options?: TextureOptions): CanvasTexture {

        const optns: TextureOptions = {
            size: 128,
            anisotropy: 4,
            text_color: getContrastYIQ(
                options !== undefined && options.fill_color !== undefined ? options.fill_color : new Color(0xffffff)
            ),
            line_color: colors.black(),
            fill_color: colors.white(),
            line_width: 4,
            ...options
        };

        const cnv = document.createElement('canvas');
        cnv.width = optns.size;
        cnv.height = optns.size;
        const ctx = cnv.getContext('2d');

        //background rendering
        if (optns.line_width > 0) {
            ctx.fillStyle = color2string(optns.line_color);
            ctx.fillRect(0, 0, optns.size, optns.size);
            ctx.fillStyle = color2string(optns.fill_color);
            const lw = optns.line_width;
            ctx.fillRect(lw, lw, optns.size - 2 * lw, optns.size - 2 * lw);
        } else {
            ctx.fillStyle = color2string(optns.fill_color);
            ctx.fillRect(0, 0, optns.size, optns.size);
        }

        //text rendering
        ctx.font = 'bold 50px monaco, monospace';
        ctx.fillStyle = color2string(optns.text_color);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(hint !== null ? hint.num.toString() : '', optns.size / 2, optns.size / 2);

        //shape rendering
        ctx.strokeStyle = color2string(optns.text_color);
        ctx.lineWidth = optns.line_width;

        if (hint !== null) {

            if (hint.type === HintType.circle) {
                ctx.arc(optns.size / 2, optns.size / 2, optns.size * 0.4, 0, 2 * Math.PI);
            } else if (hint.type === HintType.square) {
                ctx.rect(0.15 * optns.size, 0.15 * optns.size, optns.size * 0.7, optns.size * 0.7);
            }
        }

        ctx.stroke();

        const tex = new CanvasTexture(cnv);
        tex.anisotropy = optns.anisotropy;

        return tex;
    }

    export function generateBitmap(
        width: number,
        height: number,
        draw_func: (ctx: CanvasRenderingContext2D) => void
    ): Promise<ImageBitmap> {
        const cnv = document.createElement('canvas');
        const dpr = window.devicePixelRatio || 1;
        cnv.width = width * dpr;
        cnv.height = height * dpr;
        const ctx = cnv.getContext('2d');
        ctx.scale(dpr, dpr);
        draw_func(ctx);

        /// @ts-ignore
        return createImageBitmap(cnv);
    }

}