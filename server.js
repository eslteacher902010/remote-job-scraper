const express = require("express");
const scrapeJobs = require("./scraper");
const { sendEmail } = require("./mailer"); 
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const site = req.query.site || "";
  const query = req.query.query || "";
  const email = req.query.email;
  const name = req.query.name || "there"; // fallback if name not provided

  let jobs = [];
  if (site && query) {
    jobs = await scrapeJobs(site, query);

    if (email && jobs.length > 0) {
      const topTenJobs = jobs.slice(0, 10);
      await sendEmail(
        email,
        "Top 10 Job Listings",
        path.join(__dirname, "views", "email.ejs"),
        {
          name: name,
          jobs: topTenJobs
        }
      );
    }
  }

  res.render("index", { jobs, site, query }); // Preserve values for re-render
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
