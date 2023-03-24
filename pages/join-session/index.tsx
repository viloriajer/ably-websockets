import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { channels } from '@/constants';
const JoinSessionPage = () => {
    const [roomCode,setRoomCode] = useState('')
    const [roomMissing,setRoomMissing] = useState(false)
    const { push } = useRouter();

    function onClickJoin(){
      if(channels.indexOf(roomCode) !== -1) {
        push(`chat/${roomCode}`)
      }
      setRoomMissing(true)
    }
    
  return (
    <div className='flex flex-col h-screen items-center justify-center bg-gray-100'>
        <div className='flex flex-col items-center justify-between shadow-lg w-1/2 h-1/3 p-4 rounded-md bg-white'>
        {roomMissing && <p className='text-red-600'>room does not exist</p> }
          <p className='text-lg'>Please enter a room code</p>
        <input type="text" className='input input-bordered' onChange={(e)=>setRoomCode(e.target.value)}/>
        <button className='btn btn-success' onClick={onClickJoin}>join</button>
        </div>
    </div>
  )
}

export default JoinSessionPage