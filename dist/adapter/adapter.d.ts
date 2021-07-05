declare type Converter<TIn, TOut> = (item: AsyncGenerator<TIn, void, void>) => AsyncGenerator<TOut, void, void>;
declare type AdapterConfig = {
    from: Converter<any, object>;
    to: Converter<any, any>;
};
export default class Adapter implements IAdapter {
    private static readonly defaultConfig;
    private readonly _from;
    private readonly _to;
    private _source;
    get source(): ISource<any> | undefined;
    set source(s: ISource<any> | undefined);
    constructor({ from, to }?: AdapterConfig);
    from(data: AsyncGenerator<any, void, void>): AsyncGenerator<object, void, void>;
    to(data: AsyncGenerator<any, void, void>): AsyncGenerator<any, void, void>;
    compile(query: any): any;
    static get default(): typeof Adapter;
}
export {};
//# sourceMappingURL=adapter.d.ts.map