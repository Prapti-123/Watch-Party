const { searchVideos } = require("../services/youtubeService.js");

const searchYouTube = async (req, res) => {
  const query = req.query.q;
  // Implement YouTube search logic here using YouTube Data API or any other method you prefer
    // For example, you can use the googleapis package to interact with the YouTube Data API    
   try {

    const query = req.query.q;

    const videos = await searchVideos(query);

    res.json(videos);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch videos"
    });

  }
}
module.exports = {  searchYouTube };