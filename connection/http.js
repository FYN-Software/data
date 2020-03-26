import Connection from './connection.js';

export default class Http extends Connection
{
    #url;
    #reader;
    #options = { credentials: 'same-origin' };

    constructor(url, options, reader = null)
    {
        super();

        this.#url = url;
        this.#options = { ...this.#options, ...options };
        this.#reader = reader ?? async function*(response) {
            yield response.text();
        };
    }

    async *fetch(query, args)
    {
        yield this.#reader(await fetch(`${this.#url}${query.url}`, { ...this.#options, ...query.options }));
    }
}