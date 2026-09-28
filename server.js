const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post("/rating", (req, res) => {
    const rating = Number(req.body.rating);

    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            message: "Invalid rating."
        });
    }

    const ratings = JSON.parse(
        fs.readFileSync("ratings.json", "utf8")
    );

    ratings.push({
        rating: rating,
        date: new Date().toISOString()
    });

    fs.writeFileSync(
        "ratings.json",
        JSON.stringify(ratings, null, 2)
    );

    console.log("Rating saved:", rating);

    res.json({
        message: "Rating saved successfully!"
    });
});
      app.get("/ratings", (req, res) => {
    const ratings = JSON.parse(
        fs.readFileSync("ratings.json", "utf8")
    );

    if (ratings.length === 0) {
        return res.json({
            average: 0,
            total: 0
        });
    }

    const total = ratings.length;

    const sum = ratings.reduce((total, item) => {
        return total + item.rating;
    }, 0);

    const average = (sum / total).toFixed(1);

    res.json({
        average: Number(average),
        total: total
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});