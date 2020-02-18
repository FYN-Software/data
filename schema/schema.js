export default class Schema
{
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