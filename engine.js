import Model from './model.js';
import Source from './source.js';

import AdapterBase from './adapter/adapter.js';
import Json from './adapter/json.js';
import Api from './adapter/api.js';
import Sql from './adapter/sql.js';

import SchemaBase from './schema/schema.js';
import Table from './schema/table.js';
import Po from './schema/po.js';
import Rest from './schema/rest.js';
import Bitbucket from './schema/bitbucket.js';

import ConnectionBase from './connection/connection.js';
import Database from './connection/database.js';
import IndexedDB from './connection/indexedDB.js';
import Http from './connection/http.js';
import File from './connection/file.js';

const Adapter = {
    Adapter: AdapterBase,
    Json,
    Sql,
};

const Schema = {
    Schema: SchemaBase,
    Table,
    Po,
    Rest,
    Bitbucket,
};

const Connection = {
    Connection: ConnectionBase,
    Http,
    Database,
    IndexedDB,
    File,
};

export {
    Model,
    Source,
    Connection,
    Adapter,
    Schema,
};