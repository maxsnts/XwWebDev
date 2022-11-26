
//************************************************************************************************************
chrome.runtime.onInstalled.addListener(() => 
{
    console.log('XwWebDev installed or loaded!');
    LoadOptions();
    InjectScript();
});

//************************************************************************************************************
chrome.runtime.onStartup.addListener(() =>
{
    console.log('Chrome just started: XwWebDev Started!');
    LoadOptions();
    InjectScript();
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
chrome.webRequest.onCompleted.addListener(function(e)
{
    if (e.url.startsWith('chrome'))
        return;

    //console.log(e);
    chrome.storage.local.get( ['headers', 'errors'], (data) =>
    {
        for (const error of data.errors)
        {
            if (e.url.match(error.url))
            {
                if (e.statusCode === 404 && error.notfound == true)
                    RunScript(e.tabId, 'error404');

                if (e.statusCode === 400 && error.other == true)
                    RunScript(e.tabId, 'error');

                if (e.statusCode >= 500 && error.other == true)
                    RunScript(e.tabId, 'error');

                if (error.js === true)
                    RunScript(e.tabId, 'errorjs');
            }
        }

        for (const header of data.headers)
        {
            if (header.active)
            {
                //console.log(`${e.type} ${e.frameType} ${e.url}`);
                //console.log(e);

                if (e.url.match(header.url))
                    RunScript(e.tabId, 'warning');
            }
        }
    });

}, {urls: ["<all_urls>"]});

//************************************************************************************************************
function InjectScript()
{
    console.log(`Inject js`);

    chrome.scripting.registerContentScripts(
    [{ 
        allFrames: false,
        id: "inject", 
        matches: ["<all_urls>"], 
        js: [`inject.js`], 
        persistAcrossSessions: false, 
        runAt: "document_start",
        world: "MAIN"
    }]);
}

//************************************************************************************************************
function RunScript(tabId, script)
{
    if (tabId == -1)
    {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) 
        {
            var tab = tabs[0];
            Exec(tab.id, script);
        });
    }
    else
    {
        Exec(tabId, script);
    }
}

//************************************************************************************************************
function Exec(tabId, script)
{
    if (script == "errorjs")
    {
        chrome.scripting.executeScript(
        {
            target: { tabId: tabId},
            world: "MAIN",
            func: () => { ShowJsError(); }
        });
    }

    if (script == "error404")
    {
        chrome.scripting.executeScript(
        {
            target: { tabId: tabId},
            world: "MAIN",
            func: () => { Show404Error(); }
        });
    }

    if (script == "error")
    {
        chrome.scripting.executeScript(
        {
            target: { tabId: tabId},
            world: "MAIN",
            func: () => { ShowError(); }
        });
    }

    if (script == "warning")
    {
        chrome.scripting.executeScript(
        {
            target: { tabId: tabId},
            world: "MAIN",
            func: () => { ShowWarning(); }
        });
    }
}
