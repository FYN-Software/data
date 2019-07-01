import Type from './type.js';

export default class extends Type
{
    static get view()
    {
        return import('../../suite/js/common/form/datetime.js').then(m => m.default);
    }
}