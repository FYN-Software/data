import Type from './type.js';

export default class extends Type
{
    set(v)
    {
        return Boolean(v);
    }
}