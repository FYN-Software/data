export default class Adapter
{
    #from;
    #to;

    constructor({ from, to } = { from: async function*(d){ yield d; }, to: async function*(d){ yield d; } })
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
            async from(data)
            {
                return data;
            }

            async to(data)
            {
                return data;
            }
        }
    }
}