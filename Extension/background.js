//************************************************************************************************************
chrome.runtime.onInstalled.addListener(() => 
{
    console.log('XwWebDev Loaded!');
    LoadOptions();
});

//************************************************************************************************************
chrome.action.onClicked.addListener((tab) =>
{
    chrome.tabs.create({url:'options.html'});
});

//************************************************************************************************************
chrome.storage.onChanged.addListener(function (changes, namespace) 
{
    LoadOptions();
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
                for (const header of settings.headers)
                {
                    if (header.active !== true)
                        continue;
        
                    chrome.action.setIcon({
                        path: {
                            "16": "/images/on16x.png",
                            "32": "/images/on32x.png",
                            "48": "/images/on48x.png",
                            "128": "/images/on128x.png"
                        }
                    });

                    if (header.name === "")
                        continue;
        
                    //console.log(header);
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
                                                { "header": header.name, "operation": header.action, "value": header.value }
                                            ]
                                        },
                                        "condition": { "urlFilter": header.url }
                                    },
                                    {
                                        "id": (header.index + 100),
                                        "priority": 2,
                                        "action": 
                                        {
                                            "type": "modifyHeaders",
                                            "requestHeaders": 
                                            [
                                                { "header": header.name, "operation": header.action, "value": header.value }
                                            ]
                                        },
                                        "condition": { "urlFilter": header.url, resourceTypes: ["main_frame"] }
                                    },
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
                                                { "header": header.name, "operation": header.action, }
                                            ]
                                        },
                                        "condition": { "urlFilter": header.url }
                                    },
                                    {
                                        "id": (header.index + 2),
                                        "priority": 2,
                                        "action": 
                                        {
                                            "type": "modifyHeaders",
                                            "requestHeaders": 
                                            [
                                                { "header": header.name, "operation": header.action, }
                                            ]
                                        },
                                        "condition": { "urlFilter": header.url, resourceTypes: ["main_frame"] }
                                    },
                                ]
                            });
                    
                    }
        
                }
            });
        });
    });
}











//************************************************************************************************************
/*
chrome.webNavigation.onBeforeNavigate.addListener((details) =>
{
    //console.log(details);
});

//************************************************************************************************************
chrome.webNavigation.onErrorOccurred.addListener((details) =>
{
    //console.error(details);
});

//************************************************************************************************************
chrome.webRequest.onErrorOccurred.addListener((details) =>
{
    //console.error(details);
}, {urls: ["<all_urls>"]});
*/

