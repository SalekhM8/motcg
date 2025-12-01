console.log('mot Equipment file')

class MOTEquipment {
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
                equipmentType: 'Car',
                make: 'Vauxhall',
                model: 'Corsa',
                serialNo: 'PE26QT',
                bay: 1
            },
            {
                equipmentType: 'Car',
                make: 'Honda',
                model: 'Civic',
                serialNo: 'PE26QT',
                bay: 1
            },
            {
                equipmentType: 'Car',
                make: 'Vauxhall',
                model: 'Corsa',
                serialNo: 'NE4 RTA',
                bay: 2
            },
            {
                equipmentType: 'Van',
                make: 'Mercedes',
                model: 'Sprinter',
                serialNo: 'PE26QT',
                bay: 1
            },
            {
                equipmentType: 'Car',
                make: 'Porsche',
                model: '911',
                serialNo: 'ABC',
                bay: 1
            },
            {
                equipmentType: 'Car',
                make: 'Porsche',
                model: '911',
                serialNo: 'DEF',
                bay: 1
            }
        ]
    }
    renderHTMLHeader () {
        this.htmlHeader = `
        <div class='data-launch-modal-popup' id='motequipmentPageModalPopup' style='display: none'></div>
        <div class='data-launch-screen-overlay' style='display:none' id='motEquipmentPageScreenOverlay'></div>
        <div class="row">
            <h3 class='data-launch-list-page-header'>MOT Equipment List</h3>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                <button class="btn btn-primary data-launch-table-new-record data-launch-list-button-headers modern-button-calibration">
                    <i class="bi bi-tools"></i> Add MOT Equipment
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
                                <span>Bay</span>
                                <div>
                                    <input type="checkbox" class="data-launch-filter-search" data-launch-header="bay" style="width: 100%;" placeholder="" value="">
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
            <tr class="export-record export-row" data-export-row="${exportRow}" data-export-header="VTS Pro ID"                 data-export-val="${data[i].vtsId}" data-vts-pro-id=${data[i].vtsId}>
                <td class="export-record data-launch-mot-equipment-list-view-record-click" data-launch-row-no='${i}'  id="data-launch-mot-equipment-${i}-equipment-type"    data-export-row="${exportRow}" data-export-header="Equipment Type"     data-export-val="${data[i].equipmentType}" scope="row">${data[i].equipmentType}</td>
                <td class="export-record data-launch-mot-equipment-list-view-record-click" data-launch-row-no='${i}'  id="data-launch-mot-equipment-${i}-make"              data-export-row="${exportRow}" data-export-header="Make"               data-export-val="${data[i].make}">${data[i].make}</td>
                <td class="export-record data-launch-mot-equipment-list-view-record-click" data-launch-row-no='${i}'  id="data-launch-mot-equipment-${i}-model"             data-export-row="${exportRow}" data-export-header="Model"              data-export-val="${data[i].model}">${data[i].model}</td>
                <td class="export-record data-launch-mot-equipment-list-view-record-click" data-launch-row-no='${i}'  id="data-launch-mot-equipment-${i}-serial-no"         data-export-row="${exportRow}" data-export-header="Serial No"          data-export-val="${data[i].serialNo}">${data[i].serialNo}</td>
                <td class="export-record data-launch-mot-equipment-list-view-record-click" data-launch-row-no='${i}'  id="data-launch-mot-equipment-${i}-bay"               data-export-row="${exportRow}" data-export-header="Bay"                data-export-val="${data[i].bay}" scope="row">${data[i].bay}</td>
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
                    <td class="export-record data-launch-mot-equipment-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-equipment-${i}-equipment-type" data-export-header="Equipment Type"                data-export-val="${data[i].equipmentType}" scope="row">${data[i].equipmentType}</td>
                    <td class="export-record data-launch-mot-equipment-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-equipment-${i}-make" data-export-header="Make"               data-export-val="${data[i].make}">${data[i].make}</td>
                    <td class="export-record data-launch-mot-equipment-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-equipment-${i}-model" data-export-header="Model"            data-export-val="${data[i].model}">${data[i].model}</td>
                    <td class="export-record data-launch-mot-equipment-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-equipment-${i}-serial-no" data-export-header="Serial No"              data-export-val="${data[i].serialNo}">${data[i].serialNo}</td>
                    <td class="export-record data-launch-mot-equipment-list-view-record-click"  data-export-row="${exportRow}" data-launch-row-no='${i}'  id="data-launch-mot-equipment-${i}-bay" data-export-header="Bay"                data-export-val="${data[i].bay}" scope="row">${data[i].bay}</td>
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
    showNewForm () {
        console.log('show new form')
        document.getElementById('garagePageMain').backgroundColor = 'lightgrey'
        let html = ''
        html += `
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Equipment Type</label>
            <input placeholder='Equipment Type' type='text' data-launch-field="equipmentType" id="mot-equipment-equipment-type" value="" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Make</label>
            <input placeholder='Make' type='text' data-launch-field="make" value="" id="mot-equipment-make" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Model</label>
            <input placeholder='Model' type='text' data-launch-field="model" value="" id="mot-equipment-model" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Serial No</label>
            <input placeholder='serialNo' type='text' data-launch-field="serialNo" value="" id="mot-equipment-serial-no" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Bay</label>
            <input placeholder='serialNo' type='text' data-launch-field="bay" value="" id="mot-equipment-bay" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Documents</label>
            <input type='file' data-launch-field="file" value="" id="mot-equipment-file-upload" class='data-launch-input-field'>
        </div>
        <button class='data-launch-modal-close-window btn btn-block btn-success data-launch-new-mot-equipment-save'>Save & Close</button>
        `
        document.getElementById('motequipmentPageModalPopup').style.display = 'block'
        document.getElementById('motequipmentPageModalPopup').innerHTML = html
        document.getElementById('data-launch-save-close-garage-record').style.display = 'none'                       
    }
    openModal (obj) {
        let html = `
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
            <label class="data-launch-field-labels">Bays</label>
            <input placeholder='bays' type='text' data-launch-field="bays" value="${obj.bay}" class='data-launch-input-field'>
        </div>
        <div class='data-launch-input-field-container'>
            <label class="data-launch-field-labels">Documents</label>
            <input type='file' data-launch-field="file" value="" id="mot-equipment-file-upload" class='data-launch-input-field'>
        </div>
        <button class='data-launch-modal-close-window btn btn-block btn-success data-launch-mot-equipment-close'>Close</button>
        `
        document.getElementById('motequipmentPageModalPopup').style.display = 'block'
        document.getElementById('data-launch-save-close-garage-record').style.display = 'none'                        
        document.getElementById('motequipmentPageModalPopup').innerHTML = html
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
            else if  (event.target.classList.contains('data-launch-mot-equipment-close')) {
                document.getElementById('motequipmentPageModalPopup').style.display = 'none'
                document.getElementById('data-launch-save-close-garage-record').style.display = 'block'
            }
            else if (event.target.classList.contains('data-launch-table-reset-all-filters')) {
                console.log('reset all filters ?>')
                this.filterResetAll()
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
}