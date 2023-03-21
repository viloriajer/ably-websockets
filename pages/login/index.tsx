import React from 'react'
import { signIn, useSession } from "next-auth/react"
const LoginPage = () => {
  return (
    <div className='flex flex-col h-screen items-center justify-center'>
        <div className='flex flex-col'>
        <button onClick={() => signIn("github", {callbackUrl:'/join-session'})}>Sign in with Github</button>
        </div>
    </div>
  )
}

export default LoginPage