import * as Comlink from 'https://unpkg.com/comlink/dist/esm/comlink.mjs';
import Connection from './connection.js';

const DB = Comlink.wrap(new Worker('/node_modules/@fyn-software/core/driver/idb.js', { type: 'module' }));

export default class IndexedDB extends Connection
{
    #name;
    #stores;
    #version;
    #db = null;

    constructor(name, stores, version)
    {
        super();

        this.#name = name;
        this.#stores = stores;
        this.#version = version;
    }

    async open()
    {
        if(this.#db !== null)
        {
            return;
        }

        this.#db = await new DB(this.#name);

        await this.#db.open(this.#stores, this.#version);
    }

    async fetch(store, query)
    {
        await this.open();

        return this.#db.get(store, query);
    }

    async put(store, ...rows)
    {
        await this.open();

        return this.#db.put(store, ...rows);
    }
}