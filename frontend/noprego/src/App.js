import './App.css';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

function App() {

    const login = async (credential) => {
        const decodedToken = jwtDecode(credential);
        console.log(decodedToken);
        console.log(decodedToken.email);
        console.log(typeof(decodedToken.email));

        axios.post('http://localhost:3001/user', {
            email: decodedToken.email
          })
          .then(function (response) {
            console.log('Data sent successfully: ', response);
          })
          .catch(function (error) {
            console.log("Connection error: "+error);
          });
    }

    return (
      <GoogleLogin
        onSuccess = {response => {
            login(response.credential);
        }}
        onError={() => {
            console.log('Login Failed');
        }}
      />
    );
}

export default App;