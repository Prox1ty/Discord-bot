require("dotenv").config();

const clientID = process.env.OSU_CLIENT_ID;
const clientSecret = process.env.OSU_CLIENT_SECRET;

class OsuClient {
    constructor (clientID, clientSecret) {
        this.clientID = clientID;
        this.clientSecret = clientSecret;
    }

    getToken = async () => {
        const url = new URL("https://osu.ppy.sh/oauth/token");

        const headers = {
            "Accept" : "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        }

        const params = {
            "client_id" : this.clientID,
            "client_secret": this.clientSecret,
            "grant_type": "client_credentials",
            "scope": "public"
        }
        let body = new URLSearchParams(params).toString();

        try {
            const data = await fetch(url, {
                method: "POST",
                headers,
                body
            })

            if (!data.ok) {
                throw new Error(`Error fetching token: ${data.statusText}`);
            }

            const token = await data.json();
            return token.access_token
        } catch (error) {
            console.log(`An error has occured in getToken: ${error}`)
        }
    }

    getUser = async (username) => {
        const token = await this.getToken()
        const url = new URL(`https://osu.ppy.sh/api/v2/users/${username}/osu`)

        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }

        try {
            const data = await fetch(url, {
                headers,
            })
            const response = await data.json();
            return response;
        } catch (error) {
            console.log(`Error occured in getUser: ${error}`)
        }
    }
}

module.exports = OsuClient;

const osu = new OsuClient(clientID, clientSecret);