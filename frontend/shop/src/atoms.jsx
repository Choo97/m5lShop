import {atomWithStorage, createJSONStorage} from 'jotai/utils'

export const initUser = {id:'',name:'',email:'',address:''}

export const userAtom = atomWithStorage(
    'user',
    initUser,
    createJSONStorage(()=>sessionStorage)
)
