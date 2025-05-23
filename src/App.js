import React from 'react';
import ContainerBody from './Components/ContainerBody';

import { ToastContainer, toast } from 'react-toastify';
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
