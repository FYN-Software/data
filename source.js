import Adapter from '@fyn-software/data/adapter/adapter.js';
import Connection from '@fyn-software/data/connection/connection.js';
import Schema from '@fyn-software/data/schema/schema.js';

export default class Source
{
    #owner;
    #connection;
    #adapter;
    #schema;

    get owner()
    {
        return this.#owner;
    }

    set owner(s)
    {
        this.#owner = s;
    }

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

        connection.source = this;
        adapter.source = this;
        schema.source = this;
    }

    async *fetch(query, args)
    {
        yield* this.#schema.map(this.#adapter.from(this.#connection.fetch(await this.#schema.prepare(query, args), args)));
    }
}