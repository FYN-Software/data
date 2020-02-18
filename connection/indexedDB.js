import * as Comlink from 'https://unpkg.com/comlink/dist/esm/comlink.mjs';
import Connection from './connection.js';

const DB = Comlink.wrap(new Worker('/node_modules/@fyn-software/core/driver/idb.js', { type: 'module' }));

export default class IndexedDB extends Connection
{
    #store;

    constructor(store)
    {
        super();

        this.#store = store;
    }

    static async open()
    {
        throw new Error('Not implemented');
    }

    async *fetch(query, args)
    {
        if(query.methods.some(([ m ]) => m === 'insert'))
        {
            await (await this.constructor.open()).put(this.#store, query.target.toTransferable());

            yield * [];
        }
        else
        {
            yield* await (await this.constructor.open()).get(this.#store);
        }
    }

    async put(query, ...rows)
    {
        return (await this.constructor.open()).put(this.#store, ...rows);
    }

    static define(name, stores, version)
    {
        return class extends IndexedDB
        {
            static #name = name;
            static #stores = stores;
            static #version = version;
            static #db = null;

            static async open()
            {
                if(this.#db === null)
                {
                    this.#db = await new DB(this.#name);

                    await this.#db.open(this.#stores, this.#version);
                }

                return this.#db;
            }
        }
    }
}