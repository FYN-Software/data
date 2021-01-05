import Connection from './connection.js';
import EventSource from 'https://fyncdn.nl/node_modules/@fyn-software/core/driver/eventSource.js';

export default class Feed extends Connection
{
    #url;
    #event;
    #options;

    constructor(url, event, options = {})
    {
        super();

        this.#url = url;
        this.#event = event;
        this.#options = options;
    }

    async *fetch(query, args)
    {
        const url = query?.url ?? this.#url;
        const options = { ...this.#options, ...query.options };
        const eventSource = new EventSource(url, options);

        yield* eventSource.listenFor(this.#event);
    }
}