import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  name: {
     type: String, 
     required: true 
    },
  plan: {
    type: String,
    enum: ["free","pro"],
    default: "free" 
    },
  aiCreditsLimit: {
     type: Number,
      default: 1000 

  },
  aiCreditsUsed:{
    type:Number,
    default:0
  }
}, { timestamps: true });

export default mongoose.model("Organization", organizationSchema);
