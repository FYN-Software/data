const _database = Symbol('database');
const _table = Symbol('table');

export default class Table
{
    constructor(database = '', table = '')
    {
        this[_database] = database;
        this[_table] = table;
    }

    get database()
    {
        return this[_database];
    }

    get table()
    {
        return this[_table];
    }

    static get Types()
    {

    }
}