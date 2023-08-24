import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpCircleFill } from 'react-icons/bs'
import { client, urlFor } from '../client';
import { fetchUser } from '../utils/fetchUser';



const Pin = ({ pin: { postedBy, image, _id, destination,save } }) => {

    const [postHover, setPostHover] = useState(false);
    const [savingPost, setSavingPost] = useState(false);
    const navigate = useNavigate();
    const user = fetchUser();
    
    const alreadySaved = !!(save?.filter((item) => item.postedBy._id === user.googleId))?.length;

    const savePin = (_id) => {
        if(!alreadySaved) {
            setSavingPost(true);

            client.patch(_id).setIfMissing({save : []}).insert('after', 'save[-1]', [
                {
                    _key: uuidv4(),
                    userId: user.googleId,
                    postedBy: {
                        _type: 'postedBy',
                        _ref:user.googleId
                    }
                }
            ]).commit().then(() => {
                window.location.reload();
                setSavingPost(false);
            });
        }
    }

    const deletePin = (_id) => {

        client.delete(_id).then(() => {
            window.location.reload();
        })

    }

    return (
        <div className='m-2'>
            <div onMouseEnter={() => { setPostHover(true) }} onMouseLeave={() => { setPostHover(false) }}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            >
                <img src={urlFor(image).width(250).url()} alt="user-post" className='rounded-lg w-full ' />

                {postHover && (
                    <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-250 '

                        style={{ height: '100%' }}
                    >
                        <div className='flex items-center justify-between '>
                            <div className='flex gap-2'>
                                <a href={`${image?.asset?.url}?dl=`}
                                    download onClick={(e) => e.stopPropagation()}>
                                    <MdDownloadForOffline className='bg-white w-7 h-7 rounded-full flex items-center justify-centetext-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none
                                    transition-all duration-5 ease-in' />
                                </a>
                            </div>
                            {
                                alreadySaved ? (
                                    <button type='button' className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none '>
                                       {save?.length} Saved
                                    </button>
                                ):(
                                        <button type='button' className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                savePin(_id);

                                        }}
                                        >
                                            {savingPost ? 'Saving' : 'Save'}

                                        </button>
                                    )
                            }
                        </div>
                        <div className='flex justify-between items-center gap-2 w-full '>
                            {destination && (
                                <a href={destination} target='blank' rel='noreferrer' className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'>
                                    <BsFillArrowUpCircleFill />
                                    {destination.length>20 ? destination.slice(8,28) : destination.slice(8)}
                                </a>
                            )}

                            {
                                postedBy?._id === user.googleId && (

                                    <button type='button' 
                                        className='bg-white p-2  opacity-70 hover:opacity-100 text-dark font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'    
                                        
                                    onClick={(e) => {
                                            e.stopPropagation();
                                        deletePin(_id);
                                    }}
                                    >
                                        <AiTwotoneDelete/>

                                    </button>
                                )
                            }
                        </div>
                    </div>
                )}
            </div>

            <Link to={`user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
                <img src={postedBy?.image} alt='user-profile' className='w-8 h-8 rounded-full object-cover' />
                <p className='font-semibold capitalize'>
                    {postedBy?.userName}
                </p>
            </Link>


        </div>
    )
}

export default Pin
