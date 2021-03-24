import * as Comlink from 'https://fyncdn.nl/js/lib/comlink/comlink.js';
import Idb from '../../core/driver/idb.js';
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

            static async open()
            {
                if(this.#db === null)
                {
                    this.#db = new Idb(this.#name);

                    await this.#db.open(this.#stores, this.#version);
                }

                return this.#db;
            }
        }
    }
}