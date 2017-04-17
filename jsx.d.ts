declare namespace JSX {
    export type Primitive = string | boolean | number | void
    export type Node = Element | string
    export interface Element {
        (): void
    }
    export interface Component<P> {
        (props: P): Element
    }
    export type Factory<P> = Component<P> | string
    export type HTMLAttributes = Record<string, Primitive>
    export interface IntrinsicElements {
        a: HTMLAttributes
        button: HTMLAttributes
        div: HTMLAttributes
        fieldset: HTMLAttributes
        form: HTMLAttributes
        header: HTMLAttributes
        input: HTMLAttributes
        main: HTMLAttributes
        p: HTMLAttributes
        path: HTMLAttributes
        select: HTMLAttributes
        svg: HTMLAttributes
        label: HTMLAttributes
        textarea: HTMLAttributes
        option: HTMLAttributes
    }
}
