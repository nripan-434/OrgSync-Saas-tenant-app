import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axios";

const initialState = {
    aitasks: {},
    aistatus: 'success'

}
export const createAitask = createAsyncThunk('post/createAitask', async ({ projectId, prompt }) => {
    console.log("Thunk called", projectId, prompt)
    const res = await api.post('/ai/createAitask', { projectId, prompt })
    return res.data

})
const AiSlice = createSlice({

    name: 'ai',
    initialState,
    reducers: {


    },
    extraReducers(builder) {
        builder.addCase(createAitask.pending, (state) => {
            state.aistatus = 'pending'
        })
            .addCase(createAitask.fulfilled, (state, action) => {
                state.aistatus = 'fulfilled'

                const { projectId, tasks } = action.payload

                state.aitasks[projectId] = tasks
            })
            .addCase(createAitask.rejected, (state) => {
                state.aistatus = 'rejected'
            })
    }



})
export const { } = AiSlice.actions

export default AiSlice.reducer