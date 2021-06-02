import { Order } from './iQuery';
export { Order };
export default class Query {
    constructor(target) {
        this._methods = [];
        this._target = target;
    }
    *[Symbol.iterator]() {
        yield* this._methods;
    }
    get target() {
        return this._target;
    }
    get methods() {
        return this._methods;
    }
    find(args = {}) {
        return this.limit(1).target.find(this, args);
    }
    async *findAll(args = {}) {
        yield* this.target.findAll(this, args);
    }
    insert(...args) {
        this._methods.push(['insert', args]);
        return this;
    }
    update(...args) {
        this._methods.push(['update', args]);
        return this;
    }
    where(...args) {
        this._methods.push(['where', args]);
        return this;
    }
    select(...args) {
        this._methods.push(['select', args]);
        return this;
    }
    order(order) {
        this._methods.push(['order', [order]]);
        return this;
    }
    limit(...args) {
        this._methods.push(['limit', args]);
        return this;
    }
    static where(model, ...args) {
        return new this(model).where(...args);
    }
    static select(model, ...args) {
        return new this(model).select(...args);
    }
    static order(model, order) {
        return new this(model).order(order);
    }
    static limit(model, ...args) {
        return new this(model).limit(...args);
    }
}
