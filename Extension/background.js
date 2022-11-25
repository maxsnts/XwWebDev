
//************************************************************************************************************
chrome.runtime.onInstalled.addListener(() => 
{
    console.log('XwWebDev installed or loaded!');
    LoadOptions();

    //chrome.runtime.getManifest().update_url
});

//************************************************************************************************************
chrome.runtime.onStartup.addListener(() =>
{
    console.log('Chrome just started: XwWebDev Started!');
    LoadOptions();
});

//************************************************************************************************************
chrome.storage.onChanged.addListener(function (changes, namespace) 
{
    LoadOptions();
});

//************************************************************************************************************
function LoadOptions()
{
    SetHeaderRules();
}

//************************************************************************************************************
function SetHeaderRules()
{
    console.log("Background SetHeaderRules...");
    
    chrome.storage.local.get( ['headers', 'settings'], (data) =>
    {
        chrome.declarativeNetRequest.getDynamicRules((headers) => 
        {
            chrome.declarativeNetRequest.updateDynamicRules(
            {
                removeRuleIds: [ 
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
                    101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
                    121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140,
                    141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160 ]
            }, () => 
            {
                chrome.action.setIcon(
                {
                    path: {
                        "16": "/images/off16x.png",
                        "32": "/images/off32x.png",
                        "48": "/images/off48x.png",
                        "128": "/images/off128x.png"
                    }
                }, () => 
                {
                    for (const header of data.headers)
                    {
                        if (header.active !== true)
                            continue;
            
                        if (header.name === "")
                            continue;

                        chrome.action.setIcon(
                        {
                            path: 
                            {
                                "16": "/images/on16x.png",
                                "32": "/images/on32x.png",
                                "48": "/images/on48x.png",
                                "128": "/images/on128x.png"
                            }
                        });
                        
                        if (header.action == "set")
                        {
                            let ua = "";
                            if (data.settings.adduseragent === true)
                                ua = " (XwWebDev)";

                            chrome.declarativeNetRequest.updateDynamicRules(
                            {
                                addRules:
                                [
                                    {
                                        "id": header.index,
                                        "priority": 1,
                                        "action":  
                                        {
                                            "type": "modifyHeaders",
                                            "requestHeaders": 
                                            [
                                                { "header": header.name, "operation": header.action, "value": header.value },
                                                { "header": "User-Agent", "operation": "set", "value": `${navigator.userAgent}${ua}` }
                                            ]
                                        },
                                        "condition": { "urlFilter": header.url}
                                    },
                                    {
                                        "id": header.index + 100,
                                        "priority": 1,
                                        "action":  
                                        {
                                            "type": "modifyHeaders",
                                            "requestHeaders": 
                                            [
                                                { "header": header.name, "operation": header.action, "value": header.value },
                                                { "header": "User-Agent", "operation": "set", "value": `${navigator.userAgent}${ua}` }
                                            ]
                                        },
                                        "condition": { "urlFilter": header.url, resourceTypes: ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping" , "csp_report", "media" , "websocket", "webtransport", "webbundle", "other"] }
                                    }
                                ]
                            });
                        }
            
                        if (header.action == "remove")
                        {
                            chrome.declarativeNetRequest.updateDynamicRules(
                            {
                                addRules:
                                [
                                    {
                                        "id": header.index,
                                        "priority": 1,
                                        "action": 
                                        {
                                            "type": "modifyHeaders",
                                            "requestHeaders": 
                                            [
                                                { "header": header.name, "operation": header.action }
                                            ]
                                        },
                                        "condition": { "urlFilter": header.url}
                                    },
                                    {
                                        "id": header.index + 100,
                                        "priority": 1,
                                        "action": 
                                        {
                                            "type": "modifyHeaders",
                                            "requestHeaders": 
                                            [
                                                { "header": header.name, "operation": header.action }
                                            ]
                                        },
                                        "condition": { "urlFilter": header.url, resourceTypes: ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping" , "csp_report", "media" , "websocket", "webtransport", "webbundle", "other"] }
                                    }
                                ]
                            });
                        }
                    }
                });
            });
        });
    });
}

//************************************************************************************************************
//inject stuff at the beggining
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) 
{
    if (tab.url.startsWith('chrome'))
        return;

    //console.log(changeInfo);
    //console.log(tab);

    if(changeInfo.status == "loading" && tab.status == "loading") 
    { 
        chrome.storage.local.get( ['headers'], (data) =>
        {
            for (const header of data.headers)
            {
                if (header.active)
                {
                    if (tab.url.match(header.url))
                    {
                        RunScript(tabId, 'warning');
                        return;
                    }
                }
            }
        });

    }
});

//************************************************************************************************************
//catch all errors (may give false positives)
chrome.webRequest.onErrorOccurred.addListener(function(e) 
{
    if (e.url.startsWith('chrome') || e.initiator.startsWith('chrome'))
        return;

    //console.log(e);

    chrome.storage.local.get( ['errors'], (data) =>
    {
        for (const error of data.errors)
        {
            if (e.url.match(error.url) == null)
                return;

            if(e.error == 'net::ERR_BLOCKED_BY_CLIENT')
                return;

            if (e.error == 'net::ERR_CACHE_MISS')
                return;

            if (e.error == 'net::ERR_ABORTED')
                return;

            //console.log(e);

            //if (e.error == 'net::ERR_ABORTED' && error.notfound == false)
            //    return;

            if (e.error == 'net::ERR_FAILED' && error.js == false)
                return;

            console.log(e);

            if (e.url.match(error.url))
            {
                RunScript(e.tabId, 'error');
                return;
            }
        }
    });
}, {urls: ["<all_urls>"]});

//************************************************************************************************************
chrome.webRequest.onResponseStarted.addListener(function(e)
{
    if (e.url.startsWith('chrome'))
        return;

    if (e.type !== 'main_frame' && e.type !== 'sub_frame')
        return;    

    //if (e.frameType !== 'outermost_frame' && e.frameType !== 'sub_frame')
    //    return;
   

    RunScript(e.tabId, 'error');
    
    console.log(`${e.type} ${e.frameType} ${e.url}`);
    console.log(e);

}, {urls: ["<all_urls>"]});

//************************************************************************************************************
//catch request at the end and see its return code
chrome.webRequest.onCompleted.addListener(function(e)
{
    if (e.url.startsWith('chrome'))
        return;

    //console.log(e);

    if (e.statusCode >= 400)
    {
        RunScript(e.tabId, 'error');
        //console.log(e);
        chrome.storage.local.get( ['errors'], (data) =>
        {
            for (const error of data.errors)
            {
                if (e.url.match(error.url))
                {
                    if (e.statusCode == 404 && error.notfound == false)
                        return;

                        RunScript(e.tabId, 'error');
                    return;
                }
            }
        });
    }

}, {urls: ["<all_urls>"]});

//************************************************************************************************************
function RunScript(tabId, script)
{
    console.log(`Inject ${script}.js`);

    chrome.scripting.registerContentScripts(
    [{ 
        allFrames: false,
        id: script, 
        matches: ["<all_urls>"], 
        js: [`${script}.js`], 
        persistAcrossSessions: false, 
        runAt: "document_start",
        world: "MAIN"
    }]);

        /*
    if (tabId == -1)
    {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) 
        {
            var tab = tabs[0];
            chrome.scripting.executeScript(
            {
                target: { tabId: tab.id, allFrames: true },
                files: [`${script}.js`]
            });
        });
    }
    else
    {
        chrome.scripting.executeScript(
        {
            target: { tabId: tabId, allFrames: true },
            files: [`${script}.js`]
        });
    }*/
}
