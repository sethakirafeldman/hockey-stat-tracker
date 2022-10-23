import '../App.css';
import SignUp from "./SignUp";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";

import React from 'react';

import SportsHockeyIcon from '@mui/icons-material/SportsHockey';

import { AuthContextProvider } from "../contexts/AuthContext";
import {UserAuth} from '../contexts/AuthContext';


function App() {
  const {user, logOut} = UserAuth();

  // temporarily set current user to be one of test cases
  const [activeUser, setActiveUser] = React.useState(
  {
    creation_date:"2022-10-22",
    id:"79f82061-c348-43d9-bf89-523ecfb6a923",
    name:"Ed Yip",
    player_id: "f1e39716-ddf8-44b1-83a4-b6d396c85c98"
  });

  // console.log(activeUser);
  // create user in firestore using this data.
  

  
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
