window.addEventListener("load", WindowLoaded);

//************************************************************************************************************
function WindowLoaded()
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) 
    {
        var tab = tabs[0];
        console.log(tab.url);
    });

    $("#NewHeaderRow").on("click",  AddNewHeaderRow.bind(false));
    $("#NewErrorRow").on("click",  AddNewErrorRow.bind(false));
    $("#resetsettings").on("click",  ResetSettings.bind(false));
    $("#importsettings").on("click",  ImportSettings.bind(false));
    $("#exportsettings").on("click",  ExportSettings.bind(false));
    $("#addUserAgent").change(SaveOptions.bind(this));
    LoadOptions();

    let sortOption = 
    {
        cursor: "move",
        deactivate: function( event, ui ) { SaveOptions() },
        cursorAt: { left: 2, top: 2 },
        forcePlaceholderSize: true,
        opacity: 0.6,
        handle: ".handle",
        items: 'tr:not(:first)'
    };

    $('#HeaderTable tbody').sortable(sortOption).disableSelection();
    $('#ErrorTable tbody').sortable(sortOption).disableSelection();

    //$("#importsettings").hide();
    //$("#exportsettings").hide();
}

//************************************************************************************************************
function LoadOptions()
{
    console.log('Options LoadOptions...');
    
    chrome.storage.local.get( ['headers', 'errors', 'settings'], (data) =>
    {
        if (data.headers === undefined)
            data.headers = [];
        if (data.headers.length > 0)
        {
            for (const header of data.headers)
            {
                AddNewHeaderRow(true, header.active, header.action, header.name, header.value, header.url);
            }
        }
        else
        {
            AddNewHeaderRow(false);
        }

        if (data.errors === undefined)
            data.errors = [];
        if (data.errors.length > 0)
        {
            for (const error of data.errors)
            {
                AddNewErrorRow(true, error.js, error.notfound, error.other , error.url);
            }
        }
        else
        {
            AddNewErrorRow(false);
        }

        if (data.settings === undefined)
            data.settings = {};

        if (data.settings.adduseragent === undefined)
        {
            $("#addUserAgent").prop("checked", true);
            SaveOptions();
        }
        else
            $("#addUserAgent").prop("checked", data.settings.adduseragent);
    });
}

//************************************************************************************************************
var saveTimer = 0;
function SaveOptions()
{
    console.log('Options SaveOptions...');

    let headers = [];
    $("#HeaderTable tr").each((index, tr) =>
    {
        if (index == 0)
            return;

        let active = $(tr).find('.hdractive').is(":checked");
        let action = $(tr).find('.hdraction').val();
        let name = $(tr).find('.hdrname').val().trim();
        let value = $(tr).find('.hdrvalue').val();
        let url = $(tr).find('.hdrurl').val().trim();

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
        let url = $(tr).find('.errorurl').val().trim();

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

    let settings = {};
    settings.adduseragent = $("#addUserAgent").is(":checked");

    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => 
    {  
        chrome.storage.local.set({ headers: headers, errors: errors, settings: settings, reload: false } , () => {});
    }, 250);
}

//************************************************************************************************************
function AddNewHeaderRow(load, active, action, name, value, url)
{
    let row = $(`<tr>
        <td style='text-align: left'>
            <img class='handle' src='images/drag.png'/>
            <input class='hdractive' type="checkbox">
        </td>
        <td>
            <select class='hdraction' style="width: 100%;">
                <option value='set' selected>Set</option>
                <option value='remove'>Remove</option>
            </select>
        </td>
        <td><input class='hdrname' type="text" style="width: 100%;"></td>
        <td><input class='hdrvalue' type="text" style="width: 100%;"></td>
        <td><input class='hdrurl' type="text" style="width: 100%;"></td>
        <td><a href="#">Delete</a></td>
        </tr>`);
    
    if (load === true)
    {
        row.find('.hdractive').prop("checked", active);
        row.find('.hdraction').val(action);
        row.find('.hdrname').val(name);
        row.find('.hdrvalue').val(value);
        row.find('.hdrurl').val(url);

        if ($(row).find('.hdraction').val() == "remove")
            $(row).find('.hdrvalue').prop( "disabled", true );
    }
    else
    {
        row.find('.hdrurl').val("*");
    }

    row.find('input[type=checkbox]').change(ChangeHeaderRowData.bind(this, row));
    row.find('select').change(ChangeHeaderRowData.bind(this, row));
    row.find('input[type=text]').on("keyup",ChangeHeaderRowData.bind(this, row));
    row.find('a').on("click",DeleteRow.bind(this, row));

    $('#HeaderTable').append(row); 
    
    if (load !== true)
        SaveOptions();  
}

//************************************************************************************************************
function ChangeHeaderRowData(row)
{
    if ($(row).find('.hdraction').val() == "remove")
        $(row).find('.hdrvalue').prop( "disabled", true );
    else
        $(row).find('.hdrvalue').prop( "disabled", false );

    SaveOptions();
}

//************************************************************************************************************
function AddNewErrorRow(load, js, notfound, other, url)
{
    let row = $(`<tr>
        <td style='text-align: left'>
            <img class='handle' src='images/drag.png'/>
            <input class='errorjs' type="checkbox">
        </td>
        <td><input class='errornotfound' type="checkbox"></td>
        <td><input class='errorother' type="checkbox"></td>
        <td><input class='errorurl' type="text" style="width: 100%;"></td>
        <td><a href="#">Delete</a></td>
        </tr>`);
    
    if (load === true)
    {
        row.find('.errorjs').prop("checked", js);
        row.find('.errornotfound').prop("checked", notfound);
        row.find('.errorother').prop("checked", other);
        row.find('.errorurl').val(url);
    }
    else
    {
        row.find('.errorurl').val(".*");
    }

    row.find('input[type=checkbox]').change(ChangeErrorRowData.bind(this, row));
    row.find('input[type=text]').on("keyup",ChangeErrorRowData.bind(this, row));
    row.find('a').on("click",DeleteRow.bind(this, row));

    $('#ErrorTable').append(row); 
    
    if (load !== true)
        SaveOptions();  
}

//************************************************************************************************************
function ChangeErrorRowData(row)
{
    SaveOptions();
}

//************************************************************************************************************
function DeleteRow(row)
{
    $(row).remove();
    SaveOptions();
}

//************************************************************************************************************
function ResetSettings()
{
    if (confirm("Are you sure?"))
    {
        chrome.storage.local.clear(() => 
        {
            chrome.storage.local.set({ headers: [], errors: [], settings: {}, reload: true });
        });
    }
}

//************************************************************************************************************
function ImportSettings()
{
    if (confirm("Are you sure?"))
    {
        chrome.storage.local.clear(() => 
        {
            chrome.storage.local.set({ headers: [], errors: [], settings: {}, reload: true });
        });
    }
}

//************************************************************************************************************
 function ExportSettings()
{
    chrome.storage.local.get( ['headers', 'errors', 'settings'], (data) =>
    {
        WriteFile("xwwebdev-settings.json", JSON.stringify(data, null, 4));
    });
}

//************************************************************************************************************
async function WriteFile(filename, data)
{
    let handle = await window.showSaveFilePicker({suggestedName: filename});
    const file = await handle.createWritable();
    file.write(data);
    file.close();
}



