import {configureStore} from '@reduxjs/toolkit'
const initialState:{name:string,age:number} = {name:"alan",age:22}
export type StateType = typeof initialState
let store = configureStore({
    reducer:{
        one:(state:StateType=initialState,action) => state
    }
})

type StoreType = typeof store
export default store;