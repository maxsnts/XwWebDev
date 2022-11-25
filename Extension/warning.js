window.addEventListener("load", ShowWarning);

function ShowWarning()
{
    let xwwebdevheaderelem = document.createElement('div');
    xwwebdevheaderelem.className = '';
    xwwebdevheaderelem.style.cssText = 'z-index:2147483640;position:fixed;top:0;left:0;right:0;padding:1px;background-color:violet;font-family:Courier New;font-weight:bold;font-size:14px;text-align:center;line-height:1.0;color:black';
    xwwebdevheaderelem.innerHTML = 'XwWebDev: Header modification is ON!'
    document.body.appendChild(xwwebdevheaderelem);
}

