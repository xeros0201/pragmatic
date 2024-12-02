import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import axios from "axios";
import { api,commonHeader,baseURL } from "./routers/api.js";

// Configuration
const PORT = 3005;
const REMOTE_SOURCE_URL = "https://client.pragmaticplaylive.net"; // Fallback URL for missing files

// __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local static directory
const STATIC_DIR = path.join(__dirname, "public");

// Initialize Express app
const app = express();
app.use(express.json());

// Middleware to parse URL-encoded data (e.g., for form submissions)
app.use(express.urlencoded({ extended: true }));
// Middleware: Serve static files
app.use(express.static(STATIC_DIR));
app.use("/api", api)
app.use('/cgibin/tableconfig.jsp', async (req,res)=>{
  try {
    const response = await fetch(`${baseURL}${req.originalUrl}`,{
      method:"GET",
      headers:{
        ...commonHeader,
        accept:"application/json, text/plain, */*"
      }
    })
    const text = await response.text()
    res.set("Content-Type", "application/xml");
    res.status(200).send(text)
  } catch (error) {
      console.log(error)
    res.status(400).send(error)
  }
})
app.use('/cgibin/balance.jsp', async (req,res)=>{
  try {
    const response = await fetch(`${baseURL}${req.originalUrl}`,{
      method:"GET",
      headers:{
        ...commonHeader,
        accept:"application/json, text/plain, */*"
      }
    })
    const text = await response.text()
    res.set("Content-Type", "application/xml");
    res.status(200).send(text)
  } catch (error) {
      console.log(error)
    res.status(400).send(error)
  }
})
// Route: Handle requests for files not found in the static directory
app.get("*", async (req, res) => {
  const requestedFile = path.join(STATIC_DIR, req.path);

  // Check if the file exists locally
  if (fs.existsSync(requestedFile)) {
    return res.sendFile(requestedFile);
  }

  try {
    // Fetch the file from the remote source
    const remoteFileUrl = `${REMOTE_SOURCE_URL}${req.path}`;
    const response = await axios.get(remoteFileUrl, { 
        responseType: "stream",
         ...commonHeader
     });

    // Save the file locally for caching (optional)
    const localFileStream = fs.createWriteStream(requestedFile);
    response.data.pipe(localFileStream);

    // Wait for the file to finish writing, then serve it
    localFileStream.on("finish", () => {
      res.sendFile(requestedFile);
    });

    // Handle errors during file saving
    localFileStream.on("error", (err) => {
      console.error("Error writing file:", err);
      res.status(500).send("Error saving file");
    });
  } catch (error) {
    console.error("Error fetching file:", error.message);
    res.status(404).send("File not found");
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});