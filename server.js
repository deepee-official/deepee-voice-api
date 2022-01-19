const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const googleTTS = require("node-google-tts-api");

const port = 3080;
const app = express();
const TTS = new googleTTS();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

async function newTTS(speechText, languageId) {
  const timestamp = new Date().getTime();
  const filename = timestamp + ".mp3";
  const url = __dirname + "\\public\\tts\\" + filename;

  const buffer = await TTS.get({
    text: speechText,
    lang: languageId,
  });

  fs.writeFileSync(url, buffer);
  return url;
}

app.post("/api/speechInput", async function (req, res) {
  const fileUrl = await newTTS(req.body.speechText, "it");
  res.sendFile(fileUrl, function (err) {
    if (err) {
      console.error("Errore:\n", err);
      res.send(err);
    } else {
      console.log("Inviato: ", fileUrl);
      fs.unlinkSync(fileUrl);
      console.log("Eliminato: ", fileUrl);
    }
  });
});

app.listen(port, () => {
  console.log("Server in ascolto sulla porta " + port);
});
