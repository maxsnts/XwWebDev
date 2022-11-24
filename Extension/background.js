
//************************************************************************************************************
chrome.runtime.onInstalled.addListener(() => 
{
    console.log('XwWebDev Loaded!');
    LoadOptions();
});

//************************************************************************************************************
chrome.runtime.onStartup.addListener(() =>
{
    console.log('XwWebDev Started!');
    LoadOptions();
    chrome.declarativeNetRequest.setActionCountAsBadgeText(true);
});

//************************************************************************************************************
chrome.action.onClicked.addListener((tab) =>
{
    chrome.runtime.openOptionsPage();
});

//************************************************************************************************************
chrome.storage.onChanged.addListener(function (changes, namespace) 
{
    if (changes.headers)
    {
        LoadOptions();
    }
});

//************************************************************************************************************
var settings = {};
function LoadOptions()
{
    console.log("Background LoadOptions...");
    chrome.storage.local.get(
    {
        headers: []
    }, function(items) 
    {
        //console.log(items);
        settings = items;
        SetHeaderRules();
    });
}

//************************************************************************************************************
function SetHeaderRules()
{
    console.log("Background SetHeaderRules...");
    
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
                chrome.storage.local.set({ isActive: false } , () => {});
                for (const header of settings.headers)
                {
                    if (header.active !== true)
                        continue;
        
                    if (header.name === "")
                        continue;

                    chrome.storage.local.set({ isActive: true } , () => {});

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
                                            { "header": "User-Agent", "operation": "set", "value": `${navigator.userAgent} (XwWebDev)` }
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
                                    "condition": { "urlFilter": header.url, resourceTypes: ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping" , "csp_report", "media" , "websocket", "webtransport", "webbundle", "other"] }
                                }
                            ]
                        });
                    }
                }
            });
        });
    });
}

//************************************************************************************************************
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) 
{
    if (tab.url.startsWith('chrome'))
        return;

    chrome.storage.local.get(
    {
        isActive: []
    }, function(item) 
    {
        if (item.isActive === true)
        {
            //console.log(tab);
            if(changeInfo.status == "loading") 
            { 
                chrome.declarativeNetRequest.testMatchOutcome({url: tab.url, type: 'main_frame', tabId: tabId}, function(result)
                {
                    //console.log(result);
                    if (result.matchedRules.length > 0)
                    {
                        chrome.scripting.executeScript(
                        {
                            target: { tabId: tab.id },
                            files: ['warning.js']
                        });
                    }
                });
            }
        }
    });
});

//************************************************************************************************************
chrome.webRequest.onErrorOccurred.addListener(function(e) 
{
    if (e.tabId == -1)
        return;

    chrome.storage.local.get(
    {
        errors: []
    }, function(items) 
    {
        for (const error of items.errors)
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
            
            const found = e.url.match(error.url);
            chrome.scripting.executeScript(
            {
                target: { tabId: e.tabId },
                files: ['error.js']
            });
            
            return;
        }
    });

    

}, {urls: ["<all_urls>"]});
