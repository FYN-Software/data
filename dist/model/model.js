import QueuedPromise from '@fyn-software/core/queuedPromise';
import Field from './field';
import Query from '../query/query';
import HasMany from '../relation/hasMany';
import HasOne from '../relation/hasOne';
import OwnsMany from '../relation/ownsMany';
import OwnsOne from '../relation/ownsOne';
import ObjectType from '../type/object';
export default class Model extends ObjectType {
    constructor(value) {
        super(value);
        this._strategies = new Map();
        this._strategy = 'default';
        this._sources = new Map();
        this._source = 'default';
        this._raw = false;
        this._new = true;
        const constructor = this.constructor;
        if (constructor.strategies !== undefined) {
            this._strategies = new Map(Object.entries(constructor.strategies));
            for (const strategy of this._strategies.values()) {
                strategy.owner = this;
            }
        }
        this._sources = new Map(Object.entries(constructor.sources));
        for (const source of this._sources.values()) {
            source.owner = this;
        }
    }
    static get properties() {
        return {};
    }
    static get sources() {
        throw new Error(`Not implemented`);
    }
    get strategy() {
        return this._source;
    }
    set strategy(strategy) {
        this._strategy = strategy;
    }
    get source() {
        return this._source;
    }
    set source(source) {
        this._source = source;
    }
    get new() {
        return this._new;
    }
    set new(value) {
        this._new = value;
    }
    get raw() {
        return this._raw;
    }
    set raw(value) {
        this._raw = value;
    }
    toTransferable() {
        return this[Symbol.toPrimitive]('transferable');
    }
    async *fetch(query, args) {
        const source = this._strategies.get(this._strategy)
            ?? this._sources.get(this._source)
            ?? this._sources.get('default');
        yield* source.fetch(query, args);
    }
    getSource(source) {
        return this._sources.get(source);
    }
    to(source) {
        this._source = source;
        return this;
    }
    async save() {
        try {
            await Array.fromAsync(this.fetch(new Query(this)[this.new ? 'insert' : 'update'](this.$.value), {}));
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    find(query, args = {}) {
        return new QueuedPromise((async () => {
            for await (const v of this.fetch(query, args)) {
                if (this._raw === true) {
                    return v;
                }
                const model = this.constructor;
                return v === undefined
                    ? null
                    : (() => {
                        const inst = new model(v);
                        inst.new = false;
                        return inst;
                    })();
            }
        })());
    }
    async *findAll(query, args = {}) {
        if (this._raw === true) {
            yield* this.fetch(query, args);
            return;
        }
        const model = this.constructor;
        for await (const r of this.fetch(query, args)) {
            const inst = new model(r);
            inst.new = false;
            yield inst;
        }
    }
    static from(source) {
        const inst = new this;
        inst.source = source;
        return new Query(inst);
    }
    static where(...args) {
        return new Query(new this).where(...args);
    }
    static select(...args) {
        return new Query(new this).select(...args);
    }
    static order(order) {
        return new Query(new this).order(order);
    }
    static limit(...args) {
        return new Query(new this).limit(...args);
    }
    static find(...args) {
        return new Query(new this).find(...args);
    }
    static async *findAll(...args) {
        yield* (new Query(new this).findAll(...args));
    }
    static hasMany(target) {
        return HasMany.ownedBy(this).targets(target);
    }
    static ownsMany(target) {
        return OwnsMany.ownedBy(this).targets(target);
    }
    static hasOne(target) {
        return HasOne.ownedBy(this).targets(target);
    }
    static ownsOne(target) {
        return OwnsOne.ownedBy(this).targets(target);
    }
    static withSources(sources) {
        return this._configure('sources', sources);
    }
    static initialize(model) {
        if ((model.prototype instanceof this) === false) {
            throw new Error(`Expected a '${this.name}', got '${model}' instead`);
        }
        for (const [name, type] of Object.entries(model.properties)) {
            Object.defineProperty(model, name, {
                value: new Field(name, type),
                writable: false,
                enumerable: true,
            });
        }
        const properties = { ...model.properties };
        for (const [name, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(model.prototype))) {
            if (descriptor.get === undefined) {
                continue;
            }
            Object.defineProperty(properties, name, descriptor);
        }
        return Model.withSources(model.sources).define(properties);
    }
}
