import Type from './type';
declare const properties: unique symbol;
declare const indices: unique symbol;
declare const keys: unique symbol;
declare const values: unique symbol;
declare type EnumTemplate = {
    [key: string]: object;
};
declare type EnumConstructor = {
    new (): Enum;
    nameOf(k: symbol): string | undefined;
    indexOf(k: symbol): number | undefined;
    valueOf(k: symbol): any;
    [Symbol.iterator]: Iterable<any>;
    [properties]: EnumTemplate;
    [values]: Map<string, symbol>;
    [keys]: Map<symbol, string>;
    [indices]: Map<symbol, number>;
};
export default class Enum extends Type {
    constructor(value: string | symbol | undefined);
    protected __set<T extends Enum>(v: T | string | symbol | undefined): symbol | undefined;
    [Symbol.toPrimitive](hint: string): string | undefined;
    get [Symbol.toStringTag](): string;
    static [Symbol.hasInstance]<T extends Enum>(this: EnumConstructor, v: T | string | symbol): boolean;
    static define(template: EnumTemplate): EnumConstructor;
    static nameOf(this: EnumConstructor, k: symbol): string | undefined;
    static indexOf(this: EnumConstructor, k: symbol): number | undefined;
    static valueOf(this: EnumConstructor, k: symbol): any;
}
export {};
//# sourceMappingURL=enum.d.ts.map