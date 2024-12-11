const wss = "wss://deva.abb1901.com";
function getCookie(name) {
  const cookieArr = document.cookie.split("; ");

  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split("=");

    // Check if the current cookie name matches the desired name
    if (cookiePair[0] === name) {
      return decodeURIComponent(cookiePair[1]); // Decode and return the cookie value
    }
  }

  return null; // Return null if the cookie is not found
}
const token_from_cookie = getCookie("token");
const socket = io(wss, {
  transports: ["websocket", "polling"],
  
  auth: {
    token: token_from_cookie,
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
});
socket.on("connect", () => {
  console.log("Connected to server");
});

const gameCode = {
  0: {
    value: "player",
    code: "p",
  },
  1: {
    value: "banker",
    code: "b",
  },
  2: {
    value: "tie",
    code: "t",
  },
  3: {
    value: "player pair",
    code: "pp",
  },
  4: {
    value: "banker pair",
    code: "bp",
  },
  8: {
    value: "perfect pair",
    code: "prp",
  },
  9: {
    value: "either pair",
    code: "ep",
  },
  12: {
    value: "player bonus",
    code: "pb",
  },
  13: {
    value: "banker bonus",
    code: "bb",
  },
};

function inCommingMessage(e) {
  if (e?.bet) {
    const bets = CookieCRUD.getItem(e?.bet.table);
    if (!bets) return e;
    const rc = bets.find((x) => x.betcode === e?.bet?.betcode);

    return {
      bet: {
        ...e.bet,
        amount: rc.amount,
      },
    };
  }

  if (e?.bets) {
    const bets = CookieCRUD.getItem(e?.bets.table);
    if (!bets) return e;

    if (!Array.isArray(e.bets.bet)) {
      const rc = bets.find((x) => x.betcode === e.bets.bet.betcode);
      e.bets.bet.amount = rc.amount;
      return e;
    }
    e.bets.bet = e.bets.bet.map((item) => {
      const rc = bets.find((x) => x.betcode === item.betcode);
      return {
        ...item,
        amount: rc.amount || item.amount,
      };
    });
  }

  if (e?.win) {
    const winvalue = CookieCRUD.getItem(e?.win?.gameId);
    const bets = CookieCRUD.getItem(e?.win.table);
    const gameCode_table = CookieCRUD.getItem(e?.win.table+"gameCode" )
    if (!winvalue )  return e

    socket.emit("payoff", {
      args: {
        gameCode:gameCode_table ,
        gameId: e?.win.gameId,
        payoutAmount: winvalue,
        tableId: e?.win.table,
        amount: e.win["win"],
        sample: gameCode,
        orignalData: bets
      },
    });
    e.win["win"] = winvalue;
    CookieCRUD.deleteCookie(e?.win?.table);
    CookieCRUD.deleteCookie(e?.win?.gameId);

    return e;
  }
  if (e?.gameresult) {
    const bets = CookieCRUD.getItem(e?.gameresult.table);
    if (!bets) return e;
    let total = 0;
   
    bets.map((x) => {
      const gameValue = gameCode[x.betcode];

      const win_rate = e?.gameresult[gameValue.code];
      total += x.amount * win_rate;
    });

    CookieCRUD.createItem(e?.gameresult.gameId, total, 420);

    return e;
  }
  if (e?.winners) {
    return e;
  }

  return e;
}

function dataBet({ bets, gameId ,config,tableId }) {
  CookieCRUD.createItem(tableId, bets,420)
  CookieCRUD.createItem(tableId+"gameCode", config.operatorGameId,60)
  
  const totalAmount = bets.reduce((total, bet) => total + bet.amount, 0);

  
  socket.emit("databet", {
    gameId:config.operatorGameId,
    totalAmount,
    bets,
    sample: gameCode,
  });
}
function bacaratBet({ amount, code, gameId, tableId, config }) {
  const min = 1000;
 

  const rate = getRate();
  let newAmount = amount * rate > min ? amount * rate : min;
  return {
    amount: newAmount,
    code,
    gameId,
  };
}

function extractProperties(obj, keysToExtract) {
  const result = {};

  for (let key in obj) {
    if (keysToExtract.includes(key)) {
      result[key] = obj[key];
    }
  }

  return result;
}

function getTrueProperties(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value === true) {
      acc[key] = value;
    }
    return acc;
  }, {});
}
