import React from 'react'
import Loading from './Loading'
const Aitasks = ({aitasks,status,id}) => {
  return (
    <div>
        {
            status==='pending'?
            <Loading/>
            :
            <div className="flex m-4 gap-3 custom-scrollbar transition-all duration-300 overflow-x-auto p-1">
                {aitasks?.map(task => (
                  <div key={task.id} className="flex justify-between min-w-40 items-center p-3 border rounded hover:bg-gray-50">
                    <span className="text-sm">{task}</span>
                    
                  </div>
                ))}
              </div>
        }
         
      
    </div>
  )
}

export default Aitasks
