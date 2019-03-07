import Type from './type.js';

const type = Symbol('type');

export default class List extends Type
{
    constructor()
    {
        super();

        this.__value = [];
        this[type] = Object;
    }

    __set(v)
    {
        if((v instanceof Array) === false)
        {
            throw new Error(`Expected an 'Array', got '${v}'`);
        }

        if(v.some(i => (i instanceof this[type]) === false))
        {
            throw new Error(`Not all items are of type '${this[type].name}'`);
        }

        return v;
    }

    push(...items)
    {
        if(items.some(i => (i instanceof this[type]) === false))
        {
            throw new Error(`Not all items are of type '${this[type].name}'`);
        }

        if(items.length > 0)
        {
            this.__value.push(...items);

            this.emit('pushed', items);
        }

        return this;
    }

    get [Symbol.iterator]()
    {
        return this.__value[Symbol.iterator].bind(this.__value);
    }

    type(t)
    {
        this[type] = t;

        return this;
    }

    static type(t)
    {
        return new this().type(t);
    }
}