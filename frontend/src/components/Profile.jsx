import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { GoogleLogout } from 'react-google-login';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { useNavigate, useParams } from 'react-router-dom';

const randomImg = 'https://source.unsplash.com/1600x900/?nature,photography,technologgy/'

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';

const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

function Profile() {

  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');

  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();



  useEffect(() => {

    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0])
    })
  }, [userId])


  useEffect(() => {
    if (text === 'Created') {
      const createdPinQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinQuery).then((data) => {
        setPins(data)
      })
    } else {
      const savedPinQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinQuery).then((data) => {
        setPins(data)
      })
    }
  }, [text, userId])

  

  if (!user) {
    return <Spinner msg={'Loading'} />
  }

  const logout = () => {
    localStorage.clear();
    navigate('/login')
  }



  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img src={randomImg} alt="banner" className='w-full h-300 2xl:h-510 shadow-lg object-cover' />
            <img src={user?.image} className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover' alt="user-img" />
            <h1 className='font-bold text-3xl text-center mt-3'>{user?.userName}</h1>
            <div className='absolute top-0 z-10 right-0 p-2'>

              {userId === user._id && (
                <GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  buttonText="Logout"
                  onLogoutSuccess={logout}
                  render={renderProps => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                    >
                      <AiOutlineLogout color="red" fontSize={21} />
                    </button>
                  )}
                />
              )}

            </div>
          </div>
          <div className='text-center mb-7'>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveBtn('created')
              }}
              className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles }`}
            >
              Created
            </button>

            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveBtn('saved')
              }}
              className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles }`}
            >
              Saved
            </button>
          </div>
          {pins?.length ? (
            <div className='px-2'>
              <MasonryLayout pins={pins} />
            </div>
          ) : (
              <div className='flex justify-center font-bold items-center text-xl mt-2 '>
                No Pin Found
              </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
