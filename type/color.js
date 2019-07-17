import Type from './type.js';

const hue = Symbol('hue');
const saturation = Symbol('saturation');
const lightness = Symbol('lightness');
const alpha = Symbol('alpha');

export default class extends Type
{
    constructor()
    {
        super();

        this[hue] = .5;
        this[saturation] = .5;
        this[lightness] = .5;
        this[alpha] = .5;
    }

    get hue()
    {
        return this[hue];
    }

    get saturation()
    {
        return this[saturation];
    }

    get lightness()
    {
        return this[lightness];
    }

    get alpha()
    {
        return this[alpha];
    }
}