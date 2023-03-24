import { configureAbly, useChannel, usePresence } from '@ably-labs/react-hooks';
import { useSession,signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'


function ListActiveParticipants({members}){
    return <div className='flex flex-col w-32'>
        <Link href={'/join-session'}>Back</Link>
        {members}
        <button className='mt-auto btn btn-error' onClick={()=>signOut({callbackUrl:'/login'})}>
            Sign Out
        </button>
    </div>
}

const ChatRoom = () => {

    const {query} = useRouter()
    const {room_key = ''} = query
    const {data:session} = useSession()
    configureAbly({authUrl:'/api/ably/auth'})
    const [message,setMessage] = useState('')
    const [messages, updateMessages] = useState([]);
    const [displayToast,setDisplayToast] = useState(false)
    const [toastMessage,setToastMessage] = useState('')
    const [channel] = useChannel(room_key ?? '', (message) => {
        if (message.data.message)
            updateMessages((prev) => [...prev, message]);
    });
    const [presenceData,updateStatus] = usePresence(room_key ?? '', {name: session?.user?.name}, ({action,data})=> {
        console.log(action)
        if (action==='leave'){

            setDisplayToast(true)
            setToastMessage(`${data.name} has left.`)
            return 
        }
        if(action === 'enter') {
            setDisplayToast(true)
            setToastMessage(`${data.name} has joined.`)
            return
        }
    });

    const members = presenceData.map((msg, index) => <p key={index}> {msg.data.name}</p>);

    
    console.log(channel)
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

    function handleKeyDown(e){
        if (e.keyCode === 13){
            channel.publish('NEW_MESSAGE', {message,author:session?.user?.name},(err)=>{
            if(err)
                console.log(err)
            else {
                setMessage('')
            }
        })
        }
    }

    useEffect(() => {
        const displayTimer =
        setTimeout(()=>{
            setDisplayToast(false)
        },2000)

        return () => clearTimeout(displayTimer)
    },[displayToast])


    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  
    useEffect(() => {
        scrollToBottom()
      }, [messages]);
    
  return (
    <div className='h-screen flex p-8'>
        <ListActiveParticipants members={members}/>
        <div className='flex flex-col h-full w-full px-16'>
            <div id='messages' className='flex relative flex-col h-full w-full overflow-scroll py-4'>
                {messages.map(({data}, index)=> (
                    <div className={`chat ${data?.author == session?.user?.name ? 'chat-end' : 'chat-start'}`}key={index}>
                        <p className="chat-header">{data?.author == session?.user?.name ? 'You' : data?.author}</p>
                        <p className="chat-bubble">{data?.message}</p>
                    </div>
                ))}
                {displayToast&&
                <p className='alert shadow-lg absolute bottom-10 w-1/5 left-1/3'>{toastMessage}</p>
                 }
                 <div ref={messagesEndRef} />
            </div>
            <div className='flex w-full'>
                <input className='input input-bordered w-full mr-2' type="text" onChange={onChangeMessageBox} value={message} onKeyDown={handleKeyDown}/>
                <button className='btn btn-success' onClick={onClickSend}>send</button>
            </div>
        </div>
    </div>
  )
}

export default ChatRoom