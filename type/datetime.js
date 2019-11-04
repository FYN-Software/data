import Type from './type.js';

export default class extends Type
{
    constructor(value)
    {
        super({ value: value || Date.now()});
    }
}