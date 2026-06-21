import express from 'express'
import dotenv from 'dotenv'
import http from 'http'
import { Server } from 'socket.io'
import { connectDB } from './db.js'
import Authrouter from './routes/authRoute.js'
import Projectrouter from './routes/projectRoute.js'
import aiRouter from './routes/aiRoute.js'
import taskRouter from './routes/taskRoute.js'
import chatRouter from './routes/chatRoute.js'

import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js'
import userModel from './models/userModel.js'
dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

app.use('/auth',Authrouter) 
app.use('/project',Projectrouter)
app.use('/ai',aiRouter)
app.use('/task',taskRouter)
app.use('/chat',chatRouter)

app.use(errorHandler)

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

app.set('socketio', io)

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  // Join user to their own private room
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`)
    console.log(`User ${userId} joined room user_${userId}`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

server.listen(process.env.PORT,()=>{
    console.log("server is running")
})
connectDB()



// useEffect(()=>{
//     const timer =setTimeout(()=>{
//         console.log('hi')
//     },5000)
//     return ()=>{clearTimeout(timer)}
// })

// function fetchurl(url){
//     const [data,setData]=useState(null)
//     useEffect(()=>{
//         fetch(url)
//         .then(res=>res.json())
//         .then(data=>setData(data))

//     },[url])
//     return data
// }
// import express from 'express'

// const app= express()
// const port=5000
// app.listen(port,()=>{
//     console.log('server is running')
// })
// app.get('/',(req,res)=>{
//     return res.send("asdasd")
// })

// const taskSchema = mongoose.Schema({
//   name:{
//     type:,
//     required:,

//   }
// })
// const taskmodel=mongoose.model('task',taskSchema)
// export default taskmodel
// export const register=async(req,res)=>
// {
//     try {
//         const {name,email,password}=req.body
//         const exist = userModel.findOne({email:email})
//         if(exist){
//             res.status(400).json({message:'already exist'})

//         }
//         const salt= await bcrypt.genSalt(10)
//         const hashed= await bcryt.hash(password,salt)
//         const reg  = await userModel.create({
//             name,email,password:hashed
//         })
//         return res.status(200).json({message:'registered successfully'})
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({message:"error"})
        
//     }
// }
// import jwt from'jwt'
// export const login =(req,res)=>{
//     try{
//         const {email,password}=req.body
//         const user = userModel.findOne({email})
//         if(!user){
//             return res.status(400).json({message:'no user found'})
//         }
//         const valid = await bcrypt.compare(password,user.password)
//         if(!valid){
//             return res.json({message:"Invalid credentials"})
//         }
//         const token = await jwt.sign({id:user._id,name:user.name},proces.env.secretKey,{expiresIn:'7d'})
//         const currentuser={id:user.id,role:user,name:user.name,}
//         return res.json({message:'login successfully'},currentuser)
//     }
//     catch(error){
//  console.log(error)
//         return res.status(500).json({message:"error"})
        
//     }
// }


// const task =async()=>{
//   await  const res=axios.get('')

// }