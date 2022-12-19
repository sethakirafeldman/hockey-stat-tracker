import '../App.css';
import SignUp from "./SignUp";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";
import Sharpens from "./Sharpens";
import About from "./About";
import Graphs from "./Graphs";
import Footer from "./Footer";
import Settings from "./Settings";
import Journal from "./Journal/Journal";

//react
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import uuid from 'react-uuid';

//mui
import Box from '@mui/material/Box';

//firestore / auth
import {UserAuth} from '../contexts/AuthContext';
import { doc, setDoc, getDoc} from "firebase/firestore";
import { db } from "../firebase";

function App() {
  const {user} = UserAuth();
  const [activeUser, setActiveUser] = useState({});
  const [currentStatData, setCurrentStatData] = useState([]);
  const [waitingForUser, setWaitingForUser] = useState(true);

  const addUser = async () => {
    let uniqid = uuid();
    try {
        await setDoc(doc(db, "users", user.uid), {
            id: uuid(),
            email: user.email,
            name: user.displayName,
            player_id: uniqid,
            creation_date: user.metadata.creationTime
    })
    }
    catch(err) {
        console.log(err);
    }
}

  const realTimeCallBack = (statsData) => {
    setCurrentStatData(statsData)
  };

  // retrieve player data from firestore
  useEffect (() => {
   
    let playerData = {};
    async function getPlayer() {
        try {
          const usersRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(usersRef)
          if (docSnap.exists()) {
            playerData = docSnap.data();
            setActiveUser({
                creation_date: playerData.creation_date,
                id: playerData.id,
                name: playerData.name,
                player_id: playerData.player_id,
              });
            setWaitingForUser(false);
          }
          else {
            addUser();
          }
      }
        catch(err) {
        // console.log(err)
      }
    };
    getPlayer();
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="App">
      <Box>
        <NavBar isReceived = {true} />
        
        {!user && waitingForUser ? // this almost works, but need to change waitingForUser on logout.
          <Routes>
            <Route path = "/signin" element = {<SignUp user = {user} />} />
            <Route path= "*" element={<Navigate to="/signin" />} />
            <Route path= "/settings" element={<Navigate to="/signin" />} />
              {/* <Route path="/dashboard" element={<Navigate replace to="/signin" />} />    */}
          </Routes>
          :
          <Routes>
            {/* <Route path="/" element={<Navigate replace to="/dashboard" />} /> */}
            <Route path="/signin" element={<Navigate replace to="/dashboard" />} />
            <Route path = "/dashboard" element = {<Dashboard activeUser = {activeUser} realTimeCallBack = {realTimeCallBack}/> } />
            <Route path = "/sharpenings" element = { <Sharpens activeUser = {activeUser} />} />
            <Route path = "/journal" element = {<Journal activeUser = {activeUser} />} />
            <Route path = "/about" element = {<About />} />
            <Route path = "/graphs" element = { <Graphs activeUser = {activeUser} currentStatData = {currentStatData} /> } />
            <Route path = "/settings" element = { <Settings activeUser = {activeUser} />} />
          </Routes>  
      }
      </Box>
      <Footer />
      </div>
   
  );
}

export default App;
