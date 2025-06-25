const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function scrapeJobs(site = "remoteok", query = "python developer") {
  const jobs = [];
  const formattedQuery = query.trim().toLowerCase().replace(/\s+/g, "-");

  let url;
  switch (site) {
    case "remoteok":
      url = `https://remoteok.com/remote-${formattedQuery}-jobs`;
      break;
    case "weworkremotely":
      url = `https://weworkremotely.com/remote-jobs/search?term=${formattedQuery}`;
      break;
    case "remotive":
      url = `https://remotive.io/remote-jobs/search?search=${formattedQuery}`;
      break;
    case "himalayas":
      url = `https://himalayas.app/jobs?search=${formattedQuery}`;
      break;
    default:
      console.error("Unsupported site.");
      return [];
  }

  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || 
    "/opt/render/.cache/puppeteer/chrome/linux-137.0.7151.119/chrome-linux64/chrome";

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    const content = await page.content();
    const $ = cheerio.load(content);

    if (site === "remoteok") {
      $("tr.job").each((i, el) => {
        const title = $(el).find("h2").text().trim();
        const company = $(el).find("h3").text().trim();
        const summary = $(el).find("td.description").text().trim();
        const href = $(el).attr("data-href");
        const link = href ? `https://remoteok.com${href}` : "";

        if (title) jobs.push({ title, company, summary, link });
      });
    } else if (site === "weworkremotely") {
      $(".jobs article").each((i, el) => {
        const title = $(el).find("span.title").text().trim();
        const company = $(el).find("span.company").text().trim();
        const summary = $(el).find("span.region").text().trim();
        const href = $(el).find("a").attr("href");
        const link = href ? `https://weworkremotely.com${href}` : "";

        if (title) jobs.push({ title, company, summary, link });
      });
    } else if (site === "remotive") {
      $("div.job-list div.card").each((i, el) => {
        const title = $(el).find("h2.card-title").text().trim();
        const company = $(el).find("div.card-company").text().trim();
        const summary = $(el).find("p.card-description").text().trim();
        const link = $(el).find("a").attr("href") || "";

        if (title) jobs.push({ title, company, summary, link });
      });
    } else if (site === "himalayas") {
      $("div.JobCard").each((i, el) => {
        const title = $(el).find(".JobCard__title").text().trim();
        const company = $(el).find(".JobCard__company").text().trim();
        const summary = $(el).find(".JobCard__location").text().trim();
        const href = $(el).find("a").attr("href");
        const link = href ? `https://himalayas.app${href}` : "";

        if (title) jobs.push({ title, company, summary, link });
      });
    }

    await browser.close();
    return jobs;

  } catch (err) {
    console.error("Scraping error:", err);
    return [];
  }
}

module.exports = scrapeJobs;
