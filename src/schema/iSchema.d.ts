import ISource from '../source/iSource';
import IQuery from '../query/iQuery';
import IModel from '../model/iModel';

export default interface ISchema
{
    source: ISource<any>|undefined;
    prepare<T extends IModel<T>>(query: IQuery<T>, args?: object): Promise<any>;
    map(data: AsyncGenerator<object, void, void>): AsyncGenerator<object, void, void>;
}