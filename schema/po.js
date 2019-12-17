import Schema from './schema.js';

export default class Po extends Schema
{
    #path;

    constructor(path)
    {
        super();

        this.#path = path;
    }

    prepare(query)
    {
        return `${this.#path}`;
    }
    //
    // interpretate(lines, limit = null)
    // {
    //     let k = '';
    //     let i  = 0;
    //     let values = {};
    //
    //     out:
    //         for(let line of lines)
    //         {
    //             let match = line.match(Po.regex);
    //
    //             if(match === null)
    //             {
    //                 continue;
    //             }
    //
    //             switch (match[1])
    //             {
    //                 case "msgid":
    //                     k = match[2];
    //                     values[k] = '';
    //
    //                     i++;
    //
    //                     if(i === limit)
    //                     {
    //                         break out;
    //                     }
    //
    //                     break;
    //
    //                 case "msgstr":
    //                     values[k] += match[2];
    //                     break;
    //             }
    //         }
    //
    //     return values;
    // }
    //
    // aggregate(args)
    // {
    //     const langs = Object.keys(args);
    //     const keys = Object.values(args).map(a => Object.keys(a)).reduce((t, a) => [ ...t, ...a ].unique(), []);
    //
    //     return keys.map(k => {
    //         const obj = { key: k };
    //
    //         for(let lang of langs)
    //         {
    //             obj[lang] = args[lang][k];
    //         }
    //
    //         return obj;
    //     });
    // }
    //
    // deAggregate(args)
    // {
    //     return args;
    // }
    //
    // static get regex()
    // {
    //     return /^(msgid|msgstr)\s"(.+)"$/;
    // }
}