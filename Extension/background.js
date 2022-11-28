
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
chrome.storage.onChanged.addListener((changes, namespace) =>
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
    
    chrome.storage.local.get( ['headers', 'errors', 'settings', 'reload'], (data) =>
    {
        let icon = "off";
        if (data.headers.find(h => h.active === true))
            icon = "on";
        else if (data.errors.find(e => (e.js === true || e.notfound === true || e.other === true)))
            icon = "er";

        chrome.action.setIcon({
            path: {
                "16": `/images/${icon}16x.png`,
                "32": `/images/${icon}32x.png`,
                "48": `/images/${icon}48x.png`,
                "128": `/images/${icon}128x.png`
            }
        });

        chrome.declarativeNetRequest.getDynamicRules((headers) => 
        {
            /*
            chrome.action.setIcon(
            {
                path: {
                    "16": "/images/off16x.png",
                    "32": "/images/off32x.png",
                    "48": "/images/off48x.png",
                    "128": "/images/off128x.png"
                }
            }, () => */
            //{
                let ua = "";
                if (data.settings.adduseragent === true)
                    ua = " (XwWebDev)";

                let removerules = [];
                for (i=1; i<200; i++)
                    removerules.push(i);
                    
                var addrules = [];
                for (const header of data.headers)
                {
                    if (header.active !== true)
                        continue;
        
                    if (header.name === "")
                        continue;
                    
                    let rule =  {
                        "id": header.index,
                        "priority": 1,
                        "action":  
                        {
                            "type": "modifyHeaders",
                            "requestHeaders": 
                            [
                                { "header": header.name, "operation": header.action, "value": header.value },
                                { "header": "User-Agent", "operation": "set", "value": `${navigator.userAgent}${ua}` },
                                { "header": "pragma", "operation": "set", "value": "no-cache" },
                                { "header": "cache-control", "operation": "set", "value": "no-cache" }
                            ]
                        },
                        "condition": { "urlFilter": header.url}
                    }

                    rule =  {
                        "id": header.index + 100,
                        "priority": 1,
                        "action":  
                        {
                            "type": "modifyHeaders",
                            "requestHeaders": 
                            [
                                { "header": header.name, "operation": header.action, "value": header.value },
                                { "header": "User-Agent", "operation": "set", "value": `${navigator.userAgent}${ua}` },
                                { "header": "pragma", "operation": "set", "value": "no-cache" },
                                { "header": "cache-control", "operation": "set", "value": "no-cache" }
                            ]
                        },
                        "condition": { "urlFilter": header.url, resourceTypes: ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping" , "csp_report", "media" , "websocket", "webtransport", "webbundle", "other"] }
                    }

                    addrules.push(rule);
                }

                if (addrules.length > 0)
                {
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
                }

                chrome.declarativeNetRequest.updateDynamicRules(
                {
                    removeRuleIds: removerules,
                    addRules: addrules
                },() => 
                {
                    if (data.reload == true)
                    {
                        ReloadTab(250);
                    }
                });
            //});
        });
    });
}

//************************************************************************************************************
var reloadTimer = 0;
function ReloadTab(timeout)
{
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(() => 
    {  
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) 
        {
            var tab = tabs[0];
            chrome.tabs.reload(tab.id, {bypassCache: true});
        });
        
    }, timeout);
}

//************************************************************************************************************
chrome.webRequest.onCompleted.addListener((details) =>
{
    if (details.url == "about:blank")
        return;

    if (details.url.startsWith('chrome'))
        return;

    //console.log(details);
    chrome.storage.local.get( ['headers', 'errors'], (data) =>
    {
        for (const error of data.errors)
        {
            if (details.url.match(error.url))
            {
                if (details.statusCode === 404 && error.notfound == true)
                    RunScript(details.tabId, 'error404', details.url);

                if (details.statusCode === 400 && error.other == true)
                    RunScript(details.tabId, 'error', details.url);

                if (details.statusCode >= 500 && error.other == true)
                    RunScript(details.tabId, 'error', details.url);

                if (error.js === true)
                    RunScript(details.tabId, 'errorjs');
            }
        }

        if (details.type == "main_frame" || 
            details.type == "sub_frame" || 
            details.type == "script" || 
            details.type == "xmlhttprequest")
        {
            for (const header of data.headers)
            {
                if (header.active)
                {
                    //some compatibility issues between urlFilter and Regex
                    let regex = header.url;
                    if (regex == "*")
                    regex = ".*"

                    if (details.url.match(regex))
                    {
                        if (details.fromCache === true)
                        {
                            console.log("XwWebDev:", "fromCache but it should not");
                            console.log(details);
                        }

                        //console.log(`${details.type} ${details.frameType} ${details.url}`);
                        //console.log("onCompleted:", details);
                        
                        let extrainfo = "";
                        let server = details.responseHeaders.find(h => h.name == 'x-server');
                        if (server)
                            extrainfo = ` (x-server:${server.value})`;

                        RunScript(details.tabId, 'warning', extrainfo);
                    }
                }
            }
        }
    });

}, {urls: ["<all_urls>"]}, ["responseHeaders"]);

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
function RunScript(tabId, script, info)
{
    if (tabId == -1)
    {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) 
        {
            var tab = tabs[0];
            Exec(tab.id, script, info);
        });
    }
    else
    {
        Exec(tabId, script, info);
    }
}

//************************************************************************************************************
function Exec(tabId, script, info)
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
            func: (inf) => { Show404Error(inf); },
            args: [info]
        });
    }

    if (script == "error")
    {
        chrome.scripting.executeScript(
        {
            target: { tabId: tabId},
            world: "MAIN",
            func: (inf) => { ShowError(inf); },
            args: [info]
        });
    }

    if (script == "warning")
    {
        chrome.scripting.executeScript(
        {
            target: { tabId: tabId},
            world: "MAIN",
            func: (inf) => { ShowWarning(inf); },
            args: [info]
        });
    }
}

