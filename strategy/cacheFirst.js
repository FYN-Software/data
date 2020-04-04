import Strategy from './strategy.js';

export default class CacheFirst extends Strategy
{
    #cache;
    #fallback;

    constructor(cache, fallback)
    {
        super();

        this.#cache = cache;
        this.#fallback = fallback;
    }

    async *fetch(query, args)
    {
        // TODO(Chris Kruining) Implement actual strategy
        yield* this.owner.getSource(this.#fallback).fetch(query, args);
    }
}