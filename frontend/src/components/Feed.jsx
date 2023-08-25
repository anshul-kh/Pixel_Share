import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner.jsx';
import { searchQuery, feedQuery } from '../utils/data';


function Feed() {

  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();
  const [pins, setPins] = useState(null);


  useEffect(() => {
    setLoading(true);
    async function dataLoad() {
      if (categoryId) {
        const query = searchQuery(categoryId);
        await client.fetch(query).then((data) => {
          setPins(data);
          setLoading(false);
        })

      } else {
        await client.fetch(feedQuery).then((data) => {
          setPins(data);
          setLoading(false);
        })

      }

    }

    dataLoad();

  }, [categoryId])

  if (loading) return <Spinner msg='Adding New Idead To Feed!!' />
  if (!pins?.length) return <h2>No Pins Avialable</h2>

  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
    </div>
  )
}

export default Feed
