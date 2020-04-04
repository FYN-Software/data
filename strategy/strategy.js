export default class Strategy
{
    #owner;

    constructor()
    {
    }

    get owner()
    {
        return this.#owner;
    }

    set owner(s)
    {
        this.#owner = s;
    }

    async *fetch(sources, query, args)
    {
        throw new Error('Not implemented');
    }
}