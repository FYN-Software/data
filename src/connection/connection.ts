import IConnection from './iConnection';
import ISource from '../source/iSource';

export default abstract class Connection implements IConnection
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

    async *fetch(query: any, args: object = {}): AsyncGenerator<any, void, void>
    {
    }

    public static get default(): typeof Connection
    {
        return class extends this
        {
        }
    }
}