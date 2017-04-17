declare namespace JSX {
    export type Attribute = EventListener | string | number | boolean | undefined
    export type Node = Element | string | Element[]
    export type Factory<P> = Component<P> | string
    export interface Element {
        (): void
    }
    export interface Component<P> {
        (props?: P, children?: JSX.Node[]): Element
    }
    export type HTMLAttributes = Record<string, Attribute>
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
