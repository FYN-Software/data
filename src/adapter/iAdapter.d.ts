import ISource from '../source/iSource.js';

export default interface IAdapter
{
    source: ISource<any>|undefined;

    from(data: AsyncGenerator<any, void, void>): AsyncGenerator<object, void, void>;
    to(data: AsyncGenerator<any, void, void>): AsyncGenerator<any, void, void>;

    compile(query: any): any;
}