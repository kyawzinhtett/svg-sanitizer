const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { sanitizeSVG } = require('./sanitize');

const app = express();
const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  if (req.file.mimetype !== "image/svg+xml") {
    fs.unlinkSync(req.file.path);
    return res.status(400).send("Invalid file type.");
  }

  const svgPath = path.resolve(req.file.path);
  const svgContent = fs.readFileSync(svgPath, "utf-8");

  const sanitizedSvgContent = sanitizeSVG(svgContent);

  const unsanitizedPath = path.join(
    "unsanitized_uploads",
    req.file.filename + ".svg"
  );
  fs.writeFileSync(unsanitizedPath, sanitizedSvgContent);

  fs.unlinkSync(svgPath);

  res
    .status(200)
    .send(
      `File uploaded successfully. <a href="/uploads/${req.file.filename}.svg">View SVG</a>`
    );
});

app.use("/uploads", express.static("unsanitized_uploads"));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
if (!fs.existsSync("unsanitized_uploads")) {
  fs.mkdirSync("unsanitized_uploads");
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
