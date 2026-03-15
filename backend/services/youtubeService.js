require ("dotenv").config();
const axios = require("axios");

const searchVideos = async (query) => {

  const API_KEY = process.env.YOUTUBE_API_KEY;

  const url = "https://www.googleapis.com/youtube/v3/search";

  const response = await axios.get(url, {
    params: {
      part: "snippet",
      q: query,
      type: "video",
      maxResults: 10,
      key: API_KEY
    }
  });

  return response.data.items;
}
module.exports = { searchVideos };