import { configureAbly, useChannel, usePresence } from '@ably-labs/react-hooks';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import React, { useState } from 'react'


function ListActiveParticipants({members}){
    return <div className='flex flex-col w-32'>
        {members}
    </div>
}

const ChatRoom = () => {

    const {query} = useRouter()
    const {room_key = ''} = query
    const {data:session} = useSession()
    configureAbly({authUrl:'/api/ably/auth'})
    const [message,setMessage] = useState('')
    const [messages, updateMessages] = useState([]);
    const [channel] = useChannel(room_key ?? '', (message) => {
        updateMessages((prev) => [...prev, message]);
    });
    const [presenceData,updateStatus] = usePresence(room_key ?? '', {name: session?.user?.name, typing:false}, ({action})=> {
        if (action=='leave')
        console.log('user left')
    });

    const members = presenceData.map((msg, index) => <p key={index}> {msg.data.name}</p>);

    function onChangeMessageBox(e){
        updateStatus({name:session?.user?.name, typing:true})
        setMessage(e.target.value)
    }

    function onClickSend(){
        channel.publish('NEW_MESSAGE', {message,author:session?.user?.name},(err)=>{
            if(err)
                console.log(err)
            else {
                setMessage('')
            }
        })
    }

    
  return (
    <div className='h-screen flex p-8'>
        <ListActiveParticipants members={members}/>
        <div className='flex flex-col h-full w-full px-16'>
            <div className='flex flex-col h-full w-full overflow-scroll py-4'>
                {messages.map(({data}, index)=> (
                    <div className={`chat ${data?.author == session?.user?.name ? 'chat-end' : 'chat-start'}`}key={index}>
                        <p className="chat-header">{data?.author == session?.user?.name ? 'You' : data?.author}</p>
                        <p className="chat-bubble">{data?.message}</p>
                    </div>
                ))}
            </div>
            <div className='flex w-full'>
                <input className='input input-bordered w-full mr-2' type="text" onChange={onChangeMessageBox} value={message}/>
                <button className='btn btn-success' onClick={onClickSend}>send</button>
            </div>
        </div>
    </div>
  )
}

export default ChatRoom