import { GUIComponent, GUIComponentProperties, Point, GUIComponentComputedProperties } from "./GUIComponent";

export type Percentage = string;
export type LengthProperty = number | Percentage;
export type MarginProperty = LengthProperty | 'auto';
export type PositionProperty = 'relative' | 'absolute';
export type TopLeftBottomRightProperty = LengthProperty | 'auto';

export function isPercentage(str: string): str is Percentage {
    return str[str.length - 1] === '%';
}

const hours = new Date().getHours();
// export const dark_theme = true;
export const dark_theme = hours >= 20 || hours < 8;

export interface GUIProperties {
    width: LengthProperty,
    height: LengthProperty,
    max_width: LengthProperty,
    max_height: LengthProperty,
    min_width: LengthProperty,
    min_height: LengthProperty,
    margin_left: MarginProperty,
    margin_right: MarginProperty,
    margin_top: MarginProperty,
    margin_bottom: MarginProperty,
    position: PositionProperty,
    top: TopLeftBottomRightProperty,
    bottom: TopLeftBottomRightProperty,
    left: TopLeftBottomRightProperty,
    right: TopLeftBottomRightProperty
}

export interface GUIComputedProperties {
    width: number,
    height: number,
    max_width: number,
    max_height: number,
    min_width: number,
    min_height: number,
    margin_left: number,
    margin_right: number,
    margin_top: number,
    margin_bottom: number,
    position: PositionProperty,
    top: number,
    bottom: number,
    left: number,
    right: number
}

export const defaultProperties: GUIProperties = {
    width: '33%',
    height: '33%',
    max_width: '100%',
    max_height: '100%',
    min_width: 0,
    min_height: 0,
    margin_left: 0,
    margin_right: 0,
    margin_top: 0,
    margin_bottom: 0,
    position: 'relative',
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 'auto'
};


//TODO: Refactor properties computation as inherited methods on GUI Components
const props_parsers = new Map<
    keyof GUIProperties,
    (value: any, component: GUIComponent, props: GUIProperties) => any
>();

export function computeProperty<K extends keyof GUIProperties>(
    prop: K,
    value: GUIComponentProperties[K],
    component: GUIComponent,
    props: GUIProperties
) {
    if (props_parsers.has(prop)) {
        return props_parsers.get(prop)(value, component, props);
    }

    return (component.computedProperties && component.computedProperties[prop]) || value;
}

export function computeProperties<
    P extends GUIComponentProperties,
    C extends GUIComponentComputedProperties>
    (component: GUIComponent<P, C>): C {

    const props = { ...component.properties } as P;

    for (const prop in props) {
        const p = prop as keyof GUIProperties;
        const val = computeProperty(p, props[p], component, props);
        props[p] = val;
    }

    return (props as unknown) as C;
}

function computeLength(len: LengthProperty, component: GUIComponent, is_width: boolean): number {
    if (typeof len === 'number') {
        return len;
    }

    if (isPercentage(len)) {
        const percentage = parseFloat(len.slice(0, len.length - 1)) / 100;

        const max = is_width ? component.parent.width : component.parent.height;

        return Math.floor(percentage * max);
    }

    throw new Error(`Incorrect LengthProperty value: ${len}`);
}

function computeWidth(len: LengthProperty, component: GUIComponent): number {
    return computeLength(len, component, true);
}

function computeHeight(len: LengthProperty, component: GUIComponent): number {
    return computeLength(len, component, false);
}

function computeMaxLen(
    max_len: LengthProperty,
    component: GUIComponent,
    props: GUIProperties,
    is_width: boolean
): number {
    const max = computeLength(max_len, component, is_width);
    if (is_width) {
        props.width = Math.min(props.width as number, max);
    } else {
        props.height = Math.min(props.height as number, max);
    }

    return max;
}

function computeMaxWidth(
    max_len: LengthProperty,
    component: GUIComponent,
    props: GUIProperties
): number {
    return computeMaxLen(max_len, component, props, true);
}

function computeMaxHeight(
    max_len: LengthProperty,
    component: GUIComponent,
    props: GUIProperties
): number {
    return computeMaxLen(max_len, component, props, false);
}

