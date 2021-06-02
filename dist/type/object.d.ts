import Type from './type';
declare type ObjectConfig = {
    [key: string]: Constructor<IType> | ObjectConfig;
};
export declare type ObjectTemplate = {
    [key: string]: Constructor<IType>;
};
export default class extends Type {
    constructor(value: any);
    protected __set(value: any): any;
    [Symbol.toPrimitive](hint: string): object;
    get [Symbol.toStringTag](): string;
    static get [Symbol.iterator](): [string, any][];
    static define(template: ObjectConfig): TypeConstructor;
    static [Symbol.hasInstance](v: object): boolean;
}
export {};
//# sourceMappingURL=object.d.ts.map