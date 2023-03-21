import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { channels } from '@/constants';
const JoinSessionPage = () => {
    const [roomCode,setRoomCode] = useState('')
    const [roomMissing,setRoomMissing] = useState(false)
    const { push } = useRouter();

    function onClickJoin(){
      if(channels.indexOf(roomCode) !== -1) 
        push(`chat/${roomCode}`)
      setRoomMissing(true)
    }
    
  return (
    <div className='flex flex-col h-screen items-center justify-center'>
        <div className='flex flex-col'><p>Please enter a room code</p>
        <input type="text" onChange={(e)=>setRoomCode(e.target.value)}/></div>
        <button onClick={onClickJoin}>join</button>
        {roomMissing && <p>room does not exist</p> }
    </div>
  )
}

export default JoinSessionPage