class Garage {
    constructor(id) {
        // // console.log('hit the garages section')
        this.filteredData = []
        this.filters = []        
        this.selectedTesterId = null;
        this.listenersApplied = false
        this.selectedGarageIDToAssociate;
        this.motCalibrationDocumentFiles = []
        this.motCalibrationId = ''
        this.reminderRows = 30
        this.remindersSubgridClassInstantiated = ''
        this.garageScheduledOpeningDays = [];
        this.garageOperatingHours = {};
        this.setupModal();
        this.class_invoked_garageBookingsSubgridClass = false;
        this.data = garageData
        this.testerData = testersData
        this.tqiData = []
        this.carTqiDataToSubmit = []
        this.currentGarageRecord;
        document.getElementById('data-launch-side-bar').classList.remove('data-launch-activate-menu')
        if (id) {
            this.id = id
            let rec;
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i].id === parseInt(id)) {
                    rec = this.data[i]
                    this.currentGarageRecord = rec
                }        
            }
            this.openForm(true, rec)
            this.addListeners()
        }
        else {
           this.renderHTMLHeader()
        }   
    }
    renderHTMLHeader (param) {
        if (param) {
            this.data = garageData
        }
        let html = `
         <!-- Delete Confirmation Modal -->
                                    <div id="delModal" class="del-confirmation-modal">
                                        <div class="del-confirmation-modal__box">
                                           <i class="bi bi-exclamation-circle-fill" style="
                                                                                            position: relative;
                                                                                            float: left;
                                                                                            left: 0px;
                                                                                            color: red;
                                                                                            font-size: 26px;
                                                                                            top: -10px;
                                                                                        "></i>
                                        <h2 class="del-confirmation-modal__heading">Delete Record</h2>
                                        <i class="bi bi-exclamation-circle-fill" style="
                                                                                            position: relative;
                                                                                            float: right;
                                                                                            /* left: 0px; */
                                                                                            color: red;
                                                                                            font-size: 26px;
                                                                                            top: -10px;
                                                                                        "></i>
                                                                                        <br>
                                        <h3 class="del-confirmation-modal__message">
                                            Are you sure you want to proceed with deleting <strong>X</strong> record?</h3>
                                        <h4>Once you perform this operation, it cannot be undone.</h4>
                                        <div class="del-confirmation-modal__actions">
                                            <button class="del-confirmation-modal__btn del-confirmation-modal__btn--confirm" id="confirmDelete">Delete</button>
                                            <button class="del-confirmation-modal__btn del-confirmation-modal__btn--cancel" id="cancelDelete">Cancel</button>
                                        </div>
                                        </div>
                                    </div>
        <div class="container">
            <input style="width: 100%;" type="text" class="data-launch-garage-global-filter-input" id="data-launch-garage-global-filter-input" placeholder="Search">
            <i class="bi bi-arrow-counterclockwise data-launch-reset-filters-icon data-launch-table-reset-all-garage-filters"></i>  
        </div>
        <!-- Page wrapper/Container Section -->
        <div class="container" style="height: 92vh; overflow-y: auto;">
            <!-- Responsive Table Section -->
            <table class="responsive-table" style="width: 100%; border-collapse: collapse; margin: 0px;" id="data-launch-garage-list-view-table-el">
                <!-- Responsive Table Header Section -->
                <thead class="responsive-table__head" style="position: sticky; top: 0; z-index: 1;">
                    <tr class="responsive-table__row data-launch-garage-list-view-row">
                        <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">VTS</th>
                        <th style="width: 300px;" class="responsive-table__head__title responsive-table__head__title--status" scope="col">Trading Name</th>
                        <th class="responsive-table__head__title responsive-table__head__title--name"   scope="col">First</th>
                        <th class="responsive-table__head__title responsive-table__head__title--name"   scope="col">Last</th>                        
                        <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">Postcode</th>
                        <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">Phone</th>
                        <th></th>
                        <th class="responsive-table__head__title responsive-table__head__title--status" scope="col"></th>
                        <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">Archive?                          
                          <i class="bi bi-filetype-xls data-launch-export-icon data-launch-export-records"></i>                                        
                        </th>                        
                    </tr>
                </thead>
                <!-- Responsive Table Body Section -->
                <tbody class="responsive-table__body" id="data-launch-garage-table-body">
                `
                //  <tr class="responsive-table__row data-launch-inactive data-launch-garage-list-view-row" id='data-launch-garage-filter-container'>
                //         <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                //             <input type="text" class="data-launch-filter-search" data-launch-header="vtsId" style="width: 100%;" placeholder="" value="">
                //         </th>
                //         <th style="width: 300px;" class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                //             <input type="text" class="data-launch-filter-search" data-launch-header="tradingName" style="width: 100%;" placeholder="" value="">
                //         </th>
                //         <th class="responsive-table__head__title responsive-table__head__title--name">
                //             <input type="text" class="data-launch-filter-search" data-launch-header="" style="width: 100%;" placeholder="" value="">
                //         </th>
                //         <th class="responsive-table__head__title responsive-table__head__title--name">
                //             <input type="text" class="data-launch-filter-search" data-launch-header="" style="width: 100%;" placeholder="" value="">
                //         </th>                        
                //         <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                //             <input type="text" class="data-launch-filter-search" data-launch-header="postcode" style="width: 100%;" placeholder="" value="">
                //         </th>
                //         <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                //             <input type="text" class="data-launch-filter-search" data-launch-header="phone" style="width: 100%;" placeholder="" value="">
                //         </th>
                //         <th></th>
                //         <th></th>
                //         <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">Archive?</th>                                            
                //     </tr>
        this.renderHTMLData(html)
    }
    renderHTMLData(html) {
        // // console.log('html is ', html)
        // // console.log('this.data is ', this.data)
        let data = this.data
        let exportRow = 0
        for (let i = 0; i < data.length; i++) {
            html += `
            <tr id="data-launch-garage-table-list-view-row-${data[i].id}" class="responsive-table__row data-launch-garage-list-view-row  export-row" data-export-row="${exportRow}"  data-export-header="VTS Site No"  data-export-val="${data[i].vtsSiteNo_garage}" data-vts-pro-id=${data[i].id}>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-garage-list-view-record-click" data-export-row="${exportRow}" data-export-header="VTS ID"         data-export-val="${data[i].id}" scope="row">${typeof data[i].id === 'undefined' ? '': data[i].id}</td>
                <td style="width: 300px;" class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-garage-list-view-record-click" data-export-row="${exportRow}" data-export-header="Company Name"   data-export-val="${data[i].trading_name_garage}" scope="row">${typeof data[i].trading_name_garage === 'undefined' ? '': data[i].trading_name_garage}</td>    
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-garage-list-view-record-click" data-export-row="${exportRow}" data-export-header="First Name"      data-export-val="${data[i].contact_forename_garage}" scope="row">${typeof data[i].contact_forename_garage === 'undefined' ? '': data[i].contact_forename_garage}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-garage-list-view-record-click" data-export-row="${exportRow}" data-export-header="Last Name"       data-export-val="${data[i].contact_surname_garage}" scope="row">${typeof data[i].contact_surname_garage === 'undefined' ? '': data[i].contact_surname_garage}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-garage-list-view-record-click" data-export-row="${exportRow}" data-export-header="Postcode"       data-export-val="${data[i].vts_postcode_garage}" scope="row">${typeof data[i].vts_postcode_garage === 'undefined' ? '': data[i].vts_postcode_garage}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-garage-list-view-record-click" data-export-row="${exportRow}" data-export-header="Phone"   data-export-val="${data[i].contact_main_number_garage}" scope="row">${typeof data[i].contact_main_number_garage === 'undefined' ? '': data[i].contact_main_number_garage}</td>
                <td></td>
                <td></td>
                <td><i class="bi bi-archive data-launch-garage-archive-garage-record" data-id='${data[i].id}'></i></td>                 
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
        document.getElementById('garagePage').innerHTML = html
        // if (this.listenersApplied === false) {
            this.addListeners()
        // }    
    }
    buildTableBody (data) {
        let html = ''
        let exportRow = 0
        if (data.length === 0) {
            html += `<div><h1>Sorry, no records to display</h1></div>`
        }
        else {
            if (this.filters.length === 0) {
                data = this.data
            }
            let exportRow = 0
            for (let i = 0; i < data.length; i++) {
                html += `
                <tr id="data-launch-garage-table-list-view-row-${data[i].id}" class="responsive-table__row data-launch-garage-list-view-row  export-row" data-export-row="${exportRow}" data-export-header="VTS Site No"                 data-export-val="${data[i].vtsSiteNo_garage}" data-vts-pro-id=${data[i].id}>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-garage-list-view-record-click" data-export-row="${exportRow}" data-export-header="VTS ID"                data-export-val="${data[i].id}" scope="row">${typeof data[i].id === 'undefined' ? '': data[i].id}</td>
                    <td style="width: 300px;" class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-garage-list-view-record-click" data-export-row="${exportRow}" data-export-header="Company Name"          data-export-val="${data[i].trading_name_garage}" scope="row">${typeof data[i].trading_name_garage === 'undefined' ? '': data[i].trading_name_garage}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-garage-list-view-record-click" data-export-row="${exportRow}" data-export-header="First Name"                data-export-val="${data[i].contact_forename_garage}" scope="row">${typeof data[i].contact_forename_garage === 'undefined' ? '': data[i].contact_forename_garage}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-garage-list-view-record-click" data-export-row="${exportRow}" data-export-header="Last Name"                data-export-val="${data[i].contact_surname_garage}" scope="row">${typeof data[i].contact_surname_garage === 'undefined' ? '': data[i].contact_surname_garage}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-garage-list-view-record-click" data-export-row="${exportRow}" data-export-header="Postcode"                data-export-val="${data[i].vts_postcode_garage}" scope="row">${typeof data[i].vts_postcode_garage === 'undefined' ? '': data[i].vts_postcode_garage}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-garage-list-view-record-click" data-export-row="${exportRow}" data-export-header="Phone"          data-export-val="${data[i].contact_main_number_garage}" scope="row">${typeof data[i].contact_main_number_garage === 'undefined' ? '': data[i].contact_main_number_garage}</td>
                    <td></td>
                    <td></td>
                    <td><i class="bi bi-archive data-launch-garage-archive-garage-record" data-id='${data[i].id}'></i></td>                  
                </tr>`
                exportRow++           
            }
        }
        return html
    }
    // addMonthsToDate(dateString, monthsToAdd) {
    //     const date = new Date(dateString); // Convert the string to a Date object
    //     date.setMonth(date.getMonth() + monthsToAdd); // Add the specified months
    //     return date.toISOString().split("T")[0]; // Convert back to "YYYY-MM-DD" format
    // }
    addMonthsToDate(dateString, monthsToAdd) {
        const [year, month, day] = dateString.split("-").map(Number); // Parse the input date
        const newMonth = month - 1 + monthsToAdd; // Convert to 0-based index and add months
        const newYear = year + Math.floor(newMonth / 12); // Calculate the new year
        const adjustedMonth = (newMonth % 12 + 12) % 12; // Adjust month to 0-11 range
    
        // Handle invalid days for months (e.g., February 30th -> February 28th/29th)
        const lastDayOfTargetMonth = new Date(newYear, adjustedMonth + 1, 0).getDate();
        const finalDay = Math.min(day, lastDayOfTargetMonth);
    
        const newDate = new Date(newYear, adjustedMonth, finalDay);
    
        return newDate.toISOString().split("T")[0]; // Convert back to "YYYY-MM-DD" format
    }
    sendSMS () {
        // // console.log('test')
        // try {
        //     const result = await smsapi2.sms.sendSms('+447584433817', 'My first message!');
        
        //     // console.log(result);
        //     } catch (err) {
        //     // console.log(err);
        //     }
    }
    openTesterModal() {
        const modal = document.getElementById('myGarageTesterModal');
        modal.style.display = 'block';
        // this.populateTesterTable(this.testerData);
    }
    
    setupModal() {
        // Create modal elements
        let modalHtml = `
            <div id="myGarageTesterModal" class="garage-record-associated-testers-modal-popup">
                <div class="garage-record-associated-testers-modal-content">
                    <span class="garage-record-associated-testers-close">&times;</span>
                    <h2 class="garage-record-associated-testers-header">Select a Tester</h2>
                    <input type="text" id="garageTestersSearchInput" class="garage-record-associated-testers-search-input" placeholder="Search by Tester ID...">
                    <table id="testersTable" class="garage-record-associated-testers-table">
                        <thead>
                            <tr>
                                <th>Tester Name</th>
                                <th>Tester ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </table>
                          <div id="data_launch_associated_tester_modal_popup_add_new_tester_query" style='display: none'>
                            <div style="padding: 24px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; background-color: #f9f9f9; border-radius: 16px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); width: 90%; margin: auto;">
                                <p style="font-size: 18px; color: #333; margin-bottom: 8px;">Can't find the Tester you are looking for?</p>
                                <p style="font-size: 16px; color: #666; margin-bottom: 24px;">Why not just create your own...</p>
                                <button id="data-launch-add-new-tester-record" class="data-launch-add-new-tester-record" style="background-color: #0068B5; color: white; border: none; border-radius: 8px; padding: 12px 20px; font-size: 16px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; transition: background-color 0.3s ease;">
                                    <span class="plus-icon" style="font-size: 20px; margin-right: 8px;">+</span>
                                    New Tester
                                </button>
                            </div>
                        </div>
                    <button id="testers-ok-Button" class="garage-record-associated-testers-ok-button">OK</button>
                </div>
            </div>
            <div id="elevated-security-modal" class="u-mod-box-overlay hidden">
                <div class="u-mod-box-container">
                    <div class="u-mod-box-header">
                        <h2 class="u-mod-box-title">Error</h2>
                        <button class="u-mod-box-close-btn closeNotEnoughPermissionsModal">X</button>
                    </div>
                    <div class="u-mod-box-body">
                        <p class="u-mod-box-text">
                            You need a higher security clearance or special permissions to perform this operation. 
                            Please contact your administrator for access.
                        </p>
                    </div>
                    <div class="u-mod-box-footer">
                        <button class="u-mod-box-action-btn closeNotEnoughPermissionsModal">OK</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    
        // Modal event listeners
        const modal = document.getElementById('myGarageTesterModal');
        const closeSpan = document.getElementsByClassName('garage-record-associated-testers-close')[0];
        const searchInput = document.getElementById('garageTestersSearchInput');
        const createNewTesterBtn = document.getElementById('data-launch-add-new-tester-record');
        const testerTable = document.getElementById('testersTable').getElementsByTagName('tbody')[0];
    
        closeSpan.onclick = function() {
            modal.style.display = 'none';
        };

        createNewTesterBtn.onclick = () => {
            document.getElementById('data_launch_garage_create_new_tester_modal_dialogue').classList.add('active')
            //// BLANK OUT THE FIELDS ON THE NEW TESTER FORM
            document.getElementById('data_launch_garage_create_new_tester_modal_testerFirstName').value = ''
            document.getElementById('data_launch_garage_create_new_tester_modal_testerLastName').value = ''
            document.getElementById('data_launch_garage_create_new_tester_modal_testerPhone').value = ''
            document.getElementById('data_launch_garage_create_new_tester_modal_testerEmail').value = ''
            document.getElementById('data_launch_garage_create_new_tester_modal_testerUserId').value = ''
        }

        const closeNotEnoughPermissionsModal1 = document.getElementsByClassName('closeNotEnoughPermissionsModal')[0];
        const closeNotEnoughPermissionsModal2 = document.getElementsByClassName('closeNotEnoughPermissionsModal')[1];
        const notEnoughPermissionsModal = document.getElementById('elevated-security-modal');
        closeNotEnoughPermissionsModal1.onclick = function() {
            notEnoughPermissionsModal.classList.add('hidden')
        };
        closeNotEnoughPermissionsModal2.onclick = function() {
            notEnoughPermissionsModal.classList.add('hidden')
        };

    
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    
        searchInput.onkeyup = () => {
            const filter = searchInput.value.toLowerCase();
            let filteredData;
            // // console.log('filteredData is ', filteredData)
    
            // if (filter.startsWith('*') && filter.endsWith('*')) {
            //     const trimmedFilter = filter.slice(1, -1);
            //     filteredData = this.testerData.filter(tester =>
            //         tester.user_id.toLowerCase().includes(trimmedFilter)
            //     );
            // } else if (filter.startsWith('*')) {
            //     const trimmedFilter = filter.slice(1);
            //     filteredData = this.testerData.filter(tester =>
            //         tester.user_id.toLowerCase().endsWith(trimmedFilter)
            //     );
            // } else if (filter.endsWith('*')) {
            //     const trimmedFilter = filter.slice(0, -1);
            //     filteredData = this.testerData.filter(tester =>
            //         tester.user_id.toLowerCase().startsWith(trimmedFilter)
            //     );
            // } else {
            //     filteredData = this.testerData.filter(tester =>
            //         tester.user_id.toLowerCase().startsWith(filter)
            //     );
            // }

            filteredData = this.testerData.filter(tester =>
                (filter.toLowerCase()) === (tester.user_id.toLowerCase())
            )
                
                
    
            this.populateTesterTable(filteredData);
        };
    
        document.getElementById('testers-ok-Button').onclick = () => {
            if (this.selectedTesterId) {
                let newData = { garage_id: parseInt(this.id), tester_id: this.selectedTesterId };
                // // console.log('new record to add to the garage_testers table', newData)
               this.secureAction('create', 'tester_garages', null, newData).then(
                    success => {
                        this.injectDataIntoAssociatedTestersSubgrid();
                        modal.style.display = 'none';
                        // // console.log('success', success)
                    },
                    err => {
                        console.error('err', err)
                    }
               )                
            } else {
                this.showCRUDAlert('Please select a tester', 'error');
            }
        };
    }
    
    populateTesterTable(data) {
        const testerTable = document.getElementById('testersTable').getElementsByTagName('tbody')[0];
        // // console.log('what does the data say ? ', data)
        // Sort the data by tester name in alphabetical order
        data.sort((a, b) => {
            const nameA = a.first_name.toLowerCase();
            const nameB = b.first_name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
    
        testerTable.innerHTML = ''; // Clear the table
        document.getElementById('data_launch_associated_tester_modal_popup_add_new_tester_query').style.display = 'none'   
        data.forEach(tester => {
            const row = testerTable.insertRow();
            row.setAttribute('data-id', tester.id);
            row.onclick = () => {
                this.selectTesterRow(row);
            };
            const cell = row.insertCell(0);
            cell.textContent = tester.first_name + ' ' + tester.last_name
            const cell2 = row.insertCell(1);
            cell2.textContent = tester.user_id
        });
        if (data.length === 0 ) {
            document.getElementById('data_launch_associated_tester_modal_popup_add_new_tester_query').style.display = 'block'      
        }
    } 

    importCarTQIFile () {
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = _ => {
          // you can use this method to get file and perform respective operations
                  let files =   Array.from(input.files);
                  var xl2json = this.ExcelToJsonCarTqi();
                  this.parseExcelCarTqi(files[0]);              
              };
        input.click();
    }
    ExcelToJsonCarTqi () {        
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
    parseExcelCarTqi (file) {
        var reader = new FileReader();
        reader.onload = (e) => {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary',
                raw: true // Read the data as raw values to prevent automatic date conversion
            });
            workbook.SheetNames.forEach(sheetName => {
                var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: "A", raw: true });
                // // console.log('XL_row_object.length', XL_row_object.length);
                // No date parsing needed, keep values as they are
                this.tqiImportData = XL_row_object.map(row => {
                    return row; // Keep the values as strings
                });
                // // console.log('this.tqiImportData data is', this.tqiImportData);
                // // console.log('this doggg', this)
                this.carTqiDataToSubmit.push({
                    create_date: new Date(),
                    month: this.extractMonths(this.tqiImportData[2].A),
                    year: this.extractYear(this.tqiImportData[2].A),
                    class: this.tqiImportData[4].A,
                    data: JSON.stringify(this.tqiImportData),
                    garage_id: parseInt(this.id)
                });
                // this.renderHTMLHeader()
                this.openModal(this.tqiImportData)
            });
        }
        reader.onerror = function(ex) {
          // console.log(ex);
        };
        reader.readAsBinaryString(file);
    }
    
    selectTesterRow(row) {
        const rows = document.getElementById('testersTable').getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            rows[i].classList.remove('garage-record-associated-testers-selected');
        }
        row.classList.add('garage-record-associated-testers-selected');
        this.selectedTesterId = row.getAttribute('data-id');
    }

    openMotEquipmentModal () {
        document.getElementById('data-launch-mot-equipment-modal-box-popup').style.display = 'block'
    }
    closeMotEquipmentModal () {
        document.getElementById('data-launch-mot-equipment-modal-box-popup').style.display = 'none'
    }

    secureAction(action, tableName, id, data) {
        return new Promise((resolve, reject) => {
            // Perform authorization
            if (!this.isUserAuthorized(action, tableName)) {
                this.showCRUDAlert(
                    `ACTION FAILED \n 
                     You do not have the necessary privileges to \n
                     ${action} / ${tableName} record(s). \n
                     Please contact your administrator`, 
                    'error'
                );
                return reject(new Error("Unauthorized action"));
            }   
            
            // Perform the action
            let resultPromise;
            switch (action) {
                case "create":
                    resultPromise = createRecord(tableName, data);
                    break;
                case "read":
                    resultPromise = readRecord(tableName, id);
                    break;
                case "update":
                    resultPromise = updateRecord(tableName, id, data);
                    break;
                case "delete":
                    resultPromise = updateRecord(tableName, id, {data_launch_marked_for_deletion: 1});
                    break;
                default:
                    return reject(new Error("Invalid action"));
            }
    
            // Ensure the result of the action resolves or rejects correctly
            resultPromise
                .then((result) => {
                    // Success: Show alert and resolve the promise
                    this.showCRUDAlert('Success', 'success');
                    resolve(result);
                })
                .catch((error) => {
                    // Failure: Show alert and reject the promise
                    this.showCRUDAlert(
                        'ACTION FAILED \n #Error57 \n An error occurred during the action. \n Please contact your administrator', 
                        'error'
                    );
                    reject(error);
                });
        });
    }
    

    // saveNewMotEquipment () {
    //     // console.log('saveNewMotEquipment save button clicked')
    //     let equipmentType = document.getElementById(`mot_equipment_type_${this.id}`).value
    //     let make = document.getElementById(`mot_equipment_make_${this.id}`).value
    //     let model = document.getElementById(`mot_equipment_model_${this.id}`).value
    //     let serial_no = document.getElementById(`mot_equipment_serial_no_${this.id}`).value
    //     let bay = document.getElementById(`mot_equipment_bay_${this.id}`).value
    //     let object = {
    //                     equipment_type: equipmentType,
    //                     make: make,
    //                     model: model,
    //                     serial_no: serial_no,
    //                     bay: bay,
    //                     garage_id: this.id                    
    //     }
        
    //     // this.secureAction('create', data_launch_mot_equipment', object).then(res => {
    //     this.secureAction('create', 'data_launch_mot_equipment', object).then(res => {
    //         // console.log('secure Action logic seems to be allowing the promise to resolve successfulllllllllllly SUCCESS!!!!!')
    //         // console.log(' data_launch_mot_equipment note added ? ', res)
    //         let newHTMLNoteRow = `<tr id='garage_mot_equipment_${this.id}_${res.id}'>
    //                 <td>${res.equipment_type}</td>
    //                 <td>${res.make}</td>
    //                 <td>${res.model}</td>
    //                 <td>${res.serial_no}</td>
    //                 <td>${res.bay}</td> 
    //                 <td><i class="bi bi-trash data-launch-subgrid-delete-mot-equipment-item" data-mot-equipment-id='${res.id}'></i></td>             
    //             </tr>`
    //         document.getElementById(`garage_mot_equipment_tbody_${this.id}`).innerHTML += newHTMLNoteRow
    //         document.getElementById(`mot_equipment_type_${this.id}`).value = ''
    //         document.getElementById(`mot_equipment_make_${this.id}`).value = ''
    //         document.getElementById(`mot_equipment_model_${this.id}`).value = ''
    //         document.getElementById(`mot_equipment_serial_no_${this.id}`).value = ''
    //         document.getElementById(`mot_equipment_bay_${this.id}`).value = ''
    //         this.closeMotEquipmentModal()
    //     },
    //         error => {
    //         // console.log('something went wrong', error)
    //         this.closeMotEquipmentModal()
    //     })
    // }

    getFormattedDate(date) {
        if (date) {
            const now = new Date(date);
        
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
            const year = now.getFullYear();
            return `${day}/${month}/${year}`;
        }
        else {
          return ''
        }
    }

    closeTheSimpleImageUploadWindow (files) {
        // // console.log('files are ', files)
        /// all the below code needs to be refactored for a garage class, not the testers class


        document.getElementById('simple-file-upload-window').classList.remove('active')
        document.getElementById('data-launch-simple-image-upload-close-button-garages').classList.remove('active')        
        // document.getElementById('simple-file-upload-window').innerHTML = `<input id="uploader-preview-here-1335" class="simple-file-upload" type="hidden" data-template="frosty" data-maxFileSize="50">`
        // // console.log('files for the image upload', files)
        
        files.forEach(file => {
            let match = false
            for (let i = 0; i < this.motCalibrationDocumentFiles.length; i++) {
                if (this.motCalibrationDocumentFiles[i].cdnUrl === file.cdnUrl) {
                    match = true
                }
            }
            if (match === false) {
                this.motCalibrationDocumentFiles.push(file)
            }        
        })
        let html = ''
        for (let i = 0; i < this.motCalibrationDocumentFiles.length; i++) {
            html += `
                <tr id='garages_mot_calibration_files_row_${i}'>
                    <td id='garages_mot_calibration_files_row_${i}_name'>${this.motCalibrationDocumentFiles[i].name}</td>
                    <td id='garages_mot_calibration_files_row_${i}_type'>${this.motCalibrationDocumentFiles[i].type}</td>
                    `
            if (this.motCalibrationDocumentFiles[i].type === 'application/pdf') {
                html += `<td id='garages_mot_calibration_files_row_${i}_cdnUrl'><a target="_blank" href="${this.motCalibrationDocumentFiles[i].cdnUrl}"><i class="bi bi-file-earmark-pdf-fill"></i></a></td>`
            }
            else if (this.motCalibrationDocumentFiles[i].type === 'application/msword') {
                html += `<td id='garages_mot_calibration_files_row_${i}_cdnUrl'><a target="_blank" href="${this.motCalibrationDocumentFiles[i].cdnUrl}"><i class="bi bi-file-earmark-word-fill"></i></a></td>`
            }
            else {
                html += `<td id='garages_mot_calibration_files_row_${i}_cdnUrl'><a target="_blank" href="${this.motCalibrationDocumentFiles[i].cdnUrl}"><img style='height: 50px; width: 50px;' src="${this.motCalibrationDocumentFiles[i].cdnUrl}"></a></td>`
            }
            html += `
                    <td><i class="bi bi-trash data-launch-subgrid-delete-tester-training-document-item" data-row='${i}' data-id='${this.motCalibrationDocumentFiles[i].id}'></i></td>  
                </tr>
            `            
        }
        document.getElementById(`garageMotCalibrationsDocumentsTableBody_${this.id}`).innerHTML = html
    }
    navigateToTestingStationRecord (ev, id) {
        document.getElementById(`data-launch-modal-window-query-if-user-wants-to-save-container_${this.id}`).style.display = 'block'
        this.intendedEvent = ev
        this.intendedId = id
    }
    proceedToTestingStationRecord () {
        document.getElementById(`data-launch-modal-window-query-if-user-wants-to-save-container_${this.id}`).style.display = 'none'
        this.openChangingPageWindow()       
    }
    openChangingPageWindow() {
        document.getElementById('data-launch-transition-overlay-window').classList.add('active')
        document.getElementById('data-launch-transition-overlay-window-message').innerHTML = `Saving your record and navigating to Testing Station..` 
        setTimeout(() => {
            document.getElementById('data-launch-transition-overlay-window').classList.remove('active')
            changePage(this.intendedEvent, this.intendedId, 'testingStation')  
        }, 1000);       
    }
    async fetchCarDetailsMotBooking(vrn) { 
        try {
            let val = await getVehicleData(vrn); // Await only inside an async function
            console.log('Fetched Vehicle Data:', val);
    
            // Extract make & model safely using optional chaining
            // let make = val?.GetVehicles?.DataArea?.Vehicles?.Vehicle?.DVLA_Make || "Unknown";
            let make = val["_raw"].dvladata.manufacturer || "Unknown"
            // let model = val?.GetVehicles?.DataArea?.Vehicles?.Vehicle?.DVLA_Model || "Unknown";
            let model = val["_raw"].dvladata.model || "Unknown"
            // let vin = val?.GetVehicles?.DataArea?.Vehicles?.Vehicle?.VIN_Original_DVLA || "Unknown";
            let vin = val["_raw"].identifiers.vin || "Unknown"
            // // console.log(`Make: ${make}, Model: ${model}`);
            return { make, model, vin };
        } catch (error) {
            console.error("Error in fetchCarDetailsMotBooking:", error);
        }
    }
    async fetchDVSAMeta(reg) { 
        try {
            const meta = await fetchVehicleMeta(reg);
            console.log('Vehicle meta:', meta);
            // // console.log(`Make: ${make}, Model: ${model}`);
            return meta;
        } catch (error) {
            console.error("Error in fetchDVSAMeta:", error);
        }
    }
    bookingDataValidation () {
        let baySelector = document.getElementById('garageBookingsBay')
        let selectedIndex = baySelector.selectedIndex;
        let selectedOption = baySelector.options[selectedIndex];
        let selectedBayValue = selectedOption.value
        if (selectedBayValue === '') {
            this.showCRUDAlert(`Please Specify A Bay For The Booking`, 'error')
            // document.getElementById('bookingDate').style.backgroundColor = 'white'
            // document.getElementById('timeEnd').style.backgroundColor = 'red'
            // document.getElementById('timeStart').style.backgroundColor = 'white'
            document.getElementById('garageBookingsBay').style.backgroundColor = 'red'
            setTimeout(() => {
                document.getElementById('garageBookingsBay').style.backgroundColor = 'white'
            }, 3000);
            return false
        }
        let bookingDate = document.getElementById('bookingDate').value;
        let timeStart = document.getElementById('timeStart').value;
        let timeEnd = document.getElementById('timeEnd').value;
        let dateObj = new Date(bookingDate);
        // getDay() returns a number from 0 (Sunday) to 6 (Saturday)
        let dayIndex = dateObj.getDay();
        // Map the index to the corresponding day name
        let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let dayName = daysOfWeek[dayIndex];
        // // console.log('timeStart ', timeStart)
        // // console.log('timeEnd ', timeEnd)
        // // console.log('dayName', dayName)
        // // console.log('this.garageOperatingHours ', this.garageOperatingHours)
        // // console.log('this,garageScheduledOpeningDays ', this.garageScheduledOpeningDays)
        let bookingStartHour = timeStart.slice(0, 2)
        let bookingEndHour = timeEnd.slice(0, 2)
        // // console.log('bookingStartHour', bookingStartHour)
        // // console.log('bookingEndHour', bookingEndHour)
        let workingDayMatch = false
        let endHoursMinus1 = this.garageOperatingHours.end - 1
        this.garageScheduledOpeningDays.forEach(day=>{
            if (day === dayName) {
                workingDayMatch = true
            }
        })
        if (workingDayMatch === false) {
            this.showCRUDAlert(`Garage is not open on specified booking date (${dayName}) \n Please contact your administrator for assistance`, 'error')
            document.getElementById('bookingDate').style.backgroundColor = 'red'
            return false
        }
        if (bookingStartHour === '' && bookingEndHour === '') {
            this.showCRUDAlert(`Please specify a start and end time`, 'error')
            document.getElementById('bookingDate').style.backgroundColor = 'white'
            document.getElementById('timeStart').style.backgroundColor = 'red'
            document.getElementById('timeEnd').style.backgroundColor = 'red'
            return false
        }
        if (bookingStartHour === '') {
            this.showCRUDAlert(`Please specify a start time`, 'error')
            document.getElementById('bookingDate').style.backgroundColor = 'white'
            document.getElementById('timeStart').style.backgroundColor = 'red'
            document.getElementById('timeEnd').style.backgroundColor = 'white'
            return false
        }
        if (bookingEndHour === '') {
            this.showCRUDAlert(`Please specify an end time`, 'error')
            document.getElementById('bookingDate').style.backgroundColor = 'white'
            document.getElementById('timeEnd').style.backgroundColor = 'red'
            document.getElementById('timeStart').style.backgroundColor = 'white'
            return false
        }
        if (parseInt(bookingStartHour) < parseInt(this.garageOperatingHours.start)) {
            this.showCRUDAlert(`Garage is not open on specified booking time slot(${bookingStartHour}:00) \n Garage is configured for opening hours - ${this.garageOperatingHours.start} - ${endHoursMinus1} \n  Please contact your administrator for assistance`, 'error')
            document.getElementById('bookingDate').style.backgroundColor = 'white'
            document.getElementById('timeStart').style.backgroundColor = 'red'
            return false
        }
        if (parseInt(bookingEndHour) > parseInt(this.garageOperatingHours.end)) {
            this.showCRUDAlert(`Garage is already closed on specified booking end time (${bookingStartHour}:00) \n Garage is configured for opening hours - ${this.garageOperatingHours.start} - ${endHoursMinus1} \n Please contact your administrator for assistance`, 'error')
            document.getElementById('timeStart').style.backgroundColor = 'white'
            document.getElementById('timeEnd').style.backgroundColor = 'red'
            return false
        }
        if (parseInt(bookingStartHour)  > parseInt(this.garageOperatingHours.end)) {
            this.showCRUDAlert(`Garage is already closed on specified booking start time (${bookingEndHour}:00) \n Garage is configured for opening hours - ${this.garageOperatingHours.start} - ${endHoursMinus1} \n Please contact your administrator for assistance`, 'error')
            document.getElementById('bookingDate').style.backgroundColor = 'white'
            document.getElementById('timeStart').style.backgroundColor = 'red'
            return false
        }
        if (parseInt(bookingEndHour)  < parseInt(this.garageOperatingHours.start)) {
            this.showCRUDAlert(`Garage would not even be open on specified booking start / end time (${bookingStartHour}:00) \n  Garage is configured for opening hours - ${this.garageOperatingHours.start} - ${endHoursMinus1} \n Please contact your administrator for assistance`, 'error')
            document.getElementById('bookingDate').style.backgroundColor = 'white'
            document.getElementById('timeEnd').style.backgroundColor = 'red'
            return false
        }
        else {
            return true
        }
    }

    addMinutesToTime(startTime, minutesToAdd) {
        let time = new Date(`1970-01-01T${startTime}:00`); // Create a Date object with a fixed date
        time.setMinutes(time.getMinutes() + minutesToAdd); // Add minutes
        return time.toTimeString().slice(0, 5); // Return HH:MM format
    }
       
    
    showSuccessAlert () {
        document.getElementById('successBox-sendingLoginEmail').classList.add('active')
        document.getElementById('sendLoginDetailsToEmail').style.display = 'none'
        setTimeout(() => {
            this.hideLoginSentSuccessAlert()
        }, 5000);
    }
    hideLoginSentSuccessAlert () {
        document.getElementById('successBox-sendingLoginEmail').classList.remove('active')
        document.getElementById('sendLoginDetailsToEmail').style.display = 'block'
    }
    saveTQIRecord () {
        // // console.log('this.tqiData to be saved ', this.carTqiDataToSubmit)
        document.getElementById(`cartqiPageModalPopup_${this.id}`).style.display = 'none'
        this.secureAction('create', 'data_launch_tqis', null, this.carTqiDataToSubmit[0]).then(
            success => {
                // // console.log('data_launch_tqis created successfully ', success)
                this.injectDataIntoCarTQISubgrid()
            },
            error => {
                console.error(error)
            }
        )
    }
    sideBarToggle() {
        // let garageSideMenu = document.getElementById('data-launch-tabs-container')
        // garageSideMenu.classList.toggle('active')
        // if (garageSideMenu.classList.contains('active')) {
        //     let x = Array.from(document.getElementsByClassName('bi-chevron-double-right'))
        //     x.forEach(icon => {
        //         icon.classList.remove('bi-chevron-double-right')
        //         icon.classList.add('bi-chevron-double-left')
        //     })
        // }
        // else {
        //     let x = Array.from(document.getElementsByClassName('bi-chevron-double-left'))
        //     x.forEach(icon => {
        //         icon.classList.remove('bi-chevron-double-left')
        //         icon.classList.add('bi-chevron-double-right')
        //     })
        // }
        const toggle=document.getElementById('data-launch-garage-menu-toggle');
        const sidebar=document.getElementById('garageSidebar');
        sidebar.classList.toggle('open');
    }

    addListeners () {
        if(this.listenersApplied === true) { return }
        else {
            
            // const garagePage = document.getElementById('garagePage');

            // const garageSearch = document.getElementById('data-launch-garage-global-filter-input');
            // if (garageSearch && !garageSearch.dataset.boundGlobalFilter) {
            //     const handleFilter = (event) => {
            //         this.globalFilter(event);
            //     };

            //     // Listen to several events to be bulletproof
            //     ['input', 'keyup', 'change'].forEach(evtName => {
            //         garageSearch.addEventListener(evtName, handleFilter);
            //     });

            //     garageSearch.dataset.boundGlobalFilter = 'true';
            // }

            document.getElementById('garagePage').addEventListener('click', (event) => {
                event.stopPropagation();
                // // console.log('clicked the garages section')
                if (event.target.classList.contains('data-launch-garage-list-view-record-click')) {
                    let id = event.target.parentElement.dataset.vtsProId
                    this.currentRecordId = id
                    let rec;
                    for (let i = 0; i < this.data.length; i++) {
                        if (this.data[i].id === parseInt(id)) {
                            rec = this.data[i]
                        }        
                    }
                    this.openForm(true, rec)
                }
                else if (event.target.classList.contains('data-launch-garage-booking-status-checkboxes')) {
                    const checkboxes = document.querySelectorAll('.data-launch-garage-booking-status-checkboxes');
                    // Loop through them
                    checkboxes.forEach((checkbox) => {
                        // Uncheck all except the one that triggered the event
                        if (checkbox !== event.target) {
                            checkbox.checked = false;
                        }
                    });
                }           
                else if (event.target.classList.contains('data-launch-garage-menu-toggle-trigger')) {
                    console.log('reaching here garage menu toggle ?')
                    this.sideBarToggle()               
                }            
                else if (event.target.classList.contains('data-launch-table-clickable-associated-garages-row')) {
                    let id = event.target.attributes["data-id"].value;
                    // // console.log('USER RECORD ', USER_RECORD)
                    if (USER_RECORD.full_user === 1 || USER_RECORD.parent_garage_super_admin === 1) {
                        let rec;
                        for (let i = 0; i < this.data.length; i++) {
                            if (this.data[i].id === parseInt(id)) {
                                rec = this.data[i]
                            }        
                        }
                        this.openForm(true, rec)
                    }
                }
                else if (event.target.classList.contains('data-launch-record-back-to-original-garage')) {
                    let id = event.target.attributes["data-id"].value;
                    // // console.log('USER RECORD ', USER_RECORD)
                    if (USER_RECORD.full_user === 1 || USER_RECORD.parent_garage_super_admin === 1) {
                        let rec;
                        for (let i = 0; i < this.data.length; i++) {
                            if (this.data[i].id === parseInt(id)) {
                                rec = this.data[i]
                            }        
                        }
                        this.openForm(true, rec)
                    }
                }
                else if (event.target.classList.contains('closeNotEnoughPermissionsModal')) {
                    document.getElementById('elevated-security-modal').classList.add('hidden')
                }
                else if (event.target.classList.contains('data-launch-testing-station-related-record-click')) {
                    // // console.log('clicked the related testing station record')
                    if (user_FULL_USER === "1") {
                        let id = event.target.attributes["data-launch-id"].value
                        if (id !== 'null') {
                            this.navigateToTestingStationRecord(event, id)
                        } 
                    }
                    else {
                        document.getElementById('elevated-security-modal').classList.remove('hidden')
                    }
                }
                else if (event.target.classList.contains('data-launch-qc-checker-for-car-print-details')) {
                    this.printQCCheckerReport()
                }
                else if (event.target.classList.contains('data-launch-bookings-list-print')) {
                    this.printGarageBookingsListReport()
                }            

                else if (event.target.classList.contains('data-launch-qc-checker-for-bikes-print-details')) {
                    this.printQCCheckerForBikeReport()
                }    
                
                else if (event.target.classList.contains('data-launch-mot-site-audit-print-details')) {
                    this.printMOTSiteAuditReport()
                }
                
                else if (event.target.classList.contains('data-launch-garage-booking-print-details')) {
                    this.printGarageBookingReport()
                }
                


                else if (event.target.classList.contains('data-launch-modal-window-query-if-user-wants-to-save')) {
                    this.saveRecord()
                    this.proceedToTestingStationRecord()                
                }

                else if (event.target.classList.contains('data-launch-modal-window-query-if-user-wants-to-not-save')) {
                    this.proceedToTestingStationRecord()
                }

                else if (event.target.classList.contains('data-launch-car-tqi-save')) {
                    this.saveTQIRecord()
                }

                else if (event.target.classList.contains('data-launch-table-reset-all-garage-filters')) {
                    this.filterResetAll()               
                }            
                

                //// START OF MOT EQUIPMENT LISTENERS

                // MOT Equipment Subgrid Modal Handlers 
                    else if (event.target.classList.contains('mot-equipment-close')) {
                        document.getElementById('data-launch-mot-equipment-modal-box-popup').style.display = 'none';
                    }
                    else if (event.target.classList.contains('data-launch-save-mot-equipment-btn')) {
                        document.getElementById('data-launch-mot-equipment-modal-box-popup').style.display = 'none';
                        this.saveNewMotEquipment();
                    }
                    else if (event.target.classList.contains('data-launch-create-new-mot-equipment-record')) {
                        this.showMotEquipmentModal();
                    }
                    else if (event.target.classList.contains('data-launch-table-clickable-mot-equipment-row')) {
                        let id = event.target.attributes["data-id"].value;
                        this.showMotEquipmentDetails(id);
                    }
                    

                    else if (event.target.classList.contains('del-confirmation-modal__btn--cancel')) {
                        let delModal = document.getElementById('delModal');
                        delModal.classList.remove('active'); 
                    }
                    else if (event.target.classList.contains('del-confirmation-modal__btn--confirm')) {
                        let delModal = document.getElementById('delModal');
                        delModal.classList.remove('active'); 
                        let id = event.target.attributes["data-id"].value;
                        let table = event.target.attributes["data-table"].value;
                        let rowElemId = event.target.attributes["data-element-id"].value;
                        this.secureAction('delete', table, parseInt(id)).then(
                            success => {
                                // // console.log('success', success)
                                if (rowElemId === 'custom') {
                                    if (table === 'data_launch_garage_reminders') {
                                        // console.log("deleteRecord('data_launch_garage_reminders success') ", success)
                                        this.garageRemindersData = this.garageRemindersData.filter(item => item.id !== id);
                                        let selectElement = document.getElementById(`data-launch-garage-reminders-subgrid-number-of-rows-filter_${this.id}`)
                                        let selectedIndex = selectElement.selectedIndex;
                                        let selectedOption = selectElement.options[selectedIndex];
                                        // // console.log(selectedOption.value); // Logs the value of the selected option
                                        if (selectedOption.value === 'Next 30 Days') {
                                            this.remindersSubgridClassInstantiated.render('30 Days', this.garageRemindersData)
                                        }
                                        else if (selectedOption.value === 'Next 60 Days') {
                                            this.remindersSubgridClassInstantiated.render('60 Days', this.garageRemindersData)    
                                        }
                                        else if (selectedOption.value === 'All Dates') {
                                            this.remindersSubgridClassInstantiated.render('All Dates', this.garageRemindersData)    
                                        }
                                    }
                                    else if (table === 'tester_garages') {
                                        this.injectDataIntoAssociatedTestersSubgrid()
                                    }
                                    else if (table === 'data_launch_mot_reconciliations') {
                                        this.injectDataIntoMotReconciliationSubgrid()
                                    }
                                    else if (table === 'data_launch_garage_bookings') {
                                        fetchData('data_launch_garage_bookings', 3000, 0, null, this.id).then(data => {
                                            // // console.log(`data_launch_garage_bookings for garage_id: ${this.id} `, data);
                                            this.garageBookingsData = data
                                            this.garageBookingsSubgridClass.render(null, this.garageBookingsData, 0, 'garageBookings')
                                        })
                                    }                      
                                }
                                else {
                                    document.getElementById(rowElemId).style.display = 'none';
                                }                        
                            },
                            err => {
                                // console.log(err)
                            }
                        )  
                    }
                    else if (event.target.classList.contains('data-launch-subgrid-delete-mot-equipment-item')) {
                        let id = event.target.attributes["data-id"].value;
                        let delModal = document.getElementById('delModal');
                        delModal.classList.add('active');
                        document.getElementById('confirmDelete').setAttribute('data-id', id)
                        document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_mot_equipment')
                        document.getElementById('confirmDelete').setAttribute('data-element-id', `garage_mot_equipment_${this.id}_${id}`)
                    }

                    else if (event.target.classList.contains('data-launch-subgrid-delete-tqi-record-item')) {
                        let id = event.target.attributes["data-id"].value;
                        let delModal = document.getElementById('delModal');
                        delModal.classList.add('active');
                        document.getElementById('confirmDelete').setAttribute('data-id', id)
                        document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_tqis')
                        document.getElementById('confirmDelete').setAttribute('data-element-id', `tqi_${this.id}_${id}`)
                    }

                    



                ///// END OF MOT EQUIPMENT LISTENERS






                /// START of QC CHECKERS FOR BIKES LISTENERS
                else if (event.target.classList.contains('qc-checker-for-bike-close')) {
                    document.getElementById('qcCheckerForBikeModal').style.display = 'none';
                }
                else if (event.target.classList.contains('data-launch-save-qc-checkers-for-bike-btn')) {
                    document.getElementById('qcCheckerForBikeModal').style.display = 'none';
                    this.saveNewQcCheckersForBikeRecord();
                }
                else if (event.target.classList.contains('data-launch-create-new-qc-checkers-for-bikes-record')) {
                    this.showQcCheckersForBikeModal();
                }
                else if (event.target.classList.contains('data-launch-table-clickable-qc-checker-bike-record')) {
                    let id = event.target.attributes["data-id"].value;
                    this.showQcCheckersForBikeDetails(id);
                }
                else if (event.target.classList.contains('data-launch-subgrid-delete-qc-checker-bike-item')) {
                    let id = event.target.attributes["data-id"].value;
                    let delModal = document.getElementById('delModal');
                    delModal.classList.add('active');
                    document.getElementById('confirmDelete').setAttribute('data-id', id)
                    document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_qc_checkers_for_bike')
                    document.getElementById('confirmDelete').setAttribute('data-element-id', `qcCheckersForBike_${this.id}_${id}`)
                }
                ///// end of QC CHECKERS FOR BIKES LISTENERS


                ///// START OF GARAGE USERS SUBGRID LISTENERS /////
                else if (event.target.classList.contains('data-launch-subgrid-delete-garage-user-item')) {
                    let id = event.target.attributes["data-id"].value;
                    let delModal = document.getElementById('delModal');
                    delModal.classList.add('active');
                    document.getElementById('confirmDelete').setAttribute('data-id', id)
                    document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_users')
                    document.getElementById('confirmDelete').setAttribute('data-element-id', `garageUser_${this.id}_${id}`)
                }
                else if (event.target.classList.contains('data-launch-create-new-user-record')) {
                    this.showGarageUsersModal();
                }


                else if (event.target.classList.contains('data-launch-save-garage-user-btn')) {
                    document.getElementById('garageUserModal').style.display = 'none';
                    this.saveNewGarageUsersRecord();
                }

                else if (event.target.classList.contains('data-launch-table-clickable-garage-user-record')) {
                    let id = event.target.attributes["data-id"].value
                    this.showGarageUsersDetails(id);
                }

                else if (event.target.classList.contains('garage-user-close')) {
                    document.getElementById('garageUserModal').style.display = 'none';
                }

                
                else if (event.target.classList.contains('data-launch-garage-user-modal-enable-all-privileges')) {
                    let arr = [
                            "garage_user_modal_garage_details_tab_read",
                            "garage_user_modal_garage_details_tab_update",
                            "garage_user_modal_garage_details_tab_delete",
                            "garage_user_modal_testers_tab_create",
                            "garage_user_modal_testers_tab_read",
                            "garage_user_modal_testers_tab_update",
                            "garage_user_modal_testers_tab_delete",
                            "garage_user_modal_mot_equipment_tab_create",
                            "garage_user_modal_mot_equipment_tab_read",
                            "garage_user_modal_mot_equipment_tab_update",
                            "garage_user_modal_mot_equipment_tab_delete",
                            "garage_user_modal_calibrations_tab_create",
                            "garage_user_modal_calibrations_tab_read",
                            "garage_user_modal_calibrations_tab_update",
                            "garage_user_modal_calibrations_tab_delete",
                            "garage_user_modal_reconciliations_tab_create",
                            "garage_user_modal_reconciliations_tab_read",
                            "garage_user_modal_reconciliations_tab_update",
                            "garage_user_modal_reconciliations_tab_delete",
                            "garage_user_modal_mot_site_audits_tab_create",
                            "garage_user_modal_mot_site_audits_tab_read",
                            "garage_user_modal_mot_site_audits_tab_update",
                            "garage_user_modal_mot_site_audits_tab_delete",
                            "garage_user_modal_qc_checkers_tab_create",
                            "garage_user_modal_qc_checkers_tab_read",
                            "garage_user_modal_qc_checkers_tab_update",
                            "garage_user_modal_qc_checkers_tab_delete",
                            "garage_user_modal_garage_users_tab_create",
                            "garage_user_modal_garage_users_tab_read",
                            "garage_user_modal_garage_users_tab_update",
                            "garage_user_modal_garage_users_tab_delete",
                            "garage_user_modal_bookings_tab_create",
                            "garage_user_modal_bookings_tab_read",
                            "garage_user_modal_bookings_tab_update",
                            "garage_user_modal_bookings_tab_delete",
                            "garage_user_modal_defect_reports_tab_create",
                            "garage_user_modal_defect_reports_tab_read",
                            "garage_user_modal_defect_reports_tab_update",
                            "garage_user_modal_defect_reports_tab_delete",
                            "garage_user_modal_mot_bay_cleaning_log_tab_create",
                            "garage_user_modal_mot_bay_cleaning_log_tab_read",
                            "garage_user_modal_mot_bay_cleaning_log_tab_update",
                            "garage_user_modal_mot_bay_cleaning_log_tab_delete",
                            "garage_user_modal_qc_checkers_for_bikes_tab_create",
                            "garage_user_modal_qc_checkers_for_bikes_tab_read",
                            "garage_user_modal_qc_checkers_for_bikes_tab_update",
                            "garage_user_modal_qc_checkers_for_bikes_tab_delete"
                ];
                for (let i = 0; i < arr.length; i++) {
                        document.getElementById(arr[i]).checked = true
                    }
                }

                else if (event.target.classList.contains('data-launch-garage-user-modal-disable-all-privileges')) {
                    let arr = [
                            "garage_user_modal_garage_details_tab_read",
                            "garage_user_modal_garage_details_tab_update",
                            "garage_user_modal_garage_details_tab_delete",
                            "garage_user_modal_testers_tab_create",
                            "garage_user_modal_testers_tab_read",
                            "garage_user_modal_testers_tab_update",
                            "garage_user_modal_testers_tab_delete",
                            "garage_user_modal_mot_equipment_tab_create",
                            "garage_user_modal_mot_equipment_tab_read",
                            "garage_user_modal_mot_equipment_tab_update",
                            "garage_user_modal_mot_equipment_tab_delete",
                            "garage_user_modal_calibrations_tab_create",
                            "garage_user_modal_calibrations_tab_read",
                            "garage_user_modal_calibrations_tab_update",
                            "garage_user_modal_calibrations_tab_delete",
                            "garage_user_modal_reconciliations_tab_create",
                            "garage_user_modal_reconciliations_tab_read",
                            "garage_user_modal_reconciliations_tab_update",
                            "garage_user_modal_reconciliations_tab_delete",
                            "garage_user_modal_mot_site_audits_tab_create",
                            "garage_user_modal_mot_site_audits_tab_read",
                            "garage_user_modal_mot_site_audits_tab_update",
                            "garage_user_modal_mot_site_audits_tab_delete",
                            "garage_user_modal_qc_checkers_tab_create",
                            "garage_user_modal_qc_checkers_tab_read",
                            "garage_user_modal_qc_checkers_tab_update",
                            "garage_user_modal_qc_checkers_tab_delete",
                            "garage_user_modal_bookings_tab_create",
                            "garage_user_modal_bookings_tab_read",
                            "garage_user_modal_bookings_tab_update",
                            "garage_user_modal_bookings_tab_delete",
                            "garage_user_modal_defect_reports_tab_create",
                            "garage_user_modal_defect_reports_tab_read",
                            "garage_user_modal_defect_reports_tab_update",
                            "garage_user_modal_defect_reports_tab_delete",
                            "garage_user_modal_mot_bay_cleaning_log_tab_create",
                            "garage_user_modal_mot_bay_cleaning_log_tab_read",
                            "garage_user_modal_mot_bay_cleaning_log_tab_update",
                            "garage_user_modal_mot_bay_cleaning_log_tab_delete",
                            "garage_user_modal_qc_checkers_for_bikes_tab_create",
                            "garage_user_modal_qc_checkers_for_bikes_tab_read",
                            "garage_user_modal_qc_checkers_for_bikes_tab_update",
                            "garage_user_modal_qc_checkers_for_bikes_tab_delete"
                ];
                for (let i = 0; i < arr.length; i++) {
                        document.getElementById(arr[i]).checked = false
                    }
                }
                

                
                
                
                
                //// END OF GARAGE USERS SUBGRID LISTENERS

                

                else if (event.target.classList.contains('data-launch-create-new-mot-calibration-record')) {
                    this.showMotCalibrationModal()                
                }
                else if (event.target.classList.contains('data-launch-create-new-mot-site-audit-record')) {
                    this.showMotSiteAuditModal();
                }
                else if (event.target.classList.contains('data-launch-create-new-qc-checkers-record')) {
                    this.showQcCheckersModal();
                }
                else if (event.target.classList.contains('data-launch-create-new-booking-record')) {
                    this.showGarageBookingsModal()
                }
                else if (event.target.classList.contains('data-launch-create-new-defect-report-record')) {
                    this.showDefectReportsModal()
                }
                else if (event.target.classList.contains('data-launch-create-new-mot-bay-cleaning-record')) {
                    this.showMotBayCleaningLogModal()
                }            
                else if (event.target.classList.contains('data-launch-table-clickable-mot-site-audit-record')) {
                    let id = event.target.attributes["data-id"].value
                    this.showMotSiteAuditDetails(id);
                }

                else if (event.target.classList.contains('data_launch_garage_create_new_tester_modal_close_button')) {
                    document.getElementById('data_launch_garage_create_new_tester_modal_dialogue').classList.remove('active')
                    // // console.log('close down the new tester dialogue box')
                }

                

                else if (event.target.classList.contains('data_launch_garage_create_new_tester_modal_confirm_button')) {
                    let first = document.getElementById('data_launch_garage_create_new_tester_modal_testerFirstName').value
                    let last = document.getElementById('data_launch_garage_create_new_tester_modal_testerLastName').value
                    let phone = document.getElementById('data_launch_garage_create_new_tester_modal_testerPhone').value
                    let email = document.getElementById('data_launch_garage_create_new_tester_modal_testerEmail').value
                    let userId = document.getElementById('data_launch_garage_create_new_tester_modal_testerUserId').value
                    let obj = {
                        first_name: first,
                        last_name: last,
                        phone_number: phone,
                        email_address: email,
                        user_id: userId
                    }
                    this.secureAction('create', 'data_launch_tester_records', null, obj).then(
                        res => {
                            // // console.log('new tester record created successfully', res)
                            testersData.push(res)
                            let newData = { garage_id: parseInt(this.id), tester_id: res.id };
                            this.secureAction('create', 'tester_garages', null, newData).then(
                                    success => {
                                        document.getElementById('data_launch_garage_create_new_tester_modal_dialogue').classList.remove('active')
                                        document.getElementById('myGarageTesterModal').style.display = 'none'      
                                        this.injectDataIntoAssociatedTestersSubgrid();
                                        // // console.log('success', success)
                                    },
                                    err => {
                                        console.error('err', err)
                                    }
                            )
                        },
                        error => {
                            console.error(error)
                        }
                    )
                } 
                




    ////////////////// MOT EQUIPMENT HERE/////



                else if (event.target.classList.contains('data-launch-table-clickable-mot-equipment-row')) {
                    // let id = event.target.attributes["data-id"].value
                    // this.showMOt(id);
                }
                

                else if (event.target.classList.contains('mot-calibration-image-preview')) {
                    let src = event.target.attributes["src"].value
                    let isItImg = event.target.attributes["data-image"].value
                    if (isItImg === 'true') {
                        /// if the document selected is an image
                        document.getElementById(`garages-mot-calibration-img_${this.id}`).src = src
                        document.getElementById(`garages-mot-calibration-anchor_${this.id}`).href = src
                        document.getElementById(`garages-mot-calibration-img_${this.id}`).style.display = 'block'
                        document.getElementById(`garages-mot-calibration-filename_${this.id}`).style.display = 'none'
                        document.getElementById(`garages-mot-calibration-large-image-preview-window_${this.id}`).style.display = 'block'
                        document.getElementById(`garage-screen-overlay-${this.id}`).style.display = 'block'
                    }
                    else {
                        /// if the document selected is a document
                        let name = event.target.attributes["data-name"].value
                        document.getElementById(`garages-mot-calibration-img_${this.id}`).style.display = 'none'
                        document.getElementById(`garages-mot-calibration-anchor_${this.id}`).href = src
                        document.getElementById(`garages-mot-calibration-filename_${this.id}`).innerHTML = name                
                        document.getElementById(`garages-mot-calibration-large-image-preview-window_${this.id}`).style.display = 'block'
                        document.getElementById(`garage-screen-overlay-${this.id}`).style.display = 'block'
                    }       
                }

                else if (event.target.classList.contains('garages-mot-calibration-image-preview-window-close-button')) {
                    document.getElementById(`garage-screen-overlay-${this.id}`).style.display = 'none'
                    document.getElementById(`garages-mot-calibration-large-image-preview-window_${this.id}`).style.display = 'none'
                }

                else if (event.target.classList.contains('data-launch-subgrid-delete-document-item')) {
                    let fileKey = event.target.attributes["data-name"].value
                    let id =  event.target.attributes["data-id"].value                
                    deleteTheThing(fileKey)
                    this.secureAction('delete','data_launch_images', parseInt(id), null).then(
                        success => {
                            const row = event.target.closest('tr');
                            if (row) {
                                row.remove(); // Remove the row from the DOM
                            }
                        },
                        err => {
                            console.error(err)
                        }
                    )                
                }


                else if (event.target.classList.contains('data-launch-redirect-to-archive-system')) {
                    // // console.log('time to navigate to the old Archived VTS system')
                    window.open('https://crm.vtspro.co.uk/', '_blank')
                }


                ////// REMINDERS LISTENERS ////////

                else if (event.target.classList.contains('data-launch-create-new-reminder-record')) {
                    this.showGarageRemindersModal()
                }
                else if (event.target.classList.contains('data-launch-garage-reminders-close-btn')) {
                    document.getElementById('garageRemindersModalOverlay').style.display = 'none';  
                    document.getElementById('garageRemindersModal').style.display = 'none'; 
                }
                else if (event.target.classList.contains('data-launch-garage-reminders-submit-btn')) {
                    this.saveGarageRemindersRecord()
                }
                else if (event.target.classList.contains('data-launch-table-clickable-garage-reminder-record')) {
                    let id = event.target.attributes['data-id'].value
                    this.openGarageRemindersModalRecord(id)
                }
                else if (event.target.classList.contains('data-launch-subgrid-delete-garage-reminder-item')) {
                    let id = event.target.attributes["data-id"].value;
                    let delModal = document.getElementById('delModal');
                    delModal.classList.add('active');
                    document.getElementById('confirmDelete').setAttribute('data-id', id)
                    document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_garage_reminders')
                    document.getElementById('confirmDelete').setAttribute('data-element-id', 'custom')
                }
                
                else if (event.target.classList.contains('data-launch-garage-overdue-alert-acknowledgement-button')) {
                    document.getElementById('data-launch-garage-overdue-reminders-alert').style.display = 'none'
                }

                else if (event.target.classList.contains('prevWeekBtn')) {
                    this.garageBookingsSubgridClass.render(null, null, -1, 'garageBookings')
                }
                else if (event.target.classList.contains('nextWeekBtn')) {
                    this.garageBookingsSubgridClass.render(null, null, 1, 'garageBookings')
                }

                ///// END OF ALL REMINDERS LISTENERS (SUBGRID AND OVERDUE ALERTS) //////

                

                

                // ///// MOT calibration record //// 
                // else if (event.target.classList.contains('data-launch-mot-calibration-record-equipment-select')) {
                //     // console.log('OLD EVENT LISTENER (CLICK event listener) for data-launch-mot-calibration-record-equipment-select')
                //     let selectElement = document.getElementById("mot_equipment_type");
                //     let selectedIndex = selectElement.selectedIndex;
                //     let selectedOption = selectElement.options[selectedIndex];
                //     // console.log(selectedOption.value); // Logs the value of the selected option
                //     // console.log(selectedOption.text);  // Logs the text of the selected option
                //     // console.log('selectedOption', selectedOption)
                //     let make = selectedOption.attributes["data-make"].value
                //     let model = selectedOption.attributes["data-model"].value
                //     let serialNo = selectedOption.attributes["data-serial-no"].value
                //     let frequency = selectedOption.attributes["data-frequency"].value
                //     let bay = selectedOption.attributes["data-bay"].value
                //     document.getElementById('mot_make').value = make
                //     document.getElementById('mot_model').value = model
                //     document.getElementById('mot_serial_no').value = serialNo
                //     document.getElementById('mot_bay').value = bay
                //     // console.log('frequency is ', frequency)
                //     this.frequency = frequency
                //     document.getElementById('mot_calibration_recommended_frequency').value = `${this.frequency} Months`
                // }                 
                
                

    //////////////////////////////////////////////////////





                /// garage bay event listeners ////

                else if (event.target.classList.contains('data-launch-create-new-bay-record')) {
                    this.showGarageBayModal()           
                }

                else if (event.target.classList.contains('data-launch-garage-bays-close')) {
                    document.getElementById('garageBaysModal').style.display = 'none'
                }

                else if (event.target.classList.contains('data-launch-save-garage-bay-btn')) {
                    let bayName = document.getElementById('data-launch-garage-bay-modal-name-val').value;
                    let timeSegments = document.getElementById('data-launch-garage-bay-modal-mot-bay-select').value;
                    // // console.log('timeSegments', timeSegments)
                    if (bayName === '') {
                        this.showCRUDAlert('Please specify a Bay Name', 'error');
                        return
                    }
                    if (timeSegments === 'Choose Option') {
                        this.showCRUDAlert('Please specify a Time Segment', 'error');
                        return
                    }                
                    this.saveGarageBayRecord()   
                }

                
                else if (event.target.classList.contains('data-launch-table-clickable-garage-bay-record')) {
                    let id = event.target.attributes["data-id"].value
                    this.showGarageBayModalDetails(id)   
                }

                else if (event.target.classList.contains('data-launch-subgrid-delete-garage-bay-item')) {
                    let id = event.target.attributes["data-id"].value;
                    let delModal = document.getElementById('delModal');
                    delModal.classList.add('active');
                    document.getElementById('confirmDelete').setAttribute('data-id', id)
                    document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_bays')
                    document.getElementById('confirmDelete').setAttribute('data-element-id', `garageBay_${this.id}_${id}`)
                }

                
                


                ///// end of garage bay event listeners


                else if (event.target.classList.contains('data-launch-table-clickable-defect-report-record')) {
                    let id = event.target.attributes["data-id"].value
                    this.showDefectReportsDetails(id);                
                }
                else if (event.target.classList.contains('data-launch-table-clickable-mot-bay-cleaning-log-record')) {
                    let id = event.target.attributes["data-id"].value
                    this.showMotBayCleaningLogDetails(id);                
                }      
                else if (event.target.classList.contains('data-launch-table-clickable-garage-booking-record')) {
                    let id = event.target.attributes["data-id"].value
                    this.showGarageBookingsDetails(id);
                }
                else if (event.target.classList.contains('data-launch-table-clickable-garage-booking-record-duplicate')) {
                    let id = event.target.attributes["data-id"].value
                    this.duplicateGarageBooking(id);
                }
                else if (event.target.classList.contains('del-confirmation-modal__btn--cancelDuplicate')) {
                    document.getElementById('duplicateBookingModal').classList.remove('active')
                }
                else if (event.target.classList.contains('del-confirmation-modal__btn--confirmDuplicate')) {
                    document.getElementById('duplicateBookingModal').classList.remove('active')
                    let objToCopy;
                    console.log('this.garageBookingsData', this.garageBookingsData)
                    for (let i = 0; i < this.garageBookingsData.length; i++) {
                    if (parseInt(this.garageBookingsData[i].id) === parseInt(this.selectedDuplicateID)) {
                        objToCopy = this.garageBookingsData[i]
                        console.log('there is a match !!', objToCopy)
                    }                    
                    }
                    let newBooking = JSON.parse(JSON.stringify(objToCopy));
                    console.log('this.baysData', this.garageBayData)
                    let bayToUse = ''
                    let foundBay = false
                    this.garageBayData.forEach(bay => {
                        if (bay.mot_bay === 0) {
                            foundBay = true
                            bayToUse = bay.id
                        }
                    })
                    if (foundBay === false) {
                        this.showCRUDAlert('Error Creating Duplicate Booking.\n - Please Add a Non MOT Bay', 'error');
                    }
                    else {
                        delete newBooking.id
                        console.log('AFTER DELETION this.garageBookingsData', this.garageBookingsData)
                        newBooking.bay = bayToUse
                        this.secureAction('create', 'data_launch_garage_bookings', null, newBooking).then(res => {
                            console.log('duplicate booking create', res)
                            document.getElementById('duplicateBookingModal').classList.remove('active')
                            this.showCRUDAlert('Duplicate Booking Successfully Created', 'success');
                            this.garageBookingsData.push(res)
                            this.garageBookingsSubgridClass.render(null, this.garageBookingsData, 0, 'garageBookings')                
                        },
                        err => {
                            console.error('err', err)
                            document.getElementById('duplicateBookingModal').classList.remove('active')
                            this.showCRUDAlert('Error Creating Duplicate Booking \n Please contact your administrator', 'error');
                        })
                    }
                }
                
                else if (event.target.classList.contains('data-launch-table-clickable-qc-checker-record')) {
                    let id = event.target.attributes["data-id"].value
                    this.showQcCheckersDetails(id);
                }
                else if (event.target.classList.contains('data-launch-subgrid-delete-mot-site-audit-item')) {
                    let id = event.target.attributes["data-id"].value;
                    let delModal = document.getElementById('delModal');
                    delModal.classList.add('active');
                    document.getElementById('confirmDelete').setAttribute('data-id', id)
                    document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_mot_site_audits')
                    document.getElementById('confirmDelete').setAttribute('data-element-id', `motsiteaudit_${this.id}_${id}`)               
                }
                else if (event.target.classList.contains('data-launch-subgrid-delete-garage-booking-item')) {
                    let id = event.target.attributes["data-id"].value;
                    let delModal = document.getElementById('delModal');
                    delModal.classList.add('active');
                    document.getElementById('confirmDelete').setAttribute('data-id', id)
                    document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_garage_bookings')
                    // document.getElementById('confirmDelete').setAttribute('data-element-id', `garageBookings_${this.id}_${id}`)            
                    document.getElementById('confirmDelete').setAttribute('data-element-id', 'custom') 
                }
                else if (event.target.classList.contains('data-launch-subgrid-delete-garage-booking-item-bay-grid-view')) {
                    let id = event.target.attributes["data-id"].value;
                    let delModal = document.getElementById('delModal');
                    delModal.classList.add('active');
                    document.getElementById('confirmDelete').setAttribute('data-id', id)
                    document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_garage_bookings')
                    document.getElementById('confirmDelete').setAttribute('data-element-id', 'custom')            
                }            
                else if (event.target.classList.contains('data-launch-subgrid-delete-qc-checker-item')) {
                    let id = event.target.attributes["data-id"].value;
                    let delModal = document.getElementById('delModal');
                    delModal.classList.add('active');
                    document.getElementById('confirmDelete').setAttribute('data-id', id)
                    document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_qc_checkers_for_car')
                    document.getElementById('confirmDelete').setAttribute('data-element-id',`qccheckers_${this.id}_${id}`)               
                }
                else if (event.target.classList.contains('data-launch-subgrid-delete-defect-report-item')) {
                    let id = event.target.attributes["data-id"].value;
                    let delModal = document.getElementById('delModal');
                    delModal.classList.add('active');
                    document.getElementById('confirmDelete').setAttribute('data-id', id)
                    document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_defect_reports')
                    document.getElementById('confirmDelete').setAttribute('data-element-id', `defectReports_${this.id}_${id}`)              
                }
                else if (event.target.classList.contains('data-launch-mot-calibration-delete-item')) {
                    let id = event.target.attributes["data-id"].value;
                    let delModal = document.getElementById('delModal');
                    delModal.classList.add('active');
                    document.getElementById('confirmDelete').setAttribute('data-id', id)
                    document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_mot_calibration')
                    document.getElementById('confirmDelete').setAttribute('data-element-id', `motcalibration_${this.id}_${id}`)
                }

                else if (event.target.classList.contains('data-launch-garage-archive-garage-record')) {
                    let id = event.target.attributes["data-id"].value;
                    let delModal = document.getElementById('delModal');
                    delModal.classList.add('active');
                    document.getElementById('confirmDelete').setAttribute('data-id', id)
                    document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_garage_records')
                    document.getElementById('confirmDelete').setAttribute('data-element-id', `data-launch-garage-table-list-view-row-${id}`)
                } 


                
                else if (event.target.classList.contains('data-launch-subgrid-delete-mot-bay-cleaning-log-item')) {
                    let id = event.target.attributes["data-id"].value;
                    let delModal = document.getElementById('delModal');
                    delModal.classList.add('active');
                    document.getElementById('confirmDelete').setAttribute('data-id', id)
                    document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_mot_bay_cleaning_log')
                    document.getElementById('confirmDelete').setAttribute('data-element-id', `motBayCleaningLog_${this.id}_${id}`)
                } 
                else if (event.target.classList.contains('data-launch-table-clickable-mot-reconciliation-record')) {
                    let id = event.target.attributes["data-id"].value
                    this.showExistingMotReconciliationRecord(id)
                }
                else if (event.target.classList.contains('data-launch-submit-new-mot-reconciliation-modal')) {
                    let yearEl = document.getElementById('mot_reconciliation_dialogue_year')
                    let selectedIndexYear = yearEl.selectedIndex;
                    let year = yearEl.options[selectedIndexYear].value

                    let monthEl = document.getElementById('mot_reconciliation_dialogue_month')
                    let selectedIndexMonth = monthEl.selectedIndex;
                    let month = monthEl.options[selectedIndexMonth].value
                    document.getElementById('motReconciliationModal').style.display = 'none'
                    this.newMotReconciliationRecord(year, month)
                }
                else if (event.target.classList.contains('mot-reconciliation-new-record-close')) {
                    document.getElementById('motReconciliationModal').style.display = 'none'
                }            
                else if (event.target.classList.contains('data-launch-create-new-mot-reconciliation-record')) {
                    this.showNewMotReconciliationRecordModal()
                }
                else if (event.target.classList.contains('data-launch-table-clickable-mot-calibration-row')) {
                    let id = event.target.attributes["data-id"].value
                    this.showMotCalibrationDetails(id);
                }
                else if (event.target.classList.contains('data-launch-upload-garages-mot-calibration-document')) {
                    const fileInput = document.getElementById(`fileInput_${this.id}`);
                    fileInput.value = ''
                    document.getElementById('garages-document-upload-popup-window').classList.add('active')
                }
                else if (event.target.classList.contains('garage-mot-calibration-new-document-window-v2-close-button')) {
                    document.getElementById('garages-document-upload-popup-window').classList.remove('active');
                }
                else if (event.target.classList.contains('garages-document-upload-button')) {
                    event.preventDefault();  // Prevent form submission and page reload
                    document.getElementById('garages-document-upload-popup-window').classList.remove('active');
                    const fileInput = document.getElementById(`fileInput_${this.id}`);
                    const formData = new FormData();
                    formData.append('file', fileInput.files[0]);
                    
                    // Make this section async since we're using await
                    (async () => {
                    try {
                        const response = await fetch('/upload', {
                        method: 'POST',
                        body: formData
                        });
                
                        const result = await response.json();  // Parse the JSON response
                        // // console.log('Upload result:', result);  // Log the returned metadata
                        
                        if (response.ok) {
                        this.showCRUDAlert('Thank you. \n File uploaded successfully!', 'success');
                        // Use other metadata as needed
                        let imgObj = {
                            name: result.fileName,
                            record_id: this.motCalibrationId,
                            record_type: 'garage_mot_calibration',
                            garage_id: this.id,
                            etag: result.etag,
                            url: result.previewUrl
                        }
                        this.secureAction('create', 'data_launch_images', null, imgObj).then(
                            result => {
                                // // console.log('data launch images table record created successfully', result)
                                let html = `
                                <tr>
                                    <td>${result.name.substring(0, 20)}</td>`
                                let fileType = result.name.split('.').pop();
                                if (fileType === 'txt') {
                                    html += `
                                    <td>
                                        <svg data-name="${result.name}" src="${result.url}" data-image="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-txt mot-calibration-image-preview" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-2v-1h2a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.928 15.849v-3.337h1.136v-.662H0v.662h1.134v3.337zm4.689-3.999h-.894L4.9 13.289h-.035l-.832-1.439h-.932l1.228 1.983-1.24 2.016h.862l.853-1.415h.035l.85 1.415h.907l-1.253-1.992zm1.93.662v3.337h-.794v-3.337H6.619v-.662h3.064v.662H8.546Z"/>
                                        </svg>
                                    </td>
                                    `
                                }
                                else if (fileType === 'xls') {
                                    html += `
                                    <td>
                                        <svg data-name="${result.name}" src="${result.url}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-xls mot-calibration-image-preview" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM6.472 15.29a1.2 1.2 0 0 1-.111-.449h.765a.58.58 0 0 0 .254.384q.106.073.25.114.143.041.319.041.246 0 .413-.07a.56.56 0 0 0 .255-.193.5.5 0 0 0 .085-.29.39.39 0 0 0-.153-.326q-.152-.12-.462-.193l-.619-.143a1.7 1.7 0 0 1-.539-.214 1 1 0 0 1-.351-.367 1.1 1.1 0 0 1-.123-.524q0-.366.19-.639.19-.272.527-.422.338-.15.777-.149.457 0 .78.152.324.153.5.41.18.255.2.566h-.75a.56.56 0 0 0-.12-.258.6.6 0 0 0-.247-.181.9.9 0 0 0-.369-.068q-.325 0-.513.152a.47.47 0 0 0-.184.384q0 .18.143.3a1 1 0 0 0 .405.175l.62.143q.326.075.566.211a1 1 0 0 1 .375.358q.135.222.135.56 0 .37-.188.656a1.2 1.2 0 0 1-.539.439q-.351.158-.858.158-.381 0-.665-.09a1.4 1.4 0 0 1-.478-.252 1.1 1.1 0 0 1-.29-.375m-2.945-3.358h-.893L1.81 13.37h-.036l-.832-1.438h-.93l1.227 1.983L0 15.931h.861l.853-1.415h.035l.85 1.415h.908L2.253 13.94zm2.727 3.325H4.557v-3.325h-.79v4h2.487z"/>
                                        </svg>
                                    </td>
                                    
                                    `
                                }
                                else if (fileType === 'xlsx') {
                                    html += `
                                    <td>
                                        <svg data-name="${result.name}" src="${result.url}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-xlsx mot-calibration-image-preview" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z"/>
                                        </svg>
                                    </td>
                                    
                                    `
                                }
                                else if (fileType === 'pdf') {
                                    html += `
                                    <td>
                                    <svg data-name="${result.name}" src="${result.url}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-pdf mot-calibration-image-preview" viewBox="0 0 16 16">
                                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                                        <path d="M4.603 14.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.7 11.7 0 0 0-1.997.406 11.3 11.3 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.245.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 7.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z"/>
                                    </svg>
                                    </td>                                
                                    `
                                }
                                else if (fileType === 'csv') {
                                    html += `
                                    <td>
                                        <svg data-name="${result.name}" src="${result.url}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-csv mot-calibration-image-preview" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM3.517 14.841a1.13 1.13 0 0 0 .401.823q.195.162.478.252.284.091.665.091.507 0 .859-.158.354-.158.539-.44.187-.284.187-.656 0-.336-.134-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.566-.21l-.621-.144a1 1 0 0 1-.404-.176.37.37 0 0 1-.144-.299q0-.234.185-.384.188-.152.512-.152.214 0 .37.068a.6.6 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.2-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.439 0-.776.15-.337.149-.527.421-.19.273-.19.639 0 .302.122.524.124.223.352.367.228.143.539.213l.618.144q.31.073.463.193a.39.39 0 0 1 .152.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.167.07-.413.07-.175 0-.32-.04a.8.8 0 0 1-.248-.115.58.58 0 0 1-.255-.384zM.806 13.693q0-.373.102-.633a.87.87 0 0 1 .302-.399.8.8 0 0 1 .475-.137q.225 0 .398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.4 1.4 0 0 0-.489-.272 1.8 1.8 0 0 0-.606-.097q-.534 0-.911.223-.375.222-.572.632-.195.41-.196.979v.498q0 .568.193.976.197.407.572.626.375.217.914.217.439 0 .785-.164t.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.8.8 0 0 1-.118.363.7.7 0 0 1-.272.25.9.9 0 0 1-.401.087.85.85 0 0 1-.478-.132.83.83 0 0 1-.299-.392 1.7 1.7 0 0 1-.102-.627zm8.239 2.238h-.953l-1.338-3.999h.917l.896 3.138h.038l.888-3.138h.879z"/>
                                        </svg>
                                    </td>                                
                                    `
                                }
                                else {
                                    html += `
                                    <td>
                                        <img data-image="true" class='mot-calibration-image-preview' style='height: 50px; width: 50px;' src="${result.url}">
                                    </td>
                                    `
                                }
                                html += `                            
                                    <td><i class="bi bi-trash data-launch-subgrid-delete-document-item" data-name='${result.name}' data-id='${result.id}'></i></td>  
                                </tr>
                                `
                                document.getElementById(`garageMotCalibrationsDocumentsTableBody_${this.id}`).innerHTML += html
                            },
                            error => {
                                console.error(error)
                            }
                        )
                        //   // console.log('ETag:', result.etag);  // ETag
                        //   // console.log('File Key in S3:', result.key);  // File name used in S3
                        } else {
                        this.showCRUDAlert('File Uploaded Failed \n Please try again or contact your administrator', 'error');
                        }
                    } catch (error) {
                        console.error('Error uploading file:', error);
                        this.showCRUDAlert('File Uploaded Failed \n Please try again or contact your administrator', 'error');
                    }
                    })();
                }              
                else if (event.target.classList.contains('mot-save-audit-btn')) {
                    this.saveNewMotAuditRecord()
                    document.getElementById('motSiteAuditModal').style.display = 'none'
                }
                else if (event.target.classList.contains('data-launch-save-qc-checkers-btn')) {
                    this.saveNewQcCheckersRecord()
                    document.getElementById('qcCheckerModal').style.display = 'none'
                }
                else if (event.target.classList.contains('data-launch-save-site-audit-btn')) {
                    this.saveNewMotAuditRecord()
                    document.getElementById('motSiteAuditModal').style.display = 'none'
                }
                else if (event.target.classList.contains('data-launch-save-garage-bookings-btn')) {
                    let proceed = this.bookingDataValidation()
                    // // console.log('proceed', proceed)
                    if (proceed === true) {
                        document.getElementById('garageBookingModal').style.display = 'none';
                        this.saveNewGarageBookingRecord()
                    }               
                }
                else if (event.target.classList.contains('data-launch-save-mot-bay-cleaning-log-btn')) {
                    document.getElementById('motBayCleaningLogModal').style.display = 'none'
                    this.saveNewMotBayCleaningLogRecord()                
                }            
                else if (event.target.classList.contains('data-launch-garage-modal-close')) {
                    document.getElementById('garageBookingModal').style.display = 'none'              
                }
                else if (event.target.classList.contains('defect-report-close')) {
                    document.getElementById('defectReportModal').style.display = 'none'              
                }
                else if (event.target.classList.contains('garage-booking-close')) {
                    document.getElementById('garageBookingModal').style.display = 'none'              
                }          
                else if (event.target.classList.contains('mot-bay-cleaning-log-close')) {
                    document.getElementById('motBayCleaningLogModal').style.display = 'none'              
                }
                else if (event.target.classList.contains('data-launch-save-defect-report-btn')) {
                    document.getElementById('defectReportModal').style.display = 'none'
                    this.saveNewDefectReportsRecord()               
                }
                else if (event.target.classList.contains('qc-checker-close')) {
                    document.getElementById('qcCheckerModal').style.display = 'none'              
                }              
                else if (event.target.classList.contains('mot-site-audit-close')) {
                    document.getElementById('motSiteAuditModal').style.display = 'none'
                }
                else if (event.target.classList.contains('mot-calibration-close')) {
                    document.getElementById('motCalibrationModal').style.display = 'none'
                }
                else if (event.target.classList.contains('data-launch-save-mot-calibration-btn')) {
                    document.getElementById('motCalibrationModal').style.display = 'none'
                    this.saveNewMotCalibration()               
                }
                else if (event.target.classList.contains('data-launch-subgrid-delete-mot-equipment-item')) {
                    let id = event.target.attributes["data-id"].value;
                    let delModal = document.getElementById('delModal');
                    delModal.classList.add('active');
                    document.getElementById('confirmDelete').setAttribute('data-id', id)
                    document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_mot_equipment')
                    document.getElementById('confirmDelete').setAttribute('data-element-id', `garage_mot_equipment_${this.id}_${id}`)
                }  
                else if (event.target.classList.contains('data-launch-filter-icon')) {
                    // // console.log('is this toggling the filter container?')
                    document.getElementById('data-launch-garage-filter-container').classList.toggle('data-launch-inactive')
                }
                else if (event.target.classList.contains('data-launch-create-new-mot-equipment-record')) {
                    // // console.log('data-launch-create-new-mot-equipment-record', 'creating new MOT Equipment record')
                    this.openMotEquipmentModal()
                }
                else if (event.target.classList.contains('data-launch-mot-equipment-close-button')) {
                    this.closeMotEquipmentModal()
                }
                else if (event.target.classList.contains('data-launch-save-mot-equipment')) {
                    this.saveNewMotEquipment()
                }  
                else if (event.target.classList.contains('data-launch-fetch-car-details')) {
                    (async () => {
                        try {
                            let vehicleReg = document.getElementById('vehicleReg').value;
                            vehicleReg = vehicleReg.replace(/\s/g, ""); // Removes spaces on input
                            document.getElementById('vehicleReg').value = vehicleReg
                            document.getElementById('motDueDate').value = ''
                            const vehicleDetails = await this.fetchCarDetailsMotBooking(vehicleReg);
                            console.log('vehicleDetails', vehicleDetails)
                            if (vehicleDetails) {
                                document.getElementById('vehicleMake').value = vehicleDetails.make
                                document.getElementById('vehicleModel').value = vehicleDetails.model
                                document.getElementById('vehicleBookingVIN').value = vehicleDetails.vin
                            }
                            let vehicleMeta = await this.fetchDVSAMeta(vehicleReg)
                            if (vehicleMeta) {
                                console.log('reg number', vehicleReg)
                                // console.log('vehicle meta', vehicleMeta)
                                if (vehicleMeta.motTests.length > 0) {
                                    let expiryDate = vehicleMeta.motTests[0].expiryDate
                                    console.log('expiryDate', expiryDate)
                                    document.getElementById('motDueDate').value = expiryDate
                                }
                            }
                        } catch (error) {
                            console.error("Error fetching vehicle details:", error);
                        }
                    })(); // Immediately Invoked Function Expression (IIFE)
                }
                
                else if (event.target.classList.contains('data-launch-associate-new-tester-record')) {
                    // // console.log('add a new tester record to the garage')
                    // this is where this button code is invoked from ///
                    this.openTesterModal();
                }
                else if (event.target.classList.contains('data-launch-open-tester-record-from-garage-testers-subgrid')) {
                    // // console.log('should be opening the tester record about now')
                    if (user_FULL_USER === "1") {
                        let testerId = event.target.attributes["data-tester-id"].value
                        // // console.log('testerId is ', testerId)
                        changePage(null, testerId, 'testerRecords')
                    }
                    else {
                        document.getElementById('elevated-security-modal').classList.remove('hidden')
                    }
                }
                else if (event.target.classList.contains('data-launch-subgrid-delete-item')) {
                    let id = event.target.attributes["data-id"].value;
                    let delModal = document.getElementById('delModal');
                    delModal.classList.add('active');
                    document.getElementById('confirmDelete').setAttribute('data-id', id)
                    document.getElementById('confirmDelete').setAttribute('data-table', 'tester_garages')
                    document.getElementById('confirmDelete').setAttribute('data-element-id', 'custom')
                }

                else if (event.target.classList.contains('data-launch-subgrid-delete-mot-reconcilation-item')) {
                    let id = event.target.attributes["data-id"].value;
                    let delModal = document.getElementById('delModal');
                    delModal.classList.add('active');
                    document.getElementById('confirmDelete').setAttribute('data-id', id)
                    document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_mot_reconciliations')
                    document.getElementById('confirmDelete').setAttribute('data-element-id', 'custom')
                }

                
                else if (event.target.classList.contains("data-launch-acknowledge-button")) {
                    document.getElementById(`${event.target.attributes["data-id"].value}`).style.display = 'none'
                    let specialNoticeID = event.target.attributes["data-special-notice-id"].value
                    // // console.log('specialNoticeID', specialNoticeID)
                    // // console.log('userID', user_ID)
                    let obj = {
                        special_notice_id: specialNoticeID,
                        user_id: user_ID,
                        acknowledged_on: new Date()
                    }
                    this.secureAction('create', 'data_launch_special_notices_acknowledgements', null, obj).then(
                        success => {
                            // // console.log('special notice acknowledgement created successfully ', success)
                        },
                        error => {
                            console.error(error)
                        }
                    )
                    // const notice = event.target.closest(".data-launch-special-notice-container");
                    // notice.classList.remove("active");
                }
                else if (event.target.classList.contains('data-launch-table-reset-all-filters')) {
                    this.filterResetAll()
                }
                else if (event.target.classList.contains('data-launch-send-user-login-details-email')) {
                    let username = document.getElementById('garage_user_modal_email').value;
                    let firstname = document.getElementById('garage_user_modal_first_name').value;
                    let lastname = document.getElementById('garage_user_modal_last_name').value;
                    this.sendLoginDetailsToEmail(firstname, lastname, username)
                }
                else if (event.target.classList.contains('data-launch-garage-mot-calibration-record-click')) {
                    // // console.log('clicked an item in the MOT Calibration subgrid')
                    let motCalId = event.target.attributes["data-launch-mot-cal-id"].value
                    let vtsId = event.target.attributes["data-launch-vts-id"].value
                    document.getElementById('garagePageScreenOverlay').style.display = 'block'
                    document.getElementById('data-launch-page-navbar').style.backgroundColor = 'lightgrey'                     
                    this.openMotCalibrationForm(motCalId, vtsId)
                }
                else if (event.target.classList.contains('data-launch-modal-close-window')) {
                    this.closeModal()
                }
                else if (event.target.classList.contains('data-launch-table-garages-new-record')) {
                    // // console.log('clicked new record')
                    this.openForm(false)
                }
                else if (event.target.classList.contains('data-launch-send-sms')) {
                    this.sendSMS()
                }
                else if (event.target.classList.contains('data-launch-nav-menu-plus-icon')) {
                    this.openForm(false)
                }       
                else if (event.target.classList.contains('data-launch-associated-new-garage-record')) {
                    this.openAssociateNewGarageWindow()
                }

                else if (event.target.classList.contains('garage-record-associated-garages-close')) {
                    document.getElementById('associateNewGarageRecordsModal').classList.remove('active')
                }
                else if (event.target.classList.contains('data-launch-garage-associate-new-garage-ok')) {
                    document.getElementById('associateNewGarageRecordsModal').classList.remove('active')
                    /// associate this record with the garage
                    // // console.log('this.selectedGarageIDToAssociate', this.selectedGarageIDToAssociate)
                    let existingGarages = this.currentGarageRecord.child_garage_ids
                    if (existingGarages === null || existingGarages === undefined) {
                        // // console.log('existing garages are NULL LIAM LIAM', existingGarages)
                        let associatedGaragesString = JSON.stringify([parseInt(this.selectedGarageIDToAssociate)])
                        this.currentGarageRecord.child_garage_ids = [parseInt(this.selectedGarageIDToAssociate)]
                        for (let i = 0; i < this.data.length; i++) {
                            if (this.data[i].id === parseInt(this.id)) {
                                this.data[i].child_garage_ids = [parseInt(this.selectedGarageIDToAssociate)]
                            }        
                        }
                        for (let i = 0; i < garageData.length; i++) {
                            if (garageData[i].id === parseInt(this.id)) {
                                garageData[i].child_garage_ids = [parseInt(this.selectedGarageIDToAssociate)]
                            }        
                        }
                        this.secureAction('update', 'data_launch_garage_records', this.id, {child_garage_ids: associatedGaragesString}).then(res => {
                            // // console.log('res update GARAGE RECORD AFTER GARAGE ASSOCIATIONS LIAM LIAM LIAM', res)                        
                        }, err => {
                            console.error(err)
                        })
                    }
                    else {
                        // // console.log('existing garages are NOT NULL', existingGarages)
                        let arr = existingGarages
                        arr.push(parseInt(this.selectedGarageIDToAssociate))
                        let associatedGaragesString = JSON.stringify(arr)
                        this.currentGarageRecord.child_garage_ids = arr
                        for (let i = 0; i < this.data.length; i++) {
                            if (this.data[i].id === parseInt(this.id)) {
                                this.data[i].child_garage_ids = arr
                            }        
                        }
                        for (let i = 0; i < garageData.length; i++) {
                            if (garageData[i].id === parseInt(this.id)) {
                                garageData[i].child_garage_ids = arr
                            }        
                        }
                        this.secureAction('update', 'data_launch_garage_records', this.id, {child_garage_ids: associatedGaragesString}).then(res => {
                            // // console.log('res update GARAGE RECORD AFTER GARAGE ASSOCIATIONS LIAM LIAM LIAM', res)                        
                        }, err => {
                            console.error(err)
                        })
                    }               
                }
                

                else if (event.target.classList.contains('data-launch-associate-garage-modal-popup-select-tr')) {
                    let val = event.target.attributes["data-val"].value
                    this.selectedGarageIDToAssociate = event.target.attributes["data-garage-id"].value
                    let arr = Array.from(document.getElementsByClassName('data-launch-associate-garage-modal-popup-select-tr'))
                    arr.forEach(el => {
                        if (el.classList.contains('active-row')) {
                            el.classList.remove('active-row')
                        }
                    })
                    document.getElementById(`${val}_row`).classList.add('active-row')
                }
                
                else if (event.target.classList.contains('data-launch-tabs-clickable-garages')) {
                    let x = Array.from(document.getElementsByClassName('data-launch-garages-screen'))
                    x.forEach(el => {
                        if (el.classList.contains('active')) {
                            el.classList.remove('active')
                        }
                    })
                    let y = Array.from(document.getElementsByClassName('data-launch-tabs-clickable-garages'))
                    y.forEach(el => {
                        if (el.classList.contains('active')) {
                            el.classList.remove('active')
                        }
                    })
                    let z = Array.from(document.getElementsByClassName('data-launch-tabs-parent-li-garages'))
                    z.forEach(el => {
                        if (el.classList.contains('active')) {
                            el.classList.remove('active')
                        }
                    })
                    // // console.log('event.target was here liam', event)
                    let page = event.target.attributes["data-launch-menu-item"].value
                    document.getElementById(`garages_parent_li_${page}`).classList.add('active')
                    document.getElementById(`data-launch-garages-${page}`).classList.add('active')
                    document.getElementById(`data-launch-garage-${this.id}-what-tab`).innerHTML = page
                    this.sideBarToggle()
                }
                else if (event.target.classList.contains('data-launch-save-close-record')) {
                    // // console.log('save close record selected')
                    this.saveAndClose()
                }
                else if (event.target.classList.contains('data-launch-record-back-to-list-view')) {
                    this.saveAndClose()
                }            
                else if (event.target.classList.contains('data-launch-save-record')) {
                    // // console.log('save record selected')
                    this.saveRecord()
                }
                else if (event.target.classList.contains('data-launch-export-records')) {
                    // console.log('export selected')
                    this.export()
                }
                else if (event.target.classList.contains('data-launch-close-modal-popup')) {
                    // console.log('close modal popup')
                }

                /// car tqi listeners
                else if  (event.target.classList.contains('data-launch-car-tqi-modal-close')) {
                    document.getElementById(`cartqiPageModalPopup_${this.id}`).style.display = 'none'
                }

                else if  (event.target.classList.contains('data-launch-create-new-tqi-record')) {
                    this.carTqiDataToSubmit = []
                    this.tqiData = []
                    this.importCarTQIFile()
                }
                
                else if (event.target.classList.contains('data-launch-table-clickable-tqi-record')) {
                    let tqiID = parseInt(event.target.attributes["data-id"].value)
                    let obj = {}
                    this.tqiData.forEach(row => {
                        if (row.id === tqiID) {
                            obj = row.data
                        }
                    })
                    // // console.log('scally', obj)
                    this.openModal(obj, true)
                }
                else if (event.target.classList.contains('data-launch-upload-car-tqi-file')) {
                    // // console.log('hit here,,,,, data-launch-upload-car-tqi-files')
                    this.importCarTQI()
                }
            })
            document.getElementById('garagePage').addEventListener('change', (event) => {
                if (event.target.classList.contains('data-launch-filter-search') && event.target.value !== '') {
                    let header = event.target.attributes["data-launch-header"].value
                    let value = event.target.value
                    this.filterApply(header,value)
                }
                else if (event.target.classList.contains('data-launch-filter-search') && event.target.checked === true) {
                    let header = event.target.attributes["data-launch-header"].value
                    let value = event.target.checked
                    this.filterApply(header,value)
                }
                else if (event.target.classList.contains('garage-bookings-start-time')) {
                    // // console.log('event.target time changed ? ' , event.target)
                    // // console.log('event.target.value', event.target.value)
                    let baySelector = document.getElementById('garageBookingsBay')
                    let selectedIndex = baySelector.selectedIndex;
                    let selectedOption = baySelector.options[selectedIndex];
                    let selectedBayValue = selectedOption.value
                    // // console.log('selectedBayValue', selectedBayValue)
                    // // console.log('this.garageBayData' , this.garageBayData)
                    if (selectedBayValue === '') {
                        this.showCRUDAlert(`Please Specify A Bay For The Booking`, 'error')
                        // document.getElementById('bookingDate').style.backgroundColor = 'white'
                        // document.getElementById('timeEnd').style.backgroundColor = 'red'
                        // document.getElementById('timeStart').style.backgroundColor = 'white'
                        document.getElementById('garageBookingsBay').style.backgroundColor = 'red'
                        setTimeout(() => {
                            document.getElementById('garageBookingsBay').style.backgroundColor = 'white'
                        }, 3000);
                        event.target.value = ''
                    }
                    else {
                        let bayTimeSegment = 60
                        this.garageBayData.forEach(bay => {
                            if (bay.id === parseInt(selectedBayValue)) {
                                bayTimeSegment = bay.time_segments
                            }
                        })
                        // Example Usage:
                        let startTime = event.target.value
                        let endTime = this.addMinutesToTime(startTime, bayTimeSegment);
                        // // console.log(`Start Time: ${startTime}, End Time: ${endTime}`);
                        document.getElementById('timeEnd').value = endTime
                        document.getElementById('timeEnd').style.backgroundColor = 'yellow'
                        setTimeout(() => {
                            document.getElementById('timeEnd').style.backgroundColor = 'white'
                        }, 2000);
                    }
                }
                else if (event.target.classList.contains('data-launch-filter-search') && event.target.value === '') {
                    let header = event.target.attributes["data-launch-header"].value
                    // // console.log('values empty apparently')
                    let value = event.target.value
                    this.filterRemove(header,value)
                }
                else if (event.target.classList.contains('qc-checker-for-group-b-tester-select')) {
                    // // console.log('qc-checker-for-group-b-tester-select')
                    let selectedOption = event.target.options[event.target.selectedIndex];
                    // Get attribute values
                    let testerValueSelected = selectedOption.value;  // The value of the option
                    let testerID = selectedOption.getAttribute("data-tester-id"); // Custom attribute            
                    // // console.log("Value:", testerValueSelected);
                    // // console.log("Text:", testerID);
                    document.getElementById('testerID').value = testerID
                }
                else if (event.target.classList.contains('data_launch_qc_checkers_for_group_a_tester_selector')) {
                    // // console.log('data_launch_qc_checkers_for_group_a_tester_selector')
                    let selectedOption = event.target.options[event.target.selectedIndex];
                    // Get attribute values
                    let testerValueSelected = selectedOption.value;  // The value of the option
                    let testerID = selectedOption.getAttribute("data-tester-id"); // Custom attribute            
                    // // console.log("Value:", testerValueSelected);
                    // // console.log("Text:", testerID);
                    document.getElementById('data_launch_qc_checkers_for_cars_testerID').value = testerID
                }
                else if (event.target.classList.contains('mot-calibration-modal-calibration-date-field')) {
                    // // console.log('this.frequency ? ', this.frequency)
                    let calibrationDate = event.target.value
                    // // console.log('calibrationDate GOING IN ', calibrationDate)
                    let proposedExpiryDate = this.addMonthsToDate(calibrationDate, parseInt(this.frequency))
                    // // console.log('calibrationDate cOMING OUT ', proposedExpiryDate)
                    document.getElementById('mot_calibration_expiry_date').value = proposedExpiryDate
                    document.getElementById('mot_calibration_expiry_date').classList.add("highlight");
                    setTimeout(() => document.getElementById('mot_calibration_expiry_date').classList.remove("highlight"), 4000);
                }
                else if (event.target.classList.contains('mot-equipment-last-service-date')) {
                    let calibrationDate = event.target.value
                    // // console.log('calibrationDate', calibrationDate)
                    let frequencyEl = document.getElementById(`mot_equipment_calibration_frequency_${this.id}`)
                    let selectedIndex = frequencyEl.selectedIndex;
                    let frequency = frequencyEl.options[selectedIndex].value
                    // // console.log('frequency', frequency)
                    let proposedExpiryDate = this.addMonthsToDate(calibrationDate, parseInt(frequency))
                    document.getElementById(`mot_equipment_next_service_date_${this.id}`).value = proposedExpiryDate
                    document.getElementById(`mot_equipment_next_service_date_${this.id}`).classList.add("highlight");
                    setTimeout(() => document.getElementById(`mot_equipment_next_service_date_${this.id}`).classList.remove("highlight"), 4000);
                }
                else if (event.target.classList.contains('data-launch-garage-reminders-subgrid-number-of-rows-filter')) {
                    // // console.log('reminder rows filter selected', event.target)
                    // // console.log('this.rows', this.rows)
                    let selectElement = document.getElementById(`data-launch-garage-reminders-subgrid-number-of-rows-filter_${this.id}`)
                    let selectedIndex = selectElement.selectedIndex;
                    let selectedOption = selectElement.options[selectedIndex];
                    // // console.log(selectedOption.value); // Logs the value of the selected option
                    if (selectedOption.value === 'Within 30 Days') {
                        this.remindersSubgridClassInstantiated.render('30 Days')
                    }
                    else if (selectedOption.value === 'Within 60 Days') {
                        this.remindersSubgridClassInstantiated.render('60 Days')    
                    }
                    else if (selectedOption.value === 'All Dates') {
                        this.remindersSubgridClassInstantiated.render('All Dates')    
                    }
                }
                else if (event.target.classList.contains('data-launch-field-editable')) {
                    // // console.log('change event', event)
                    let field = event.target.attributes["data-launch-field"].value
                    this.data.forEach(row=> {
                        if (row.id === this.id) {
                            // // console.log('updating data ???', event.target.value)
                            row[field] = event.target.value
                        }
                    })
                }
                else if (event.target.classList.contains('data-launch-bookings-subgrid-grid-type-select-element')) {
                    let selectElement = document.getElementById(`data-launch-bookings-subgrid-grid-type-select-element_${this.id}`)
                    let selectedIndex = selectElement.selectedIndex;
                    let selectedOption = selectElement.options[selectedIndex];
                    let value = selectedOption.value
                    // // console.log('data-launch-bookings-subgrid-grid-type-select-element - BOOKINGS GRID - selected Option', value)
                    this.garageBookingsSubgridClass.render('All Dates', this.garageBookingsData, value)
                }
            }, true)


            //// ALL OF THE ON CHANGE EVENT LISTENERS HAVE TO BE COPIED INTO THIS SECTION BELOW
            ///// WHICH IS SPECIFICALLY FOR ONCHANGE LISTENERS FOR SAFARI AND MAC OS USERS
            ///// AS tHE STANDARD ONCHANGE or CHANGE EVENT DOESN"T SEEM TO FIRE CORRECTLY

            document.getElementById('garagePage').addEventListener('input', (event) => {
                if (event.target.classList.contains('data-launch-filter-search') && event.target.value !== '') {
                    let header = event.target.attributes["data-launch-header"].value
                    let value = event.target.value
                    this.filterApply(header,value)
                }
                else if (event.target.classList.contains('data-launch-filter-search') && event.target.checked === true) {
                    let header = event.target.attributes["data-launch-header"].value
                    let value = event.target.checked
                    this.filterApply(header,value)
                }
                else if (event.target.classList.contains('data-launch-filter-search') && event.target.value === '') {
                    let header = event.target.attributes["data-launch-header"].value
                    // // console.log('values empty apparently')
                    let value = event.target.value
                    this.filterRemove(header,value)
                }
                else if (event.target.classList.contains('data-launch-garage-global-filter-input')) {
                    // alert('being triggered')
                    this.globalFilter(event)
                }
                else if (event.target.classList.contains('mot-calibration-modal-calibration-date-field')) {
                    // // console.log('this.frequency ? ', this.frequency)
                    let calibrationDate = event.target.value
                    // // console.log('calibrationDate GOING IN ', calibrationDate)
                    let proposedExpiryDate = this.addMonthsToDate(calibrationDate, parseInt(this.frequency))
                    // // console.log('calibrationDate cOMING OUT ', proposedExpiryDate)
                    document.getElementById('mot_calibration_expiry_date').value = proposedExpiryDate
                    document.getElementById('mot_calibration_expiry_date').classList.add("highlight");
                    setTimeout(() => document.getElementById('mot_calibration_expiry_date').classList.remove("highlight"), 4000);
                }
                else if (event.target.classList.contains('mot-equipment-last-service-date')) {
                    let calibrationDate = event.target.value
                    // // console.log('calibrationDate', calibrationDate)
                    let frequencyEl = document.getElementById(`mot_equipment_calibration_frequency_${this.id}`)
                    let selectedIndex = frequencyEl.selectedIndex;
                    let frequency = frequencyEl.options[selectedIndex].value
                    // console.log('frequency', frequency)
                    let proposedExpiryDate = this.addMonthsToDate(calibrationDate, parseInt(frequency))
                    document.getElementById(`mot_equipment_next_service_date_${this.id}`).value = proposedExpiryDate
                    document.getElementById(`mot_equipment_next_service_date_${this.id}`).classList.add("highlight");
                    setTimeout(() => document.getElementById(`mot_equipment_next_service_date_${this.id}`).classList.remove("highlight"), 4000);
                }
                else if (event.target.classList.contains('data-launch-garage-reminders-subgrid-number-of-rows-filter')) {
                    // console.log('reminder rows filter selected', event.target)
                    // console.log('this.rows', this.rows)
                    let selectElement = document.getElementById(`data-launch-garage-reminders-subgrid-number-of-rows-filter_${this.id}`)
                    let selectedIndex = selectElement.selectedIndex;
                    let selectedOption = selectElement.options[selectedIndex];
                    // console.log(selectedOption.value); // Logs the value of the selected option
                    if (selectedOption.value === 'Next 30 Days') {
                        this.remindersSubgridClassInstantiated.render('30 Days')
                    }
                    else if (selectedOption.value === 'Next 60 Days') {
                        this.remindersSubgridClassInstantiated.render('60 Days')    
                    }
                    else if (selectedOption.value === 'All Dates') {
                        this.remindersSubgridClassInstantiated.render('All Dates')    
                    }
                }
                else if (event.target.classList.contains('data-launch-field-editable')) {
                    // console.log('change event', event)
                    let field = event.target.attributes["data-launch-field"].value
                    this.data.forEach(row=> {
                        if (row.id === this.id) {
                            // console.log('updating data ???', event.target.value)
                            row[field] = event.target.value
                        }
                    })
                }
                else if (event.target.classList.contains('data-launch-bookings-subgrid-grid-type-select-element')) {
                    let selectElement = document.getElementById(`data-launch-bookings-subgrid-grid-type-select-element_${this.id}`)
                    let selectedIndex = selectElement.selectedIndex;
                    let selectedOption = selectElement.options[selectedIndex];
                    let value = selectedOption.value
                    // console.log('data-launch-bookings-subgrid-grid-type-select-element - BOOKINGS GRID - selected Option', value)
                    this.garageBookingsSubgridClass.render('All Dates', this.garageBookingsData, 0, 'garageBookings', value)
                }
                else if (event.target.classList.contains('data-launch-mot-calibration-record-equipment-select')) {
                    // console.log('NEWLY ADDED EVENT LISTENER (INPUT event listener) for data-launch-mot-calibration-record-equipment-select')
                    let selectElement = document.getElementById("mot_equipment_type");
                    let selectedIndex = selectElement.selectedIndex;
                    let selectedOption = selectElement.options[selectedIndex];
                    // console.log(selectedOption.value); // Logs the value of the selected option
                    // console.log(selectedOption.text);  // Logs the text of the selected option
                    // console.log('selectedOption', selectedOption)
                    let make = selectedOption.attributes["data-make"].value
                    let model = selectedOption.attributes["data-model"].value
                    let serialNo = selectedOption.attributes["data-serial-no"].value
                    let frequency = selectedOption.attributes["data-frequency"].value
                    let bay = selectedOption.attributes["data-bay"].value
                    document.getElementById('mot_make').value = make
                    document.getElementById('mot_model').value = model
                    document.getElementById('mot_serial_no').value = serialNo
                    document.getElementById('mot_bay').value = bay
                    // console.log('frequency is ', frequency)
                    this.frequency = frequency
                    document.getElementById('mot_calibration_recommended_frequency').value = `${this.frequency} Months`
                    let expiryDate = new Date();
                    if (this.frequency === "6") {
                        expiryDate.setMonth(expiryDate.getMonth() + 6);
                    } 
                    else if (this.frequency === "12") {
                        expiryDate.setMonth(expiryDate.getMonth() + 12);
                    }
                    document.getElementById('mot_calibration_expiry_date').value = expiryDate.toISOString().split('T')[0];
                }            
            }, true)
            this.listenersApplied = true
        }
    }
    globalFilter (event) {        
        let filter = event.target.value.toUpperCase();
        let table = document.getElementById("data-launch-garage-table-body");
        let tr = table.getElementsByTagName("tr");
        let txtValue;
        for (let i = 0; i < tr.length; i++) {
            let tds = Array.from(tr[i].getElementsByTagName("td"))
            let matchFound = false;

            for (let td of tds) {
                let txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().includes(filter)) {
                    matchFound = true;
                    break;
                }
            }    
            tr[i].style.display = matchFound ? "" : "none";
        }
    }
    filterApply (header,value, filterJustRemoved) {
        // console.log('filterApply HIT' , header, value, filterJustRemoved)
        // if a filter has just been removed and there are now 0 filters
        if (filterJustRemoved === true && this.filters.length === 0) {
            // console.log('filterApply LANDED HERE    if (filterJustRemoved === true && this.filters.length === 0) ', header, value, filterJustRemoved)
            this.filteredData = []
            this.filters = []
            let html = this.buildTableBody(this.data)
            document.getElementById('data-launch-garage-table-body').innerHTML = html
        }
        else if (filterJustRemoved === true && this.filters.length >= 1) {
            // console.log('filterApply LANDED HERE    else if (filterJustRemoved === true && this.filters.length >= 1) { ', header, value, filterJustRemoved)
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
            let html = this.buildTableBody(furtherFilteredData)
            document.getElementById('data-launch-garage-table-body').innerHTML = html
        }
        else if (this.filters.length === 0) {       
            // console.log('filterApply LANDED HERE    else if (this.filters.length === 0) {    ', header, value, filterJustRemoved)  
            this.filters.push({header: header, value: value})
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i][header].toUpperCase().includes(value.toUpperCase()) || this.data[i][header].includes(value)) {
                    this.filteredData.push(this.data[i])
                }                
            }
            let html = this.buildTableBody(this.filteredData)
            document.getElementById('data-launch-garage-table-body').innerHTML = html
        }
        else {
            // Iterate over each data item
            // console.log('filterApply LANDED HERE    else {    ', header, value, filterJustRemoved)  
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
            let html = this.buildTableBody(furtherFilteredData)
            document.getElementById('data-launch-garage-table-body').innerHTML = html
        }
    }
    filterRemove (header,value) {
        // console.log('filterRemove selected')
        this.filters = this.filters.filter(function (filterRec) {
            return filterRec.header !== header
        })
        this.filterApply(header, value, true)
    }
    filterResetAll () {
        let table = document.getElementById("data-launch-garage-list-view-table-el");
        let tr = table.getElementsByTagName("tr");
        for (let i = 0; i < tr.length; i++) {
            tr[i].style.display = 'grid'
        }
        document.getElementById('data-launch-garage-global-filter-input').value = ''
        // this.filteredData = []
        // this.filters = []
        // let x = Array.from(document.getElementsByClassName('data-launch-filter-search'))
        // x.forEach(el => {
        //     if (el.attributes['type'].value === 'text' || el.attributes['type'].value === 'date' || el.attributes['type'].value === 'email') {
        //         el.value = ''
        //     }
        //     else if (el.attributes['type'].value === 'checkbox') {
        //         el.checked = false
        //     }
        // })
        // let html = this.buildTableBody(this.data)
        // document.getElementById('data-launch-garage-table-body').innerHTML = html
    }
    closeModal () {
        document.getElementById('garagePageScreenOverlay').style.display = 'none'                 
        document.getElementById('garagePageModalPopup').style.display = 'none'
        document.getElementById('garagePageModalPopup').innerHTML = ''
        document.getElementById('data-launch-save-close-garage-record').style.display = 'block'
    }
    sendLoginDetailsToEmail (first = null, second = null, emailVal = null) {
        let firstName;
        let secondName;
        var emailValue;
        if (firstName === null && secondName === null && emailValue === null) {
            firstName = document.getElementById('contact_forename_val').value
            secondName = document.getElementById('contact_surname_val').value
            emailValue = document.getElementById('email_username_val').value
        }
        else {
            firstName = first
            secondName = second
            emailValue = emailVal
        }  
        var emailParams = {
            to_email: emailValue, // Replace with the recipient's email address
            // from_name: 'MOT Expert',
            from_name: 'support@vtspro.co.uk',
            garage_id: this.id,
            first_name: firstName,
            last_name: secondName
        };            
        // Send the email
        /// HOTMAIL ACCOUNT CONNECTOR
        // emailjs.send('service_dlqsqml', 'template_9q4c1yd', emailParams)
        //     .then(response => {
        //         // console.log('SUCCESS!', response.status, response.text);
        //         console.log('response', response)
        //         this.showSuccessAlert()
        //     }, error => {
        //         console.error('FAILED...', error);
        //     });

    /// support@vtspro.co.uk connector
            emailjs.send('service_xhjzgor', 'template_n1eu478', emailParams)
            .then(response => {
                // console.log('SUCCESS!', response.status, response.text);
                console.log('response', response)
                this.showSuccessAlert()
            }, error => {
                console.error('FAILED...', error);
            });




            
    }
    openMotCalibrationForm (motcalid, vtsid) {
        let record;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].vtsId === vtsid) {
                for (let p = 0; p < this.data[i].motCalibration.length; p++) {
                    if (this.data[i].motCalibration[p].id === motcalid) {
                        record = this.data[i].motCalibration[p]
                        document.getElementById('garagePageMain').backgroundColor = 'lightgrey'
                        let html = ''
                        html += `
                        <div class='data-launch-input-field-container'>
                            <label class="data-launch-field-labels">Garage Name</label>
                            <input placeholder='Garage Name' type='text' data-launch-field="garageName" value="${record.garageName}" class='data-launch-input-field'>
                        </div>
                        <div class='data-launch-input-field-container'>
                            <label class="data-launch-field-labels">Equipment Type</label>
                            <input placeholder='Equipment Type' type='text' data-launch-field="equipmentType" value="${record.equipmentType}" class='data-launch-input-field'>
                        </div>
                        <div class='data-launch-input-field-container'>
                            <label class="data-launch-field-labels">Make</label>
                            <input placeholder='Make' type='text' data-launch-field="make" value="${record.make}" class='data-launch-input-field'>
                        </div>
                        <div class='data-launch-input-field-container'>
                            <label class="data-launch-field-labels">Model</label>
                            <input placeholder='Model' type='text' data-launch-field="model" value="${record.model}" class='data-launch-input-field'>
                        </div>
                        <div class='data-launch-input-field-container'>
                            <label class="data-launch-field-labels">Serial No</label>
                            <input placeholder='serialNo' type='text' data-launch-field="serialNo" value="${record.serialNo}" class='data-launch-input-field'>
                        </div>
                        <div class='data-launch-input-field-container'>
                            <label class="data-launch-field-labels">Last Calibration Date</label>
                            <input placeholder='lastCalibrationDate' type='text' data-launch-field="lastCalibrationDate" value="${record.lastCalibrationDate}" class='data-launch-input-field'>
                        </div>
                        <div class='data-launch-input-field-container'>
                            <label class="data-launch-field-labels">Next Calibration Date</label>
                            <input placeholder='nextCalibrationDate' type='text' data-launch-field="nextCalibrationDate" value="${record.nextCalibrationDate}" class='data-launch-input-field'>
                        </div>
                        <div class='data-launch-input-field-container'>
                            <label class="data-launch-field-labels">Bays</label>
                            <input placeholder='bays' type='text' data-launch-field="bays" value="${record.bays}" class='data-launch-input-field'>
                        </div>
                        <div class='data-launch-input-field-container'>
                            <label class="data-launch-field-labels">Bays</label>
                            <input placeholder='bays' type='text' data-launch-field="bays" value="${record.bays}" class='data-launch-input-field'>
                        </div>
                        <div class='data-launch-input-field-container data-launch-input-field-container-multi-line'>
                            <label class="data-launch-field-labels">Notes</label>
                            <textarea class='data-launch-input-field-multi-line' data-launch-field="Notes" >${typeof record.notes !== undefined ? record.notes : ''}</textarea>
                        </div>
                        <button class='data-launch-modal-close-window btn btn-block btn-success'>Close</button>
                        `
                        document.getElementById('garagePageModalPopup').style.display = 'block'
                        document.getElementById('data-launch-save-close-garage-record').style.display = 'none'                        
                        document.getElementById('garagePageModalPopup').innerHTML = html
                    }
                }  
            }                     
        }
    }
    injectDataIntoAssociatedTestersSubgrid () {
        if (!this.isUserAuthorized('read', 'tester_garages')) {
            document.getElementById('data-launch-garage-associated-testers-cont').innerHTML = 
            `<h3 style='text-align:center; margin-top: 46px;'>You do not have the necessary privileges to view this data</h3>
             <h3 style='text-align:center'> Please contact your Administrator</h3>`
        }
        else {
            fetchData('tester_garages', 1000, 0, null, this.id).then(reducedArrayForGarageRecordID => {
                    // console.log('the tester garages data is as such', reducedArrayForGarageRecordID)
                    // let reducedArrayForGarageRecordID = []
                    // for (let i = 0; i < res.length; i++) {
                    //     if (res[i]["garage_id"] === parseInt(this.id)) {
                    //         reducedArrayForGarageRecordID.push(res[i])
                    //     }                    
                    // }
                    // // console.log('reducedArrayForGarageRecordID', reducedArrayForGarageRecordID)
                    let data = []
                    for (let i = 0; i < reducedArrayForGarageRecordID.length; i++) {
                        for (let t = 0; t < testersData.length; t++) {
                            if (reducedArrayForGarageRecordID[i]["tester_id"] === testersData[t].id) {
                                data.push({name: `${testersData[t].first_name} ${testersData[t].last_name}`, id: testersData[t].id, user_id:  testersData[t].user_id, tester_garages_id: reducedArrayForGarageRecordID[i].id})
                            }                        
                        }
                    } 
                    this.garageTestersData = data       
                    new SubGrid(data, 'data-launch-garage-associated-testers-cont', 'garage_testers');
                },
                err => {
                    console.error(err);
                }
            )
        }
    }
    injectDataIntoMotCalibrationSubgrid () {
        if (!this.isUserAuthorized('read', 'data_launch_mot_calibration')) {
            document.getElementById('data-launch-garage-mot-calibration-cont').innerHTML = 
            `<h3 style='text-align:center; margin-top: 46px;'>You do not have the necessary privileges to view this data</h3>
             <h3 style='text-align:center'> Please contact your Administrator</h3>`
        }
        else {      
            fetchData('data_launch_mot_calibration', 1000, 0, null, this.id).then(data => {
                // console.log('Data for garage_id 5:', data);
                this.motCalibrationData = data
                new SubGrid(data, 'data-launch-garage-mot-calibration-cont', 'motcalibration', this.id);
            });
        }
    }
    injectDataIntoMotReconciliationSubgrid () {
        if (!this.isUserAuthorized('read', 'data_launch_mot_reconciliations')) {
            document.getElementById('data-launch-garage-mot-reconciliation-cont').innerHTML = 
            `<h3 style='text-align:center; margin-top: 46px;'>You do not have the necessary privileges to view this data</h3>
             <h3 style='text-align:center'> Please contact your Administrator</h3>`
        }
        else {          
            fetchData('data_launch_mot_reconciliations', 1000, 0, null, this.id).then(data => {
                // console.log('Data for garage_id 5:', data);
                this.motReconciliationData = data
                new SubGrid(data, 'data-launch-garage-mot-reconciliation-cont', 'motReconciliations', this.id);
            });
        }
    }
    injectDataIntoMotSiteAuditsSubgrid () {
        if (!this.isUserAuthorized('read', 'data_launch_mot_site_audits')) {
            document.getElementById('data-launch-garage-mot-site-audits-cont').innerHTML = 
            `<h3 style='text-align:center; margin-top: 46px;'>You do not have the necessary privileges to view this data</h3>
             <h3 style='text-align:center'> Please contact your Administrator</h3>`
        }
        else {  
            fetchData('data_launch_mot_site_audits', 1000, 0, null, this.id).then(data => {
                // console.log(`Data for garage_id: ${this.id} `, data);
                this.motSiteAuditData = data
                new SubGrid(data, 'data-launch-garage-mot-site-audits-cont', 'motsiteaudits',  this.id);            
            });
        }
    }
    injectDataIntoQcCheckersSubgrid () {
        if (!this.isUserAuthorized('read', 'data_launch_qc_checkers_for_car')) {
            document.getElementById('data-launch-garage-qc-checkers-cont').innerHTML = 
            `<h3 style='text-align:center; margin-top: 46px;'>You do not have the necessary privileges to view this data</h3>
             <h3 style='text-align:center'> Please contact your Administrator</h3>`
        }
        else {  
            fetchData('data_launch_qc_checkers_for_car', 1000, 0, null, this.id).then(data => {
                // console.log(`data_launch_qc_checkers_for_car for garage_id: ${this.id} `, data);
                this.qcCheckerData = data
                new SubGrid(data, 'data-launch-garage-qc-checkers-cont', 'qccheckers',  this.id);            
            });
        }
    }
    injectDataIntoGarageBookingsSubgrid () {
        if (!this.isUserAuthorized('read', 'data_launch_garage_bookings')) {
            document.getElementById('data-launch-garage-bookings-cont').innerHTML = 
            `<h3 style='text-align:center; margin-top: 46px;'>You do not have the necessary privileges to view this data</h3>
             <h3 style='text-align:center'> Please contact your Administrator</h3>`
        }
        else {  
            fetchData('data_launch_garage_bookings', 3000, 0, null, this.id).then(data => {
                // console.log(`data_launch_garage_bookings for garage_id: ${this.id} `, data);
                this.garageBookingsData = data
                this.garageBookingsSubgridClass = new SubGrid(data, 'data-launch-garage-bookings-cont', 'garageBookings',  this.id, null, this.garageBayData, this.garageScheduledOpeningDays, this.garageOperatingHours);
                // if (this.class_invoked_garageBookingsSubgridClass === false) {
                //     this.class_invoked_garageBookingsSubgridClass = true
                //     this.garageBookingsSubgridClass = new SubGrid(data, 'data-launch-garage-bookings-cont', 'garageBookings',  this.id, null, this.garageBayData, this.garageScheduledOpeningDays, this.garageOperatingHours);    
                // }
                // else {
                //     let bookingsSubgridTypeElement = document.getElementById(`data-launch-bookings-subgrid-grid-type-select-element_${this.id}`)
                //     if (bookingsSubgridTypeElement !== null) {
                //         let selectedIndex = bookingsSubgridTypeElement.selectedIndex;
                //         let selectedOption = bookingsSubgridTypeElement.options[selectedIndex];
                //         this.garageBookingsSubgridClass.render(null, this.garageBookingsData, 0, 'garageBookings', selectedOption.value)
                //     }
                //     else {
                //         this.garageBookingsSubgridClass.render(null, this.garageBookingsData, 0, 'garageBookings')
                //     }                 
                // }    
            });
        }
    }
    
    injectDataIntoCarTQISubgrid() {
        this.tqiData = []
        if (!this.isUserAuthorized('read', 'data_launch_tqis')) {
            document.getElementById('data-launch-garage-tqi-cont').innerHTML = 
            `<h3 style='text-align:center; margin-top: 46px;'>You do not have the necessary privileges to view this data</h3>
             <h3 style='text-align:center'> Please contact your Administrator</h3>`
        }
        else {
            fetchData('data_launch_tqis', 1000, 0, null, this.id).then(res => {
                // // console.log('the data_launch_tqis data is as such', res)
                if (res !== undefined) {
                    this.tqiData = res
                }                
                new SubGrid(res, 'data-launch-garage-tqi-cont', 'tqis', this.id);
                },
                err => {
                    console.error(err);
                }
            );
        }
    }

    injectDataIntoRemindersSubgrid() {
        fetchData('data_launch_garage_reminders', 1000, 0, null, this.id).then(data => {
            // // console.log(`data_launch_garage_reminders for garage_id: ${this.id} `, data);
            this.garageRemindersData = data
            this.remindersSubgridClassInstantiated = new SubGrid(data, 'data-launch-garage-reminders-cont', 'garageReminders',  this.id, 30);            
        });
    }
    injectDataIntoMotEquipmentSubgrid() {
        this.motEquipmentData = []
        if (!this.isUserAuthorized('read', 'data_launch_mot_equipment')) {
            document.getElementById('data-launch-garage-mot-equipment-cont').innerHTML = 
            `<h3 style='text-align:center; margin-top: 46px;'>You do not have the necessary privileges to view this data</h3>
             <h3 style='text-align:center'> Please contact your Administrator</h3>`
        }
        else {
            fetchData('data_launch_mot_equipment', 1000, 0, null, this.id).then(res => {
                // // console.log('the data_launch_mot_equipment data is as such', res)
                this.motEquipmentData = res
                new SubGrid(res, 'data-launch-garage-mot-equipment-cont', 'garage_mot_equipment', this.id);
                },
                err => {
                    console.error(err);
                }
            );
        }
    }

    
    injectDataIntoAssociatedGaragesSubgrid() {
        if (!this.isUserAuthorized('read', 'data_launch_associated_garages')) {
            document.getElementById('data-launch-garage-associated-garages-cont').innerHTML = 
            `<h3 style='text-align:center; margin-top: 46px;'>You do not have the necessary privileges to view this data</h3>
             <h3 style='text-align:center'> Please contact your Administrator</h3>`
        }
        else {
            if (this.currentGarageRecord.child_garage_ids === null) {
                document.getElementById('data-launch-garage-associated-garages-cont').innerHTML = 
                `<h3 style='text-align:center; margin-top: 46px;'>There are no associated garages</h3>`
            }
            else {
                // // console.log('this.currentGarageRecord injectDataIntoAssociatedGaragesSubgrid', this.currentGarageRecord)
                // let record;
                // for (let i = 0; i < this.data.length; i++) {
                //     if (this.data[i].id === parseInt(this.currentRecordId)) {
                //         record = this.data[i]
                //     }  
                // }
                // if (record.child_garage_ids === undefined) {
                //     document.getElementById('data-launch-garage-associated-garages-cont').innerHTML = 
                //                     `<h3 style='text-align:center; margin-top: 46px;'>There are no associated garages</h3>`
                // }
                           
                fetchData('data_launch_garage_records', null, null, null, null, null, null, null, null, null, null, null, null, null, this.currentGarageRecord.child_garage_ids).then(
                    res => {
                        // // console.log('associated garage records', res)
                        new SubGrid(res, 'data-launch-garage-associated-garages-cont', 'associatedGarages',  this.id);  
                    },
                    err => {
                        console.error('associated garages error', err)
                    }                
                )
                
            }            
        }
    }



    injectDataIntoDefectReportsSubgrid () {
        if (!this.isUserAuthorized('read', 'data_launch_defect_reports')) {
            document.getElementById('data-launch-defect-reports-subgrid-cont').innerHTML = 
            `<h3 style='text-align:center; margin-top: 46px;'>You do not have the necessary privileges to view this data</h3>
             <h3 style='text-align:center'> Please contact your Administrator</h3>`
        }
        else {
            fetchData('data_launch_defect_reports', 1000, 0, null, this.id).then(data => {
                // // console.log(`data_launch_defect_reports for garage_id: ${this.id} `, data);
                this.defectReportData = data
                new SubGrid(data, 'data-launch-defect-reports-subgrid-cont', 'defectReports',  this.id);            
            });
        }
    }
    injectDataIntoMotBayCleaningLogSubgrid () {
        if (!this.isUserAuthorized('read', 'data_launch_mot_bay_cleaning_log')) {
            document.getElementById('data-launch-mot-bay-cleaning-subgrid-cont').innerHTML = 
            `<h3 style='text-align:center; margin-top: 46px;'>You do not have the necessary privileges to view this data</h3>
             <h3 style='text-align:center'> Please contact your Administrator</h3>`
        }
        else {  
            fetchData('data_launch_mot_bay_cleaning_log', 1000, 0, null, this.id).then(data => {
                // // console.log(`data_launch_mot_bay_cleaning_log for garage_id: ${this.id} `, data);
                this.motBayCleaningLogData = data
                new SubGrid(data, 'data-launch-mot-bay-cleaning-subgrid-cont', 'motBayCleaningLog',  this.id);            
            });
        }
    }
    injectDataIntoQcCheckersForBikesSubgrid () {
        if (!this.isUserAuthorized('read', 'data_launch_qc_checkers_for_bike')) {
            document.getElementById('data-launch-qc-checkers-for-bikes-subgrid-cont').innerHTML = 
            `<h3 style='text-align:center; margin-top: 46px;'>You do not have the necessary privileges to view this data</h3>
             <h3 style='text-align:center'> Please contact your Administrator</h3>`
        }
        else {  
            fetchData('data_launch_qc_checkers_for_bike', 1000, 0, null, this.id).then(data => {
                // // console.log(`data_launch_qc_checkers_for_bike for garage_id: ${this.id} `, data);
                this.qcCheckersForBikeData = data
                new SubGrid(data, 'data-launch-qc-checkers-for-bikes-subgrid-cont', 'qcCheckersForBike',  this.id);            
            });
        }
    }
    injectDataIntoUsersSubgrid () {
        if (!this.isUserAuthorized('read', 'data_launch_users')) {
            document.getElementById('data-launch-users-subgrid-cont').innerHTML = 
            `<h3 style='text-align:center; margin-top: 46px;'>You do not have the necessary privileges to view this data</h3>
             <h3 style='text-align:center'> Please contact your Administrator</h3>`
        }
        else {  
            fetchData('data_launch_users', 1000, 0, null, this.id).then(data => {
                // // console.log(`data_launch_users FOR garage_id: ${this.id} `, data);
                this.garageUsersData = data
                new SubGrid(data, 'data-launch-users-subgrid-cont', 'garageUsers',  this.id);            
            });
        }
    }
    injectDataIntoBaysSubgrid () {
        if (!this.isUserAuthorized('read', 'data_launch_bays')) {
            document.getElementById('data-launch-bays-subgrid-cont').innerHTML = 
            `<h3 style='text-align:center; margin-top: 46px;'>You do not have the necessary privileges to view this data</h3>
             <h3 style='text-align:center'> Please contact your Administrator</h3>`
        }
        else {  
            fetchData('data_launch_bays', 1000, 0, null, this.id).then(data => {
                // // console.log(`data_launch_bays FOR garage_id: ${this.id} `, data);
                this.garageBayData = data
                new SubGrid(data, 'data-launch-bays-subgrid-cont', 'garageBays',  this.id);            
            });
        }
    }
    injectDataIntoSpecialNoticesContainer () {
        // fetchData('data_launch_special_notices', 1000).then(data => {
        //     // console.log(`data_launch_special_notices`, data);
        //     this.specialNotices = data
        //     for (let i = 0; i < this.specialNotices.length; i++) {
        //         fetchData('data_launch_special_notices', 1, 0, null, null, null, null, null, null, null, this.specialNotices[i].id, user_ID).then(
        //             data => {
        //                 // console.log('special acknowledges' , data)
        //                 //// if the record exists, i want to remove that value fom the specialNotices array
        //             },
        //             error => {
        //                 console.error(error)
        //             }
        //         )
        //     }
        //     /// i then want the renderSpecialNotices function to be invoked once the for loop has completed. 
        //     /// it should provide a reduced array based on values it could not match     
        //     this.renderSpecialNotices(this.specialNotices)         
        // });

        fetchData('data_launch_special_notices', 1000)
    .then(data => {
        // // console.log(`data_launch_special_notices`, data);
        this.specialNotices = data;

        // Create an array of promises for each fetchData call
        const promises = this.specialNotices.map(notice =>
            fetchData('data_launch_special_notices_acknowledgements', 1, 0, null, null, null, null, null, null, null, notice.id, user_ID)
                .then(response => ({ notice, hasRecord: response.length > 0 }))
                .catch(error => {
                    console.error(error);
                    return { notice, hasRecord: false }; // Handle errors gracefully
                })
        );

        // Wait for all fetchData calls to resolve
        return Promise.all(promises);
    })
    .then(results => {
        // Filter out notices where hasRecord is true
        this.specialNotices = results.filter(result => !result.hasRecord).map(result => result.notice);

        // Call renderSpecialNotices with the reduced array
        this.renderSpecialNotices(this.specialNotices);
    })
    .catch(error => console.error('Error in fetching special notices:', error));

    }
    renderSpecialNotices(data) {
        // // console.log('renderSpecialNotices data ', data)
        let html = ''
        for (let i = 0; i < data.length; i++) {
            let p = i
            html += `<div id="data-launch-special-notice-${data[i].id}" class="data-launch-special-notice">
                        <h2>Special Notice ${p + 1}</h2>
                        <h4>${data[i].notice_name}</h4>
                        <p>${data[i].description}</p>
                        <a href="${data[i].hyperlink}">${data[i].hyperlink}</a><br><br>
                        <button data-id="data-launch-special-notice-${data[i].id}" data-special-notice-id="${data[i].id}" class="data-launch-acknowledge-button">Acknowledged</button>
                    </div>`
        }
        document.getElementById(`data-launch-special-notice-container_${this.id}`).classList.add('active')
        document.getElementById(`data-launch-special-notice-container_${this.id}`).innerHTML = html
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
    openModal (importData, viewOnly) {
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
         if (viewOnly !== true) {
            html += `<button class='btn btn-block btn-success data-launch-car-tqi-save'>Save TQI</button>`
         }
         html += `<button class='btn btn-block btn-success data-launch-car-tqi-modal-close'>Close</button>`
        document.getElementById(`cartqiPageModalPopup_${this.id}`).style.display = 'block'                     
        document.getElementById(`cartqiPageModalPopup_${this.id}`).innerHTML = html
    }
    uploadFile () {
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
    // parseExcel (file) {
    //     var reader = new FileReader();
    //     reader.onload = (e) => {
    //         var data = e.target.result;
    //         var workbook = XLSX.read(data, {
    //             type: 'binary',
    //             raw: true // Read the data as raw values to prevent automatic date conversion
    //         });
    //         workbook.SheetNames.forEach(sheetName => {
    //             var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: "A", raw: true });
    //             // // console.log('XL_row_object.length', XL_row_object.length);
    //             // No date parsing needed, keep values as they are
    //             this.tqiImportData = XL_row_object.map(row => {
    //                 return row; // Keep the values as strings
    //             });
    //             // // console.log('this.tqiImportData data is', this.tqiImportData);
    //             this.dataCarTQI.push({
    //                 createdOn: new Date(),
    //                 month: this.extractMonths(this.tqiImportData[2].A),
    //                 year: this.extractYear(this.tqiImportData[2].A),
    //                 class: this.tqiImportData[4].A,
    //                 rawData: this.tqiImportData,
    //                 vtsID: this.tqiImportData[1].A
    //             });
    //             // this.renderHTMLDataCarTQI(this.htmlHeaderCarTQI)
    //             this.openModal(this.tqiImportData)
    //         });
    //     }
    //     reader.onerror = function(ex) {
    //       // console.log(ex);
    //     };
    //     reader.readAsBinaryString(file);
    // }
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
    importCarTQI () {
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

    fieldObjectMeta () {
        return {
            Summary : {
                meta: {
                    columns: 3,
                    name: 'summary',
                    type: 'custom',
                    containerElement: 'data-launch-garages-summary',
                    classes: [
                              'col-lg-3 col-md-6 col-sm-12 col-xs-12 data-launch-field-container', 
                              'col-lg-5 col-md-6 col-sm-12 col-xs-12 data-launch-field-container',
                              'col-lg-4 col-md-6 col-sm-12 col-xs-12 data-launch-field-container'
                             ]
                },
                fields: [
                    {
                        field: 'trading_name_garage',
                        label: 'Trading Name',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'contact_forename_garage',
                        label: 'First Name',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'contact_surname_garage',
                        label: 'Last Name',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'contact_main_number_garage',
                        label: 'Main Phone',
                        type: 'phone',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'contact_email_garage',
                        label: 'Email',
                        type: 'email',
                        section: 1,
                        column: 1
                    },
                    {
                        type: 'remindersSubgrid',
                        column: 2
                    },
                    {
                        field: [
                            {name: 'Address1', fieldName: 'vts_address_line_1_garage'},
                            {name: 'Address2', fieldName :'vts_address_line_2_garage'},
                            {name: 'Address3', fieldName: 'vts_address_line_3_garage'},
                            {name: 'City',     fieldName: 'vts_address_line_4_garage'},
                            {name: 'Postcode', fieldName: 'vts_postcode_garage'}],
                        label: 'Address',
                        type: 'googleMaps',
                        section: 1,
                        column: 3
                    }
                ]
            },
            "Garage Initial Setup" : {
                meta: {
                    columns: 2,
                    name: 'garage-initial-setup',
                    type: 'split',
                    containerElement: 'data-launch-garages-garage-initial-setup'
                },
                fields: [
                    {
                        field: 'opening_hours_start_garage',
                        label: 'Opening Hours Start',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'opening_hours_end_garage',
                        label: 'Opening Hours End',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'open_on_monday',
                        label: 'Monday',
                        type: 'checkbox',
                        style: "width: 50px; display: inline-block;",
                        labelStyle: "display: inline-block;",
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'open_on_tuesday',
                        label: 'Tuesday',
                        type: 'checkbox',
                        style: "width: 50px; display: inline-block;",
                        labelStyle: "display: inline-block;",
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'open_on_wednesday',
                        label: 'Wednesday',
                        type: 'checkbox',
                        style: "width: 50px; display: inline-block;",
                        labelStyle: "display: inline-block;",
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'open_on_thursday',
                        label: 'Thursday',
                        type: 'checkbox',
                        style: "width: 50px; display: inline-block;",
                        labelStyle: "display: inline-block;",
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'open_on_friday',
                        label: 'Friday',
                        type: 'checkbox',
                        style: "width: 50px; display: inline-block;",
                        labelStyle: "display: inline-block;",
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'open_on_saturday',
                        label: 'Saturday',
                        type: 'checkbox',
                        style: "width: 50px; display: inline-block;",
                        labelStyle: "display: inline-block;",
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'open_on_sunday',
                        label: 'Sunday',
                        type: 'checkbox',
                        style: "width: 50px; display: inline-block;",
                        labelStyle: "display: inline-block;",
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'child_garage_ids',
                        label: 'Child Garage IDS (Read Only)',
                        type: 'child_garage_ids-CUSTOM-DO-NOT-CHANGE',
                        style: "width: 50px; display: inline-block;",
                        labelStyle: "display: inline-block;",
                        disabled: true,
                        section: 1,
                        column: 1
                    }
                ]
            },
            "Garage Details": {
                meta: {
                    columns: 3,
                    name: 'garage-details',
                    type: 'split',
                    containerElement: 'data-launch-garages-garage-details'
                },
                fields: [
                    {
                        field: 'charge_rate_garage',
                        label: 'Charge Rate',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'contact_mobile_number_garage',
                        label: 'Mobile Phone',
                        type: 'phone',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'consultant_name_garage',
                        label: 'Consultant Name',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'lead_consultant_name_garage',
                        label: 'Lead Consultant Name',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'vts_site_number_garage',
                        label: 'VTS Site No',
                        type: 'text',
                        column: 1,
                        section: 1
                    },
                    {
                        field: 'testing_station_id_garage',
                        label: 'Testing Station Record',
                        type: 'record',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'ARCHIVE SYSTEM',
                        label: 'Take Me to Archive System',
                        type: 'archiveSystemLink',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'date_called_garage',
                        label: 'Date Called',
                        type: 'date',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'call_back_needed_garage',
                        label: 'Call back needed',
                        type: 'checkbox',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'callback_date_garage',
                        label: 'Callback Date',
                        type: 'date',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'sms_functionality_garage',
                        label: 'SMS Functionality',
                        type: 'checkbox',
                        section: 1,
                        column: 3
                    },
                    {
                        field: 'sms_cap_garage',
                        label: 'SMS Cap',
                        type: 'text',
                        section: 1,
                        column: 3
                    },
                    {
                        field: 'is_parent_garage_garage',
                        label: 'Is Parent Garage',
                        type: 'checkbox',
                        section: 1,
                        column: 3
                    },
                    {
                        field: 'package_required_garage',
                        label: 'Package Required',
                        type: 'text',
                        section: 1,
                        column: 3
                    },
                    {
                        field: 'payment_type_garage',
                        label: 'Payment Type',
                        type: 'text',
                        section: 1,
                        column: 3
                    },
                ]
            },
            // "Credentials": {
            //     meta: {
            //         columns: 1,
            //         name: 'credentials',
            //         type: 'split'
            //     },
            //     fields: [
            //         {
            //             field: 'email_username',
            //             label: 'Email Username',
            //             type: 'text',
            //             section: 1,
            //             column: 1
            //         }
            //     ]
            // },
            // "Associated Garages": {
            //     meta: {
            //         columns: 1,
            //         name: 'Associated Garages',
            //         type: 'full',
            //         containerElement: 'data-launch-garages-Associated Garages'
            //     },
            //     fields: [
            //         {
            //             type: 'associatedGaragesSubgrid',
            //             column: 1
            //         }
            //     ]
            // },
            "Invoice Contact": {
                meta:  {
                    columns: 3,
                    name: 'invoice-contact',
                    garageUser: false,
                    containerElement: 'data-launch-garages-invoice-contact'
                },
                fields: [
                    {
                        field: 'invoice_contact_garage',
                        label: 'Invoice Contact',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'invoice_contact_number_garage',
                        label: 'Invoice Contact No',
                        type: 'phone',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'invoice_contact_email_garage',
                        label: 'Invoice Contact Email',
                        type: 'email',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'invoice_contact_notes_garage',
                        label: 'Invoice Contact Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'callback_notes_garage',
                        label: 'Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'cpd_needed_garage',
                        label: 'CPD Needed',
                        type: 'checkbox',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'cpd_notes_garage',
                        label: 'CPD Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'level_3_required_checkb_garage',
                        label: 'Level 3 Required',
                        type: 'checkbox',
                        section: 1,
                        column: 3
                    },
                    {
                        field: 'level_3_required_garage',
                        label: 'Level 3 Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 3
                    }
                ]
            },
            Users: {
                meta:  {
                    columns: 1,
                    name: 'users',
                    type: 'full',
                    containerElement: 'data-launch-garages-users'
                },
                fields: [
                    {
                        type: 'users',
                        column: 1
                    }
                ]
            },
            Bays: {
                meta:  {
                    columns: 1,
                    name: 'bays',
                    type: 'full',
                    containerElement: 'data-launch-garages-bays'
                },
                fields: [
                    {
                        type: 'bays',
                        column: 1
                    }
                ]
            },
            Address: {
                meta: {
                    columns: 2,
                    name: 'address',
                    type: 'split',
                    containerElement: 'data-launch-garages-address'
                },
                fields: [
                    {
                        field: 'vts_address_line_1_garage',
                        label: 'Address 1',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'vts_address_line_2_garage',
                        label: 'Address 2',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'vts_address_line_3_garage',
                        label: 'Address 3',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'vts_address_line_4_garage',
                        label: 'City',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'vts_postcode_garage',
                        label: 'Postcode',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: [
                            {name: 'Address1', fieldName: 'vts_address_line_1_garage'},
                            {name: 'Address2', fieldName :'vts_address_line_2_garage'},
                            {name: 'Address3', fieldName: 'vts_address_line_3_garage'},
                            {name: 'City',     fieldName: 'vts_address_line_4_garage'},
                            {name: 'Postcode', fieldName: 'vts_postcode_garage'}],
                        label: 'Address',
                        type: 'googleMaps',
                        section: 1,
                        column: 2
                    }
                ]
            },
            // "Authorised Examiner": {
            //     meta: {
            //         columns: 1,
            //         name: 'authorised-examiner',
            //         type: 'split',
            //         containerElement: 'data-launch-garages-authorised-examiner'
            //     },
            //     fields: [
            //         {
            //             field: 'authorised_examiner_name',
            //             label: 'Authorised Examiner Name',
            //             type: 'text',
            //             section: 1,
            //             column: 1
            //         },
            //         {
            //             field: 'authorised_examiner_id',
            //             label: 'Authorised Examiner ID',
            //             type: 'text',
            //             section: 1,
            //             column: 1
            //         },
            //         {
            //             field: 'aed_name_garage',
            //             label: 'AEDM Name',
            //             type: 'text',
            //             section: 1,
            //             column: 1
            //         },
            //         // {
            //         //     field: 'aed_password_garage',
            //         //     label: 'AEDM Password',
            //         //     type: 'text',
            //         //     section: 1,
            //         //     column: 1
            //         // },
            //         // {
            //         //     field: 'aed_email_garage',
            //         //     label: 'AEDM Email',
            //         //     type: 'text',
            //         //     section: 1,
            //         //     column: 1
            //         // },
            //         // {
            //         //     field: 'aed_phone_no_garage',
            //         //     label: 'AEDM Phone No',
            //         //     type: 'text',
            //         //     section: 1,
            //         //     column: 1
            //         // }
            //     ]
            // },
            "Testing Classes": {
                meta: {
                    columns: 3,
                    name: 'testing-classes',
                    type: 'split',
                    containerElement: 'data-launch-garages-testing-classes'
                },
                fields: [
                    {
                        field: 'mot_testing_class_4_7_req_checkb_garage',
                        label: 'MOT Testing Class 4 & 7 Required',
                        type: 'checkbox',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'mot_testing_class_4_7_required_garage',
                        label: 'MOT Testing Class 4 & 7 Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'mot_testing_class_1_2_req_checkb_garage',
                        label: 'MOT Testing Class 1 & 2 Required',
                        type: 'checkbox',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'mot_testing_class_1_2_required_garage',
                        label: 'MOT Testing Class 1 & 2 Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'mot_class_3_required_checkb_garage',
                        label: 'MOT Testing Class 3 Required',
                        type: 'checkbox',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'mot_class_3_required_garage',
                        label: 'MOT Testing Class 3 Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'mot_class_5_required_checkb_garage',
                        label: 'MOT Testing Class 5 Required',
                        type: 'checkbox',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'mot_class_5_required_garage',
                        label: 'MOT Testing Class 5 Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 3
                    },
                    {
                        field: 'mot_test_centre_management_req_checkb_garage',
                        label: 'MOT Test Centre Management Required',
                        type: 'checkbox',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'mot_test_centre_management_required_garage',
                        label: 'MOT Test Centre Management Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 3
                    },
                    {
                        field: 'vts_pro_solution_required_checkb_garage',
                        label: 'VTS Pro Solution Required',
                        type: 'checkbox',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'vts_pro_solution_required_garage',
                        label: 'VTS Pro Solution Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 3
                    }
                ]
            },
            Testers: {
                meta: {
                    columns: 1,
                    name: 'testers',
                    type: 'full',
                    containerElement: 'data-launch-garages-testers'
                },
                fields: [
                    {
                        type: 'garagetesterssubgrid',
                        column: 1
                    }
                ]
            },
            "MOT Equipment": {
                meta: {
                    columns: 1,
                    name: 'mot-equipment',
                    type: 'full',
                    containerElement: 'data-launch-garages-mot-equipment'
                },
                fields: [
                    {
                        type: 'garageMotEquipmentSubgrid',
                        column: 1
                    }
                ]
            },
            "MOT Calibrations": {
                meta:  {
                    columns: 1,
                    name: 'mot-calibration',
                    type: 'full',
                    containerElement: 'data-launch-garages-mot-calibration'
                },
                fields: [
                    {
                        type: 'garageMotCalibrationSubgrid',
                        column: 1
                    }
                ]
            },
            "MOT Reconciliations": {
                meta:  {
                    columns: 1,
                    name: 'mot-reconciliation',
                    type: 'full',
                    containerElement: 'data-launch-garages-mot-reconciliation'
                },
                fields: [
                    {
                        type: 'garageMotReconciliationSubgrid',
                        column: 1
                    }
                ]
            },
            "MOT Site Audits": {
                meta:  {
                    columns: 1,
                    name: 'mot-site-audits',
                    type: 'full',
                    containerElement: 'data-launch-garages-mot-site-audits'
                },
                fields: [
                    {
                        type: 'motSiteAuditsSubgrid',
                        column: 1
                    }
                ]
            },
            "TQI": {
                meta:  {
                    columns: 1,
                    name: 'tqi',
                    type: 'full',
                    containerElement: 'data-launch-garages-tqi'
                },
                fields: [
                    {
                        type: 'tqiSubgrid',
                        column: 1
                    }
                ]
            },
            "QC Checks (Group A)": {
                meta:  {
                    columns: 1,
                    name: 'Quality Checks for Group A',
                    type: 'full',
                    containerElement: 'data-launch-garages-Quality Checks for Group A'
                },
                fields: [
                    {
                        type: 'qcCheckersForBikes',
                        column: 1
                    }
                ]
            },
            "Bookings": {
                meta: {
                    columns: 1,
                    name: 'bookings',
                    type: 'full',
                    containerElement: 'data-launch-garages-bookings'
                },
                fields : [
                    {
                        type: 'bookings',
                        column: 1
                    }
                ]
            },
            "Defect Reports": {
                meta: {
                    columns: 1,
                    name: 'Defect Reports',
                    type: 'full',
                    containerElement: 'data-launch-garages-Defect Reports'
                },
                fields: [
                    {
                        type: 'defectReports',
                        column: 1
                    }
                ]
            },
            "MOT Bay Cleaning": {
                meta: {
                    columns : 1,
                    name: 'MOT Bay Cleaning',
                    type: 'full',
                    containerElement: 'data-launch-garages-MOT Bay Cleaning'
                },
                fields: [
                    {
                        type: 'motBayCleaning',
                        column: 1
                    }
                ]
            },
            "QC Checks (Group B)" : {
                meta: {
                    columns: 1,
                    name: 'Quality Checks for Group B',
                    type: 'full',
                    containerElement: 'data-launch-garages-Quality Checks for Group B'
                },
                fields: [
                    {
                        type: 'qcCheckersSubgrid',
                        column: 1
                    }
                ]
            }
        }
    }

    buildFormMenu () {        
        let headers = this.fieldObjectMeta()
        // // console.log('headers', headers)
        let html = ''
        let fistIteration = true
        if (user_FULL_USER === "0") {
            for (const key in headers) {
                if (!headers[key].meta.hasOwnProperty("garageUser")) {
                    if (fistIteration) {
                        // html += `<li class="nav-item data-launch-tabs-parent-li-testing-station data-launch-tabs-parent-li-garages modern-nav-item active" id="garages_parent_li_${headers[key].meta.name}">
                        //             <a class="nav-link data-launch-tabs-clickable-garages modern-nav-link active" data-launch-menu-item="${headers[key].meta.name}" href="#">${key}</a>
                        //         </li>` 
                        html += `<a href="#" class="data-launch-tabs-clickable-garages active" data-launch-menu-item="${headers[key].meta.name}" id="garages_parent_li_${headers[key].meta.name}">${key}</a>`
                              
                        fistIteration = false
                    }
                    else {
                        if (key === 'Garage Initial Setup') {
                            // // console.log('Garage Initial Setup NOT ACCESSIBLE By GARAGE USERS')
                        }
                        // else {
                        //     html +=     `<li class="nav-item data-launch-tabs-parent-li-testing-station data-launch-tabs-parent-li-garages modern-nav-item" id="garages_parent_li_${headers[key].meta.name}">
                        //     <a class="nav-link data-launch-tabs-clickable-garages modern-nav-link" data-launch-menu-item="${headers[key].meta.name}" href="#">${key}</a>
                        // </li>`   
                        // }           
                         else {
                            html +=  `<a href="#" class="data-launch-tabs-clickable-garages active" data-launch-menu-item="${headers[key].meta.name}" id="garages_parent_li_${headers[key].meta.name}">${key}</a>`
                         }      
                    }                   
                }
            }
        }
        else {
            for (const key in headers) {
                if (fistIteration) {
                    // html += `<li class="nav-item data-launch-tabs-parent-li-testing-station data-launch-tabs-parent-li-garages modern-nav-item active" id="garages_parent_li_${headers[key].meta.name}">
                    //             <a class="nav-link data-launch-tabs-clickable-garages modern-nav-link active" data-launch-menu-item="${headers[key].meta.name}" href="#">${key}</a>
                    //         </li>` 
                     html += `<a href="#" class="data-launch-tabs-clickable-garages active" data-launch-menu-item="${headers[key].meta.name}" id="garages_parent_li_${headers[key].meta.name}">${key}</a>`
                       
                    fistIteration = false
                }
                else {
                // html +=     `<li class="nav-item data-launch-tabs-parent-li-testing-station data-launch-tabs-parent-li-garages modern-nav-item" id="garages_parent_li_${headers[key].meta.name}">
                //                 <a class="nav-link data-launch-tabs-clickable-garages modern-nav-link" data-launch-menu-item="${headers[key].meta.name}" href="#">${key}</a>
                //             </li>`   
                 html += `<a href="#" class="data-launch-tabs-clickable-garages" data-launch-menu-item="${headers[key].meta.name}" id="garages_parent_li_${headers[key].meta.name}">${key}</a>`
                       
                }                   
            }
        }        
        return html
    }
    buildFormSections (rec, html) {
        let fieldDataObj = this.fieldObjectMeta()        
        let firstIteration = true
        // // console.log('rec is ', rec)
        if (rec !== 'NEW FORM') {
            for (const key in fieldDataObj) {
                if (firstIteration) {
                    html += `<div class='data-launch-garages-screen row active' id='data-launch-garages-${fieldDataObj[key].meta.name}'>`
                    firstIteration = false
                }
                else {
                    html += `<div class='data-launch-garages-screen row' id='data-launch-garages-${fieldDataObj[key].meta.name}'>`
                }
                let columns = fieldDataObj[key].meta.columns
                let colIndex = 0
                for (let i = 0; i < columns; i++) {
                    if (fieldDataObj[key].meta.type === 'full') {
                        html += `<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 data-launch-field-container'>` 
                    }
                    else if (fieldDataObj[key].meta.type === 'custom') {
                        html += `<div class='${fieldDataObj[key].meta.classes[i]}'>` 
                    }
                    else {
                        html += `<div class='col-lg-4 col-md-6 col-sm-12 col-xs-12 data-launch-field-container'>` 
                    }                    
                    colIndex = i + 1
                    for (let t = 0; t < fieldDataObj[key].fields.length; t++) {
                        if (fieldDataObj[key].fields[t].column === colIndex) {
                            if (fieldDataObj[key].fields[t].type === 'text') {
                                html += `<div class='data-launch-input-field-container'>
                                          <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                          <input id="${fieldDataObj[key].fields[t].field}_val" placeholder="${fieldDataObj[key].fields[t].label}" type='text' data-launch-field="${fieldDataObj[key].fields[t].field}" value="${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable' ${fieldDataObj[key].fields[t].disabled ? 'disabled' : ''} data-editable>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'child_garage_ids-CUSTOM-DO-NOT-CHANGE') {
                                html += `<div class='data-launch-input-field-container'>
                                          <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                          <input id="${fieldDataObj[key].fields[t].field}_val" placeholder="${fieldDataObj[key].fields[t].label}" type='text' data-launch-field="${fieldDataObj[key].fields[t].field}" value="${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable' ${fieldDataObj[key].fields[t].disabled ? 'disabled' : ''} data-editable>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'spacer') {
                                html += `<div style='height: 20px' class='data-launch-empty-spacer'></div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'phone') {
                                html += `<div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val" placeholder='${fieldDataObj[key].fields[t].label}' type='phone' value="${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field]}" data-launch-field="${fieldDataObj[key].fields[t].field}" class='data-launch-input-field data-launch-field-editable' data-editable>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'email') {
                                html += ` <div class='data-launch-input-field-container'>
                                             <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                             <input id="${fieldDataObj[key].fields[t].field}_val" placeholder='${fieldDataObj[key].fields[t].label}' type='email' value="${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field]}" data-launch-field="${fieldDataObj[key].fields[t].field}" class='data-launch-input-field data-launch-field-editable' data-editable>
                                            <a style='position: relative; top: -40px; left: 89%;' href="mailto:${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field]}"><i class="bi bi-envelope"></i></a>
                                          </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'date') {
                                html += ` <div class='data-launch-input-field-container'>
                                             <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                             <input id="${fieldDataObj[key].fields[t].field}_val" placeholder='${fieldDataObj[key].fields[t].label}' type='date' value="${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field]}" data-launch-field="${fieldDataObj[key].fields[t].field}" class='data-launch-input-field data-launch-field-editable' data-editable>
                                           </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'multi-text') {
                                html += `<div class='data-launch-input-field-container data-launch-input-field-container-multi-line'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <textarea id="${fieldDataObj[key].fields[t].field}_val" class='data-launch-input-field-multi-line data-launch-field-editable' data-launch-field="${fieldDataObj[key].fields[t].field}" data-launch-field-editable">${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' :  rec[fieldDataObj[key].fields[t].field]}</textarea>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'checkbox') {
                                html += ` <div class='data-launch-input-field-container-checkbox'>
                                            <label class="data-launch-field-labels" `
                                        if (fieldDataObj[key].fields[t].hasOwnProperty("labelStyle")) {
                                            html += `style="${fieldDataObj[key].fields[t].labelStyle}"`
                                        }                                  
                                        html += `>${fieldDataObj[key].fields[t].label}</label>
                                            <input `
                                        if (fieldDataObj[key].fields[t].hasOwnProperty("style")) {
                                            html += `style="${fieldDataObj[key].fields[t].style}"`
                                        }                                            
                                        html +=   ` id="${fieldDataObj[key].fields[t].field}_val" type='checkbox' class='data-launch-input-field-checkbox data-launch-field-editable' data-launch-field="${fieldDataObj[key].fields[t].field}" ${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field] === 1 ? "checked" : ''}>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'record') {
                                // // console.log('rec[fieldDataObj[key].fields[t].field]', rec[fieldDataObj[key].fields[t].field])
                                html += `<div class='data-launch-input-field-container'>
                                          <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>`
                                if (rec[fieldDataObj[key].fields[t].field] === null || rec[fieldDataObj[key].fields[t].field] === 0) {
                                    html += `<button type="button" id="data-launch-promote-to-garage" class="btn btn-outline-primary data-launch-promote-to-garage" data-launch-rec="${rec.id}">Promote to Garage Record</button>
                                            <text id="${fieldDataObj[key].fields[t].field}_val" style='cursor: pointer; display: none; color: blue; font-weight: bold;' class='data-launch-garage-record-click data-launch-change-page' data-launch-menu-item="garage" data-launch-id=''></text>
                                    `
                                }
                                else {
                                    html += `<text id="${fieldDataObj[key].fields[t].field}_val" style='cursor: pointer; color: blue; font-weight: bold;' class='data-launch-testing-station-related-record-click data-launch-change-page' data-launch-menu-item="garage" data-launch-id='${rec[fieldDataObj[key].fields[t].field]}'>Testing Station Record - ${rec[fieldDataObj[key].fields[t].field]}</text>`
                                }
                                html += `</div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'archiveSystemLink') {
                                    html += `<div class='data-launch-input-field-container'>
                                    <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                    <button type="button" id="data-launch-archived-system" class="btn btn-outline-primary data-launch-redirect-to-archive-system">Navigate To Old VTS System</button>
                                    </div>
                                `
                            }
                            else if (fieldDataObj[key].fields[t].type === 'garagetesterssubgrid') {
                                html += `<div id='data-launch-garage-associated-testers-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'></div>
                                         `
                                         if (USER_RECORD.testers_create === 1) {
                                         html += `<button class='data-launch-associate-new-tester-record'>
                                                    <i class="bi bi-plus-circle"></i>Associate New Tester
                                                </button>`
                                         }
                            }
                            else if (fieldDataObj[key].fields[t].type === 'garageMotEquipmentSubgrid') {
                                html += `<div id='data-launch-garage-mot-equipment-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'>
                                         </div>`
                                if (USER_RECORD.mot_equipment_create === 1) {
                                    html += `
                                    <button class="data-launch-create-new-mot-equipment-record" data-launch-garage-id='${this.id}'>
                                       <i class="bi bi-plus-circle"></i> Add New MOT Equipment Record</button>
                                    `
                                }                                
                            }
                            else if (fieldDataObj[key].fields[t].type === 'garageMotCalibrationSubgrid') {
                                html += `<div id='data-launch-garage-mot-calibration-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'>
                                         </div>`
                                         if (USER_RECORD.mot_calibrations_create === 1) {
                                         html += `<button class="data-launch-create-new-mot-calibration-record" data-launch-garage-id='${this.id}'>
                                                    <i class="bi bi-plus-circle"></i> Add New MOT Calibration Record</button>`
                                         }
                            }

                            else if (fieldDataObj[key].fields[t].type === 'garageMotReconciliationSubgrid') {
                                html += `<div id='data-launch-garage-mot-reconciliation-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'>
                                         </div>`
                                         if (USER_RECORD.mot_reconciliations_create === 1) {
                                         html += `<button class="data-launch-create-new-mot-reconciliation-record" data-launch-garage-id='${this.id}'>
                                                    <i class="bi bi-plus-circle"></i> Add New MOT Reconciliation Record</button>`
                                         }
                            }
                            else if (fieldDataObj[key].fields[t].type === 'motSiteAuditsSubgrid') {
                                html += `<div id='data-launch-garage-mot-site-audits-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'>
                                         </div>`
                                         if (USER_RECORD.mot_site_audits_create === 1) {
                                         html += `<button class="data-launch-create-new-mot-site-audit-record" data-launch-garage-id='${this.id}'>
                                                    <i class="bi bi-plus-circle"></i> Add New MOT Site Audit Record</button>`
                                         }
                            }
                            else if (fieldDataObj[key].fields[t].type === 'qcCheckersSubgrid') {
                                html += `<div id='data-launch-garage-qc-checkers-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'>
                                         </div>`
                                         if (USER_RECORD.qc_checkers_create === 1) {
                                         html += `<button class="data-launch-create-new-qc-checkers-record" data-launch-garage-id='${this.id}'>
                                                    <i class="bi bi-plus-circle"></i>
                                                    Add New QC Checks (Group B) Record
                                                  </button>`
                                         }
                            }
                            else if (fieldDataObj[key].fields[t].type === 'tqiSubgrid') {
                                html += `<div id='data-launch-garage-tqi-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'>
                                         </div>`
                                         if (USER_RECORD.tqi_create === 1) {
                                         html += `<button class="data-launch-create-new-tqi-record" data-launch-garage-id='${this.id}'>
                                                    <i class="bi bi-plus-circle"></i>
                                                    Import New TQI Record
                                                  </button>`
                                         }
                            }
                            else if (fieldDataObj[key].fields[t].type === 'associatedGaragesSubgrid') {
                                html += `<div id='data-launch-garage-associated-garages-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'>
                                         </div>`
                                         if (USER_RECORD.full_user === 1) {
                                         html += `<button class="data-launch-associated-new-garage-record" data-launch-garage-id='${this.id}'>
                                                    <i class="bi bi-plus-circle"></i>
                                                    Create New Association
                                                  </button>`
                                         }
                            }
                            else if (fieldDataObj[key].fields[t].type === 'bookings') {
                                html += `<div id='data-launch-garage-bookings-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line data-launch-bookings-subgrid-cont'>
                                         </div>`
                                        //  if (USER_RECORD.bookings_create === 1) {
                                        //  html += `<button class="data-launch-create-new-booking-record" data-launch-garage-id='${this.id}'>
                                        //             <i class="bi bi-plus-circle"></i> Add New Booking Record</button>`
                                        //  }
                            }
                            else if (fieldDataObj[key].fields[t].type === 'remindersSubgrid') {
                                html += `<div id='data-launch-garage-reminders-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'>
                                         </div>
                                         <button class="data-launch-create-new-reminder-record" data-launch-garage-id='${this.id}'>
                                                <i class="bi bi-plus-circle"></i> Add New Reminder
                                        </button>
                                         `
                            }
                            else if (fieldDataObj[key].fields[t].type === 'defectReports') {
                                html += `<div id='data-launch-defect-reports-subgrid-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'>
                                         </div>`
                                         if (USER_RECORD.defect_reports_create === 1) {
                                         html += `<button class="data-launch-create-new-defect-report-record" data-launch-garage-id='${this.id}'>
                                                    <i class="bi bi-plus-circle"></i> Add New Defect Report</button>`
                                         }
                            }
                            else if (fieldDataObj[key].fields[t].type === 'users') {
                                html += `<div id='data-launch-users-subgrid-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'>
                                         </div>`
                                         if (USER_RECORD.garage_users_create === 1) {
                                         html += `<button class="data-launch-create-new-user-record" data-launch-garage-id='${this.id}'>
                                                    <i class="bi bi-plus-circle"></i> Add New User</button>`
                                         }
                            }
                            else if (fieldDataObj[key].fields[t].type === 'bays') {
                                html += `<div id='data-launch-bays-subgrid-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'>
                                         </div>`
                                         if (USER_RECORD.full_user === 1) {
                                         html += `<button class="data-launch-create-new-bay-record" data-launch-garage-id='${this.id}'>
                                                    <i class="bi bi-plus-circle"></i> Add New Bay</button>`
                                         }
                            }
                            else if (fieldDataObj[key].fields[t].type === 'motBayCleaning') {
                                html += `<div id='data-launch-mot-bay-cleaning-subgrid-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'>
                                         </div>`
                                         if (USER_RECORD.mot_bay_cleaning_log_create === 1) {
                                         html += `<button class="data-launch-create-new-mot-bay-cleaning-record" data-launch-garage-id='${this.id}'>
                                                    <i class="bi bi-plus-circle"></i> Add New MOT Bay Cleaning Record</button>`
                                         }
                            }
                            else if (fieldDataObj[key].fields[t].type === 'qcCheckersForBikes') {
                                html += `<div id='data-launch-qc-checkers-for-bikes-subgrid-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'>
                                         </div>`
                                         if (USER_RECORD.qc_checkers_for_bikes_create === 1) {
                                         html += `<button class="data-launch-create-new-qc-checkers-for-bikes-record" data-launch-garage-id='${this.id}'>
                                                    <i class="bi bi-plus-circle"></i> Add New QC Checks (Group A) Record</button>`
                                         }
                            }
                            else if (fieldDataObj[key].fields[t].type === 'subgrid') {
                                html += `<table class="table table-hover data-launch-table-clickable-row">
                                            <thead>
                                                <tr>`
                                fieldDataObj[key].fields[t].fieldLabels.forEach(label => {
                                    html +=         `<th scope="col">${label}</th>`
                                })
                                html += `       </tr>
                                            </thead>
                                        <tbody>`
                                rec[fieldDataObj[key].fields[t].array].forEach(row => {
                                    html += `<tr>`                       
                                    fieldDataObj[key].fields[t].field.forEach(field => {
                                        html += `<td>${row[field]}</td>`
                                    })
                                    html += `</tr>`
                                })
                                html += `</tbody>
                                    </table>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'googleMaps') {
                                let googleMapsString = ''
                                for (let j = 0; j < fieldDataObj[key].fields[t].field.length; j++) {
                                    if (fieldDataObj[key].fields[t].field[j].name === 'Address1' ) {
                                        googleMapsString += `${rec[fieldDataObj[key].fields[t].field[j].fieldName]}$20`
                                    }
                                    else if (fieldDataObj[key].fields[t].field[j].name === 'Address2' ) {
                                        googleMapsString += `${rec[fieldDataObj[key].fields[t].field[j].fieldName]}$20`
                                    }
                                    else if (fieldDataObj[key].fields[t].field[j].name === 'Address3' ) {
                                        googleMapsString += `${rec[fieldDataObj[key].fields[t].field[j].fieldName]},`
                                    }
                                    else if (fieldDataObj[key].fields[t].field[j].name === 'City' ) {
                                        googleMapsString += `$20${rec[fieldDataObj[key].fields[t].field[j].fieldName]},`
                                    }
                                    else if (fieldDataObj[key].fields[t].field[j].name === 'County' ) {
                                        googleMapsString += `$20${rec[fieldDataObj[key].fields[t].field[j].fieldName]},`
                                    }
                                    else if (fieldDataObj[key].fields[t].field[j].name === 'Postcode' ) {
                                        googleMapsString += `$20${rec[fieldDataObj[key].fields[t].field[j].fieldName]}`
                                    }
                                }
                                html += `<div style="width: 100%">
                                            <iframe width="100%" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=${googleMapsString}+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/">gps devices</a></iframe>            
                                        </div>`
                            }
                        }
                    }
                    html += `</div>`            
                }
                html += `</div>`
            }
        }
        else {
            for (const key in fieldDataObj) {
                if (firstIteration) {
                    html += `<div class='data-launch-garages-screen row active' id='data-launch-garages-${fieldDataObj[key].meta.name}'>`
                    firstIteration = false
                }
                else {
                    html += `<div class='data-launch-garages-screen row' id='data-launch-garages-${fieldDataObj[key].meta.name}'>`
                }
                let columns = fieldDataObj[key].meta.columns
                let colIndex = 0
                for (let i = 0; i < columns; i++) {
                    html += `<div class='col-lg-4 col-md-6 col-sm-12 col-xs-12 data-launch-field-container'>` 
                    colIndex = i + 1
                    for (let t = 0; t < fieldDataObj[key].fields.length; t++) {
                        if (fieldDataObj[key].fields[t].column === colIndex) {
                            if (fieldDataObj[key].fields[t].type === 'text') {
                                html += `<div class='data-launch-input-field-container'>
                                          <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                          <input id="${fieldDataObj[key].fields[t].field}_val" placeholder="${fieldDataObj[key].fields[t].label}" type='text' data-launch-field="${fieldDataObj[key].fields[t].field}" value="" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'spacer') {
                                html += `<div style='height: 20px' class='data-launch-empty-spacer'></div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'phone') {
                                html += `<div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val" placeholder='${fieldDataObj[key].fields[t].label}' type='phone' value="" data-launch-field="${fieldDataObj[key].fields[t].field}" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'email') {
                                html += ` <div class='data-launch-input-field-container'>
                                             <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                             <input id="${fieldDataObj[key].fields[t].field}_val" placeholder='${fieldDataObj[key].fields[t].label}' type='email' value="" data-launch-field="${fieldDataObj[key].fields[t].field}" class='data-launch-input-field data-launch-field-editable'>
                                          </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'date') {
                                html += ` <div class='data-launch-input-field-container'>
                                             <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                             <input id="${fieldDataObj[key].fields[t].field}_val" placeholder='${fieldDataObj[key].fields[t].label}' type='date' value="" data-launch-field="${fieldDataObj[key].fields[t].field}" class='data-launch-input-field data-launch-field-editable'>
                                           </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'multi-text') {
                                html += `<div class='data-launch-input-field-container data-launch-input-field-container-multi-line'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <textarea  id="${fieldDataObj[key].fields[t].field}_val" class='data-launch-input-field-multi-line data-launch-field-editable' data-launch-field="${fieldDataObj[key].fields[t].field}" data-launch-field-editable"></textarea>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'checkbox') {
                                html += ` <div class='data-launch-input-field-container-checkbox'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val" type='checkbox' class='data-launch-input-field-checkbox data-launch-field-editable' data-launch-field="${fieldDataObj[key].fields[t].field}" checked="">
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'record') {
                                html += `<div class='data-launch-input-field-container'>
                                          <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>`
                                html += `</div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'subgrid') {
                                html += `<table class="table table-hover data-launch-table-clickable-row"></table>`
                            }                            
                        }
                    }
                    html += `</div>`            
                }
                html += `</div>`
            }
        }
        return html
    }

    openForm = (bool, rec) => {
        currentPage = 'Garages'
        let html = ''
        document.getElementById('data-launch-side-bar').classList.remove('data-launch-activate-menu')
        if (rec) {
            this.newRecord = false
            this.recordId = rec.id
            this.currentGarageRecord = rec
            this.id = rec.id
            this.garageScheduledOpeningDays = []
            if (rec["open_on_monday"] === 1) {this.garageScheduledOpeningDays.push('Monday')}
            if (rec["open_on_tuesday"] === 1) {this.garageScheduledOpeningDays.push('Tuesday')}
            if (rec["open_on_wednesday"] === 1) {this.garageScheduledOpeningDays.push('Wednesday')}
            if (rec["open_on_thursday"] === 1) {this.garageScheduledOpeningDays.push('Thursday')}
            if (rec["open_on_friday"] === 1) {this.garageScheduledOpeningDays.push('Friday')}
            if (rec["open_on_saturday"] === 1) {this.garageScheduledOpeningDays.push('Saturday')}
            if (rec["open_on_sunday"] === 1) {this.garageScheduledOpeningDays.push('Sunday')}

            if (rec["opening_hours_start_garage"]) {this.garageOperatingHours.start = rec["opening_hours_start_garage"].slice(0, 2)}
            if (rec["opening_hours_end_garage"]) {this.garageOperatingHours.end = rec["opening_hours_end_garage"].slice(0, 2)}
            html = `
            
            <div id="garageSidebar" class="sleek-sidebar">
                <nav class="nav-links" style="overflow-y: scroll;height: 91vh;">
                    <button class="data-launch-garage-menu-toggle-trigger data-launch-garage-side-menu-window-close-button">X</button>
                    ${this.buildFormMenu()}
                </nav>
            </div>
            <div id="data-launch-garage-menu-toggle" class="sidebar-toggle data-launch-garage-menu-toggle-trigger">
                <i class="bi bi-list data-launch-garage-menu-toggle-trigger"></i>
            </div>



            <div id="data-launch-saved-record-banner" class="data-launch-saved-record-banner-alert">Record Saved Successfully</div>      
            <div id="garage-screen-overlay-${this.id}" style="display:none" class="garage-screen-overlay"></div>
            <div id="data-launch-modal-window-query-if-user-wants-to-save-container_${this.id}" style="display: none" class="data-launch-modal-window-query-if-user-wants-to-save-overlay">
                <div class="data-launch-modal-window-query-if-user-wants-to-save-content">
                    <span class="data-launch-modal-window-query-if-user-wants-to-save-close-btn">&times;</span>
                    <h2>Save Changes?</h2>
                    <p>Do you want to save the previous record before proceeding?</p>
                    <div class="data-launch-modal-window-query-if-user-wants-to-save-buttons">
                    <button id="data-launch-modal-window-query-if-user-wants-to-save-yes" class="data-launch-modal-window-query-if-user-wants-to-save-btn data-launch-modal-window-query-if-user-wants-to-save">Save</button>
                    <button id="data-launch-modal-window-query-if-user-wants-to-save-no" class="data-launch-modal-window-query-if-user-wants-to-save-btn data-launch-modal-window-query-if-user-wants-to-not-save">Don't Save</button>
                    </div>
                </div>
            </div>
            <div class="data-launch-special-notice-container" id="data-launch-special-notice-container_${this.id}"></div>

            <div id="associateNewGarageRecordsModal" class="garage-record-associate-garages-modal-popup">
                <div class="garage-record-associated-garages-modal-content">
                    <span class="garage-record-associated-garages-close">&times;</span>
                    <h2 class="garage-record-associated-testers-header">Select a Garage</h2>
                    <input type="text" id="garageAssociatedGaragesSearchInput" class="garage-record-associated-testers-search-input" placeholder="Search by Garage ID...">
                    <table id="garageAssociatedGaragesTable" class="garage-record-associated-testers-table">
                        <thead>
                            <tr>
                                <th>Garage Name</th>
                                <th>Garage ID</th>
                            </tr>
                        </thead>
                        <tbody id="garageAssociatedGaragesTableBody">
                        </tbody>
                    </table>
                    <button id="data-launch-garage-associate-new-garage-ok" class="data-launch-garage-associate-new-garage-ok">Submit</button>
                </div>
            </div>

            
            <div id="data_launch_garage_create_new_tester_modal_dialogue" class="data_launch_garage_create_new_tester_modal_dialogue">
                <div class="data_launch_garage_create_new_tester_modal_box">
                    <button class="data_launch_garage_create_new_tester_modal_close_button">X</button>
                    <h2 class="data_launch_garage_create_new_tester_modal_heading">Create New Tester</h2>

                    <div class="data_launch_garage_create_new_tester_modal_input_group">
                    <label for="data_launch_garage_create_new_tester_modal_testerFirstName">First Name</label>
                    <input type="text" id="data_launch_garage_create_new_tester_modal_testerFirstName" placeholder="Enter first name" />
                    </div>

                    <div class="data_launch_garage_create_new_tester_modal_input_group">
                    <label for="data_launch_garage_create_new_tester_modal_testerLastName">Last Name</label>
                    <input type="text" id="data_launch_garage_create_new_tester_modal_testerLastName" placeholder="Enter last name" />
                    </div>

                    <div class="data_launch_garage_create_new_tester_modal_input_group">
                    <label for="data_launch_garage_create_new_tester_modal_testerPhone">Main Phone</label>
                    <input type="text" id="data_launch_garage_create_new_tester_modal_testerPhone" placeholder="Enter phone number" />
                    </div>

                    <div class="data_launch_garage_create_new_tester_modal_input_group">
                    <label for="data_launch_garage_create_new_tester_modal_testerEmail">Email</label>
                    <input type="email" id="data_launch_garage_create_new_tester_modal_testerEmail" placeholder="Enter email address" />
                    </div>

                    <div class="data_launch_garage_create_new_tester_modal_input_group">
                    <label for="data_launch_garage_create_new_tester_modal_testerUserId">User ID</label>
                    <input type="text" id="data_launch_garage_create_new_tester_modal_testerUserId" placeholder="Enter user ID" />
                    </div>

                    <button class="data_launch_garage_create_new_tester_modal_confirm_button">
                    Confirm Creation of New Tester Record
                    </button>
                </div>
            </div>


            <div class='container-fluid'>
                            <div class='row'>
                                <div class="garages-document-upload-popup-window" id="garages-document-upload-popup-window">
                                    <div id="garage-mot-calibration-new-document-window-v2-modal" class="garage-mot-calibration-new-document-window-v2-modal">
                                        <div class="garage-mot-calibration-new-document-window-v2-modal-content">
                                            <button class="garage-mot-calibration-new-document-window-v2-close-button">X</button>
                                            <h2>Upload Your File</h2>
                                            <form id="uploadForm_${this.id}" enctype="multipart/form-data">
                                            <input type="file" id="fileInput_${this.id}" name="file" required />
                                            <button class="garages-document-upload-button">Upload</button>
                                        </form>
                                        </div>
                                    </div>                                    
                                </div>

                                <div class='data-launch-modal-popup' id='cartqiPageModalPopup_${this.id}' style='display: none'></div>
                                <div class='data-launch-screen-overlay' style='display:none' id='cartqiPageScreenOverlay_${this.id}'></div>

                                <div id="garages-mot-calibration-large-image-preview-window_${this.id}" style="display:none" class="garages-mot-calibration-large-image-preview-window">
                                    <img id="garages-mot-calibration-img_${this.id}" class="garages-mot-calibration-images-preview">
                                    <h1 id="garages-mot-calibration-filename_${this.id}" class="garages-mot-calibration-images-filename"></h1>
                                    <a id="garages-mot-calibration-anchor_${this.id}" href=""><button class="garages-mot-calibration-download-image">Download</button></a>
                                    <button class="garages-mot-calibration-image-preview-window-close-button">Close</button>
                                </div>
                                <div id="qcCheckerForBikeModal" class="qc-checker-modal-popup">
                                    <div class="qc-checker-modal-content qc-checker-for-bikes-modal-content">
                                        <span class="qc-checker-for-bike-close">&times;</span>
                                        <button class="data-launch-qc-checker-for-bikes-print-details">Print  <i class="bi bi-printer"></i></button>
                                        <h2 style="text-align: center;">QC Checks For Group A</h2>

                                        <!-- Tab Navigation -->
                                        <div class="tabs">
                                            <button class="tab-button active" onclick="openTab(event, 'SummaryBike', 'qcCheckerForBikeModal')">Summary</button>
                                            <button class="tab-button" onclick="openTab(event, 'PreChecksBike', 'qcCheckerForBikeModal')">Pre Checks</button>
                                            <button class="tab-button" onclick="openTab(event, 'SatOnVehicleBike', 'qcCheckerForBikeModal')">Sat on Vehicle</button>
                                            <button class="tab-button" onclick="openTab(event, 'FrontOfVehicleBike', 'qcCheckerForBikeModal')">Front of Vehicle</button>
                                            <button class="tab-button" onclick="openTab(event, 'FrontOfVehicleRaisedBike', 'qcCheckerForBikeModal')">Front of Vehicle Raised</button>
                                            <button class="tab-button" onclick="openTab(event, 'OffsideOfVehicleBike', 'qcCheckerForBikeModal')">Offside</button>
                                            <button class="tab-button" onclick="openTab(event, 'RearOfVehicleBike', 'qcCheckerForBikeModal')">Rear of Vehicle</button>
                                            <button class="tab-button" onclick="openTab(event, 'NearsideOfVehicleBike', 'qcCheckerForBikeModal')">Nearside</button>
                                            <button class="tab-button" onclick="openTab(event, 'RearOfVehicleRaisedBike', 'qcCheckerForBikeModal')">Rear of Vehicle Raised</button>
                                            <button class="tab-button" onclick="openTab(event, 'BrakePerformanceBike', 'qcCheckerForBikeModal')">Brake Performance</button>
                                            <button class="tab-button" onclick="openTab(event, 'NotesConfirmationBike', 'qcCheckerForBikeModal')">Notes & Confirmation</button>
                                        </div>

                                        <!-- Summary Section -->
                                        <div id="SummaryBike" class="tab-content active">
                                            <label for="testerName">Tester Name:</label>
                                            <select class="qc-checker-for-group-b-tester-select" id="testerName">
                                            </select><br>
                                            
                                            <label for="testerID">Tester ID:</label>
                                            <input type="text" id="testerID" readonly disabled>
                                            
                                            <label for="vehicleReg">Vehicle Reg:</label>
                                            <input type="text" id="vehicleReg_qcBikes">
                                            
                                            <label for="dateOfQC_bikes">Date of QC:</label>
                                            <input type="date" id="dateOfQC_bikes">
                                            
                                            <label for="qcCarriedOutBy">QC Carried out by:</label>
                                            <input type="text" id="qcCarriedOutBy">
                                            
                                            <label for="vehicleClass">Vehicle Class:</label>
                                            <input type="text" id="vehicleClass">
                                            
                                            <label for="nameQCChecker">Name QC Checker:</label>
                                            <input type="text" id="nameQCChecker">
                                        </div>

                                        <!-- Pre Checks Section -->
                                        <div id="PreChecksBike" class="tab-content">
                                            <label for="overallConditionOfVehicle">Overall condition of presented vehicle:</label>
                                            <input type="checkbox" id="overallConditionOfVehicle">
                                            
                                            <label for="doesFuelCapOpen">Does the fuel cap open:</label>
                                            <input type="checkbox" id="doesFuelCapOpen">
                                            
                                            <label for="chassisNumberTaken">Chassis number taken directly from presented vehicle:</label>
                                            <input type="checkbox" id="chassisNumberTaken">
                                            
                                            <label for="registrationNumberTaken">Registration number taken directly from presented vehicle:</label>
                                            <input type="checkbox" id="registrationNumberTaken">
                                            
                                            <label for="vehicleCorrectlyRegistered">Presented vehicle correctly registered for test:</label>
                                            <input type="checkbox" id="vehicleCorrectlyRegistered">
                                        </div>

                                        <!-- Sat on Vehicle Section -->
                                        <div id="SatOnVehicleBike" class="tab-content">
                                            <label for="handlebarsChecked">Handlebars Checked:</label>
                                            <input type="checkbox" id="handlebarsChecked">
                                            
                                            <label for="brakeLeversPedalsChecked">Applicable brake levers and/or pedals checked:</label>
                                            <input type="checkbox" id="brakeLeversPedalsChecked">

                                            <label for="brake_pedal_servo_operation_checked">Brake Pedal Servo Operation Checked:</label>
                                            <input type="checkbox" id="brake_pedal_servo_operation_checked">
                                            
                                            <label for="acceleratorChecked">Accelerator checked:</label>
                                            <input type="checkbox" id="acceleratorChecked">
                                            
                                            <label for="clutchLeverChecked">Clutch lever checked:</label>
                                            <input type="checkbox" id="clutchLeverChecked">
                                            
                                            <label for="steeringHeadBearingsChecked">Steering head bearings and locking devices checked:</label>
                                            <input type="checkbox" id="steeringHeadBearingsChecked">
                                            
                                            <label for="hornOperationChecked">Operation of horn checked:</label>
                                            <input type="checkbox" id="hornOperationChecked">
                                            
                                            <label for="frontSuspensionBounceChecked">Bounce check carried out on front suspension:</label>
                                            <input type="checkbox" id="frontSuspensionBounceChecked">
                                            
                                            <label for="rearSuspensionBounceChecked">Bounce check carried out on rear suspension:</label>
                                            <input type="checkbox" id="rearSuspensionBounceChecked">
                                        </div>

                                        <!-- Front of Vehicle Section -->
                                        <div id="FrontOfVehicleBike" class="tab-content">
                                            <label for="frontPositionLampsCondition">Condition of front position lamps checked:</label>
                                            <input type="checkbox" id="frontPositionLampsCondition">
                                            
                                            <label for="lampHousingUnitsCondition">Condition of lamp housing units checked:</label>
                                            <input type="checkbox" id="lampHousingUnitsCondition">
                                            
                                            <label for="frontDirectionLampsCondition">Condition of front direction lamps checked:</label>
                                            <input type="checkbox" id="frontDirectionLampsCondition">
                                            
                                            <label for="frontSuspensionComponentsCondition">Condition of front suspension components checked:</label>
                                            <input type="checkbox" id="frontSuspensionComponentsCondition">
                                            
                                            <label for="brakeMasterCylinderCondition">Condition of brake master cylinder and reservoir checked:</label>
                                            <input type="checkbox" id="brakeMasterCylinderCondition">
                                            
                                            <label for="fairingsBodyPanelsCondition">Condition of fairings and body panels checked:</label>
                                            <input type="checkbox" id="fairingsBodyPanelsCondition">
                                        </div>

                                        <!-- Front of Vehicle Raised Section -->
                                        <div id="FrontOfVehicleRaisedBike" class="tab-content">
                                            <label for="steeringCondition">Condition of steering checked:</label>
                                            <input type="checkbox" id="steeringCondition">
                                            
                                            <label for="suspensionComponentsCondition">Condition of suspension components checked:</label>
                                            <input type="checkbox" id="suspensionComponentsCondition">
                                            
                                            <label for="wheelsCondition">Condition of wheels checked:</label>
                                            <input type="checkbox" id="wheelsCondition">
                                            
                                            <label for="wheelBearingCondition">Condition of wheel bearing checked:</label>
                                            <input type="checkbox" id="wheelBearingCondition">
                                            
                                            <label for="frontTyreCondition">Condition of front tyre checked:</label>
                                            <input type="checkbox" id="frontTyreCondition">
                                            
                                            <label for="frontBrakeCondition">Condition of front brake checked:</label>
                                            <input type="checkbox" id="frontBrakeCondition">
                                        </div>

                                        <!-- Offside of Vehicle Section -->
                                        <div id="OffsideOfVehicleBike" class="tab-content">
                                            <label for="frameCondition">Condition of frame (including welds) checked:</label>
                                            <input type="checkbox" id="frameCondition">
                                            
                                            <label for="seatingCondition">Condition of seating checked:</label>
                                            <input type="checkbox" id="seatingCondition">
                                            
                                            <label for="footRestCondition">Condition of foot rest checked:</label>
                                            <input type="checkbox" id="footRestCondition">
                                            
                                            <label for="rearSuspensionComponentsConditionOffside">Condition of rear suspension components checked:</label>
                                            <input type="checkbox" id="rearSuspensionComponentsConditionOffside">
                                            
                                            <label for="finalDriveComponentsCondition">Condition of final drive components checked:</label>
                                            <input type="checkbox" id="finalDriveComponentsCondition">
                                            
                                            <label for="exhaustSystemCondition">Condition of exhaust system checked:</label>
                                            <input type="checkbox" id="exhaustSystemCondition">
                                            
                                            <label for="fuelSystemCondition">Condition of fuel system checked:</label>
                                            <input type="checkbox" id="fuelSystemCondition">
                                            
                                            <label for="rearTyreConditionOffside">Condition of rear tyre checked:</label>
                                            <input type="checkbox" id="rearTyreConditionOffside">
                                            
                                            <label for="rearBrakeCondition">Condition of rear brake checked:</label>
                                            <input type="checkbox" id="rearBrakeCondition">
                                        </div>

                                        <!-- Rear of Vehicle Section -->
                                        <div id="RearOfVehicleBike" class="tab-content">
                                            <label for="rearLightsCondition">Condition of rear lights checked:</label>
                                            <input type="checkbox" id="rearLightsCondition">
                                            
                                            <label for="stopLampsCondition">Condition of stop lamps checked:</label>
                                            <input type="checkbox" id="stopLampsCondition">
                                            
                                            <label for="rearDirectionLampsCondition">Condition of rear direction lamps checked:</label>
                                            <input type="checkbox" id="rearDirectionLampsCondition">
                                            
                                            <label for="rearReflectorCondition">Condition of rear reflector checked:</label>
                                            <input type="checkbox" id="rearReflectorCondition">
                                            
                                            <label for="registrationPlateLampsCondition">Condition of registration plate and lamps checked:</label>
                                            <input type="checkbox" id="registrationPlateLampsCondition">
                                            
                                            <label for="wheelAlignmentChecked">Wheel alignment checked:</label>
                                            <input type="checkbox" id="wheelAlignmentChecked">
                                        </div>

                                        <!-- Nearside of Vehicle Section -->
                                        <div id="NearsideOfVehicleBike" class="tab-content">
                                            <label for="nearsideFrameCondition">Condition of frame (including welds) checked:</label>
                                            <input type="checkbox" id="nearsideFrameCondition">
                                            
                                            <label for="nearsideSeatingCondition">Condition of seating checked:</label>
                                            <input type="checkbox" id="nearsideSeatingCondition">
                                            
                                            <label for="nearsideFootRestCondition">Condition of foot rest checked:</label>
                                            <input type="checkbox" id="nearsideFootRestCondition">
                                            
                                            <label for="nearsideRearSuspensionComponentsCondition">Condition of rear suspension components checked:</label>
                                            <input type="checkbox" id="nearsideRearSuspensionComponentsCondition">
                                            
                                            <label for="nearsideFinalDriveComponentsCondition">Condition of final drive components checked:</label>
                                            <input type="checkbox" id="nearsideFinalDriveComponentsCondition">
                                            
                                            <label for="nearsideExhaustSystemCondition">Condition of exhaust system checked:</label>
                                            <input type="checkbox" id="nearsideExhaustSystemCondition">
                                            
                                            <label for="nearsideFuelSystemCondition">Condition of fuel system checked:</label>
                                            <input type="checkbox" id="nearsideFuelSystemCondition">
                                            
                                            <label for="nearsideRearTyreCondition">Condition of rear tyre checked:</label>
                                            <input type="checkbox" id="nearsideRearTyreCondition">
                                            
                                            <label for="nearsideRearBrakeCondition">Condition of rear brake checked:</label>
                                            <input type="checkbox" id="nearsideRearBrakeCondition">
                                        </div>

                                        <!-- Rear of Vehicle Raised Section -->
                                        <div id="RearOfVehicleRaisedBike" class="tab-content">
                                            <label for="rearWheelsCondition">Condition of wheels checked:</label>
                                            <input type="checkbox" id="rearWheelsCondition">
                                            
                                            <label for="rearWheelBearingCondition">Condition of wheel bearing checked:</label>
                                            <input type="checkbox" id="rearWheelBearingCondition">
                                            
                                            <label for="rearSuspensionComponentsCondition">Condition of suspension components checked:</label>
                                            <input type="checkbox" id="rearSuspensionComponentsCondition">
                                            
                                            <label for="rearTyreCondition">Condition of rear tyre checked:</label>
                                            <input type="checkbox" id="rearTyreCondition">
                                        </div>

                                        <!-- Brake Performance Section -->
                                        <div id="BrakePerformanceBike" class="tab-content">
                                            <label for="brakePerformanceChecked">Brake performance checked:</label>
                                            <input type="checkbox" id="brakePerformanceChecked">
                                            
                                            <label for="brakePerformanceResultsRecorded">Brake performance results correctly recorded:</label>
                                            <input type="checkbox" id="brakePerformanceResultsRecorded">
                                        </div>

                                        <!-- Notes & Confirmation Section -->
                                        <div id="NotesConfirmationBike" class="tab-content">
                                            <label for="notes">Notes:</label>
                                            <textarea id="notes"></textarea><br>

                                            <label for="confirmedByTester">Confirmed by Tester:</label>
                                            <input type="checkbox" id="confirmedByTester"><br>

                                            <input type="hidden" id="qcCheckerForBikeRecordId">
                                        </div>

                                        <button class="data-launch-save-qc-checkers-for-bike-btn">Save</button>
                                    </div>
                                </div>

                                    <!-- Delete Confirmation Modal -->
                                    <div id="delModal" class="del-confirmation-modal">
                                        <div class="del-confirmation-modal__box">
                                           <i class="bi bi-exclamation-circle-fill" style="
                                                                                            position: relative;
                                                                                            float: left;
                                                                                            left: 0px;
                                                                                            color: red;
                                                                                            font-size: 26px;
                                                                                            top: -10px;
                                                                                        "></i>
                                        <h2 class="del-confirmation-modal__heading">Delete Record</h2>
                                        <i class="bi bi-exclamation-circle-fill" style="
                                                                                            position: relative;
                                                                                            float: right;
                                                                                            /* left: 0px; */
                                                                                            color: red;
                                                                                            font-size: 26px;
                                                                                            top: -10px;
                                                                                        "></i>
                                                                                        <br>
                                        <h3 class="del-confirmation-modal__message">
                                            Are you sure you want to proceed with deleting <strong>X</strong> record?</h3>
                                        <h4>Once you perform this operation, it cannot be undone.</h4>
                                        <div class="del-confirmation-modal__actions">
                                            <button class="del-confirmation-modal__btn del-confirmation-modal__btn--confirm" id="confirmDelete">Delete</button>
                                            <button class="del-confirmation-modal__btn del-confirmation-modal__btn--cancel" id="cancelDelete">Cancel</button>
                                        </div>
                                        </div>
                                    </div>


                                    <!-- Duplicate Booking Confirmation Modal -->
                                    <div id="duplicateBookingModal" class="del-confirmation-modal">
                                        <div class="del-confirmation-modal__box">
                                           <i class="bi bi-info-circle-fill" style="
                                                                                            position: relative;
                                                                                            float: left;
                                                                                            left: 0px;
                                                                                            color:#2eb9fb;
                                                                                            font-size: 26px;
                                                                                            top: -10px;
                                                                                        "></i>
                                        <h2 class="del-confirmation-modal__heading">Duplicate Record</h2>
                                        <i class="bi bi-info-circle-fill" style="
                                                                                            position: relative;
                                                                                            float: right;
                                                                                            /* left: 0px; */
                                                                                            color: #2eb9fb;
                                                                                            font-size: 26px;
                                                                                            top: -10px;
                                                                                        "></i>
                                                                                        <br>
                                        <h3 class="del-confirmation-modal__message">
                                            Are you sure you want to proceed with duplicating this record?</h3>
                                        <h4>Once you perform this operation, it cannot be undone.</h4>
                                        <div class="del-confirmation-modal__actions">
                                            <button class="del-confirmation-modal__btn del-confirmation-modal__btn--confirmDuplicate" id="confirmDuplicate">Confirm</button>
                                            <button class="del-confirmation-modal__btn del-confirmation-modal__btn--cancelDuplicate" id="cancelDuplicate">Cancel</button>
                                        </div>
                                        </div>
                                    </div>




                                <div id="motCalibrationModal" style="display: none;" class="modal mot-calibration-modal-popup">
                                    <div class="modal-content mot-calibration-modal-content">
                                        <span class="mot-calibration-close">&times;</span>
                                        <h2>MOT Calibration</h2>
                                        
                                        <!-- Tab Navigation -->
                                        <div class="tabs">
                                            <button class="tab-button active" onclick="openTab(event, 'MotCalibrationDetailsSection', 'motCalibrationModal')">Details</button>
                                            <button class="tab-button" onclick="openTab(event, 'MotCalibrationNotesSection', 'motCalibrationModal')">Notes</button>
                                        </div>

                                        <!-- Tab Content -->
                                        <div id="MotCalibrationDetailsSection" class="tab-content active">
                                            <br>
                                            <label for="mot_equipment_type">Equipment Type:</label>
                                            <select id="mot_equipment_type" class="data-launch-mot-calibration-record-equipment-select"></select>
                                            <br><br>
                                            <div class="data-launch-mot-equipment-half-pane">
                                                <label for="mot_make">Make:</label>
                                                <input type="text" id="mot_make" readonly disabled>
                                            </div>
                                            <div class="data-launch-mot-equipment-half-pane">
                                                <label for="mot_model">Model:</label>
                                                <input type="text" id="mot_model" readonly disabled>
                                            </div>
                                            <label for="mot_serial_no">Serial No.:</label>
                                            <input type="text" id="mot_serial_no" readonly disabled>
                                            <div class="data-launch-mot-equipment-half-pane">
                                                <label for="mot_bay">Bay:</label>
                                                <input type="text" id="mot_bay" readonly disabled>
                                            </div>
                                            <div class="data-launch-mot-equipment-half-pane">     
                                                <label for="mot_calibration_recommended_frequency">Required Frequency:</label>
                                                <input type="text" readonly disabled id="mot_calibration_recommended_frequency">
                                            </div>
                                            <div class="data-launch-mot-equipment-half-pane">                           
                                                <label for="mot_calibration_date">Calibration Date:</label>
                                                <input class="mot-calibration-modal-calibration-date-field" type="date" id="mot_calibration_date">
                                            </div>
                                            <div class="data-launch-mot-equipment-half-pane">
                                                <label for="mot_calibration_expiry_date">Calibration Expiry Date:</label>
                                                <input type="date" id="mot_calibration_expiry_date">
                                            </div>
                                            <label id="garageMotCalibrationUploadDocumentButtonLabel_${this.id}" for="garagesMotCalibrationDocumentUpload">Document Upload</label>
                                            <button id="garageMotCalibrationUploadDocumentButton_${this.id}" class='data-launch-upload-garages-mot-calibration-document'>Upload</button>
                                            <table class="table table-hover" style="display:none" id="garageMotCalibrationsDocuments${this.id}">
                                                <thead>
                                                    <tr>
                                                        <th style='width: 30%'>Name</th>
                                                        <th style='width: 30%'>Preview</th>
                                                        <th style='width: 10%'></th>
                                                    </tr>
                                                </thead>
                                                <tbody id="garageMotCalibrationsDocumentsTableBody_${this.id}"></tbody>
                                            </table>
                                        </div>

                                        <div id="MotCalibrationNotesSection" class="tab-content">
                                            <label for="mot_notes">Notes:</label>
                                            <textarea id="mot_notes"></textarea><br>
                                        </div>

                                        <div id="MotCalibrationImagesSection" class="tab-content">
                                            <div id="mot_image_container" style="display: none;">
                                                <!-- Images would be dynamically inserted here -->
                                            </div>
                                        </div>
                                        
                                        <span style="display: none"><input id="motCalibrationRecordId" type="text" value=""></span>
                                        
                                        <h4 id="garageMotCalibrationUploadBanner_${this.id}" style='text-align:center'><b>Please Note</b>: <br> Documents & Images can be uploaded once the MOT Calibration Record has been Saved</h4>
                                        <br>
                                        <button class="data-launch-save-mot-calibration-btn" id="saveMotCalibrationButton">Save</button>
                                    </div>
                                </div>



                                <div id="motBayCleaningLogModal" style="display: none" class="mot-bay-cleaning-log-modal-popup">
                                    <div class="mot-bay-cleaning-log-modal-content">
                                        <span class="mot-bay-cleaning-log-close">&times;</span>
                                        <h2>MOT Bay Cleaning Log</h2>
                                        
                                        <!-- Cleaning Log Details Section -->
                                        <div class="tab-content active">
                                            <label for="date">Date:</label>
                                            <input type="date" id="date" name="date">

                                            <label for="signed">Signed:</label>
                                            <input type="text" id="signed" name="signed">

                                            <label for="description">Description:</label>
                                            <textarea id="description" name="description"></textarea>

                                            <span style="display: none"><input id="motBayCleaningLogRecordId" type="text" value=""></span>
                                        </div>

                                        <button class="data-launch-save-mot-bay-cleaning-log-btn" id="saveMotBayCleaningLogButton">Save</button>
                                    </div>
                                </div>

                                <div id="garageBaysModal" style="display: none" class="bays-modal-popup">
                                    <div class="data-launch-garage-bays-modal-content">
                                        <span class="data-launch-garage-bays-close">&times;</span>
                                        <h2>MOT Bay</h2>
                                        <div style="height:1px; width: 100%; color:grey; background-color:grey; border-bottom: 1px solid grey"></div>
                                        <br>
                                        <!-- bay details Section -->
                                        <div>
                                            <label for="name">Name:</label>
                                            <input type="text" id="data-launch-garage-bay-modal-name-val" name="name">

                                            <label for="motbay">MOT Bay?</label>
                                            <input type="checkbox" id="data-launch-garage-bay-modal-mot-bay-val" name="motbay">

                                            <label for="timeSegments">Time Segments:</label>
                                            <select class="data-launch-garage-bay-modal-mot-bay-select" id="data-launch-garage-bay-modal-mot-bay-select" name="timeSegments">
                                                <option value="Choose Option">Choose Option</option>
                                                <option value="20">20 Mins</option>
                                                <option value="30">30 Mins</option>
                                                <option value="45">45 Mins</option>
                                                <option value="60">60 Mins</option>
                                            </select>
                                            <span style="display: none"><input id="garageBaysModalRecordId" type="text" value=""></span>
                                        </div>

                                        <button class="data-launch-save-garage-bay-btn" id="saveGarageBayButton">Save</button>
                                    </div>
                                </div>


                                <div id="motReconciliationModal" style="display: none" class="mot-bay-cleaning-log-modal-popup">
                                    <div class="mot-bay-cleaning-log-modal-content">
                                        <button class="mot-reconciliation-new-record-close">X</button>
                                        <h2>MOT Reconciliation</h2>
                                        
                                        <!-- Cleaning Log Details Section -->
                                        <div class="tab-content active">
                                            <label for="mot_reconciliation_dialogue_month">Month:</label>
                                            <select name="mot_reconciliation_dialogue_month" id="mot_reconciliation_dialogue_month">
                                                <option value="1">Jan</option>
                                                <option value="2">Feb</option>
                                                <option value="3">Mar</option>
                                                <option value="4">Apr</option>
                                                <option value="5">May</option>
                                                <option value="6">Jun</option>
                                                <option value="7">Jul</option>
                                                <option value="8">Aug</option>
                                                <option value="9">Sep</option>
                                                <option value="10">Oct</option>
                                                <option value="11">Nov</option>
                                                <option value="12">Dec</option>
                                            </select>

                                            <label for="mot_reconciliation_dialogue_year">Year:</label>
                                            <select name="mot_reconciliation_dialogue_year" id="mot_reconciliation_dialogue_year">
                                                <option value="2024">2024</option>
                                                <option value="2025">2025</option>
                                                <option value="2026">2026</option>
                                                <option value="2027">2027</option>
                                                <option value="2028">2028</option>
                                                <option value="2029">2029</option>
                                                <option value="2030">2030</option>
                                                <option value="2031">2031</option>
                                                <option value="2032">2032</option>
                                                <option value="2033">2033</option>
                                                <option value="2034">2034</option>
                                                <option value="2035">2035</option>
                                                <option value="2036">2036</option>
                                                <option value="2037">2037</option>
                                                <option value="2038">2038</option>
                                                <option value="2039">2039</option>
                                                <option value="2040">2040</option>
                                                <option value="2041">2041</option>
                                                <option value="2042">2042</option>
                                                <option value="2043">2043</option>
                                                <option value="2044">2044</option>
                                                <option value="2045">2045</option>
                                                <option value="2046">2046</option>
                                                <option value="2047">2047</option>
                                                <option value="2048">2048</option>
                                                <option value="2049">2049</option>
                                                <option value="2050">2050</option>
                                                <option value="2051">2051</option>
                                                <option value="2052">2052</option>
                                                <option value="2053">2053</option>
                                                <option value="2054">2054</option>
                                                <option value="2055">2055</option>
                                                <option value="2056">2056</option>
                                                <option value="2057">2057</option>
                                                <option value="2058">2058</option>
                                                <option value="2059">2059</option>
                                                <option value="2060">2060</option>
                                                <option value="2061">2061</option>
                                                <option value="2062">2062</option>
                                                <option value="2063">2063</option>
                                                <option value="2064">2064</option>
                                                <option value="2065">2065</option>
                                                <option value="2066">2066</option>
                                                <option value="2067">2067</option>
                                                <option value="2068">2068</option>
                                                <option value="2069">2069</option>
                                                <option value="2070">2070</option>
                                                <option value="2071">2071</option>
                                                <option value="2072">2072</option>
                                                <option value="2073">2073</option>
                                                <option value="2074">2074</option>
                                                <option value="2075">2075</option>
                                                <option value="2076">2076</option>
                                                <option value="2077">2077</option>
                                                <option value="2078">2078</option>
                                                <option value="2079">2079</option>
                                                <option value="2080">2080</option>
                                                <option value="2081">2081</option>
                                                <option value="2082">2082</option>
                                                <option value="2083">2083</option>
                                                <option value="2084">2084</option>
                                                <option value="2085">2085</option>
                                                <option value="2086">2086</option>
                                                <option value="2087">2087</option>
                                                <option value="2088">2088</option>
                                                <option value="2089">2089</option>
                                                <option value="2090">2090</option>
                                                <option value="2091">2091</option>
                                                <option value="2092">2092</option>
                                                <option value="2093">2093</option>
                                                <option value="2094">2094</option>
                                                <option value="2095">2095</option>
                                                <option value="2096">2096</option>
                                                <option value="2097">2097</option>
                                                <option value="2098">2098</option>
                                                <option value="2099">2099</option>
                                            </select>
                                        </div>
                                        <button class="data-launch-submit-new-mot-reconciliation-modal" id="saveNewMotReconciliationModal">Create</button>
                                    </div>
                                </div>

                                 <div id="garageRemindersModalOverlay" style="display: none" class="data-launch-garage-reminders-overlay">
                                    <div id="garageRemindersModal" style="display: none" class="data-launch-garage-reminders-modal">
                                        <div class="data-launch-garage-reminders-header">
                                            <h2>Garage Reminder</h2>
                                            <button class="data-launch-garage-reminders-close-btn">&times;</button>
                                        </div>
                                        <div class="data-launch-garage-reminders-field">
                                        <label for="reminder-title">Title</label>
                                        <input type="text" id="reminder-title" name="title" placeholder="Enter title" required>
                                        </div>
                                        <div class="data-launch-garage-reminders-field">
                                        <label for="reminder-description">Description</label>
                                        <textarea id="reminder-description" name="description" placeholder="Enter description" rows="4" required></textarea>
                                        </div>
                                        <div class="data-launch-garage-reminders-field">
                                        <label for="reminder-due-date">Due Date</label>
                                        <input type="date" id="reminder-due-date" name="due_date" required>
                                        </div>
                                        <span style="display: none"><input id="garageRemindersRecordId" type="text" value=""></span>
                                        <button class="data-launch-garage-reminders-submit-btn">Save Reminder</button>
                                    </div>
                                </div>

                                <div id="data-launch-garage-overdue-reminders-alert" class="data-launch-garage-overdue-reminders-alert-overlay">
                                    <div class="data-launch-garage-overdue-reminders-alert-box">
                                        <h2 class="data-launch-garage-overdue-reminders-alert-title">OVERDUE EQUIPMENT CALIBRATIONS</h2>
                                        <ul class="data-launch-garage-overdue-reminders-alert-error-list" id="data-launch-garage-overdue-reminders-alert-list-ul">
                                        <!-- Example errors, replace dynamically -->
                                        <li>Error 1: Description of the first error.</li>
                                        <li>Error 2: Description of the second error.</li>
                                        </ul>
                                        <button class="data-launch-garage-overdue-alert-acknowledgement-button">Ok, Acknowledged</button>
                                    </div>                                    
                                </div>

                                
                                <div id="garageUserModal" style="display: none" class="garage-user-modal-popup">
                                    <div class="garage-user-modal-content">
                                        <span class="garage-user-close">&times;</span>
                                        <h2>User</h2>
                                        
                                        <!-- User Details Section -->
                                        <div class="tab-content active">
                                            <label id="garage_user_modal_create_date_label" for="date">Create Date:</label>
                                            <input disabled readonly type="date" id="garage_user_modal_create_date" name="date">

                                            <label for="signed">Email:</label>
                                            <input type="text" id="garage_user_modal_email" name="signed">

                                            <button id="sendLoginDetailsToEmail" class="data-launch-send-user-login-details-email">Send Login Details To Email</button>

                                            <div class="success-box" id="successBox-sendingLoginEmail">
                                                <span class="alert-icon">✅</span>
                                                <span class="alert-message">Login Details Sent Successfully....</span>
                                            </div>
                                            <label for="first">First:</label>
                                            <input type="text" id="garage_user_modal_first_name" name="first">

                                            <label for="last">Last:</label>
                                            <input type="text" id="garage_user_modal_last_name" name="last">

                                            <h2>Security</h2>
                                            <button class="data-launch-garage-user-modal-enable-all-privileges">Enable All</button>
                                            <button class="data-launch-garage-user-modal-disable-all-privileges">Disable All</button>
                                            

                                            <table class='table'>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Create</th>
                                                        <th>Read</th>
                                                        <th>Update</th>
                                                        <th>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>General Information (Summary / Garage Details / Address)</td>
                                                        <td></td>
                                                        <td><input type='checkbox' id="garage_user_modal_garage_details_tab_read"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_garage_details_tab_update"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_garage_details_tab_delete"></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Garage Testers</td>
                                                        <td><input type='checkbox' id="garage_user_modal_testers_tab_create"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_testers_tab_read"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_testers_tab_update"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_testers_tab_delete"></td>
                                                    </tr>
                                                    <tr>
                                                        <td>MOT Equipment</td>
                                                        <td><input type='checkbox' id="garage_user_modal_mot_equipment_tab_create"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_mot_equipment_tab_read"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_mot_equipment_tab_update"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_mot_equipment_tab_delete"></td>
                                                    </tr>
                                                    <tr>
                                                        <td>MOT Calibrations</td>
                                                        <td><input type='checkbox' id="garage_user_modal_calibrations_tab_create"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_calibrations_tab_read"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_calibrations_tab_update"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_calibrations_tab_delete"></td>
                                                    </tr>
                                                     <tr>
                                                        <td>MOT Reconciliations</td>
                                                        <td><input type='checkbox' id="garage_user_modal_reconciliations_tab_create"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_reconciliations_tab_read"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_reconciliations_tab_update"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_reconciliations_tab_delete"></td>
                                                    </tr>
                                                    <tr>
                                                        <td>MOT Site Audits</td>
                                                        <td><input type='checkbox' id="garage_user_modal_mot_site_audits_tab_create"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_mot_site_audits_tab_read"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_mot_site_audits_tab_update"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_mot_site_audits_tab_delete"></td>
                                                    </tr>
                                                    <tr>
                                                        <td>QC Checkers</td>
                                                        <td><input type='checkbox' id="garage_user_modal_qc_checkers_tab_create"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_qc_checkers_tab_read"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_qc_checkers_tab_update"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_qc_checkers_tab_delete"></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Garage Users</td>
                                                        <td><input type='checkbox' id="garage_user_modal_garage_users_tab_create"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_garage_users_tab_read"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_garage_users_tab_update"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_garage_users_tab_delete"></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Bookings</td>
                                                        <td><input type='checkbox' id="garage_user_modal_bookings_tab_create"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_bookings_tab_read"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_bookings_tab_update"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_bookings_tab_delete"></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Defect Reports</td>
                                                        <td><input type='checkbox' id="garage_user_modal_defect_reports_tab_create"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_defect_reports_tab_read"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_defect_reports_tab_update"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_defect_reports_tab_delete"></td>
                                                    </tr>
                                                    <tr>
                                                        <td>MOT Bay Cleaning Log</td>
                                                        <td><input type='checkbox' id="garage_user_modal_mot_bay_cleaning_log_tab_create"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_mot_bay_cleaning_log_tab_read"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_mot_bay_cleaning_log_tab_update"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_mot_bay_cleaning_log_tab_delete"></td>
                                                    </tr>
                                                    <tr>
                                                        <td>QC Checkers For Bikes</td>
                                                        <td><input type='checkbox' id="garage_user_modal_qc_checkers_for_bikes_tab_create"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_qc_checkers_for_bikes_tab_read"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_qc_checkers_for_bikes_tab_update"></td>
                                                        <td><input type='checkbox' id="garage_user_modal_qc_checkers_for_bikes_tab_delete"></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Reminders</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td><input type='checkbox' id="garage_user_modal_garage_reminders_tab_delete"></td>
                                                    </tr>                                                                                                    
                                                </tbody>
                                            </table>



                                            <span style="display: none"><input id="garage_user_modal_RecordID" type="text" value=""></span>
                                        </div>

                                        <button class="data-launch-save-garage-user-btn" id="saveGarageUserButton">Save</button>
                                    </div>
                                </div>


                                <div id="defectReportModal" style="display: none" class="defect-report-modal-popup">
                                    <div class="defect-report-modal-content">
                                        <span class="defect-report-close">&times;</span>
                                        <h2>Defect Report</h2>
                                        
                                        <!-- Defect Report Details Section -->
                                        <div class="tab-content active">
                                            <label for="reference">Reference:</label>
                                            <input type="text" id="reference" name="reference">
                                            <div class="data-launch-mot-equipment-half-pane">
                                                <label for="reportedDate">Reported Date:</label>
                                                <input type="date" id="reportedDate" name="reportedDate">
                                            </div>
                                            <div class="data-launch-mot-equipment-half-pane">
                                                <label for="repairedDate">Repaired Date:</label>
                                                <input type="date" id="repairedDate" name="repairedDate">
                                            </div>
                                            <label for="details">Details:</label>
                                            <textarea id="details" name="details"></textarea>
                                            <label for="defectDescription">Defect Description:</label>
                                            <textarea id="defectDescription" name="defectDescription"></textarea>
                                            <div class="data-launch-mot-equipment-half-pane">
                                                <label style="display: inline-block" for="dvsaNotified">DVSA Notified:</label>
                                                <input style="display: inline-block; width: 10%" type="checkbox" id="dvsaNotified" name="dvsaNotified">
                                            </div>
                                            <div class="data-launch-mot-equipment-half-pane">
                                                <label style="display: inline-block" for="repaired">Repaired and working as it should:</label>
                                                <input style="display: inline-block; width: 10%" type="checkbox" id="repaired" name="repaired">
                                            </div>
                                            <label for="confirmedBy">Confirmed By:</label>
                                            <input type="text" id="confirmedBy" name="confirmedBy">
                                            <span style="display: none"><input id="defectReportRecordId" type="text" value=""></span>
                                        </div>

                                        <button class="data-launch-save-defect-report-btn" id="saveDefectReportButton">Save</button>
                                    </div>
                                </div>






                                <div id="garageBookingModal" class="modal-popup booking-modal-popup" style='display:none'>
                                    <div class="modal-content booking-modal-content">
                                        <span class="garage-booking-close">&times;</span>
                                        <button class="data-launch-garage-booking-print-details">Print  <i class="bi bi-printer"></i></button>
                                        <h2 style="text-align: center;">Garage Booking</h2>
                                        <div class="data-launch-garage-booking-checkbox-cont">
                                            <div class="data-launch-garage-booking-checkbox-section">
                                                <div class="data-launch-garage-booking-checkbox-content">
                                                <div class="data-launch-garage-booking-checkbox-label">Booking Made</div>
                                                <input type="checkbox" class="data-launch-garage-booking-status-checkboxes" id="data-launch-garage-booking-made" name="data-launch-garage-booking-made">
                                                </div>
                                            </div>

                                            <div class="data-launch-garage-booking-checkbox-section">
                                                <div class="data-launch-garage-booking-checkbox-content">
                                                <div class="data-launch-garage-booking-checkbox-label">Vehicle On Site</div>
                                                <input type="checkbox" class="data-launch-garage-booking-status-checkboxes" id="data-launch-garage-vehicle-arrived" name="data-launch-garage-vehicle-arrived">
                                                </div>
                                            </div>

                                            <div class="data-launch-garage-booking-checkbox-section">
                                                <div class="data-launch-garage-booking-checkbox-content">
                                                <div class="data-launch-garage-booking-checkbox-label">In Progress</div>
                                                <input type="checkbox" class="data-launch-garage-booking-status-checkboxes" id="data-launch-garage-work-in-progress" name="data-launch-garage-work-in-progress">
                                                </div>
                                            </div>

                                            <div class="data-launch-garage-booking-checkbox-section">
                                                <div class="data-launch-garage-booking-checkbox-content">
                                                <div class="data-launch-garage-booking-checkbox-label">Work Completed</div>
                                                <input type="checkbox" class="data-launch-garage-booking-status-checkboxes" id="data-launch-garage-work-completed" name="data-launch-garage-work-completed">
                                                </div>
                                            </div>
                                        </div>


                                        <!-- Tab Navigation -->
                                        <div class="tabs">
                                            <button id="garageBookingModal_BookingDetails_tab" data-tab-name="BookingDetails" class="tab-button booking-modal-popup-header-tab active" onclick="openTab(event, 'BookingDetails', 'garageBookingModal')">Booking Details</button>
                                            <button id="garageBookingModal_CustomerDetails_tab" data-tab-name="CustomerDetails" class="tab-button booking-modal-popup-header-tab" onclick="openTab(event, 'CustomerDetails', 'garageBookingModal')">Customer Details</button>
                                            <button id="garageBookingModal_VehicleDetails_tab" data-tab-name="VehicleDetails" class="tab-button booking-modal-popup-header-tab" onclick="openTab(event, 'VehicleDetails', 'garageBookingModal')">Vehicle Details</button>
                                            <button id="garageBookingModal_AdditionalInfo_tab" data-tab-name="AdditionalInfo" class="tab-button booking-modal-popup-header-tab" onclick="openTab(event, 'AdditionalInfo', 'garageBookingModal')">Additional Info</button>
                                        </div>

                                        <!-- Booking Details Section -->
                                        <div id="BookingDetails" class="tab-content active">
                                            <label for="bookingDate">Booking Date:</label>
                                            <input type="date" id="bookingDate"><br>

                                             <label for="garageBookingsBay">Bay:</label>
                                            <select class="garageBookingsBay" id="garageBookingsBay">
                                                <option value="">Please choose a Bay</option>
                                            </select>

                                            <label for="timeStart">Start Time:</label>
                                            <input class="garage-bookings-start-time" type="time" id="timeStart"><br>

                                            <label for="timeEnd">End Time:</label>
                                            <input type="time" id="timeEnd"><br>
                                            
                                            <div>
                                                <label style="width: 25%; display: inline-block; vertical-align: middle;" for="motCompleted">MOT Completed:</label>
                                                <input style="width: 10%; display: inline-block; vertical-align: middle;" type="checkbox" id="motCompleted">
                                            </div>
                                        </div>

                                        <!-- Customer Details Section -->
                                        <div id="CustomerDetails" class="tab-content">
                                            <label for="title">Title:</label>
                                            <input type="text" id="title"><br>

                                            <label for="customerFirstName">First Name:</label>
                                            <input type="text" id="customerFirstName"><br>

                                            <label for="customerLastName">Last Name:</label>
                                            <input type="text" id="customerLastName"><br>

                                            <label for="customerMobile">Mobile Number:</label>
                                            <input type="text" id="customerMobile"><br>

                                            <label for="customerEmail">Email:</label>
                                            <input type="email" id="customerEmail"><br>
                                        </div>

                                        <!-- Vehicle Details Section -->
                                        <div id="VehicleDetails" class="tab-content">
                                            <label for="vehicleReg">Vehicle Registration:</label>
                                            <input type="text" id="vehicleReg">
                                            <button class="data-launch-fetch-car-details">Fetch Car Details</button><br>

                                            <label for="vehicleMake">Vehicle Make:</label>
                                            <input type="text" id="vehicleMake"><br>

                                            <label for="vehicleModel">Vehicle Model:</label>
                                            <input type="text" id="vehicleModel"><br>

                                            <label for="motDueDate">MOT Due Date:</label>
                                            <input type="date" id="motDueDate"><br>

                                            <label for="vehicleBookingVIN">Vehicle VIN:</label>
                                            <input type="text" id="vehicleBookingVIN" readonly><br>
                                        </div>

                                        <!-- Additional Info Section -->
                                        <div id="AdditionalInfo" class="tab-content">
                                            <input type="hidden" id="garageBookingRecordId">
                                            <label for="garageBookingNotes">Notes:</label>
                                            <textarea class="garageBookingNotes-textArea" id="garageBookingNotes"></textarea>
                                        </div>

                                        <button class="data-launch-save-garage-bookings-btn">Save</button>
                                    </div>
                                </div>


                                






                                

                               <div id="qcCheckerModal" class="modal-popup qc-checker-modal-popup" style='display:none'>
                                    <div class="modal-content qc-checker-modal-content qc-checker-car-modal-content">
                                        <span class="qc-checker-close">&times;</span>
                                        <input style='display:none' type="text" id="qcCheckerRecordId" disabled><br>
                                        <button class="data-launch-qc-checker-for-car-print-details">Print  <i class="bi bi-printer"></i></button>
                                        <h2 style="text-align:center;">QC Checks For Group B</h2>

                                        <!-- Tab Navigation -->
                                        <div style="margin-bottom: 30px" class="tabs">
                                            <button class="tab-button active" onclick="openTab(event, 'SummarySection', 'qcCheckerModal')">Summary</button>
                                            <button class="tab-button" onclick="openTab(event, 'PreChecksSection', 'qcCheckerModal')">Pre Checks</button>
                                            <button class="tab-button" onclick="openTab(event, 'GasAnalysisSection', 'qcCheckerModal')">Gas Analysis</button>
                                            <button class="tab-button" onclick="openTab(event, 'InsideVehicleSection', 'qcCheckerModal')">Inside Vehicle</button>                                            
                                            <button class="tab-button" onclick="openTab(event, 'VehicleLightSection', 'qcCheckerModal')">Vehicle Light</button>
                                            <button class="tab-button" onclick="openTab(event, 'BonnetOpenSection', 'qcCheckerModal')">Bonnet Open</button>
                                            <button class="tab-button" onclick="openTab(event, 'VehicleRaisedFullHeightSection', 'qcCheckerModal')">Vehicle Raised to Full Height</button>
                                            <button class="tab-button" onclick="openTab(event, 'VehicleRaisedHalfHeightSection', 'qcCheckerModal')">Vehicle Raised to Half Height</button>
                                            <button class="tab-button" onclick="openTab(event, 'TurnPlatesSection', 'qcCheckerModal')">Use of Turn Plates</button>
                                            <button class="tab-button" onclick="openTab(event, 'BrakePerformanceTestSection', 'qcCheckerModal')">Brake Performance Test</button>
                                            <button class="tab-button" onclick="openTab(event, 'qcCheckersForCarsNotesSection', 'qcCheckerModal')">Notes</button>
                                        </div>

                                    <!-- Summary Section -->
                                <div id="SummarySection" class="tab-content active">

                                    <label for="data_launch_qc_checkers_for_cars_testerName">Tester Name:</label>
                                    <select class="data_launch_qc_checkers_for_group_a_tester_selector" id="data_launch_qc_checkers_for_cars_testerName"></select><br>
                                    <label for="data_launch_qc_checkers_for_cars_testerID">Tester ID:</label>
                                    <input type="text" id="data_launch_qc_checkers_for_cars_testerID" readonly disabled><br>
                                    <div class="data-launch-mot-equipment-half-pane">
                                    <label for="data_launch_qc_checkers_for_cars_vehicleReg">Vehicle Reg:</label>
                                    <input type="text" id="data_launch_qc_checkers_for_cars_vehicleReg"><br>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                    <label for="data_launch_qc_checkers_for_cars_dateOfQC">Date of QC:</label>
                                    <input type="date" id="data_launch_qc_checkers_for_cars_dateOfQC"><br>
                                    </div>
                                    <label for="data_launch_qc_checkers_for_cars_qcCarriedOutBy">QC Carried out by:</label>
                                    <input type="text" id="data_launch_qc_checkers_for_cars_qcCarriedOutBy"><br>

                                    <label for="data_launch_qc_checkers_for_cars_consultant">Consultant:</label>
                                    <input type="text" id="data_launch_qc_checkers_for_cars_consultant"><br>

                                    <label for="data_launch_qc_checkers_for_cars_vehicleClass">Vehicle Class:</label>
                                    <input type="text" id="data_launch_qc_checkers_for_cars_vehicleClass"><br>
                                </div>

                                <!-- Pre Checks Section -->
                                <div id="PreChecksSection" class="tab-content">
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_doorsOpen">All required doors open:</label>
                                        <select id="data_launch_qc_checkers_for_cars_doorsOpen">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_bonnetOpens">Bonnet opens as required:</label>
                                        <select id="data_launch_qc_checkers_for_cars_bonnetOpens">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_bootOpens">Boot opens as required:</label>
                                        <select id="data_launch_qc_checkers_for_cars_bootOpens">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_fuelCapOpens">Fuel cap opens:</label>
                                        <select id="data_launch_qc_checkers_for_cars_fuelCapOpens">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_chassisNumberTaken">Chassis number taken:</label>
                                        <select id="data_launch_qc_checkers_for_cars_chassisNumberTaken">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_conditionOfRegistrationPlate">Condition of registration plate:</label>
                                        <select id="data_launch_qc_checkers_for_cars_conditionOfRegistrationPlate">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_vehicleSafeForTest">Vehicle safe for test:</label>
                                        <select id="data_launch_qc_checkers_for_cars_vehicleSafeForTest">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_vehicleCorrectlyRegistered">Vehicle correctly registered:</label>
                                        <select id="data_launch_qc_checkers_for_cars_vehicleCorrectlyRegistered">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Gas Analysis Section -->
                                <div id="GasAnalysisSection" class="tab-content">
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_vehicleCorrectlyEnteredEmissionMachine">Vehicle correctly entered on emission machine:</label>
                                        <select id="data_launch_qc_checkers_for_cars_vehicleCorrectlyEnteredEmissionMachine">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_correctEmissionStandardsApplied">Correct emission standards applied:</label>
                                        <select id="data_launch_qc_checkers_for_cars_correctEmissionStandardsApplied">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_ntSelectCorrectEmissionLimits">NT selects correct emission limits:</label>
                                        <select id="data_launch_qc_checkers_for_cars_ntSelectCorrectEmissionLimits">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_oilLevelChecked">Oil level checked:</label>
                                        <select id="data_launch_qc_checkers_for_cars_oilLevelChecked">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Inside Vehicle Section -->
                                <div id="InsideVehicleSection" class="tab-content">
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_passengerDoorOpens">Passenger door opens:</label>
                                        <select id="data_launch_qc_checkers_for_cars_passengerDoorOpens">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_allPassengerSeatsChecked">All passenger seats checked:</label>
                                        <select id="data_launch_qc_checkers_for_cars_allPassengerSeatsChecked">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_allMandatoryMirrorsChecked">All mandatory mirrors checked:</label>
                                        <select id="data_launch_qc_checkers_for_cars_allMandatoryMirrorsChecked">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_handbrakeOperationChecked">Handbrake operation checked:</label>
                                        <select id="data_launch_qc_checkers_for_cars_handbrakeOperationChecked">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_steeringUJChecked">Steering UJ checked:</label>
                                        <select id="data_launch_qc_checkers_for_cars_steeringUJChecked">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_steeringFreePlayChecked">Steering free play checked:</label>
                                        <select id="data_launch_qc_checkers_for_cars_steeringFreePlayChecked">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_steeringAntiTheftLockChecked">Steering anti-theft lock checked:</label>
                                        <select id="data_launch_qc_checkers_for_cars_steeringAntiTheftLockChecked">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_audibleWarningChecked">Audible warning checked:</label>
                                        <select id="data_launch_qc_checkers_for_cars_audibleWarningChecked">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_washersWipersChecked">Washers and wipers checked:</label>
                                        <select id="data_launch_qc_checkers_for_cars_washersWipersChecked">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_seatbeltsChecked">Seatbelts checked:</label>
                                        <select id="data_launch_qc_checkers_for_cars_seatbeltsChecked">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Vehicle Light Section -->
                                <div id="VehicleLightSection" class="tab-content">
                                    <label for="data_launch_qc_checkers_for_cars_ntCorrectlyUsesBeamSetter">NT correctly uses beam setter:</label>
                                    <select id="data_launch_qc_checkers_for_cars_ntCorrectlyUsesBeamSetter">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_headlampAimChecked">Headlamp aim checked:</label>
                                    <select id="data_launch_qc_checkers_for_cars_headlampAimChecked">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_headlampUnitsSecure">Headlamp units secure:</label>
                                    <select id="data_launch_qc_checkers_for_cars_headlampUnitsSecure">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_rearLightUnitsSecure">Rear light units secure:</label>
                                    <select id="data_launch_qc_checkers_for_cars_rearLightUnitsSecure">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_lightsInterfereWithAnother">Do any lights interfere with another:</label>
                                    <select id="data_launch_qc_checkers_for_cars_lightsInterfereWithAnother">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_ntUsesMethodicalProcess">NT uses methodical process:</label>
                                    <select id="data_launch_qc_checkers_for_cars_ntUsesMethodicalProcess">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>
                                </div>

                                <!-- Bonnet Open Section -->
                                <div id="BonnetOpenSection" class="tab-content">
                                    <label for="data_launch_qc_checkers_for_cars_steeringSecurityChecked">Steering security checked:</label>
                                    <select id="data_launch_qc_checkers_for_cars_steeringSecurityChecked">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_batterySecure">Battery secure:</label>
                                    <select id="data_launch_qc_checkers_for_cars_batterySecure">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_brakeSystemInspectedUnderPressure">Brake system inspected under pressure:</label>
                                    <select id="data_launch_qc_checkers_for_cars_brakeSystemInspectedUnderPressure">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_allFluidLevelsInspected">All fluid levels inspected:</label>
                                    <select id="data_launch_qc_checkers_for_cars_allFluidLevelsInspected">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_fuelSystemInspected">Fuel system inspected:</label>
                                    <select id="data_launch_qc_checkers_for_cars_fuelSystemInspected">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_generalConditionInspected">General condition inspected:</label>
                                    <select id="data_launch_qc_checkers_for_cars_generalConditionInspected">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>
                                </div>

                                <!-- Vehicle Raised to Full Height Section -->
                                <div id="VehicleRaisedFullHeightSection" class="tab-content">
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_steeringInspectedUsingEquipment">Steering inspected using equipment:</label>
                                        <select id="data_launch_qc_checkers_for_cars_steeringInspectedUsingEquipment">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>

                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_brakeSystemInspected">Brake system inspected:</label>
                                        <select id="data_launch_qc_checkers_for_cars_brakeSystemInspected">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>

                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_exhaustChecked">Exhaust checked:</label>
                                        <select id="data_launch_qc_checkers_for_cars_exhaustChecked">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_driveshaftInspected">Driveshaft inspected:</label>
                                        <select id="data_launch_qc_checkers_for_cars_driveshaftInspected">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_fuelSystemInspectedWhileRunning">Fuel system inspected while running:</label>
                                        <select id="data_launch_qc_checkers_for_cars_fuelSystemInspectedWhileRunning">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_suspensionComponentsInspected">Suspension components inspected:</label>
                                        <select id="data_launch_qc_checkers_for_cars_suspensionComponentsInspected">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_undersideInspectedForCorrosion">Underside inspected for corrosion:</label>
                                        <select id="data_launch_qc_checkers_for_cars_undersideInspectedForCorrosion">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_vehicleRaisedCorrectly">Vehicle raised correctly:</label>
                                        <select id="data_launch_qc_checkers_for_cars_vehicleRaisedCorrectly">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Vehicle Raised to Half Height Section -->
                                <div id="VehicleRaisedHalfHeightSection" class="tab-content">
                                    <label for="data_launch_qc_checkers_for_cars_tyresInspected">Tyres inspected:</label>
                                    <select id="data_launch_qc_checkers_for_cars_tyresInspected">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>
                                    
                                    <label for="data_launch_qc_checkers_for_cars_suspensionComponentsChecked">Suspension components checked:</label>
                                    <select id="data_launch_qc_checkers_for_cars_suspensionComponentsChecked">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_brakeHosesInspected">Brake hoses inspected:</label>
                                    <select id="data_launch_qc_checkers_for_cars_brakeHosesInspected">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_allGaitersInspected">All gaiters inspected:</label>
                                    <select id="data_launch_qc_checkers_for_cars_allGaitersInspected">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_wheelSecurityAssessed">Wheel security assessed:</label>
                                    <select id="data_launch_qc_checkers_for_cars_wheelSecurityAssessed">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_brakeComponentsAssessed">Brake components assessed:</label>
                                    <select id="data_launch_qc_checkers_for_cars_brakeComponentsAssessed">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_ntUsedATL">NT used ATL:</label>
                                    <select id="data_launch_qc_checkers_for_cars_ntUsedATL">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>
                                </div>

                                <!-- Use of Turn Plates Section -->
                                <div id="TurnPlatesSection" class="tab-content">
                                    <label for="data_launch_qc_checkers_for_cars_conditionOfTurnPlates">Condition of turn plates:</label>
                                    <select id="data_launch_qc_checkers_for_cars_conditionOfTurnPlates">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_ntCanUseTurnPlates">NT can use turn plates:</label>
                                    <select id="data_launch_qc_checkers_for_cars_ntCanUseTurnPlates">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_turnPlatesUsedForLockCheck">Turn plates used for lock check:</label>
                                    <select id="data_launch_qc_checkers_for_cars_turnPlatesUsedForLockCheck">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>
                                </div>

                                <!-- Brake Performance Test Section -->
                                <div id="BrakePerformanceTestSection" class="tab-content">
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_frontAxleBrakePerformance">Front axle brake performance:</label>
                                        <select id="data_launch_qc_checkers_for_cars_frontAxleBrakePerformance">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_rearAxleBrakePerformance">Rear axle brake performance:</label>
                                        <select id="data_launch_qc_checkers_for_cars_rearAxleBrakePerformance">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_emergencyBrakePerformance">Emergency brake performance:</label>
                                        <select id="data_launch_qc_checkers_for_cars_emergencyBrakePerformance">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_brakeBindReleaseCheck">Brake bind release check:</label>
                                        <select id="data_launch_qc_checkers_for_cars_brakeBindReleaseCheck">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>
                                    <div class="data-launch-mot-equipment-half-pane">
                                        <label for="data_launch_qc_checkers_for_cars_brakeJudderAssessed">Brake judder assessed:</label>
                                        <select id="data_launch_qc_checkers_for_cars_brakeJudderAssessed">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="n/a">N/A</option>
                                        </select>
                                    </div>                                

                                    <label for="data_launch_qc_checkers_for_cars_tqiChecked">TQI Checked:</label>
                                    <select id="data_launch_qc_checkers_for_cars_tqiChecked">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="n/a">N/A</option>
                                    </select><br>

                                    <label for="data_launch_qc_checkers_for_cars_confirmedByTester">Confirmed by tester:</label>
                                    <input type="text" id="data_launch_qc_checkers_for_cars_confirmedByTester"><br>
                                </div>

                                <!-- Notes ection -->
                                <div id="qcCheckersForCarsNotesSection" class="tab-content">
                                    <label for="data_launch_qc_checkers_for_cars_notes">Notes:</label>
                                    <textarea style="height: 500px;" id="data_launch_qc_checkers_for_cars_notes"></textarea><br>
                                </div>
                                        <br>
                                        <button class="data-launch-save-qc-checkers-btn" id="saveQcCheckerButton">Save</button>
                                    </div>
                                </div>




                                <div id="motSiteAuditModal" style="display: none;" class="modal mot-site-audit-modal-popup">
                                    <div class="modal-content mot-site-audit-modal-content">
                                        <span class="mot-site-audit-close">&times;</span>
                                        <button class="data-launch-mot-site-audit-print-details">Print  <i class="bi bi-printer"></i></button>
                                        <h2 style='text-align: center;'>Site Audit</h2>
                                        
                                        <!-- Tab Navigation -->
                                        <div class="tabs">
                                            <button class="tab-button active" onclick="openTab(event, 'SiteAuditSummarySection', 'motSiteAuditModal')">Summary</button>
                                            <button class="tab-button" onclick="openTab(event, 'SiteAuditComplianceSection', 'motSiteAuditModal')">Compliance</button>
                                            <button class="tab-button" onclick="openTab(event, 'SiteAuditCalibrationSection', 'motSiteAuditModal')">Calibration</button>
                                            <button class="tab-button" onclick="openTab(event, 'TesterStaffComplianceSection', 'motSiteAuditModal')">Tester and Staff Compliance</button>
                                            <button class="tab-button" onclick="openTab(event, 'EquipmentWorkshopComplianceSection', 'motSiteAuditModal')">Equipment and Workshop Compliance</button>
                                            <button class="tab-button" onclick="openTab(event, 'ToolsWorkingOrderSection', 'motSiteAuditModal')">Tools in Working Order</button>
                                            <button class="tab-button" onclick="openTab(event, 'motSiteAuditNotesSection', 'motSiteAuditModal')">Audit Findings</button>
                                        </div>

                                        <!-- Tab Content -->
                                        <div id="SiteAuditSummarySection" class="tab-content active">
                                            <label for="siteAuditRecordId">Record ID:</label>
                                            <input type="text" id="siteAuditRecordId" disabled><br>
                                            <label for="site_audit_consultant">Consultant:</label>
                                            <input type="text" id="site_audit_consultant"><br>

                                            <label for="site_audit_auditor">Auditor:</label>
                                            <input type="text" id="site_audit_auditor"><br>

                                            <label for="site_audit_auditDate">Audit Date:</label>
                                            <input type="date" id="site_audit_auditDate"><br>
                                        </div>

                                        <div id="SiteAuditComplianceSection" class="tab-content">
                                            <label for="site_audit_customerAreasAccessible">Customer areas accessible:</label>
                                            <select id="site_audit_customerAreasAccessible">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_receptionClean">Reception clean:</label>
                                            <select id="site_audit_receptionClean">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_viewingAreaVisible">Viewing area visible:</label>
                                            <select id="site_audit_viewingAreaVisible">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_facilitiesClean">Facilities clean:</label>
                                            <select id="site_audit_facilitiesClean">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_noticeBoardUpdated">Notice board updated:</label>
                                            <select id="site_audit_noticeBoardUpdated">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_examinerDetailsDisplayed">Examiner details displayed:</label>
                                            <select id="site_audit_examinerDetailsDisplayed">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_reducedRateFees">Reduced rate fees displayed:</label>
                                            <select id="site_audit_reducedRateFees">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_noticeBoardsVisible">Notice boards visible:</label>
                                            <select id="site_audit_noticeBoardsVisible">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_vt9aCorrectInfo">VT9a displayed correctly:</label>
                                            <select id="site_audit_vt9aCorrectInfo">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_openingHoursCorrect">Opening hours correct:</label>
                                            <select id="site_audit_openingHoursCorrect">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_workloadManagementSystem">Workload management system appropriate:</label>
                                            <select id="site_audit_workloadManagementSystem">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_managementSystemDemonstrable">Management system demonstrable:</label>
                                            <select id="site_audit_managementSystemDemonstrable">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_adequateBookingSystem">Adequate booking system:</label>
                                            <select id="site_audit_adequateBookingSystem">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_recordsWithoutMot">No MOT records provided:</label>
                                            <select id="site_audit_recordsWithoutMot">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_emissionReportsMatch">Emission reports match findings:</label>
                                            <select id="site_audit_emissionReportsMatch">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_handoverProcessEffective">Handover process effective:</label>
                                            <select id="site_audit_handoverProcessEffective">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_documentationRetrievable">Documentation easily retrievable:</label>
                                            <select id="site_audit_documentationRetrievable">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_staffSuggestionsRecorded">Staff suggestions recorded:</label>
                                            <select id="site_audit_staffSuggestionsRecorded">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_followingCodesOfPractice">Following codes of practice:</label>
                                            <select id="site_audit_followingCodesOfPractice">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>
                                        </div>

                                        <div id="SiteAuditCalibrationSection" class="tab-content">
                                            <label for="site_audit_calibrationRecordsCorrect">Calibration records correct:</label>
                                            <select id="site_audit_calibrationRecordsCorrect">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_equipmentManualsAvailable">Equipment manuals available:</label>
                                            <select id="site_audit_equipmentManualsAvailable">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_dvsaFormsAvailable">DVSA forms available:</label>
                                            <select id="site_audit_dvsaFormsAvailable">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_qualityManagementProcess">Quality management process in place:</label>
                                            <select id="site_audit_qualityManagementProcess">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_managementSystemDemonstrable">Management system demonstrable:</label>
                                            <select id="site_audit_managementSystemDemonstrable">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_adequateBookingSystem">Adequate booking system:</label>
                                            <select id="site_audit_adequateBookingSystem">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>
                                        </div>

                                        <div id="TesterStaffComplianceSection" class="tab-content">
                                            <label for="site_audit_specialNoticesAccessible">Special notices accessible:</label>
                                            <select id="site_audit_specialNoticesAccessible">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_mattersOfTesting">Matters of Testing blog read by staff:</label>
                                            <select id="site_audit_mattersOfTesting">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_motTestingGuide">MOT Testing Guide reference available:</label>
                                            <select id="site_audit_motTestingGuide">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_correctNumberOfStaff">Correct number of staff:</label>
                                            <select id="site_audit_correctNumberOfStaff">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_accessTesterInformation">Tester Information accessible:</label>
                                            <select id="site_audit_accessTesterInformation">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_bonusForMotTesting">Bonus for MOT testing:</label>
                                            <select id="site_audit_bonusForMotTesting">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_otherIncentivesInfluence">Other incentives influencing MOT:</label>
                                            <select id="site_audit_otherIncentivesInfluence">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_qualityChecksRegular">Regular quality checks of MOT testers:</label>
                                            <select id="site_audit_qualityChecksRegular">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_dvsaTrainingRecords">DVSA training records available:</label>
                                            <select id="site_audit_dvsaTrainingRecords">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_cpdTrainingRecords">CPD training records available:</label>
                                            <select id="site_audit_cpdTrainingRecords">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_monitorTestLogs">Monitoring of test logs:</label>
                                            <select id="site_audit_monitorTestLogs">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_passwordsLeftAvailable">Tester passwords compromised:</label>
                                            <select id="site_audit_passwordsLeftAvailable">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_fraudulentTests">Indications of fraudulent tests:</label>
                                            <select id="site_audit_fraudulentTests">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>
                                        </div>

                                        <div id="EquipmentWorkshopComplianceSection" class="tab-content">
                                            <label for="site_audit_baysMarked">Bays clearly marked:</label>
                                            <select id="site_audit_baysMarked">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_baysAllowForTests">Bays allow for testing volume:</label>
                                            <select id="site_audit_baysAllowForTests">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_correctVehicleRegistered">Correct vehicle registered:</label>
                                            <select id="site_audit_correctVehicleRegistered">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_workingAreasClean">Working areas clean and hazard-free:</label>
                                            <select id="site_audit_workingAreasClean">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_housekeepingRegular">Regular housekeeping:</label>
                                            <select id="site_audit_housekeepingRegular">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_wasteStoredProperly">Waste and recyclables stored properly:</label>
                                            <select id="site_audit_wasteStoredProperly">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_staffWorkingSafely">Staff working safely:</label>
                                            <select id="site_audit_staffWorkingSafely">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_equipmentInGoodOrder">Workshop equipment in good order:</label>
                                            <select id="site_audit_equipmentInGoodOrder">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_motBayLocationApparent">MOT bay location apparent:</label>
                                            <select id="site_audit_motBayLocationApparent">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_equipmentMaintained">Equipment maintained properly:</label>
                                            <select id="site_audit_equipmentMaintained">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_maintenanceLogsKept">Maintenance logs kept:</label>
                                            <select id="site_audit_maintenanceLogsKept">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_emissionReportsAvailable">Recent emission reports available:</label>
                                            <select id="site_audit_emissionReportsAvailable">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>
                                        </div>

                                        <div id="ToolsWorkingOrderSection" class="tab-content">
                                            <label for="site_audit_treadDepthGauge">Tread depth gauge available:</label>
                                            <select id="site_audit_treadDepthGauge">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_inspectionLamp">Inspection lamp available:</label>
                                            <select id="site_audit_inspectionLamp">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_pryPinchBars">Pry/pinch bars available:</label>
                                            <select id="site_audit_pryPinchBars">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_corrosionTool">Corrosion assessment tool available:</label>
                                            <select id="site_audit_corrosionTool">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_steelTapeMeasure">Steel tape measure available:</label>
                                            <select id="site_audit_steelTapeMeasure">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_mirrorCameras">Mirrors/cameras for lights check available:</label>
                                            <select id="site_audit_mirrorCameras">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_wheelChocks">Wheel chocks available:</label>
                                            <select id="site_audit_wheelChocks">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_brakePedalDepressor">Brake pedal depressor available:</label>
                                            <select id="site_audit_brakePedalDepressor">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_trailerSocketTestingTool">Trailer socket testing tool available:</label>
                                            <select id="site_audit_trailerSocketTestingTool">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_leakDetectionSpray">Leak detection spray available:</label>
                                            <select id="site_audit_leakDetectionSpray">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>

                                            <label for="site_audit_oilTemperatureProbe">Oil temperature probe available:</label>
                                            <select id="site_audit_oilTemperatureProbe">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="n/a">N/A</option>
                                            </select><br>
                                        </div>

                                        <div id="motSiteAuditNotesSection" class="tab-content">
                                            <label for="site_audit_siteAuditFindings">Site Audit Findings:</label>
                                            <textarea class="mot_site_audit_notes_text_area_elem" id="site_audit_siteAuditFindings"></textarea>
                                            
                                            <label for="site_audit_emissionReportSameFindings">Emission report sample findings:</label>
                                            <input type="text" id="site_audit_emissionReportSameFindings"><br>

                                            <label for="site_audit_auditorPrint">Auditor print:</label>
                                            <input type="text" id="site_audit_auditorPrint"><br>
                                        </div>
                                        

                                        <button class="data-launch-save-site-audit-btn" id="saveSiteAuditButton">Save</button>
                                    </div>
                                </div>

                                <div class="data-launch-crud-security-alert" id="data-launch-crud-alert-box">
                                        <div class="data-launch-crud-security-alert__icon" id="data-launch-crud-alert-icon"></div>
                                        <div class="data-launch-crud-security-alert__message" id="data-launch-crud-alert-message"></div>
                                    </div>


    

                                <div style='display: none' class='data-launch-notes-modal-box-popup-cont' id='data-launch-mot-equipment-modal-box-popup'>
                                    <div class="modal-overlay data-launch-mot-equipment-modal-overlay">
                                        <div class="modal-content modern-modal data-launch-mot-equipment-modal-content">
                                            <button class='data-launch-mot-equipment-close-button modern-close-button'>X</button>
                                            <h2 class="modern-modal-title">Add New MOT Equipment</h2>
                                            <label for="equipmentType" class="modern-modal-label">Equipment Type:</label>
                                             <select name="equipmentType" id="mot_equipment_equipment_type_${this.id}">
                                                <option value="">Select an option</option>
                                                <option value="Roller Brake Tester">Roller Brake Tester</option>
                                                <option value="Tread Depth Gauge">Tread Depth Gauge</option>
                                                <option value="Decelerometer">Decelerometer</option>
                                                <option value="Play Detector Maintenance">Play Detector Maintenance</option>
                                                <option value="Exhaust Gas Analyser">Exhaust Gas Analyser</option>
                                                <option value="Diesel Smoke Meter">Diesel Smoke Meter</option>
                                                <option value="Headlamp Aim">Headlamp Aim</option>
                                            </select>
                                            <div class="data-launch-mot-equipment-half-pane">
                                            <label for="make" class="modern-modal-label">Make:</label>
                                            <input type="text" id="mot_equipment_make_${this.id}" name="make" placeholder="Enter Make..." class="modern-modal-input">
                                            </div><div class="data-launch-mot-equipment-half-pane">
                                            <label for="model" class="modern-modal-label">Model:</label>
                                            <input type="text" id="mot_equipment_model_${this.id}" name="model" placeholder="Enter Model..." class="modern-modal-input">
                                            </div>
                                            <label for="serial_no" class="modern-modal-label">Serial No:</label>
                                            <input type="text" id="mot_equipment_serial_no_${this.id}" name="serial_no" placeholder="Enter Serial No..." class="modern-modal-input">
                                            <div class="data-launch-mot-equipment-half-pane">
                                            <label for="bay" class="modern-modal-label">Bay:</label>
                                            <input type="text" id="mot_equipment_bay_${this.id}" name="bay" placeholder="Enter Bay..." class="modern-modal-input">
                                            </div><div class="data-launch-mot-equipment-half-pane">
                                            <label for="calibration_frequency" class="modern-modal-label">Calibration Frequency:</label>
                                            <select name="calibration_frequency" id="mot_equipment_calibration_frequency_${this.id}">
                                                <option value="">Select an option</option>
                                                <option value="6">6 Months</option>
                                                <option value="12">12 Months</option>
                                            </select>
                                            </div>
                                            <label for="notes" class="modern-modal-label">Notes:</label>
                                            <textarea type="text" id="mot_equipment_notes_${this.id}" name="notes" placeholder="Enter Notes..." class="modern-modal-input data-launch-mot-equipment-modal-notes-field"></textarea>
                                            <button class="btn btn-primary data-launch-save-mot-equipment-btn modern-save-button">Save MOT Equipment</button>
                                            </div>                                             
                                            <span style="display: none"><input id="motEquipmentRecordId" type="text" value=""></span>
                                        </div>
                                    </div>                                
                                </div>
                                <button type="button" id="data-launch-garages-save" class="btn btn-outline-primary data-launch-save-record">Save</button>`
                                if (user_FULL_USER !== '0') {
                                    html += `<button type="button" id="data-launch-garages-save-close" class="btn btn-outline-primary data-launch-save-close-record">Save & Close</button>
                                             <button type="button" id="data-launch-garages-back-to-list-view" class="btn btn-outline-primary btn-primary data-launch-record-back-to-list-view">< < Back To List</button>`
                                }
                                else if (USER_RECORD.ae_login === 1) {
                                    html += `<button type="button" id="data-launch-garages-save-close" class="btn btn-outline-primary data-launch-save-close-record">Save & Close</button>
                                             <button type="button" id="data-launch-garages-back-to-list-view" class="btn btn-outline-primary btn-primary data-launch-record-back-to-list-view">< < Back To List</button>`
                                }
                                // if (associatedRec === true) {
                                //     html += ` <button type="button" id="data-launch-garages-back-to-original-garage" style="display: none" class="btn btn-outline-primary btn-primary data-launch-record-back-to-original-garage" data-id="${originalGarageID}"><< Back To Original Garage</button>`
                                // }
                                html += `                                
                                <div class='data-launch-record-header modern-record-header'>
                                    <h3 class="modern-record-title">${rec.trading_name_garage} - (${rec.vts_site_number_garage})</h3>
                                    <h3 class="modern-record-subtitle" id="data-launch-garage-${rec.id}-what-tab">Summary</h3>
                                </div>
                                <div class='data-launch-tabs-container' id="data-launch-tabs-container">
                                    <nav class="navbar navbar-expand-lg navbar-light modern-navbar">
                                        <div class="container-fluid data-launch-form-tabs-container modern-navbar-container">
                                            <button class="navbar-toggler modern-navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                                <span class="navbar-toggler-icon"></span>
                                            </button>
                                            <div class="collapse navbar-collapse" id="navbarNav">
                                                <ul class="navbar-nav modern-navbar-nav">
                                                ${this.buildFormMenu()}
                                                </ul>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                                
                            </div>
                        </div>      
                        ${this.buildFormSections(rec, html)}
                `
        }
        else {
            this.newRecord = true 
             // <i class="bi bi-plus data-launch-nav-menu-plus-icon" id="data-launch-nav-menu-plus-icon"></i>
            html = `
            <div class='container-fluid'>
                            <div class='row'>
                                <div style='display: none' class='data-launch-confirmation-box-inject' id='data-launch-confirmation-box-inject'></div>
                                <button type="button" id="data-launch-garages-save" class="btn btn-outline-primary data-launch-save-record">Save</button>
                                <button type="button" id="data-launch-garage-save-close" class="btn btn-outline-primary data-launch-save-close-record">Save & Close</button>
                                <button type="button" id="data-launch-garages-back-to-list-view" class="btn btn-outline-primary btn-primary data-launch-record-back-to-list-view">< < Back To List</button>
                                <div class='data-launch-record-header'>
                                    <h3>+ New</h3>                  
                                </div>
                                <div class='data-launch-tabs-container' id="data-launch-tabs-container">
                                    <nav class="navbar navbar-expand-lg navbar-light">
                                        <div class="container-fluid data-launch-form-tabs-container">
                                            <div class="data-launch-form-tabs-container-row">
                                                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                                    <span class="navbar-toggler-icon"></span>
                                                </button>
                                                <div class="collapse navbar-collapse" id="navbarNav">
                                                    <ul class="navbar-nav">
                                                    ${this.buildFormMenu()}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                                
                            </div>
                        </div>      
                        ${this.buildFormSections('NEW FORM', html)}
                `
        }
        document.getElementById('garagePage').innerHTML = html


        let garageMenuBarHeight = document.getElementById('data-launch-tabs-container').offsetHeight
        // document.getElementById('data-launch-garages-summary').style.top = garageMenuBarHeight +  8 + 'px'
        // document.getElementById('data-launch-garages-mot-calibration').style.top = garageMenuBarHeight +  8 + 'px'        
        // // console.log('gagarageMenuBarHeight', garageMenuBarHeight + 8)
        let headers = this.fieldObjectMeta()
        // // console.log('headers LIAM', headers)
        for (const key in headers) {
            document.getElementById(headers[key].meta.containerElement).style.top = garageMenuBarHeight + 8 + 'px'
        }

        this.injectDataIntoBaysSubgrid()
        if (user_FULL_USER !== "1") {
            this.injectDataIntoSpecialNoticesContainer()
        }
        this.injectDataIntoGarageBookingsSubgrid()
        this.injectDataIntoRemindersSubgrid()
        this.injectDataIntoAssociatedTestersSubgrid()
        this.injectDataIntoMotEquipmentSubgrid()
        this.injectDataIntoMotCalibrationSubgrid()
        this.injectDataIntoMotSiteAuditsSubgrid()
        this.injectDataIntoQcCheckersSubgrid()        
        this.injectDataIntoDefectReportsSubgrid()
        this.injectDataIntoMotBayCleaningLogSubgrid()
        this.injectDataIntoQcCheckersForBikesSubgrid();
        this.injectDataIntoUsersSubgrid()       
        this.injectDataIntoMotReconciliationSubgrid()        
        this.injectDataIntoCarTQISubgrid()
        // this.injectDataIntoAssociatedGaragesSubgrid()

        this.addPencilIconsToInputBoxes()
        this.sortNavbarListAlphabetically()
    }
    // sortNavbarListAlphabetically() {
    //     const ul = document.querySelector('.modern-navbar-nav');
    //     const lis = Array.from(ul.querySelectorAll('li'));

    //     const sortedLis = lis.sort((a, b) =>
    //         a.textContent.trim().localeCompare(b.textContent.trim())
    //     );

    //     // Remove existing <li> elements
    //     ul.innerHTML = '';

    //     // Append sorted ones
    //     sortedLis.forEach(li => ul.appendChild(li));
    // }
    sortNavbarListAlphabetically() {
    const nav = document.querySelector('.nav-links');
    const links = Array.from(nav.querySelectorAll('a'));

    // Sort by the visual text of the link
    links.sort((a, b) => {
        const textA = a.textContent.trim().toLowerCase();
        const textB = b.textContent.trim().toLowerCase();
        return textA.localeCompare(textB);
    });

    // Remove existing <a> elements
    links.forEach(link => nav.removeChild(link));

    // Re-append them in sorted order
    links.forEach(link => nav.appendChild(link));
    }

    addPencilIconsToInputBoxes() {
        document.querySelectorAll('[data-editable]').forEach((el) => {
            el.disabled = true;
      
            const wrapper = el.parentElement;
            const icon = document.createElement("span");
            icon.classList.add("edit-icon");
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-pencil" viewBox="0 0 16 16">
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
</svg>`; // You can replace with an SVG/icon font
      
            icon.addEventListener("click", () => {
                const isLocked = el.disabled;
        
                if (isLocked) {
                  el.disabled = false;
                  el.focus();
                  icon.innerHTML = "🔒";
                } else {
                  el.disabled = true;
                  icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-pencil" viewBox="0 0 16 16">
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
</svg>`;
                }
              });
        
              wrapper.appendChild(icon);
            });
    }

    saveRecord () {
        this.saveDetailsAboutTheRecord(false)
    }
    showSavedBanner () {
        document.getElementById('data-launch-saved-record-banner').classList.add('active')
        setTimeout(() => {
            document.getElementById('data-launch-saved-record-banner').classList.remove('active')
        }, 4000);
    }
    showCRUDAlert(message, type) {
        const alertBox = document.getElementById("data-launch-crud-alert-box");
        const alertMessage = document.getElementById("data-launch-crud-alert-message");
        const alertIcon = document.getElementById("data-launch-crud-alert-icon");
    
        // Set the message
        alertMessage.innerHTML = message;
    
        // Set the type (success or error)
        if (type === "success") {
            alertBox.className = "data-launch-crud-security-alert active data-launch-crud-security-alert--success";
        } else if (type === "error") {
            alertBox.className = "data-launch-crud-security-alert active data-launch-crud-security-alert--error";
        }
    
        // Show the alert
        setTimeout(() => {
            alertBox.classList.remove("active");
        }, 4000); // Auto-hide after 6 seconds
    }
    saveAndClose () {
        // this effectively deletes the element, including all of the event listeners, and then creates a new copy with zero event listeners attached
        this.saveDetailsAboutTheRecord(true)
        const oldElement = document.getElementById('garagePage');
        const newElement = oldElement.cloneNode(true); // Cloning with all children and attributes
        oldElement.parentNode.replaceChild(newElement, oldElement);
        this.listenersApplied = false;
    }
    saveDetailsAboutTheRecord (closeRecord) {
        let fieldObjectMeta = this.fieldObjectMeta()
        // // console.log('fieldObjectMeta', fieldObjectMeta)
        let fields = []
        for (const key in fieldObjectMeta) {
            for (let t = 0; t < fieldObjectMeta[key].fields.length; t++) {
                fields.push(fieldObjectMeta[key].fields[t])
            }
        }
        // // console.log('all the fields i need to check ', fields)
        // // console.log('this.newRecord', this.newRecord)
        let createRecordObject = {}
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].type === 'text' ||
                fields[i].type === 'email' ||
                fields[i].type === 'phone' ||
                fields[i].type === 'multi-text' ||
                fields[i].type === 'notes' ||
                fields[i].type === 'date' ) {
                if (document.getElementById(`${fields[i].field}_val`).value || document.getElementById(`${fields[i].field}_val`).value === '') {
                    createRecordObject[fields[i].field] = document.getElementById(`${fields[i].field}_val`).value
                }
            }
            else if (fields[i].type === 'checkbox') {
                if (document.getElementById(`${fields[i].field}_val`)) {
                    let val = document.getElementById(`${fields[i].field}_val`).checked
                    if (val === true) {
                        createRecordObject[fields[i].field] = 1
                    }
                    else {
                        createRecordObject[fields[i].field] = 0
                    }                    
                }
            }
            else if (fields[i].type === 'record') {
                let a =  document.getElementById(`${fields[i].field}_val`).getAttribute('data-launch-id')
                createRecordObject[fields[i].field] = a           
            }
            // else if (fields[i].type === 'child_garage_ids-CUSTOM-DO-NOT-CHANGE') {
            //     createRecordObject[fields[i].field] = this.currentGarageRecord.child_garage_ids
            // }
        }
        if (this.newRecord) {
            // // console.log('createRecordObject', createRecordObject)  
            createRecordObject.id = garage_record_next_id
            this.secureAction('create', 'data_launch_garage_records', null, createRecordObject).then(
                function success (res) {
                    // // console.log('CREATED NEW GARAGE RECORDS IN DB', res)
                    garage_record_next_id++
                    if (closeRecord === true) {
                        this.data.sort((a, b) => b.id - a.id)
                        this.renderHTMLHeader()
                    }
                    else {
                        this.showSavedBanner()
                    }
                },
                function error (err) {
                    // console.log(err)
                    if (closeRecord === true) {
                        this.renderHTMLHeader()
                    }
                    else {
                        this.showSavedBanner()
                    }
                }
            )
        }
        else {
            // // console.log('update garage record Object ', createRecordObject)  
            createRecordObject.id = this.recordId
            this.secureAction('update', 'data_launch_garage_records', this.recordId, createRecordObject).then(res => {
                    // // console.log('UPDATED EXISTING GARAGE RECORDS ???', res)
                    for (let i = 0; i < this.data.length; i++) {
                        if (this.data[i].id === createRecordObject.id ) {
                            this.data[i] = createRecordObject                          
                        }        
                    }
                    for (let i = 0; i < garageData.length; i++) {
                        if (garageData[i].id === createRecordObject.id) {
                            garageData[i] = createRecordObject                         
                        }
                    }
                    if (closeRecord === true) {
                        this.data.sort((a, b) => b.id - a.id)
                        this.renderHTMLHeader()
                    }
                    else {
                        this.showSavedBanner()
                    }
                },
                err => {
                    // console.log(err)
                    if (closeRecord === true) {
                        this.renderHTMLHeader()
                    }
                    else {
                        this.showSavedBanner()
                    } 
                }
            )
        }    
    }

    updateEquipmentRecord (equipment) {
        this.secureAction('update', 'data_launch_mot_equipment', equipment.equipmentId, {
            last_service_date: equipment.calibrationDate,
            next_service_date: equipment.expiryDate
        }).then(res => {
            // console.log('res update equipment record')
        }, err => {
            console.error(err)
        })
    }
    //// SAVE GARAGE REMINDERS RECORD
    saveGarageRemindersRecord() {
        // Gathering data from the modal form
        let title = document.getElementById('reminder-title').value
        let description = document.getElementById('reminder-description').value
        let dueDate = document.getElementById('reminder-due-date').value
        const garageRemindersRecordId = document.getElementById('garageRemindersRecordId').value;

        // Creating the object to send to the server
        const garageReminderData = {
            garage_id: this.id,
            create_date: this.getFormattedDate(new Date()),
            title: title,
            description: description,
            due_date: this.getFormattedDate(dueDate),
            created_by: user_FIRST_NAME + ' ' + user_LAST_NAME
        };

        if (garageRemindersRecordId === "") {
            // Sending the data to the server to create a new record
            this.secureAction('create', 'data_launch_garage_reminders', null, garageReminderData).then(res => {
                // // console.log('data_launch_garage_reminders res', res);
                document.getElementById('garageRemindersModalOverlay').style.display = 'none';  
                document.getElementById('garageRemindersModal').style.display = 'none';    
                this.injectDataIntoRemindersSubgrid();
            }, err => { 
                console.error(err); 
            });
        } else {
            // Updating the existing record
            let recordId = parseInt(garageRemindersRecordId);
            garageReminderData.id = recordId;
            this.secureAction('update','data_launch_garage_reminders', recordId, garageReminderData).then(res => {
                // // console.log('data_launch_garage_reminders res', res);
                for (let i = 0; i < this.garageRemindersData.length; i++) {
                    if (this.garageRemindersData[i].id === recordId) {
                        this.garageRemindersData[i] = res;
                    }        
                }
                document.getElementById('garageRemindersModalOverlay').style.display = 'none';  
                document.getElementById('garageRemindersModal').style.display = 'none';    
                this.injectDataIntoRemindersSubgrid();
            }, err => { 
                console.error(err); 
            });
        }
    }

    createReminderRecord (equipmentMeta) {
        // Creating the object to send to the server
        let garageReminderData = {
            garage_id: this.id,
            create_date: this.getFormattedDate(new Date()),
            title: 'Calibration Reminder',
            description: `${equipmentMeta.equipmentType} || ${equipmentMeta.make} || ${equipmentMeta.model} || ${equipmentMeta.serialNo} || ${equipmentMeta.calibrationDate}`,
            due_date: this.getFormattedDate(equipmentMeta.expiryDate),
            created_by: user_FIRST_NAME + ' ' + user_LAST_NAME,
            mot_equipment_id: equipmentMeta.equipmentId
        };
        this.secureAction('create', 'data_launch_garage_reminders', null, garageReminderData).then(
            res =>{
            //   // console.log('success creating reminder', res)
              this.injectDataIntoMotEquipmentSubgrid()
              this.injectDataIntoRemindersSubgrid();
            },
            err => {
                console.error('error', err)
                // alert('An Error has Occurred, Please Contact your administrator', err)
                this.showCRUDAlert('An Error has Occurred \n Please try again or contact your administrator', 'error');
                // this.injectDataIntoMotEquipmentSubgrid()
                // this.injectDataIntoRemindersSubgrid();
            }
        )        
    }

    removeExistingReminderRecord(equipmentMeta) {
        for (let i = 0; i < this.garageRemindersData.length; i++) {
            if (equipmentMeta.equipmentId === this.garageRemindersData[i].mot_equipment_id) {
                // // console.log('this.garageRemindersData[i] TO BE DELETED  REMINDER ', this.garageRemindersData[i])
                this.secureAction('delete','data_launch_garage_reminders', this.garageRemindersData[i].id, null).then(
                    success => {
                        console.log('success ', success)
                    },
                    err => {
                        console.error("deleteRecord('data_launch_garage_reminders') error ", err)
                    }
                )
            }
        }        
    }

   

    printGarageBookingReport() {
        let modalContent = document.querySelector(".booking-modal-content");
        if (!modalContent) {
            // alert("Modal content not found!");
            this.showCRUDAlert('Booking content not found \n Please try again or contact your administrator for assistance', 'error')
            return;
        }
    
        let sections = modalContent.querySelectorAll(".tab-content");
    
        let printableHTML = `
            <html>
            <head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <title>Booking Details</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 10px; font-size: 12px; }
                    h2 { text-align: center; font-size: 18px; margin-bottom: 10px; }
                    .container { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; }
                    .half-width { width: 40%; display: inline-block; vertical-align: top; margin-right: 10px; }
                    .full-width { width: 100%; display: block; margin-top: 10px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 5px; }
                    th, td { border: 1px solid black; padding: 6px; text-align: left; font-size: 12px; white-space: nowrap; }
                    th { background: #f0f0f0; text-align: left; }
                    td:first-child { width: 65%; } /* Label column */
                    td:last-child { width: 35%; text-align: right; } /* Value column */
                    .notes-section { width: 100%; margin-top: 15px; }
                    @media print {
                        body { margin: 0; padding: 0; }
                    }
                </style>
            </head>
            <body>
                <h2>Booking Details</h2>
                <div class="container">
        `;
    
        let firstSection = true;
    
        sections.forEach((section, index) => {
            let fields = section.querySelectorAll("label, input, select, textarea");
            if (fields.length === 0) return; 
    
            let layoutClass = "full-width";
            // firstSection = false; 
    
            printableHTML += `<div class="container-fluid">`;
    
            printableHTML += `<div class="${layoutClass}"><table class="table table-striped">`;
    
            fields.forEach(field => {
                if (field.tagName.toLowerCase() === "label") {
                    printableHTML += `<tr><td><strong>${field.innerText.trim()}</strong></td>`;
                } else if (["input", "select", "textarea"].includes(field.tagName.toLowerCase())) {
                    let value = 'N/A';
                    if (field.tagName.toLowerCase() === "select") {
                        value = field.options[field.selectedIndex].text
                    }
                    else if (field.tagName.toLowerCase() === "input") {
                        // // console.log('field', field)
                        if (field.type === 'checkbox') {
                            value = field.checked
                        }
                        else {
                            value = field.value
                        }
                    }
                    else {
                        value = field.value
                    }
                    printableHTML += `<td>${value === 'on' ? 'Yes': value}</td></tr>`;
                }
            });
    
            printableHTML += `</table></div>`;
    
            printableHTML += `</div>`; 
        });

        printableHTML += `
                </div>
            </body>
            </html>
        `;
    
        let printWindow = window.open("", "_blank");
        printWindow.document.write(printableHTML);
        printWindow.document.close();
        printWindow.print();
    }

    /// print MOT Site audit report old - 02/11/2025

    // printMOTSiteAuditReport() {
    //     let modalContent = document.querySelector(".mot-site-audit-modal-content");
    //     if (!modalContent) {
    //         this.showCRUDAlert('MOT Site Audit content not found \n Please try again or contact your administrator for assistance', 'error')
    //         return;
    //     }
    
    //     let sections = modalContent.querySelectorAll(".tab-content");
    
    //     let printableHTML = `
    //         <html>
    //         <head>
    //             <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    //             <title>MOT Site Audit Report</title>
    //             <style>
    //                 body { font-family: Arial, sans-serif; padding: 10px; font-size: 12px; }
    //                 h2 { text-align: center; font-size: 18px; margin-bottom: 10px; }
    //                 .container { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; }
    //                 .half-width { width: 40%; display: inline-block; vertical-align: top; margin-right: 10px; }
    //                 .full-width { width: 100%; display: block; margin-top: 10px; }
    //                 table { width: 100%; border-collapse: collapse; margin-top: 5px; }
    //                 th, td { border: 1px solid black; padding: 6px; text-align: left; font-size: 12px; white-space: nowrap; }
    //                 th { background: #f0f0f0; text-align: left; }
    //                 td:first-child { width: 65%; } /* Label column */
    //                 td:last-child { width: 35%; text-align: right; } /* Value column */
    //                 .notes-section { width: 100%; margin-top: 15px; }
    //                 @media print {
    //                     body { margin: 0; padding: 0; }
    //                 }
    //             </style>
    //         </head>
    //         <body>
    //             <h2>MOT Site Audit Report</h2>
    //             <div class="container">
    //     `;
    
    //     let firstSection = true;
    
    //     sections.forEach((section, index) => {
    //         let fields = section.querySelectorAll("label, input, select, textarea");
    //         if (fields.length === 0) return; 
    
    //         let layoutClass = "full-width";
    //         // firstSection = false; 
    
    //         printableHTML += `<div class="container-fluid">`;
    
    //         printableHTML += `<div class="${layoutClass}"><table class="table table-striped">`;
    
    //         fields.forEach(field => {
    //             if (field.tagName.toLowerCase() === "label") {
    //                 printableHTML += `<tr><td><strong>${field.innerText.trim()}</strong></td>`;
    //             } else if (["input", "select", "textarea"].includes(field.tagName.toLowerCase())) {
    //                 let value = 'N/A';
    //                 if (field.tagName.toLowerCase() === "select") {
    //                     value = field.options[field.selectedIndex].text
    //                 }
    //                 else if (field.tagName.toLowerCase() === "input") {
    //                     // // console.log('field', field)
    //                     if (field.type === 'checkbox') {
    //                         value = field.checked
    //                     }
    //                     else {
    //                         value = field.value
    //                     }
    //                 }
    //                 else {
    //                     value = field.value
    //                 }
    //                 printableHTML += `<td>${value === 'on' ? 'Yes': value}</td></tr>`;
    //             }
    //         });
    
    //         printableHTML += `</table></div>`;
    
    //         printableHTML += `</div>`; 
    //     });

    //     printableHTML += `
    //             </div>
    //         </body>
    //         </html>
    //     `;
    
    //     let printWindow = window.open("", "_blank");
    //     printWindow.document.write(printableHTML);
    //     printWindow.document.close();
    //     printWindow.print();
    // }
    

    printMOTSiteAuditReport() {
  const modalContent = document.querySelector(".mot-site-audit-modal-content");
  if (!modalContent) {
    this.showCRUDAlert(
      "MOT Site Audit content not found \n Please try again or contact your administrator for assistance",
      "error"
    );
    return;
  }

  const sections = modalContent.querySelectorAll(".tab-content");

  let printableHTML = `
    <html>
    <head>
      <title>MOT Site Audit Report</title>
      <style>
        /* Choose ONE page rule. Landscape gives you more width. */
        @page { size: A4 landscape; margin: 8mm; }

        body { font-family: Arial, sans-serif; padding: 10px; font-size: 11px; line-height: 1.28; }
        h2 { text-align: center; font-size: 18px; margin-bottom: 10px; }

        /* Tables */
        table { width: 100%; border-collapse: collapse; margin-top: 6px; table-layout: fixed; }
        th, td { border: 1px solid #000; padding: 4px 6px; text-align: left; vertical-align: top; }

        /* Lock column widths per table and style wrap behavior by column */
        col.label-col { width: 30%; }
        col.value-col { width: 70%; }

        td.label {
          white-space: normal;         /* allow wrapping, but don't split words randomly */
          word-break: normal;
          overflow-wrap: break-word;   /* wrap long tokens at word boundaries where possible */
          hyphens: auto;
          font-weight: 600;
        }
        td.value {
          white-space: pre-wrap;       /* preserve intentional newlines if any */
          word-break: normal;
          overflow-wrap: break-word;   /* allow wrapping long chunks */
          hyphens: auto;
        }

        @media print {
          body { margin: 0; padding: 0; }
          .container, .container-fluid { display: block !important; width: 100% !important; }
          table { page-break-inside: auto; }
          tr, th, td { break-inside: avoid; page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h2>MOT Site Audit Report</h2>
      <div class="container">
  `;

  sections.forEach((section) => {
    const fields = section.querySelectorAll("label, input, select, textarea");
    if (!fields.length) return;

    printableHTML += `<div class="container-fluid">`;
    printableHTML += `
      <table>
        <colgroup>
          <col class="label-col" />
          <col class="value-col" />
        </colgroup>
        <tbody>
    `;

    fields.forEach((field) => {
      const tag = field.tagName.toLowerCase();

      if (tag === "label") {
        printableHTML += `<tr><td class="label"><strong>${field.innerText.trim()}</strong></td>`;
      } else if (tag === "select" || tag === "input" || tag === "textarea") {
        let value = "N/A";

        if (tag === "select") {
          value = field.selectedIndex >= 0 ? (field.options[field.selectedIndex].text || "N/A") : "N/A";
        } else if (tag === "input") {
          if (field.type === "checkbox") {
            value = field.checked ? "Yes" : "No";
          } else if (field.type === "radio") {
            const checked = modalContent.querySelector(`input[type="radio"][name="${field.name}"]:checked`);
            value = checked ? (checked.dataset.label || checked.value) : "N/A";
          } else {
            value = field.value || "N/A";
          }
        } else {
          value = field.value || "N/A";
        }

        if (value === "on") value = "Yes";
        if (typeof value === "string") value = value.trim() || "N/A";

        printableHTML += `<td class="value">${value}</td></tr>`;
      }
    });

    printableHTML += `</tbody></table></div>`;
  });

  printableHTML += `
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(printableHTML);
  printWindow.document.close();
  printWindow.onload = () => { try { printWindow.focus(); } catch(e) {} printWindow.print(); };
  printWindow.onafterprint = () => { try { printWindow.close(); } catch(e) {} };
}


    printQCCheckerForBikeReport() {
        let modalContent = document.querySelector(".qc-checker-for-bikes-modal-content");
        if (!modalContent) {
            this.showCRUDAlert('QC Checkers content not found \n Please try again or contact your administrator for assistance', 'error')
            return;
        }
    
        let sections = modalContent.querySelectorAll(".tab-content");
    
        let printableHTML = `
            <html>
            <head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <title>QC Checker For Bikes Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 10px; font-size: 12px; }
                    h2 { text-align: center; font-size: 18px; margin-bottom: 10px; }
                    .container { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; }
                    .half-width { width: 40%; display: inline-block; vertical-align: top; margin-right: 10px; }
                    .full-width { width: 100%; display: block; margin-top: 10px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 5px; }
                    th, td { border: 1px solid black; padding: 6px; text-align: left; font-size: 12px; white-space: nowrap; }
                    th { background: #f0f0f0; text-align: left; }
                    td:first-child { width: 65%; } /* Label column */
                    td:last-child { width: 35%; text-align: right; } /* Value column */
                    .notes-section { width: 100%; margin-top: 15px; }
                    @media print {
                        body { margin: 0; padding: 0; }
                    }
                </style>
            </head>
            <body>
                <h2>QC Checks (Group B) Report</h2>
                <div class="container">
        `;
    
        let firstSection = true;
    
        sections.forEach((section, index) => {
            let fields = section.querySelectorAll("label, input, select, textarea");
            if (fields.length === 0) return; 
    
            let layoutClass = "full-width";
            // firstSection = false; 
    
            printableHTML += `<div class="container-fluid">`;
    
            printableHTML += `<div class="${layoutClass}"><table class="table table-striped">`;
    
            fields.forEach(field => {
                if (field.tagName.toLowerCase() === "label") {
                    printableHTML += `<tr><td><strong>${field.innerText.trim()}</strong></td>`;
                } else if (["input", "select", "textarea"].includes(field.tagName.toLowerCase())) {
                    let value = 'N/A';
                    if (field.tagName.toLowerCase() === "select") {
                        value = field.options[field.selectedIndex].text
                    }
                    else if (field.tagName.toLowerCase() === "input") {
                        // // console.log('field', field)
                        if (field.type === 'checkbox') {
                            value = field.checked
                        }
                        else if (field.type === 'text') {
                            value = field.value
                        }
                    }
                    else {
                        value = field.innerText
                    }
                    printableHTML += `<td>${value === 'on' ? 'Yes': value}</td></tr>`;
                }
            });
    
            printableHTML += `</table></div>`;
    
            printableHTML += `</div>`; 
        });

        printableHTML += `
                </div>
            </body>
            </html>
        `;
    
        let printWindow = window.open("", "_blank");
        printWindow.document.write(printableHTML);
        printWindow.document.close();
        printWindow.print();
    }

    printQCCheckerReport() {
        let modalContent = document.querySelector(".qc-checker-car-modal-content");
        if (!modalContent) {
            this.showCRUDAlert('QC Checker content not found \n Please try again or contact your administrator for assistance', 'error')
            return;
        }
    
        let sections = modalContent.querySelectorAll(".tab-content");
    
        let printableHTML = `
            <html>
            <head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <title>QC Checker Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 10px; font-size: 12px; }
                    h2 { text-align: center; font-size: 18px; margin-bottom: 10px; }
                    .container { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; }
                    .half-width { width: 40%; display: inline-block; vertical-align: top; margin-right: 10px; }
                    .full-width { width: 100%; display: block; margin-top: 10px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 5px; }
                    th, td { border: 1px solid black; padding: 6px; text-align: left; font-size: 12px; white-space: nowrap; }
                    th { background: #f0f0f0; text-align: left; }
                    td:first-child { width: 65%; } /* Label column */
                    td:last-child { width: 35%; text-align: right; } /* Value column */
                    .notes-section { width: 100%; margin-top: 15px; }
                    @media print {
                        body { margin: 0; padding: 0; }
                    }
                </style>
            </head>
            <body>
                <h2>QC Checker Report</h2>
                <div class="container">
        `;
    
        let firstSection = true;
    
        sections.forEach((section, index) => {
            let fields = section.querySelectorAll("label, input, select, textarea");
            if (fields.length === 0) return; 
    
            let layoutClass = "full-width";
            // firstSection = false; 
    
            printableHTML += `<div class="container-fluid">`;
    
            printableHTML += `<div class="${layoutClass}"><table class="table table-striped">`;
    
            fields.forEach(field => {
                if (field.tagName.toLowerCase() === "label") {
                    printableHTML += `<tr><td><strong>${field.innerText.trim()}</strong></td>`;
                } else if (["input", "select", "textarea"].includes(field.tagName.toLowerCase())) {
                    let value = (field.tagName.toLowerCase() === "select") ? field.options[field.selectedIndex].text : field.value || "N/A";
                    printableHTML += `<td>${value}</td></tr>`;
                }
            });
    
            printableHTML += `</table></div>`;
    
            printableHTML += `</div>`; 
        });
    
        // // Capture "Notes" separately and display it properly
        // let notesField = document.getElementById("data_launch_qc_checkers_for_cars_notes");
        // if (notesField) {
        //     let notesValue = notesField.value.trim() || "No Notes";
        //     printableHTML += `
        //         <div class="notes-section">
        //             <h3>Notes:</h3>
        //             <p>${notesValue}</p>
        //         </div>
        //     `;
        // }
    
        printableHTML += `
                </div>
            </body>
            </html>
        `;
    
        let printWindow = window.open("", "_blank");
        printWindow.document.write(printableHTML);
        printWindow.document.close();
        printWindow.print();
    }

    // printGarageBookingsListReport() {
    //     let modalContent = document.querySelector(".qc-checker-car-modal-content");
    //     if (!modalContent) {
    //         this.showCRUDAlert('QC Checker content not found \n Please try again or contact your administrator for assistance', 'error')
    //         return;
    //     }
    
    //     let sections = modalContent.querySelectorAll(".tab-content");
    
    //     let printableHTML = `
    //         <html>
    //         <head>
    //             <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    //             <title>QC Checker Report</title>
    //             <style>
    //                 body { font-family: Arial, sans-serif; padding: 10px; font-size: 12px; }
    //                 h2 { text-align: center; font-size: 18px; margin-bottom: 10px; }
    //                 .container { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; }
    //                 .half-width { width: 40%; display: inline-block; vertical-align: top; margin-right: 10px; }
    //                 .full-width { width: 100%; display: block; margin-top: 10px; }
    //                 table { width: 100%; border-collapse: collapse; margin-top: 5px; }
    //                 th, td { border: 1px solid black; padding: 6px; text-align: left; font-size: 12px; white-space: nowrap; }
    //                 th { background: #f0f0f0; text-align: left; }
    //                 td:first-child { width: 65%; } /* Label column */
    //                 td:last-child { width: 35%; text-align: right; } /* Value column */
    //                 .notes-section { width: 100%; margin-top: 15px; }
    //                 @media print {
    //                     body { margin: 0; padding: 0; }
    //                 }
    //             </style>
    //         </head>
    //         <body>
    //             <h2>QC Checker Report</h2>
    //             <div class="container">
    //     `;
    
    //     let firstSection = true;
    
    //     sections.forEach((section, index) => {
    //         let fields = section.querySelectorAll("label, input, select, textarea");
    //         if (fields.length === 0) return; 
    
    //         let layoutClass = "full-width";
    //         // firstSection = false; 
    
    //         printableHTML += `<div class="container-fluid">`;
    
    //         printableHTML += `<div class="${layoutClass}"><table class="table table-striped">`;
    
    //         fields.forEach(field => {
    //             if (field.tagName.toLowerCase() === "label") {
    //                 printableHTML += `<tr><td><strong>${field.innerText.trim()}</strong></td>`;
    //             } else if (["input", "select", "textarea"].includes(field.tagName.toLowerCase())) {
    //                 let value = (field.tagName.toLowerCase() === "select") ? field.options[field.selectedIndex].text : field.value || "N/A";
    //                 printableHTML += `<td>${value}</td></tr>`;
    //             }
    //         });
    
    //         printableHTML += `</table></div>`;
    
    //         printableHTML += `</div>`; 
    //     });
    
    //     // // Capture "Notes" separately and display it properly
    //     // let notesField = document.getElementById("data_launch_qc_checkers_for_cars_notes");
    //     // if (notesField) {
    //     //     let notesValue = notesField.value.trim() || "No Notes";
    //     //     printableHTML += `
    //     //         <div class="notes-section">
    //     //             <h3>Notes:</h3>
    //     //             <p>${notesValue}</p>
    //     //         </div>
    //     //     `;
    //     // }
    
    //     printableHTML += `
    //             </div>
    //         </body>
    //         </html>
    //     `;
    
    //     let printWindow = window.open("", "_blank");
    //     printWindow.document.write(printableHTML);
    //     printWindow.document.close();
    //     printWindow.print();
    // }

    printGarageBookingsListReport() {
        // Get the table element
        let tableId = 'garageBookingsListView'
        let table = document.getElementById(tableId);
        if (!table) {
            console.error("❌ Table not found with ID:", tableId);
            return;
        }
    
        // Create printable HTML structure
        let printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>Bookings List</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        text-align: center;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    @media print {
                        body {
                            margin: 0;
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <h2>Printed Table</h2>
                ${table.outerHTML} <!-- Insert table HTML -->
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() { window.close(); };
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
    
    
    
    
    


    // printQCCheckerReport() {
    //     let modalContent = document.querySelector(".qc-checker-car-modal-content");
    //     if (!modalContent) {
    //         alert("Modal content not found!");
    //         return;
    //     }
    
    //     let sections = modalContent.querySelectorAll(".tab-content");
    
    //     let printableHTML = `
    //         <html>
    //         <head>
    //             <title>QC Checker Report</title>
    //             <style>
    //                 body { font-family: Arial, sans-serif; padding: 10px; font-size: 12px; }
    //                 h2 { text-align: center; font-size: 18px; }
    //                 .section { margin-bottom: 5px; page-break-inside: avoid; }
    //                 label { font-weight: bold; display: inline-block; width: 180px; }
    //                 table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    //                 th, td { border: 1px solid black; padding: 4px; text-align: left; font-size: 12px; }
    //                 input, select, textarea { border: none; font-size: 12px; width: auto; }
    //                 @media print {
    //                     body { margin: 0; padding: 0; }
    //                 }
    //             </style>
    //         </head>
    //         <body>
    //             <h2>QC Checker Report</h2>
    //     `;
    
    //     // Loop through each section and extract actual values
    //     sections.forEach(section => {
    //         let sectionTitle = section.previousElementSibling?.innerText || "Section";
    //         printableHTML += `<div class="section"><h3>${sectionTitle}</h3><table>`;
    
    //         // Get all input, select, and textarea fields
    //         let fields = section.querySelectorAll("label, input, select, textarea");
    
    //         fields.forEach(field => {
    //             if (field.tagName.toLowerCase() === "label") {
    //                 printableHTML += `<tr><td><strong>${field.innerText.trim()}</strong></td>`;
    //             } else if (["input", "select", "textarea"].includes(field.tagName.toLowerCase())) {
    //                 let value = field.value || "N/A";
    //                 printableHTML += `<td>${value}</td></tr>`;
    //             }
    //         });
    
    //         printableHTML += `</table></div>`;
    //     });
    
    //     printableHTML += `
    //         </body>
    //         </html>
    //     `;
    
    //     let printWindow = window.open("", "_blank");
    //     printWindow.document.write(printableHTML);
    //     printWindow.document.close();
    //     printWindow.print();
    // }
    
    


    showExistingMotReconciliationRecord (id) {
        let data;
        for (let i = 0; i < this.motReconciliationData.length; i++) {
            if (this.motReconciliationData[i].id === parseInt(id)) {
                data = this.motReconciliationData[i];
                break;
            }
        }
        if (class_invoked_motReconciliation === false) {
            class_invoked_motReconciliation = true
            document.getElementById('garagePage').classList.add('data-launch-hide')
            document.getElementById('motReconciliationsPage').classList.remove('data-launch-hide')
            this.motReconciliationClassModule = new MOTReconciliation(data, this.id, this.garageBookingsData);
        }
        else {
            document.getElementById('garagePage').classList.add('data-launch-hide')
            document.getElementById('motReconciliationsPage').classList.remove('data-launch-hide')
            this.motReconciliationClassModule.renderPage(data, this.id, this.garageBookingsData)
        }
    }

    newMotReconciliationRecord (year, month) {
        let objToSubmit = {
            garage_id: this.id,
            year: year,
            month: month,
            status: 0,
            created_by: user_ID,
            create_date: new Date()
        }
        this.secureAction('create', 'data_launch_mot_reconciliations', null, objToSubmit).then(
            res => {
                this.injectDataIntoMotReconciliationSubgrid()
                // // console.log('successfully created a reconciliation record in the database', res)
                if (class_invoked_motReconciliation === false) {
                    class_invoked_motReconciliation = true
                    document.getElementById('garagePage').classList.add('data-launch-hide')
                    document.getElementById('motReconciliationsPage').classList.remove('data-launch-hide')
                    this.motReconciliationClassModule = new MOTReconciliation(res, this.id, this.garageBookingsData);
                }
                else {
                    document.getElementById('garagePage').classList.add('data-launch-hide')
                    document.getElementById('motReconciliationsPage').classList.remove('data-launch-hide')
                    this.motReconciliationClassModule.renderPage(res, this.id, this.garageBookingsData, {removePreviousFile: true})
                }
            },
            error => {
                console.error(error)
            }
        )

        // //// missing a step here where it pops up the mot reconciliation dialogue box, retrieves month / year values, creates the reconciliation record in sql and passes the 
        // ///// ... resulting value through to the motReconciliationClassModule.
        // if (class_invoked_motReconciliation === false) {
        //     class_invoked_motReconciliation = true
        //     document.getElementById('garagePage').classList.add('data-launch-hide')
        //     document.getElementById('motReconciliationsPage').classList.remove('data-launch-hide')
        //     this.motReconciliationClassModule = new MOTReconciliation(, this.id);
        // }
        // else {
        //     document.getElementById('garagePage').classList.add('data-launch-hide')
        //     document.getElementById('motReconciliationsPage').classList.remove('data-launch-hide')
        //     this.motReconciliationClassModule.renderPage(data, this.id)
        // }
    }

    showNewMotReconciliationRecordModal () {
        document.getElementById('mot_reconciliation_dialogue_year').selectedIndex = -1
        document.getElementById('mot_reconciliation_dialogue_month').selectedIndex = -1
        document.getElementById('motReconciliationModal').style.display = 'block'
    }

    isUserAuthorized(action, table) {
        if (USER_RECORD.full_user === 1) {
            return true
        }
        else if (action === 'create') {
            //// ALL USERS CAN CREATE GARAGE REMINDERS /////
            if (table === 'data_launch_garage_reminders') {
                return true
            }
            /// ALL USERS CAN CREATE GARAGE TESTER RECORDS /////
            if (table === 'data_launch_tester_records') {
                return true
            }
            if (table === 'data_launch_images')    {
                return true
            }         
            else if (table === 'tester_garages') {
                if (USER_RECORD.testers_create === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_users') {
                if (USER_RECORD.garage_users_create === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_reconciliations') {
                if (USER_RECORD.mot_reconciliations_create === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_equipment') {
                if (USER_RECORD.mot_equipment_create === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_tqis') {
                if (USER_RECORD.tqi_create === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_calibration') {
                if (USER_RECORD.mot_calibrations_create === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_site_audits') {
                if (USER_RECORD.mot_site_audits_create === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_qc_checkers_for_car') {
                if (USER_RECORD.qc_checkers_create === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_garage_bookings') {
                if (USER_RECORD.bookings_create === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_bays') {
                if (USER_RECORD.data_launch_bays_create === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_defect_reports') {
                if (USER_RECORD.defect_reports_create === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_bay_cleaning_log') {
                if (USER_RECORD.mot_bay_cleaning_log_create === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_qc_checkers_for_bike') {
                if (USER_RECORD.qc_checkers_for_bikes_create === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_special_notices_acknowledgements') {
                return true
            }           
        }
        else if (action === 'read') {
            if (table === 'tester_garages') {
                if (USER_RECORD.testers_read === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_images')    {
                return true
            }  
            else if (table === 'data_launch_mot_reconciliations') {
                if (USER_RECORD.mot_reconciliations_read === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_associated_garages') {
                if (USER_RECORD.parent_garage_super_admin === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_users') {
                if (USER_RECORD.garage_users_read === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_bays') {
                if (USER_RECORD.data_launch_bays_read === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_equipment') {
                if (USER_RECORD.mot_equipment_read === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_tqis') {
                if (USER_RECORD.tqi_read === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_calibration') {
                if (USER_RECORD.mot_calibrations_read === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_site_audits') {
                if (USER_RECORD.mot_site_audits_read === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_qc_checkers_for_car') {
                if (USER_RECORD.qc_checkers_read === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_garage_bookings') {
                if (USER_RECORD.bookings_read === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_defect_reports') {
                if (USER_RECORD.defect_reports_read === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_bay_cleaning_log') {
                if (USER_RECORD.mot_bay_cleaning_log_read === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_qc_checkers_for_bike') {
                if (USER_RECORD.qc_checkers_for_bikes_read === 1) {
                    return true
                }
                else {
                    return false
                }
            }            
        }
        else if (action === 'update') {
            if (table === 'tester_garages') {
                if (USER_RECORD.testers_update === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_images')    {
                return true
            }
            else if (table === 'data_launch_garage_records') {
                if (USER_RECORD.garage_details_update === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_bays') {
                if (USER_RECORD.data_launch_bays_update === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_reconciliations') {
                if (USER_RECORD.mot_reconciliations_update === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_users') {
                if (USER_RECORD.garage_users_update === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_equipment') {
                if (USER_RECORD.mot_equipment_update === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_tqis') {
                if (USER_RECORD.tqi_update === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_calibration') {
                if (USER_RECORD.mot_calibrations_update === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_site_audits') {
                if (USER_RECORD.mot_site_audits_update === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_qc_checkers_for_car') {
                if (USER_RECORD.qc_checkers_update === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_garage_bookings') {
                if (USER_RECORD.bookings_update === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_defect_reports') {
                if (USER_RECORD.defect_reports_update === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_bay_cleaning_log') {
                if (USER_RECORD.mot_bay_cleaning_log_update === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_qc_checkers_for_bike') {
                if (USER_RECORD.qc_checkers_for_bikes_update === 1) {
                    return true
                }
                else {
                    return false
                }
            }            
        }
        else if (action === 'delete') {
            if (table === 'tester_garages') {
                if (USER_RECORD.testers_delete === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_reconciliations') {
                if (USER_RECORD.mot_reconciliations_delete === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_garage_records') {
                if (USER_RECORD.garage_details_delete === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_garage_reminders') {
                if (USER_RECORD.garage_reminders_delete === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_users') {
                if (USER_RECORD.garage_users_delete === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_bays') {
                if (USER_RECORD.data_launch_bays_delete === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_tqis') {
                if (USER_RECORD.tqi_delete === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_equipment') {
                if (USER_RECORD.mot_equipment_delete === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_calibration') {
                if (USER_RECORD.mot_calibrations_delete === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_site_audits') {
                if (USER_RECORD.mot_site_audits_delete === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_qc_checkers_for_car') {
                if (USER_RECORD.qc_checkers_delete === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_garage_bookings') {
                if (USER_RECORD.bookings_delete === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_defect_reports') {
                if (USER_RECORD.defect_reports_delete === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_mot_bay_cleaning_log') {
                if (USER_RECORD.mot_bay_cleaning_log_delete === 1) {
                    return true
                }
                else {
                    return false
                }
            }
            else if (table === 'data_launch_qc_checkers_for_bike') {
                if (USER_RECORD.qc_checkers_for_bikes_delete === 1) {
                    return true
                }
                else {
                    return false
                }
            }            
        }
        else {
            return false
        }
    }

      ///////  MOT CALIBRATION SUBGRID MODAL HANDLERS
    ////// SHOW MODAL FOR NEW RECORD 
    showMotCalibrationModal () {
        this.motCalibrationDocumentFiles = []
        document.getElementById('motCalibrationModal').style.display = 'block'
        document.getElementById(`garageMotCalibrationsDocumentsTableBody_${this.id}`).innerHTML = ''
        document.getElementById(`garageMotCalibrationUploadDocumentButton_${this.id}`).style.display = 'none'    
        document.getElementById(`garageMotCalibrationUploadDocumentButtonLabel_${this.id}`).style.display = 'none'
        document.getElementById(`garageMotCalibrationUploadBanner_${this.id}`).style.display = 'block';
            
        document.getElementById('mot_equipment_type').value = ''
        document.getElementById('mot_make').value =''
        document.getElementById('mot_model').value = ''
        document.getElementById('mot_serial_no').value = ''
        let html = `<option value="">Please Choose Bay</option>`
        // // console.log('this.garageBayData', this.garageBayData)
        for (let i = 0; i < this.garageBayData.length; i++) {
            html +=  
            `
            <option
                class="data-launch-mot-calibration-record-bay-select"
                value="${this.garageBayData[i].id}"
                data-name="${this.garageBayData[i].bay_name}"
                data-mot-bay="${this.garageBayData[i].mot_bay}"
                data-time-segments="${this.garageBayData[i].time_segments}"
                data-id="${this.garageBayData[i].id}">
            ${this.garageBayData[i].bay_name} / ${this.garageBayData[i].time_segments}
            </option>
            `
        }
        document.getElementById('mot_bay').innerHTML = html
        
        document.getElementById('mot_calibration_date').value = new Date().toISOString().split('T')[0];
        document.getElementById('mot_calibration_recommended_frequency').value = ''
        
        
        document.getElementById('mot_calibration_expiry_date').value = ''
        document.getElementById('mot_notes').value = ''
        document.getElementById('motCalibrationRecordId').value = ''

        document.getElementById('mot_equipment_type').disabled = false
        
        let html2 = `<option value="">Please Choose Equipment Record</option>`
        // // console.log('this.motEquipmentData', this.motEquipmentData)
        for (let i = 0; i < this.motEquipmentData.length; i++) {
            html2 +=  
            `
            <option
                class="data-launch-mot-calibration-record-equipment-select"
                value="${this.motEquipmentData[i].id}"
                data-make="${this.motEquipmentData[i].make}"
                data-equipment-type="${this.motEquipmentData[i].equipment_type}"
                data-model="${this.motEquipmentData[i].model}"
                data-frequency="${this.motEquipmentData[i].calibration_frequency}"
                data-serial-no="${this.motEquipmentData[i].serial_no}"
                data-bay="${this.motEquipmentData[i].bay}"
                data-id="${this.motEquipmentData[i].id}">
            ${this.motEquipmentData[i].equipment_type} / ${this.motEquipmentData[i].make} / ${this.motEquipmentData[i].model} / Bay: ${this.motEquipmentData[i].bay}
            </option>
            `
        }
        document.getElementById('mot_equipment_type').innerHTML = html2
        // document.getElementById('mot_image_container').style.display = 'none'
    }
    ////// MOT CALIBRATION SUBGRID MODAL HANDLERS
    ///// SAVE NEW OR EXISTING RECORD
    saveNewMotCalibration() {
        // Gathering data from the modal form
        let equipmentTypeElement = document.getElementById('mot_equipment_type')
        let selectedIndex = equipmentTypeElement.selectedIndex;
        let selectedOption = equipmentTypeElement.options[selectedIndex];
        let equipmentType = selectedOption.attributes["data-equipment-type"].value;
        let equipmentId = parseInt(selectedOption.attributes["data-id"].value)
        let make = document.getElementById('mot_make').value;
        let model = document.getElementById('mot_model').value;
        let serialNo = document.getElementById('mot_serial_no').value;
        let bay = document.getElementById('mot_bay').value;
        let calibrationDate = document.getElementById('mot_calibration_date').value;
        let expiryDate = document.getElementById('mot_calibration_expiry_date').value;
        let notes = document.getElementById('mot_notes').value;
        // let frequency = document.getElementById('mot_calibration_recommended_frequency').value;
        // const imageFile = document.getElementById('mot_image_upload').files[0];
        let motCalibrationRecordId = document.getElementById('motCalibrationRecordId').value;

        // Creating the object to send to the server
        let newRecord = {
            equipment_type: equipmentType,
            equipment_id: equipmentId,
            make: make,
            model: model,
            serial_no: serialNo,
            calibration_date: calibrationDate,
            calibration_expiry_date: expiryDate,
            notes: notes,
            garage_id: this.id,
            bay: bay,
            required_frequency: selectedOption.attributes["data-frequency"].value
        };
        // // console.log('equipmentTypeElement', equipmentTypeElement)
        let equipmentMeta = {
            make: selectedOption.attributes["data-make"].value,
            model: selectedOption.attributes["data-model"].value,
            serialNo: selectedOption.attributes["data-serial-no"].value,
            equipmentId: parseInt(selectedOption.attributes["data-id"].value),
            equipmentType: equipmentType,
            expiryDate: expiryDate,
            calibrationDate: calibrationDate,
            garageId: this.id
        }
        // // console.log('equipmentMeta', equipmentMeta)
        if (motCalibrationRecordId === "") {
            // Sending the data to the server to create a new record
            this.secureAction('create', 'data_launch_mot_calibration', null, newRecord).then(res => {
                // // console.log('data_launch_mot_calibration res', res)
                for (let i = 0; i < this.motCalibrationDocumentFiles.length; i++) {
                    this.motCalibrationDocumentFiles[i].tester_id = this.id
                    this.motCalibrationDocumentFiles[i].record_id = res.id
                    this.motCalibrationDocumentFiles[i].record_type = 'mot_calibration_images'
                    // // console.log('heres what im trying to send to data_launch_images ' , this.motCalibrationDocumentFiles[i])
                    this.secureAction('create', 'data_launch_images', null, this.motCalibrationDocumentFiles[i]).then(result =>{
                        // console.log('successfully created data launch images result', result)
                    }, err => {
                        console.error(err)
                    })                  
                }
                this.injectDataIntoMotCalibrationSubgrid()
                this.updateEquipmentRecord(equipmentMeta)
                this.createReminderRecord(equipmentMeta)
                this.removeExistingReminderRecord(equipmentMeta)
            }, err => { 
                console.error(err); 
            });
        } else {
            // Updating the existing record
            let recordId = parseInt(motCalibrationRecordId);
            newRecord.id = recordId;
            this.secureAction('update', 'data_launch_mot_calibration', recordId, newRecord).then(res => {
                // // console.log('data_launch_mot_calibration res', res);
                for (let i = 0; i < this.motCalibrationDocumentFiles.length; i++) {
                    this.motCalibrationDocumentFiles[i].tester_id = this.id
                    this.motCalibrationDocumentFiles[i].record_id = res.id
                    this.motCalibrationDocumentFiles[i].record_type = 'mot_calibration_images'
                    // // console.log('heres what im trying to send to data_launch_images ' , this.motCalibrationDocumentFiles[i])
                    this.secureAction('create', 'data_launch_images', null, this.motCalibrationDocumentFiles[i]).then(result =>{
                        // console.log('successfully created data launch images result', result)
                    }, err => {
                        console.error(err)
                    })                  
                }   
                for (let i = 0; i < this.motCalibrationData.length; i++) {
                    if (this.motCalibrationData[i].id === recordId) {
                        this.motCalibrationData[i] = res;
                    }        
                }
                this.injectDataIntoMotCalibrationSubgrid();
                this.updateEquipmentRecord(equipmentMeta)
            }, err => { 
                console.error(err); 
            });
        }
    }
    ////// MOT CALIBRATION SUBGRID MODAL HANDLERS
    ////// SHOW MODAL FOR EXISTING RECORD
    showMotCalibrationDetails(calibrationId) {
        this.motCalibrationId = calibrationId
        document.getElementById(`garageMotCalibrationsDocuments${this.id}`).style.display = 'block'
        this.motCalibrationDocumentFiles = []
        let data;
        for (let i = 0; i < this.motCalibrationData.length; i++) {
            if (this.motCalibrationData[i].id === parseInt(calibrationId)) {
                data = this.motCalibrationData[i];
                break;
            }
        }

        if (!data) {
            console.error('Calibration record not found:', calibrationId);
            return;
        }

        // // console.log('show mot calibration details', data);
        document.getElementById('mot_equipment_type').disabled = true
        document.getElementById('mot_equipment_type').innerHTML = `<option
                                                                            data-id="${data.equipment_id}"
                                                                            data-make="${data.make}"
                                                                            data-model="${data.model}"
                                                                            data-serial-no="${data.serial_no}"
                                                                            data-equipment-type="${data.equipment_type}">${data.equipment_type}</option>`;
        document.getElementById('mot_make').value = data.make;
        document.getElementById('mot_model').value = data.model;
        document.getElementById('mot_serial_no').value = data.serial_no;
        document.getElementById('mot_bay').value = data.bay;
        
        document.getElementById('mot_calibration_date').value = data.calibration_date;
        document.getElementById('mot_calibration_expiry_date').value = data.calibration_expiry_date;
        document.getElementById('mot_notes').value = data.notes;
        document.getElementById('motCalibrationRecordId').value = data.id || '';
        document.getElementById('mot_calibration_recommended_frequency').value = data.required_frequency || ''
        // Display the modal
        document.getElementById('motCalibrationModal').style.display = 'block';
        document.getElementById(`garageMotCalibrationUploadBanner_${this.id}`).style.display = 'none';
        document.getElementById(`garageMotCalibrationUploadDocumentButton_${this.id}`).style.display = 'block'    
        document.getElementById(`garageMotCalibrationUploadDocumentButtonLabel_${this.id}`).style.display = 'block'
        fetchData('data_launch_images', 1000, 0, null, this.id, null,null,null,null, parseInt(this.motCalibrationId), null, null, 'garage_mot_calibration').then(
            res => {
                // // console.log('data_launch_images res', res)
                let imageData = res
                this.motCalibrationDocumentFiles = res
                let htmlPromises = imageData.map((image, i) => 
                    getImageDocUrl(image.name).then(url => {
                      let rowHtml = `
                        <tr id='mot_calibration_files_row_${i}'>
                          <td id='mot_calibration_files_row_${i}_name'>${image.name.substring(0, 20)}</td>
                      `;
                  
                      const fileType = image.name.split('.').pop();
                      if (fileType === 'txt') {
                        rowHtml += `
                          <td>
                            <svg data-name="${image.name}" data-image="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-txt mot-calibration-image-preview" src="${url}" viewBox="0 0 16 16">
                              <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-2v-1h2a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.928 15.849v-3.337h1.136v-.662H0v.662h1.134v3.337zm4.689-3.999h-.894L4.9 13.289h-.035l-.832-1.439h-.932l1.228 1.983-1.24 2.016h.862l.853-1.415h.035l.85 1.415h.907l-1.253-1.992zm1.93.662v3.337h-.794v-3.337H6.619v-.662h3.064v.662H8.546Z"/>
                            </svg>
                          </td>
                        `;
                      } 
                      else if (fileType === 'xls') {
                        rowHtml += `
                        <td>
                            <svg data-name="${image.name}" data-image="false" src="${url}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-xls mot-calibration-image-preview" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM6.472 15.29a1.2 1.2 0 0 1-.111-.449h.765a.58.58 0 0 0 .254.384q.106.073.25.114.143.041.319.041.246 0 .413-.07a.56.56 0 0 0 .255-.193.5.5 0 0 0 .085-.29.39.39 0 0 0-.153-.326q-.152-.12-.462-.193l-.619-.143a1.7 1.7 0 0 1-.539-.214 1 1 0 0 1-.351-.367 1.1 1.1 0 0 1-.123-.524q0-.366.19-.639.19-.272.527-.422.338-.15.777-.149.457 0 .78.152.324.153.5.41.18.255.2.566h-.75a.56.56 0 0 0-.12-.258.6.6 0 0 0-.247-.181.9.9 0 0 0-.369-.068q-.325 0-.513.152a.47.47 0 0 0-.184.384q0 .18.143.3a1 1 0 0 0 .405.175l.62.143q.326.075.566.211a1 1 0 0 1 .375.358q.135.222.135.56 0 .37-.188.656a1.2 1.2 0 0 1-.539.439q-.351.158-.858.158-.381 0-.665-.09a1.4 1.4 0 0 1-.478-.252 1.1 1.1 0 0 1-.29-.375m-2.945-3.358h-.893L1.81 13.37h-.036l-.832-1.438h-.93l1.227 1.983L0 15.931h.861l.853-1.415h.035l.85 1.415h.908L2.253 13.94zm2.727 3.325H4.557v-3.325h-.79v4h2.487z"/>
                            </svg>
                        </td>
                        
                        `
                    }
                    else if (fileType === 'xlsx') {
                        rowHtml += `
                        <td>
                            <svg data-name="${image.name}" data-image="false" src="${url}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-xlsx mot-calibration-image-preview" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z"/>
                            </svg>
                        </td>
                        
                        `
                    }
                    else if (fileType === 'pdf') {
                        rowHtml += `
                        <td>
                          <svg data-name="${image.name}" data-image="false" src="${url}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-pdf mot-calibration-image-preview" viewBox="0 0 16 16">
                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                            <path d="M4.603 14.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.7 11.7 0 0 0-1.997.406 11.3 11.3 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.245.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 7.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z"/>
                          </svg>
                        </td>                                
                        `
                    }
                    else if (fileType === 'csv') {
                        rowHtml += `
                        <td>
                            <svg data-name="${image.name}" data-image="false" src="${url}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-csv mot-calibration-image-preview" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM3.517 14.841a1.13 1.13 0 0 0 .401.823q.195.162.478.252.284.091.665.091.507 0 .859-.158.354-.158.539-.44.187-.284.187-.656 0-.336-.134-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.566-.21l-.621-.144a1 1 0 0 1-.404-.176.37.37 0 0 1-.144-.299q0-.234.185-.384.188-.152.512-.152.214 0 .37.068a.6.6 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.2-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.439 0-.776.15-.337.149-.527.421-.19.273-.19.639 0 .302.122.524.124.223.352.367.228.143.539.213l.618.144q.31.073.463.193a.39.39 0 0 1 .152.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.167.07-.413.07-.175 0-.32-.04a.8.8 0 0 1-.248-.115.58.58 0 0 1-.255-.384zM.806 13.693q0-.373.102-.633a.87.87 0 0 1 .302-.399.8.8 0 0 1 .475-.137q.225 0 .398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.4 1.4 0 0 0-.489-.272 1.8 1.8 0 0 0-.606-.097q-.534 0-.911.223-.375.222-.572.632-.195.41-.196.979v.498q0 .568.193.976.197.407.572.626.375.217.914.217.439 0 .785-.164t.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.8.8 0 0 1-.118.363.7.7 0 0 1-.272.25.9.9 0 0 1-.401.087.85.85 0 0 1-.478-.132.83.83 0 0 1-.299-.392 1.7 1.7 0 0 1-.102-.627zm8.239 2.238h-.953l-1.338-3.999h.917l.896 3.138h.038l.888-3.138h.879z"/>
                            </svg>
                        </td>                                
                        `
                    }
                    else {
                        rowHtml += `<td id='mot_calibration_files_row_${i}_cdnUrl'>
                                      <img data-image="true" class='mot-calibration-image-preview' style='height: 50px; width: 50px;' src="${url}">
                                    </td>`;
                      }
                  
                      rowHtml += `
                        <td>
                          <i class="bi bi-trash data-launch-subgrid-delete-document-item" data-name='${image.name}' data-row-id='${i}' data-id='${image.id}'></i>
                        </td>  
                        </tr>
                      `;
                      return rowHtml;
                    })
                  );
                  
                  Promise.all(htmlPromises)
                    .then(rows => {
                      // Join all rows together and inject into the DOM
                      const html = rows.join('');
                      document.getElementById(`garageMotCalibrationsDocumentsTableBody_${this.id}`).innerHTML = html;
                    })
                    .catch(err => {
                      console.error('Error building HTML:', err);
                    });
                  





                // let html = ''
                // for (let i = 0; i < imageData.length; i++) {
                //     getImageDocUrl(imageData[i].name).then(
                //         url => {
                //             // console.log('url is ', url)
                //             html += `
                //                 <tr id='mot_calibration_files_row_${i}'>
                //                     <td id='mot_calibration_files_row_${i}_name'>${imageData[i].name.substring(0, 20)}</td>
                //                     `
        
                //             let fileType = imageData[i].name.split('.').pop();
                //             if (fileType === 'txt') {
                //                 html += `
                //                 <td>
                //                     <svg data-name="${imageData[i].name}" data-image="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-txt mot-calibration-image-preview" src="${url}" viewBox="0 0 16 16">
                //                         <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-2v-1h2a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.928 15.849v-3.337h1.136v-.662H0v.662h1.134v3.337zm4.689-3.999h-.894L4.9 13.289h-.035l-.832-1.439h-.932l1.228 1.983-1.24 2.016h.862l.853-1.415h.035l.85 1.415h.907l-1.253-1.992zm1.93.662v3.337h-.794v-3.337H6.619v-.662h3.064v.662H8.546Z"/>
                //                     </svg>
                //                 </td>
                //                 `
                //             }
                //             else {
                //                 html += `<td id='mot_calibration_files_row_${i}_cdnUrl'>
                //                             <img data-image="true" class='mot-calibration-image-preview' style='height: 50px; width: 50px;' src="${url}">
                //                         </td>`
                //             }                    
                //             html += `
                //                     <td>
                //                         <i class="bi bi-trash data-launch-subgrid-delete-document-item" data-name='${imageData[i].name}' data-row-id='${i}' data-id='${imageData[i].id}'></i>
                //                     </td>  
                //                 </tr>
                //             `   
                //         },
                //         err => {
                //             console.error(err)
                //         }
                //     )                             
                // }
                // document.getElementById(`garageMotCalibrationsDocumentsTableBody_${this.id}`).innerHTML = html
            },
            err => {
                // console.log('error', err)
            }
        )
    }


    //// MOT EQUIPMENT MODAL
    showMotEquipmentModal() {
        document.getElementById('data-launch-mot-equipment-modal-box-popup').style.display = 'block';
        
        // Reset all fields
        let selectElement_equipmentType = document.getElementById(`mot_equipment_equipment_type_${this.id}`)
        selectElement_equipmentType.selectedIndex = 0
        document.getElementById(`mot_equipment_make_${this.id}`).value = '';
        document.getElementById(`mot_equipment_bay_${this.id}`).value = '';
        document.getElementById(`mot_equipment_model_${this.id}`).value = '';
        document.getElementById(`mot_equipment_serial_no_${this.id}`).value = '';
        // document.getElementById(`mot_equipment_last_service_date_${this.id}`).value = '';
        // document.getElementById(`mot_equipment_next_service_date_${this.id}`).value = '';
        document.getElementById(`mot_equipment_notes_${this.id}`).value = '';

        let selectElement = document.getElementById(`mot_equipment_calibration_frequency_${this.id}`);
        selectElement.selectedIndex = 0;

        
        // document.getElementById('mot_equipment_image_container').style.display = 'none';
        document.getElementById('motEquipmentRecordId').value = ''; // Hidden input to track record ID
    }
    //////////////////////
    ///// SAVE NEW MOT EQUIPMENT
    saveNewMotEquipment() {
        // Gathering data from the modal form
        let equipmentType = document.getElementById(`mot_equipment_equipment_type_${this.id}`).value;
        let make = document.getElementById(`mot_equipment_make_${this.id}`).value;
        let model = document.getElementById(`mot_equipment_model_${this.id}`).value;
        let bay = document.getElementById(`mot_equipment_bay_${this.id}`).value;
        let serialNo = document.getElementById(`mot_equipment_serial_no_${this.id}`).value;
        // let lastServiceDate = document.getElementById(`mot_equipment_last_service_date_${this.id}`).value;
        // let nextServiceDate = document.getElementById(`mot_equipment_next_service_date_${this.id}`).value;
        let notes = document.getElementById(`mot_equipment_notes_${this.id}`).value;
        let frequency = document.getElementById(`mot_equipment_calibration_frequency_${this.id}`).value;
        // const imageFile = document.getElementById('mot_equipment_image_upload').files[0];
        let motEquipmentRecordId = document.getElementById('motEquipmentRecordId').value;
    
        // Creating the object to send to the server
        let newRecord = {
            equipment_type: equipmentType,
            make: make,
            model: model,
            serial_no: serialNo,
            // last_service_date: lastServiceDate,
            // next_service_date: nextServiceDate,
            bay: bay,
            notes: notes,
            garage_id: this.id,
            calibration_frequency: frequency,
            // ,
            // document_data: base64String,  // Store the image in the document_data
            // document_name: fileName       // Store the file name
        };
    
        if (motEquipmentRecordId === "") {
            
            // Sending the data to the server to create a new record
            // this.secureAction('create', data_launch_mot_equipment', newRecord).then(res => {
            this.secureAction('create', 'data_launch_mot_equipment', null, newRecord).then(res => {
                this.injectDataIntoMotEquipmentSubgrid();
            }, err => { 
                console.error(err); 
            });
        } else {
            // Updating the existing record
            let recordId = parseInt(motEquipmentRecordId);
            newRecord.id = recordId;
            this.secureAction('update', 'data_launch_mot_equipment', recordId, newRecord).then(res => {
                for (let i = 0; i < this.motEquipmentData.length; i++) {
                    if (this.motEquipmentData[i].id === recordId) {
                        this.motEquipmentData[i] = res;
                    }        
                }
                this.injectDataIntoMotEquipmentSubgrid();
            }, err => { 
                console.error(err); 
            });
        }
    }
    /// SHOW MOT EXISTING RECORD
    showMotEquipmentDetails(equipmentId) {
        // Find the equipment record by ID
        let data;
        for (let i = 0; i < this.motEquipmentData.length; i++) {
            if (this.motEquipmentData[i].id === parseInt(equipmentId)) {
                data = this.motEquipmentData[i];
                break; // Stop the loop once the correct record is found
            }
        }
    
        if (!data) {
            console.error('Equipment record not found:', equipmentId);
            return;
        }
    
        document.getElementById(`mot_equipment_equipment_type_${this.id}`).value = data.equipment_type || '';
        document.getElementById(`mot_equipment_make_${this.id}`).value = data.make || '';
        document.getElementById(`mot_equipment_model_${this.id}`).value = data.model || '';
        document.getElementById(`mot_equipment_serial_no_${this.id}`).value = data.serial_no || '';
        document.getElementById(`mot_equipment_bay_${this.id}`).value = data.bay || '';
        // document.getElementById(`mot_equipment_last_service_date_${this.id}`).value = data.last_service_date || '';
        // document.getElementById(`mot_equipment_next_service_date_${this.id}`).value = data.next_service_date || '';
        document.getElementById(`mot_equipment_notes_${this.id}`).value = data.notes || '';
        document.getElementById(`motEquipmentRecordId`).value = data.id || '';

        // // console.log('calibration frequency for specific mot equipment', data.calibration_frequency)
        document.getElementById(`mot_equipment_calibration_frequency_${this.id}`).value = data.calibration_frequency
        // Display the modal
        document.getElementById('data-launch-mot-equipment-modal-box-popup').style.display = 'block';
    }
    
    
    






    //// MOT SITE AUDITS SUBGRID MODAL HANDLERS
    ///// SHOW NEW MODAL FOR BLANK RECORD
    showMotSiteAuditModal() {
        document.getElementById('motSiteAuditModal').style.display = 'block';
        document.getElementById('site_audit_consultant').value = USER_RECORD.first_name + ' ' + USER_RECORD.last_name;
        document.getElementById('site_audit_auditor').value = '';
        document.getElementById('site_audit_auditDate').value = '';
        document.getElementById('siteAuditRecordId').value = '';
        
        // Front of House Compliance Section
        document.getElementById('site_audit_customerAreasAccessible').value = 'n/a';
        document.getElementById('site_audit_receptionClean').value = 'n/a';
        document.getElementById('site_audit_viewingAreaVisible').value = 'n/a';
        document.getElementById('site_audit_facilitiesClean').value = 'n/a';
        document.getElementById('site_audit_noticeBoardUpdated').value = 'n/a';
        document.getElementById('site_audit_examinerDetailsDisplayed').value = 'n/a';
        document.getElementById('site_audit_reducedRateFees').value = 'n/a';
        document.getElementById('site_audit_noticeBoardsVisible').value = 'n/a';
        document.getElementById('site_audit_vt9aCorrectInfo').value = 'n/a';
        document.getElementById('site_audit_openingHoursCorrect').value = 'n/a';
        document.getElementById('site_audit_workloadManagementSystem').value = 'n/a';
        document.getElementById('site_audit_managementSystemDemonstrable').value = 'n/a';
        document.getElementById('site_audit_adequateBookingSystem').value = 'n/a';
        document.getElementById('site_audit_recordsWithoutMot').value = 'n/a';
        document.getElementById('site_audit_emissionReportsMatch').value = 'n/a';
        document.getElementById('site_audit_handoverProcessEffective').value = 'n/a';
        document.getElementById('site_audit_documentationRetrievable').value = 'n/a';
        document.getElementById('site_audit_staffSuggestionsRecorded').value = 'n/a';
        document.getElementById('site_audit_followingCodesOfPractice').value = 'n/a';
        document.getElementById('site_audit_qualityManagementProcess').value = 'n/a';
        document.getElementById('site_audit_calibrationRecordsCorrect').value = 'n/a';
        document.getElementById('site_audit_dvsaFormsAvailable').value = 'n/a';
        document.getElementById('site_audit_equipmentManualsAvailable').value = 'n/a';
        
        // Tester and Staff Compliance Section
        document.getElementById('site_audit_specialNoticesAccessible').value = 'n/a';
        document.getElementById('site_audit_mattersOfTesting').value = 'n/a';
        document.getElementById('site_audit_motTestingGuide').value = 'n/a';
        document.getElementById('site_audit_correctNumberOfStaff').value = 'n/a';
        document.getElementById('site_audit_accessTesterInformation').value = 'n/a';
        document.getElementById('site_audit_bonusForMotTesting').value = 'n/a';
        document.getElementById('site_audit_otherIncentivesInfluence').value = 'n/a';
        document.getElementById('site_audit_qualityChecksRegular').value = 'n/a';
        document.getElementById('site_audit_dvsaTrainingRecords').value = 'n/a';
        document.getElementById('site_audit_cpdTrainingRecords').value = 'n/a';
        document.getElementById('site_audit_monitorTestLogs').value = 'n/a';
        document.getElementById('site_audit_passwordsLeftAvailable').value = 'n/a';
        document.getElementById('site_audit_fraudulentTests').value = 'n/a';
        
        // Equipment and Workshop Compliance Section
        document.getElementById('site_audit_baysMarked').value = 'n/a';
        document.getElementById('site_audit_baysAllowForTests').value = 'n/a';
        document.getElementById('site_audit_correctVehicleRegistered').value = 'n/a';
        document.getElementById('site_audit_workingAreasClean').value = 'n/a';
        document.getElementById('site_audit_housekeepingRegular').value = 'n/a';
        document.getElementById('site_audit_wasteStoredProperly').value = 'n/a';
        document.getElementById('site_audit_staffWorkingSafely').value = 'n/a';
        document.getElementById('site_audit_equipmentInGoodOrder').value = 'n/a';
        document.getElementById('site_audit_motBayLocationApparent').value = 'n/a';
        document.getElementById('site_audit_equipmentMaintained').value = 'n/a';
        document.getElementById('site_audit_maintenanceLogsKept').value = 'n/a';
        document.getElementById('site_audit_emissionReportsAvailable').value = 'n/a';
        
        // Tools in Working Order Section
        document.getElementById('site_audit_treadDepthGauge').value = 'n/a';
        document.getElementById('site_audit_inspectionLamp').value = 'n/a';
        document.getElementById('site_audit_pryPinchBars').value = 'n/a';
        document.getElementById('site_audit_corrosionTool').value = 'n/a';
        document.getElementById('site_audit_steelTapeMeasure').value = 'n/a';
        document.getElementById('site_audit_mirrorCameras').value = 'n/a';
        document.getElementById('site_audit_wheelChocks').value = 'n/a';
        document.getElementById('site_audit_brakePedalDepressor').value = 'n/a';
        document.getElementById('site_audit_trailerSocketTestingTool').value = 'n/a';
        document.getElementById('site_audit_leakDetectionSpray').value = 'n/a';
        document.getElementById('site_audit_oilTemperatureProbe').value = 'n/a';
        document.getElementById('site_audit_emissionReportSameFindings').value = '';
        document.getElementById('site_audit_siteAuditFindings').value = '';
        document.getElementById('site_audit_auditorPrint').value = '';

        // notes section
        // document.getElementById('site_audit_Notes').value = '';
        
    }
    //// MOT SITE AUDITS SUBGRID MODAL HANDLERS
    ////// SHOW MODAL FOR EXISTING RECORD
    showMotSiteAuditDetails (id) {
        document.getElementById('motSiteAuditModal').style.display = 'block'    
        let record;
        for (let i = 0; i < this.motSiteAuditData.length; i++) {
            if (this.motSiteAuditData[i].id === parseInt(id)) {
                record = this.motSiteAuditData[i]
            }        
        }
        // Populate the modal with the record data
        document.getElementById('site_audit_consultant').value = record.consultant || '';
        document.getElementById('site_audit_auditor').value = record.auditor || '';
        document.getElementById('site_audit_auditDate').value = record.date || '';
        document.getElementById('siteAuditRecordId').value = id

        // Front of House Compliance Section
        document.getElementById('site_audit_customerAreasAccessible').value = record.are_customer_areas_accessible || 'n/a';
        document.getElementById('site_audit_receptionClean').value = record.are_customer_reception_clean || 'n/a';
        document.getElementById('site_audit_viewingAreaVisible').value = record.can_customers_identify_viewing_area || 'n/a';
        document.getElementById('site_audit_facilitiesClean').value = record.are_customer_facilities_clean || 'n/a';
        document.getElementById('site_audit_noticeBoardUpdated').value = record.is_notice_board_up_to_date || 'n/a';
        document.getElementById('site_audit_examinerDetailsDisplayed').value = record.are_authorised_examiner_details_correct || 'n/a';
        document.getElementById('site_audit_reducedRateFees').value = record.are_test_fees_reduced || 'n/a';
        document.getElementById('site_audit_noticeBoardsVisible').value = record.are_notice_boards_visible || 'n/a';
        document.getElementById('site_audit_vt9aCorrectInfo').value = record.are_vt9a_parts_displayed || 'n/a';
        document.getElementById('site_audit_openingHoursCorrect').value = record.are_opening_hours_displayed_correctly || 'n/a';
        document.getElementById('site_audit_workloadManagementSystem').value = record.is_workload_management_system_appropriate || 'n/a';
        document.getElementById('site_audit_managementSystemDemonstrable').value = record.can_management_system_be_demonstrated || 'n/a';
        document.getElementById('site_audit_adequateBookingSystem').value = record.does_vts_have_booking_system || 'n/a';
        document.getElementById('site_audit_recordsWithoutMot').value = record.can_vts_provide_no_mot_records || 'n/a';
        document.getElementById('site_audit_emissionReportsMatch').value = record.can_emission_reports_be_matched || 'n/a';
        document.getElementById('site_audit_handoverProcessEffective').value = record.does_vts_have_handover_process || 'n/a';
        document.getElementById('site_audit_documentationRetrievable').value = record.is_documentation_easily_retrievable || 'n/a';
        document.getElementById('site_audit_staffSuggestionsRecorded').value = record.are_staff_suggestions_recorded || 'n/a';
        document.getElementById('site_audit_followingCodesOfPractice').value = record.are_codes_of_practice_followed || 'n/a';
        document.getElementById('site_audit_qualityManagementProcess').value = record.does_vts_have_quality_management_process || 'n/a';
        document.getElementById('site_audit_calibrationRecordsCorrect').value = record.are_calibration_records_correct || 'n/a';
        document.getElementById('site_audit_dvsaFormsAvailable').value = record.are_dvsa_forms_available || 'n/a';
        document.getElementById('site_audit_equipmentManualsAvailable').value = record.are_mot_equipment_manuals_available || 'n/a';

        // Tester and Staff Compliance Section
        document.getElementById('site_audit_specialNoticesAccessible').value = record.are_special_notices_accessible || 'n/a';
        document.getElementById('site_audit_mattersOfTesting').value = record.does_vts_employees_read_mot_blog || 'n/a';
        document.getElementById('site_audit_motTestingGuide').value = record.can_staff_reference_mot_testing_guide || 'n/a';
        document.getElementById('site_audit_correctNumberOfStaff').value = record.does_vts_have_correct_number_of_staff || 'n/a';
        document.getElementById('site_audit_accessTesterInformation').value = record.can_staff_access_mts_system || 'n/a';
        document.getElementById('site_audit_bonusForMotTesting').value = record.does_vts_offer_bonus_for_mot_testing || 'n/a';
        document.getElementById('site_audit_otherIncentivesInfluence').value = record.does_vts_offer_incentives_influencing_mot || 'n/a';
        document.getElementById('site_audit_qualityChecksRegular').value = record.are_mot_testers_quality_checked || 'n/a';
        document.getElementById('site_audit_dvsaTrainingRecords').value = record.does_vts_have_dvsa_training_records || 'n/a';
        document.getElementById('site_audit_cpdTrainingRecords').value = record.does_vts_have_cpd_training_records || 'n/a';
        document.getElementById('site_audit_monitorTestLogs').value = record.does_vts_monitor_test_logs || 'n/a';
        document.getElementById('site_audit_passwordsLeftAvailable').value = record.have_tester_passwords_been_compromised || 'n/a';
        document.getElementById('site_audit_fraudulentTests').value = record.are_there_indications_of_fraud || 'n/a';

        // Equipment and Workshop Compliance Section
        document.getElementById('site_audit_baysMarked').value = record.are_mot_bays_clearly_marked || 'n/a';
        document.getElementById('site_audit_baysAllowForTests').value = record.do_bays_support_test_volume || 'n/a';
        document.getElementById('site_audit_correctVehicleRegistered').value = record.is_correct_vehicle_registered_on_mts || 'n/a';
        document.getElementById('site_audit_workingAreasClean').value = record.are_working_areas_clean_hazard_free || 'n/a';
        document.getElementById('site_audit_housekeepingRegular').value = record.does_regular_housekeeping_occur || 'n/a';
        document.getElementById('site_audit_wasteStoredProperly').value = record.are_waste_and_recyclables_stored_properly || 'n/a';
        document.getElementById('site_audit_staffWorkingSafely').value = record.do_staff_work_safely || 'n/a';
        document.getElementById('site_audit_equipmentInGoodOrder').value = record.is_workshop_equipment_in_good_order || 'n/a';
        document.getElementById('site_audit_motBayLocationApparent').value = record.is_mot_bay_location_apparent || 'n/a';
        document.getElementById('site_audit_equipmentMaintained').value = record.does_vts_maintain_equipment || 'n/a';
        document.getElementById('site_audit_maintenanceLogsKept').value = record.are_maintenance_logs_kept || 'n/a';
        document.getElementById('site_audit_emissionReportsAvailable').value = record.does_vts_have_recent_emission_reports || 'n/a';

        // Tools in Working Order Section
        document.getElementById('site_audit_treadDepthGauge').value = record.tread_depth_gauge || 'n/a';
        document.getElementById('site_audit_inspectionLamp').value = record.inspection_lamp || 'n/a';
        document.getElementById('site_audit_pryPinchBars').value = record.pry_pinch_bars || 'n/a';
        document.getElementById('site_audit_corrosionTool').value = record.corrosion_assessment_tool || 'n/a';
        document.getElementById('site_audit_steelTapeMeasure').value = record.steel_tape_measure || 'n/a';
        document.getElementById('site_audit_mirrorCameras').value = record.mirrors_or_cameras_for_lights_check || 'n/a';
        document.getElementById('site_audit_wheelChocks').value = record.wheel_chocks || 'n/a';
        document.getElementById('site_audit_brakePedalDepressor').value = record.brake_pedal_depressor || 'n/a';
        document.getElementById('site_audit_trailerSocketTestingTool').value = record.trailer_socket_testing_tool || 'n/a';
        document.getElementById('site_audit_leakDetectionSpray').value = record.leak_detection_spray || 'n/a';
        document.getElementById('site_audit_oilTemperatureProbe').value = record.oil_temperature_probe || 'n/a';
        document.getElementById('site_audit_emissionReportSameFindings').value = record.emission_report_same_findings || '';
        document.getElementById('site_audit_siteAuditFindings').value = record.site_audit_findings || '';
        document.getElementById('site_audit_auditorPrint').value = record.auditor_print || '';

        // notes section
        // document.getElementById('site_audit_Notes').value = record.notes || '';
    }
    //// MOT SITE AUDITS SUBGRID MODAL HANDLERS
    ///// SAVE NEW OR EXISTING RECORD FOR MOT SITE AUDITS
    saveNewMotAuditRecord () {
        // const garageId = document.getElementById('garageId').value;
        // Gathering data from the modal form
        let consultant = document.getElementById('site_audit_consultant').value;
        let auditor = document.getElementById('site_audit_auditor').value;
        let date = document.getElementById('site_audit_auditDate').value;

        let motAuditRecordId = document.getElementById('siteAuditRecordId').value

        // Front of House Compliance Section
        let are_customer_areas_accessible = document.getElementById('site_audit_customerAreasAccessible').value;
        let are_customer_reception_clean = document.getElementById('site_audit_receptionClean').value;
        let can_customers_identify_viewing_area = document.getElementById('site_audit_viewingAreaVisible').value;
        let are_customer_facilities_clean = document.getElementById('site_audit_facilitiesClean').value;
        let is_notice_board_up_to_date = document.getElementById('site_audit_noticeBoardUpdated').value;
        let are_authorised_examiner_details_correct = document.getElementById('site_audit_examinerDetailsDisplayed').value;
        let are_test_fees_reduced = document.getElementById('site_audit_reducedRateFees').value;
        let are_notice_boards_visible = document.getElementById('site_audit_noticeBoardsVisible').value;
        let are_vt9a_parts_displayed = document.getElementById('site_audit_vt9aCorrectInfo').value;
        let are_opening_hours_displayed_correctly = document.getElementById('site_audit_openingHoursCorrect').value;
        let is_workload_management_system_appropriate = document.getElementById('site_audit_workloadManagementSystem').value;
        let can_management_system_be_demonstrated = document.getElementById('site_audit_managementSystemDemonstrable').value;
        let does_vts_have_booking_system = document.getElementById('site_audit_adequateBookingSystem').value;
        let can_vts_provide_no_mot_records = document.getElementById('site_audit_recordsWithoutMot').value;
        let can_emission_reports_be_matched = document.getElementById('site_audit_emissionReportsMatch').value;
        let does_vts_have_handover_process = document.getElementById('site_audit_handoverProcessEffective').value;
        let is_documentation_easily_retrievable = document.getElementById('site_audit_documentationRetrievable').value;
        let are_staff_suggestions_recorded = document.getElementById('site_audit_staffSuggestionsRecorded').value;
        let are_codes_of_practice_followed = document.getElementById('site_audit_followingCodesOfPractice').value;
        let does_vts_have_quality_management_process = document.getElementById('site_audit_qualityManagementProcess').value;
        let are_calibration_records_correct = document.getElementById('site_audit_calibrationRecordsCorrect').value;
        let are_dvsa_forms_available = document.getElementById('site_audit_dvsaFormsAvailable').value;
        let are_mot_equipment_manuals_available = document.getElementById('site_audit_equipmentManualsAvailable').value;

        // Tester and Staff Compliance Section
        let are_special_notices_accessible = document.getElementById('site_audit_specialNoticesAccessible').value;
        let does_vts_employees_read_mot_blog = document.getElementById('site_audit_mattersOfTesting').value;
        let can_staff_reference_mot_testing_guide = document.getElementById('site_audit_motTestingGuide').value;
        let does_vts_have_correct_number_of_staff = document.getElementById('site_audit_correctNumberOfStaff').value;
        let can_staff_access_mts_system = document.getElementById('site_audit_accessTesterInformation').value;
        let does_vts_offer_bonus_for_mot_testing = document.getElementById('site_audit_bonusForMotTesting').value;
        let does_vts_offer_incentives_influencing_mot = document.getElementById('site_audit_otherIncentivesInfluence').value;
        let are_mot_testers_quality_checked = document.getElementById('site_audit_qualityChecksRegular').value;
        let does_vts_have_dvsa_training_records = document.getElementById('site_audit_dvsaTrainingRecords').value;
        let does_vts_have_cpd_training_records = document.getElementById('site_audit_cpdTrainingRecords').value;
        let does_vts_monitor_test_logs = document.getElementById('site_audit_monitorTestLogs').value;
        let have_tester_passwords_been_compromised = document.getElementById('site_audit_passwordsLeftAvailable').value;
        let are_there_indications_of_fraud = document.getElementById('site_audit_fraudulentTests').value;

        // Equipment and Workshop Compliance Section
        let are_mot_bays_clearly_marked = document.getElementById('site_audit_baysMarked').value;
        let do_bays_support_test_volume = document.getElementById('site_audit_baysAllowForTests').value;
        let is_correct_vehicle_registered_on_mts = document.getElementById('site_audit_correctVehicleRegistered').value;
        let are_working_areas_clean_hazard_free = document.getElementById('site_audit_workingAreasClean').value;
        let does_regular_housekeeping_occur = document.getElementById('site_audit_housekeepingRegular').value;
        let are_waste_and_recyclables_stored_properly = document.getElementById('site_audit_wasteStoredProperly').value;
        let do_staff_work_safely = document.getElementById('site_audit_staffWorkingSafely').value;
        let is_workshop_equipment_in_good_order = document.getElementById('site_audit_equipmentInGoodOrder').value;
        let is_mot_bay_location_apparent = document.getElementById('site_audit_motBayLocationApparent').value;
        let does_vts_maintain_equipment = document.getElementById('site_audit_equipmentMaintained').value;
        let are_maintenance_logs_kept = document.getElementById('site_audit_maintenanceLogsKept').value;
        let does_vts_have_recent_emission_reports = document.getElementById('site_audit_emissionReportsAvailable').value;

        // Tools in Working Order Section
        let tread_depth_gauge = document.getElementById('site_audit_treadDepthGauge').value;
        let inspection_lamp = document.getElementById('site_audit_inspectionLamp').value;
        let pry_pinch_bars = document.getElementById('site_audit_pryPinchBars').value;
        let corrosion_assessment_tool = document.getElementById('site_audit_corrosionTool').value;
        let steel_tape_measure = document.getElementById('site_audit_steelTapeMeasure').value;
        let mirrors_or_cameras_for_light_check = document.getElementById('site_audit_mirrorCameras').value;
        let wheel_chocks = document.getElementById('site_audit_wheelChocks').value;
        let brake_pedal_depressor = document.getElementById('site_audit_brakePedalDepressor').value;
        let trailer_socket_testing_tool = document.getElementById('site_audit_trailerSocketTestingTool').value;
        let leak_detection_spray = document.getElementById('site_audit_leakDetectionSpray').value;
        let oil_temperature_probe = document.getElementById('site_audit_oilTemperatureProbe').value;
        let emission_report_same_findings = document.getElementById('site_audit_emissionReportSameFindings').value;
        let site_audit_findings = document.getElementById('site_audit_siteAuditFindings').value;
        let auditor_print = document.getElementById('site_audit_auditorPrint').value;

        // let notes = document.getElementById('site_audit_Notes').value;

        // Creating the object to send to the server
        let motSiteAuditData = {
            garage_id: this.id,
            consultant,
            auditor,
            date,
            are_customer_areas_accessible,
            are_customer_reception_clean,
            can_customers_identify_viewing_area,
            are_customer_facilities_clean,
            is_notice_board_up_to_date,
            are_authorised_examiner_details_correct,
            are_test_fees_reduced,
            are_notice_boards_visible,
            are_vt9a_parts_displayed,
            are_opening_hours_displayed_correctly,
            is_workload_management_system_appropriate,
            can_management_system_be_demonstrated,
            does_vts_have_booking_system,
            can_vts_provide_no_mot_records,
            can_emission_reports_be_matched,
            does_vts_have_handover_process,
            is_documentation_easily_retrievable,
            are_staff_suggestions_recorded,
            are_codes_of_practice_followed,
            does_vts_have_quality_management_process,
            are_calibration_records_correct,
            are_dvsa_forms_available,
            are_mot_equipment_manuals_available,
            are_special_notices_accessible,
            does_vts_employees_read_mot_blog,
            can_staff_reference_mot_testing_guide,
            does_vts_have_correct_number_of_staff,
            can_staff_access_mts_system,
            does_vts_offer_bonus_for_mot_testing,
            does_vts_offer_incentives_influencing_mot,
            are_mot_testers_quality_checked,
            does_vts_have_dvsa_training_records,
            does_vts_have_cpd_training_records,
            does_vts_monitor_test_logs,
            have_tester_passwords_been_compromised,
            are_there_indications_of_fraud,
            are_mot_bays_clearly_marked,
            do_bays_support_test_volume,
            is_correct_vehicle_registered_on_mts,
            are_working_areas_clean_hazard_free,
            does_regular_housekeeping_occur,
            are_waste_and_recyclables_stored_properly,
            do_staff_work_safely,
            is_workshop_equipment_in_good_order,
            is_mot_bay_location_apparent,
            does_vts_maintain_equipment,
            are_maintenance_logs_kept,
            does_vts_have_recent_emission_reports,
            tread_depth_gauge,
            inspection_lamp,
            pry_pinch_bars,
            corrosion_assessment_tool,
            steel_tape_measure,
            mirrors_or_cameras_for_light_check,
            wheel_chocks,
            brake_pedal_depressor,
            trailer_socket_testing_tool,
            leak_detection_spray,
            oil_temperature_probe,
            emission_report_same_findings,
            site_audit_findings,
            auditor_print
        };

        if (motAuditRecordId === "") {
            // Sending the data to the server
                this.secureAction('create', 'data_launch_mot_site_audits', null, motSiteAuditData).then(res => {
                    this.injectDataIntoMotSiteAuditsSubgrid()
                }, err => { 
                    console.error(err); 
            });
        }
        else {
                this.secureAction('update', 'data_launch_mot_site_audits', motAuditRecordId,  motSiteAuditData).then(res => {
                    for (let i = 0; i < this.motSiteAuditData.length; i++) {
                        if (this.motSiteAuditData[i].id=== parseInt(motAuditRecordId)) {
                            this.motSiteAuditData[i] = res
                        }        
                    }
                    this.injectDataIntoMotSiteAuditsSubgrid()
                }, err => { 
                    console.error(err); 
            });
        }
    }





    /// QC CHECKERS MODAL SUBGRID
    //// SHOW NEW MODAL FOR BLANK NEW RECORD
    showQcCheckersModal () {
        document.getElementById('qcCheckerModal').style.display = 'block'

        let html = '<option value="notSelected">Please select a Tester</option>"'
        this.garageTestersData.forEach(tester => {
            html += `<option data-tester-id="${tester.user_id}" value="${tester.name}">${tester.name}</option>`
        })

        document.getElementById('data_launch_qc_checkers_for_cars_testerName').innerHTML = html;
        document.getElementById('data_launch_qc_checkers_for_cars_testerID').value = '';
        document.getElementById('data_launch_qc_checkers_for_cars_vehicleReg').value = '';
        document.getElementById('data_launch_qc_checkers_for_cars_dateOfQC').value = '';
        document.getElementById('data_launch_qc_checkers_for_cars_qcCarriedOutBy').value = '';
        document.getElementById('data_launch_qc_checkers_for_cars_consultant').value = USER_RECORD.first_name + ' ' + USER_RECORD.last_name;
        document.getElementById('data_launch_qc_checkers_for_cars_vehicleClass').value = '';
        document.getElementById('qcCheckerRecordId').value = '';
        
        
        document.getElementById('data_launch_qc_checkers_for_cars_doorsOpen').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_bonnetOpens').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_bootOpens').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_fuelCapOpens').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_chassisNumberTaken').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_conditionOfRegistrationPlate').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_vehicleSafeForTest').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_vehicleCorrectlyRegistered').value = 'yes';
        // document.getElementById('data_launch_qc_checkers_for_cars_brakePedalServoOperation').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_passengerDoorOpens').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_allPassengerSeatsChecked').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_allMandatoryMirrorsChecked').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_handbrakeOperationChecked').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_steeringUJChecked').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_steeringFreePlayChecked').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_steeringAntiTheftLockChecked').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_audibleWarningChecked').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_washersWipersChecked').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_seatbeltsChecked').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_vehicleCorrectlyEnteredEmissionMachine').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_correctEmissionStandardsApplied').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_ntSelectCorrectEmissionLimits').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_oilLevelChecked').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_ntCorrectlyUsesBeamSetter').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_headlampAimChecked').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_headlampUnitsSecure').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_rearLightUnitsSecure').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_lightsInterfereWithAnother').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_ntUsesMethodicalProcess').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_steeringSecurityChecked').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_batterySecure').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_brakeSystemInspectedUnderPressure').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_allFluidLevelsInspected').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_fuelSystemInspected').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_generalConditionInspected').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_steeringInspectedUsingEquipment').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_brakeSystemInspected').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_exhaustChecked').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_driveshaftInspected').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_fuelSystemInspectedWhileRunning').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_suspensionComponentsInspected').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_undersideInspectedForCorrosion').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_vehicleRaisedCorrectly').value = 'yes';
        // document.getElementById('data_launch_qc_checkers_for_cars_vehicleRaisedToHalfHeight').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_tyresInspected').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_suspensionComponentsChecked').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_brakeHosesInspected').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_allGaitersInspected').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_wheelSecurityAssessed').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_brakeComponentsAssessed').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_ntUsedATL').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_conditionOfTurnPlates').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_ntCanUseTurnPlates').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_turnPlatesUsedForLockCheck').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_frontAxleBrakePerformance').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_rearAxleBrakePerformance').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_emergencyBrakePerformance').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_brakeBindReleaseCheck').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_brakeJudderAssessed').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_notes').value = '';
        document.getElementById('data_launch_qc_checkers_for_cars_tqiChecked').value = 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_confirmedByTester').value = '';        
    }
    //// QC CHECKERS MODAL SUBGRID
    ///// SHOW MODAL FOR EXISTING RECORDS
    showQcCheckersDetails(id) {
        document.getElementById('qcCheckerModal').style.display = 'block'    
        let record;
        for (let i = 0; i < this.qcCheckerData.length; i++) {
            if (this.qcCheckerData[i].id === parseInt(id)) {
                record = this.qcCheckerData[i]
            }        
        }

        let html = '<option value="notSelected">Please select a Tester</option>"'
        this.garageTestersData.forEach(tester => {
            html += `<option data-tester-id="${tester.user_id}" value="${tester.name}">${tester.name}</option>`
        })
        document.getElementById('data_launch_qc_checkers_for_cars_testerName').innerHTML = html;

        document.getElementById('data_launch_qc_checkers_for_cars_testerName').value = record.tester_name || '';

        document.getElementById('data_launch_qc_checkers_for_cars_testerID').value = record.tester_id || '';
        document.getElementById('data_launch_qc_checkers_for_cars_vehicleReg').value = record.vehicle_reg || '';
        document.getElementById('data_launch_qc_checkers_for_cars_dateOfQC').value = record.date_of_qc || '';
        document.getElementById('data_launch_qc_checkers_for_cars_qcCarriedOutBy').value = record.qc_carried_out_by || '';
        document.getElementById('data_launch_qc_checkers_for_cars_consultant').value = record.consultant || '';
        document.getElementById('data_launch_qc_checkers_for_cars_vehicleClass').value = record.vehicle_class || '';
        document.getElementById('qcCheckerRecordId').value = record.id || '';
        
        // Pre Checks Section
        document.getElementById('data_launch_qc_checkers_for_cars_doorsOpen').value = record.all_required_doors_open || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_bonnetOpens').value = record.bonnet_opens_as_required || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_bootOpens').value = record.boot_opens_as_required || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_fuelCapOpens').value = record.fuel_cap_opens || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_chassisNumberTaken').value = record.chassis_number_taken || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_conditionOfRegistrationPlate').value = record.condition_of_registration_plate || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_vehicleSafeForTest').value = record.vehicle_safe_for_test || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_vehicleCorrectlyRegistered').value = record.presented_vehicle_correctly_registered || 'yes';
        
        // Inside Vehicle Section
        // document.getElementById('data_launch_qc_checkers_for_cars_brakePedalServoOperation').value = record.brake_pedal_servo_operation_checked || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_passengerDoorOpens').value = record.passenger_door_opens || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_allPassengerSeatsChecked').value = record.all_passenger_seats_checked || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_allMandatoryMirrorsChecked').value = record.all_mandatory_mirrors_checked || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_handbrakeOperationChecked').value = record.handbrake_operation_checked || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_steeringUJChecked').value = record.steering_uj_checked || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_steeringFreePlayChecked').value = record.steering_free_play_checked || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_steeringAntiTheftLockChecked').value = record.steering_anti_theft_lock_checked || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_audibleWarningChecked').value = record.audible_warning_checked || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_washersWipersChecked').value = record.all_washers_wipers_checked || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_seatbeltsChecked').value = record.seatbelts_checked || 'yes';
        
        // Gas Analysis / Diesel Smoke Test Section
        document.getElementById('data_launch_qc_checkers_for_cars_vehicleCorrectlyEnteredEmissionMachine').value = record.vehicle_correctly_entered_emission_machine || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_correctEmissionStandardsApplied').value = record.correct_emission_standards_applied || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_ntSelectCorrectEmissionLimits').value = record.nt_select_correct_emission_limits || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_oilLevelChecked').value = record.oil_level_checked || 'yes';
        
        // Vehicle Light Section
        document.getElementById('data_launch_qc_checkers_for_cars_ntCorrectlyUsesBeamSetter').value = record.nt_correctly_uses_beam_setter || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_headlampAimChecked').value = record.headlamp_aim_checked || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_headlampUnitsSecure').value = record.headlamp_units_secure || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_rearLightUnitsSecure').value = record.rear_light_units_secure || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_lightsInterfereWithAnother').value = record.lights_interfere_with_another || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_ntUsesMethodicalProcess').value = record.nt_uses_methodical_process || 'yes';
        
        // Bonnet Open Section
        document.getElementById('data_launch_qc_checkers_for_cars_steeringSecurityChecked').value = record.steering_security_checked || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_batterySecure').value = record.battery_secure || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_brakeSystemInspectedUnderPressure').value = record.brake_system_inspected_under_pressure || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_allFluidLevelsInspected').value = record.all_fluid_levels_inspected || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_fuelSystemInspected').value = record.fuel_system_inspected || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_generalConditionInspected').value = record.general_condition_inspected || 'yes';
        
        // Vehicle raised to full height Section
        document.getElementById('data_launch_qc_checkers_for_cars_steeringInspectedUsingEquipment').value = record.steering_inspected_using_equipment || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_brakeSystemInspected').value = record.brake_system_inspected || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_exhaustChecked').value = record.exhaust_checked || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_driveshaftInspected').value = record.driveshaft_inspected || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_fuelSystemInspectedWhileRunning').value = record.fuel_system_inspected_while_running || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_suspensionComponentsInspected').value = record.suspension_components_inspected || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_undersideInspectedForCorrosion').value = record.underside_inspected_for_corrosion || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_vehicleRaisedCorrectly').value = record.vehicle_raised_correctly || 'yes';
        
        // Vehicle Raised to half height Section
        document.getElementById('data_launch_qc_checkers_for_cars_tyresInspected').value = record.tyres_inspected || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_suspensionComponentsChecked').value = record.suspension_components_checked || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_brakeHosesInspected').value = record.brake_hoses_inspected || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_allGaitersInspected').value = record.all_gaiters_inspected || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_wheelSecurityAssessed').value = record.wheel_security_assessed || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_brakeComponentsAssessed').value = record.brake_components_assessed || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_ntUsedATL').value = record.nt_used_atl || 'yes';
        
        // Use of turn plates Section
        document.getElementById('data_launch_qc_checkers_for_cars_conditionOfTurnPlates').value = record.condition_of_turn_plates || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_ntCanUseTurnPlates').value = record.nt_can_use_turn_plates || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_turnPlatesUsedForLockCheck').value = record.turn_plates_used_for_lock_check || 'yes';
        
        // Brake Performance Test Section
        document.getElementById('data_launch_qc_checkers_for_cars_frontAxleBrakePerformance').value = record.front_axle_brake_performance || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_rearAxleBrakePerformance').value = record.rear_axle_brake_performance || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_emergencyBrakePerformance').value = record.emergency_brake_performance || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_brakeBindReleaseCheck').value = record.brake_bind_release_check || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_brakeJudderAssessed').value = record.brake_judder_assessed || 'yes';
        document.getElementById('data_launch_qc_checkers_for_cars_notes').value = record.notes || '';
        document.getElementById('data_launch_qc_checkers_for_cars_tqiChecked').value = record.tqi_checked || 'n/a';
        document.getElementById('data_launch_qc_checkers_for_cars_confirmedByTester').value = record.confirmed_by_tester || '';        
    }
    ///// QC CHECKERS MODAL SUBGRID
    ////// SAVE NEW OR EXISTING RECORD TO QC CHECKERS
    saveNewQcCheckersRecord() {
        // Gathering data from the modal form
        let testerName = document.getElementById('data_launch_qc_checkers_for_cars_testerName').value;
        let testerID = document.getElementById('data_launch_qc_checkers_for_cars_testerID').value;
        let vehicleReg = document.getElementById('data_launch_qc_checkers_for_cars_vehicleReg').value;
        let dateOfQC = document.getElementById('data_launch_qc_checkers_for_cars_dateOfQC').value;
        let qcCarriedOutBy = document.getElementById('data_launch_qc_checkers_for_cars_qcCarriedOutBy').value;
        let consultant = document.getElementById('data_launch_qc_checkers_for_cars_consultant').value;
        let vehicleClass = document.getElementById('data_launch_qc_checkers_for_cars_vehicleClass').value;
        let qcCheckerRecordId = document.getElementById('qcCheckerRecordId').value;
        
        // Pre Checks Section
        let doorsOpen = document.getElementById('data_launch_qc_checkers_for_cars_doorsOpen').value;
        let bonnetOpens = document.getElementById('data_launch_qc_checkers_for_cars_bonnetOpens').value;
        let bootOpens = document.getElementById('data_launch_qc_checkers_for_cars_bootOpens').value;
        let fuelCapOpens = document.getElementById('data_launch_qc_checkers_for_cars_fuelCapOpens').value;
        let chassisNumberTaken = document.getElementById('data_launch_qc_checkers_for_cars_chassisNumberTaken').value;
        let conditionOfRegistrationPlate = document.getElementById('data_launch_qc_checkers_for_cars_conditionOfRegistrationPlate').value;
        let vehicleSafeForTest = document.getElementById('data_launch_qc_checkers_for_cars_vehicleSafeForTest').value;
        let vehicleCorrectlyRegistered = document.getElementById('data_launch_qc_checkers_for_cars_vehicleCorrectlyRegistered').value;
        
        // Inside Vehicle Section
        // let brakePedalServoOperation = document.getElementById('data_launch_qc_checkers_for_cars_brakePedalServoOperation').value;
        let passengerDoorOpens = document.getElementById('data_launch_qc_checkers_for_cars_passengerDoorOpens').value;
        let allPassengerSeatsChecked = document.getElementById('data_launch_qc_checkers_for_cars_allPassengerSeatsChecked').value;
        let allMandatoryMirrorsChecked = document.getElementById('data_launch_qc_checkers_for_cars_allMandatoryMirrorsChecked').value;
        let handbrakeOperationChecked = document.getElementById('data_launch_qc_checkers_for_cars_handbrakeOperationChecked').value;
        let steeringUJChecked = document.getElementById('data_launch_qc_checkers_for_cars_steeringUJChecked').value;
        let steeringFreePlayChecked = document.getElementById('data_launch_qc_checkers_for_cars_steeringFreePlayChecked').value;
        let steeringAntiTheftLockChecked = document.getElementById('data_launch_qc_checkers_for_cars_steeringAntiTheftLockChecked').value;
        let audibleWarningChecked = document.getElementById('data_launch_qc_checkers_for_cars_audibleWarningChecked').value;
        let washersWipersChecked = document.getElementById('data_launch_qc_checkers_for_cars_washersWipersChecked').value;
        let seatbeltsChecked = document.getElementById('data_launch_qc_checkers_for_cars_seatbeltsChecked').value;
        
        // Gas Analysis / Diesel Smoke Test Section
        let vehicleCorrectlyEnteredEmissionMachine = document.getElementById('data_launch_qc_checkers_for_cars_vehicleCorrectlyEnteredEmissionMachine').value;
        let correctEmissionStandardsApplied = document.getElementById('data_launch_qc_checkers_for_cars_correctEmissionStandardsApplied').value;
        let ntSelectCorrectEmissionLimits = document.getElementById('data_launch_qc_checkers_for_cars_ntSelectCorrectEmissionLimits').value;
        let oilLevelChecked = document.getElementById('data_launch_qc_checkers_for_cars_oilLevelChecked').value;
        
        // Vehicle Light Section
        let ntCorrectlyUsesBeamSetter = document.getElementById('data_launch_qc_checkers_for_cars_ntCorrectlyUsesBeamSetter').value;
        let headlampAimChecked = document.getElementById('data_launch_qc_checkers_for_cars_headlampAimChecked').value;
        let headlampUnitsSecure = document.getElementById('data_launch_qc_checkers_for_cars_headlampUnitsSecure').value;
        let rearLightUnitsSecure = document.getElementById('data_launch_qc_checkers_for_cars_rearLightUnitsSecure').value;
        let lightsInterfereWithAnother = document.getElementById('data_launch_qc_checkers_for_cars_lightsInterfereWithAnother').value;
        let ntUsesMethodicalProcess = document.getElementById('data_launch_qc_checkers_for_cars_ntUsesMethodicalProcess').value;
        
        // Bonnet Open Section
        let steeringSecurityChecked = document.getElementById('data_launch_qc_checkers_for_cars_steeringSecurityChecked').value;
        let batterySecure = document.getElementById('data_launch_qc_checkers_for_cars_batterySecure').value;
        let brakeSystemInspectedUnderPressure = document.getElementById('data_launch_qc_checkers_for_cars_brakeSystemInspectedUnderPressure').value;
        let allFluidLevelsInspected = document.getElementById('data_launch_qc_checkers_for_cars_allFluidLevelsInspected').value;
        let fuelSystemInspected = document.getElementById('data_launch_qc_checkers_for_cars_fuelSystemInspected').value;
        let generalConditionInspected = document.getElementById('data_launch_qc_checkers_for_cars_generalConditionInspected').value;
        
        // Vehicle raised to full height Section
        let steeringInspectedUsingEquipment = document.getElementById('data_launch_qc_checkers_for_cars_steeringInspectedUsingEquipment').value;
        let brakeSystemInspected = document.getElementById('data_launch_qc_checkers_for_cars_brakeSystemInspected').value;
        let exhaustChecked = document.getElementById('data_launch_qc_checkers_for_cars_exhaustChecked').value;
        let driveshaftInspected = document.getElementById('data_launch_qc_checkers_for_cars_driveshaftInspected').value;
        let fuelSystemInspectedWhileRunning = document.getElementById('data_launch_qc_checkers_for_cars_fuelSystemInspectedWhileRunning').value;
        let suspensionComponentsInspected = document.getElementById('data_launch_qc_checkers_for_cars_suspensionComponentsInspected').value;
        let undersideInspectedForCorrosion = document.getElementById('data_launch_qc_checkers_for_cars_undersideInspectedForCorrosion').value;
        let vehicleRaisedCorrectly = document.getElementById('data_launch_qc_checkers_for_cars_vehicleRaisedCorrectly').value;
        
        // Vehicle Raised to half height Section
        let tyresInspected = document.getElementById('data_launch_qc_checkers_for_cars_tyresInspected').value;
        let suspensionComponentsChecked = document.getElementById('data_launch_qc_checkers_for_cars_suspensionComponentsChecked').value;
        let brakeHosesInspected = document.getElementById('data_launch_qc_checkers_for_cars_brakeHosesInspected').value;
        let allGaitersInspected = document.getElementById('data_launch_qc_checkers_for_cars_allGaitersInspected').value;
        let wheelSecurityAssessed = document.getElementById('data_launch_qc_checkers_for_cars_wheelSecurityAssessed').value;
        let brakeComponentsAssessed = document.getElementById('data_launch_qc_checkers_for_cars_brakeComponentsAssessed').value;
        let ntUsedATL = document.getElementById('data_launch_qc_checkers_for_cars_ntUsedATL').value;
        
        // Use of turn plates Section
        let conditionOfTurnPlates = document.getElementById('data_launch_qc_checkers_for_cars_conditionOfTurnPlates').value;
        let ntCanUseTurnPlates = document.getElementById('data_launch_qc_checkers_for_cars_ntCanUseTurnPlates').value;
        let turnPlatesUsedForLockCheck = document.getElementById('data_launch_qc_checkers_for_cars_turnPlatesUsedForLockCheck').value;
        
        // Brake Performance Test Section
        let frontAxleBrakePerformance = document.getElementById('data_launch_qc_checkers_for_cars_frontAxleBrakePerformance').value;
        let rearAxleBrakePerformance = document.getElementById('data_launch_qc_checkers_for_cars_rearAxleBrakePerformance').value;
        let emergencyBrakePerformance = document.getElementById('data_launch_qc_checkers_for_cars_emergencyBrakePerformance').value;
        let brakeBindReleaseCheck = document.getElementById('data_launch_qc_checkers_for_cars_brakeBindReleaseCheck').value;
        let brakeJudderAssessed = document.getElementById('data_launch_qc_checkers_for_cars_brakeJudderAssessed').value;
        let notes = document.getElementById('data_launch_qc_checkers_for_cars_notes').value;
        let tqiChecked = document.getElementById('data_launch_qc_checkers_for_cars_tqiChecked').value;
        let confirmedByTester = document.getElementById('data_launch_qc_checkers_for_cars_confirmedByTester').value;
        

        // Creating the object to send to the server
        let qcCheckerData = {
            garage_id: this.id,
            tester_name: testerName,
            tester_id: testerID,
            vehicle_reg: vehicleReg,
            date_of_qc: dateOfQC,
            qc_carried_out_by: qcCarriedOutBy,
            consultant: consultant,
            vehicle_class: vehicleClass,
            all_required_doors_open: doorsOpen,
            bonnet_opens_as_required: bonnetOpens,
            boot_opens_as_required: bootOpens,
            fuel_cap_opens: fuelCapOpens,
            chassis_number_taken: chassisNumberTaken,
            condition_of_registration_plate: conditionOfRegistrationPlate,
            vehicle_safe_for_test: vehicleSafeForTest,
            presented_vehicle_correctly_registered: vehicleCorrectlyRegistered,
            // brake_pedal_servo_operation_checked: brakePedalServoOperation,
            passenger_door_opens: passengerDoorOpens,
            all_passenger_seats_checked: allPassengerSeatsChecked,
            all_mandatory_mirrors_checked: allMandatoryMirrorsChecked,
            handbrake_operation_checked: handbrakeOperationChecked,
            steering_uj_checked: steeringUJChecked,
            steering_free_play_checked: steeringFreePlayChecked,
            steering_anti_theft_lock_checked: steeringAntiTheftLockChecked,
            audible_warning_checked: audibleWarningChecked,
            all_washers_wipers_checked: washersWipersChecked,
            seatbelts_checked: seatbeltsChecked,
            vehicle_correctly_entered_emission_machine: vehicleCorrectlyEnteredEmissionMachine,
            correct_emission_standards_applied: correctEmissionStandardsApplied,
            nt_select_correct_emission_limits: ntSelectCorrectEmissionLimits,
            oil_level_checked: oilLevelChecked,
            nt_correctly_uses_beam_setter: ntCorrectlyUsesBeamSetter,
            headlamp_aim_checked: headlampAimChecked,
            headlamp_units_secure: headlampUnitsSecure,
            rear_light_units_secure: rearLightUnitsSecure,
            lights_interfere_with_another: lightsInterfereWithAnother,
            nt_uses_methodical_process: ntUsesMethodicalProcess,
            steering_security_checked: steeringSecurityChecked,
            battery_secure: batterySecure,
            brake_system_inspected_under_pressure: brakeSystemInspectedUnderPressure,
            all_fluid_levels_inspected: allFluidLevelsInspected,
            fuel_system_inspected: fuelSystemInspected,
            general_condition_inspected: generalConditionInspected,
            steering_inspected_using_equipment: steeringInspectedUsingEquipment,
            brake_system_inspected: brakeSystemInspected,
            exhaust_checked: exhaustChecked,
            driveshaft_inspected: driveshaftInspected,
            fuel_system_inspected_while_running: fuelSystemInspectedWhileRunning,
            suspension_components_inspected: suspensionComponentsInspected,
            underside_inspected_for_corrosion: undersideInspectedForCorrosion,
            vehicle_raised_correctly: vehicleRaisedCorrectly,
            tyres_inspected: tyresInspected,
            suspension_components_checked: suspensionComponentsChecked,
            brake_hoses_inspected: brakeHosesInspected,
            all_gaiters_inspected: allGaitersInspected,
            wheel_security_assessed: wheelSecurityAssessed,
            brake_components_assessed: brakeComponentsAssessed,
            nt_used_atl: ntUsedATL,
            condition_of_turn_plates: conditionOfTurnPlates,
            nt_can_use_turn_plates: ntCanUseTurnPlates,
            turn_plates_used_for_lock_check: turnPlatesUsedForLockCheck,
            front_axle_brake_performance: frontAxleBrakePerformance,
            rear_axle_brake_performance: rearAxleBrakePerformance,
            emergency_brake_performance: emergencyBrakePerformance,
            brake_bind_release_check: brakeBindReleaseCheck,
            brake_judder_assessed: brakeJudderAssessed,
            notes: notes,
            tqi_checked: tqiChecked,
            confirmed_by_tester: confirmedByTester,
        };

        if (qcCheckerRecordId === "") {
            // Sending the data to the server
                this.secureAction('create', 'data_launch_qc_checkers_for_car', null, qcCheckerData).then(res => {
                    // // console.log('data_launch_qc_checkers_for_car res', res);
                    this.injectDataIntoQcCheckersSubgrid()
                }, err => { 
                    console.error(err); 
            });
        }
        else {
                let recordId = parseInt(qcCheckerRecordId)
                qcCheckerData.id = recordId
                this.secureAction('update', 'data_launch_qc_checkers_for_car', recordId,  qcCheckerData).then(res => {
                    // // console.log('data_launch_qc_checkers_for_car res', res);
                    for (let i = 0; i < this.qcCheckerData.length; i++) {
                        if (this.qcCheckerData[i].id=== parseInt(qcCheckerRecordId)) {
                            this.qcCheckerData[i] = res
                        }        
                    }
                    this.injectDataIntoQcCheckersSubgrid()
                }, err => { 
                    console.error(err); 
            });
        }
    }





    /// QC CHECKERS FOR BIKE MODAL SUBGRID
    //// SHOW NEW MODAL FOR BLANK RECORD
    showQcCheckersForBikeModal() {
        document.getElementById('qcCheckerForBikeModal').style.display = 'block';
        
        // Reset fields
        let html = '<option value="notSelected">Please select a Tester</option>"'
        // // console.log('this.garageTesterData', this.garageTestersData)
        this.garageTestersData.forEach(tester => {
            html += `<option data-tester-id="${tester.user_id}" value="${tester.name}">${tester.name}</option>`
        })
        document.getElementById('testerName').innerHTML = html;
        document.getElementById('testerID').value = '';
        document.getElementById('vehicleReg_qcBikes').value = '';
        document.getElementById('dateOfQC_bikes').value = '';
        document.getElementById('qcCarriedOutBy').value = '';
        document.getElementById('vehicleClass').value = '';
        document.getElementById('nameQCChecker').value = '';
        
        // Pre checks SECTION
        document.getElementById('overallConditionOfVehicle').checked = true;
        document.getElementById('doesFuelCapOpen').checked = true;
        document.getElementById('chassisNumberTaken').checked = true;
        document.getElementById('registrationNumberTaken').checked = true;
        document.getElementById('vehicleCorrectlyRegistered').checked = true;

        // Sat on vehicle SECTION
        document.getElementById('handlebarsChecked').checked = true;
        document.getElementById('brakeLeversPedalsChecked').checked = true;
        document.getElementById('brake_pedal_servo_operation_checked').checked = true;
        document.getElementById('acceleratorChecked').checked = true;
        document.getElementById('clutchLeverChecked').checked = true;
        document.getElementById('steeringHeadBearingsChecked').checked = true;
        document.getElementById('hornOperationChecked').checked = true;
        document.getElementById('frontSuspensionBounceChecked').checked = true;
        document.getElementById('rearSuspensionBounceChecked').checked = true;

        // Front of vehicle SECTION
        document.getElementById('frontPositionLampsCondition').checked = true;
        document.getElementById('lampHousingUnitsCondition').checked = true;
        document.getElementById('frontDirectionLampsCondition').checked = true;
        document.getElementById('frontSuspensionComponentsCondition').checked = true;
        document.getElementById('brakeMasterCylinderCondition').checked = true;
        document.getElementById('fairingsBodyPanelsCondition').checked = true;

        // Front of vehicle raised SECTION
        document.getElementById('steeringCondition').checked = true;
        document.getElementById('suspensionComponentsCondition').checked = true;
        document.getElementById('wheelsCondition').checked = true;
        document.getElementById('wheelBearingCondition').checked = true;
        document.getElementById('frontTyreCondition').checked = true;
        document.getElementById('frontBrakeCondition').checked = true;

        // Offside of vehicle SECTION
        document.getElementById('frameCondition').checked = true;
        document.getElementById('seatingCondition').checked = true;
        document.getElementById('footRestCondition').checked = true;
        document.getElementById('rearSuspensionComponentsConditionOffside').checked = true;
        document.getElementById('finalDriveComponentsCondition').checked = true;
        document.getElementById('exhaustSystemCondition').checked = true;
        document.getElementById('fuelSystemCondition').checked = true;
        document.getElementById('rearTyreConditionOffside').checked = true;
        document.getElementById('rearBrakeCondition').checked = true;

        // Rear of vehicle SECTION
        document.getElementById('rearLightsCondition').checked = true;
        document.getElementById('stopLampsCondition').checked = true;
        document.getElementById('rearDirectionLampsCondition').checked = true;
        document.getElementById('rearReflectorCondition').checked = true;
        document.getElementById('registrationPlateLampsCondition').checked = true;
        document.getElementById('wheelAlignmentChecked').checked = true;

        // Nearside of vehicle SECTION
        document.getElementById('nearsideFrameCondition').checked = true;
        document.getElementById('nearsideSeatingCondition').checked = true;
        document.getElementById('nearsideFootRestCondition').checked = true;
        document.getElementById('nearsideRearSuspensionComponentsCondition').checked = true;
        document.getElementById('nearsideFinalDriveComponentsCondition').checked = true;
        document.getElementById('nearsideExhaustSystemCondition').checked = true;
        document.getElementById('nearsideFuelSystemCondition').checked = true;
        document.getElementById('nearsideRearTyreCondition').checked = true;
        document.getElementById('nearsideRearBrakeCondition').checked = true;

        // Rear of vehicle raised SECTION
        document.getElementById('rearWheelsCondition').checked = true;
        document.getElementById('rearWheelBearingCondition').checked = true;
        document.getElementById('rearSuspensionComponentsCondition').checked = true;
        document.getElementById('rearTyreCondition').checked = true;

        // Brake performance test SECTION
        document.getElementById('brakePerformanceChecked').checked = true;
        document.getElementById('brakePerformanceResultsRecorded').checked = true;

        // Notes and Confirmation
        document.getElementById('notes').value = '';
        document.getElementById('confirmedByTester').checked = false;

        document.getElementById('qcCheckerForBikeRecordId').value = '';
    }

    /////  QC CHECKERS FOR BIKES
    /////  SHOW MODAL FOR EXISTING RECORDS
    showQcCheckersForBikeDetails(id) {
        document.getElementById('qcCheckerForBikeModal').style.display = 'block';
        let record;
        
        for (let i = 0; i < this.qcCheckersForBikeData.length; i++) {
            if (this.qcCheckersForBikeData[i].id === parseInt(id)) {
                record = this.qcCheckersForBikeData[i];
                break;
            }
        }
        let html = '<option value="notSelected">Please select a Tester</option>"'
        // // console.log('this.garageTesterData', this.garageTestersData)
        this.garageTestersData.forEach(tester => {
            html += `<option data-tester-id="${tester.user_id}" value="${tester.name}">${tester.name}</option>`
        })
        document.getElementById('testerName').innerHTML = html;

        document.getElementById('testerName').value = record.tester_name || '';
        document.getElementById('testerID').value = record.tester_id || '';
        document.getElementById('vehicleReg_qcBikes').value = record.vehicle_reg || '';
        document.getElementById('dateOfQC_bikes').value = record.date_of_qc || '';
        document.getElementById('qcCarriedOutBy').value = record.qc_carried_out_by || '';
        document.getElementById('vehicleClass').value = record.vehicle_class || '';
        document.getElementById('nameQCChecker').value = record.name_qc_checker || '';

        // Pre checks SECTION
        document.getElementById('overallConditionOfVehicle').checked = record.overall_condition_of_vehicle || false;
        document.getElementById('doesFuelCapOpen').checked = record.does_fuel_cap_open || false;
        document.getElementById('chassisNumberTaken').checked = record.chassis_number_taken || false;
        document.getElementById('registrationNumberTaken').checked = record.registration_number_taken || false;
        document.getElementById('vehicleCorrectlyRegistered').checked = record.vehicle_correctly_registered || false;

        // Sat on vehicle SECTION
        document.getElementById('handlebarsChecked').checked = record.handlebars_checked || false;
        document.getElementById('brakeLeversPedalsChecked').checked = record.brake_levers_pedals_checked || false;
        document.getElementById('brake_pedal_servo_operation_checked').checked = record.brake_pedal_servo_operation_checked || false;
        document.getElementById('acceleratorChecked').checked = record.accelerator_checked || false;
        document.getElementById('clutchLeverChecked').checked = record.clutch_lever_checked || false;
        document.getElementById('steeringHeadBearingsChecked').checked = record.steering_head_bearings_checked || false;
        document.getElementById('hornOperationChecked').checked = record.horn_operation_checked || false;
        document.getElementById('frontSuspensionBounceChecked').checked = record.front_suspension_bounce_checked || false;
        document.getElementById('rearSuspensionBounceChecked').checked = record.rear_suspension_bounce_checked || false;

        // Front of vehicle SECTION
        document.getElementById('frontPositionLampsCondition').checked = record.front_position_lamps_condition || false;
        document.getElementById('lampHousingUnitsCondition').checked = record.lamp_housing_units_condition || false;
        document.getElementById('frontDirectionLampsCondition').checked = record.front_direction_lamps_condition || false;
        document.getElementById('frontSuspensionComponentsCondition').checked = record.front_suspension_components_condition || false;
        document.getElementById('brakeMasterCylinderCondition').checked = record.brake_master_cylinder_condition || false;
        document.getElementById('fairingsBodyPanelsCondition').checked = record.fairings_body_panels_condition || false;

        // Front of vehicle raised SECTION
        document.getElementById('steeringCondition').checked = record.steering_condition || false;
        document.getElementById('suspensionComponentsCondition').checked = record.suspension_components_condition || false;
        document.getElementById('wheelsCondition').checked = record.wheels_condition || false;
        document.getElementById('wheelBearingCondition').checked = record.wheel_bearing_condition || false;
        document.getElementById('frontTyreCondition').checked = record.front_tyre_condition || false;
        document.getElementById('frontBrakeCondition').checked = record.front_brake_condition || false;

        // Offside of vehicle SECTION
        document.getElementById('frameCondition').checked = record.frame_condition || false;
        document.getElementById('seatingCondition').checked = record.seating_condition || false;
        document.getElementById('footRestCondition').checked = record.foot_rest_condition || false;
        document.getElementById('rearSuspensionComponentsConditionOffside').checked = record.rear_suspension_components_condition_offside || false;
        document.getElementById('finalDriveComponentsCondition').checked = record.final_drive_components_condition || false;
        document.getElementById('exhaustSystemCondition').checked = record.exhaust_system_condition || false;
        document.getElementById('fuelSystemCondition').checked = record.fuel_system_condition || false;
        document.getElementById('rearTyreConditionOffside').checked = record.rear_tyre_condition_offside || false;
        document.getElementById('rearBrakeCondition').checked = record.rear_brake_condition || false;

        // Rear of vehicle SECTION
        document.getElementById('rearLightsCondition').checked = record.rear_lights_condition || false;
        document.getElementById('stopLampsCondition').checked = record.stop_lamps_condition || false;
        document.getElementById('rearDirectionLampsCondition').checked = record.rear_direction_lamps_condition || false;
        document.getElementById('rearReflectorCondition').checked = record.rear_reflector_condition || false;
        document.getElementById('registrationPlateLampsCondition').checked = record.registration_plate_lamps_condition || false;
        document.getElementById('wheelAlignmentChecked').checked = record.wheel_alignment_checked || false;

        // Nearside of vehicle SECTION
        document.getElementById('nearsideFrameCondition').checked = record.nearside_frame_condition || false;
        document.getElementById('nearsideSeatingCondition').checked = record.nearside_seating_condition || false;
        document.getElementById('nearsideFootRestCondition').checked = record.nearside_foot_rest_condition || false;
        document.getElementById('nearsideRearSuspensionComponentsCondition').checked = record.nearside_rear_suspension_components_condition || false;
        document.getElementById('nearsideFinalDriveComponentsCondition').checked = record.nearside_final_drive_components_condition || false;
        document.getElementById('nearsideExhaustSystemCondition').checked = record.nearside_exhaust_system_condition || false;
        document.getElementById('nearsideFuelSystemCondition').checked = record.nearside_fuel_system_condition || false;
        document.getElementById('nearsideRearTyreCondition').checked = record.nearside_rear_tyre_condition || false;
        document.getElementById('nearsideRearBrakeCondition').checked = record.nearside_rear_brake_condition || false;

        // Rear of vehicle raised SECTION
        document.getElementById('rearWheelsCondition').checked = record.rear_wheels_condition || false;
        document.getElementById('rearWheelBearingCondition').checked = record.rear_wheel_bearing_condition || false;
        document.getElementById('rearSuspensionComponentsCondition').checked = record.rear_suspension_components_condition || false;
        document.getElementById('rearTyreCondition').checked = record.rear_tyre_condition || false;

        // Brake performance test SECTION
        document.getElementById('brakePerformanceChecked').checked = record.brake_performance_checked || false;
        document.getElementById('brakePerformanceResultsRecorded').checked = record.brake_performance_results_recorded || false;

        // Notes and Confirmation
        document.getElementById('notes').value = record.notes || '';
        document.getElementById('confirmedByTester').checked = record.confirmed_by_tester || false;

        document.getElementById('qcCheckerForBikeRecordId').value = record.id || '';
    }

    /// QC CHECKERS FOR BIKES
    //// SAVE NEW OR EXISTING RECORD TO QC CHECKERS FOR BIKES
    saveNewQcCheckersForBikeRecord() {
        // Gathering data from the modal form
        const testerName = document.getElementById('testerName').value;
        const testerID = document.getElementById('testerID').value;
        const vehicleReg = document.getElementById('vehicleReg_qcBikes').value;
        const dateOfQC = document.getElementById('dateOfQC_bikes').value;
        const qcCarriedOutBy = document.getElementById('qcCarriedOutBy').value;
        const vehicleClass = document.getElementById('vehicleClass').value;
        const nameQCChecker = document.getElementById('nameQCChecker').value;
        const qcCheckerForBikeRecordId = document.getElementById('qcCheckerForBikeRecordId').value;

        // Pre checks SECTION
        const overallConditionOfVehicle = document.getElementById('overallConditionOfVehicle').checked;
        const doesFuelCapOpen = document.getElementById('doesFuelCapOpen').checked;
        const chassisNumberTaken = document.getElementById('chassisNumberTaken').checked;
        const registrationNumberTaken = document.getElementById('registrationNumberTaken').checked;
        const vehicleCorrectlyRegistered = document.getElementById('vehicleCorrectlyRegistered').checked;

        // Sat on vehicle SECTION
        const handlebarsChecked = document.getElementById('handlebarsChecked').checked;
        const brakeLeversPedalsChecked = document.getElementById('brakeLeversPedalsChecked').checked;
        const brakePedalServoOperationChecked = document.getElementById('brake_pedal_servo_operation_checked').checked;        
        const acceleratorChecked = document.getElementById('acceleratorChecked').checked;
        const clutchLeverChecked = document.getElementById('clutchLeverChecked').checked;
        const steeringHeadBearingsChecked = document.getElementById('steeringHeadBearingsChecked').checked;
        const hornOperationChecked = document.getElementById('hornOperationChecked').checked;
        const frontSuspensionBounceChecked = document.getElementById('frontSuspensionBounceChecked').checked;
        const rearSuspensionBounceChecked = document.getElementById('rearSuspensionBounceChecked').checked;

        // Front of vehicle SECTION
        const frontPositionLampsCondition = document.getElementById('frontPositionLampsCondition').checked;
        const lampHousingUnitsCondition = document.getElementById('lampHousingUnitsCondition').checked;
        const frontDirectionLampsCondition = document.getElementById('frontDirectionLampsCondition').checked;
        const frontSuspensionComponentsCondition = document.getElementById('frontSuspensionComponentsCondition').checked;
        const brakeMasterCylinderCondition = document.getElementById('brakeMasterCylinderCondition').checked;
        const fairingsBodyPanelsCondition = document.getElementById('fairingsBodyPanelsCondition').checked;

        // Front of vehicle raised SECTION
        const steeringCondition = document.getElementById('steeringCondition').checked;
        const suspensionComponentsCondition = document.getElementById('suspensionComponentsCondition').checked;
        const wheelsCondition = document.getElementById('wheelsCondition').checked;
        const wheelBearingCondition = document.getElementById('wheelBearingCondition').checked;
        const frontTyreCondition = document.getElementById('frontTyreCondition').checked;
        const frontBrakeCondition = document.getElementById('frontBrakeCondition').checked;

        // Offside of vehicle SECTION
        const frameCondition = document.getElementById('frameCondition').checked;
        const seatingCondition = document.getElementById('seatingCondition').checked;
        const footRestCondition = document.getElementById('footRestCondition').checked;
        const rearSuspensionComponentsConditionOffside = document.getElementById('rearSuspensionComponentsConditionOffside').checked;
        const finalDriveComponentsCondition = document.getElementById('finalDriveComponentsCondition').checked;
        const exhaustSystemCondition = document.getElementById('exhaustSystemCondition').checked;
        const fuelSystemCondition = document.getElementById('fuelSystemCondition').checked;
        const rearTyreConditionOffside = document.getElementById('rearTyreConditionOffside').checked;
        const rearBrakeCondition = document.getElementById('rearBrakeCondition').checked;

        // Rear of vehicle SECTION
        const rearLightsCondition = document.getElementById('rearLightsCondition').checked;
        const stopLampsCondition = document.getElementById('stopLampsCondition').checked;
        const rearDirectionLampsCondition = document.getElementById('rearDirectionLampsCondition').checked;
        const rearReflectorCondition = document.getElementById('rearReflectorCondition').checked;
        const registrationPlateLampsCondition = document.getElementById('registrationPlateLampsCondition').checked;
        const wheelAlignmentChecked = document.getElementById('wheelAlignmentChecked').checked;

        // Nearside of vehicle SECTION
        const nearsideFrameCondition = document.getElementById('nearsideFrameCondition').checked;
        const nearsideSeatingCondition = document.getElementById('nearsideSeatingCondition').checked;
        const nearsideFootRestCondition = document.getElementById('nearsideFootRestCondition').checked;
        const nearsideRearSuspensionComponentsCondition = document.getElementById('nearsideRearSuspensionComponentsCondition').checked;
        const nearsideFinalDriveComponentsCondition = document.getElementById('nearsideFinalDriveComponentsCondition').checked;
        const nearsideExhaustSystemCondition = document.getElementById('nearsideExhaustSystemCondition').checked;
        const nearsideFuelSystemCondition = document.getElementById('nearsideFuelSystemCondition').checked;
        const nearsideRearTyreCondition = document.getElementById('nearsideRearTyreCondition').checked;
        const nearsideRearBrakeCondition = document.getElementById('nearsideRearBrakeCondition').checked;

        // Rear of vehicle raised SECTION
        const rearWheelsCondition = document.getElementById('rearWheelsCondition').checked;
        const rearWheelBearingCondition = document.getElementById('rearWheelBearingCondition').checked;
        const rearSuspensionComponentsCondition = document.getElementById('rearSuspensionComponentsCondition').checked;
        const rearTyreCondition = document.getElementById('rearTyreCondition').checked;

        // Brake performance test SECTION
        const brakePerformanceChecked = document.getElementById('brakePerformanceChecked').checked;
        const brakePerformanceResultsRecorded = document.getElementById('brakePerformanceResultsRecorded').checked;

        // Notes and Confirmation
        const notes = document.getElementById('notes').value;
        const confirmedByTester = document.getElementById('confirmedByTester').checked;

        // Creating the object to send to the server
        const qcCheckersForBikeData = {
            tester_name: testerName,
            tester_id: testerID,
            garage_id: this.id,
            vehicle_reg: vehicleReg,
            date_of_qc: dateOfQC,
            qc_carried_out_by: qcCarriedOutBy,
            vehicle_class: vehicleClass,
            name_qc_checker: nameQCChecker,

            // Pre checks SECTION
            overall_condition_of_vehicle: overallConditionOfVehicle,
            does_fuel_cap_open: doesFuelCapOpen,
            chassis_number_taken: chassisNumberTaken,
            registration_number_taken: registrationNumberTaken,
            vehicle_correctly_registered: vehicleCorrectlyRegistered,

            // Sat on vehicle SECTION
            handlebars_checked: handlebarsChecked,
            brake_levers_pedals_checked: brakeLeversPedalsChecked,
            accelerator_checked: acceleratorChecked,
            brake_pedal_servo_operation_checked: brakePedalServoOperationChecked,
            clutch_lever_checked: clutchLeverChecked,
            steering_head_bearings_checked: steeringHeadBearingsChecked,
            horn_operation_checked: hornOperationChecked,
            front_suspension_bounce_checked: frontSuspensionBounceChecked,
            rear_suspension_bounce_checked: rearSuspensionBounceChecked,

            // Front of vehicle SECTION
            front_position_lamps_condition: frontPositionLampsCondition,
            lamp_housing_units_condition: lampHousingUnitsCondition,
            front_direction_lamps_condition: frontDirectionLampsCondition,
            front_suspension_components_condition: frontSuspensionComponentsCondition,
            brake_master_cylinder_condition: brakeMasterCylinderCondition,
            fairings_body_panels_condition: fairingsBodyPanelsCondition,

            // Front of vehicle raised SECTION
            steering_condition: steeringCondition,
            suspension_components_condition: suspensionComponentsCondition,
            wheels_condition: wheelsCondition,
            wheel_bearing_condition: wheelBearingCondition,
            front_tyre_condition: frontTyreCondition,
            front_brake_condition: frontBrakeCondition,

            // Offside of vehicle SECTION
            frame_condition: frameCondition,
            seating_condition: seatingCondition,
            foot_rest_condition: footRestCondition,
            rear_suspension_components_condition_offside: rearSuspensionComponentsConditionOffside,
            final_drive_components_condition: finalDriveComponentsCondition,
            exhaust_system_condition: exhaustSystemCondition,
            fuel_system_condition: fuelSystemCondition,
            rear_tyre_condition_offside: rearTyreConditionOffside,
            rear_brake_condition: rearBrakeCondition,

            // Rear of vehicle SECTION
            rear_lights_condition: rearLightsCondition,
            stop_lamps_condition: stopLampsCondition,
            rear_direction_lamps_condition: rearDirectionLampsCondition,
            rear_reflector_condition: rearReflectorCondition,
            registration_plate_lamps_condition: registrationPlateLampsCondition,
            wheel_alignment_checked: wheelAlignmentChecked,

            // Nearside of vehicle SECTION
            nearside_frame_condition: nearsideFrameCondition,
            nearside_seating_condition: nearsideSeatingCondition,
            nearside_foot_rest_condition: nearsideFootRestCondition,
            nearside_rear_suspension_components_condition: nearsideRearSuspensionComponentsCondition,
            nearside_final_drive_components_condition: nearsideFinalDriveComponentsCondition,
            nearside_exhaust_system_condition: nearsideExhaustSystemCondition,
            nearside_fuel_system_condition: nearsideFuelSystemCondition,
            nearside_rear_tyre_condition: nearsideRearTyreCondition,
            nearside_rear_brake_condition: nearsideRearBrakeCondition,

            // Rear of vehicle raised SECTION
            rear_wheels_condition: rearWheelsCondition,
            rear_wheel_bearing_condition: rearWheelBearingCondition,
            rear_suspension_components_condition: rearSuspensionComponentsCondition,
            rear_tyre_condition: rearTyreCondition,

            // Brake performance test SECTION
            brake_performance_checked: brakePerformanceChecked,
            brake_performance_results_recorded: brakePerformanceResultsRecorded,

            // Notes and Confirmation
            notes: notes,
            confirmed_by_tester: confirmedByTester,
        };

        if (qcCheckerForBikeRecordId === "") {
            // Sending the data to the server to create a new record
            this.secureAction('create', 'data_launch_qc_checkers_for_bike', null, qcCheckersForBikeData).then(res => {
                // // console.log('data_launch_qc_checkers_for_bike res', res);
                this.injectDataIntoQcCheckersForBikesSubgrid();
            }, err => { 
                console.error(err); 
            });
        } else {
            // Updating the existing record
            let recordId = parseInt(qcCheckerForBikeRecordId);
            qcCheckersForBikeData.id = recordId;
            this.secureAction('update','data_launch_qc_checkers_for_bike', recordId, qcCheckersForBikeData).then(res => {
                // // console.log('data_launch_qc_checkers_for_bike res', res);
                for (let i = 0; i < this.qcCheckersForBikeData.length; i++) {
                    if (this.qcCheckersForBikeData[i].id === recordId) {
                        this.qcCheckersForBikeData[i] = res;
                    }        
                }
                this.injectDataIntoQcCheckersForBikesSubgrid();
            }, err => { 
                console.error(err); 
            });
        }
    }

////// GARAGE BAY SUBGRID HANDLERS 

 showGarageBayModal() {
    document.getElementById('garageBaysModal').style.display = 'block'

    document.getElementById('data-launch-garage-bay-modal-name-val').value = '';
    document.getElementById('data-launch-garage-bay-modal-mot-bay-val').checked = false;
    document.getElementById('data-launch-garage-bay-modal-mot-bay-select').selectedIndex = 0;
    document.getElementById('garageBaysModalRecordId').value = '';
}

showGarageBayModalDetails(id) {
    document.getElementById('garageBaysModal').style.display = 'block'
    let record;        
    for (let i = 0; i < this.garageBayData.length; i++) {
        if (this.garageBayData[i].id === parseInt(id)) {
            record = this.garageBayData[i];
            break;
        }
    }
    // // console.log('showGarageBookingsDetails', record)
    document.getElementById('data-launch-garage-bay-modal-name-val').value = record.bay_name;
    document.getElementById('data-launch-garage-bay-modal-mot-bay-val').checked = record.mot_bay;
    document.getElementById('data-launch-garage-bay-modal-mot-bay-select').value = record.time_segments;
    document.getElementById('garageBaysModalRecordId').value = record.id;
}

 saveGarageBayRecord() {
     // Gathering data from the modal form
     const bayName = document.getElementById('data-launch-garage-bay-modal-name-val').value;
     const motBay = document.getElementById('data-launch-garage-bay-modal-mot-bay-val').checked;
     const timeSegments = document.getElementById('data-launch-garage-bay-modal-mot-bay-select').value;
     const garageBayRecordID = document.getElementById('garageBaysModalRecordId').value;

     // Creating the object to send to the server
     const garageBayData = {
         garage_id: this.id,
         bay_name: bayName,
         mot_bay: motBay,
         time_segments: timeSegments,
         create_date: new Date()
     };

     if (garageBayRecordID === "") {
         // Sending the data to the server to create a new record
         this.secureAction('create', 'data_launch_bays', null, garageBayData).then(res => {
             this.injectDataIntoBaysSubgrid()
         }, err => { 
             console.error(err); 
         });
     } else {
         // Updating the existing record
         let recordId = parseInt(garageBayRecordID);
         garageBayData.id = recordId;
         this.secureAction('update', 'data_launch_bays', recordId, garageBayData).then(res => {
             for (let i = 0; i < this.garageBayData.length; i++) {
                 if (this.garageBayData[i].id === recordId) {
                     this.garageBayData[i] = res;
                 }        
             }
             this.injectDataIntoBaysSubgrid();
         }, err => { 
             console.error(err); 
         });
     }
    document.getElementById('garageBaysModal').style.display = 'none'
 }









    /// GARAGE BOOKINGS SUBGRID HANDLERS
    /// SHOW NEW MODAL FOR NEW RECORD
    showGarageBookingsModal(time, bay, date) {
        document.getElementById('garageBookingModal').style.display = 'block';
        
        // Resetting fields to default values
        document.getElementById('vehicleReg').value = '';
        document.getElementById('vehicleMake').value = '';
        document.getElementById('vehicleModel').value = '';
        document.getElementById('vehicleBookingVIN').value = '';        
        document.getElementById('title').value = '';
        document.getElementById('customerFirstName').value = '';
        document.getElementById('customerLastName').value = '';
        document.getElementById('customerMobile').value = '';
        document.getElementById('customerEmail').value = '';
        document.getElementById('motDueDate').value = '';
        document.getElementById('bookingDate').value = '';
        document.getElementById('timeStart').value = '';
        document.getElementById('timeEnd').value = '';
        // document.getElementById('vehicleArrived').checked = false;
        document.getElementById('motCompleted').checked = false;
        document.getElementById('garageBookingNotes').value = '';

        document.getElementById('data-launch-garage-booking-made').checked = true;
        document.getElementById('data-launch-garage-vehicle-arrived').checked = false;
        document.getElementById('data-launch-garage-work-in-progress').checked = false;
        document.getElementById('data-launch-garage-work-completed').checked = false;


        let html = '<option value="">Please choose a Bay</option>'
        this.garageBayData.forEach(
            bayRecord => {
                html += `
                    <option value="${bayRecord.id}">${bayRecord.bay_name}</option>
                `
            }
        )
        document.getElementById('garageBookingsBay').innerHTML = html;
        document.getElementById('garageBookingRecordId').value = '';
        if (time && bay && date ){
            document.getElementById('timeStart').value = time;
            let selectedBayValue;
            let timeSegment;
            this.garageBayData.forEach(bayRecord => {
                    if (bayRecord.bay_name === bay) {
                        selectedBayValue = bayRecord.id
                        timeSegment = bayRecord.time_segments
                    }
                }
            )
            document.getElementById("garageBookingsBay").value = selectedBayValue;
            document.getElementById('bookingDate').value = date;
            let endTime = this.addMinutesToTime(time, timeSegment) 
            document.getElementById('timeEnd').value = endTime;
            
            let tabcontent = document.querySelectorAll(`#garageBookingModal .tab-content`);
            let tablinks = document.querySelectorAll(`#garageBookingModal .tab-button`);
            
            // Hide all tab contents
            for (let i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
                if (tabcontent[i].classList.contains('active')) {
                    tabcontent[i].classList.remove('active')
                }
            }
        
            // Remove "active" class from all tab buttons
            for (let i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            
            // Show the current tab and add "active" class to the clicked button
            document.getElementById('garageBookingModal_VehicleDetails_tab').style.display = "block";
            document.getElementById('garageBookingModal_VehicleDetails_tab').classList.add('active')

            document.getElementById('VehicleDetails').style.display = "block";
            document.getElementById('VehicleDetails').classList.add('active')
            
            // let x = Array.from(document.getElementsByClassName('booking-modal-popup-header-tab'))
            // x.forEach(el => {
            //     if (el.classList.contains('active')) {
            //         el.classList.remove('active')
            //     }
            //     if (el.attributes["data-tab-name"].value === 'VehicleDetails') {
            //         el.classList.add('active')
            //     }
            // })
        }
    }
    /// GARAGE BOOKINGS SUBGRID HANDLERS

    //// DUPLICATE BOOKING ( COPY )
    duplicateGarageBooking (id) {
        console.log('id to duplicate is ', id)
        this.selectedDuplicateID = id
        document.getElementById('duplicateBookingModal').classList.add('active')
    }
    //// SHOW MODAL FOR EXISTING RECORD0
    showGarageBookingsDetails(id) {
        document.getElementById('garageBookingModal').style.display = 'block';
        let record;
        
        for (let i = 0; i < this.garageBookingsData.length; i++) {
            if (this.garageBookingsData[i].id === parseInt(id)) {
                record = this.garageBookingsData[i];
                break;
            }
        }

        document.getElementById('vehicleReg').value = record.vehicle_reg || '';
        document.getElementById('vehicleMake').value = record.vehicle_make || '';
        document.getElementById('vehicleModel').value = record.vehicle_model || '';
        document.getElementById('vehicleBookingVIN').value =  record.vehicle_vin || '';   
        document.getElementById('title').value = record.title || '';
        document.getElementById('customerFirstName').value = record.customer_first_name || '';
        document.getElementById('customerLastName').value = record.customer_last_name || '';
        document.getElementById('customerMobile').value = record.customer_mobile || '';
        document.getElementById('customerEmail').value = record.customer_email || '';
        document.getElementById('garageBookingNotes').value = record.notes || '';


        document.getElementById('data-launch-garage-booking-made').checked = record.status_booking_made || false;
        document.getElementById('data-launch-garage-vehicle-arrived').checked = record.status_vehicle_arrived_on_site || false;
        document.getElementById('data-launch-garage-work-in-progress').checked = record.status_work_on_vehicle_in_progress || false;
        document.getElementById('data-launch-garage-work-completed').checked = record.status_work_completed || false;


        if (record.booking_date) {
            let formattedDate = record.booking_date.split('T')[0];
            document.getElementById('bookingDate').value = formattedDate;
        }
        if (record.mot_due_date) {
            if (record.mot_due_date !== "1899-11-30T00:00:00.000Z") {
                let formattedDate = record.mot_due_date.split('T')[0];
                document.getElementById('motDueDate').value = formattedDate || ''
            }          
        }
        document.getElementById('timeStart').value = record.time_start || '';
        document.getElementById('timeEnd').value = record.time_end || '';
        // document.getElementById('vehicleArrived').checked = record.vehicle_arrived || false;
        document.getElementById('motCompleted').checked = record.mot_completed || false;
        document.getElementById('garageBookingRecordId').value = record.id || '';
        let html = '<option value="">Please choose a Bay</option>'
        this.garageBayData.forEach(
            bayRecord => {
                html += `
                    <option value="${bayRecord.id}">${bayRecord.bay_name}</option>
                `
            }
        )
        document.getElementById('garageBookingsBay').innerHTML = html;
        document.getElementById('garageBookingsBay').value = record.bay || '';
    }
    /// GARAGE BOOKINGS SUBGRID HANDLERS
    ///// SAVE NEW OR EXISTING RECORD
    saveNewGarageBookingRecord() {
        // Gathering data from the modal form
        const vehicleReg = document.getElementById('vehicleReg').value;
        const vehicleMake = document.getElementById('vehicleMake').value;
        const vehicleModel = document.getElementById('vehicleModel').value;
        const vehicle_vin = document.getElementById('vehicleBookingVIN').value;
        const title = document.getElementById('title').value;
        const customerFirstName = document.getElementById('customerFirstName').value;
        const customerLastName = document.getElementById('customerLastName').value;
        const customerMobile = document.getElementById('customerMobile').value;
        const customerEmail = document.getElementById('customerEmail').value;
        const motDueDate = document.getElementById('motDueDate').value;
        const bookingDate = document.getElementById('bookingDate').value;
        const timeStart = document.getElementById('timeStart').value;
        const timeEnd = document.getElementById('timeEnd').value;
        // const vehicleArrived = document.getElementById('vehicleArrived').checked;
        const motCompleted = document.getElementById('motCompleted').checked;
        const bay = document.getElementById('garageBookingsBay').value;
        const garageBookingRecordId = document.getElementById('garageBookingRecordId').value;
        const notes = document.getElementById('garageBookingNotes').value;


        const bookingMade = document.getElementById('data-launch-garage-booking-made').checked
        const vehicleArrivedOnSite = document.getElementById('data-launch-garage-vehicle-arrived').checked
        const workOnVehicleInProgress = document.getElementById('data-launch-garage-work-in-progress').checked
        const workCompleted = document.getElementById('data-launch-garage-work-completed').checked

        // Creating the object to send to the server
        const garageBookingData = {
            garage_id: this.id,
            vehicle_reg: vehicleReg,
            vehicle_make: vehicleMake,
            vehicle_model: vehicleModel,
            title: title,
            customer_first_name: customerFirstName,
            customer_last_name: customerLastName,
            customer_mobile: customerMobile,
            customer_email: customerEmail,
            mot_due_date: motDueDate,
            booking_date: bookingDate,
            time_start: timeStart,
            time_end: timeEnd,
            // vehicle_arrived: vehicleArrived,
            mot_completed: motCompleted,
            bay: bay, 
            vehicle_vin: vehicle_vin,
            notes: notes,
            status_booking_made: bookingMade,
            status_vehicle_arrived_on_site: vehicleArrivedOnSite,
            status_work_on_vehicle_in_progress: workOnVehicleInProgress,
            status_work_completed: workCompleted
        };

        if (garageBookingRecordId === "") {
            // Sending the data to the server to create a new record
            this.secureAction('create', 'data_launch_garage_bookings', null, garageBookingData).then(res => {
                this.injectDataIntoGarageBookingsSubgrid();
            }, err => { 
                console.error(err); 
            });
        } else {
            // Updating the existing record
            let recordId = parseInt(garageBookingRecordId);
            garageBookingData.id = recordId;
            this.secureAction('update', 'data_launch_garage_bookings', recordId, garageBookingData).then(res => {
                for (let i = 0; i < this.garageBookingsData.length; i++) {
                    if (this.garageBookingsData[i].id === recordId) {
                        this.garageBookingsData[i] = res;
                    }        
                }
                this.injectDataIntoGarageBookingsSubgrid();
            }, err => { 
                console.error(err); 
            });
        }
    }






    ///// ASSOCIATED GARAGE SUBGRID HANDLERS ///////

    ////////
    openAssociateNewGarageWindow () {
        document.getElementById('associateNewGarageRecordsModal').classList.add('active')
        let html = ``
        this.data.forEach(garageRec => {
            html += `<tr id="rec_${garageRec.id}_row" class='data-launch-associate-garage-modal-popup-select-tr'>
                        <td data-garage-id="${garageRec.id}" data-val="rec_${garageRec.id}" class="data-launch-associate-garage-modal-popup-select-tr">${garageRec.trading_name_garage}</td>
                        <td data-garage-id="${garageRec.id}" data-val="rec_${garageRec.id}" class="data-launch-associate-garage-modal-popup-select-tr">${garageRec.id}</td>
                     </tr>`
        })
        document.getElementById('garageAssociatedGaragesTableBody').innerHTML = html
    }



    /// DEFECT REPORT SUBGRID HANDLERS
    //// SHOW BLANK RECORD
    showDefectReportsModal() {
        document.getElementById('defectReportModal').style.display = 'block';
        
        // Reset fields
        document.getElementById('reference').value = '';
        document.getElementById('reportedDate').value = '';
        document.getElementById('details').value = '';
        document.getElementById('defectDescription').value = '';
        document.getElementById('dvsaNotified').checked = false;
        document.getElementById('repaired').checked = false;
        document.getElementById('repairedDate').value = '';
        document.getElementById('confirmedBy').value = '';
        document.getElementById('defectReportRecordId').value = '';
    }
    /// DEFECT REPORT SUBGRID HANDLERS
    //// SHOW EXISTING RECORD
    showDefectReportsDetails(id) {
        document.getElementById('defectReportModal').style.display = 'block';
        let record;
        
        for (let i = 0; i < this.defectReportData.length; i++) {
            if (this.defectReportData[i].id === parseInt(id)) {
                record = this.defectReportData[i];
                break;
            }
        }
        if (record.reported_date) {
            let formattedDate = record.reported_date.split('T')[0];
            document.getElementById('reportedDate').value = formattedDate;
        }
        else {
            document.getElementById('reportedDate').value = '';
        }
        if (record.repaired_date) {
            let formattedDate = record.repaired_date.split('T')[0];
            document.getElementById('repairedDate').value = formattedDate || '';
        }
        else {
            document.getElementById('repairedDate').value = '';
        }
        document.getElementById('reference').value = record.reference || '';
        document.getElementById('details').value = record.details || '';
        document.getElementById('defectDescription').value = record.defect_description || '';
        document.getElementById('dvsaNotified').checked = record.dvsa_notified || false;
        document.getElementById('repaired').checked = record.repaired || false;
        document.getElementById('confirmedBy').value = record.confirmed_by || '';
        document.getElementById('defectReportRecordId').value = record.id || '';
    }
    /// DEFECT REPORT SUBGRID HANDLERS
    //// SAVE NEW OR EXISTING RECORD
    saveNewDefectReportsRecord() {
        // Gathering data from the modal form
        const reference = document.getElementById('reference').value;
        const reportedDate = document.getElementById('reportedDate').value;
        const details = document.getElementById('details').value;
        const defectDescription = document.getElementById('defectDescription').value;
        const dvsaNotified = document.getElementById('dvsaNotified').checked;
        const repaired = document.getElementById('repaired').checked;
        const repairedDate = document.getElementById('repairedDate').value;
        const confirmedBy = document.getElementById('confirmedBy').value;
        const defectReportRecordId = document.getElementById('defectReportRecordId').value;

        // Creating the object to send to the server
        const defectReportData = {
            reference: reference,
            garage_id: this.id,
            reported_date: reportedDate,
            details: details,
            defect_description: defectDescription,
            dvsa_notified: dvsaNotified,
            repaired: repaired,
            repaired_date: repairedDate,
            confirmed_by: confirmedBy,
        };

        if (defectReportRecordId === "") {
            // Sending the data to the server to create a new record
            this.secureAction('create', 'data_launch_defect_reports', null, defectReportData).then(res => {
                this.injectDataIntoDefectReportsSubgrid();
            }, err => { 
                console.error(err); 
            });
        } else {
            // Updating the existing record
            let recordId = parseInt(defectReportRecordId);
            defectReportData.id = recordId;
            this.secureAction('update','data_launch_defect_reports', recordId, defectReportData).then(res => {
                for (let i = 0; i < this.defectReportData.length; i++) {
                    if (this.defectReportData[i].id === recordId) {
                        this.defectReportData[i] = res;
                    }        
                }
                this.injectDataIntoDefectReportsSubgrid();
            }, err => { 
                console.error(err); 
            });
        }
    }




/// MOT BAY CLEANING LOG CLASSES 
///// MOT BAY CLEANING LOG SHOW BLANK RECORD
    showMotBayCleaningLogModal() {
        document.getElementById('motBayCleaningLogModal').style.display = 'block';  
    
        document.getElementById('date').value = '';
        document.getElementById('signed').value = '';
        document.getElementById('description').value = '';
        document.getElementById('motBayCleaningLogRecordId').value = '';
    }
    /// MOT BAY CLEANING LOG CLASSES 
///// MOT BAY CLEANING LOG SHOW EXISTING RECORD

    showMotBayCleaningLogDetails(id) {
        document.getElementById('motBayCleaningLogModal').style.display = 'block';
        let record;
        
        for (let i = 0; i < this.motBayCleaningLogData.length; i++) {
            if (this.motBayCleaningLogData[i].id === parseInt(id)) {
                record = this.motBayCleaningLogData[i];
                break;
            }
        }
        if (record.date) {
            let formattedDate = record.date.split('T')[0];
            document.getElementById('date').value = formattedDate;
        }
        else {
            document.getElementById('date').value = '';
        }
        document.getElementById('signed').value = record.signed || '';
        document.getElementById('description').value = record.description || '';
        document.getElementById('motBayCleaningLogRecordId').value = record.id || '';
    }

/// MOT BAY CLEANING LOG CLASSES 
///// MOT BAY CLEANING LOG SAVE NEW / EXISTING RECORD

    saveNewMotBayCleaningLogRecord() {
        // Gathering data from the modal form
        const date = document.getElementById('date').value;
        const signed = document.getElementById('signed').value;
        const description = document.getElementById('description').value;
        const motBayCleaningLogRecordId = document.getElementById('motBayCleaningLogRecordId').value;

        // Creating the object to send to the server
        const motBayCleaningLogData = {
            garage_id: this.id,
            date: date,
            signed: signed,
            description: description,
        };

        if (motBayCleaningLogRecordId === "") {
            // Sending the data to the server to create a new record
            this.secureAction('create', 'data_launch_mot_bay_cleaning_log', null, motBayCleaningLogData).then(res => {
                // // console.log('data_launch_mot_bay_cleaning_log res', res);
                this.injectDataIntoMotBayCleaningLogSubgrid();
            }, err => { 
                console.error(err); 
            });
        } else {
            // Updating the existing record
            let recordId = parseInt(motBayCleaningLogRecordId);
            motBayCleaningLogData.id = recordId;
            this.secureAction('update','data_launch_mot_bay_cleaning_log', recordId, motBayCleaningLogData).then(res => {
                // // console.log('data_launch_mot_bay_cleaning_log res', res);
                for (let i = 0; i < this.motBayCleaningLogData.length; i++) {
                    if (this.motBayCleaningLogData[i].id === recordId) {
                        this.motBayCleaningLogData[i] = res;
                    }        
                }
                this.injectDataIntoMotBayCleaningLogSubgrid();
            }, err => { 
                console.error(err); 
            });
        }
    }






/// GARAGE USERS CLASSES 
///// GARAGE USERS SHOW BLANK RECORD
showGarageUsersModal() {
    document.getElementById('garageUserModal').style.display = 'block';  
    document.getElementById('sendLoginDetailsToEmail').style.display = 'none';    
   
    document.getElementById('garage_user_modal_RecordID').value = '';
    document.getElementById('garage_user_modal_email').value = '';
    document.getElementById('garage_user_modal_first_name').value = '';
    document.getElementById('garage_user_modal_last_name').value = '';
    document.getElementById('garage_user_modal_create_date').style.display = 'none'
    document.getElementById('garage_user_modal_create_date_label').style.display = 'none'

    document.getElementById('garage_user_modal_garage_details_tab_read').checked = false
    document.getElementById('garage_user_modal_garage_details_tab_update').checked = false
    document.getElementById('garage_user_modal_garage_details_tab_delete').checked = false

    document.getElementById('garage_user_modal_testers_tab_create').checked = false
    document.getElementById('garage_user_modal_testers_tab_read').checked = false
    document.getElementById('garage_user_modal_testers_tab_update').checked = false
    document.getElementById('garage_user_modal_testers_tab_delete').checked = false

    document.getElementById('garage_user_modal_garage_users_tab_create').checked = false;
    document.getElementById('garage_user_modal_garage_users_tab_read').checked = false;
    document.getElementById('garage_user_modal_garage_users_tab_update').checked = false
    document.getElementById('garage_user_modal_garage_users_tab_delete').checked = false

    document.getElementById('garage_user_modal_mot_equipment_tab_create').checked = false
    document.getElementById('garage_user_modal_mot_equipment_tab_read').checked = false
    document.getElementById('garage_user_modal_mot_equipment_tab_update').checked = false
    document.getElementById('garage_user_modal_mot_equipment_tab_delete').checked = false

    document.getElementById('garage_user_modal_calibrations_tab_create').checked = false
    document.getElementById('garage_user_modal_calibrations_tab_read').checked = false
    document.getElementById('garage_user_modal_calibrations_tab_update').checked = false
    document.getElementById('garage_user_modal_calibrations_tab_delete').checked = false
    
    document.getElementById('garage_user_modal_reconciliations_tab_create').checked = false
    document.getElementById('garage_user_modal_reconciliations_tab_read').checked = false
    document.getElementById('garage_user_modal_reconciliations_tab_update').checked = false
    document.getElementById('garage_user_modal_reconciliations_tab_delete').checked = false

    document.getElementById('garage_user_modal_mot_site_audits_tab_create').checked = false
    document.getElementById('garage_user_modal_mot_site_audits_tab_read').checked = false
    document.getElementById('garage_user_modal_mot_site_audits_tab_update').checked = false
    document.getElementById('garage_user_modal_mot_site_audits_tab_delete').checked = false

           
    document.getElementById('garage_user_modal_qc_checkers_tab_create').checked = false
    document.getElementById('garage_user_modal_qc_checkers_tab_read').checked = false
    document.getElementById('garage_user_modal_qc_checkers_tab_update').checked = false
    document.getElementById('garage_user_modal_qc_checkers_tab_delete').checked = false


    document.getElementById('garage_user_modal_bookings_tab_create').checked = false
    document.getElementById('garage_user_modal_bookings_tab_read').checked = false
    document.getElementById('garage_user_modal_bookings_tab_update').checked = false
    document.getElementById('garage_user_modal_bookings_tab_delete').checked = false


    document.getElementById('garage_user_modal_defect_reports_tab_create').checked = false
    document.getElementById('garage_user_modal_defect_reports_tab_read').checked = false
    document.getElementById('garage_user_modal_defect_reports_tab_update').checked = false
    document.getElementById('garage_user_modal_defect_reports_tab_delete').checked = false
    
    document.getElementById('garage_user_modal_mot_bay_cleaning_log_tab_create').checked = false
    document.getElementById('garage_user_modal_mot_bay_cleaning_log_tab_read').checked = false
    document.getElementById('garage_user_modal_mot_bay_cleaning_log_tab_update').checked = false
    document.getElementById('garage_user_modal_mot_bay_cleaning_log_tab_delete').checked = false
    
       
    document.getElementById('garage_user_modal_qc_checkers_for_bikes_tab_create').checked = false
    document.getElementById('garage_user_modal_qc_checkers_for_bikes_tab_read').checked = false
    document.getElementById('garage_user_modal_qc_checkers_for_bikes_tab_update').checked = false
    document.getElementById('garage_user_modal_qc_checkers_for_bikes_tab_delete').checked = false

    document.getElementById('garage_user_modal_garage_reminders_tab_delete').checked = false
    
}
/// GARAGE USERS 
///// GARAGE USERS  SHOW EXISTING RECORD

showGarageUsersDetails(id) {
    document.getElementById('garageUserModal').style.display = 'block';
    document.getElementById('garage_user_modal_create_date').style.display = 'block'
    document.getElementById('sendLoginDetailsToEmail').style.display = 'block';  
    let record;
    
    for (let i = 0; i < this.garageUsersData.length; i++) {
        if (this.garageUsersData[i].id === parseInt(id)) {
            record = this.garageUsersData[i];
            break;
        }
    }
    if (record.create_date) {
        let formattedDate = record.create_date.split('T')[0];
        document.getElementById('garage_user_modal_create_date').value = formattedDate;
    }
    else {
        document.getElementById('garage_user_modal_create_date').value = '';
    }
    document.getElementById('garage_user_modal_email').value = record.username || '';
    document.getElementById('garage_user_modal_first_name').value = record.first_name || '';
    document.getElementById('garage_user_modal_last_name').value = record.last_name || '';
    document.getElementById('garage_user_modal_RecordID').value = record.id || '';

    document.getElementById('garage_user_modal_garage_details_tab_read').checked = (record.garage_details_read === 1 ? true: false) || false;
    document.getElementById('garage_user_modal_garage_details_tab_update').checked = (record.garage_details_update === 1 ? true: false) || false;
    document.getElementById('garage_user_modal_garage_details_tab_delete').checked = (record.garage_details_delete === 1 ? true: false) || false;

    document.getElementById('garage_user_modal_qc_checkers_tab_create').checked = (record.qc_checkers_create === 1 ? true: false) || false;
    document.getElementById('garage_user_modal_qc_checkers_tab_read').checked = (record.qc_checkers_read === 1 ? true: false) || false;
    document.getElementById('garage_user_modal_qc_checkers_tab_update').checked = (record.qc_checkers_update === 1 ? true: false )  || false;
    document.getElementById('garage_user_modal_qc_checkers_tab_delete').checked = (record.qc_checkers_delete === 1 ? true: false ) || false;

    document.getElementById('garage_user_modal_garage_users_tab_create').checked = (record.garage_users_create === 1 ? true: false) || false;
    document.getElementById('garage_user_modal_garage_users_tab_read').checked = (record.garage_users_read === 1 ? true: false) || false;
    document.getElementById('garage_user_modal_garage_users_tab_update').checked = (record.garage_users_update === 1 ? true: false )  || false;
    document.getElementById('garage_user_modal_garage_users_tab_delete').checked = (record.garage_users_delete === 1 ? true: false ) || false;

    document.getElementById('garage_user_modal_bookings_tab_create').checked = (record.bookings_create === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_bookings_tab_read').checked = (record.bookings_read === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_bookings_tab_update').checked = (record.bookings_update === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_bookings_tab_delete').checked = (record.bookings_delete === 1 ? true: false ) || false;


    document.getElementById('garage_user_modal_testers_tab_create').checked = (record.testers_create === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_testers_tab_read').checked = (record.testers_read === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_testers_tab_update').checked = (record.testers_update === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_testers_tab_delete').checked = (record.testers_delete === 1 ? true: false ) || false;


    document.getElementById('garage_user_modal_mot_equipment_tab_create').checked = (record.mot_equipment_create === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_mot_equipment_tab_read').checked = (record.mot_equipment_read === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_mot_equipment_tab_update').checked = (record.mot_equipment_update === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_mot_equipment_tab_delete').checked = (record.mot_equipment_delete === 1 ? true: false ) || false;


    document.getElementById('garage_user_modal_calibrations_tab_create').checked = (record.mot_calibrations_create === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_calibrations_tab_read').checked = (record.mot_calibrations_read === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_calibrations_tab_update').checked = (record.mot_calibrations_update === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_calibrations_tab_delete').checked = (record.mot_calibrations_delete === 1 ? true: false ) || false;

    document.getElementById('garage_user_modal_reconciliations_tab_create').checked = (record.mot_reconciliations_create === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_reconciliations_tab_read').checked = (record.mot_reconciliations_read === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_reconciliations_tab_update').checked = (record.mot_reconciliations_update === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_reconciliations_tab_delete').checked = (record.mot_reconciliations_delete === 1 ? true: false ) || false;

    document.getElementById('garage_user_modal_mot_site_audits_tab_create').checked = (record.mot_site_audits_create === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_mot_site_audits_tab_read').checked = (record.mot_site_audits_read === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_mot_site_audits_tab_update').checked = (record.mot_site_audits_update === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_mot_site_audits_tab_delete').checked = (record.mot_site_audits_delete === 1 ? true: false ) || false;

    document.getElementById('garage_user_modal_qc_checkers_tab_create').checked = (record.qc_checkers_create === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_qc_checkers_tab_read').checked = (record.qc_checkers_read === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_qc_checkers_tab_update').checked = (record.qc_checkers_update === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_qc_checkers_tab_delete').checked = (record.qc_checkers_delete === 1 ? true: false ) || false;

    document.getElementById('garage_user_modal_bookings_tab_create').checked = (record.bookings_create === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_bookings_tab_read').checked = (record.bookings_read === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_bookings_tab_update').checked = (record.bookings_update === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_bookings_tab_delete').checked = (record.bookings_delete === 1 ? true: false ) || false;

    document.getElementById('garage_user_modal_defect_reports_tab_create').checked = (record.defect_reports_create === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_defect_reports_tab_read').checked = (record.defect_reports_read === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_defect_reports_tab_update').checked = (record.defect_reports_update === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_defect_reports_tab_delete').checked = (record.defect_reports_delete === 1 ? true: false ) || false;
    
    
    document.getElementById('garage_user_modal_mot_bay_cleaning_log_tab_create').checked = (record.mot_bay_cleaning_log_create === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_mot_bay_cleaning_log_tab_read').checked = (record.mot_bay_cleaning_log_read === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_mot_bay_cleaning_log_tab_update').checked = (record.mot_bay_cleaning_log_update === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_mot_bay_cleaning_log_tab_delete').checked = (record.mot_bay_cleaning_log_delete === 1 ? true: false ) || false;

    document.getElementById('garage_user_modal_qc_checkers_for_bikes_tab_create').checked = (record.qc_checkers_for_bikes_create === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_qc_checkers_for_bikes_tab_read').checked = (record.qc_checkers_for_bikes_read === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_qc_checkers_for_bikes_tab_update').checked = (record.qc_checkers_for_bikes_update === 1 ? true: false ) || false;
    document.getElementById('garage_user_modal_qc_checkers_for_bikes_tab_delete').checked = (record.qc_checkers_for_bikes_delete === 1 ? true: false ) || false;

    document.getElementById('garage_user_modal_garage_reminders_tab_delete').checked = (record.garage_reminders_delete === 1 ? true: false ) || false;

}

/// GARAGE USERS 
///// GARAGE USERS  SAVE NEW / EXISTING RECORD

saveNewGarageUsersRecord() {
    // Gathering data from the modal form
    const username = document.getElementById('garage_user_modal_email').value;
    const firstname = document.getElementById('garage_user_modal_first_name').value;
    const lastname = document.getElementById('garage_user_modal_last_name').value;
    const garageUserRecordId = document.getElementById('garage_user_modal_RecordID').value;

    let garage_details_read = document.getElementById('garage_user_modal_garage_details_tab_read').checked 
    let garage_details_update = document.getElementById('garage_user_modal_garage_details_tab_update').checked 
    let garage_details_delete = document.getElementById('garage_user_modal_garage_details_tab_delete').checked
    
    let garage_users_create = document.getElementById('garage_user_modal_garage_users_tab_create').checked
    let garage_users_read = document.getElementById('garage_user_modal_garage_users_tab_read').checked
    let garage_users_update = document.getElementById('garage_user_modal_garage_users_tab_update').checked
    let garage_users_delete = document.getElementById('garage_user_modal_garage_users_tab_delete').checked

    let qc_checkers_create = document.getElementById('garage_user_modal_qc_checkers_tab_create').checked 
    let qc_checkers_read = document.getElementById('garage_user_modal_qc_checkers_tab_read').checked
    let qc_checkers_update= document.getElementById('garage_user_modal_qc_checkers_tab_update').checked
    let qc_checkers_delete = document.getElementById('garage_user_modal_qc_checkers_tab_delete').checked

    let bookings_create = document.getElementById('garage_user_modal_bookings_tab_create').checked
    let bookings_read = document.getElementById('garage_user_modal_bookings_tab_read').checked
    let bookings_update = document.getElementById('garage_user_modal_bookings_tab_update').checked
    let bookings_delete = document.getElementById('garage_user_modal_bookings_tab_delete').checked

    let testers_create = document.getElementById('garage_user_modal_testers_tab_create').checked
    let testers_read = document.getElementById('garage_user_modal_testers_tab_read').checked
    let testers_update = document.getElementById('garage_user_modal_testers_tab_update').checked
    let testers_delete = document.getElementById('garage_user_modal_testers_tab_delete').checked


    let mot_equipment_create = document.getElementById('garage_user_modal_mot_equipment_tab_create').checked
    let mot_equipment_read = document.getElementById('garage_user_modal_mot_equipment_tab_read').checked
    let mot_equipment_update = document.getElementById('garage_user_modal_mot_equipment_tab_update').checked
    let mot_equipment_delete = document.getElementById('garage_user_modal_mot_equipment_tab_delete').checked


    let mot_calibrations_create = document.getElementById('garage_user_modal_calibrations_tab_create').checked
    let mot_calibrations_read = document.getElementById('garage_user_modal_calibrations_tab_read').checked
    let mot_calibrations_update = document.getElementById('garage_user_modal_calibrations_tab_update').checked
    let mot_calibrations_delete = document.getElementById('garage_user_modal_calibrations_tab_delete').checked

    let mot_reconciliations_create = document.getElementById('garage_user_modal_reconciliations_tab_create').checked
    let mot_reconciliations_read = document.getElementById('garage_user_modal_reconciliations_tab_read').checked
    let mot_reconciliations_update = document.getElementById('garage_user_modal_reconciliations_tab_update').checked
    let mot_reconciliations_delete = document.getElementById('garage_user_modal_reconciliations_tab_delete').checked

    let mot_site_audits_create = document.getElementById('garage_user_modal_mot_site_audits_tab_create').checked
    let mot_site_audits_read = document.getElementById('garage_user_modal_mot_site_audits_tab_read').checked
    let mot_site_audits_update = document.getElementById('garage_user_modal_mot_site_audits_tab_update').checked
    let mot_site_audits_delete = document.getElementById('garage_user_modal_mot_site_audits_tab_delete').checked


    let defect_reports_create = document.getElementById('garage_user_modal_defect_reports_tab_create').checked
    let defect_reports_read = document.getElementById('garage_user_modal_defect_reports_tab_read').checked
    let defect_reports_update = document.getElementById('garage_user_modal_defect_reports_tab_update').checked
    let defect_reports_delete = document.getElementById('garage_user_modal_defect_reports_tab_delete').checked

    let mot_bay_cleaning_log_create = document.getElementById('garage_user_modal_mot_bay_cleaning_log_tab_create').checked
    let mot_bay_cleaning_log_read = document.getElementById('garage_user_modal_mot_bay_cleaning_log_tab_read').checked
    let mot_bay_cleaning_log_update = document.getElementById('garage_user_modal_mot_bay_cleaning_log_tab_update').checked
    let mot_bay_cleaning_log_delete = document.getElementById('garage_user_modal_mot_bay_cleaning_log_tab_delete').checked
    

    let qc_checkers_for_bikes_create = document.getElementById('garage_user_modal_qc_checkers_for_bikes_tab_create').checked 
    let qc_checkers_for_bikes_read = document.getElementById('garage_user_modal_qc_checkers_for_bikes_tab_read').checked
    let qc_checkers_for_bikes_update= document.getElementById('garage_user_modal_qc_checkers_for_bikes_tab_update').checked
    let qc_checkers_for_bikes_delete = document.getElementById('garage_user_modal_qc_checkers_for_bikes_tab_delete').checked

    let garage_reminders_delete = document.getElementById('garage_user_modal_garage_reminders_tab_delete').checked
    


    // Creating the object to send to the server
    const garageUserData = {
        garage_id: this.id,
        // create_date: date,
        username: username,
        first_name: firstname,
        last_name: lastname,
        garage_details_read,
        garage_details_update,
        garage_details_delete,
        garage_users_create,
        garage_users_read,
        garage_users_update,
        garage_users_delete,
        qc_checkers_create,
        qc_checkers_read,
        qc_checkers_update,
        qc_checkers_delete,
        bookings_create,
        bookings_read,
        bookings_update,
        bookings_delete,
        testers_create,
        testers_read,
        testers_update,
        testers_delete,
        mot_equipment_create,
        mot_equipment_read,
        mot_equipment_update,
        mot_equipment_delete,
        mot_calibrations_create,
        mot_calibrations_read,
        mot_calibrations_update,
        mot_calibrations_delete,
        mot_site_audits_create,
        mot_site_audits_read,
        mot_site_audits_update,
        mot_site_audits_delete,
        defect_reports_create,
        defect_reports_read,
        defect_reports_update,
        defect_reports_delete,
        mot_bay_cleaning_log_create,
        mot_bay_cleaning_log_read,
        mot_bay_cleaning_log_update,
        mot_bay_cleaning_log_delete,
        qc_checkers_for_bikes_create,
        qc_checkers_for_bikes_read,
        qc_checkers_for_bikes_update,
        qc_checkers_for_bikes_delete,
        mot_reconciliations_create,
        mot_reconciliations_read,
        mot_reconciliations_update,
        mot_reconciliations_delete,
        data_launch_bays_create: 1,
        data_launch_bays_read: 1,
        data_launch_bays_update: 1,
        tqi_create: 1,
        tqi_read: 1,
        data_launch_tester_records_create: 1,
        garage_reminders_delete
    };

    if (garageUserRecordId === "") {
        // Sending the data to the server to create a new record
        this.secureAction('create', 'data_launch_users', null, garageUserData).then(res => {
            // // console.log('data_launch_users res', res);
            this.injectDataIntoUsersSubgrid();
            // this.sendLoginDetailsToEmail(firstname, lastname, username)
        }, err => { 
            console.error(err); 
        });
    } else {
        // Updating the existing record
        let recordId = parseInt(garageUserRecordId);
        garageUserData.id = recordId;
        this.secureAction('update','data_launch_users', recordId, garageUserData).then(res => {
            // // console.log('data_launch_users res', res);
            for (let i = 0; i < this.garageUsersData.length; i++) {
                if (this.garageUsersData[i].id === recordId) {
                    this.garageUsersData[i] = res;
                }        
            }
            this.injectDataIntoUsersSubgrid();
            // this.sendLoginDetailsToEmail(firstname, lastname, username)
        }, err => { 
            console.error(err); 
        });
    }
}



//// GARAGE REMINDERS SECTION

//// SHOW NEW GARAGE REMINDER MODAL BOX
showGarageRemindersModal() {
    document.getElementById('garageRemindersModalOverlay').style.display = 'block';  
    document.getElementById('garageRemindersModal').style.display = 'block';      
    document.getElementById('reminder-title').value = '';
    document.getElementById('reminder-description').value = '';
    document.getElementById('reminder-due-date').value = '';
}
//// SHOW EXISTING GARAGE REMINDERS WITHIN MODAL BOX
openGarageRemindersModalRecord(recordId) {
    let obj = {}
    for (let i = 0; i < this.garageRemindersData.length; i++) {
       if (this.garageRemindersData[i].id === parseInt(recordId)) {
        obj = this.garageRemindersData[i]
       }        
    }
    // // console.log('openGarageRemindersModalRecord obj ', obj)
    document.getElementById('garageRemindersModalOverlay').style.display = 'block';  
    document.getElementById('garageRemindersModal').style.display = 'block';      
    document.getElementById('reminder-title').value = obj.title;
    document.getElementById('reminder-description').value = obj.description;
    document.getElementById('garageRemindersRecordId').value = obj.id;    
    document.getElementById('reminder-due-date').value = this.convertToDateInputFormat(obj.due_date);
}
convertToDateInputFormat(dateStr) {
    const [day, month, year] = dateStr.split("/").map(Number);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }



}

function openTab(evt, tabName, context) {
    var i, tabcontent, tablinks;
    
    // Select the tab contents and buttons specific to the context (modal)
    tabcontent = document.querySelectorAll(`#${context} .tab-content`);
    tablinks = document.querySelectorAll(`#${context} .tab-button`);
    
    // Hide all tab contents
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove "active" class from all tab buttons
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab and add "active" class to the clicked button
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


  
  // Initialize first tab as active
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.tab-button').click();
  });
  