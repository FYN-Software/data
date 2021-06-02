import Type from './type';
const properties = Symbol('properties');
const indices = Symbol('indices');
const keys = Symbol('keys');
const values = Symbol('values');
export default class Enum extends Type {
    constructor(value) {
        super({ value: null, template: null, enum: true }, value);
    }
    __set(v) {
        if (v === undefined) {
            return v;
        }
        const c = this.constructor;
        if (typeof v === 'string' && c[values].has(v)) {
            return c[values].get(v);
        }
        if ((v instanceof this.constructor) === false) {
            const k = Array.from(c[keys].values(), k => `${k}`);
            throw new Error(`'${v.toString()}' is not a value of this Enum, expected one of [${k}]`);
        }
        return v;
    }
    [Symbol.toPrimitive](hint) {
        return this.constructor.nameOf(this.$.value);
    }
    get [Symbol.toStringTag]() {
        return `${super[Symbol.toStringTag]}.Enum`;
    }
    static [Symbol.hasInstance](v) {
        return (typeof v === 'symbol' && this[keys].has(v)) || (v !== null && v !== undefined && v.constructor === this);
    }
    static define(template) {
        const self = this._configure('template', Object.seal({ ...template }));
        self[Symbol.iterator] = function* () {
            //NOTE(Chris Kruining)
            // Use destructor + rest to copy
            // items instead of reference
            for (const [k, { ...v }] of Object.entries(self[properties])) {
                v.value = self[values].get(k);
                v._key = k;
                yield v;
            }
        };
        self.prototype[Symbol.iterator] = self[Symbol.iterator];
        self[properties] = template;
        self[indices] = new Map();
        self[keys] = new Map();
        self[values] = new Map();
        for (const [i, k] of Object.entries(Object.keys(template))) {
            const s = Symbol(k);
            self[indices].set(s, Number.parseInt(i));
            self[keys].set(s, k);
            self[values].set(k, s);
            Object.defineProperty(self, k, { value: s });
        }
        return self;
    }
    static nameOf(k) {
        return this[keys].get(k);
    }
    static indexOf(k) {
        return this[indices].get(k);
    }
    static valueOf(k) {
        return this[properties][this.nameOf(k)];
    }
}
