/// <reference types="vite/client" />

declare module '*.vue' {
    import { DefineComponent } from "vue"
    const component: DefineComponent<Props, RawBindings, D, C, M, Mixin, Extends, E, PP & Props, Defaults, true, object, S> & ComponentOptionsBase<Props, RawBindings, D, C, M, Mixin, Extends, E, EE, Defaults, object, string, S>
    export default component
}  