import '../App.css';
import SignUp from "./SignUp";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";
import Sharpens from "./Sharpens";
import About from "./About";
import Graphs from "./Graphs";

import React, { useState, useEffect } from 'react';
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Box from '@mui/material/Box';

import {UserAuth} from '../contexts/AuthContext';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function App() {
  const {user} = UserAuth();

  const [activeUser, setActiveUser] = useState({});

  // retrieve player data from firestore
 

  
  useEffect(() => {
    let playerData = {};
    async function getPlayer() {
      const usersRef = collection(db, "users");
      try {
        const q = query(usersRef, where("email", "===", user.email));
        //const q = query(usersRef, where("email", "==", test email));
      
        const querySnapshot = await getDocs(q);
 
        querySnapshot.forEach((doc) => {
          playerData = doc.data();
          setActiveUser({
            creation_date: playerData.creation_date,
            id: playerData.id,
            name: playerData.name,
            player_id: playerData.player_id,
          })
        });
      }
      catch (err) {
        console.log(err)
      }
    };

    getPlayer();
  }, [user]);

  return (
      <BrowserRouter>
        <Box>
       <div className="App">
       {!user ? 
       <>
        <NavBar />
        <Routes>
          <Route path="/" exact={true} element={<Navigate to="/dashboard" replace />} />
          <Route path = "/dashboard" element = {<SignUp /> } />
        </Routes>
        </>
          :
        <>
        <NavBar />
        <Routes>
          <Route path="/"  exact={true} element={<Navigate to="/dashboard" replace />} />
          <Route path = "/dashboard" element = {<Dashboard activeUser = {activeUser} /> } />
          <Route path = "/sharpens" element = { <Sharpens />} />
          <Route path = "/about" element = {<About />} />
          <Route path = "/graphs" element = { <Graphs /> } />
        </Routes>
        </>
        }
        </div>
        </Box>
      </BrowserRouter>
  );
}

export default App;
