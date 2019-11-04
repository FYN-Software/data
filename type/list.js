import item from '../../suite/js/common/navigation/item.js';
import Type from './type.js';

export default class List extends Type
{
    constructor()
    {
        super({ value: [], type: Type });
    }

    __set(v)
    {
        if(Array.isArray(v) === false)
        {
            throw new Error(`Expected an 'Array', got '${v.constructor.name}'`);
        }

        if(this.type !== null && v.some(i => (i instanceof this.type) === false))
        {
            throw new Error(`Not all items are of type '${this.type.name}'`);
        }

        return new Proxy(this.normalize(v), {
            get: (target, property) => {
                switch (property)
                {
                    case Symbol.iterator:
                        return this[Symbol.iterator];

                    case 'push':
                        return this.typeCheck(target, property);

                    default:
                        return target[property];
                }
            },
            // set: (target, property, value, receiver) => {
            //     target[property] = value;
            //
            //     return true;
            // }
        });
    }

    typeCheck(target, method)
    {
        return (...items) => {
            if(items.some(i => (i instanceof this.type) === false))
            {
                throw new Error(`Not all items are of type '${this.type.name}'`);
            }

            return target[method].apply(target, this.normalize(items));
        }
    }

    normalize(items)
    {
        return items.map(i => i[Symbol.toStringTag] !== undefined ? i : new this.type(i));
    }

    get [Symbol.iterator]()
    {
        const value = this.value.map(i => i.value);

        return value[Symbol.iterator].bind(value);
    }

    static type(t)
    {
        if((t.prototype instanceof Type) === false)
        {
            throw new Error(`expected '${Type.name}' got '${t.name}' instead`);
        }

        return this._configure('type', t);
    }
}