export function queryCheck<t extends HTMLElement>(select: string): t{
    const query = document.querySelector(select);
    if(!query)
        throw new Error(`Element ${select} does not exist`)
    return query as t;
}
export function queryAllCheck<t extends HTMLElement>(select: string): NodeListOf<t>{
    const query = document.querySelectorAll(select) as NodeListOf<t>;
    if(query.length === 0)
        throw new Error(`Element ${select} does not exist`)
    return query;
}

