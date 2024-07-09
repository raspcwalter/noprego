import {GoogleLogin} from 'react-google-login';

const googleClientId = '321113386712-3u0vo7b7faoln0jr9nfvo1hoflkef7mp.apps.googleusercontent.com';

const Login = () => {

    const onSuccess = (res) => {
        console.log("Login success! User: "+res.profileObj);
    }

    const onFailure = (res) => {
        console.log("Login failed! res: "+res);
    }

    return (
        <div id="signInButton">
            <GoogleLogin
                clientId={googleClientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={"single_host_origin"}
                isSignedIn={true}
            />
        </div>
    );
}

export default Login;