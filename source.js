import Adapter from './adapter/adapter.js';
import Connection from './connection/connection.js';
import Schema from './schema/schema.js';

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
        const inner = async function* (self){
            for await (const r of self.#connection.fetch(self.#schema.prepare(query, args), args))
            {
                yield* self.#adapter.from(r);
            }
        };

        yield* this.#schema.map(inner(this));
    }
}