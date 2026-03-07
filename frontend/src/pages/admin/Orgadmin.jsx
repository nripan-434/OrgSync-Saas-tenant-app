import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getAllMembers } from '../../features/AuthSlice'
import MembersCard from '../../components/MembersCard'
import { getallprojects } from '../../features/ProjectSlice'
import { motion } from 'framer-motion'
import ProjectEfficiencyGraph from '../../components/ProjectEfficiencyGraph'
const Orgadmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)
 useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  handleResize()
  window.addEventListener("resize", handleResize)
  return () => window.removeEventListener("resize", handleResize)
}, [])
  const { members, user } = useSelector((state) => (state.auth))
  useEffect(() => {
    if (!user?.organizationId) return;
    dispatch(getAllMembers(user.organizationId._id));
  }, [dispatch, user?.organizationId]);
  const { projects, count } = useSelector(state => state.prj);

  useEffect(() => {
    dispatch(getallprojects());
  }, [dispatch]);

  return (
    <div className="flex z-10 min-h-screen bg-[#B6FF3B] text-gray-800">
      {isOpen?
      <motion.div
      initial={{ x:-50,y:30, opacity: 0 }}
          animate={{ x: 0,y:0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        className=' pr-2  flex w-64 bg-[#0C1A2B] flex-col pt-11 border-t-5 border-b-10 border-[#B6FF3B] rounded-br-[20px] rounded-tr-[30px] overflow-hidden ' >
        <h1 className=' pl-4 font-bold text-2xl text-[#B6FF3B]'>DASHBOARD</h1>
        <div className='pt-6 '>
          <Link to={'/members'} className='hidden rounded-r-xl lg:flex hover:bg-[#B6FF3B] p-6  hover:text-black text-[#B6FF3B]  duration-300 font-[bold] '>Members</Link>
        </div>
      </motion.div>:''
}
      <main className="flex-1 p-3  ">
        <motion.div
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}>
        <ProjectEfficiencyGraph />

        </motion.div>

        <motion.header
         initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.1 }}
          className="flex rounded-xl p-10 text-white justify-between border-t-4 border-[#0C1A2B] hover:shadow-xl border-b-4 duration-300 transition-all   items-center mb-2  border-bottom ">
          <div>
            <h1 className="text-3xl font-bold text-[#0C1A2B]">Projects</h1>
            <p className="text-[#0C1A2B]">Manage organization projects</p>
          </div>
          <Link to="/addproject" className="bg-[#0C1A2B] text-white px-4 py-2 rounded">
            + New Project
          </Link>
        </motion.header>

        <motion.h2
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg ml-9  font-semibold mb-4">Total Projects: {count}
        </motion.h2>
        
        <motion.div
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className='p-7 rounded-xl bg-[#B6FF3B] '>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects && projects.length > 0 ? (
              projects.map((prj) => (
                <motion.div
                  
                  key={prj._id} className=" hover:scale-104  duration-300 shadow-black hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] p-4 rounded-xl backdrop-blur-xl shadow-sm bg-[#0C1A2B]">
                  <div className="flex justify-between mb-2 text-[#B6FF3B]">
                    <span className="text-xs uppercase font-bold ">Active</span>
                  </div>
                  <h3 className="text-xl text-[#B6FF3B] font-semibold">{prj.name}</h3>
                  <p className="text-[#B6FF3B] text-sm  my-2">{prj.description || "No description provided."}</p>
                  <div className="mt-4 pt-4 border-t flex justify-between items-center text-[#B6FF3B] text-xs">
                    <span>By: {prj.createdBy.name || ''}</span>
                    <button className="text-blue-600 font-medium" onClick={() => { navigate(`/project/${prj._id}`) }}>View →</button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full border-2 border-dashed p-10 text-center text-gray-400">
                No projects found.
              </div>
            )}

            <div />

          </div>
          <div className='text-white border-t-7 border-[#0C1A2B] mt-10'>
            <h1 className='m-6 font-bold text-xl text-[#0C1A2B]'>Members:</h1>
            <MembersCard members={members} orgId={user.organizationId} />

          </div>
        </motion.div>
      </main>




    </div>
  )
}

export default Orgadmin;