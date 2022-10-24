import '../App.css';
import SignUp from "./SignUp";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";

import React, { useState, useEffect } from 'react';


import SportsHockeyIcon from '@mui/icons-material/SportsHockey';

import { AuthContextProvider } from "../contexts/AuthContext";
import {UserAuth} from '../contexts/AuthContext';
import { collection, query, where, getDocs, docs, getDoc } from "firebase/firestore";
import { db } from "../firebase";


function App() {
  const {user, logOut} = UserAuth();

  // temporarily set current user to be one of test cases
  const [activeUser, setActiveUser] = useState({});

  let playerData = {};
  async function getPlayer() {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      playerData = doc.data();
    });

    setActiveUser({
      creation_date: playerData.creation_date,
      id: playerData.id,
      name: playerData.name,
      player_id: playerData.player_id
    });
  }

  useEffect(() => {
    getPlayer();
  }, [user])
  
  return (
    
      <div className="App">
        <NavBar />
        <SportsHockeyIcon/>
        <h1>Hockey Stat Tracker</h1>
        {!user ? 
        <SignUp /> :
        <Dashboard activeUser = {activeUser} />
        }        
        
      </div>
    
  );
}

export default App;
