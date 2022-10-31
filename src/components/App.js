import '../App.css';
import SignUp from "./SignUp";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";
import Sharpens from "./Sharpens";

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
      const q = query(usersRef, where("email", "==", user.email));
      //const q = query(usersRef, where("email", "==", test email));
    
      const querySnapshot = await getDocs(q);
      try {
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
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path = "/dashboard" element = { !user ? 
          <SignUp /> 
          :
          <Dashboard activeUser = {activeUser} />
          }  />
          <Route path = "/sharpens" element = { <Sharpens />} />
        </Routes>
        </div>
        </Box>

      </BrowserRouter>
  );
}

export default App;
