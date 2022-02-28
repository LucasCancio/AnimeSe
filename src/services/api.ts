import "dotenv/config";
import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.myanimelist.net/v2",
  headers: {
    "X-MAL-CLIENT-ID": process.env.MY_ANIME_LIST_CLIENT_ID,
  },
});