function computeMinLen(
    min_len: LengthProperty,
    component: GUIComponent,
    props: GUIProperties,
    is_width: boolean
): number {
    const min = computeLength(min_len, component, is_width);
    if (is_width) {
        props.width = Math.max(props.width as number, min);
    } else {
        props.height = Math.max(props.height as number, min);
    }

    return min;
}

function computeMinWidth(
    min_len: LengthProperty,
    component: GUIComponent,
    props: GUIProperties
): number {
    return computeMinLen(min_len, component, props, true);
}

function computeMinHeight(
    min_len: LengthProperty,
    component: GUIComponent,
    props: GUIProperties
): number {
    return computeMinLen(min_len, component, props, false);
}

export function computePosition<T extends GUIComponentProperties>(
    properties: Extract<T, GUIProperties>,
    component: GUIComponent
): Point {

    const x = properties.left !== 'auto' ? properties.left as number : properties.right !== 'auto' ? (properties.width as number) - (properties.right as number) : 0;
    const y = properties.top !== 'auto' ? properties.top as number : properties.bottom !== 'auto' ? (properties.height as number) - (properties.bottom as number) : 0;

    switch (properties.position) {
        case 'absolute':
            return { x, y };

        case 'relative':

            break;
    }

    throw new Error(`Unknown value for 'position' property: ${properties.position}`);
}

function computeLeftAndRightMargin(len: MarginProperty, component: GUIComponent, props: GUIProperties): number {
    if (len === 'auto' && props.margin_right === 'auto') {
        // center the block
        props.margin_right = 0;
        return component.parent.width / 2 - (props.width as number) / 2;
    } else if (len === 'auto') {
        // stretch
        const right = computeWidth(props.margin_right, component);
        props.margin_right = right;
        return component.parent.width - (props.width as number) - right;
    } else {
        return computeWidth(len, component);
    }
}

function computeVerticalMargin(len: MarginProperty, component: GUIComponent, props: GUIProperties): number {
    if (len === 'auto') {
        return 0;
    }

    return computeHeight(len, component);
}

function computeTop(len: TopLeftBottomRightProperty, component: GUIComponent, props: GUIProperties): number {
    return props.top !== 'auto' ? computeHeight(len, component) : props.bottom !== 'auto' ?
        (props.height as number) - (props.bottom as number) :
        component.computedProperties !== undefined && typeof component.computedProperties.top === 'number' ? component.computedProperties.top : 0;
}

function computeLeft(len: TopLeftBottomRightProperty, component: GUIComponent, props: GUIProperties): number {
    return props.left !== 'auto' ? computeWidth(len, component) : props.right !== 'auto' ?
        (props.width as number) - (props.right as number) :
        component.computedProperties !== undefined && typeof component.computedProperties.left === 'number' ? component.computedProperties.left : 0;
}

function computeBottom(len: TopLeftBottomRightProperty, component: GUIComponent, props: GUIProperties): number {
    return props.bottom !== 'auto' ? component.parent.height - computeHeight(len, component) : props.top !== 'auto' ?
        props.top as number :
        component.computedProperties !== undefined && typeof component.computedProperties.bottom === 'number' ? component.computedProperties.bottom : 0;
}

function computeRight(len: TopLeftBottomRightProperty, component: GUIComponent, props: GUIProperties): number {
    return props.right !== 'auto' ? component.parent.width - computeWidth(len, component) : props.left !== 'auto' ?
        props.left as number :
        component.computedProperties !== undefined && typeof component.computedProperties.right === 'number' ? component.computedProperties.right : 0;
}

props_parsers.set('width', computeWidth);
props_parsers.set('height', computeHeight);
props_parsers.set('max_width', computeMaxWidth);
props_parsers.set('min_width', computeMinWidth);
props_parsers.set('max_height', computeMaxHeight);
props_parsers.set('min_height', computeMinHeight);
props_parsers.set('margin_left', computeLeftAndRightMargin);
props_parsers.set('margin_top', computeVerticalMargin);
props_parsers.set('margin_bottom', computeVerticalMargin);
props_parsers.set('left', computeLeft);
props_parsers.set('top', computeTop);
props_parsers.set('right', computeRight);
props_parsers.set('bottom', computeBottom);