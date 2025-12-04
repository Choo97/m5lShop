import {atomWithStorage, createJSONStorage} from 'jotai/utils'

export const initUser = {
    id:'',
    name:'',
    email:'',
    address:'',
    nickname:'',
    role:'GUEST',
    profileImage:'',
    isLogined: false
}

export const userAtom = atomWithStorage(
    'user',
    initUser,
    createJSONStorage(()=>sessionStorage)
)
