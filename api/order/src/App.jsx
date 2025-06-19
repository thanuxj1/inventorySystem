import './App.css';
import Home from './components/Home/Home'; 
import React from 'react';
import { Route, Routes } from 'react-router';
import Users from './components/UserDetails/Users';                                             
import AddUser from './components/AddUser/AddUser';
import UpdateUser from './components/UpdateUser/UpdateUser';

//VLCATJTGR4K195CSHHZFNHY1

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mainhome" element={<Home />} />
          <Route path="/addUser" element={<AddUser />} />
          <Route path="/userdetails" element={<Users />} />
          <Route path="/userdetails/:id" element={<UpdateUser />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
