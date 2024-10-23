import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import { logo } from './assets';
import { Home, CreatePost } from './pages';

const App = () => (
  <BrowserRouter>
    <header className="w-full flex justify-between items-center bg-gradient-to-r from-[#1a1a2e] to-[#0f0f2e] sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]">
      <Link to="/">
        <img src={logo} alt="logo" className="w-28 object-contain" />
      </Link>

      <Link to="/create-post" className="font-inter font-medium bg-gradient-to-r from-[#ff007f] to-[#00d4ff] text-white px-4 py-2 rounded-md hover:opacity-80 transition duration-200">Create</Link>
    </header>
    <main className="sm:p-8 px-4 py-8 w-full bg-gradient-to-b from-[#0f0f2e] to-[#1a1a2e] min-h-[calc(100vh-73px)] text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </main>
  </BrowserRouter>
);

export default App;
