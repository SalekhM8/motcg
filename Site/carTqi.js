class CarTqi {
    constructor(id) {
        this.data = []
        this.id = id
        this.filteredData = []
        this.filters = []
        this.fetchData()
        this.renderHTMLHeader()
        this.addListeners()
        this.tqiImportData = []
    }
    fetchData () {
        this.data = []
    }
    renderHTMLHeader () {
        this.htmlHeader = `
        <div class='data-launch-modal-popup' id='cartqiPageModalPopup' style='display: none'></div>
        <div class='data-launch-screen-overlay' style='display:none' id='cartqiPageScreenOverlay'></div>
        <div class="row">
            <h3 class='data-launch-sub-page-header'>Car TQI</h3>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                <button class="btn btn-primary data-launch-upload-car-tqi-file data-launch-list-button-headers">Upload Car TQI File</button>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                <button class="btn btn-primary data-launch-export-records-button data-launch-list-button-headers">Export to CSV</button>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                <button class="btn btn-primary data-launch-table-reset-all-filters-button data-launch-list-button-headers">Reset All Filters</button>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 data-launch-table-container">
                <table class="table table-hover data-launch-table-clickable-row">
                    <thead class="sticky-header">
                        <tr>
                            <th scope="col">
                                <span>Created On</span>
                                <div>
                                    <input type="text" class="data-launch-filter-search" data-launch-header="createdOn" style="width: 100%;" placeholder="" value="">
                                </div>
                            </th>
                            <th scope="col">                           
                                <span>Month</span>
                                <div>
                                    <input type="text" class="data-launch-filter-search" data-launch-header="month" style="width: 100%;" placeholder="" value="">
                                </div>
                            </th>
                            <th scope="col">
                                <span>Year</span>
                                <div>
                                    <input type="email" class="data-launch-filter-search" data-launch-header="year" style="width: 100%;" placeholder="" value="">
                                </div>
                            </th>
                            <th scope="col">                           
                                <span>Class</span>
                                <div>
                                    <input type="text" class="data-launch-filter-search" data-launch-header="class" style="width: 100%;" placeholder="" value="">
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody id='data-launch-mot-equipment-table-body'>`
        this.renderHTMLData(this.htmlHeader)    
    }
    renderHTMLData(html) {
        console.log('html is ', html)
        console.log('this.data is ', this.data)
        let data = this.data
        let exportRow = 0
        for (let i = 0; i < data.length; i++) {
            html += `
            <tr class="export-record export-row" data-export-row="${exportRow}" data-export-header="VTS Pro ID"  data-export-val="${data[i].vtsID}" data-vts-pro-id=${data[i].vtsId}>
                <td class="export-record data-launch-car-tqi-list-view-record-click" data-launch-row-no='${i}' data-launch-vts-id="${data[i].vtsID}"  id="data-launch-mot-equipment-${i}-created-on" data-export-row="${exportRow}" data-export-header="Created On"     data-export-val="${data[i].createdOn}" scope="row">${data[i].createdOn}</td>
                <td class="export-record data-launch-car-tqi-list-view-record-click" data-launch-row-no='${i}' data-launch-vts-id="${data[i].vtsID}"  id="data-launch-mot-equipment-${i}-month"      data-export-row="${exportRow}" data-export-header="Month"          data-export-val="${data[i].month}">${data[i].month}</td>
                <td class="export-record data-launch-car-tqi-list-view-record-click" data-launch-row-no='${i}' data-launch-vts-id="${data[i].vtsID}"  id="data-launch-mot-equipment-${i}-year"       data-export-row="${exportRow}" data-export-header="Year"           data-export-val="${data[i].year}">${data[i].year}</td>
                <td class="export-record data-launch-car-tqi-list-view-record-click" data-launch-row-no='${i}' data-launch-vts-id="${data[i].vtsID}"  id="data-launch-mot-equipment-${i}-class"      data-export-row="${exportRow}" data-export-header="Class"          data-export-val="${data[i].class}">${data[i].class}</td>
            </tr>` 
            exportRow++           
        }
        this.renderHTMLBody(html)
    }
    renderHTMLBody (html) {
        html += `       </tbody>
                    </table>
                </div>
            </div>`
        document.getElementById(this.id).innerHTML = html
        this.addListeners()
    }
    injectTableBodyData (data) {
        let html = ''
        let exportRow = 0
        if (data.length === 0) {
            html += `<div><h1>Sorry, no records to display</h1></div>`
        }
        else {
            if (this.filters.length === 0) {
                data = this.data
            }
            for (let i = 0; i < data.length; i++) {
                html += `
                <tr class="export-record export-row" data-export-row="${exportRow}" data-export-header="VTS Pro ID"                 data-export-val="${data[i].vtsId}" data-vts-pro-id=${data[i].vtsId}>
                    <td class="export-record data-launch-car-tqi-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-equipment-${i}-created-on" data-export-header="Created On" data-export-val="${data[i].createdOn}" scope="row">${data[i].createdOn}</td>
                    <td class="export-record data-launch-car-tqi-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-equipment-${i}-month" data-export-header="Month"               data-export-val="${data[i].month}">${data[i].month}</td>
                    <td class="export-record data-launch-car-tqi-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-equipment-${i}-year" data-export-header="Year"            data-export-val="${data[i].year}">${data[i].year}</td>
                    <td class="export-record data-launch-car-tqi-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-equipment-${i}-class" data-export-header="Class"              data-export-val="${data[i].class}">${data[i].class}</td>
                </tr>` 
                exportRow++           
            }
        }        
        return html
    }
    filterApply (header,value, filterJustRemoved) {
        console.log('filterApply HIT' , header, value, filterJustRemoved)
        // if a filter has just been removed and there are now 0 filters
        if (filterJustRemoved === true && this.filters.length === 0) {
            console.log('filterApply LANDED HERE    if (filterJustRemoved === true && this.filters.length === 0) ', header, value, filterJustRemoved)
            this.filteredData = []
            this.filters = []
            let html = this.injectTableBodyData(this.data)
            document.getElementById('data-launch-mot-equipment-table-body').innerHTML = html
        }
        else if (filterJustRemoved === true && this.filters.length >= 1) {
            console.log('filterApply LANDED HERE    else if (filterJustRemoved === true && this.filters.length >= 1) { ', header, value, filterJustRemoved)
            let furtherFilteredData = []
            let data = this.data
            for (let i = 0; i < data.length; i++) {
                let matchAllFilters = true; // Flag to track if the data item matches all filters

                // Iterate over each filter
                for (let j = 0; j < this.filters.length; j++) {
                    const filter = this.filters[j];
                    const header = filter.header;
                    const value = filter.value;

                    // Check if the data item matches the current filter
                    if (!(data[i][header].toUpperCase().includes(value.toUpperCase()) || data[i][header].includes(value))) {
                        // If the data item doesn't match the current filter, set matchAllFilters to false and break the loop
                        matchAllFilters = false;
                        break;
                    }
                }

                // If the data item matches all filters, add it to the filteredData array
                if (matchAllFilters) {
                    furtherFilteredData.push(data[i]);
                }
            }
            let html = this.injectTableBodyData(furtherFilteredData)
            document.getElementById('data-launch-mot-equipment-table-body').innerHTML = html
        }
        else if (this.filters.length === 0) {       
            console.log('filterApply LANDED HERE    else if (this.filters.length === 0) {    ', header, value, filterJustRemoved)  
            this.filters.push({header: header, value: value})
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i][header].toUpperCase().includes(value.toUpperCase()) || this.data[i][header].includes(value)) {
                    this.filteredData.push(this.data[i])
                }                
            }
            let html = this.injectTableBodyData(this.filteredData)
            document.getElementById('data-launch-mot-equipment-table-body').innerHTML = html
        }
        else {
            // Iterate over each data item
            console.log('filterApply LANDED HERE    else {    ', header, value, filterJustRemoved)  
            let filterMatch = false
            let data = []
            for (let i = 0; i < this.filters.length; i++) {
               if (this.filters[i].header === header) {
                    filterMatch = true
                    this.filters[i].value = value
               }                
            }
            if (filterMatch === false) {
                this.filters.push({header: header, value: value})
                data = this.filteredData
            }
            else {
                if (this.filters.length === 1) {
                    data = this.data
                }
                else {
                    data = this.filteredData
                }
            }
            let furtherFilteredData = []
            for (let i = 0; i < data.length; i++) {
                let matchAllFilters = true; // Flag to track if the data item matches all filters

                // Iterate over each filter
                for (let j = 0; j < this.filters.length; j++) {
                    const filter = this.filters[j];
                    const header = filter.header;
                    const value = filter.value;

                    // Check if the data item matches the current filter
                    if (!(data[i][header].toUpperCase().includes(value.toUpperCase()) || data[i][header].includes(value))) {
                        // If the data item doesn't match the current filter, set matchAllFilters to false and break the loop
                        matchAllFilters = false;
                        break;
                    }
                }
                // If the data item matches all filters, add it to the filteredData array
                if (matchAllFilters) {
                    furtherFilteredData.push(data[i]);
                }
            }
            let html = this.injectTableBodyData(furtherFilteredData)
            document.getElementById('data-launch-mot-equipment-table-body').innerHTML = html
        }
    }
    filterRemove (header,value) {
        console.log('filterRemove selected')
        this.filters = this.filters.filter(function (filterRec) {
            return filterRec.header !== header
        })
        this.filterApply(header, value, true)
    }
    filterResetAll () {
        this.filteredData = []
        this.filters = []
        let x = Array.from(document.getElementsByClassName('data-launch-filter-search'))
        x.forEach(el => {
            if (el.attributes['type'].value === 'text' || el.attributes['type'].value === 'date' || el.attributes['type'].value === 'email') {
                el.value = ''
            }
            else if (el.attributes['type'].value === 'checkbox') {
                el.checked = false
            }
        })
        let html = this.injectTableBodyData(this.data)
        document.getElementById('data-launch-mot-equipment-table-body').innerHTML = html
    }
    openModal (importData) {
        let html = `
        <table class='table table-striped'>
            <thead>
                <tr>
                    <th>Tester Name</th>
                    <th>Tester ID</th>
                    <th>Test Done</th>
                    <th>Average Vehicle Age</th>
                    <th>Average Test Time</th>
                    <th>Tests Failed</th>
                    <th>Body, chassis, structure</th>
                    <th>Brakes</th>
                    <th>Buses and coaches supplementary tests</th>
                    <th>Identification of the vehicle</th>
                    <th>Lamps, reflectors and electrical equipment</th>
                    <th>Noise, emissions and leaks</th>
                    <th>Road Wheels</th>
                    <th>Seat belt installation check</th>
                    <th>Seat belts and supplementary restraint systems</th>
                    <th>Speedometer and speed limiter</th>
                    <th>Steering</th>
                    <th>Suspension</th>
                    <th>Tyres</th>
                    <th>Visibility</th>
                </tr>
            </thead>
            <tbody>`
       
            const testerNames = importData[5];
            const userIds = importData[6];
            const initialTestPerformanceHeaders = importData.slice(8, 12);
            const failuresByCategoryHeaders = importData.slice(13, 27);
    
            Object.keys(testerNames).forEach((key) => {
                if (key === 'A' || key === '__rowNum__') return;
    
                html += `<tr>`;
                html += `<td>${testerNames[key]}</td>`;
                html += `<td>${userIds[key]}</td>`;
    
                initialTestPerformanceHeaders.forEach(header => {
                    html += `<td>${header[key] || ''}</td>`;
                });
    
                failuresByCategoryHeaders.forEach(header => {
                    html += `<td>${header[key] || ''}</td>`;
                });
    
                html += `</tr>`;
            });
    
            html += `</tbody></table>`;


        html += `
        <button class='data-launch-modal-close-window btn btn-block btn-success data-launch-car-tqi-modal-close'>Close</button>
        `
        document.getElementById('cartqiPageModalPopup').style.display = 'block'
        document.getElementById('data-launch-save-close-garage-record').style.display = 'none'                       
        document.getElementById('cartqiPageModalPopup').innerHTML = html
    }
    uploadFile () {
        console.log('hitting the upload file section in carTqi.js')
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = _ => {
          // you can use this method to get file and perform respective operations
                  let files =   Array.from(input.files);
                  var xl2json = this.ExcelToJSON();
                  this.parseExcel(files[0]);              
              };
        input.click();
    }
    parseExcel (file) {
        var reader = new FileReader();
        reader.onload = (e) => {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary',
                raw: true // Read the data as raw values to prevent automatic date conversion
            });
            workbook.SheetNames.forEach(sheetName => {
                var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: "A", raw: true });
                console.log('XL_row_object.length', XL_row_object.length);
                // No date parsing needed, keep values as they are
                this.tqiImportData = XL_row_object.map(row => {
                    return row; // Keep the values as strings
                });
                console.log('this.tqiImportData data is', this.tqiImportData);
                this.data.push({
                    createdOn: new Date(),
                    month: this.extractMonths(this.tqiImportData[2].A),
                    year: this.extractYear(this.tqiImportData[2].A),
                    class: this.tqiImportData[4].A,
                    rawData: this.tqiImportData,
                    vtsID: this.tqiImportData[1].A
                });
                this.renderHTMLData(this.htmlHeader)
                // this.openModal(this.tqiImportData)
            });
        }
        reader.onerror = function(ex) {
          console.log(ex);
        };
        reader.readAsBinaryString(file);
    }
    extractYear(value) {
        if (value.includes('to')) {
            return value.split(' to ')[0].substring(4, 6);
        } else {
            return value.substring(4, 6);
        }
    }
    extractMonths(value) {
        if (value.includes('to')) {
            const parts = value.split(' to ');
            const startMonth = parts[0].substring(0, 3);
            const endMonth = parts[1].substring(0, 3);
            return `${startMonth}-${endMonth}`;
        } else {
            return value.substring(0, 3);
        }
    }
    ExcelToJSON () {        
        var objMyObject = function(row) {
          this.colA = row.A;
          this.colB = row.B;
          this.colC = row.C;
          this.colD = row.D;
          this.colE = row.E;
          this.colF = row.F;
          this.colG = row.G;
        };
    };
    import () {
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = _ => {
          // you can use this method to get file and perform respective operations
                  let files =   Array.from(input.files);
                  var xl2json = this.ExcelToJSON();
                  this.parseExcel(files[0]);              
              };
        input.click();
    }
    addListeners () {
        document.getElementById(this.id).addEventListener('click', (event) => {
            if (event.target.classList.contains('data-launch-table-new-record')) {
                console.log('show new option set form')
                this.showNewForm()
            }
            else if  (event.target.classList.contains('data-launch-new-mot-equipment-save')) {
                let obj = {}
                obj.bay = document.getElementById('mot-equipment-bay').value
                obj.serialNo = document.getElementById('mot-equipment-serial-no').value
                obj.make = document.getElementById('mot-equipment-make').value
                obj.model = document.getElementById('mot-equipment-model').value
                obj.equipmentType = document.getElementById('mot-equipment-equipment-type').value
                document.getElementById('motequipmentPageModalPopup').style.display = 'none'
                this.data.push(obj)
                console.log('hit here ???')
                document.getElementById('data-launch-save-close-garage-record').style.display = 'block'    
                this.renderHTMLData(this.htmlHeader)
            }
            else if  (event.target.classList.contains('data-launch-car-tqi-modal-close')) {
                document.getElementById('cartqiPageModalPopup').style.display = 'none'
                document.getElementById('data-launch-save-close-garage-record').style.display = 'block'
            }
            else if (event.target.classList.contains('data-launch-table-reset-all-filters-button')) {
                console.log('reset all filters ?>')
                this.filterResetAll()
            }
            else if (event.target.classList.contains('data-launch-car-tqi-list-view-record-click')) {
                let vtsID = event.target.attributes["data-launch-vts-id"].value
                let obj = {}
                this.data.forEach(row => {
                    if (row.vtsID = vtsID) {
                        obj = row.rawData
                    }
                })
                this.openModal(obj)
            }     
            else if (event.target.classList.contains('data-launch-export-records-button')) {
                this.export()
            }
            else if (event.target.classList.contains('data-launch-upload-car-tqi-file')) {
                console.log('hit here,,,,, data-launch-upload-car-tqi-files')
                this.import()
            }
            else if (event.target.classList.contains('data-launch-mot-equipment-list-view-record-click')) {
                console.log('registered click on mot equipment list view item')
                let rowNo = event.target.attributes["data-launch-row-no"].value
                let obj = {}
                obj.bay = document.getElementById(`data-launch-mot-equipment-${rowNo}-bay`).innerText
                obj.serialNo = document.getElementById(`data-launch-mot-equipment-${rowNo}-serial-no`).innerText
                obj.make = document.getElementById(`data-launch-mot-equipment-${rowNo}-make`).innerText
                obj.model = document.getElementById(`data-launch-mot-equipment-${rowNo}-model`).innerText
                obj.equipmentType = document.getElementById(`data-launch-mot-equipment-${rowNo}-equipment-type`).innerText
                console.log('hereeeeeee')
                this.openModal(obj)
            }      
        })
        document.getElementById(this.id).addEventListener('change', (event) => {
            if (event.target.classList.contains('data-launch-filter-search') && event.target.value !== '') {
                let header = event.target.attributes["data-launch-header"].value
                let value = event.target.value
                this.filterApply(header,value)
            }
            else if (event.target.classList.contains('data-launch-filter-search') && event.target.value === '') {
                let header = event.target.attributes["data-launch-header"].value
                let value = event.target.value
                this.filterRemove(header,value)
            }
         })
    }
    export = () => {

        const wb = new ExcelJS.Workbook();
        const worksheetName = 'Simple Worksheet';
        const ws = wb.addWorksheet(worksheetName);

        let x = Array.from(document.getElementsByClassName('export-record'))
        let r = Array.from(document.getElementsByClassName('export-row'))


        /// find the column headers and build up the column headers array of objects for exceljs
        let columnHeaders = []            
        for (let i = 0; i < x.length; i++) {            
            if (x[i].getAttribute('data-export-row') == 0){
                columnHeaders.push({
                    header: x[i].getAttribute('data-export-header'),
                    key: x[i].getAttribute('data-export-header'),
                    width: 20                    
                })
            }                     
        }
        // applied the customer column headers to the exceljs worksheet.columns function
        ws.columns = columnHeaders
        
      /// find the data within each row and add it to the excel sheet
        for (let p = 0; p < r.length; p++) {  
            let val = {}  
            for (let i = 0; i < x.length; i++) {              
                if (x[i].getAttribute('data-export-row') == p){
                    val[x[i].getAttribute('data-export-header')] = x[i].getAttribute('data-export-val')
                }                     
            }
            ws.addRow(val)  
        }
        /// write to XLSX and download file
        wb.xlsx.writeBuffer()
        .then(buffer => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${worksheetName}.xlsx`);
        });
        
    }  
}