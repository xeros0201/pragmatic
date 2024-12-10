
let preloaderContainer;
let progressBarContainer;
let gameLogoContainer
let progressBar;
let preloaderOverlay;
let isDesktop = !mobileAndTabletCheck();
let _baseURL = window.location.href;
let progressValue = 0;
let maxProgressValue = 20;
let gamePreloaderPath;
let gameLogoPath;
let operatorLogoPath;
let ppGameType;
// let defaultGameType = "baccarat"; // "sicbo";
// let defaultTableTheme = 1xbet/ba1.1"; // "mega-baccarat";
// let defaultTableID = 'h22z8qhp17sa0vkh';
let lang = 'en';
let tableTheme;
let tableID;
let gameLogo;
let operatorLogo;
let _baseThemeUrl;
let _basetheme;
let _subGame;
const allowingLanguage = { "zh": "cn", "vi": "vn", "nb": "no" };
const dedicatedPreloaders = ['casino888', 'stake', 'roobet', '1xlivewhite'];
const dedicatedGameLogoList = ['baccarat', 'sicbo', 'powerball','puntobanco'];
const dedicatedSpeedTablesList = ['cbcf6qas8fscb221'];
let isDefaultTheme;
let defaultThemePath = "../assets/theme/";
let defaultPreloaderPath = "../assets/preloaders/";

const GAME_URL_FOLDER_MAP = {
    'baccaratgame': 'baccarat',
    'multibaccarat': 'baccarat',
    'privatebaccarat': 'baccarat',
    'sicbo':'sicbo',
    'chromasicbo':'sicbo',
    'powerball':'powerball', 
    'treasureadventure':'treasureadventure',
    'treasureisland':'treasureisland'
}

document.addEventListener("readystatechange", (event) => {
    if (document.readyState === 'interactive') { ppgameready(); }
});
function ppgameready() {
    loadPreloader();
}

function calculateDownloadPercentage() {
    let scripts = document.getElementsByTagName('script');
    let preloadFileslength = scripts.length;
    progressBar = document.getElementById('progress_inner');
    progressBar.classList.add('slow-animation');
    progressBar.style.width = '0%';
    let progressbarWidth;
    progressValue = 0;
    for (let index = 0; index < preloadFileslength; index++) {
        const scriptURL = scripts[index].src;
        if (scriptURL !== "") {
            const script = scripts[index];
            if (script) {
                script.onload = () => {
                    progressValue++;
                    progressbarWidth = (progressValue / preloadFileslength) * maxProgressValue;
                    progressBar.style.width = progressbarWidth + '%';
                };
            }
        }
        else {
            progressValue++;
            progressbarWidth = (progressValue / preloadFileslength) * maxProgressValue;
            progressBar.style.width = progressbarWidth + '%';
        }
    }

}
function loadPreloader() {
    preloaderContainer = document.getElementById("preloader_container");
    if (preloaderContainer) { preloaderContainer.ontouchmove = function (e) { e.preventDefault(); } }
    gameLogoContainer = document.getElementsByClassName("game-logo-container")[0];
    gameLogo = document.getElementById("game-logo");
    operatorLogo = document.getElementById("operator-logo");
    preloaderOverlay = document.getElementsByClassName("preload_overlay")[0];
    if (preloaderContainer) {
        addPreloaderImage();
        calculateDownloadPercentage();
        if (!isDesktop) {
            preloaderContainer.addEventListener('touchmove', (event) => { event.preventDefault(); });
            preloaderContainer.classList.add("mobile_preloader_container")
            progressBarContainer = document.getElementsByClassName("progress_container")[0];
            progressBarContainer.classList.add("progress_container_mobile");
            gameLogoContainer.classList.add("game-logo-container-mobile");
            if(ppGameType === 'treasureadventure' || ppGameType === 'treasureisland'){
                gameLogoContainer.classList.add("game-logo-container-mobile-center-ta");
            }
        }
        else {
            let gamescale = (preloaderContainer.getBoundingClientRect().width / 1920);
            document.documentElement.style.setProperty('--game-scale', `${gamescale}`);
            document.documentElement.style.setProperty('--game-scale-AlderneyMsg', `${gamescale * 16}px`);
        }
        window.addEventListener('beforeunload', () => { if (progressBar) { progressBar.remove(); } });
        window.addEventListener('resize', () => {
            if (isDesktop) {
                let gamescale = (preloaderContainer.getBoundingClientRect().width / 1920);
                document.documentElement.style.setProperty('--game-scale', `${gamescale}`);
                document.documentElement.style.setProperty('--game-scale-AlderneyMsg', `${gamescale * 16}px`);
            }
        });
    }
}

