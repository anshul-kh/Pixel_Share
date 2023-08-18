import React, { useEffect } from 'react';
import { GoogleLogin } from "react-google-login";
import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom';
import pixelVideos from '../assets/pixel.mp4';
import logo from '../assets/logo.png';
const Login = () => {

  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.auth2.init({ clientId: process.env.REACT_APP_GOOGLE_API_TOKEN })
    })
  }, [])


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
            <img src={logo} alt="logo" className='w-45 h-40 rounded-2xl' />
          </div>
          <div className='flex rounded-lg'>

            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              buttonText="Sign In with Google"
              onSuccess={credentialResponse => {
                console.log(credentialResponse);
              }}
              isSignedIn={true}
              cookiePolicy={"single_host_origin"}

            />


          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
