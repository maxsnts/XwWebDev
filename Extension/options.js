window.addEventListener("load", WindowLoaded);

//************************************************************************************************************
function WindowLoaded()
{
    console.log("Forground Open Options...");
    $("#NewHeaderRow").on("click",  AddNewHeaderRow.bind(false));
    $("#NewErrorRow").on("click",  AddNewErrorRow.bind(false));

    LoadOptions();
}

//************************************************************************************************************
function LoadOptions()
{
    console.log('Forground LoadOptions...');
    
    chrome.storage.local.get(
    {
        headers: [],
        errors: [],
    }, function(items) 
    {
        if (items.headers.length > 0)
        {
            for (const header of items.headers)
            {
                AddNewHeaderRow(true, header.active, header.action, header.name, header.value, header.url);
            }
        }
        else
        {
            AddNewHeaderRow(false);
        }

        if (items.errors.length > 0)
        {
            for (const error of items.errors)
            {
                AddNewErrorRow(true, error.js, error.notfound, error.url);
            }
        }
        else
        {
            AddNewErrorRow(false);
        }
    });
}

//************************************************************************************************************
var saveTimer = 0;
function SaveOptions()
{
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
        let url = $(tr).find('.errorurl').val().trim();

        if (url == "")
            url = ".*";

        let error = { 
            index: index,
            js: js,
            notfound: notfound,
            url: url
        };
        //console.log(header);
        errors.push(error);
    });

    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => 
    {  
        console.log('Forground SaveOptions...');
        chrome.storage.local.set({ headers, errors } , () => {});
    }, 250);
}

//************************************************************************************************************
function AddNewHeaderRow(load, active, action, name, value, url)
{
    let row = $(`<tr>
        <td><input class='hdractive' type="checkbox"></td>
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
function AddNewErrorRow(load, js, notfound, url)
{
    let row = $(`<tr>
        <td><input class='errorjs' type="checkbox"></td>
        <td><input class='errornotfound' type="checkbox"></td>
        <td><input class='errorurl' type="text" style="width: 100%;"></td>
        <td><a href="#">Delete</a></td>
        </tr>`);
    
    if (load === true)
    {
        row.find('.errorjs').prop("checked", js);
        row.find('.errornotfound').prop("checked", notfound);
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





