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

    async *fetch(query)
    {
        yield (await fetch(`${this.#url}${query}`, this.#options)).text();
    }
}