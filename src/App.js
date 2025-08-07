import React from 'react';
import ContainerBody from './components/ContainerBody';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ContainerBody />
      <ToastContainer />   

    </>
  );
}

export default App;
