export default class Adapter
{
    #from;
    #to;
    #source;

    get source()
    {
        return this.#source;
    }

    set source(s)
    {
        this.#source = s;
    }

    constructor({ from, to } = { from: async function*(d){ yield* d; }, to: async function*(d){ yield* d; } })
    {
        this.#from = from;
        this.#to = to;
    }

    async *from(data)
    {
        yield* this.#from(data);
    }

    async to(data)
    {
        return this.#to(data);
    }

    compile(query)
    {
        return query;
    }

    static get default()
    {
        return class extends this
        {
        }
    }
}