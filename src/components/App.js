import '../App.css';
// import { Container } from'@mui/material';
import SignUp from "./SignUp";
import NavBar from "./NavBar";
import { AuthContextProvider } from "../contexts/AuthContext";

function App() {
  return (
    <AuthContextProvider>
      <div className="App">
        <NavBar/>
        <h1>Hockey Stat Tracker</h1>
        <SignUp />
      </div>
    </AuthContextProvider>
  );
}

export default App;
