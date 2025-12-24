import {atomWithStorage, createJSONStorage} from 'jotai/utils'

export const initUser = {
    id:'',
    name:'',
    email:'',
    nickname:'',
    phone:'',
    zipcode:'',
    address:'',
    detailAddress:'',
    role:'GUEST',
    profileImage:'',
    isLogined: false
}

export const userAtom = atomWithStorage(
    'user',
    initUser,
    createJSONStorage(()=>sessionStorage)
)
