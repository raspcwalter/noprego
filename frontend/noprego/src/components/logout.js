import {GoogleLogout} from 'react-google-login';

const googleClientId = '321113386712-3u0vo7b7faoln0jr9nfvo1hoflkef7mp.apps.googleusercontent.com';

const Logout = () => {

    const onSuccess = () => {
        console.log("Log out successful!");
    }

    return (
        <div id="signOutButton">
            <GoogleLogout
                clientId={googleClientId}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
            />
        </div>
    );
}

export default Logout;