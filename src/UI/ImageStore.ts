import { CachedValue, cache } from "../Utils/Utils";
import { TextureUtils } from "../Utils/TextureUtils";
import { dark_theme } from "./GUIProperties";


export namespace ImageStore {

    const images = new Map<string, CachedValue<Promise<ImageBitmap>>>();

    function getByKey(key: string, populator: () => Promise<ImageBitmap>): CachedValue<Promise<ImageBitmap>> {
        if (!images.has(key)) {
            images.set(key, cache(populator));
        }

        return images.get(key);
    }

    export function getSettingsButton(options: { bg_color: string }): Promise<ImageBitmap> {
        const populator = async () => await TextureUtils.generateBitmap(50, 50, ctx => {
            // ctx.fillStyle = options.bg_color;
            // ctx.fillRect(0, 0, 50, 50);
            ctx.fill();
            ctx.lineWidth = 5;
            const margin_left = 10;
            const margin_top = 13;
            const line_len = 30;

            let x = margin_left;
            let y = margin_top;

            ctx.beginPath();
            for (let i = 0; i < 3; i++) {
                ctx.moveTo(x, y);
                ctx.lineTo(x + line_len, y);
                y += margin_top;
            }
            ctx.closePath();

            ctx.stroke();
        });

        return getByKey(`settings_btn_${JSON.stringify(options)}`, populator)();
    }

    export function getCloseButton(options: { bg_color: string, text_color: string }) {

        const idle_populator = async () => await TextureUtils.generateBitmap(20, 20, ctx => {
            ctx.beginPath();
            ctx.fillStyle = options.bg_color;
            ctx.fillRect(0, 0, 22, 22);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.strokeStyle = options.text_color;
            ctx.lineWidth = 2;
            ctx.arc(10, 10, 7, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
        });

        const hovered_populator = async () => await TextureUtils.generateBitmap(20, 20, ctx => {
            ctx.beginPath();
            ctx.strokeStyle = options.text_color;
            ctx.lineWidth = 2;
            ctx.arc(10, 10, 7, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.fillStyle = options.text_color;
            ctx.arc(10, 10, 3, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        });

        const clicked_populator = async () => await TextureUtils.generateBitmap(20, 20, ctx => {
            ctx.beginPath();
            ctx.fillStyle = options.bg_color;
            ctx.fillRect(0, 0, 22, 22);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = options.text_color;
            ctx.lineWidth = 2;
            ctx.arc(10, 10, 7, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        });

        const optns = JSON.stringify(options);

        return {
            idle: getByKey(`close_btn_idle_${optns}`, idle_populator)(),
            hovered: getByKey(`close_btn_hovered_${optns}`, hovered_populator)(),
            cliked: getByKey(`close_btn_clicked_${optns}`, clicked_populator)()
        };
    }

    export function getBackButton(): Promise<ImageBitmap> {
        const populator = async () => await TextureUtils.generateBitmap(40, 30, ctx => {

            ctx.fillStyle = dark_theme ? 'white' : 'black';

            ctx.beginPath();
            ctx.moveTo(17, 5);
            ctx.lineTo(5, 15);
            ctx.lineTo(17, 25);
            ctx.lineTo(17, 5);
            ctx.fillRect(17, 10, 18, 10);
            ctx.closePath();

            ctx.fill();
        });

        return getByKey('back_btn', populator)();
    }

}