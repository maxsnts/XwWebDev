window.addEventListener("load", WindowLoaded);

//************************************************************************************************************
function WindowLoaded()
{
    const elem = document.createElement('div');
    elem.className = '';
    elem.style.cssText = 'z-index:5000;position:fixed;top:0;left:0;right:0;padding:1px;background-color:violet;font-family:Courier New;font-weight:bold;font-size:14px;text-align:center;line-height:1.0;color:black';
    elem.innerHTML = 'XwWebDev header modification is ON!'
    document.body.appendChild(elem);
}
