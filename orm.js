import Model from './model.js';

import Api from './adapter/api.js';
import Database from './adapter/database.js';
import File from './adapter/file.js';

import Table from './schema/table.js';
import Po from './schema/po.js';
import Rest from './schema/rest.js';

const Adapter = {
    Api,
    Database,
    File,
};

const Schema = {
    Table,
    Po,
    Rest,
};

export {
    Model,
    Adapter,
    Schema,
};