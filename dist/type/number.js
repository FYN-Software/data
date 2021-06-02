import Type from './type';
export default class Num extends Type {
    constructor(value) {
        super({ value: 0, min: -Infinity, max: Infinity }, value);
    }
    __set(v) {
        if (Number.isNaN(v) === true) {
            throw new Error(`Given value '${v}' is NaN`);
        }
        return v.clamp(this.$.min, this.$.max);
    }
    static min(i) {
        return this._configure('min', i);
    }
    static max(i) {
        return this._configure('max', i);
    }
    static [Symbol.hasInstance](v) {
        return typeof v === 'number' || v.constructor === this;
    }
}
