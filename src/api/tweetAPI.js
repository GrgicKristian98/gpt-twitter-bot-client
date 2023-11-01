import {API_URL} from "./config/config";

class TweetAPI {
    async postTweet(topic) {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/api/tweet`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({topic})
        });

        if (response.status !== 202) {
            const responseObj = await response.json();
            throw new Error((responseObj.hasOwnProperty("message")) ? responseObj.message
                : "Error posting tweet");
        }
    }

    async getTweetsForUser() {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/api/tweet/all/user`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
            }
        });

        const responseObj = await response.json();

        if (!responseObj.hasOwnProperty("embeds")) {
            throw new Error((responseObj.hasOwnProperty("message")) ? responseObj.message
                : "Error getting tweets");
        }

        return responseObj.embeds;
    }

    async getTweets() {
        const response = await fetch(`${API_URL}/api/tweet/all`, {
            method: 'GET',
        });

        const responseObj = await response.json();

        if (!responseObj.hasOwnProperty("embeds")) {
            throw new Error((responseObj.hasOwnProperty("message")) ? responseObj.message
                : "Error getting tweets");
        }

        return responseObj.embeds;
    }
}

export default new TweetAPI();