import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner.jsx';
import { searchQuery } from '../utils/data';


function Feed() {

  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();
  const [pins, setPins] = useState(null);
  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      })

    } else {
      

    }
    

  },[categoryId])

  if(loading) return <Spinner msg='Adding New Idead To Feed!!'/>

  return (
    <div>
      Feed
    </div>
  )
}

export default Feed
