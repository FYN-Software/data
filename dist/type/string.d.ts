import Type from './type';
export default class Str extends Type {
    constructor(value: any);
    get [Symbol.toStringTag](): string;
    protected __set(v: any): string;
    static min(i: number): typeof Type;
    static max(i: number): typeof Type;
    static [Symbol.hasInstance](v: string | Str): boolean;
}
//# sourceMappingURL=string.d.ts.map