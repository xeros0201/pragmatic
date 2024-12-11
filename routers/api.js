import express from "express";
import dotenv from "dotenv";
dotenv.config();
const DOMAIN = process.env.DOMAIN;
const BASE_URL = process.env.BASE_URL;
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
export const domain = DOMAIN || 'localhost:3005'
export const serverBase = domain.includes("localhost") ? `http://${domain}` :  `https://${domain}`
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
            playerBaseDomain:domain,
            gameStats:serverBase,
            promoService:serverBase
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
        json.tableConfig.params.gs_address = serverBase
        res.status(200).send({...json,
            env:{
                ...json.env,
                report:serverBase,
                playerUI:serverBase+"/desktop/",
                statsCollector: serverBase,
                tableMonitoringService:serverBase,
                // playerBaseDomain:domain,
                bonusPromotionsService: serverBase,
                gameStats:serverBase,
                promoService:serverBase
            }
        })
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
api.get("/v3/fetchPromotionsInfo", async (req, res)=>{
    try {
        const response = await fetch(`https://promo.pragmaticplaylive.net${req.originalUrl}`,{
            method:"GET",
            headers:{
                ...commonHeader,
                authorization: req.headers["authorization"],
                cookie: req.headers["cookie"]
            }
        })
        const json = await response.json()
        res.status(200).send(json)
    } catch (error) {
            console.log( `${req.path} error:`,error)

            res.status(400).send(error)
    }
})

api.get("/ui/getRates", async (req, res)=>{
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
api.get("/ui/getRtpDetails", async (req, res)=>{
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

api.post("/ui/savePlayerConfigGeneric", async (req, res)=>{
    try {
        console.log(req.body)
        const response = await fetch(`https://games.pragmaticplaylive.net${req.originalUrl}`,{
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
api.get("/ui/history/summary", async (req, res)=>{
    try {
        const response = await fetch(`https://report.pragmaticplaylive.net${req.originalUrl}`,{
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

api.get("/ui/history/dayWise", async (req, res)=>{
    try {
        const response = await fetch(`https://report.pragmaticplaylive.net${req.originalUrl}`,{
            method:"GET",
            headers:{
                ...commonHeader
            }
        })
        const json = await response.json()
        const ids =  json.days[0].games.game.map((x)=>{
            return x.gameId
        })

        // const history 
        res.status(200).send(json)
    } catch (error) {
            console.log( `${req.path} error:`,error)

            res.status(400).send(error)
    }
})





export {
    api
}