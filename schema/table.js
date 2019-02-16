const database = Symbol('database');
const table = Symbol('table');

export default class Table
{
    constructor(database = '', table = '')
    {
        this[database] = database;
        this[table] = table;
    }

    get database()
    {
        return this[database];
    }

    get table()
    {
        return this[table];
    }
}