import { authmiddleware } from "../middleware/auth.js";
import { adminonly } from "../middleware/adminMiddleware.js";
import express from 'express'
import { addaitask,addnewtask,getalltask,removetask,updatetask,taskassign,getmembertasks } from "../controllers/taskcontroller.js";

const router = express.Router()

router.post('/addaitask',authmiddleware,adminonly,addaitask)
router.post('/addnewtask',authmiddleware,adminonly,addnewtask)
router.put('/updatetask/:taskId',authmiddleware,adminonly,updatetask)
router.patch('/taskassign/:taskId',authmiddleware,adminonly,taskassign)
router.get('/getalltask',authmiddleware,adminonly,getalltask)
router.delete('/removetask/:taskId',authmiddleware,adminonly,removetask)
// member
router.get('/getmembertasks',authmiddleware,getmembertasks)


export default router

    