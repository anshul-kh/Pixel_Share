import React, { useEffect, useState } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { client } from '../client'
import { urlFor } from '../client'
import MasonryLayout from './MasonryLayout'
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'
import Spinner from './Spinner'
function PinDetail({ user }) {

  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const { pinId } = useParams();
  const [addingComment, setAddingComment] = useState(false);


  const fetchPinDetails = async () => {
    const query = pinDetailQuery(pinId);
    const data = await client.fetch(query);

    setPinDetail(data[0]);

    if (data[0]) {
      const morePinsQuery = pinDetailMorePinQuery(data[0]);
      const morePinsData = await client.fetch(morePinsQuery);
      setPins(morePinsData);
    }
  }





  async function addComment() {
    setAddingComment(true)

    const patch = client.patch(pinId)

    patch.setIfMissing({ comments: [] })

    patch.insert('after', 'comments[-1]', [{
      comment,
      _key: uuidv4(),
      _type: 'Comment',
      postedBy: {
        _type: 'postedBy',
        _ref: user._id
      }
    }])

    await patch.commit(pinId)

    fetchPinDetails()
    setComment('')
    setAddingComment(false)

  }

  useEffect(() => {
    fetchPinDetails();
  }, [pinId])


  if (!pinDetail) return <Spinner msg="Loading pin detail..." />

  return (
    <>
      <div className='flex xl:flex-row flex-col m-auto bg-white ' style={{ maxWidth: '1500px', borderRadius: '32px' }}>
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img src={
            pinDetail?.image && urlFor(pinDetail.image).url()
          } alt="user-post" className='rounded-t-3xl rounded-b-lg' />
        </div>
        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div className='flex justify-between items-center'>
            <div className='flex gap-2 items-center'>
              <a href={`${pinDetail.image?.asset?.url}?dl=`}
                download onClick={(e) => e.stopPropagation()}>
                <MdDownloadForOffline className='bg-white w-7 h-7 rounded-full flex items-center justify-centetext-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none transition-all duration-5 ease-in' />
              </a>
            </div>
            <a href={pinDetail.destination} target='_blank' rel='noreferrer' >
              {pinDetail.destination.length > 70 ? `${pinDetail.destination.slice(0, 40)}...` : `${pinDetail.destination.slice(0, 20) }...`}
            </a>
          </div>
          <div>
            <h1 className='text-4xl font-bold mt-3 break-words'>
              {pinDetail.title}
            </h1>
            <p className='mt-3'>{pinDetail.about}</p>
          </div>
          <Link to={`user-profile/${pinDetail.postedBy?._id}`} className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
            <img src={pinDetail.postedBy?.image} alt='user-profile' className='w-8 h-8 rounded-full object-cover' />
            <p className='font-semibold capitalize'>
              {pinDetail.postedBy?.userName}
            </p>
          </Link>
          <h2 className='mt-5 text-2xl text-gray-500'>Comments</h2>
          <div className='max-h-370 overflow-y-auto '>
            {pinDetail.comments?.map((comment, i) => (
              <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
                <img src={comment.postedBy.image} alt="user-prof" className='w-10 h-10 cursor-pointer rounded-full' />
                <div className='flex flex-col'>
                  <p className='font-bold'>{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className='flex flex-wrap gap-3 mt-6 '>
            <Link to={`user-profile/${pinDetail.postedBy?._id}`} >
              <img src={pinDetail.postedBy?.image} alt='user-profile' className='w-10 h-10 rounded-full cursor-pointer' />

            </Link>
            <input type="text" className='flex-1 border-gray-100 border-2 rounded-2xl outline-none p-2 focus:border-gray-300' placeholder='Leave Your Comment' value={comment} onChange={(e) => {
              setComment(e.target.value);
            }} />
            <button type='button' className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
              onClick={addComment}>
              {addingComment ? 'Posting...' : 'Post'}
            </button>
          </div>

        </div>


      </div>

      {
        pins?.length > 0 ? (
          <>
            <h2 className='text-center font-bold text-2xl mt-8 mb-4'> More Like this</h2>
            <MasonryLayout pins={pins} />
          </>
        ) : (
          <Spinner msg={'Loading More...'} />
        )
      }
    </>
  );
}

export default PinDetail;