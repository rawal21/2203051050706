const express = require("express");
const app = express();
const PORT = 3000;

const logger = require("./logger");
const store = require("./urlStore");
const { generateShortcode, isValidShortcode } = require("./utils");

app.use(express.json());
app.use(logger);

// POST /shorten
app.post("/shorten", (req, res) => {
  const { longUrl, shortcode, validity } = req.body;

  if (!longUrl || typeof longUrl !== "string") {
    return res.status(400).json({ error: "Invalid or missing longUrl" });
  }

  let code = shortcode || generateShortcode();

  if (!isValidShortcode(code)) {
    return res.status(400).json({ error: "Invalid shortcode format" });
  }

  if (store.has(code)) {
    return res.status(409).json({ error: "Shortcode already in use" });
  }

  const ttl = (validity && parseInt(validity)) || 30; // default to 30 mins
  const expiresAt =  (Date.now() + ttl * 60 * 1000)
  

  store.set(code, { longUrl, expiresAt });

  res.status(201).json({ shortUrl: `http://localhost:${PORT}/${code}` , expiry : expiresAt});
});

// GET /:shortcode
app.get("/:code", (req, res) => {
  const { code } = req.params;

  if (!store.has(code)) {
    return res.status(404).json({ error: "Shortcode not found" });
  }

  const { longUrl, expiresAt } = store.get(code);

  if (Date.now() > expiresAt) {
    store.delete(code);
    return res.status(410).json({ error: "Short URL expired" });
  }

  res.redirect(longUrl);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unexpected Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`URL Shortener running at http://localhost:${PORT}`);
});
