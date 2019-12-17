export default class Schema
{
    constructor()
    {

    }

    prepare(query)
    {
        throw new Error(`Not implemented`);
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