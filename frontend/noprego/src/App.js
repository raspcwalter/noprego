import './App.css';
import LoginButton from "./components/login";
import LogoutButton from './components/logout';
import {useEffect} from 'react';
import {gapi} from 'gapi-script';

const googleClientId = '321113386712-3u0vo7b7faoln0jr9nfvo1hoflkef7mp.apps.googleusercontent.com';

function App() {

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: googleClientId,
        scope: ""
      })
    };
 
    gapi.load("client:auth2", start);
  });

  return (
    <div className="App">
      <LoginButton />
      <LogoutButton />
    </div>
  );
}

export default App;