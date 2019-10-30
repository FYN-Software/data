import Schema from './schema.js';

export default class Table extends Schema
{
    #database;
    #table;

    constructor(database = '', table = '')
    {
        super();

        this.#database = database;
        this.#table = table;
    }

    get database()
    {
        return this.#database;
    }

    get table()
    {
        return this.#table;
    }

    static get Types()
    {

    }
}