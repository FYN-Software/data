import IType from './iType';
import Type from './type';
declare type FilterCallback<T> = (item: T, index?: number) => boolean;
declare type MapCallback<TIn, TOut> = (item: TIn, index?: number) => TOut;
export default class List<T extends IType> extends Type {
    private queue;
    constructor(value: any);
    protected __set(v: any): any;
    [Symbol.toPrimitive](hint: string): any;
    get [Symbol.toStringTag](): string;
    filter(callback: FilterCallback<T>): List<T>;
    map<TOut>(callback: MapCallback<T, TOut>): List<T>;
    private typeCheck;
    private normalize;
    static [Symbol.hasInstance](v: Array<any> | List<any>): boolean;
    [Symbol.iterator](): Iterable<T>;
    [Symbol.asyncIterator](): AsyncIterable<any>;
    static type<T extends IType>(t: Constructor<T>): typeof Type;
}
export {};
//# sourceMappingURL=list.d.ts.map