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

    async *fetch(query, args)
    {
        throw new Error('Not implemented');
    }

    static get default()
    {
        return class extends this
        {
            async *fetch(query, args)
            {
                yield* this.owner.getSource('default').fetch(query, args);
            }
        };
    }
}