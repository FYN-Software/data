export default class Schema
{
    #source;

    get source()
    {
        return this.#source;
    }

    set source(s)
    {
        this.#source = s;
    }

    constructor()
    {

    }

    prepare(query)
    {
        return query;
    }

    async *map(data)
    {
        yield* data;
    }

    static get default()
    {
        return class extends this
        {
        }
    }
}