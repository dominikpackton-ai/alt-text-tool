const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

const app = express();

app.use(express.json());

// 🔥 YE LINE MUST HAI
app.use(express.static("public"));

// ROOT FIX
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// API
app.post("/extract", async (req, res) => {
  const urls = req.body.urls;
  let results = [];

  for (let url of urls) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      $("img").each((i, el) => {
        let img = $(el).attr("src");

        if (img) {
          results.push({
            page: url,
            image: img,
            alt: generateAlt(img)
          });
        }
      });

    } catch (err) {
      console.log("Error:", url);
    }
  }

  res.json(results);
});

// ALT GENERATOR
function generateAlt(imgUrl) {
  let name = imgUrl.split("/").pop().split(".")[0];
  name = name.replace(/[-_]/g, " ");
  return "Image of " + name;
}

// PORT FIX (Render ke liye)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
