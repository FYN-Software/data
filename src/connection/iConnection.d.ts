import ISource from '../source/iSource';

export default interface IConnection
{
    source: ISource<any>|undefined;
    fetch(query: any, args?: object): AsyncGenerator<any, void, void>;
}