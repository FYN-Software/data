import Schema from './schema.js';

export default class Rest extends Schema
{
    #path;

    constructor(path)
    {
        super();

        this.#path = path;
    }

    prepare(query)
    {
        return `${this.#path}?${Array.from(query, ([ method, args ]) => `${method}=${encodeURIComponent(JSON.stringify(args))}`).join('&')}`;
    }
}