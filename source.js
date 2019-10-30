import Adapter from './adapter/adapter.js';
import Connection from './connection/connection.js';
import Schema from './schema/schema.js';

export default class Source
{
    #connection;
    #adapter;
    #schema;

    constructor(connection, adapter, schema)
    {
        if((connection instanceof Connection) === false)
        {
            throw new Error(`Expected and instance of '${Connection.name}' got '${connection}' instead`);
        }

        if((adapter instanceof Adapter) === false)
        {
            throw new Error(`Expected and instance of '${Adapter.name}' got '${adapter}' instead`);
        }

        if((schema instanceof Schema) === false)
        {
            throw new Error(`Expected and instance of '${Schema.name}' got '${schema}' instead`);
        }

        this.#connection = connection;
        this.#adapter = adapter;
        this.#schema = schema;
    }

    async *fetch(query, args)
    {
        for await (const r of this.#connection.fetch(this.#schema.prepare(query)))
        {
            yield this.#adapter.from(r);
        }
    }
}