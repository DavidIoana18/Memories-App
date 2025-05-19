import {jwtDecode} from 'jwt-decode';

export function getLoggedInUserId() {
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken = jwtDecode(token);
        return decodedToken.id;
    }
    return null;
}