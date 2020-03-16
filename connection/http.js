import Connection from './connection.js';

export default class Http extends Connection
{
    #url;
    #options = { credentials: 'same-origin' };

    constructor(url, options)
    {
        super();

        this.#url = url;
        this.#options = { ...this.#options, ...options };
    }

    async *fetch(query, args)
    {
        yield (await fetch(`${this.#url}${query.url}`, { ...this.#options, ...query.options })).text();
    }
}