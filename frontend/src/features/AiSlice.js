import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks:[],
    status: 'success'

}
export const createAitask = createAsyncThunk('post/createAitask',async (projectId,prompt)=>{
    

})
const AiSlice = createSlice({

    name: 'ai',
    initialState,
    reducers: {
      

    },
    // extraReducers(builder){
    //     builder.addCase(registeruser.pending, (state) => {
    //         state.status = 'pending'
    //     })
      



})
export const {  } = AiSlice.actions

export default AiSlice.reducer