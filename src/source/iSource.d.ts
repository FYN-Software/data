import IConnection from '../connection/iConnection';
import IAdapter from '../adapter/iAdapter';
import ISchema from '../schema/iSchema';
import IModel from '../model/iModel.js';
import IQuery from '../query/iQuery.js';

export default interface ISource<T extends IModel<T>>
{
    owner: IModel<T>|undefined;
    readonly connection: IConnection;
    readonly adapter: IAdapter;
    readonly schema: ISchema;

    fetch(query: IQuery<T>, args: object): AsyncGenerator<object, void, void>;
}