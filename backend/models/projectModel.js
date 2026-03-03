import mongoose from 'mongoose'
 const projectSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    organizationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Organization',
        required:true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
   members: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'users'
}],
aiSummary: {
  type: String,
  default: null
},
aiPlanGenerated: {
  type: Boolean,
  default: false
},
aiGeneratedAt: {
  type: Date
}


 },{timestamps:true})

const projectModel = mongoose.model('projects',projectSchema)
export default projectModel