import Type from './type.js';

const array = Array;

export default Type.proxyfy(class Array extends Type
{
    set(v)
    {
        if((v instanceof array) === false)
        {
            console.error(`Expected an 'Array', got '${v}'`);

            throw new Error(`Expected an 'Array', got '${v}'`);
        }

        return v;
    }
});