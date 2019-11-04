export default class Adapter
{
    #from;
    #to;

    constructor({ from, to } = { from: d => d, to: d => d })
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