import '../App.css';
import SignUp from "./SignUp";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";

import SportsHockeyIcon from '@mui/icons-material/SportsHockey';

import { AuthContextProvider } from "../contexts/AuthContext";
import {UserAuth} from '../contexts/AuthContext';


function App() {
  const {user, logOut} = UserAuth();
 

  return (
    
      <div className="App">
        <NavBar />
        <SportsHockeyIcon/>
        <h1>Hockey Stat Tracker</h1>
        {!user ? 
        <SignUp /> :
        <Dashboard />
        }        
        
      </div>
    
  );
}

export default App;
