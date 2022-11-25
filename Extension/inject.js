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
    let xwwebdeverrorelem = document.createElement('div');
    xwwebdeverrorelem.style.cssText = 'z-index:2147483645;background-color:red;position:fixed;top:0;left:0;right:0;padding:1px;padding-left:10px;font-family:Courier New;font-weight:bold;font-size:14px;line-height:1.0;color:black';
    xwwebdeverrorelem.innerHTML = ' XwWebDev: Javascript Errors found!'
    document.body.appendChild(xwwebdeverrorelem);
    xwjserrors = false;
}

function ShowError()
{
    let xwwebdeverrorelem = document.createElement('div');
    xwwebdeverrorelem.style.cssText = 'z-index:2147483644;background-color:orange;position:fixed;top:0;left:0;right:0;padding:1px;padding-left:10px;font-family:Courier New;font-weight:bold;font-size:14px;line-height:1.0;color:black';
    xwwebdeverrorelem.innerHTML = ' XwWebDev: Other Errors found!'
    document.body.appendChild(xwwebdeverrorelem);
}

function ShowWarning()
{
    let xwwebdevheaderelem = document.createElement('div');
    xwwebdevheaderelem.style.cssText = 'z-index:2147483640;background-color:violet;position:fixed;top:0;left:0;right:0;padding:1px;padding-left:10px;font-family:Courier New;font-weight:bold;font-size:14px;line-height:1.0;color:black';
    xwwebdevheaderelem.innerHTML = ' XwWebDev: Header modification is ON!'
    document.body.appendChild(xwwebdevheaderelem);
}