function addPreloaderImage() {
    try {
        getThemeUrlFromParams();
    } catch (error) {
        //console.log(error);
    }

}
function getDefaultLanguage(url, storedPPGObj) {
    let DEFAULT_LANGUAGE = 'en';
    let urlLanguage = url.searchParams.get("lang") || storedPPGObj.lang;
    if (urlLanguage) {
        return urlLanguage;
    }
    if (getSessionObject('pplang')) {
        return getSessionObject('pplang');
    }
    let localeLanguage = navigator.language?.split("-")[0];
    return localeLanguage ? localeLanguage : DEFAULT_LANGUAGE;
}
function getThemeUrlFromParams() {
    let url = new URL(_baseURL);
    let storedPPGObj = getSessionObject('PPG');
    try {
        storedPPGObj = { ...window.history.state } ?? JSON.parse(storedPPGObj) ?? {};
    } catch (e) {
        storedPPGObj = {};
    }
    ppGameType = url.searchParams.get("gametype") || storedPPGObj.gametype;
    tableTheme = url.searchParams.get("operator_theme");
    if (!tableTheme) {
        if (checkInGame()) {
            tableTheme = 'default/multi-baccarat';
        } else {
            tableTheme = storedPPGObj.operator_theme || '';
        }
    }
    tableTheme = tableTheme.trim().toLocaleLowerCase() || 'default';
    lang = getDefaultLanguage(url, storedPPGObj);

    if (allowingLanguage[lang] !== undefined) {
        lang = allowingLanguage[lang];
    }
    tableID = url.searchParams.get("table_id") || storedPPGObj.table_id || '';
    _subGame = ppGameType;
    loadpreloaderImage();
}

function loadpreloaderImage() {
    if (ppGameType && tableTheme) {
        //console.log("tableTheme: ", tableTheme);
        if (ppGameType && ppGameType.includes('baccarat')) { ppGameType = 'baccarat'; }
        if (ppGameType && ppGameType.includes('mega-sicbo')) { ppGameType = 'sicbo'; }
        if (ppGameType && ppGameType.includes('chromasicbo')) { ppGameType = 'sicbo'; }
        const themePath = tableTheme.split("/");
        _basetheme = themePath[0];
        const isNewFormat = (themePath.length > 1);
        if (ppGameType === 'sicbo' && !isNewFormat && tableTheme) {
            _basetheme = (_basetheme === 'mega-sicbo-1xbet') ? '1xbet' : 'default';
        }
        _baseThemeUrl = defaultPreloaderPath + ppGameType;
        gamePreloaderPath = _baseThemeUrl + `/` + _basetheme;

        if (tableTheme.includes('mega') && ppGameType === 'baccarat') {
            gamePreloaderPath = gamePreloaderPath + `/mega`;
        }
        if (tableTheme.includes('mega') && ppGameType === 'sicbo') {
            gamePreloaderPath = gamePreloaderPath + `/mega`;
        }
        isDefaultTheme = (_basetheme === 'default');
        const _gamelogpath = (!isDefaultTheme && dedicatedGameLogoList.indexOf(ppGameType) !== -1) ? 'dedicated' : 'default';
        gameLogoPath = _baseThemeUrl + '/' + _gamelogpath + `/` + getGetTableType();
        if (_subGame === "multibaccarat") {
            gameLogoPath = _baseThemeUrl + '/' + _gamelogpath + `/multiplay`;
        } else {
            gameLogoPath = _baseThemeUrl + '/' + _gamelogpath + `/` + getGetTableType();
        }
        if (tableTheme.includes('puntobanco') && ppGameType === 'baccarat') {
            gamePreloaderPath = `${_baseThemeUrl}/puntobanco`;
            gameLogoPath = `${gamePreloaderPath}/${_gamelogpath}`;
        }
        if (tableTheme.includes('megabaccarat_korean') && ppGameType === 'baccarat') {
            gamePreloaderPath = `${_baseThemeUrl}/megabaccarat_korean`;
            console.log("gamePreloaderPath", gamePreloaderPath)
            gameLogoPath = `${gamePreloaderPath}/` + getGetTableType();
        }
        updatePreloaderOverlay();
        updateGameLogoImage();
        if (!isDefaultTheme) {
            operatorLogoPath = defaultPreloaderPath + 'operatorlogo/' + _basetheme;
            updateOperatorLogoImage();
        }
        if (window.location.href.indexOf("localhost") === -1) {
            setSessionObject();
        }
    } else {
        // fetch default preloader BG, if no game context is available
        loadDefaultPreloaderBG();
    }
}

