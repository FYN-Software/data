export default class Type extends EventTarget implements IType {
    static config: TypeConfig;
    private value;
    private readonly config;
    constructor(defaults?: TypeConfig, value?: any);
    [Symbol.toPrimitive](hint: string): any;
    get [Symbol.toStringTag](): string;
    get $(): TypeConfig;
    protected __get(v: any): any;
    protected __set(v: any): any;
    setValue<T>(v: T): Promise<T>;
    static get(cb: (value: any) => any): TypeConstructor;
    static set(cb: (value: any) => any): TypeConstructor;
    static default(value: any): TypeConstructor;
    protected static _configure(name: string, value: any): TypeConstructor;
    static get Any(): typeof Any;
}
export declare class Any extends Type {
    constructor(value: any);
    static [Symbol.hasInstance](): boolean;
}
//# sourceMappingURL=type.d.ts.map