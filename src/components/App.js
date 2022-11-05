import '../App.css';
import SignUp from "./SignUp";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";
import Sharpens from "./Sharpens";
import About from "./About";
import Graphs from "./Graphs";

//react
import React, { useState, useEffect  } from 'react';
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// day js
import dayjs from 'dayjs'

//mui
import Box from '@mui/material/Box';

//firestore / auth
import {UserAuth} from '../contexts/AuthContext';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function App() {
  const {user} = UserAuth();
  
  const [activeUser, setActiveUser] = useState({});
  const [currentDate, setCurrentDate] = useState();
  
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

  // retrieve player data from firestore
  useEffect (() => {
    let playerData = {};
    async function getPlayer() {
      const usersRef = collection(db, "users");
     
        const q = query(usersRef, where("email", "==", user.email));
        //const q = query(usersRef, where("email", "==", test email));
        try {
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
    dateToday();
    getPlayer();
  
  }, [user]);

  return (
    <div className="App">
      
      <Box>
      <BrowserRouter>
        {Object.keys(activeUser).length === 0 ? 
        <>
        <NavBar/>
        <SignUp />
        </>
        :
        <>
        <NavBar isReceived = {true} />
        <Routes>
       {user === null  ? 
          <>
            <Route path="/dashboard" element={<Navigate replace to="/" />} />
            <Route path = "*" element = {<SignUp />} />
          </>
          :
          <>
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
            <Route path = "/dashboard" element = {<Dashboard activeUser = {activeUser} currentDate = {currentDate}/> } />
            <Route path = "/sharpens" element = { <Sharpens activeUser = {activeUser} currentDate = {currentDate}/>} />
            <Route path = "/about" element = {<About />} />
            <Route path = "/graphs" element = { <Graphs /> } />
          </>
        }
         </Routes>
         </> 
        }
      </BrowserRouter>
      </Box>
      </div>
  );
}

export default App;
