export default class Schema
{
    constructor()
    {

    }

    prepare(query)
    {
        throw new Error(`Not implemented`);
    }

    static get default()
    {
        return class extends this
        {
        }
    }
}