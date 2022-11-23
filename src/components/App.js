import '../App.css';
import SignUp from "./SignUp";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";
import Sharpens from "./Sharpens";
import About from "./About";
import Graphs from "./Graphs";
import Footer from "./Footer";
import Settings from "./Settings";

//react
import React, { useState, useEffect  } from 'react';
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import uuid from 'react-uuid';

// day js
import dayjs from 'dayjs'

//mui
import Box from '@mui/material/Box';

//firestore / auth
import {UserAuth} from '../contexts/AuthContext';
import { doc, setDoc, getDoc} from "firebase/firestore";
import { db } from "../firebase";

function App() {
  const {user} = UserAuth();
  const [activeUser, setActiveUser] = useState({});
  const [currentDate, setCurrentDate] = useState();
  const [currentStatData, setCurrentStatData] = useState([]);

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

  // set date and timezone
  const dateToday = () => {
    let year = dayjs().year();
    let month = dayjs().month() + 1;
    let day = dayjs().date();
    
    if (month < 10 && day < 10 ) {
      month = `0${month}`;
      day = `0${day}`;
    }
    else if (day < 10) {
      day = `0${day}`;
    }
    else if (month < 10) {
      month = `0${month}`;
    }
    setCurrentDate(`${year}-${month}-${day}`);
  };  

  const realTimeCallBack = (statsData) => {
    setCurrentStatData(statsData)
  };

  // retrieve player data from firestore
  useEffect (() => {
    let playerData = {};
    async function getPlayer() {
      const usersRef = doc(db, "users", user.uid);
        try {
        const docSnap = await getDoc(usersRef)
          if (docSnap.exists()) {
            playerData = docSnap.data();
            setActiveUser({
                creation_date: playerData.creation_date,
                id: playerData.id,
                name: playerData.name,
                player_id: playerData.player_id,
              });
          }
          else {
            addUser();
            getPlayer();
          }
      }
        catch(err) {
        console.log(err)
      }
    };
    dateToday();
    getPlayer();
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="App">
      <Box>
      <BrowserRouter>
        <>
        <NavBar isReceived = {true} />
        <Routes>
        {user === null || Object.keys(user).length === 0 ? 
          <>
            <Route path="*" element={<Navigate replace to="/signin" />} />
            <Route path = "/signin" element = {<SignUp />} />
          </>
          :
          <>
            <Route path="*" element={<Navigate replace to="/dashboard" />} />
            <Route path = "/dashboard" element = {<Dashboard activeUser = {activeUser} currentDate = {currentDate} realTimeCallBack = {realTimeCallBack}/> } />
            <Route path = "/sharpenings" element = { <Sharpens activeUser = {activeUser} currentDate = {currentDate}/>} />
            <Route path = "/about" element = {<About />} />
            <Route path = "/graphs" element = { <Graphs activeUser = {activeUser} currentDate = {currentDate} currentStatData = {currentStatData} /> } />
            <Route path = "/settings" element = { <Settings activeUser = {activeUser} />} />
          </>
        }
         </Routes>
         </> 
      </BrowserRouter>
      </Box>
      <Footer />
      </div>
      
  );
}

export default App;
