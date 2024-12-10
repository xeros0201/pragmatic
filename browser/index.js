import { chromium } from 'patchright'
import { fileURLToPath } from 'url';
import path from 'path'
import { serverBase } from '../routers/api.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export  const  getSession = async (url) => {
  try {
    const browser = await chromium.launch({
      channel: "msedge",
      headless: true,
      viewport: null,
      args:[
        "--disable-field-trial-config",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--no-default-browser-check",
        "--disable-dev-shm-usage",
        "--disable-hang-monitor",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--force-color-profile=srgb",
        "--no-first-run",
        "--password-store=basic",
        "--use-mock-keychain",
        "--no-service-autorun",
        "--export-tagged-pdf",
        "--disable-search-engine-choice-screen",
        "--disable-blink-features=AutomationControlled",
        "--headless",
        "--hide-scrollbars",
        "--mute-audio",
        "--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4",
        "--no-sandbox",
 
 
      ]
  })
  
  const page = await browser.newPage()
  const response =  await page.goto(url,{
   
  })
  
  if(!  response.ok()) return false
  await page.waitForURL("https://client.pragmaticplaylive.net/desktop/lobby2/")
  const sessionStorageData = await page.evaluate(() => {

      return sessionStorage.getItem("PPG");
    });
  
 
    const json = JSON.parse(sessionStorageData)

    const baseUrl = serverBase
    let sample =  {
      "JSESSIONID":json["JSESSIONID"],
      "actual_web_server": baseUrl,
      "casino_id": "ppcdt00000002640",
      "config_url": "/cgibin/appconfig/xml/configs/urls.xml",
      "game_mode": "html5_desktop",
      "gametype": "baccarat",
      "hasQuickGuide": "",
      "hostCommunicationVersion": "",
      "lang": "ko",
      "meta_server": baseUrl,
      "operator_theme": "",	
      "socket_port": "443",
      "socket_server": "wss://games.pragmaticplaylive.net/game",
      "stats_collector_uuid": "de121ff1-43a5-4220-a77f-147e3856f922",
      "table_id": "",
      "token": json["token"],
      "uiversion": "1.15.2",
      "web_server": baseUrl+"/",
      "lobbyFilter": "",
      "gamePath": "/desktop/lobby2",
      "tabletype": "baccarat",
      "uiAddress": baseUrl+"/desktop/lobby2/",
      "lobby_version": "2",
      "swf_lobby_path": "/member/games/lobby.swf",
      "lobbyGameSymbol": ""
    }
    
   
    await browser.close()
    return JSON.stringify(sample)
   
  } catch (error) {
      console.log("playwirght error:",error)
      return false
  }
 


} 
 