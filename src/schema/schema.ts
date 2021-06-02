import ISchema from './iSchema';
import ISource from '../source/iSource.js';
import IQuery from '../query/iQuery.js';
import IModel from '../model/iModel.js';

export default abstract class Schema implements ISchema
{
    private _source: ISource<any>|undefined;

    public get source(): ISource<any>|undefined
    {
        return this._source;
    }

    public set source(s: ISource<any>|undefined)
    {
        this._source = s;
    }

    protected constructor()
    {

    }

    public async prepare<T extends IModel<T>>(query: IQuery<T>, args: object = {}): Promise<any>
    {
        return query;
    }

    public async *map(data: AsyncGenerator<any, void, void>): AsyncGenerator<any, void, void>
    {
        yield* data;
    }

    public static get default(): typeof Schema
    {
        return class extends this
        {
        }
    }
}