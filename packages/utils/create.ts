
export type Mod = string | { [key: string] : any}
export type Mods = Mod | Mod[]


// bem helper
function createBem(prefixName:string) {
     return (element?:Mods,modifier?:Mods):Mods => {
         if(element && typeof element!=='string') {
             modifier = element
             element = ''
         }
         element = element ? `${prefixName}__${element}` : prefixName
         return `${element}${genBem(element,modifier)}`
     }
}

function genBem(name:Mods,modifier?:Mods):Mods {
     if(!modifier) return '';
     if(typeof modifier === 'string') {
         return ` ${name}--${modifier}`
     }
     if(Array.isArray(modifier)) {
        return modifier.reduce((ret,item) => `${ret}${genBem(name,item)}`,'')
     }
     return Object.keys(modifier).reduce((ret,item) => `${ret}${modifier[item] ? genBem(name,item):''}`,'')
}

export function createNameSpace(name:string) {
    const prefixName = `wc-${name}`;
    return createBem(prefixName) 
}
