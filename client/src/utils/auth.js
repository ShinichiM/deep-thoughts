import decode from 'jwt-decode';

class AuthService {
    //  retrieve data saved in token
    getProfile() {
        return decode(this.getToken());
    }

    // check if the user is stil logged in
    loggedIn() {
        // checks if there is a saved token and still valid
        console.log(this);
        const token = this.getToken();
        // use type coersion to check if token is Not undefined and token is not expired
        return !!token && !this.isTokenExpired(token);
    } 

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            } else {
                return false;
            }
        } catch(err) {
            return false;
        }
    }
    // retrieve token from localStorage
    getToken() {
        // retrieves user token from localstorage
        return localStorage.getItem('id_token')
    }
    // set token to localStorage and reload page to homepage
    login(idToken) {
        // save user token to localStorage
        localStorage.setItem('id_token', idToken);

        window.location.assign('/')
    }

    // clear token from localstorage and force logout with reload
    logout() {
        // clear token and profile data from localstorage
        localStorage.removeItem('id_token');
        // reload page and reset the state of application
        window.location.assign('/')
    }
}

export default new AuthService();