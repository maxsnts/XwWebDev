window.addEventListener("load", WindowLoaded);

//************************************************************************************************************
function WindowLoaded()
{
    $("#openOptions").on("click",  function() { chrome.runtime.openOptionsPage(); });
    $("#openReload").on("click",  function() { chrome.tabs.reload(); });
    LoadOptions();
}

//************************************************************************************************************
function LoadOptions()
{
    console.log('Popup LoadOptions...');

    chrome.storage.local.get( ['headers', 'errors'], (data) =>
    {
        if (data.headers.length > 0)
        {
            for (const header of data.headers)
            {
                AddNewHeaderRow(true, header.active, header.action, header.name, header.value, header.url);
            }
        }

        if (data.errors.length > 0)
        {
            for (const error of data.errors)
            {
                AddNewErrorRow(true, error.js, error.notfound, error.other, error.url);
            }
        }
    });
}

//************************************************************************************************************
var saveTimer = 0;
function SaveOptions(reload)
{
    console.log('Popup SaveOptions...');

    let headers = [];
    $("#HeaderTable tr").each((index, tr) =>
    {
        if (index == 0)
            return;

        let active = $(tr).find('.hdractive').is(":checked");
        let action = $(tr).find('.hdraction').text();
        let name = $(tr).find('.hdrname').text().trim();
        let value = $(tr).find('.hdrvalue').text();
        let url = $(tr).find('.hdrurl').text().trim();

        if (url == "")
            url = "*";

        let header = { 
            index: index,
            active: active,
            action: action,
            name: name,
            value: value,
            url: url
        };
        //console.log(header);
        headers.push(header);
    });

    let errors = [];
    $("#ErrorTable tr").each((index, tr) =>
    {
        if (index == 0)
            return;

        let js = $(tr).find('.errorjs').is(":checked");
        let notfound = $(tr).find('.errornotfound').is(":checked");
        let other = $(tr).find('.errorother').is(":checked");
        let url = $(tr).find('.errorurl').text().trim();

        if (url == "")
            url = ".*";

        let error = { 
            index: index,
            js: js,
            notfound: notfound,
            other: other,
            url: url
        };
        //console.log(header);
        errors.push(error);
    });
  
    chrome.storage.local.set({ headers: headers, errors: errors } , () => 
    {
        if (reload == true)
        {
            clearTimeout(saveTimer);
            saveTimer = setTimeout(() => 
            {  
                chrome.tabs.reload();
            }, 250);
        }
    });
}

//************************************************************************************************************
function AddNewHeaderRow(load, active, action, name, value, url)
{
    let row = $(`<tr>
        <td><input class='hdractive' type="checkbox"></td>
        <td><span class='hdraction'/></td>
        <td><span class='hdrname'/></td>
        <td><span class='hdrvalue'/></td>
        <td><span class='hdrurl'/></td>
        </tr>`);
    
    if (load === true)
    {
        row.find('.hdractive').prop("checked", active);
        row.find('.hdraction').text(action);
        row.find('.hdrname').text(name);
        row.find('.hdrvalue').text(value);
        row.find('.hdrurl').text(url);
    }

    row.find('input[type=checkbox]').change(SaveAndReload.bind(this));
    $('#HeaderTable').append(row); 
    //SaveOptions(false);  
}

//************************************************************************************************************
function AddNewErrorRow(load, js, notfound, other, url)
{
    let row = $(`<tr>
        <td><input class='errorjs' type="checkbox"></td>
        <td><input class='errornotfound' type="checkbox"></td>
        <td><input class='errorother' type="checkbox"></td>
        <td><span class='errorurl'/></td>
        </tr>`);
    
    if (load === true)
    {
        row.find('.errorjs').prop("checked", js);
        row.find('.errornotfound').prop("checked", notfound);
        row.find('.errorother').prop("checked", other);
        row.find('.errorurl').text(url);
    }
    
    row.find('input[type=checkbox]').change(SaveAndReload.bind(this));
    $('#ErrorTable').append(row); 
    //SaveOptions(false);  
}

//************************************************************************************************************
function SaveAndReload()
{
    SaveOptions(true);
}