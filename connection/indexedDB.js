import * as Comlink from 'https://cdn.jsdelivr.net/npm/comlink@4.2.0/dist/esm/comlink.min.mjs';
import idb from '../../core/driver/idb.js';
import Connection from './connection.js';

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
        try
        {
            if(query.methods.some(([ m ]) => [ 'insert', 'update' ].includes(m)))
            {
                await (await this.constructor.open()).put(this.#store, query.target.toTransferable());

                yield* [];
            }
            else
            {
                yield* await (await this.constructor.open()).get(this.#store);
            }
        }
        catch (e)
        {
            console.error(e);
        }
    }

    static define(name, stores, version)
    {
        return class extends IndexedDB
        {
            static #name = name;
            static #stores = stores;
            static #version = version;
            static #db = null;

            // static async open()
            // {
            //     if(this.#db === null)
            //     {
            //         this.#db = await new DB(this.#name);
            //
            //         await this.#db.open(this.#stores, this.#version);
            //     }
            //
            //     return this.#db;
            // }

            static async open()
            {
                if(this.#db === null)
                {
                    this.#db = new idb(this.#name);

                    await this.#db.open(this.#stores, this.#version);
                }

                return this.#db;
            }
        }
    }
}