var xwwebdeverrorelemvisivle = false;
function ShowError()
{
    if (xwwebdeverrorelemvisivle == true)
        return;
    xwwebdeverrorelemvisivle = true;
    let xwwebdeverrorelem = document.createElement('div');
    xwwebdeverrorelem.className = '';
    xwwebdeverrorelem.style.cssText = 'z-index:2147483647;position:fixed;top:0;left:0;right:0;padding:1px;background-color:red;font-family:Courier New;font-weight:bold;font-size:14px;text-align:center;line-height:1.0;color:black';
    xwwebdeverrorelem.innerHTML = 'XwWebDev: Errors found!'
    document.body.appendChild(xwwebdeverrorelem);
}
ShowError();
