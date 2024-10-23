import React, { useState, useEffect } from 'react';
import { Loader, Card, FormField } from '../component';

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className='mt-5 font-bold text-[#ff007f] text-xl uppercase'>{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(setTimeout(() => {
      const searchResult = allPosts.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.prompt.toLowerCase().includes(searchText.toLowerCase())
      );

      setSearchedResults(searchResult);
    }, 500));
  };

  return (
    <section className='max-w-7xl mx-auto p-6 bg-gradient-to-br from-[#0f0f2e] to-[#1a1a2e] text-white'>
      <div>
        <h1 className='font-extrabold text-[#ff007f] text-[32px]'>The Community Showcase</h1>
        <p className='mt-2 text-[#e0e0e0] text-[16px] max-w[500px]'>
          Browse through stunning images created by our community!
        </p>
      </div>

      <div className='mt-16'>
        <FormField
          labelName="Search posts"
          type="text"
          name="text"
          placeholder="Search posts..."
          value={searchText}
          handleChange={handleSearchChange}
          className='border border-gray-600 rounded-lg p-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 transition'
        />
      </div>

      <div className='mt-10'>
        {loading ? (
          <div className='flex justify-center items-center'>
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className='font-medium text-[#e0e0e0] text-xl mb-3'>
                Showing results for <span className='text-[#ff007f]'>{searchText}</span>
              </h2>
            )}
            <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-4'>
              {searchText ? (
                <RenderCards 
                  data={searchedResults}
                  title="No search results found"
                />
              ) : (
                <RenderCards 
                  data={allPosts}
                  title="No posts found"
                />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
