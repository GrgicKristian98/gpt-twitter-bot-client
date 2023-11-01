import {API_URL} from "./config/config";
import {HttpError} from "../errors/httpError.js";

class UserAPI {
    async getTwitterLoginUrl() {
        const response = await fetch(`${API_URL}/api/user/login/url`, {method: 'POST'});
        const responseObj = await response.json();

        if (!responseObj.hasOwnProperty("url")) {
            throw new Error((responseObj.hasOwnProperty("message")) ? responseObj.message
                : "Error getting login url");
        }

        return responseObj.url;
    }

    async executeTwitterLogin(code, state) {
        const response = await fetch(`${API_URL}/api/user/login/callback`, {
            method: 'POST',
            body: JSON.stringify({code, state}),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const responseObj = await response.json();

        if (!responseObj.hasOwnProperty("token")) {
            throw new Error((responseObj.hasOwnProperty("message")) ? responseObj.message
                : "Error executing login");
        }

        return responseObj.token;
    }

    async validateUser(token) {
        const response = await fetch(`${API_URL}/api/user/validate`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
            }
        });

        const responseObj = await response.json();

        if (response.status === 401) {
            throw new HttpError((responseObj.hasOwnProperty("message")) ? responseObj.message
                : "Unauthorized", response.status);
        }

        if (!responseObj.hasOwnProperty("userId")) {
            throw new HttpError((responseObj.hasOwnProperty("message")) ? responseObj.message
                : "Internal server error", response.status);
        }

        return responseObj.userId;
    }
}

export default new UserAPI();