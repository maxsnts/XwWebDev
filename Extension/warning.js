console.log("warning.js loaded");


//window.document.body.insertAdjacentHTML( "afterbegin", "<div style=' >XwWebDev Headers are On!</div>" );

const elem = document.createElement('div');
elem.className = '';
elem.style.cssText = 'z-index:5000;position:fixed;top:0;left:0;right:0;padding:1px;background-color:violet;font-family:Courier New;font-weight:bold;font-size:12px;text-align:center;line-height:1.0';
elem.innerHTML = 'XwWebDev Headers are On!'
document.body.appendChild(elem);