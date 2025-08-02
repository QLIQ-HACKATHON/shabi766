// src/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './src/Components/Navbar'; 

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="main-content">
        <Outlet /> 
      </div>
    </>
  );
};

export default MainLayout;