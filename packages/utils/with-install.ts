import { Plugin } from 'vue'


type WithInstall<T> = T & Plugin
export function withInstall<T extends { name : string}>(component:T) {
    (component as WithInstall<T>).install = (app) => {
         app.component(component.name,component)
    }   
    return component as WithInstall<T>
}