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
        label: HTMLAttributes
        legend: HTMLAttributes
        main: HTMLAttributes
        option: HTMLAttributes
        p: HTMLAttributes
        path: HTMLAttributes
        section: HTMLAttributes
        select: HTMLAttributes
        svg: HTMLAttributes
        textarea: HTMLAttributes
    }
}
