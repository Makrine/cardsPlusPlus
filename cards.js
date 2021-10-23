var cardsIdSeason = [];
var cardData = [];
var cardsLen;
var UserAgent = "tmakrine@gmail.com";
var requestsNum = 0;
var requestTimes = new Array();
var processedCardsNumber;

var junkPrices = {
    'common' : 0.01,
    'uncommon' : 0.05,
    'rare' : 0.10,
    'ultra-rare' : 0.20,
    'epic' : 0.50,
    'legendary' : 1.00
}


function catchCards() {
    processedCardsNumber = 0;

    var cards = document.getElementsByClassName("deckcard-container");
    cardsLen = cards.length;

    for(var i = 0; i < cardsLen; i++) {
        var child = cards[i].querySelector("[data-cardid]");
        var id = child.getAttribute("data-cardid");
        var season = child.getAttribute("data-season");
        cardsIdSeason.push([id, season]);
    }
    console.log(cardsIdSeason)
    getAndDisplayInfo();
}




function getCardData(cardID, season) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {   
        if(xhttp.readyState == 4) { // some data received
            if(xhttp.status == 200) { // everything went OK
                readMarketXML(this);
                makeMarketRequest();
                processedCardsNumber++;
                console.log("OK")
            }
            else if(xhttp.status == 403) console.log(nation + ": Forbidden!");
            else if(xhttp.status == 404) console.log(nation + " does not exist");
            else if(xhttp.status == 429) console.log("Too many requests! Blocked for 15 min!");
            else console.log("Unknown Error! Contact tmakrine@gmail.com or Mackiland");
        }
        else if(xhttp.readyState == 2) { // request is sent
            requestsNum++;
            console.log("Request Sent! " + requestsNum);
        }
    }
    xhttp.open("GET", `https://www.nationstates.net/cgi-bin/api.cgi?userAgent=${UserAgent}&q=card+markets;cardid=${cardID};season=${season}`);
    xhttp.send();
}


function readMarketXML(xhttpResponse) {

    var xmlFile = xhttpResponse.responseXML;
    var cardMV = parseFloat(xmlFile.getElementsByTagName("MARKET_VALUE")[0].innerHTML);
    var cardBids = new Array();
    var cardAsks = new Array();
    
    var type = xmlFile.getElementsByTagName("TYPE");
    var price = xmlFile.getElementsByTagName("PRICE");
    
    var len = type.length;
    for(var i = 0; i < len; i++) {
        var p = price[i].innerHTML; 
        if(type[i].innerHTML == "bid") {
            cardBids.push(p);
        }
        else cardAsks.push(p);
    }

    var minAsk = 0;
    var maxBid = 0;
    if(cardBids.length) {
        maxBid = parseFloat(cardBids[0]);
        for(var i = 1; i < cardBids.length; i++) {
            if(parseFloat(cardBids[i]) > maxBid) maxBid = parseFloat(cardBids[i]);
        }
    }

    if(cardAsks.length) {
        minAsk = parseFloat(cardAsks[0]);
        for(var i = 1; i < cardAsks.length; i++) {
            if(parseFloat(cardAsks[i]) < minAsk) minAsk = parseFloat(cardAsks[i]);
        }
    }

    
    cardData = [minAsk, maxBid, cardMV];
}



function makeMarketRequest() {
    var delay;
    var timeNow = new Date().getTime();
    requestTimes.push(timeNow + 30000);
    delay = requestTimes.shift() - timeNow;
    if (delay < 0) { delay = 0.6; };
    var t = setTimeout(function(){
        if(cardsIdSeason.length) {
            getCardData(cardsIdSeason[0][0], cardsIdSeason[0][1]);
            cardsIdSeason.shift();
            if(processedCardsNumber == cardsLen - 1) {
                console.log("DONE");
            }
        } else clearTimeout(t);
        }, delay);
    displayData();
}

function displayData() {

    var ask = cardData[0];
    var bid = cardData[1];
    var mv = cardData[2];

    var dataToAppend =

    `<div class="info" style="
    z-index: 1;
    position: absolute;
    color: red;
    margin-top: 60%;
    letter-spacing: 0;
    text-align: left;
    font-size: 12px;
">
    <div class="bid" style="
    float: left;
">
    BID: ${bid}
    </div>
    <div class="ask" style="
">
    ASK: ${ask}
    </div>
    
    <div class="mv">
    MV: ${mv}
    </div>`

    

    var parent = document.getElementsByClassName("deckcard-category");
    if(!(parent[requestsNum-1] === undefined))
        parent[requestsNum-1].innerHTML += dataToAppend;
}

function getAndDisplayInfo() {
    var timeNow = new Date().getTime();
    for(var i = 0; i < 40; i++) {
        requestTimes[i] = timeNow + (i + 1) * 600;
    }
    makeMarketRequest();
}
catchCards()