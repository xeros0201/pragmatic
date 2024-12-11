import express from "express";
import path from "path";
import fs, { createWriteStream } from "fs";
import { fileURLToPath } from "url";
import axios from "axios";
import { api,commonHeader,baseURL } from "./routers/api.js";
import { getSession } from "./browser/index.js";
import convert from 'xml-js'
import cookieParser from "cookie-parser";
// Configuration
const PORT = 3005;
const REMOTE_SOURCE_URL = "https://client.pragmaticplaylive.net"; // Fallback URL for missing files

// __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local static directory
const STATIC_DIR = path.join(__dirname, "public");
const PUBLIC_DIR = path.join(__dirname,  'public');
// Initialize Express app
const app = express();
app.use(express.json());
app.use(cookieParser());
// Middleware to parse URL-encoded data (e.g., for form submissions)
app.use(express.urlencoded({ extended: true }));
// Middleware: Serve static files
 app.use("/entry", async (req, res)=> {
  try {
    const hera ="https://277bdnt1n6.iumtibif.net/gs2c/playGame.do"
 
    const trueURL = req.originalUrl.replace("/entry", hera)
    
    const session =  await getSession(trueURL)
    if(!session) return res.redirect('https://games.pragmaticplaylive.net/api/secure/GameLaunch')
      
    res.cookie("PPG", session)
    res.cookie("token", req.query?.token)
    res.redirect('/desktop/lobby2/')
  } catch (error) {
      console.log(error)
    res.send("aaaaaaaaaaaaaa ! watch out yourself !!!")
  }

 })
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


app.use('/cgibin/assignedTablesForLobby.jsp', async (req,res)=>{
  try {
    const response = await fetch(`https://gs3.pragmaticplaylive.net${req.originalUrl}`,{
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
      console.log(req.cookies.token)
      const balance = await  axios.get(`https://deva.abb1901.com/api/v1/internal/auth/balance`,{  
          headers:{
            "x-api-key":"asdqwe123123",
            "token":req.cookies.token,
          }
      })
   
    
      const text = await response.text()
      let json_text = convert.xml2js(text)
   
      console.log()
      json_text.elements[0].elements =   json_text.elements[0]?.elements.map( x =>{
        if(x.name === "balance"){
              x.elements[0].text = balance.data.code===0 ? balance.data.balance : '0'
        }
        if(x.name === "enrollment_date"){
              x.elements[0].text =  new Date(Date.now()).getTime()
        }
        return x
      } )
      
  
      const true_return = convert.js2xml(json_text)
      res.set("Content-Type", "application/xml");
   

      setTimeout(()=>{
        res.status(200).send(true_return)
      },1000)
    } catch (error) {
        console.log(error)
      res.status(400).send(error)
    }
 

})

app.use('/cgibin/usermanagement/audit/game.jsp', async (req,res)=>{
  try {
    const response = await fetch(`https://report.pragmaticplaylive.net${req.originalUrl}`,{
      method:"GET",
      headers:{
        ...commonHeader,
        accept:"application/json, text/plain, */*",
        cookie: req.headers.cookie,
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
app.use('/eventcapture/settings', async (req,res)=>{
  try {
    const response = await fetch(`https://stats.pragmaticplaylive.net${req.originalUrl}`,{
      method:"GET",
      headers:{
        ...commonHeader,
        accept:"application/json, text/plain, */*"
      }
    })
    const text = await response.json()
 
    res.status(200).send(text)
  } catch (error) {
      console.log(error)
    res.status(400).send(error)
  }
})

app.use('/eventcapture/v2/videostats', async (req,res)=>{
  try {
    const response = await fetch(`https://stats.pragmaticplaylive.net${req.originalUrl}`,{
      method:"POST",
      body:JSON.stringify(req.body),
      headers:{
        ...commonHeader,
        accept:"application/json, text/plain, */*",
        authorization: req.headers["authorization"],
        cookie: req.headers["cookie"],
      }
    })
    const text = await response.json()
 
    res.status(200).send(text)
  } catch (error) {
      console.log(error)
    res.status(400).send(error)
  }
})

app.use('/quality/video', async (req,res)=>{
  try {

   
    const response = await fetch(`https://stats.pragmaticplaylive.net${req.originalUrl}`,{
      method:req.method,
      body: req.method === "GET" ?  null : JSON.stringify(req.body),
      headers:{
        ...commonHeader,
       
      }
    })
    const text = await response.text()
  
    res.status(200).send(text)
  } catch (error) {
      console.log(error)
    res.status(400).send(error)
  }
})
app.use(async function(req, res, next) {
  const filePath = path.join(PUBLIC_DIR, req.path);
  
  // Exclude paths that should not be treated as static assets
  if (req.path.includes('api') || req.path.includes("undefined") || req.path.includes("null")) {
    return next();
  }

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    try {
      // Construct URL for downloading from example.com
      const url = `${REMOTE_SOURCE_URL}${req.path}`;

      // Ensure the directory exists
      const directoryPath = path.dirname(filePath);
    

      // Download the file
      const response = await axios({
        method: 'GET',
        url,
        responseType: 'stream',
      });

      const writer = createWriteStream(filePath);
      response.data.pipe(writer);
      fs.mkdirSync(directoryPath, { recursive: true });
      await new Promise((resolve, reject) => {
        
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Log successful download
      console.log(`File downloaded successfully: ${req.path}`);

      // Serve the file
      res.sendFile(filePath);
    } catch (error) {
      // Handle errors during download
      // console.error(`Error downloading file: ${req.path}`, error);
      res.status(404).send('File not found and could not be downloaded.');
    }
  } else {
    // If file exists, just serve it
    res.sendFile(filePath);
  }
});

app.use(express.static(PUBLIC_DIR));


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});