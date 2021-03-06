import Type from './type';
const structure = Symbol('structure');
export default class extends Type {
    constructor(value) {
        super({ value: {}, template: {}, props: {} }, value);
        for (const k of Object.keys(this.$.template)) {
            if (this.hasOwnProperty(k) === false) {
                Object.defineProperty(this, k, {
                    get: () => this.$.value[k],
                    set: v => this.$.value[k] = v,
                    configurable: false,
                    enumerable: true,
                });
            }
        }
    }
    __set(value) {
        if (value === null || value === undefined) {
            return value;
        }
        if (typeof value !== 'object') {
            value = {};
        }
        const returnValue = { ...value };
        for (const [k, v] of Object.entries(this.$.template)) {
            const property = new v(value[k] ?? undefined);
            if ((property instanceof v) === false) {
                throw new Error(`Type mismatch, expected instance of '${v.name}', got '${value[k]}' instead`);
            }
            if (returnValue.hasOwnProperty(k) === true) {
                if (Object.getOwnPropertyDescriptor(returnValue, k)?.configurable === false) {
                    returnValue[k] = value[k];
                    continue;
                }
                delete returnValue[k];
            }
            property.on({
                changed: d => {
                    this.emit('changed', { ...d, property: k });
                },
            });
            Object.defineProperty(returnValue, k, {
                get: () => property.$.value,
                set: v => property.setValue(v),
                configurable: false,
                enumerable: true,
            });
            Object.defineProperty(this.$.props, k, {
                value: property,
                configurable: true,
                enumerable: true,
            });
        }
        for (const [name, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(this.$.template))) {
            if (descriptor.get === undefined) {
                continue;
            }
            Object.defineProperty(returnValue, name, descriptor);
        }
        return returnValue;
    }
    [Symbol.toPrimitive](hint) {
        switch (hint) {
            case 'transferable':
            case 'clone':
            default:
                {
                    return Object.freeze(Object.fromEntries(Object
                        .keys(this.$.template)
                        .map(k => [k, this.$.props[k][Symbol.toPrimitive](hint)])));
                }
        }
    }
    get [Symbol.toStringTag]() {
        return `${super[Symbol.toStringTag]}.Object`;
    }
    static get [Symbol.iterator]() {
        return Object.entries(this);
    }
    static define(template) {
        for (const [key, item] of Object.entries(template)) {
            if ((item.prototype instanceof Type) === false && typeof item === 'object') {
                template[key] = this.define(item);
            }
        }
        return this._configure('template', template);
    }
    static [Symbol.hasInstance](v) {
        if (this.hasOwnProperty(structure) === false) {
            return typeof v === 'object';
        }
        return true;
    }
}
