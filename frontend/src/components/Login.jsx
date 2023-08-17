import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import pixelVideos from '../assets/pixel.mp4';
import logo from '../assets/logo.png';
const Login = () => {
  const responseGoogle = (response) => {
    console.log(response)
  }
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video src={pixelVideos}
          loop
          type="video/mp4"
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />
        <div className='flex flex-col absolute justify-center items-center top-0 bottom-0 right-0 left-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logo} alt="logo" className='w-45 h-40 rounded-full' />
          </div>
          <div className='flex rounded-lg'>
            

            <GoogleLogin
              onSuccess={credentialResponse => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              Cross-Origin-Opener-Policy='same-origin-allow-popups'
            />;


          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
