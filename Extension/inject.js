//window.addEventListener("load", ShowWarning);

var xwjserrors = false;
window.addEventListener("error", function(e) 
{
    //console.log('XwWebDev:', e);
    if (e.error)
        xwjserrors = true;
    return false;
}, true);

window.addEventListener('unhandledrejection', function (e) 
{
    //console.log('XwWebDev:', e);
    if (e.error)
        xwjserrors = true;
}, true);

function ShowJsError()
{
    if (xwjserrors === false)
        return;
    let xwwebdeverrorjs = document.createElement('div');
    xwwebdeverrorjs.style.cssText = 'z-index:2147483645;background-color:red;position:fixed;top:0;left:0;right:0;padding:1px;padding-left:10px;font-family:Courier New;font-weight:bold;font-size:14px;line-height:1.0;color:black';
    xwwebdeverrorjs.innerHTML = ' XwWebDev: Javascript Errors found!'
    document.body.appendChild(xwwebdeverrorjs);
    xwjserrors = false;
}

function Show404Error(extrainfo)
{
    let xwwebdeverror404 = document.createElement('div');
    xwwebdeverror404.style.cssText = 'z-index:2147483644;background-color:orange;position:fixed;top:0;left:0;right:0;padding:1px;padding-left:10px;font-family:Courier New;font-weight:bold;font-size:14px;line-height:1.0;color:black';
    xwwebdeverror404.innerHTML = ` XwWebDev: Errors 404 found! ${extrainfo}`
    document.body.appendChild(xwwebdeverror404);
    xwjserrors = false;
}

function ShowError(extrainfo)
{
    let xwwebdeverror = document.createElement('div');
    xwwebdeverror.style.cssText = 'z-index:2147483643;background-color:#F7DC6F;position:fixed;top:0;left:0;right:0;padding:1px;padding-left:10px;font-family:Courier New;font-weight:bold;font-size:14px;line-height:1.0;color:black';
    xwwebdeverror.innerHTML = ` XwWebDev: Other Errors found! ${extrainfo}`
    document.body.appendChild(xwwebdeverror);
}

function ShowWarning(extrainfo)
{
    let xwwebdevheader = document.createElement('div');
    xwwebdevheader.style.cssText = 'z-index:2147483640;background-color:violet;position:fixed;top:0;left:0;right:0;padding:1px;padding-left:10px;font-family:Courier New;font-weight:bold;font-size:14px;line-height:1.0;color:black';
    xwwebdevheader.innerHTML = ` XwWebDev: Header modification is ON! ${extrainfo}`
    document.body.appendChild(xwwebdevheader);
}