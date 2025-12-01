class TestingStation {
    constructor(id) {
        this.filteredData = []
        this.filters = []
        this.page = 0;
        this.pageSize = 150;
        this.data = testingStationData
        this.currentSearchValue = ''
        this.addListenersAdded = false
        document.getElementById('data-launch-side-bar').classList.remove('data-launch-activate-menu')
        if (id) {
            this.id = id
            let rec;
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i].id === parseInt(id)) {
                    rec = this.data[i]
                }        
            }
            this.openForm(true, rec)
            this.addListeners()
        }
        else {
           this.renderHTMLHeader()
        }
    }
    async loadPage() {
        try {
            const offset = this.page * this.pageSize;
            const chunk = await fetchData('testing_station', this.pageSize, offset);
            this.data = chunk;
            this.renderHTMLHeader();
        } catch (err) {
            console.error("Failed to load page:", err);
        }
    }
    nextPage() {
        this.page++;
        this.loadPage();
    }
    previousPage() {
        if (this.page > 0) {
            this.page--;
            this.loadPage();
        }
    }
    // sideBarToggle () {
    //     let garageSideMenu = document.getElementById('data-launch-testing-station-tabs-container')
    //     garageSideMenu.classList.toggle('active')
    //     if (garageSideMenu.classList.contains('active')) {
    //         let x = Array.from(document.getElementsByClassName('bi-chevron-double-right'))
    //         x.forEach(icon => {
    //             icon.classList.remove('bi-chevron-double-right')
    //             icon.classList.add('bi-chevron-double-left')
    //         })
    //     }
    //     else {
    //         let x = Array.from(document.getElementsByClassName('bi-chevron-double-left'))
    //         x.forEach(icon => {
    //             icon.classList.remove('bi-chevron-double-left')
    //             icon.classList.add('bi-chevron-double-right')
    //         })
    //     }
    // }
      sideBarToggle() {
        const toggle=document.getElementById('data-launch-testing-station-menu-toggle');
        const sidebar=document.getElementById('testingStationSidebar');
        sidebar.classList.toggle('open');
    }
   async globalSearchVTS(vtsNumber) {
        try {
            const currentValue = document.getElementById("data-launch-testing-station-global-filter-input").value;
            this.currentSearchValue = currentValue
            const res = await fetch(`/api/testing_station/search?vts_site_number=${vtsNumber}`);
            const data = await res.json();
            if (data.length > 0) {
                this.data = data; // Replace current page with result
                this.renderHTMLHeader();
                this.showCRUDAlert(`Found VTS Site ${vtsNumber} on server`, 'success');
                document.getElementById("data-launch-testing-station-global-filter-input").value = currentValue;
            } else {
                this.showCRUDAlert(`No VTS Site Number "${vtsNumber}" found`, 'error');
            }
        } catch (err) {
            console.error("Error fetching global VTS search:", err);
            this.showCRUDAlert("Server error during VTS search", 'error');
        }
    }
    renderHTMLHeader () {
        let html = `
        <div class="button-container">
            <button class="modern-button data-launch-add-new-testing-station-record">
                <span class="plus-icon">+</span>
                New
            </button>
        </div>
        <div class="data-launch-crud-security-alert" id="data-launch-crud-alert-box-testing-station">
            <div class="data-launch-crud-security-alert__icon" id="data-launch-crud-alert-icon-testing-station"></div>
            <div class="data-launch-crud-security-alert__message" id="data-launch-crud-alert-message-testing-station"></div>
        </div>
        <div id="testingStationDelModal" class="del-confirmation-modal">
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
            <input style="width: 100%;" type="text" class="data-launch-testing-station-global-filter-input" id="data-launch-testing-station-global-filter-input" placeholder="Search VTS Site Number">
            <i class="bi bi-x-circle data-launch-reset-filters-icon data-launch-table-reset-all-filters"></i>
        </div>
        <div class="container" style="height: 78vh; overflow-y: auto;">            
            <table id="data-launch-testing-station-table-el" class="responsive-table" style="width: 100%; border-collapse: collapse; margin: 0px;">
                <thead class="responsive-table__head" style="position: sticky; top: 0; z-index: 1;">
                    <tr class="responsive-table__row">
                        <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">ID</th>
                        <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">VTS Site No</th>
                        <th class="responsive-table__head__title responsive-table__head__title--name">
                            <span class='data-launch-header-label'>Trading Name</span>
                        </th>
                         <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                          <span class='data-launch-header-label'>City</span>
                        </th>
                        <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                          <span class='data-launch-header-label'>Postcode</span>
                        </th>
                        <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                          <span class='data-launch-header-label'>Garage ?</span>
                        </th>
                        <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                          <i class="bi bi-filetype-xls data-launch-export-icon data-launch-export-records"></i>                                          
                        </th>
                        <th>Archive?</th>                    
                    </tr>                   
                </thead>
                <tbody class="responsive-table__body" id="data-launch-testing-station-table-body">
                `
        this.renderHTMLData(html)
    }
    renderHTMLData(html) {
        let data = this.data
        let exportRow = 0
        for (let i = 0; i < data.length; i++) {
            html += `
            <tr id="data_launch_testing_station_row_${data[i].id}" class="responsive-table__row export-row" data-export-row="${exportRow}" data-export-header="VTS Site No" data-export-val="${data[i].vts_site_number}" data-vts-pro-id="${data[i].id}">
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testing-station-view-record-click" data-export-row="${exportRow}" data-export-header="ID" data-export-val="${data[i].id}" scope="row">${data[i].id}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testing-station-view-record-click" data-export-row="${exportRow}" data-export-header="VTS Site Number" data-export-val="${data[i].vts_site_number}" scope="row">${data[i].vts_site_number}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testing-station-view-record-click" data-export-row="${exportRow}" data-export-header="Trading Name" data-export-val="${typeof data[i].trading_name === 'undefined' ? '' : data[i].trading_name}" scope="row">
                ${data[i].trading_name.substring(0, 16)}
				</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testing-station-view-record-click" data-export-row="${exportRow}" data-export-header="VTS City"                data-export-val="${data[i].vts_address_line_4}" scope="row">${typeof data[i].vts_address_line_4 === 'undefined' ? '' : data[i].vts_address_line_4}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testing-station-view-record-click" data-export-row="${exportRow}" data-export-header="VTS Postcode"                data-export-val="${data[i].vts_postcode}" scope="row">${typeof data[i].vts_postcode === 'undefined' ? '' : data[i].vts_postcode}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testing-station-view-record-click" data-export-row="${exportRow}" data-export-header="Full Garage Client"                data-export-val="${data[i].is_garage_record}" scope="row">${typeof data[i].is_garage_record === 'undefined' ? '' : (data[i].is_garage_record === 1 ? 'Yes' : 'No' )}</td>
                <td></td>
                <td class="responsive-table__body__text responsive-table__body__text--types"><i class="bi bi-trash data-launch-subgrid-delete-testing-station-item" data-id='${data[i].id}'></i></td> 
            </tr>` 
            exportRow++           
        }
        this.exportRow = exportRow
        this.renderHTMLBody(html)
    }
    renderHTMLBody (html) {
        html += `       </tbody>
                    </table>
                </div>
                <div class="container pagination-controls" style="padding-left:40%;">
                    <button onclick="testingStationClassInstantiated.previousPage()"><i class="bi bi-caret-left-fill"></i>Previous</button>
                    <button onclick="testingStationClassInstantiated.nextPage()">Next<i class="bi bi-caret-right-fill"></i></button>
                </div>
            </div>`
        document.getElementById('testingStationPage').innerHTML = html
        if (this.currentSearchValue !== '') {
            document.getElementById("data-launch-testing-station-global-filter-input").value = this.currentSearchValue
        }
        else {
            document.getElementById("data-launch-testing-station-global-filter-input").value = ''
        }
        if (this.addListenersAdded === false) {
            this.addListeners()
        }               
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
            for (let i = 0; i < data.length; i++) {
                html += `
                <tr id="data_launch_testing_station_row_${data[i].id}" class="responsive-table__row export-row" data-export-row="${exportRow}" data-export-header="VTS Site No" data-export-val="${data[i].vts_site_number}" data-vts-pro-id="${data[i].id}">
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testing-station-view-record-click" data-export-row="${exportRow}" data-export-header="ID" data-export-val="${data[i].id}" scope="row">${data[i].id}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testing-station-view-record-click" data-export-row="${exportRow}" data-export-header="VTS Site Number" data-export-val="${data[i].vts_site_number}" scope="row">${data[i].vts_site_number}
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testing-station-view-record-click" data-export-row="${exportRow}" data-export-header="Trading Name" data-export-val="${data[i].trading_name}" scope="row">${data[i].trading_name}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testing-station-view-record-click" data-export-row="${exportRow}" data-export-header="VTS City"                data-export-val="${data[i].vts_address_line_4}" scope="row">${data[i].vts_address_line_4}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testing-station-view-record-click" data-export-row="${exportRow}" data-export-header="VTS Postcode"                data-export-val="${data[i].vts_postcode}" scope="row">${data[i].vts_postcode}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testing-station-view-record-click" data-export-row="${exportRow}" data-export-header="Full Garage Client"                data-export-val="${data[i].is_garage_record}" scope="row">${typeof data[i].is_garage_record === 'undefined' ? '' : (data[i].is_garage_record === 1 ? 'Yes' : 'No' )}</td>
                    <td></td>
                    <td class="responsive-table__body__text responsive-table__body__text--types"><i class="bi bi-trash data-launch-subgrid-delete-testing-station-item" data-id='${data[i].id}'></i></td> 
                </tr>` 
                exportRow++           
            }
        }      
        return html
    }
    openPromoteToGarageConfirmationBox(id) {
        document.getElementById('data-launch-promote-to-garage').style.display = 'none'
        document.getElementById('data-launch-testing-station-save-close').style.display = 'none'  
        document.getElementById('data-launch-confirmation-box-inject').style.display = 'block'
        document.getElementById('data-launch-testing-station-promote-garage-confirmation-box').style.display = 'block'        
    }
    promoteToGarageConfirmed () {
        document.getElementById('data-launch-testing-station-save-close').style.display = 'block'  
        document.getElementById('data-launch-confirmation-box-inject').style.display = 'none'
        document.getElementById('data-launch-testing-station-promote-garage-confirmation-box').style.display = 'none'        
        this.convertRecordToGarage()
        document.getElementById('animation-container').style.display = 'block'
        // this.triggerFirework('newlyPromoted')
    }
    promoteToGarageCancelled () {
        document.getElementById('data-launch-promote-to-garage').style.display = 'inline-block'
        document.getElementById('data-launch-testing-station-save-close').style.display = 'block'  
        document.getElementById('data-launch-confirmation-box-inject').style.display = 'none'
        document.getElementById('data-launch-testing-station-promote-garage-confirmation-box').style.display = 'none'        
    }
    convertRecordToGarage () {
        let rec;
        let id = parseInt(this.id)
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id === id) {
                rec = this.data[i]
            }
        }
        let newGarageRec = {
            trading_name_garage : rec.trading_name,
            testing_station_id_garage: id,
            vts_address_line_1_garage: rec.vts_address_line_1,
            vts_address_line_2_garage: rec.vts_address_line_2,
            vts_address_line_3_garage: rec.vts_address_line_3,
            vts_address_line_4_garage: rec.vts_address_line_4,
            vts_postcode_garage: rec.vts_postcode,
            vts_site_number_garage: rec.vts_site_number,
            contact_forename_garage: rec.contact_forename,
            contact_surname_garage: rec.contact_surname,
            contact_main_number_garage: rec.contact_main_number,
            contact_mobile_number_garage: rec.contact_mobile_number,
            contact_email_garage: rec.contact_email,
            date_called_garage: rec.date_called,
            call_back_needed_garage: rec.call_back_needed,
            callback_date_garage: rec.callback_date,
            invoice_contact_garage: rec.invoice_contact,
            invoice_contact_number_garage: rec.invoice_contact_number,
            invoice_contact_email_garage: rec.invoice_contact_email,
            invoice_contact_notes_garage: rec.invoice_contact_notes,
            callback_notes_garage: rec.callback_notes,
            cpd_needed_garage: rec.cpd_needed_checkb,
            cpd_notes_garage: rec.cpd_notes,
            level_3_required_checkb_garage: rec.level_3_required_checkb,
            level_3_required_garage: rec.level_3_required,
            aed_name_garage: rec.aed_name,
            aed_password_garage: rec.aed_password,
            aed_email_garage: rec.aed_email,
            aed_phone_no_garage: rec.aed_phone_no,
            email_username_garage: rec.contact_email, 
            mot_testing_class_4_7_req_checkb_garage: rec.mot_testing_class_4_7_req_checkb,
            mot_testing_class_4_7_required_garage: rec.mot_testing_class_4_7_required,
            mot_testing_class_1_2_req_checkb_garage: rec.mot_testing_class_1_2_req_checkb,
            mot_testing_class_1_2_required_garage: rec.mot_testing_class_1_2_required,
            mot_class_3_required_checkb_garage: rec. mot_class_3_required_checkb,
            mot_class_3_required_garage: rec.mot_class_3_required,
            mot_class_5_required_checkb_garage: rec.mot_class_5_required_checkb,
            mot_class_5_required_garage: rec.mot_class_5_required,
            mot_test_centre_management_req_checkb_garage: rec.mot_test_centre_management_req_checkb,
            mot_test_centre_management_required_garage: rec.mot_test_centre_management_required,
            vts_pro_solution_required_checkb_garage: rec.vts_pro_solution_required_checkb,
            vts_pro_solution_required_garage: rec.vts_pro_solution_required,
            lead_consultant_name_garage: USER_RECORD.first_name + ' ' + USER_RECORD.last_name,
            consultant_name_garage: USER_RECORD.first_name + ' ' + USER_RECORD.last_name,
            create_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
        }
        createRecord('data_launch_garage_records', newGarageRec).then(res => {
                // garageData.splice(0, 0, res)
                // // console.log('garageData NOW LIAM', garageData)
                let newGarageRecordID = res.id
                document.getElementById('garageRecordId').style.display = 'inline'
                document.getElementById('garageRecordId').innerText = `Garage Record - ${newGarageRecordID}`
                let x = document.getElementById('garageRecordId')
                x.setAttribute('data-launch-id', newGarageRecordID)
                let updatedData = {
                    is_garage_record: 1,
                    garage_record_id: newGarageRecordID
                }
                garageData.push(res)
                garageData.sort((a, b) => b.id - a.id)
                updateRecord('testing_station', rec.id, updatedData).then(res => {
                    for (let i = 0; i < this.data.length; i++) {
                        if (this.data[i].id === rec.id) {
                            this.data[i].is_garage_record = 1
                            this.data[i].garage_record_id = newGarageRecordID                          
                        }        
                    }
                    for (let i = 0; i < testingStationData.length; i++) {
                        if (testingStationData[i].id === rec.id) {
                            testingStationData[i].is_garage_record = 1
                            testingStationData[i].garage_record_id = newGarageRecordID                          
                        }        
                    }
                    let obj = {
                        username: newGarageRec["contact_email_garage"],
                        password: '',
                        first_name: newGarageRec["contact_forename_garage"],
                        last_name: newGarageRec["contact_surname_garage"],
                        full_user: 0,
                        garage_id: newGarageRecordID
                    }
                    createRecord('data_launch_users', obj).then(res=>{
                        // console.log('res', res)
                        // alert('new user record created successfull')
                    }, error => {
                        console.error('error', error)
                    })
                },
                error => {
                    console.error(error)
                })
            },
            err => {
                console.error(err)
            }
        )
    }
    navigateToGarageRecord (ev, id) {
        changePage(ev, id, 'garage')  
    }
    dataTransformation (id) {
        let rec;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id === id) {
                rec = this.data[i]
                break;
            }
        }
        // transform the garageTesters
        rec = this.dataTransformation_garageTesters(rec)
        return rec
    }
    dataTransformation_garageTesters(data) {
        let garageTesters = [];        
        // Iterate through the data to gather tester information
        for (let i = 1; i <= 5; i++) {
            let tester = {
            firstName: data[`garage_tester_${i}_fn`] || '',
            lastName: data[`garage_tester_${i}_ln`] || '',
            userID: data[`garage_tester_${i}_uid`] || '',
            phoneNo: data[`garage_tester_${i}_ph`] || '',
            email: data[`garage_tester_${i}_email`] || ''
            };
            garageTesters.push(tester);
        }        
        // Add the garageTesters array to the data object
        data.garageTesters = garageTesters;
        
        // Remove the old properties
        for (let i = 1; i <= 5; i++) {
            delete data[`garage_tester_${i}_fn`];
            delete data[`garage_tester_${i}_ln`];
            delete data[`garage_tester_${i}_uid`];
            delete data[`garage_tester_${i}_ph`];
            delete data[`garage_tester_${i}_email`];
        }          
        return data;
    }

    showCRUDAlert(message, type) {
        const alertBox = document.getElementById("data-launch-crud-alert-box-testing-station");
        const alertMessage = document.getElementById("data-launch-crud-alert-message-testing-station");
        const alertIcon = document.getElementById("data-launch-crud-alert-icon-testing-station");
    
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

    isUserAuthorized(action, table) {
        if (USER_RECORD.full_user === 1) {
            return true
        }
        else if (action === 'create') {
            //// ALL USERS CAN CREATE GARAGE REMINDERS /////
            if (table === 'data_launch_special_notices') {
                return true
            }            
        }
        else {
            return false
        }        
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
            // console.log('this is all being processed via the new secureAction function');    
            
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
                    this.showCRUDAlert('Well done! Great success', 'success');
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
    addListeners () {
        this.addListenersAdded = true
        document.getElementById('testingStationPage').addEventListener('click', (event) => {
            event.stopPropagation()
            if (event.target.classList.contains('data-launch-testing-station-view-record-click')) {
                this.currentSearchValue = document.getElementById("data-launch-testing-station-global-filter-input").value;
                let id = parseInt(event.target.parentElement.dataset.vtsProId)
                let record = this.dataTransformation(id)
                this.openForm(true, record)
            }
            else if (event.target.classList.contains('data-launch-btn-dupli-warning-confirm')) {
                document.getElementById("data-launch-override-dupli-vts-modal").style.display = "none";
                this.saveDetailsAboutTheRecord(true); // Proceed to save
            }
            else if (event.target.classList.contains('data-launch-btn-dupli-warning-cancel')) {
                document.getElementById("data-launch-override-dupli-vts-modal").style.display = "none";
            }
            else if (event.target.classList.contains('data-launch-btn-dupli-warning-cancel-return-to-list')) {
                this.renderHTMLHeader()
            }
            else if (event.target.classList.contains('data-launch-btn-dupli-warning-cancel-no-id')) {
                document.getElementById("data-launch-override-dupli-vts-modal-no-id").style.display = "none";
            }
            else if (event.target.classList.contains('data-launch-btn-dupli-warning-cancel-return-to-list-no-id')) {
                this.renderHTMLHeader()
            }
            else if (event.target.classList.contains('data-launch-dupli-vts-confirm-cancel-return-to-list-no-vts-or-trading-name')) {
                this.renderHTMLHeader()
            }
            else if (event.target.classList.contains('data-launch-dupli-vts-confirm-cancel-no-vts-or-trading-name')) {
                document.getElementById("data-launch-override-dupli-vts-modal-return-to-list").style.display = "none";
            }
            else if (event.target.classList.contains('data-launch-testing-station-menu-toggle-trigger')) {
                this.sideBarToggle()               
            }  
            else if (event.target.classList.contains('startFirework')) {
                document.getElementById('animation-container').style.display = 'block'
                // this.triggerFirework('newlyPromoted')
            }
            else if (event.target.classList.contains('data-launch-garage-record-click')) {
                let id = event.target.attributes["data-launch-id"].value
                if (id !== 'null') {
                    this.navigateToGarageRecord(event, id)
                }                
            }
            else if (event.target.classList.contains('data-launch-promote-to-garage')) {
                let id = event.target.attributes["data-launch-rec"].value
                this.openPromoteToGarageConfirmationBox(id)
            }
            else if (event.target.classList.contains('testing-station-list-view-open-garage-record')) {
                let id = event.target.value
                // console.log('id', id )
                this.openPromoteToGarageConfirmationBox(id)
            }
            else if (event.target.classList.contains('data-launch-promote-confirm')) {
                this.promoteToGarageConfirmed()
            }
            else if (event.target.classList.contains('data-launch-promote-cancel')) {
                this.promoteToGarageCancelled()
            }
            else if (event.target.classList.contains('data-launch-record-back-to-list-view')) {
                this.saveAndClose()
            }
            else if (event.target.classList.contains('data-launch-add-new-testing-station-record')) {
                this.openForm(false)
            }
            else if (event.target.classList.contains('data-launch-nav-menu-plus-icon')) {
                this.openForm(false)
            }

            else if (event.target.classList.contains('del-confirmation-modal__btn--cancel')) {
                let delModal = document.getElementById('testingStationDelModal');
                delModal.classList.remove('active'); 
            }
            else if (event.target.classList.contains('del-confirmation-modal__btn--confirm')) {
                let delModal = document.getElementById('testingStationDelModal');
                delModal.classList.remove('active'); 
                let id = event.target.attributes["data-id"].value;
                let table = event.target.attributes["data-table"].value;
                let rowElemId = event.target.attributes["data-element-id"].value;
                this.secureAction('delete', table, parseInt(id)).then(
                    success => {
                        // console.log('success', success)
                        document.getElementById(rowElemId).style.display = 'none';                      
                    },
                    err => {
                        // console.log(err)
                    }
                )  
            }
            else if (event.target.classList.contains('data-launch-subgrid-delete-testing-station-item')) {
                let id = event.target.attributes["data-id"].value;
                let delModal = document.getElementById('testingStationDelModal');
                delModal.classList.add('active');
                document.getElementById('confirmDelete').setAttribute('data-id', id)
                document.getElementById('confirmDelete').setAttribute('data-table', 'testing_station')
                document.getElementById('confirmDelete').setAttribute('data-element-id', `data_launch_testing_station_row_${id}`)
            }



            else if (event.target.classList.contains('data-launch-tabs-clickable-testing-station')) {
                // data-launch-testing-stations
                let x = Array.from(document.getElementsByClassName('data-launch-testing-stations-screen'))
                x.forEach(el => {
                    if (el.classList.contains('active')) {
                        el.classList.remove('active')
                    }
                })
                let y = Array.from(document.getElementsByClassName('data-launch-tabs-clickable-testing-station'))
                y.forEach(el => {
                    if (el.classList.contains('active')) {
                        el.classList.remove('active')
                    }
                })
                let z = Array.from(document.getElementsByClassName('data-launch-tabs-parent-li-testing-station'))
                z.forEach(el => {
                    if (el.classList.contains('active')) {
                        el.classList.remove('active')
                    }
                })
                let page = event.target.attributes["data-launch-menu-item"].value
                document.getElementById(`testing_station_parent_li_${page}`).classList.add('active')
                document.getElementById(`data-launch-testing-stations-${page}`).classList.add('active')
                document.getElementById(`data-launch-testion-station-${this.id}-what-tab`).innerHTML = page
                this.sideBarToggle()
            }
            else if (event.target.classList.contains('data-launch-save-close-record')) {
                this.saveAndClose()
            }
            else if (event.target.classList.contains('data-launch-save-record')) {
                this.saveRecord()
            }
            else if (event.target.classList.contains('data-launch-export-records')) {
                this.export()
            }
            else if (event.target.classList.contains('data-launch-filter-search')) {
                if (event.target.value === '') {
                    let header = event.target.attributes["data-launch-header"].value
                    let value = event.target.value
                    let anyMatches = false
                    for (let i = 0; i < this.filters.length; i++) {
                        if (this.filters[i].header === header) {
                            anyMatches = true
                        }                        
                    }
                    if (anyMatches === true) {
                        this.filterRemove(header,value)
                    }
                }
            }
            else if (event.target.classList.contains('data-launch-table-reset-all-filters')) {
                this.currentSearchValue = ''
                this.filterResetAll()
            }
            else if (event.target.classList.contains('data-launch-filter-icon')) {
                document.getElementById('data-launch-testing-station-filter-container').classList.toggle('data-launch-inactive')
            }
        })
        // document.getElementById('testingStationPage').addEventListener('input', (event) => {
        //     if (event.target.classList.contains('data-launch-testing-station-global-filter-input')) {
        //         // alert('being triggered')
        //         if (event.key === 'Enter') {
        //             if (event.target.value === '') {
        //                 this.page = 0;
        //                 this.loadPage()
        //             }
        //             else {
        //                 this.globalFilter(event)
        //             } 
        //         }               
        //     }
        // })
        document.getElementById('testingStationPage').addEventListener('keydown', (event) => {
            if (event.target.classList.contains('data-launch-testing-station-global-filter-input')) {
                if (event.key === 'Enter') {
                    if (event.target.value === '') {
                        this.currentSearchValue = ''
                        this.page = 0;
                        this.loadPage();
                    } else {
                        this.globalFilter(event);
                    }
                }
            }
        });

        document.getElementById('testingStationPage').addEventListener('change', (event) => {
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
                let value = event.target.value
                this.filterRemove(header,value)
            }
            else if (event.target.classList.contains('data-launch-field-editable')) {
                let field = event.target.attributes["data-launch-field"].value
                let recordID = document.getElementById('currentRecordID').innerHTML
                this.data.forEach(row=> {
                    if (row.id === recordID) {
                        row[field] = event.target.value
                    }
                })
            }
            // else if (event.target.classList.contains('data-launch-testing-station-global-filter-input')) {
            //     // alert('being triggered')
            //     this.globalFilter(event)
            // }
         })
    }
    globalFilter (event) {        
        let filter = event.target.value.toUpperCase();
        // // let table = document.getElementById("data-launch-testing-station-table-el");
        // let table = document.getElementById("data-launch-testing-station-table-body");        
        // let tr = table.getElementsByTagName("tr");
        // let txtValue;
        // let anyMatchesFound = false
        // for (let i = 0; i < tr.length; i++) {
        //     let tds = Array.from(tr[i].getElementsByTagName("td"))
        //     let matchFound = false;

        //     for (let td of tds) {
        //         let txtValue = td.textContent || td.innerText;
        //         if (txtValue.toUpperCase().includes(filter)) {
        //             matchFound = true;
        //             break;
        //         }
        //     }    
        //     tr[i].style.display = matchFound ? "" : "none";
        //     if (matchFound) anyMatchesFound = true; // ✅ You were missing this
        // }
        //    // ✅ If no match found, try global VTS search
        // if (!anyMatchesFound) {
        //     this.globalSearchVTS(filter);
        // }
        this.globalSearchVTS(filter);
    }
    filterApply (header,value, filterJustRemoved) {
        // if a filter has just been removed and there are now 0 filters
        if (filterJustRemoved === true && this.filters.length === 0) {
            this.filteredData = []
            this.filters = []
            let html = this.buildTableBody(this.data)
            document.getElementById('data-launch-testing-station-table-body').innerHTML = html
        }
        else if (filterJustRemoved === true && this.filters.length >= 1) {
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
            document.getElementById('data-launch-testing-station-table-body').innerHTML = html
        }
        else if (this.filters.length === 0) {
            this.filters.push({header: header, value: value})
            for (let i = 0; i < this.data.length; i++) {
                if (header === 'id') {
                    if (this.data[i][header] === parseInt(value)) {
                        this.filteredData.push(this.data[i])
                    }
                }
                else if (this.data[i][header].toUpperCase().includes(value.toUpperCase()) || this.data[i][header].includes(value)) {
                    this.filteredData.push(this.data[i])
                }                
            }
            let html = this.buildTableBody(this.filteredData)
            document.getElementById('data-launch-testing-station-table-body').innerHTML = html
        }
        else {  
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
            document.getElementById('data-launch-testing-station-table-body').innerHTML = html
        }
    }
    filterRemove (header,value) {
        this.filters = this.filters.filter(function (filterRec) {
            return filterRec.header !== header
        })
        this.filterApply(header, value, true)
    }
    filterResetAll () {
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
        // document.getElementById('data-launch-testing-station-table-body').innerHTML = html
        // let table = document.getElementById("data-launch-testing-station-table-el");
        // let tr = table.getElementsByTagName("tr");
        // for (let i = 0; i < tr.length; i++) {
        //     tr[i].style.display = 'grid'
        // }
        // document.getElementById('data-launch-testing-station-global-filter-input').value = ''
        this.page = 0;
        // Re-fetch and render the initial full data set (e.g., first 1500 records)
        this.loadPage(); // Make sure this method exists and loads the first page
    }
    showSavedBanner () {
        document.getElementById('data-launch-saved-record-banner').classList.add('active')
        setTimeout(() => {
            document.getElementById('data-launch-saved-record-banner').classList.remove('active')
        }, 4000);
    }
    async vtsDuplicateNumberCheck (vtsNumber) {
        const alreadyExists = await checkIfVtsNumberExists(vtsNumber, this.id || null);
        if (alreadyExists) {
            this.showCRUDAlert('A record with this VTS Site Number already exists.', 'error');
        }
        return alreadyExists
    }
    async saveAndClose () {
        if (!this.minimumDataValidation()) {
            this.showCRUDAlert('Please provide a Trading Name and VTS Site Number', 'error');
            document.getElementById("data-launch-override-dupli-vts-modal-return-to-list").style.display = "block";
            return; // stop execution here
        }
        let vtsSiteNumber = document.getElementById('vts_site_number_val').value
        let alreadyExists = await this.vtsDuplicateNumberCheck(vtsSiteNumber)
        if (alreadyExists) {
            if (this.id === null) {
                document.getElementById("data-launch-override-dupli-vts-modal-no-id").style.display = "block";                
            }
            else {
                document.getElementById("data-launch-override-dupli-vts-modal").style.display = "block";
            }            
            return;
        }       
        // this effectively deletes the element, including all of the event listeners, and then creates a new copy with zero event listeners attached
        this.saveDetailsAboutTheRecord(true)
        const oldElement = document.getElementById('testingStationPage');
        const newElement = oldElement.cloneNode(true); // Cloning with all children and attributes
        oldElement.parentNode.replaceChild(newElement, oldElement);
        this.addListenersAdded = false
    }
     minimumDataValidation() {
        /// this is NOT A SYSTEM ID, this is the TESTERID that testers get provided with by the DVSA or equivalent
        let vtsSiteNumber = document.getElementById('vts_site_number_val').value
        let tradingName = document.getElementById('trading_name_val').value
        if (vtsSiteNumber === '' || tradingName === '') {
            return false
        }
        else {
            return true
        }        
    }
    async saveRecord () {
        if (!this.minimumDataValidation()) {
            this.showCRUDAlert('Please provide a Trading Name and VTS Site Number', 'error');
            return; // stop execution here
        }
        let vtsSiteNumber = document.getElementById('vts_site_number_val').value
        let alreadyExists = await this.vtsDuplicateNumberCheck(vtsSiteNumber)
        if (alreadyExists) {
            if (this.id === null) {
                document.getElementById("data-launch-override-dupli-vts-modal-no-id").style.display = "block";                
            }
            else {
                document.getElementById("data-launch-override-dupli-vts-modal").style.display = "block";
            }
            return;
        }
        this.saveDetailsAboutTheRecord(false)
    }
    saveDetailsAboutTheRecord (closeRecord) {
        let fieldObjectMeta = this.fieldObjectMeta()
        // console.log('fieldObjectMeta', fieldObjectMeta)
        let fields = []
        for (const key in fieldObjectMeta) {
            for (let t = 0; t < fieldObjectMeta[key].fields.length; t++) {
                fields.push(fieldObjectMeta[key].fields[t])
            }
        }
        // console.log('all the fields i need to check ', fields)
        // console.log('this.newRecord', this.newRecord)
        let createRecordObject = {}
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].type === 'text' ||
                fields[i].type === 'email' ||
                fields[i].type === 'phone' ||
                fields[i].type === 'multi-text' ||
                fields[i].type === 'notes' ||
                fields[i].type === 'date' ) {
                if (document.getElementById(`${fields[i].field}_val`).value || document.getElementById(`${fields[i].field}_val`).value === '') {
                    // console.log('this text field contains data ', fields[i], document.getElementById(`${fields[i].field}_val`).value)
                    createRecordObject[fields[i].field] = document.getElementById(`${fields[i].field}_val`).value
                }
            }
            else if (fields[i].type === 'checkbox') {
                if (document.getElementById(`${fields[i].field}_val`)) {
                    // console.log('this text field contains data ', fields[i], document.getElementById(`${fields[i].field}_val`).checked)
                    let val = document.getElementById(`${fields[i].field}_val`).checked
                    if (val === true) {
                        createRecordObject[fields[i].field] = 1
                    }
                    else {
                        createRecordObject[fields[i].field] = 0
                    }                    
                }
            }
        }
        if (this.newRecord) {
            // console.log('create RecordObject', createRecordObject)   
            createRecordObject.id = testing_station_next_id
            createRecordObject.is_garage_record = 0
            createRecord('testing_station', createRecordObject).then( res => {
                    // console.log('CREATED NEW TESTING STATION IN DB', res)
                    testing_station_next_id++
                    this.data.splice(0,0, res)
                    if (closeRecord === true) {
                        this.renderHTMLHeader()
                    }
                    else {
                        this.id = res.id
                        this.recordId = res.id
                        this.newRecord = false
                        this.openForm(true, res) // switch into full "existing record" view
                        this.showCRUDAlert("Record saved. You may now continue editing or promote this station to a garage.", "success")
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
        else {
            createRecordObject.id = this.recordId
            // console.log('update RecordObject', createRecordObject)   
            updateRecord('testing_station', this.recordId, createRecordObject).then(res => {
                    // console.log('UPDATED EXISTING TESTING STATION ???', res)
                    for (let i = 0; i < this.data.length; i++) {
                        if (this.data[i].id === createRecordObject.id ) {
                            // this.data[i] = createRecordObject    
                            this.data[i] = { ...this.data[i], ...createRecordObject }                      
                        }        
                    }
                    for (let i = 0; i < testingStationData.length; i++) {
                        if (testingStationData[i].id === createRecordObject.id) {
                            // testingStationData[i] = createRecordObject
                            testingStationData[i] = { ...testingStationData[i], ...createRecordObject }                    
                        }
                    }
                    if (closeRecord === true) {
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
    generateRandomId () {
        const timestamp = new Date().getTime().toString(16); // Get current timestamp in hexadecimal
        let random = Math.random().toString(16).substring(2); // Get random number in hexadecimal
        random = random.substring(0, 4)
        return random; // Combine timestamp and random number
    }
    fieldObjectMeta () {
        return {
            Summary : {
                meta: {
                    columns: 3,
                    name: 'summary',
                    containerElement: 'data-launch-testing-stations-summary'
                },
                fields: [
                    {
                        field: 'vts_site_number',
                        label: 'VTS Site No',
                        type: 'text',
                        column: 1,
                        section: 1
                    },
                    {
                        field: 'trading_name',
                        label: 'Trading Name',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'contact_forename',
                        label: 'First Name',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'contact_surname',
                        label: 'Last Name',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'contact_main_number',
                        label: 'Main Phone',
                        type: 'phone',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'contact_mobile_number',
                        label: 'Mobile Phone',
                        type: 'phone',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'contact_email',
                        label: 'Email',
                        type: 'email',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'date_called',
                        label: 'Date Called',
                        type: 'date',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'call_back_needed',
                        label: 'Call back needed',
                        type: 'checkbox',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'callback_date',
                        label: 'Callback Date',
                        type: 'date',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'garage_record_id',
                        label: 'VTS Garage Record',
                        type: 'record',
                        section: 1,
                        column: 2
                    },
                    {
                        field: [
                            {name: 'Address1', fieldName: 'vts_address_line_1'},
                            {name: 'Address2', fieldName :'vts_address_line_2'},
                            {name: 'Address3', fieldName: 'vts_address_line_3'},
                            {name: 'City',     fieldName: 'vts_address_line_4'},
                            {name: 'Postcode', fieldName: 'vts_postcode'}],
                        label: 'Address',
                        type: 'googleMaps',
                        section: 1,
                        column: 3
                    }
                ]
            },
            "Invoice Contact": {
                meta:  {
                    columns: 2,
                    name: 'invoice-Contact',
                    containerElement: 'data-launch-testing-stations-invoiceContact'
                },
                fields: [
                    {
                        field: 'invoice_contact',
                        label: 'Invoice Contact',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'invoice_contact_number',
                        label: 'Invoice Contact No',
                        type: 'phone',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'invoice_contact_email',
                        label: 'Invoice Contact Email',
                        type: 'email',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'invoice_contact_notes',
                        label: 'Invoice Contact Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'callback_notes',
                        label: 'Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'cpd_needed_checkb',
                        label: 'CPD Needed',
                        type: 'checkbox',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'cpd_notes',
                        label: 'CPD Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'level_3_required_checkb',
                        label: 'Level 3 Required',
                        type: 'checkbox',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'level_3_required',
                        label: 'Level 3 Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 2
                    }
                ]
            },
            Address: {
                meta: {
                    columns: 1,
                    name: 'address',
                    containerElement: 'data-launch-testing-stations-address'
                },
                fields: [
                    {
                        field: 'vts_address_line_1',
                        label: 'Address 1',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'vts_address_line_2',
                        label: 'Address 2',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'vts_address_line_3',
                        label: 'Address 3',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'vts_address_line_4',
                        label: 'City',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'vts_postcode',
                        label: 'Postcode',
                        type: 'text',
                        section: 1,
                        column: 1
                    }
                ]
            },
            "Authorised Examiner": {
                meta: {
                    columns: 1,
                    name: 'aedm',
                    containerElement: 'data-launch-testing-stations-aedm'
                },
                fields: [
                    {
                        field: 'aed_name',
                        label: 'AEDM Name',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'password',
                        label: 'AEDM Password',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'aed_email',
                        label: 'AEDM Email',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'aed_phone_no',
                        label: 'AEDM Phone No',
                        type: 'text',
                        section: 1,
                        column: 1
                    }
                ]
            },
            "Testing Classes": {
                meta: {
                    columns: 3,
                    name: 'testing-classes',
                    containerElement: 'data-launch-testing-stations-testing-classes'
                },
                fields: [
                    {
                        field: 'mot_testing_class_4_7_req_checkb',
                        label: 'MOT Testing Class 4 & 7 Required',
                        type: 'checkbox',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'mot_testing_class_4_7_required',
                        label: 'MOT Testing Class 4 & 7 Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'mot_testing_class_1_2_req_checkb',
                        label: 'MOT Testing Class 1 & 2 Required',
                        type: 'checkbox',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'mot_testing_class_1_2_required',
                        label: 'MOT Testing Class 1 & 2 Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'mot_class_3_required_checkb',
                        label: 'MOT Testing Class 3 Required',
                        type: 'checkbox',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'mot_class_3_required',
                        label: 'MOT Testing Class 3 Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'mot_class_5_required_checkb',
                        label: 'MOT Testing Class 5 Required',
                        type: 'checkbox',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'mot_class_5_required',
                        label: 'MOT Testing Class 5 Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 3
                    },
                    {
                        field: 'mot_test_centre_management_req_checkb',
                        label: 'MOT Test Centre Management Required',
                        type: 'checkbox',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'mot_test_centre_management_required',
                        label: 'MOT Test Centre Management Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 3
                    },
                    {
                        field: 'vts_pro_solution_required_checkb',
                        label: 'VTS Pro Solution Required',
                        type: 'checkbox',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'vts_pro_solution_required',
                        label: 'VTS Pro Solution Notes',
                        type: 'multi-text',
                        section: 1,
                        column: 3
                    }
                ]
            }
        }
    }
    buildFormMenu () {        
        let headers = this.fieldObjectMeta()
        let html = ''
        let fistIteration = true
        for (const key in headers) {
            if (fistIteration) {
                html += `<li class="nav-item data-launch-tabs-parent-li-testing-station modern-nav-item active" id="testing_station_parent_li_${headers[key].meta.name}">
                            <a class="nav-link data-launch-tabs-clickable-testing-station modern-nav-link active" data-launch-menu-item="${headers[key].meta.name}" href="#">${key}</a>
                        </li>` 
                fistIteration = false
            }
            else {
            html +=     `<li class="nav-item data-launch-tabs-parent-li-testing-station modern-nav-item" id="testing_station_parent_li_${headers[key].meta.name}">
                            <a class="nav-link data-launch-tabs-clickable-testing-station modern-nav-link" data-launch-menu-item="${headers[key].meta.name}" href="#">${key}</a>
                        </li>`   
            }                   
        }
        return html
    }
    buildFormSections (rec, html) {
        let fieldDataObj = this.fieldObjectMeta()        
        let firstIteration = true
        // console.log('rec is ', rec)
        if (rec !== 'NEW FORM') {
            for (const key in fieldDataObj) {
                if (firstIteration) {
                    html += `<div class='data-launch-testing-stations-screen row active' id='data-launch-testing-stations-${fieldDataObj[key].meta.name}'>`
                    firstIteration = false
                }
                else {
                    html += `<div class='data-launch-testing-stations-screen row' id='data-launch-testing-stations-${fieldDataObj[key].meta.name}'>`
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
                                          <input id="${fieldDataObj[key].fields[t].field}_val" type='text' data-launch-field="${fieldDataObj[key].fields[t].field}" value="${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'spacer') {
                                html += `<div style='height: 20px' class='data-launch-empty-spacer'></div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'phone') {
                                html += `<div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val" type='phone' value="${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field]}" data-launch-field="${fieldDataObj[key].fields[t].field}" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'email') {
                                html += ` <div class='data-launch-input-field-container'>
                                             <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                             <input id="${fieldDataObj[key].fields[t].field}_val" type='email' value="${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field]}" data-launch-field="${fieldDataObj[key].fields[t].field}" class='data-launch-input-field data-launch-field-editable'>
                                             <a style='position: relative; top: -34%; left: 95%;' href="mailto:${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field]}"><i class="bi bi-envelope"></i></a>
                                          </div>`

                                          
                            }
                            else if (fieldDataObj[key].fields[t].type === 'date') {
                                html += ` <div class='data-launch-input-field-container'>
                                             <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                             <input id="${fieldDataObj[key].fields[t].field}_val" type='date' value="${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field]}" data-launch-field="${fieldDataObj[key].fields[t].field}" class='data-launch-input-field data-launch-field-editable'>
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
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val" type='checkbox' class='data-launch-input-field-checkbox data-launch-field-editable' data-launch-field="${fieldDataObj[key].fields[t].field}" ${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field] === 1 ? "checked" : ''}>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'record') {
                                // console.log('rec[fieldDataObj[key].fields[t].field]', rec[fieldDataObj[key].fields[t].field])
                                html += `<div class='data-launch-input-field-container'>
                                          <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>`
                                if (rec[fieldDataObj[key].fields[t].field] === null || rec[fieldDataObj[key].fields[t].field] === 0 || typeof rec[fieldDataObj[key].fields[t].field] === undefined || typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ) {
                                    html += `<button type="button" id="data-launch-promote-to-garage" class="btn btn-outline-primary data-launch-promote-to-garage" data-launch-rec="${rec.id}">Promote to Garage Record</button>
                                             <span class="data-launch-newly-promoted-firework-destination" id="newlyPromoted"><text style='cursor: pointer; display: none; color: blue; font-weight: bold;' class='data-launch-garage-record-click data-launch-change-page' data-launch-menu-item="garage" id="garageRecordId" data-launch-id=''></text>
                                    `
                                }
                                else {
                                    html += `<text style='cursor: pointer; color: blue; font-weight: bold;' class='data-launch-garage-record-click data-launch-change-page' data-launch-menu-item="garage" id="garageRecordId" data-launch-id='${rec[fieldDataObj[key].fields[t].field]}'>Garage Record - ${rec[fieldDataObj[key].fields[t].field]}</text>`
                                }
                                html += `</div>`
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
                                            <iframe width="100%" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=${googleMapsString}+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/">gps devices</a></iframe></div>            
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
                    html += `<div class='data-launch-testing-stations-screen row active' id='data-launch-testing-stations-${fieldDataObj[key].meta.name}'>`
                    firstIteration = false
                }
                else {
                    html += `<div class='data-launch-testing-stations-screen row' id='data-launch-testing-stations-${fieldDataObj[key].meta.name}'>`
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
                                          <input id="${fieldDataObj[key].fields[t].field}_val" type='text' data-launch-field="${fieldDataObj[key].fields[t].field}" value="" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'spacer') {
                                html += `<div style='height: 20px' class='data-launch-empty-spacer'></div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'phone') {
                                html += `<div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val" type='phone' value="" data-launch-field="${fieldDataObj[key].fields[t].field}" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'email') {
                                html += ` <div class='data-launch-input-field-container'>
                                             <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                             <input id="${fieldDataObj[key].fields[t].field}_val" type='email' value="" data-launch-field="${fieldDataObj[key].fields[t].field}" class='data-launch-input-field data-launch-field-editable'>
                                          </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'date') {
                                html += ` <div class='data-launch-input-field-container'>
                                             <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                             <input id="${fieldDataObj[key].fields[t].field}_val" type='date' value="" data-launch-field="${fieldDataObj[key].fields[t].field}" class='data-launch-input-field data-launch-field-editable'>
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
                                            <label class="data-launch-field-labels data-launch-testing-station-checkbox-label">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val" type='checkbox' class='data-launch-input-field-checkbox data-launch-field-editable data-launch-testing-station-checkbox-el' data-launch-field="${fieldDataObj[key].fields[t].field}" checked="">
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
    openFormLaunchPad (bool, id) {
        this.id = id
        let rec;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id === parseInt(id)) {
                rec = this.data[i]
            }        
        }
        this.openForm(true, rec)
    }

    triggerFirework(targetId) {
        const targetElement = document.getElementById(targetId);
        this.container = document.getElementById("animation-container");
        if (!targetElement) {
            console.error(`Element with ID "${targetId}" not found.`);
            return;
        }

        // Get target element's position
        const targetRect = targetElement.getBoundingClientRect();
        const targetX = targetRect.left + targetRect.width / 2; // Centre of the target
        const targetY = targetRect.top; // Top of the target

        // Create firework spiral with SVG content
        const firework = document.createElement("div");
        firework.style.position = "absolute";
        firework.style.left = "50%";
        firework.style.bottom = "0";
        firework.style.transform = "translateX(-50%)";
        firework.style.width = "50px"; // Adjust the size as needed
        firework.style.height = "50px"; // Adjust the size as needed
        firework.style.display = "flex";
        firework.style.alignItems = "center";
        firework.style.justifyContent = "center";
        firework.style.transform = "rotate(180deg)";

        // Embed SVG rocket inside the firework div
        firework.innerHTML = `<svg id="rocket" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(180deg)" width="240" height="240" fill="currentColor" class="bi bi-rocket" viewBox="0 0 16 16">
                                <path d="M8 8c.828 0 1.5-.895 1.5-2S8.828 4 8 4s-1.5.895-1.5 2S7.172 8 8 8"/>
                                <path d="M11.953 8.81c-.195-3.388-.968-5.507-1.777-6.819C9.707 1.233 9.23.751 8.857.454a3.5 3.5 0 0 0-.463-.315A2 2 0 0 0 8.25.064.55.55 0 0 0 8 0a.55.55 0 0 0-.266.073 2 2 0 0 0-.142.08 4 4 0 0 0-.459.33c-.37.308-.844.803-1.31 1.57-.805 1.322-1.577 3.433-1.774 6.756l-1.497 1.826-.004.005A2.5 2.5 0 0 0 2 12.202V15.5a.5.5 0 0 0 .9.3l1.125-1.5c.166-.222.42-.4.752-.57.214-.108.414-.192.625-.281l.198-.084c.7.428 1.55.635 2.4.635s1.7-.207 2.4-.635q.1.044.196.083c.213.09.413.174.627.282.332.17.586.348.752.57l1.125 1.5a.5.5 0 0 0 .9-.3v-3.298a2.5 2.5 0 0 0-.548-1.562zM12 10.445v.055c0 .866-.284 1.585-.75 2.14.146.064.292.13.425.199.39.197.8.46 1.1.86L13 14v-1.798a1.5 1.5 0 0 0-.327-.935zM4.75 12.64C4.284 12.085 4 11.366 4 10.5v-.054l-.673.82a1.5 1.5 0 0 0-.327.936V14l.225-.3c.3-.4.71-.664 1.1-.861.133-.068.279-.135.425-.199M8.009 1.073q.096.06.226.163c.284.226.683.621 1.09 1.28C10.137 3.836 11 6.237 11 10.5c0 .858-.374 1.48-.943 1.893C9.517 12.786 8.781 13 8 13s-1.517-.214-2.057-.607C5.373 11.979 5 11.358 5 10.5c0-4.182.86-6.586 1.677-7.928.409-.67.81-1.082 1.096-1.32q.136-.113.236-.18Z"/>
                                <path d="M9.479 14.361c-.48.093-.98.139-1.479.139s-.999-.046-1.479-.139L7.6 15.8a.5.5 0 0 0 .8 0z"/>
                            </svg>`
        
        this.container.appendChild(firework);

        // Animation variables
        const duration = 5000; // Total spiral animation duration
        const spiralLoops = 5; // Number of loops
        const totalFrames = 50; // Frames for the animation

        // Calculate the distance and angle
        const startX = window.innerWidth / 2; // Start at the centre of the screen
        const startY = window.innerHeight; // Start from the bottom
        const deltaX = targetX - startX;
        const deltaY = targetY - startY;

        // Keyframe generation for spiral motion
        const keyframes = [];
        for (let i = 0; i <= totalFrames; i++) {
            const progress = i / totalFrames; // Animation progress (0 to 1)
            const angle = progress * spiralLoops * Math.PI * 2; // Spiral angle
            const radius = (1 - progress) * 200; // Shrink spiral as it approaches the target

            const x = startX + deltaX * progress + Math.cos(angle) * radius;
            const y = startY + deltaY * progress + Math.sin(angle) * radius;

            // Calculate rotation of the rocket to match the spiral trajectory
            const rotation = angle * (180 / Math.PI); // Convert radian to degree
            keyframes.push({
                left: `${x}px`,
                top: `${y}px`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${1 - progress * 0.5})`,
                opacity: progress < 0.95 ? 1 : 0.8,
            });
        }
        

        // Animate the firework to spiral downward
        const spiralAnimation = firework.animate(keyframes, {
            duration: duration,
            // easing: "ease-out",
            iterations: 1
        });
        spiralAnimation.onfinish = () => {
            firework.remove();
            this.createExplosion(targetX, targetY);
        };
    }

    // Create the explosion effect
    createExplosion(x, y) {
        const particleCount = 550; // Number of particles
        const explosionDuration = 3500;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("div");
            particle.className = "particle";
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            this.container.appendChild(particle);

            const angle = Math.random() * Math.PI * 5; // Random direction
            const distance = Math.random() * 120 + 50; // Random spread
            const particleX = Math.cos(angle) * distance;
            const particleY = Math.sin(angle) * distance;

            particle.animate(
                [
                    {
                        transform: `translate(0, 0)`,
                        opacity: 1,
                    },
                    {
                        transform: `translate(${particleX}px, ${particleY}px)`,
                        opacity: 0,
                    },
                ],
                {
                    duration: explosionDuration,
                    easing: "ease-out",
                }
            ).onfinish = () => particle.remove();
        }
    }
//     triggerFirework(targetId) {
//         const container = document.getElementById("animation-container");
//         const targetElement = document.getElementById(targetId);
    
//         if (!targetElement) {
//             console.error(`Element with ID "${targetId}" not found.`);
//             return;
//         }
    
//         // Get target element's position
//         const targetRect = targetElement.getBoundingClientRect();
//         const targetX = targetRect.left + targetRect.width / 2; // Centre of the target
//         const targetY = targetRect.top; // Top of the target
    
//         // Create firework spiral
//         const firework = document.createElement("div");
//         firework.style.position = "absolute";
//         firework.style.left = "50%";
//         firework.style.bottom = "0";
//         firework.style.transform = "translateX(-50%)";
//         firework.style.width = "50px";
//         firework.style.height = "50px";
//         firework.style.borderRadius = "50%";
//         firework.style.background = "radial-gradient(circle, #ff0077, #ff7700, #ffd700)";
//         firework.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" fill="currentColor" class="bi bi-rocket" viewBox="0 0 16 16">
//   <path d="M8 8c.828 0 1.5-.895 1.5-2S8.828 4 8 4s-1.5.895-1.5 2S7.172 8 8 8"/>
//   <path d="M11.953 8.81c-.195-3.388-.968-5.507-1.777-6.819C9.707 1.233 9.23.751 8.857.454a3.5 3.5 0 0 0-.463-.315A2 2 0 0 0 8.25.064.55.55 0 0 0 8 0a.55.55 0 0 0-.266.073 2 2 0 0 0-.142.08 4 4 0 0 0-.459.33c-.37.308-.844.803-1.31 1.57-.805 1.322-1.577 3.433-1.774 6.756l-1.497 1.826-.004.005A2.5 2.5 0 0 0 2 12.202V15.5a.5.5 0 0 0 .9.3l1.125-1.5c.166-.222.42-.4.752-.57.214-.108.414-.192.625-.281l.198-.084c.7.428 1.55.635 2.4.635s1.7-.207 2.4-.635q.1.044.196.083c.213.09.413.174.627.282.332.17.586.348.752.57l1.125 1.5a.5.5 0 0 0 .9-.3v-3.298a2.5 2.5 0 0 0-.548-1.562zM12 10.445v.055c0 .866-.284 1.585-.75 2.14.146.064.292.13.425.199.39.197.8.46 1.1.86L13 14v-1.798a1.5 1.5 0 0 0-.327-.935zM4.75 12.64C4.284 12.085 4 11.366 4 10.5v-.054l-.673.82a1.5 1.5 0 0 0-.327.936V14l.225-.3c.3-.4.71-.664 1.1-.861.133-.068.279-.135.425-.199M8.009 1.073q.096.06.226.163c.284.226.683.621 1.09 1.28C10.137 3.836 11 6.237 11 10.5c0 .858-.374 1.48-.943 1.893C9.517 12.786 8.781 13 8 13s-1.517-.214-2.057-.607C5.373 11.979 5 11.358 5 10.5c0-4.182.86-6.586 1.677-7.928.409-.67.81-1.082 1.096-1.32q.136-.113.236-.18Z"/>
//   <path d="M9.479 14.361c-.48.093-.98.139-1.479.139s-.999-.046-1.479-.139L7.6 15.8a.5.5 0 0 0 .8 0z"/>
// </svg>`
//         container.appendChild(firework);
    
//         // Animation variables
//         const duration = 3000; // Total spiral animation duration
//         const spiralLoops = 6; // Number of loops
//         const totalFrames = 140; // Frames for the animation
    
//         // Calculate the distance and angle
//         const startX = window.innerWidth / 2; // Start at the centre of the screen
//         const startY = window.innerHeight; // Start from the bottom
//         const deltaX = targetX - startX;
//         const deltaY = targetY - startY;
    
//         // Keyframe generation for spiral motion
//         const keyframes = [];
//         for (let i = 0; i <= totalFrames; i++) {
//             const progress = i / totalFrames; // Animation progress (0 to 1)
//             const angle = progress * spiralLoops * Math.PI * 2; // Spiral angle
//             const radius = (1 - progress) * 200; // Shrink spiral as it approaches the target
    
//             const x = startX + deltaX * progress + Math.cos(angle) * radius;
//             const y = startY + deltaY * progress + Math.sin(angle) * radius;
    
//             keyframes.push({
//                 left: `${x}px`,
//                 top: `${y}px`,
//                 transform: `translate(-50%, -50%) scale(${1 - progress * 0.5})`,
//                 opacity: progress < 0.95 ? 1 : 0.8,
//             });
//         }
    
//         // Animate the firework to spiral downward
//         const spiralAnimation = firework.animate(keyframes, {
//             duration: duration,
//             easing: "ease-out",
//             iterations: 1,
//         });
    
//         spiralAnimation.onfinish = () => {
//             firework.remove();
//             this.createExplosion(targetX, targetY);  // Use 'this' to call the explosion method within the class
//         };
//     }

//     // Create the explosion effect
//     createExplosion(x, y) {
//         const particleCount = 500; // Number of particles
//         const explosionDuration = 1800;
//         const container = document.getElementById("animation-container");

//         for (let i = 0; i < particleCount; i++) {
//             const particle = document.createElement("div");
//             particle.className = "particle";
//             particle.style.left = `${x}px`;
//             particle.style.top = `${y}px`;
//             container.appendChild(particle);

//             const angle = Math.random() * Math.PI * 2; // Random direction
//             const distance = Math.random() * 100 + 50; // Random spread
//             const particleX = Math.cos(angle) * distance;
//             const particleY = Math.sin(angle) * distance;

//             particle.animate(
//                 [
//                     {
//                         transform: "translate(0, 0)",
//                         opacity: 1,
//                     },
//                     {
//                         transform: `translate(${particleX}px, ${particleY}px)`,
//                         opacity: 0,
//                     },
//                 ],
//                 {
//                     duration: explosionDuration,
//                     easing: "ease-out",
//                 }
//             ).onfinish = () => particle.remove();
//         }
//     }
      
      
      
      
    openForm = (bool, rec) => {
        currentPage = 'Testing Station'
        let html = ''
        document.getElementById('data-launch-side-bar').classList.remove('data-launch-activate-menu')
        if (rec) {
            this.newRecord = false
            this.recordId = rec.id
            this.id = rec.id
            // <div style='display: none' class='data-launch-testing-station-promote-garage-confirmation-box' id="data-launch-testing-station-promote-garage-confirmation-box">
            //                             <h4 class='data-launch-testing-station-promote-garage-confirmation-box-header'> Are you sure you want to promote Garage ${rec.trading_name} (${rec.id}) ?</h4>
            //                             <button class='data-launch-promote-confirm'>Confirm</button>
            //                             <button class='data-launch-promote-cancel'>Cancel</button>
            //                     </div>
            // <i class="bi bi-plus data-launch-nav-menu-plus-icon" id="data-launch-nav-menu-plus-icon"></i>  
            html = `
            <div id="testingStationSidebar" class="sleek-sidebar">
                <nav class="nav-links" style="overflow-y: scroll;height: 91vh;">
                    <button class="data-launch-testing-station-menu-toggle-trigger data-launch-garage-side-menu-window-close-button">X</button>
                    ${this.buildFormMenu()}
                </nav>
            </div>

            <div id="data-launch-testing-station-menu-toggle" class="sidebar-toggle data-launch-testing-station-menu-toggle data-launch-testing-station-menu-toggle-trigger">
                <i class="bi bi-list data-launch-testing-station-menu-toggle-trigger"></i>
            </div>

            <div id="data-launch-override-dupli-vts-modal" class="data-launch-modal-dupli-warning" style="display: none;">
                <div class="data-launch-modal-dupli-warning__box">
                    <h3 class="data-launch-modal-dupli-warning__title">
                    ! Duplicate VTS Site Number Detected !
                    </h3>
                    <p class="data-launch-modal-dupli-warning__message">
                    A record with this VTS Site Number already exists. Do you want to override and save anyway?
                    </p>
                    <div class="data-launch-modal-dupli-warning__actions">
                    <button id="data-launch-dupli-vts-confirm-yes" class="data-launch-btn-dupli-warning-confirm">Yes, Save Anyway</button>
                    <button id="data-launch-dupli-vts-confirm-no" class="data-launch-btn-dupli-warning-cancel">No, Cancel</button><br><br>
                    <button id="data-launch-dupli-vts-cancel-return-to-list" class="data-launch-btn-dupli-warning-cancel-return-to-list">Cancel Changes and Return to List</button>
                    </div>
                </div>
            </div>
            <div class="data-launch-crud-security-alert" id="data-launch-crud-alert-box-testing-station">
                <div class="data-launch-crud-security-alert__icon" id="data-launch-crud-alert-icon-testing-station"></div>
                <div class="data-launch-crud-security-alert__message" id="data-launch-crud-alert-message-testing-station"></div>
            </div>
            <div id="data-launch-saved-record-banner" class="data-launch-saved-record-banner-alert">Record Saved Successfully</div>            
            <div class='container-fluid'>
                            <div class='row'>
                                <div style='display: none' class='data-launch-confirmation-box-inject' id='data-launch-confirmation-box-inject'></div>
                                <div style='display: none' class="data-launch-testing-station-promote-garage-confirmation-box" id="data-launch-testing-station-promote-garage-confirmation-box">
                                    <div class="data-launch-testing-station-promote-garage-confirmation-box-header">
                                        <p>
                                            Are you sure you want to promote Testing Station - <strong>${rec.trading_name} (${rec.id})</strong> to a full Garage record?
                                        </p>
                                        <div class="data-launch-testing-station-promote-garage-confirmation-box-actions">
                                            <button class="data-launch-testing-station-promote-garage-confirmation-box-approve-btn data-launch-promote-confirm">
                                            Confirm
                                            </button>
                                            <button class="data-launch-testing-station-promote-garage-confirmation-box-cancel-btn data-launch-promote-cancel">
                                            Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div style="display: none" id="animation-container"></div>


                                <button type="button" id="data-launch-testing-station-save" class="btn btn-outline-primary data-launch-save-record">Save</button>`
                                if (user_FULL_USER !== '0') {
                                    html += `<button type="button" id="data-launch-testing-station-save-close" class="btn btn-outline-primary data-launch-save-close-record">Save & Close</button>`
                                    html += `<button type="button" id="data-launch-testing-station-back-to-list-view" class="btn btn-outline-primary btn-primary data-launch-record-back-to-list-view">< < Back To List</button>`
                                }
                                html +=
                                `<div class='data-launch-record-header modern-record-header'>
                                    <h3 class="modern-record-title">${rec.trading_name} - (${rec.id})</h3>
                                    <h3 class="modern-record-subtitle" id="data-launch-testion-station-${this.id}-what-tab">Summary</h3>                    
                                </div>
                                <div class='data-launch-tabs-container' id="data-launch-testing-station-tabs-container">
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
            this.id = null
            this.newRecord = true 
            // <i class="bi bi-plus data-launch-nav-menu-plus-icon" id="data-launch-nav-menu-plus-icon"></i>
            html = `
            <div class="data-launch-crud-security-alert" id="data-launch-crud-alert-box-testing-station">
                <div class="data-launch-crud-security-alert__icon" id="data-launch-crud-alert-icon-testing-station"></div>
                <div class="data-launch-crud-security-alert__message" id="data-launch-crud-alert-message-testing-station"></div>
            </div>
            <div id="data-launch-override-dupli-vts-modal-no-id" class="data-launch-modal-dupli-warning" style="display: none;">
                <div class="data-launch-modal-dupli-warning__box">
                    <h3 class="data-launch-modal-dupli-warning__title">
                    ! Duplicate VTS Site Number Detected !
                    </h3>
                    <p class="data-launch-modal-dupli-warning__message">
                    A record with this VTS Site Number already exists.
                    </p>
                     <p class="data-launch-modal-dupli-warning__message">
                    You cannot save a new record with a matching VTS Site Number.
                    </p>                    
                    <div class="data-launch-modal-dupli-warning__actions">
                    <button id="data-launch-dupli-vts-confirm-cancel-return-to-list-no-id" class="data-launch-btn-dupli-warning-cancel-return-to-list-no-id">Return to List</button>
                    <button id="data-launch-dupli-vts-confirm-cancel-no-id" class="data-launch-btn-dupli-warning-cancel-no-id">Cancel</button>
                    </div>
                </div>
            </div>
              <div id="data-launch-override-dupli-vts-modal-return-to-list" class="data-launch-modal-dupli-warning" style="display: none;">
                <div class="data-launch-modal-dupli-warning__box">
                    <h3 class="data-launch-modal-dupli-warning__title">
                    ! WARNING !
                    </h3>
                    <p class="data-launch-modal-dupli-warning__message">
                    A record cannot be saved without a VTS Site Number and Trading Name
                    </p>                 
                    <div class="data-launch-modal-dupli-warning__actions">
                    <button id="data-launch-dupli-vts-confirm-cancel-return-to-list-no-vts-or-trading-name" class="data-launch-dupli-vts-confirm-cancel-return-to-list-no-vts-or-trading-name">Return to List</button>
                    <button id="data-launch-dupli-vts-confirm-cancel-no-vts-or-trading-name" class="data-launch-dupli-vts-confirm-cancel-no-vts-or-trading-name">Cancel</button>
                    </div>
                </div>
            </div>
            
            <div id="data-launch-saved-record-banner" class="data-launch-saved-record-banner-alert">Record Saved Successfully</div>         
            <div class='container-fluid'>
                            <div class='row'>
                                <div style='display: none' class='data-launch-confirmation-box-inject' id='data-launch-confirmation-box-inject'></div>
                                <button type="button" id="data-launch-testing-station-save" class="btn btn-outline-primary data-launch-save-record">Save</button>
                                <button type="button" id="data-launch-testing-station-save-close" class="btn btn-outline-primary data-launch-save-close-record">Save & Close</button>
                                <button type="button" id="data-launch-testing-station-back-to-list-view" class="btn btn-outline-primary btn-primary data-launch-record-back-to-list-view">< < Back To List</button>
                                <div class='data-launch-record-header'>
                                    <span style='display:none' id='currentRecordID'></span>                    
                                </div>
                                <div class='data-launch-tabs-container' id="data-launch-testing-station-tabs-container">
                                    <nav class="navbar navbar-expand-lg navbar-light modern-navbar">
                                        <div class="container-fluid data-launch-form-tabs-container modern-navbar-container">
                                            <div class="data-launch-form-tabs-container-row">
                                                <button class="navbar-toggler modern-navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                                    <span class="navbar-toggler-icon"></span>
                                                </button>
                                                <div class="collapse navbar-collapse" id="navbarNav">
                                                    <ul class="navbar-nav modern-navbar-nav">
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
        document.getElementById('testingStationPage').innerHTML = html

        // let testingStationMenuBarHeight = document.getElementById('data-launch-testing-station-tabs-container').offsetHeight
        // let headers = this.fieldObjectMeta()
        // // // console.log('headers LIAM', headers)
        // for (const key in headers) {
        //     document.getElementById(headers[key].meta.containerElement).style.top = testingStationMenuBarHeight + 8 + 'px'
        // }
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
