
hide.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: hideInfo,
    });
});

show.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: showInfo,
    });
});
  
  function hideInfo() {

    var info = document.getElementsByClassName("info");
    var val = `z-index: 1;
    position: absolute;
    color: red;
    margin-top: 60%;
    letter-spacing: 0;
    text-align: left;
    font-size: 12px;
    visibility: hidden;`
    var len = info.length;
    for(var i = 0; i < len; i++)
        info[i].setAttribute("style", val);
  }


function showInfo() {

    var info = document.getElementsByClassName("info");
    var valShow = 
        `z-index: 1;
        position: absolute;
        color: red;
        margin-top: 60%;
        letter-spacing: 0;
        text-align: left;
        font-size: 12px;
        visibility: visible;`
    var len = info.length;
    for(var i = 0; i < len; i++)
        info[i].setAttribute("style", valShow);
}