async function loadDefaultPreloaderBG() {
    const path = window.location.pathname;
    const gameType = path.split("/")[2];
    const overlayPath = defaultPreloaderPath + GAME_URL_FOLDER_MAP[gameType] + '/default';
    await fetchThemeBg(overlayPath, false);
}
function getGetTableType() {
    //console.log(ppGameType.includes('speed'),"======",ppGameType)
    if (ppGameType === 'baccarat') {
        if (tableTheme.includes('vip')) {
            return "vip";
        } else if (tableTheme.includes('priv') || tableID.includes('priv')) {
            return "private";
        } else if (tableTheme.includes('fortune6')) {
            return "fortune6";
        } else if (tableTheme.includes('super8')) {
            return "super8";
        }
        else if (tableTheme.includes('mega')) {
            return "mega";
        }
        else if (tableTheme.includes('multiplay') && !tableTheme.includes('speed')) {
            return "multiplay";
        }
        else if ((tableTheme.includes('nocom')) && !tableTheme.includes('speed')) {
            return "nocommission";
        }
        else if (tableTheme.includes('speed') || dedicatedSpeedTablesList.indexOf(tableID) >= 0) {
            return tableTheme.includes('nocom') ? 'speednocommission' : tableTheme.includes('speedmultiplay') ? 'speedmultiplay' : 'speed';
        } else {
            return "regular";
        }
    }
    else if (ppGameType === 'sicbo') {
        if (tableTheme.includes('mega') || tableTheme.includes('asian_sicbo')) { return "mega"; }
    }
    else if (ppGameType === 'powerball') {
        return tableTheme.split('/')[1];
    }
    return "regular";
}

function updatePreloaderImage() {
    const preloaderImg = new Image();
    const _tabletype = getGetTableType();
    if (ppGameType === 'baccarat' && dedicatedPreloaders.indexOf(_basetheme) >= 0) {
        const _tabletype = getGetTableType();
        if (_tabletype === 'regular') {
            preloaderImg.src = gamePreloaderPath + '/loaderbgV1.webp';
        } else {
            preloaderImg.src = gamePreloaderPath + '/' + _tabletype + '/loaderbgV1.webp';
        }
    } else if (ppGameType === 'powerball') {
        preloaderImg.src = gamePreloaderPath + '/' + _tabletype + '/loaderbgV1.webp';
    }
    else {
        preloaderImg.src = gamePreloaderPath + '/loaderbgV1.webp';
    }
    //console.log("gamePreloader ==> ",  gamePreloaderPath + '/loaderbgV1.webp')
    preloaderImg.onload = () => {
        preloaderOverlay.style.opacity = 0.3;
        preloaderContainer.style.backgroundImage = 'url(' + preloaderImg.src + ')';
    };
    preloaderImg.onerror = () => {
        //console.log("Game preloader not found for => "+ _basetheme)
        gamePreloaderPath = _baseThemeUrl + `/default`;
        preloaderImg.src = gamePreloaderPath + '/loaderbgV1.webp';
    };
}
function updateGameLogoImage() {
    gameLogo.src = gameLogoPath + '/title_' + lang + '.png';
    //console.log("gamelogo ==> ", gameLogoPath+ '/title_' +lang+ '.png',tableTheme)
    gameLogo.onload = () => {
        gameLogoContainer.style.opacity = 1;
    };
    gameLogo.onerror = () => {
        //console.log("Game logo not found for lang => "+ lang)
        const gamelogoImg = new Image();
        gamelogoImg.src = gameLogoPath + '/title_en.png';
        gamelogoImg.onload = () => { gameLogo.src = gamelogoImg.src; };
    };
}
function updateOperatorLogoImage() {
    if (ppGameType === 'sicbo' && _basetheme === 'mega-sicbo') return;
    operatorLogo.src = operatorLogoPath + '.png';
    //console.log("operatorlogo ==> ", operatorLogoPath);
}
async function updatePreloaderOverlay() {
    const overlayPath = (tableTheme !== 'default') ? defaultThemePath + tableTheme : defaultPreloaderPath + ppGameType + '/default';
    //console.log("overlayPath =>",overlayPath+`/theme_bg.json`)
    await fetchThemeBg(overlayPath);
}

async function fetchThemeBg(overlayPath, imageRequired = true) {
    try {
        await fetch(overlayPath + `/theme_bg.json`).then((theme) => theme.json()).then((theme) => {
            imageRequired && updatePreloaderImage();
            Object.keys(theme).forEach(k =>
                document.documentElement.style.setProperty(`--${k}`, theme[k])
            );
        });
    } catch (error) {
        //console.log("table theme overlay not found");
    }
}


function setSessionObject() {
    try {
        if (window && window.localStorage && ppGameType) {
            sessionStorage.setItem('ppGameType', ppGameType);
            sessionStorage.setItem('pplang', lang);
            sessionStorage.setItem('table_id', tableID);
            if (!checkInGame()) {
                sessionStorage.setItem('operator_theme', tableTheme);
            }
        }
    } catch (error) {
        if (window && ppGameType) {
            window['ppGameType'] = ppGameType;
            window['pplang'] = lang;
            window['table_id'] = tableID;
            if (!checkInGame()) {
                window['operator_theme'] = tableTheme;
            }
        }
    }
}

function getSessionObject(obj) {
    try {
        if (window && window.localStorage) {
            return sessionStorage.getItem(obj);
        }
    } catch (error) {
        if (window) {
            return window[obj];
        }
        return null;
    }
}


function mobileAndTabletCheck() {
    let check = false;
    const inGame = checkInGame();
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check || inGame;
};

function checkInGame() {
    let url = new URL(window.location.href);
    return url.searchParams.get("inGame") === 'true' ? true : false;
}