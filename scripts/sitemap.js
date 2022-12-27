#!/usr/bin/env node

"use strict"

const fs = require("fs")
const path = require("path")

const BASE_URL = "https://deaths.chewam.com"

const urls = fs
  .readdirSync("src/pages")
  .filter((pages) => {
    return ![
      "_app.tsx",
      "_document.tsx"
    ].includes(pages)
  })
  .map((page) => {
    return `${BASE_URL}/${path.parse(page).name}`
  })

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map((url) => {
        return `
          <url>
            <loc>${url}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
          </url>
        `;
      })
      .join("")}
  </urlset>
`;

fs.writeFileSync('public/sitemap.xml', sitemap)
