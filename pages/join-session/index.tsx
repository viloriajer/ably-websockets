import { useSession } from 'next-auth/react'
import React, { useState } from 'react'

const JoinSessionPage = () => {
    const [roomCode,setRoomCode] = useState('')
  return (
    <div className='flex flex-col h-screen items-center justify-center'>
        <div className='flex flex-col'><p>Please enter a room code</p>
        <input type="text" /></div>
    </div>
  )
}

export default JoinSessionPage