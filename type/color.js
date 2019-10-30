import Type from './type.js';

export default class extends Type
{
    #hue = .5;
    #saturation = .5;
    #lightness = .5;
    #alpha = .5;

    constructor()
    {
        super();
    }

    get hue()
    {
        return this.#hue;
    }

    get saturation()
    {
        return this.#saturation;
    }

    get lightness()
    {
        return this.#lightness;
    }

    get alpha()
    {
        return this.#alpha;
    }
}