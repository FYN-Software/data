import Type from './type';
export default class Num extends Type {
    constructor(value: any);
    protected __set(v: any): number;
    static min(i: number): typeof Type;
    static max(i: number): typeof Type;
    static [Symbol.hasInstance](v: number | Num): boolean;
}
//# sourceMappingURL=number.d.ts.map