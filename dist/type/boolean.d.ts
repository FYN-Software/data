import Type from './type';
export default class Bool extends Type {
    constructor(value: boolean | undefined);
    protected __set(v: boolean | string | undefined): boolean | undefined;
    static [Symbol.hasInstance](v: Bool | boolean): boolean;
    static get nullable(): typeof Type;
}
//# sourceMappingURL=boolean.d.ts.map