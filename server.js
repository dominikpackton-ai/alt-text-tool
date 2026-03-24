const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(express.json());

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

function generateAlt(imgUrl) {
    let name = imgUrl.split("/").pop().split(".")[0];
    name = name.replace(/[-_]/g, " ");
    return "Image of " + name;
}

app.listen(3000, () => console.log("Server running"));