import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../component';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', prompt: '', photo: '' });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
  
        const response = await fetch('https://imaginate-wa7y.onrender.com/api/v1/dalle', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: form.prompt }),
        });
  
        if (response.ok) {
          const data = await response.json();
          setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
        } else {
          throw new Error('Failed to generate image');
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide a prompt');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.prompt && form.photo) {
      setLoading(true);
  
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
  
        if (!response.ok) {
          throw new Error('Failed to share the post');
        }
  
        await response.json();
        navigate('/');
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please enter a prompt and generate an image');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  useEffect(() => {
    return () => {
      if (form.photo) {
        URL.revokeObjectURL(form.photo);
      }
    };
  }, [form.photo]);

  return (
    <section className='max-w-7xl mx-auto bg-gradient-to-br from-[#0f0f2e] to-[#1a1a2e] text-white'>
      <div>
        <h1 className='font-extrabold text-[32px]'>Create</h1>
        <p className='mt-2 text-gray-300 text-[16px] max-w[500px]'>Create stunning images with ease!</p>
      </div>

      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField 
            labelName="Your name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            handleChange={handleChange}
            className="bg-gray-800 labelName-white placeholder-gray-400" 
          />
          <FormField 
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A plush toy robot sitting against a yellow wall"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
            className="bg-gray-800 text-white placeholder-gray-400" 
          />

          <div className='relative bg-gray-700 border border-gray-600 text-white rounded-lg p-3 flex justify-center items-center'>
            {form.photo ? (
              <img 
                src={form.photo} 
                alt={form.prompt}
                className='w-full h-full object-contain'
              />
            ) : (
              <img 
                src={preview}
                alt='preview'
                className='w-9/12 h-9/12 object-contain opacity-40'
              />
            )}
            {generatingImg && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className='mt-5 flex gap-5'>
          <button
            type='button'
            onClick={generateImage}
            className='text-white bg-gradient-to-r from-purple-600 to-purple-400 hover:bg-gradient-to-l font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 transition duration-300 ease-in-out'
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className='mt-10'>
          <p className='mt-2 text-gray-300 text-[14px]'>Once you have created the image you want, you can share it with others in the community.</p>
          <button
            type='submit'
            className='mt-3 text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:bg-gradient-to-l font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 transition duration-300 ease-in-out'
          >
            {loading ? 'Sharing...' : 'Share with the community'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreatePost;
