import Type from './type.js';

export default class extends Type
{
    __set(v)
    {
        return Boolean(v);
    }
}