window.addEventListener("load", WindowLoaded);

//************************************************************************************************************
function WindowLoaded()
{
    console.log("Forground Open Options...");
    $("#NewHeaderRow").on("click",  AddNewHeaderRow.bind(false));

    LoadOptions();
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

    row.find('input[type=checkbox]').change(ChangeRowData.bind(this, row));
    row.find('select').change(ChangeRowData.bind(this, row));
    row.find('input[type=text]').on("keyup",ChangeRowData.bind(this, row));
    row.find('a').on("click",DeleteRow.bind(this, row));

    $('#HeaderTable').append(row); 
    SaveOptions();  
}

//************************************************************************************************************
function DeleteRow(row)
{
    $(row).remove();
    SaveOptions();
}

//************************************************************************************************************
function ChangeRowData(row)
{
    if ($(row).find('.hdraction').val() == "remove")
        $(row).find('.hdrvalue').prop( "disabled", true );
    else
        $(row).find('.hdrvalue').prop( "disabled", false );

    SaveOptions();
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

    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => 
    {  
        console.log('Forground SaveOptions...');
        chrome.storage.local.set({ headers, headers } , () => {});
    }, 250);
}

//************************************************************************************************************
function LoadOptions()
{
    console.log('Forground LoadOptions...');
    
    chrome.storage.local.get(
    {
        headers: [],
        exampleofsamethingelse: true
    }, function(items) 
    {
        //console.log(items);

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
    });
}