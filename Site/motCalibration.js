console.log('mot Calibration file')
class MOTCalibration {
    constructor(id) {
        this.data = []
        this.id = id
        this.filteredData = []
        this.filters = []
        this.fetchData()
        this.renderHTMLHeader()
        this.addListeners()
    }
    fetchData () {
        this.data = [
            {
                garageName: 'Vehicle Examiners Garage',
                equipmentType: 'Play Detectors',
                make: 'Ford',
                model: 'Transit',
                serialNo: '9999',
                lastCalibrationDate: '02-02-24',
                nextCalibrationDate: '04-04-24',
                bays: 'Bay 1',
                notes: 'these are all of my notes concerning this mot calibration test',
                id: '123'
            },
            {
                garageName: 'Vehicle Examiners Garage',
                equipmentType: 'Play Detectors',
                make: 'Vauxhall',
                model: 'Viva',
                serialNo: '1234',
                lastCalibrationDate: '01-11-24',
                nextCalibrationDate: '01-12-24',
                bays: 'Bay 3',
                notes: 'these are all of my notes concerning this mot calibration test',
                id: '456'
            },
            {
                garageName: 'Vehicle Examiners Garage',
                equipmentType: 'Decelerometer',
                make: 'Ferari',
                model: 'F60',
                serialNo: '9999',
                lastCalibrationDate: '02-02-24',
                nextCalibrationDate: '04-04-24',
                bays: 'Bay 1',
                notes: 'these are all of my notes concerning this mot calibration test',
                id: '789'
            }
        ]
    }
    renderHTMLHeader () {
        this.htmlHeader = `
        <div class='data-launch-modal-popup' id='motCalibrationPageModalPopup' style='display: none'></div>
        <div class='data-launch-screen-overlay' style='display:none' id='motCalibrationPageScreenOverlay'></div>
        <div class="row">
            <h3 class='data-launch-list-page-header'>MOT Calibration List</h3>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                <button class="btn btn-primary data-launch-table-new-record data-launch-list-button-headers modern-button-calibration">
                    <i class="bi bi-tools"></i> Add MOT Calibration
                </button>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                <button class="btn btn-primary data-launch-export-records data-launch-list-button-headers modern-button-calibration">
                    <i class="bi bi-file-earmark-arrow-down"></i> Export to CSV
                </button>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                <button class="btn btn-primary data-launch-table-reset-all-filters data-launch-list-button-headers modern-button-calibration">
                    <i class="bi bi-x-circle"></i> Reset All Filters
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 data-launch-table-container">
                <table class="table table-hover data-launch-table-clickable-row notes-table">
                    <thead class="sticky-header">
                        <tr>
                            <th scope="col">
                                <span>Garage Name</span>
                                <div>
                                    <input type="text" class="data-launch-filter-search" data-launch-header="garageName" style="width: 100%;" placeholder="" value="">
                                </div>
                            </th>
                            <th scope="col">
                                <span>Equipment Type</span>
                                <div>
                                    <input type="text" class="data-launch-filter-search" data-launch-header="equipmentType" style="width: 100%;" placeholder="" value="">
                                </div>
                            </th>
                            <th scope="col">                           
                                <span>Make</span>
                                <div>
                                    <input type="text" class="data-launch-filter-search" data-launch-header="make" style="width: 100%;" placeholder="" value="">
                                </div>
                            </th>
                            <th scope="col">
                                <span>Model</span>
                                <div>
                                    <input type="email" class="data-launch-filter-search" data-launch-header="model" style="width: 100%;" placeholder="" value="">
                                </div>
                            </th>
                            <th scope="col">                           
                                <span>Serial No</span>
                                <div>
                                    <input type="text" class="data-launch-filter-search" data-launch-header="serialNo" style="width: 100%;" placeholder="" value="">
                                </div>
                            </th>
                            <th scope="col">                           
                                <span>Last Calibration Date</span>
                                <div>
                                    <input type="date" class="data-launch-filter-search" data-launch-header="lastCalibrationDate" style="width: 100%;" placeholder="" value="">
                                </div>
                            </th>
                            <th scope="col">                           
                                <span>Next Calibration Date</span>
                                <div>
                                    <input type="date" class="data-launch-filter-search" data-launch-header="nextCalibrationDate" style="width: 100%;" placeholder="" value="">
                                </div>
                            </th>
                            <th scope="col">
                                <span>Bays</span>
                                <div>
                                    <input type="checkbox" class="data-launch-filter-search" data-launch-header="bay" style="width: 100%;" placeholder="" value="">
                                </div>
                            </th>
                            <th scope="col">
                                <span>Notes</span>
                                <div>
                                    <input type="checkbox" class="data-launch-filter-search" data-launch-header="notes" style="width: 100%;" placeholder="" value="">
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody id='data-launch-mot-calibration-table-body'>`
        this.renderHTMLData(this.htmlHeader)    
    }
    renderHTMLData(html) {
        console.log('html is ', html)
        console.log('this.data is ', this.data)
        let data = this.data
        let exportRow = 0
        for (let i = 0; i < data.length; i++) {
            html += `
            <tr class="export-record export-row" data-export-row="${exportRow}" data-export-header="VTS Pro ID"                 data-export-val="${data[i].vtsId}" data-vts-pro-id=${data[i].vtsId}>
                <td class="export-record data-launch-mot-calibration-list-view-record-click" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-garage-name"                   data-export-row="${exportRow}" data-export-header="Garage Name"           data-export-val="${data[i].garageName}">${data[i].garageName}</td>
                <td class="export-record data-launch-mot-calibration-list-view-record-click" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-equipment-type"                data-export-row="${exportRow}" data-export-header="Equipment Type"        data-export-val="${data[i].equipmentType}" scope="row">${data[i].equipmentType}</td>
                <td class="export-record data-launch-mot-calibration-list-view-record-click" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-make"                          data-export-row="${exportRow}" data-export-header="Make"                  data-export-val="${data[i].make}">${data[i].make}</td>
                <td class="export-record data-launch-mot-calibration-list-view-record-click" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-model"                         data-export-row="${exportRow}" data-export-header="Model"                 data-export-val="${data[i].model}">${data[i].model}</td>
                <td class="export-record data-launch-mot-calibration-list-view-record-click" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-serial-no"                     data-export-row="${exportRow}" data-export-header="Serial No"             data-export-val="${data[i].serialNo}">${data[i].serialNo}</td>
                <td class="export-record data-launch-mot-calibration-list-view-record-click" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-last-calibration-date"         data-export-row="${exportRow}" data-export-header="Last Calibration Date" data-export-val="${data[i].lastCalibrationDate}">${data[i].lastCalibrationDate}</td>
                <td class="export-record data-launch-mot-calibration-list-view-record-click" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-next-calibration-date"         data-export-row="${exportRow}" data-export-header="Next Calibration Date" data-export-val="${data[i].nextCalibrationDate}">${data[i].nextCalibrationDate}</td>
                <td class="export-record data-launch-mot-calibration-list-view-record-click" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-bay"                           data-export-row="${exportRow}" data-export-header="Bay"                  data-export-val="${data[i].bays}" scope="row">${data[i].bays}</td>
                <td class="export-record data-launch-mot-calibration-list-view-record-click" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-notes"                           data-export-row="${exportRow}" data-export-header="Notes"                  data-export-val="${data[i].notes}" scope="row">${data[i].notes}</td>
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
                    <td class="export-record data-launch-mot-calibration-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-garage-name" data-export-header="Garage Name"                          data-export-val="${data[i].garageName}" scope="row">${data[i].garageName}</td>
                    <td class="export-record data-launch-mot-calibration-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-calibration-type" data-export-header="Equipment Type"                  data-export-val="${data[i].equipmentType}" scope="row">${data[i].equipmentType}</td>
                    <td class="export-record data-launch-mot-calibration-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-make" data-export-header="Make"                                        data-export-val="${data[i].make}">${data[i].make}</td>
                    <td class="export-record data-launch-mot-calibration-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-model" data-export-header="Model"                                      data-export-val="${data[i].model}">${data[i].model}</td>
                    <td class="export-record data-launch-mot-calibration-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-serial-no" data-export-header="Serial No"                              data-export-val="${data[i].serialNo}">${data[i].serialNo}</td>
                    <td class="export-record data-launch-mot-calibration-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-last-calibration-date" data-export-header="Last Calibration Date"      data-export-val="${data[i].lastCalibrationDate}">${data[i].lastCalibrationDate}</td>
                    <td class="export-record data-launch-mot-calibration-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-next-calibration-date" data-export-header="Next Calibration Date"      data-export-val="${data[i].nextCalibrationDate}">${data[i].nextCalibrationDate}</td>
                    <td class="export-record data-launch-mot-calibration-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-bay" data-export-header="Bay"                                          data-export-val="${data[i].bays}" scope="row">${data[i].bays}</td>
                    <td class="export-record data-launch-mot-calibration-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-calibration-${i}-notes" data-export-header="Notes"                                        data-export-val="${data[i].notes}" scope="row">${data[i].notes}</td>
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
            document.getElementById('data-launch-mot-calibration-table-body').innerHTML = html
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
            document.getElementById('data-launch-mot-calibration-table-body').innerHTML = html
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
            document.getElementById('data-launch-mot-calibration-table-body').innerHTML = html
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
            document.getElementById('data-launch-mot-calibration-table-body').innerHTML = html
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
        document.getElementById('data-launch-mot-calibration-table-body').innerHTML = html
    }
    showNewForm () {
        console.log('show new form')
        document.getElementById('garagePageMain').backgroundColor = 'lightgrey'
        let html = ''
        html += `
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Equipment Type</label>
            <input placeholder='Equipment Type' type='text' data-launch-field="equipmentType" id="mot-calibration-equipment-type" value="" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Make</label>
            <input placeholder='Make' type='text' data-launch-field="make" value="" id="mot-calibration-make" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Model</label>
            <input placeholder='Model' type='text' data-launch-field="model" value="" id="mot-calibration-model" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Serial No</label>
            <input placeholder='serialNo' type='text' data-launch-field="serialNo" value="" id="mot-calibration-serial-no" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Bay</label>
            <input placeholder='serialNo' type='text' data-launch-field="bay" value="" id="mot-calibration-bay" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Notes</label>
            <textarea type='text' data-launch-field="notes" value="" id="mot-calibration-notes" class='data-launch-input-field'></textarea>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Documents</label>
            <input type='file' data-launch-field="file" value="" id="mot-calibration-file-upload" class='data-launch-input-field'>
        </div>
        <button class='data-launch-modal-close-window btn btn-block btn-success data-launch-new-mot-calibration-save'>Save & Close</button>
        `
        document.getElementById('motCalibrationPageModalPopup').style.display = 'block'
        document.getElementById('motCalibrationPageModalPopup').innerHTML = html
        document.getElementById('data-launch-save-close-garage-record').style.display = 'none'                       
    }
    openModal (obj) {
        let html = `
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Garage Name</label>
            <input placeholder='Garage Name' type='text' data-launch-field="garageName" value="${obj.garageName}" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Equipment Type</label>
            <input placeholder='Equipment Type' type='text' data-launch-field="equipmentType" value="${obj.equipmentType}" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Make</label>
            <input placeholder='Make' type='text' data-launch-field="make" value="${obj.make}" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Model</label>
            <input placeholder='Model' type='text' data-launch-field="model" value="${obj.model}" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Serial No</label>
            <input placeholder='serialNo' type='text' data-launch-field="serialNo" value="${obj.serialNo}" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Last Calibration Date</label>
            <input placeholder='lastCalibrationDate' type='date' data-launch-field="lastCalibrationDate" value="${obj.lastCalibrationDate}" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Next Calibration Date</label>
            <input placeholder='nextCalibrationDate' type='date' data-launch-field="nextCalibrationDate" value="${obj.nextCalibrationDate}" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Bays</label>
            <input placeholder='bays' type='text' data-launch-field="bays" value="${obj.bay}" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Notes</label>
            <textarea type='text' data-launch-field="notes" value="${obj.notes}" class='data-launch-input-field'>${obj.notes}</textarea>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Documents</label>
            <input type='file' data-launch-field="file" value="" id="mot-calibration-file-upload" class='data-launch-input-field'>
        </div>
        <button class='data-launch-modal-close-window btn btn-block btn-success data-launch-mot-calibration-close'>Close</button>
        `
        document.getElementById('motCalibrationPageModalPopup').style.display = 'block'
        document.getElementById('data-launch-save-close-garage-record').style.display = 'none'                        
        document.getElementById('motCalibrationPageModalPopup').innerHTML = html
    }
    addListeners () {
        document.getElementById(this.id).addEventListener('click', (event) => {
            if (event.target.classList.contains('data-launch-table-new-record')) {
                console.log('show new option set form')
                this.showNewForm()
            }
            else if  (event.target.classList.contains('data-launch-new-mot-calibration-save')) {
                let obj = {}
                obj.bay = document.getElementById('mot-calibration-bay').value
                obj.serialNo = document.getElementById('mot-calibration-serial-no').value
                obj.make = document.getElementById('mot-calibration-make').value
                obj.model = document.getElementById('mot-calibration-model').value
                obj.equipmentType = document.getElementById('mot-calibration-equipment-type').value
                obj.notes = document.getElementById('mot-calibration-notes').value
                document.getElementById('motCalibrationPageModalPopup').style.display = 'none'
                this.data.push(obj)
                console.log('hit here ???')
                document.getElementById('data-launch-save-close-garage-record').style.display = 'block'    
                this.renderHTMLData(this.htmlHeader)
            }
            else if  (event.target.classList.contains('data-launch-mot-calibration-close')) {
                document.getElementById('motCalibrationPageModalPopup').style.display = 'none'
                document.getElementById('data-launch-save-close-garage-record').style.display = 'block'
            }
            else if (event.target.classList.contains('data-launch-table-reset-all-filters')) {
                console.log('reset all filters ?>')
                this.filterResetAll()
            }
            else if (event.target.classList.contains('data-launch-mot-calibration-list-view-record-click')) {
                console.log('registered click on mot calibration list view item')
                let rowNo = event.target.attributes["data-launch-row-no"].value
                let obj = {}
                obj.bay = document.getElementById(`data-launch-mot-calibration-${rowNo}-bay`).innerText
                obj.serialNo = document.getElementById(`data-launch-mot-calibration-${rowNo}-serial-no`).innerText
                obj.make = document.getElementById(`data-launch-mot-calibration-${rowNo}-make`).innerText
                obj.model = document.getElementById(`data-launch-mot-calibration-${rowNo}-model`).innerText
                obj.equipmentType = document.getElementById(`data-launch-mot-calibration-${rowNo}-equipment-type`).innerText
                obj.notes = document.getElementById(`data-launch-mot-calibration-${rowNo}-notes`).innerText
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
}