const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { getDataFromGeminiAiForPdfAndImages } = require("./apis/geminiAPI");
const { getFileNameWithoutExtension } = require("./utils/paths");
const { convertExcelToCsv } = require("./utils/excelToCsv");
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

const mediaPath = path.join(__dirname, "media");
if (!fs.existsSync(mediaPath)) {
  fs.mkdirSync(mediaPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, mediaPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.post("/upload", upload.single("file"), async (req, res) => {
  let filePath, data;
  const xlsxMimeType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (req.file.mimetype === xlsxMimeType) {
    filePath = path.join(
      mediaPath,
      `${getFileNameWithoutExtension(req.file.originalname)}.csv`
    );
    convertExcelToCsv(path.join(mediaPath, req.file.originalname), filePath);
    data = await getDataFromGeminiAiForPdfAndImages(filePath, "text/csv");
  } else {
    filePath = path.join(mediaPath, req.file.originalname);
    data = await getDataFromGeminiAiForPdfAndImages(
      filePath,
      req.file.mimetype
    );
  }

  res.send(data);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
