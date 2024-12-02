import express from "express";


const api = express.Router();

export const commonHeader = {
    'authority': 'games.pragmaticplaylive.net',
  'method': 'GET',
  
  'scheme': 'https',
  'accept': '*/*',
  'accept-encoding': 'gzip, deflate, br, zstd',
  'accept-language': 'en-US,en;q=0.8',
  'cache-control': 'no-cache',
  'origin': 'https://client.pragmaticplaylive.net',
  'pragma': 'no-cache',
  'priority': 'u=1, i',
  'referer': 'https://client.pragmaticplaylive.net/',
  'sec-ch-ua': '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
//   'sec-fetch-dest': 'empty',
//   'sec-fetch-mode': 'cors',
//   'sec-fetch-site': 'same-site',
  'sec-gpc': '1',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
}
export const baseURL = 'https://games.pragmaticplaylive.net'
const serverBase = "http://localhost:3005"
api.get("/lobby/tables", async (req, res)=>{
    try {
        const response = await fetch(`${baseURL}${req.originalUrl}`,{
            method:"GET",
            headers:{
                ...commonHeader
            }
        })
        const json = await response.json()
        res.status(200).send(json)
    } catch (error) {
            console.log( `${req.path} error:`,error)

            res.status(400).send(error)
    }
})
api.get("/config/preferences", async (req, res)=>{
    try {
        const response = await fetch(`${baseURL}${req.originalUrl}`,{
            method:"GET",
            headers:{
                ...commonHeader
            }
        })
        const json = await response.json()
        res.status(200).send(json)
    } catch (error) {
            console.log( `${req.path} error:`,error)

            res.status(400).send(error)
    }
})
api.get("/env/getAll", async (req, res)=>{
    try {
        const response = await fetch(`${baseURL}${req.originalUrl}`,{
            method:"GET",
            headers:{
                ...commonHeader
            }
        })
        
        const json = await response.json()
        res.status(200).send({...json,
            report:serverBase,
            playerUI:serverBase+"/desktop/",
            statsCollector: serverBase,
            tableMonitoringService:serverBase,
            playerBaseDomain:serverBase,
            gameStats:serverBase
        })
    } catch (error) {
            console.log( `${req.path} error:`,error)

            res.status(400).send(error)
    }
})
api.get("/lobby/curated-tables", async (req, res)=>{
    try {
        const response = await fetch(`${baseURL}${req.originalUrl}`,{
            method:"GET",
            headers:{
                ...commonHeader
            }
        })
        const json = await response.json()
        res.status(200).send(json)
    } catch (error) {
            console.log( `${req.path} error:`,error)

            res.status(400).send(error)
    }
})
api.get("/config/casino", async (req, res)=>{
    try {
        const response = await fetch(`${baseURL}${req.originalUrl}`,{
            method:"GET",
            headers:{
                ...commonHeader
            }
        })
        const json = await response.json()
        res.status(200).send(json)
    } catch (error) {
            console.log( `${req.path} error:`,error)

            res.status(400).send(error)
    }
})

api.get("/wallet/balance", async (req, res)=>{
    try {
        const response = await fetch(`${baseURL}${req.originalUrl}`,{
            method:"GET",
            headers:{
                ...commonHeader
            }
        })
        const json = await response.json()
        res.status(200).send(json)
    } catch (error) {
            console.log( `${req.path} error:`,error)

            res.status(400).send(error)
    }
})


api.get("/ui/getAllConfig", async (req, res)=>{
    try {
        const response = await fetch(`${baseURL}${req.originalUrl}`,{
            method:"GET",
            headers:{
                ...commonHeader
            }
        })
        const json = await response.json()
        res.status(200).send(json)
    } catch (error) {
            console.log( `${req.path} error:`,error)

            res.status(400).send(error)
    }
})

api.get("/ge/versions", async (req, res)=>{
    try {
        const response = await fetch(`${baseURL}${req.originalUrl}`,{
            method:"GET",
            headers:{
                ...commonHeader
            }
        })
        const json = await response.json()
        res.status(200).send(json)
    } catch (error) {
            console.log( `${req.path} error:`,error)

            res.status(400).send(error)
    }
})

api.get("/ui/assignedSlotsForLobby", async (req, res)=>{
    try {
        const response = await fetch(`${baseURL}${req.originalUrl}`,{
            method:"GET",
            headers:{
                ...commonHeader
            }
        })
        const json = await response.json()
        res.status(200).send(json)
    } catch (error) {
            console.log( `${req.path} error:`,error)

            res.status(400).send(error)
    }
})

api.post("/ui/SlotLaunch", async (req, res)=>{
    try {
        console.log(req.body)
        const response = await fetch(`${baseURL}${req.originalUrl}`,{
            method:"POST",
            body: JSON.stringify(req.body) ,
            headers:{
                ...commonHeader,
                "content-type":"application/json"
            }
        })
        const json = await response.json()
        res.status(200).send(json)
    } catch (error) {
            console.log( `${req.path} error:`,error)

            res.status(400).send(error)
    }
})






export {
    api
}