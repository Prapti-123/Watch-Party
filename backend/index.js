const express = require("express");
const cors = require("cors");
const youtubeRoutes = require("./routes/youtubeRoutes.js");
const app = express();

app.use(cors());
app.use(express.json());


app.get("/api/test", (req, res) => {
  res.json({ message: "API working" });
});

app.use("/api/youtube",youtubeRoutes);
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});