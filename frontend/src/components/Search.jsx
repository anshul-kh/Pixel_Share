import React, { useEffect, useState } from 'react'

import MasonryLayout from './MasonryLayout'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import Spinner from './Spinner'

const Search = ({ searchTerm }) => {

  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPins = async () => {
      setLoading(true);

      try {
        let pins;

        if (searchTerm) {
          const query = searchQuery(searchTerm.toLowerCase());
          pins = await client.fetch(query);
        } else {
          pins = await client.fetch(feedQuery);
        }

        setPins(pins);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPins();
  }, [searchTerm])


  return (
    <div>

      {loading && <Spinner msg={'Sreach in Progress..'} />}

      {pins?.length !== 0 && (
        <MasonryLayout pins={pins} />
      )}

      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className='mt-10 text-center text-xl'> No Pins Found</div>
      )}
    </div>
  )
}

export default Search
