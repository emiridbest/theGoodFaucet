import React, { useState } from 'react';

const Header = () => {

  return (
    <header className="bg-white p-10 my-5">
      <div className="container mx-auto flex justify-between items-center gap-5">
        <div className="text-2xl font-bold text-green-500">The Good Faucet</div>
        <nav>
          <ul className="flex space-x-6 text-black">
            <li className="cursor-pointer hover:text-green-500">Home</li>
            <li className="cursor-pointer hover:text-green-500">About Us</li>
            <li className="cursor-pointer hover:text-green-500">What We Do</li>
            <li className="cursor-pointer hover:text-green-500">Mission</li>
            <li className="cursor-pointer hover:text-green-500">Impact</li>
            <li className="relative mr-0 flex flex-row px-8 gap-7"></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
