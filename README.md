# remote-job-scraper

This Node.js application scrapes remote job listings from several major job boards, including RemoteOK, We Work Remotely, Remotive, and Himalayas. Users can search by keyword and optionally receive the top 10 results via email.

## Features

- Search for remote jobs across multiple job boards
- View job listings directly in the browser
- Send the top 10 results to an email address
- Uses Puppeteer and Cheerio for scraping
- Email delivery via Nodemailer and EJS templating

## Technologies

- Node.js
- Express
- Puppeteer
- Cheerio
- Nodemailer
- EJS

## Setup Instructions

### Prerequisites

- Node.js installed
- A Gmail account with [App Passwords enabled](https://support.google.com/accounts/answer/185833)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/eslteacher902010/remote-job-scraper.git
   cd remote-job-scraper
