import * as Comlink from 'https://unpkg.com/comlink/dist/esm/comlink.mjs';
import idb from '../../core/driver/idb.js';
import Connection from './connection.js';

// const DB = Comlink.wrap(new Worker('/crossOriginWorker.js?module=https://cdn.fyn.nl/node_modules/@fyn-software/core/driver/idb.js', { type: 'module' }));

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