import Type from './type.js';

const structure = Symbol('structure');

export default class extends Type
{
    constructor()
    {
        super();

        this.default({});
    }

    static define(p)
    {
        const normalize = (node) => {
            for(const k of Object.getOwnPropertyNames(node))
            {
                if((node[k] instanceof Type) === false && (node[k].prototype instanceof Type) === true)
                {
                    node[k] = new node[k]();
                }
                else if(typeof p[k] === 'object')
                {
                    normalize(p[k]);
                }
            }
        };

        p = Object.freeze(normalize(p));

        return class extends this
        {
            constructor()
            {
                super();

                for(const [ k, p ] of Object.entries({ ...this.constructor[structure] }))
                {
                    if((p instanceof Type) === false && (p.prototype instanceof Type) === true)
                    {
                        this.constructor[structure][k] = new p();
                    }

                    try
                    {
                        p.on({ changed: () => this.emit('changed') });
                    }
                    catch {}

                    Object.defineProperty(this, k, {
                        get: () => p.__value,
                        set: p.setValue.bind(p),
                        enumerable: true,
                    });
                }

                this.setValue(this);
            }

            static get [structure]()
            {
                return { ...p };
            }
        };
    }

    static [Symbol.hasInstance](v)
    {
        if(this.hasOwnProperty(structure) === false)
        {
            return typeof v === 'object';
        }

        console.log(this, this.hasOwnProperty(structure), v);

        return true;
    }

    static fromClass(c)
    {
        console.dir(c);

        return class extends c
        {
            static get [Symbol.species]()
            {
                return Type;
            }

            get __value()
            {
                return this;
            }
        };
    }
}