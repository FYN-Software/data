import Type from './type';
export default class Bool extends Type {
    constructor(value) {
        super({ value: false, nullable: false }, value);
    }
    __set(v) {
        if (this.$.nullable === true && (v === null || v === undefined)) {
            return undefined;
        }
        if (typeof v === 'string') {
            v = {
                true: true,
                false: false,
            }[v] ?? v;
        }
        return Boolean(v);
    }
    static [Symbol.hasInstance](v) {
        return typeof v === 'boolean' || v.constructor === this;
    }
    static get nullable() {
        return this._configure('nullable', true);
    }
}
