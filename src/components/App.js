import '../App.css';
import SignUp from "./SignUp";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";
import Sharpens from "./Sharpens";

import React, { useState, useEffect } from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';

// import { AuthContextProvider } from "../contexts/AuthContext";
import {UserAuth} from '../contexts/AuthContext';
import { collection, query, where, getDocs, docs, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function App() {
  const {user, logOut} = UserAuth();

  const [activeUser, setActiveUser] = useState({});

  // retrieve player data from firestore
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
  }
  useEffect(() => {
    getPlayer();
  }, [user]);

  return (
      <BrowserRouter>
       <div className="App">
        <NavBar />
        <Routes>
          <Route path = "/" element = { !user ? 
          <SignUp /> 
          :
          <Dashboard activeUser = {activeUser} />
          }  />
          <Route path = "/sharpens" element = { <Sharpens />} />
        </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
