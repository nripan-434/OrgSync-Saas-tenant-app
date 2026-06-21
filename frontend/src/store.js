import { configureStore } from "@reduxjs/toolkit";
import Auth from './features/AuthSlice'
import Prj from './features/ProjectSlice'
import Ai from './features/AiSlice'
import Task from './features/TaskSlice'
import Chat from './features/ChatSlice'
export const store = configureStore({
    reducer:{
    auth:Auth,
    prj:Prj,
    ai:Ai,
    task:Task,
    chat:Chat
    }

})