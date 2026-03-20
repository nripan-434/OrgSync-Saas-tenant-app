import { asyncHandler } from "../middleware/asyncHandler.js";
import taskModel from "../models/taskModel.js"


export const addnewtask =async(req,res)=>{
   
     const {task,projectId}=req.body
    
    if(!task.title||!task.description){
        return res.status(400).json({message:"Please fill in all required fields"})
    }
    const userId = req.user._id;
    const titleexist = await taskModel.findOne({title:task.title,createdBy:userId})
    if(titleexist){
        return res.status(409).json({message:"task already exist"})
    }
    const task1=await taskModel.create({
        title:task.title,description:task.description,priority:task.priority,createdBy:userId,projectId:projectId
    })
    return res.status(201).json({message:"task created successfully",task:task1})
}

export const addaitask = asyncHandler(async(req,res)=>{
    const {task,projectId} = req.body
    const {organizationId,_id} = req.user
    // console.log(projectId)
    console.log(task)
    if(!task){
        return res.status(400).json({message:'Task is required'})
    }
    if(!projectId){
         return res.status(400).json({message:'Project Id not found!'})
    }
    if(!organizationId){
         return res.status(400).json({message:'Unauthorized Access!'})
    }
    const prj = await taskModel.findOne({projectId:projectId,title:task.title})
    if(prj){
         return res.status(400).json({message:'Task Already Added!'})
    }
    const restask = await taskModel.create({title:task.title,priority:task.priority ,description:task.description,projectId:projectId,createdBy:_id})
    return res.status(200).json({message:'Task added',restask})
    

})
// 
export const getalltask = asyncHandler(async(req, res) => {
    const { projectId } = req.query; 

    if (!projectId) {
        return res.status(400).json({ message: 'Project Id is required in query params!' });
    }
    
    const tasks = await taskModel.find({ projectId: projectId });

    return res.status(200).json({ tasks });
});
export const removetask = async (req, res) => {
  const { taskId } = req.params
  const userId = req.user._id
console.log(userId)
console.log(taskId)
  const task = await taskModel.findOne({ _id:taskId,createdBy:userId})

  if (!task) {
    return res.status(404).json({ message: "Task not found" })
  }

  await task.deleteOne()

  return res.status(200).json({
    message: "Task deleted successfully",taskId})
}

export const updatetask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { task } = req.body;
  console.log(task)
  const userId = req.user._id;

  if (!taskId) {
    return res.status(400).json({ message: "Task Id is required" });
  }



  const existingTask = await taskModel.findOne({ _id: taskId, createdBy: userId });
  if (!existingTask) {
    return res.status(404).json({ message: "Task not found or unauthorized" });
  }

  existingTask.title = task.title;
  existingTask.description = task.description;
  existingTask.priority = task.priority || existingTask.priority;
  existingTask.status = task.status || existingTask.status;

  await existingTask.save();

  return res.status(200).json({ message: "Task updated successfully", task: existingTask, });
});