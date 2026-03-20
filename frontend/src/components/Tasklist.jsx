import React from 'react'
import { useDispatch } from 'react-redux'
import { removetask, updatetask } from '../features/TaskSlice'
import { useState,useEffect } from 'react'
import { motion } from 'framer-motion'

const Tasklist = ({ tasks }) => {
  const [isremove, setIsremove] = useState(null)
  const [isupdate, setIsupdate] = useState({})
  const [form,setForm]=useState({
    title:'',
    description:'',
    priority:'',
    status:''
  })
    useEffect(() => {
    if (isupdate) {
      setForm({
        title: isupdate.title || '',
        description: isupdate.description || '',
        priority: isupdate.priority || '',
        status: isupdate.status || ''
      })
    }
  }, [isupdate])
  const handleChange = (e)=>{
      const {name,value} = e.target
      setForm((prev)=>({...prev,[name]:value}))
      console.log(form)
  }
    const handleSubmit = (e) => {
      e.preventDefault()
      console.log(form)
      dispatch(updatetask ({ task:form, taskId:isupdate?._id }))  
      setForm({
        title: isupdate.title ||'',
        description: isupdate.description ||'',
        priority: isupdate.priority ||'',
        status: isupdate.status ||  ''
      })
    }
  const dispatch = useDispatch()
  return (
    <div>
      <div>
        {
          tasks.length == '0' ? <div>No Tasks Added Yet!</div> :
            <div className='flex gap-2 rounded-xl overflow-x-auto  custom-scrollbar pb-5 '>
              {
                tasks?.map(x => {
                  return <div key={x._id} className="flex flex-col gap-1 custom-scrollbar  overflow-x-auto items-start   justify-between min-w-80 max-w-100 items-center p-3 border hover:bg-[#B6FF3B] bg-[#B6FF3B]/90 text-[#0C1A2B] rounded-xl ">
                    <span className="text-[18px] underline font-bold"><span className='font-bold'></span>Task: {x.title}</span>
                    <span className="text-[16px]"><span className='font-bold'>Description:</span> {x.description}</span>
                    <span className="text-[16px]"><span className='font-bold'>Priority:</span> {x.priority}</span>
                    <span className="text-[16px]"><span className='font-bold'>Status:</span> {x.status}</span>
                    <div className='flex  justify-between w-full gap-2 font-bold'>
                      <button className='bg-red-600 p-1 rounded-sm text-white' onClick={() => { setIsremove(x._id) }}>remove</button>
                      {
                        isremove == x._id ? <div onClick={() => { setIsremove(null) }} className=' text-[#B6FF3B]  inset-0 z-999 fixed flex justify-center items-center  min-h-screen bg-black/50 backdrop-blur-md'>
                          <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e)=>{e.stopPropagation()}}
                            className='flex relative  flex-col items-center justify-center shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.2),_0_2px_10px_0_rgb(0.5,0,0,2.4)] rounded-xl p-10 bg-[#0C1A2B] gap-3'>
                            <h1>Do you want to remove the task permenantly?</h1>
                            <div className='flex gap-3'>
                              <button className='absolute top-2 right-2 border   rounded-full w-6 h-6 flex justify-center items-center    p-1' onClick={() => { setIsremove(null) }}>X</button>
                              <button className='bg-red-500 rounded-xl text-white p-1' onClick={() => { dispatch(removetask(x._id)) }}>Remove</button>
                              <button className='bg-sky-500 rounded-xl text-white p-1' onClick={() => { setIsremove(null) }}>Cancel</button>
                            </div>
                          </motion.div>
                        </div> : ''
                      }

                      <button className='bg-sky-800 p-1 rounded-sm text-white' onClick={() => { setIsupdate(x) }}>update</button>
                      {
                        isupdate == x ? <div onClick={() => { setIsupdate({}) }} className='fixed backdrop-blur-md flex justify-center items-center inset-0 bg-black/50'>
                          
                          <motion.form action=""
                          onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 90 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                             onClick={(e)=>{e.stopPropagation()}}
                            className='z-999 relative text-[#B6FF3B] w-120 mt-15 flex flex-col gap-4 bg-[#0C1A2B] p-9 rounded-xl '>
                              <div className='flex gap-2 flex-col'>
                                <label className='' htmlFor="">Task : </label>
                              <input onChange={handleChange} name='title' type="text" className='outline-1 outline-white focus:outline-3 focus:outline-[#B6FF3B]  rounded-md p-2' value={form.title} />

                              </div>
                              <div className='flex gap-2 flex-col'>
                                <label className='' htmlFor="">Description : </label>
                              <textarea onChange={handleChange} name='description' className='min-h-[70px] outline-1 outline-white  focus:outline-3 focus:outline-[#B6FF3B]  rounded-md p-2'  type="text" value={form.description} />

                              </div>
                              <div className='flex gap-2 flex-col'>
                                <label htmlFor="">Priority :{form.priority }</label>
                  <select onChange={handleChange} name='priority' value={form.priority}  className=' outline-1 outline-white focus:outline-3 bg-[#0C1A2B]   focus:outline-[#B6FF3B]  rounded-md p-2' id="">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>

                              </div>
                              {/* <div className='flex gap-2 flex-col'>
                                <label className='' htmlFor="">Status : </label>
                              <input type="text" onChange={handleChange} name='status' className='outline-1 outline-white focus:outline-3  focus:outline-[#B6FF3B]  rounded-md p-2' value={form.status} />

                              </div> */}
                         
                            <div className='flex gap-6 justify-center '>
                              <button className='absolute top-3 right-3  border rounded-full w-6 h-6 flex justify-center items-center    p-1' onClick={() => { setIsupdate({}) }}>X</button>
                              <button className='bg-green-500 rounded-xl text-white p-1 cursor-pointer active:scale-95' onClick={() => { dispatch() }}>Update</button>
                              <button className='bg-red-500 rounded-xl text-white p-1 cursor-pointer active:scale-95' onClick={() => { setIsupdate({}) }}>Cancel</button>
                            </div>
                         </motion.form>
                              </div>:''
                            }
                    <button className='bg-green-700 p-1 rounded-sm text-white'>+assign</button>
                  </div>
                    

                                  </div>
        })
                        }
      </div>
                    }
    </div>
    </div >
  )
}

export default Tasklist
