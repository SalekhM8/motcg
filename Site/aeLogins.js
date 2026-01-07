console.log('testing station file')
class AELogins {
    constructor(id) {
        console.log('hit this section')
        this.data = aeLoginsData
        this.garageData = garageData
        console.log('this. data - TESTERS ', this.data)
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
    renderHTMLHeader () {
        let html = `
        <div class="button-container">
            <button class="modern-button data-launch-add-new-special-notice-record">
                <span class="plus-icon">+</span>
                New
            </button>
        </div>
        <div id="aeLoginDelModal" class="del-confirmation-modal">
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
        <div id="data-launch-mot-special-notice-delete-item-dialogue-box-overlay" class="data-launch-mot-special-notice-delete-item-dialogue-box-overlay">
            <div class="data-launch-mot-special-notice-delete-item-dialogue-box">
                <h2 class="data-launch-mot-special-notice-delete-item-dialogue-box-title">Warning!</h2>
                <p class="data-launch-mot-special-notice-delete-item-dialogue-box-message">
                Are you sure you want to delete this record? This action cannot be undone.
                </p>
                <div class="data-launch-mot-special-notice-delete-item-dialogue-box-buttons">
                <button data-id="" class="data-launch-mot-special-notice-delete-item-dialogue-box-confirm">Delete</button>
                <button class="data-launch-mot-special-notice-delete-item-dialogue-box-cancel">Cancel</button>
                </div>
            </div>
        </div>
        <div class="data-launch-crud-security-alert" id="data-launch-crud-alert-box-special-notice">
            <div class="data-launch-crud-security-alert__icon" id="data-launch-crud-alert-icon-special-notice"></div>
            <div class="data-launch-crud-security-alert__message" id="data-launch-crud-alert-message-special-notice"></div>
        </div>
        <div class="container" style="height: 92vh; overflow-y: auto;">
            <table class="responsive-table">
                <thead class="responsive-table__head">
                    <tr class="responsive-table__row data-launch-ae-logins-tr">
                        <th class="responsive-table__head__title responsive-table__head__title--name">
                            <span class='data-launch-header-label'>Email</span>
                        </th>
                        <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                            <span class='data-launch-header-label'>First Name</span>
                        </th>                        
                        <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                            <span class='data-launch-header-label'>Last Name</span>
                        </th>                      
                    </tr>                    
                </thead>
                <tbody class="responsive-table__body" id="data-launch-ae-logins-records-table-body">
                `
        this.renderHTMLData(html)
    }
    renderHTMLData(html) {
        console.log('html is ', html)
        console.log('this.data is ', this.data)
        let data = this.data
        let exportRow = 0
        for (let i = 0; i < data.length; i++) {
            html += `
            <tr class="responsive-table__row export-row data-launch-ae-logins-tr" data-export-row="${exportRow}" id="data_launch_ae_logins_row_${data[i].id}" data-export-header="id" data-export-val="${data[i].id}" data-id="${data[i].id}">
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-ae-logins-view-record-click" data-export-row="${exportRow}" data-export-header="username" data-export-val="${data[i].username}" scope="row">${data[i].username}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-ae-logins-view-record-click" data-export-row="${exportRow}" data-export-header="first_name"  data-export-val="${data[i].first_name}" scope="row">${data[i].first_name}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-ae-logins-view-record-click" data-export-row="${exportRow}" data-export-header="last_name"   data-export-val="${data[i].last_name}" scope="row">${data[i].last_name}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types"><i class="bi bi-trash data-launch-subgrid-delete-ae-login-item" data-ae-login-id='${data[i].id}' data-id='${data[i].id}'></i></td>  
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
            </div>`
        document.getElementById('aeLoginsPage').innerHTML = html
        this.addListeners()
    }
    // navigateToGarageRecord (ev, id) {
    //     changePage(ev, id)  
    // }
    deleteRecordConfirmationBox () {
        document.getElementById('data-launch-mot-special-notice-delete-item-dialogue-box-overlay').classList.add('active')
    }   
    hideDeleteRecordConfirmationBox () {
        document.getElementById('data-launch-mot-special-notice-delete-item-dialogue-box-overlay').classList.remove('active')
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
    showCRUDAlert(message, type) {
        const alertBox = document.getElementById("data-launch-crud-alert-box-special-notice");
        const alertMessage = document.getElementById("data-launch-crud-alert-message-special-notice");
        const alertIcon = document.getElementById("data-launch-crud-alert-icon-special-notice");
    
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
            console.log('this is all being processed via the new secureAction function');    
            
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
    globalFilter(event) {
        const filter = event.target.value.toUpperCase();
        const garageEntries = document.querySelectorAll('#available-garages .data-launch-ae-garage-entry');

        garageEntries.forEach(entry => {
            const label = entry.querySelector('.data-launch-ae-garage-label');
            const text = label.textContent || label.innerText;

            if (text.toUpperCase().includes(filter)) {
                entry.style.display = '';
            } else {
                entry.style.display = 'none';
            }
        });
    }
    filterResetAll () {
        const garageEntries = document.querySelectorAll('#available-garages .data-launch-ae-garage-entry');
        garageEntries.forEach(entry => {
            entry.style.display = '';
        });
        const input = document.getElementById('data-launch-ae-garage-global-filter-input');
        if (input) {
            input.value = '';
        }
    }
    addListeners () {
        console.log('adding event listeners to special Notices class')
        document.getElementById('aeLoginsPage').addEventListener('dblclick', (event) => {
            const isGarage = event.target.classList.contains('data-launch-ae-garage-label');
            if (!isGarage) return;

            const parent = event.target.closest('.data-launch-ae-garage-entry');
            const box = parent.closest('#available-garages') ? 'available-garages' : 'selected-garages';
            const destination = box === 'available-garages' ? 'selected-garages' : 'available-garages';
            document.getElementById(destination).appendChild(parent);
        });
        
        document.getElementById('aeLoginsPage').addEventListener('input', (event) => {
            if (event.target.classList.contains('data-launch-garage-global-filter-input')) {
                this.globalFilter(event)
            }
        })
        document.getElementById('aeLoginsPage').addEventListener('click', (event) => {
            event.stopPropagation()
            console.log('here lets go whats going on ')
            if (event.target.classList.contains('data-launch-ae-logins-view-record-click')) {
                console.log('hope i get the right ae login record')
                let id = event.target.parentElement.dataset.id
                console.log('id of the ae login record is ', id)
                let rec;
                for (let i = 0; i < this.data.length; i++) {
                    if (this.data[i].id === parseInt(id)) {
                        rec = this.data[i]
                    }        
                }
                this.openForm(true, rec)
            }
            else if (event.target.classList.contains('data-launch-table-reset-all-garage-filters')) {
                this.filterResetAll()               
            }
            else if (event.target.classList.contains('data-launch-send-ae-user-login-details-email')) {
                let username = document.getElementById('username_val_aeLogins').value;
                let firstname = document.getElementById('first_name_val_aeLogins').value;
                let lastname = document.getElementById('last_name_val_aeLogins').value;
                this.sendLoginDetailsToEmail(firstname, lastname, username)
            }
            else if (event.target.classList.contains('data-launch-ae-garages-move-right')) {
                const checked = Array.from(document.querySelectorAll('#available-garages .data-launch-ae-garage-checkbox:checked'));
                for (let box of checked) {
                    const item = box.closest('.data-launch-ae-garage-entry');
                    document.getElementById('selected-garages').appendChild(item);
                    box.checked = false;
                }
            }
            else if (event.target.classList.contains('data-launch-ae-garages-move-left')) {
                const checked = Array.from(document.querySelectorAll('#selected-garages .data-launch-ae-garage-checkbox:checked'));
                for (let box of checked) {
                    const item = box.closest('.data-launch-ae-garage-entry');
                    document.getElementById('available-garages').appendChild(item);
                    box.checked = false;
                }
            }
            else if (event.target.classList.contains('data-launch-save-close-record')) {
                console.log('save close record selected')
                this.saveAndClose()
            }
            else if (event.target.classList.contains('data-launch-save-record')) {
                console.log('save record selected')
                this.saveRecord()
            }
            else if (event.target.classList.contains('data-launch-add-new-special-notice-record')) {
                this.openForm(false)
            }
            else if (event.target.classList.contains('data-launch-subgrid-delete-ae-login-item')) {
                // this.idToDelete = event.target.attributes["data-special-notice-id"].value
                // this.deleteRecordConfirmationBox()
                let id = event.target.attributes["data-ae-login-id"].value;
                let delModal = document.getElementById('aeLoginDelModal');
                delModal.classList.add('active');
                document.getElementById('confirmDelete').setAttribute('data-id', id)
                document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_ae_logins')
                document.getElementById('confirmDelete').setAttribute('data-element-id', `data_launch_ae_login_row_${id}`)
            }
            else if (event.target.classList.contains('del-confirmation-modal__btn--confirm')) {
                let delModal = document.getElementById('aeLoginDelModal');
                delModal.classList.remove('active'); 
                let id = event.target.attributes["data-id"].value;
                let table = event.target.attributes["data-table"].value;
                let rowElemId = event.target.attributes["data-element-id"].value;
                this.secureAction('delete', table, parseInt(id)).then(
                    success => {
                        console.log('success', success)
                            document.getElementById(rowElemId).style.display = 'none'
                    },
                    err => {
                        console.log(err)
                    }
                )  
            }
            else if (event.target.classList.contains('del-confirmation-modal__btn--cancel')) {
                let delModal = document.getElementById('aeLoginDelModal');
                delModal.classList.remove('active'); 
            }

            else if (event.target.classList.contains('data-launch-mot-ae-login-delete-item-dialogue-box-cancel')) {
                this.hideDeleteRecordConfirmationBox()
            }
            else if (event.target.classList.contains('data-launch-mot-ae-login-delete-item-dialogue-box-confirm')) {
                this.hideDeleteRecordConfirmationBox()
                this.secureAction('delete','data_launch_ae_logins', parseInt(this.idToDelete), null).then(
                    success => {
                        console.log('success', success)
                        document.getElementById(`data_launch_ae_login_row_${this.idToDelete}`).style.display = 'none'
                    },
                    err => {
                        console.error(err)
                    }
                )
            }
            else if (event.target.classList.contains('data-launch-record-back-to-list-view')) {
                this.saveAndClose()
            }   

// data-launch-save-close-record
            
        })
        document.getElementById('aeLoginsPage').addEventListener('change', (event) => {
            // if (event.target.classList.contains('data-launch-filter-search') && event.target.value !== '') {
            //     let header = event.target.attributes["data-launch-header"].value
            //     let value = event.target.value
            //     this.filterApply(header,value)
            // }
         })
    }
    sendLoginDetailsToEmail (firstName = null, secondName = null, emailValue = null) {         
        var emailParams = {
            to_email: emailValue, // Replace with the recipient's email address
            from_name: 'support@vtspro.co.uk',
            first_name: firstName,
            last_name: secondName,
            ae_login: true
        }            
        // Send the email
        // service_ykm9x5e
        // 
        // hotmail connector
        // emailjs.send('service_dlqsqml', 'template_9q4c1yd', emailParams)
        //     .then(response => {
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
    showSuccessAlert () {
        document.getElementById('ae_successBox-sendingLoginEmail').classList.add('active')
        document.getElementById('aeUserSendLoginDetailsToEmail').style.display = 'none'
        setTimeout(() => {
            this.hideLoginSentSuccessAlert()
        }, 5000);
    }
    hideLoginSentSuccessAlert () {
        document.getElementById('ae_successBox-sendingLoginEmail').classList.remove('active')
        document.getElementById('aeUserSendLoginDetailsToEmail').style.display = 'block'
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
                <tr class="responsive-table__row data-launch-ae-logins-tr export-row" data-export-row="${exportRow}" id="data_launch_ae_login_row_${data[i].id}" data-export-header="id" data-export-val="${data[i].id}" data-id="${data[i].id}">
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-ae-logins-view-record-click" data-export-row="${exportRow}" data-export-header="username" data-export-val="${data[i].username}" scope="row">${data[i].username}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-ae-logins-view-record-click" data-export-row="${exportRow}" data-export-header="first_name"  data-export-val="${data[i].first_name}" scope="row">${data[i].first_name}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-ae-logins-view-record-click" data-export-row="${exportRow}" data-export-header="last_name"   data-export-val="${data[i].last_name}" scope="row">${data[i].last_name}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types"><i class="bi bi-trash data-launch-subgrid-delete-ae-login-item" data-special-notice-id='${data[i].id}' data-id='${data[i].id}'></i></td>  
                </tr>` 
                exportRow++           
            }
        }      
        return html
    }
    saveRecord () {
        this.saveDetailsAboutTheRecord(false)
    }
    showSavedBanner () {
        document.getElementById('data-launch-saved-record-banner-ae-logins').classList.add('active')
        setTimeout(() => {
            document.getElementById('data-launch-saved-record-banner-ae-logins').classList.remove('active')
        }, 4000);
    }
    saveAndClose () {
        // this effectively deletes the element, including all of the event listeners, and then creates a new copy with zero event listeners attached
        this.saveDetailsAboutTheRecord(true)
        const oldElement = document.getElementById('aeLoginsPage');
        const newElement = oldElement.cloneNode(true); // Cloning with all children and attributes
        oldElement.parentNode.replaceChild(newElement, oldElement);
    }
    saveDetailsAboutTheRecord (closeRecord) {
        let fieldObjectMeta = this.fieldObjectMeta()
        console.log('fieldObjectMeta', fieldObjectMeta)
        let fields = []
        for (const key in fieldObjectMeta) {
            for (let t = 0; t < fieldObjectMeta[key].fields.length; t++) {
                fields.push(fieldObjectMeta[key].fields[t])
            }
        }
        console.log('all the fields i need to check ', fields)
        console.log('this.newRecord', this.newRecord)
        let createRecordObject = {}
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].type === 'text' ||
                fields[i].type === 'email' ||
                fields[i].type === 'phone' ||
                fields[i].type === 'multi-text' ||
                fields[i].type === 'notes' ||
                fields[i].type === 'hyperlink' ||
                fields[i].type === 'date' ) {
                if (document.getElementById(`${fields[i].field}_val_aeLogins`).value) {
                    console.log('this text field contains data ', fields[i], document.getElementById(`${fields[i].field}_val_aeLogins`).value)
                    createRecordObject[fields[i].field] = document.getElementById(`${fields[i].field}_val_aeLogins`).value
                }
            }
            else if (fields[i].type === 'checkbox') {
                if (document.getElementById(`${fields[i].field}_val_aeLogins`).checked) {
                    console.log('this text field contains data ', fields[i], document.getElementById(`${fields[i].field}_val_aeLogins`).checked)
                    let val = document.getElementById(`${fields[i].field}_val_aeLogins`).checked
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
            createRecordObject.ae_login = 1
            createRecordObject.garage_details_read = 1
            createRecordObject.garage_details_update = 1
            createRecordObject.garage_details_delete  = 1
            createRecordObject.garage_users_create  = 1
            createRecordObject.garage_users_read  = 1
            createRecordObject.garage_users_update  = 1
            createRecordObject.garage_users_delete  = 1
            createRecordObject.qc_checkers_create  = 1
            createRecordObject.qc_checkers_read  = 1
            createRecordObject.qc_checkers_update  = 1
            createRecordObject.qc_checkers_delete  = 1
            createRecordObject.bookings_create  = 1
            createRecordObject.bookings_read  = 1
            createRecordObject.bookings_update  = 1
            createRecordObject.bookings_delete  = 1
            createRecordObject.testers_create  = 1
            createRecordObject.testers_read  = 1
            createRecordObject.testers_update  = 1
            createRecordObject.testers_delete  = 1
            createRecordObject.mot_equipment_create  = 1
            createRecordObject.mot_equipment_read  = 1
            createRecordObject.mot_equipment_update  = 1
            createRecordObject.mot_equipment_delete  = 1
            createRecordObject.mot_calibrations_create  = 1
            createRecordObject.mot_calibrations_read  = 1
            createRecordObject.mot_calibrations_update  = 1
            createRecordObject.mot_calibrations_delete  = 1
            createRecordObject.mot_site_audits_create  = 1
            createRecordObject.mot_site_audits_read  = 1
            createRecordObject.mot_site_audits_update  = 1
            createRecordObject.mot_site_audits_delete  = 1
            createRecordObject.defect_reports_create  = 1
            createRecordObject.defect_reports_read  = 1
            createRecordObject.defect_reports_update  = 1
            createRecordObject.defect_reports_delete  = 1
            createRecordObject.mot_bay_cleaning_log_create  = 1
            createRecordObject.mot_bay_cleaning_log_read  = 1
            createRecordObject.mot_bay_cleaning_log_update  = 1
            createRecordObject.mot_bay_cleaning_log_delete  = 1
            createRecordObject.qc_checkers_for_bikes_create  = 1
            createRecordObject.qc_checkers_for_bikes_read  = 1
            createRecordObject.qc_checkers_for_bikes_update  = 1
            createRecordObject.qc_checkers_for_bikes_delete  = 1
            createRecordObject.mot_reconciliations_create  = 1
            createRecordObject.mot_reconciliations_read  = 1
            createRecordObject.mot_reconciliations_update  = 1
            createRecordObject.mot_reconciliations_delete = 1
            createRecordObject.data_launch_bays_create = 1
            createRecordObject.data_launch_bays_read = 1
            createRecordObject.data_launch_bays_update = 1
            createRecordObject.tqi_create = 1
            createRecordObject.tqi_read = 1
            createRecordObject.data_launch_tester_records_create = 1
            createRecordObject.garage_reminders_delete = 1
            createRecord('data_launch_users', createRecordObject).then(res => {
                    console.log('CREATED NEW data_launch_users AE LOGIN RECORD IN DB', res)                 
                    this.data.splice(0,0, res)

                    const selectedGarageEls = document.querySelectorAll('#selected-garages .data-launch-ae-garage-entry');
                    const selectedGarageIds = Array.from(selectedGarageEls).map(el => parseInt(el.dataset.garageId));

                    const aeUserId = res.id; // Assuming you're editing an existing AE login

                    fetch('/api/accessible-garages/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                        user_id: aeUserId,
                        garage_ids: selectedGarageIds
                        })
                    })
                    .then(res => res.json())
                    .then(response => {
                        if (closeRecord === true) {
                            this.renderHTMLHeader()
                            this.addNewTableRowToListView(res)
                        }
                        else {
                            this.showSavedBanner()
                            this.id = res.id
                            this.recordId = res.id
                            this.newRecord = false
                            this.openForm(true, res) // switch into full "existing record" view
                        }
                    })
                    .catch(err => {
                        alert('❌ Error saving accessible garages:', err);
                    });
                },
                err => {
                    console.log(err)
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
            updateRecord('data_launch_users', this.recordId, createRecordObject).then(
                res => {
                    console.log('UPDATED EXISTING data_launch_ae_logins RECORD ???', res)
                    console.log('UPDATED EXISTING data_launch_ae_logins RECORDS ???', res)
                    const selectedGarageEls = document.querySelectorAll('#selected-garages .data-launch-ae-garage-entry');
                    const selectedGarageIds = Array.from(selectedGarageEls).map(el => parseInt(el.dataset.garageId));

                    const aeUserId = res.id; // Assuming you're editing an existing AE login

                    fetch('/api/accessible-garages/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                        user_id: aeUserId,
                        garage_ids: selectedGarageIds
                        })
                    })
                    .then(res => res.json())
                    .then(response => {
                        // alert('✅ Saved accessible garages:', response);
                    })
                    .catch(err => {
                        alert('❌ Error saving accessible garages:', err);
                    });


                    for (let i = 0; i < this.data.length; i++) {
                        if (this.data[i].id === createRecordObject.id ) {
                            this.data[i] = createRecordObject                          
                        }        
                    }
                    for (let i = 0; i < aeLoginsData.length; i++) {
                        if (aeLoginsData[i].id === createRecordObject.id) {
                            aeLoginsData[i] = createRecordObject                         
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
                    console.log(err)
                    if (closeRecord === true) {
                        this.renderHTMLHeader()
                    }
                    else {
                        this.showSavedBanner()
                    }
                }
            )
        }
        console.log('createRecordObject', createRecordObject)      
    }
    addNewTableRowToListView (rec) {
        console.log('addNewTableRowToListView rec', rec)
        let html = `
             <tr class="responsive-table__row data-launch-ae-logins-tr export-row" data-export-row="${this.exportRow}" data-export-header="id" data-export-val="${rec.id}" data-id="${rec.id}">
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-ae-logins-view-record-click" data-export-row="${this.exportRow}" data-export-header="username" data-export-val="${rec.username}" scope="row">${rec.username}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-ae-logins-view-record-click" data-export-row="${this.exportRow}" data-export-header="first_name"  data-export-val="${rec.first_name}" scope="row">${rec.first_name}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-ae-logins-view-record-click" data-export-row="${this.exportRow}" data-export-header="last_name"   data-export-val="${rec.last_name}" scope="row">${rec.last_name}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-ae-logins-view-record-click" data-export-row="${this.exportRow}" data-export-header="created_by"  data-export-val="${rec.created_by}" scope="row">${rec.created_by}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-ae-logins-view-record-click" data-export-row="${this.exportRow}" data-export-header="accessible_garages"  data-export-val="${rec.accessible_garages}" scope="row">${rec.accessible_garages}</td>
            </tr>`
            console.log('html is ', html)
            this.exportRow++
            document.getElementById('data-launch-ae-logins-table-body').innerHTML += html
    }
    generateRandomId () {
        const timestamp = new Date().getTime().toString(16); // Get current timestamp in hexadecimal
        let random = Math.random().toString(16).substring(2); // Get random number in hexadecimal
        random = random.substring(0, 4)
        return random; // Combine timestamp and random number
    }
    fieldObjectMeta () {
        return {
            "AE Logins" : {
                meta: {
                    columns: 3,
                    name: 'aeLogin'
                },
                fields: [
                    {
                        field: 'username',
                        label: 'Email Username',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'all_garages',
                        label: 'All Garages',
                        type: 'all_garages',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'first_name',
                        label: 'First Name',
                        type: 'text',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'moveArrows',
                        label: 'Move Left & Right',
                        type: 'arrows',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'last_name',
                        label: 'Last Name',
                        type: 'text',
                        section: 1,
                        column: 3
                    },
                    {
                        type: 'spacer',
                        column: 3,
                        section: 1
                    },
                    {
                        field: 'accessible_garages',
                        label: 'Accessible Garages',
                        type: 'accessible_garages',
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
                html += `<li class="nav-item data-launch-tabs-parent-li-ae-logins active modern-nav-item" id="aeLogins_parent_li_${headers[key].meta.name}">
                            <a class="nav-link data-launch-tabs-clickable-ae-logins active modern-nav-link" data-launch-menu-item="${headers[key].meta.name}" href="#">${key}</a>
                        </li>` 
                fistIteration = false
            }
            else {
            html +=     `<li class="nav-item data-launch-tabs-parent-li-ae-logins modern-nav-item" id="aeLogins_parent_li_${headers[key].meta.name}">
                            <a class="nav-link data-launch-tabs-clickable-ae-logins modern-nav-link" data-launch-menu-item="${headers[key].meta.name}" href="#">${key}</a>
                        </li>`   
            }                   
        }
        return html
    }
    buildFormSections (rec, html) {
        let fieldDataObj = this.fieldObjectMeta()        
        let firstIteration = true
        if (rec !== 'NEW FORM') {
            for (const key in fieldDataObj) {
                if (firstIteration) {
                    html += `<div class='data-launch-testers-screen data-launch-ae-logins-screen row active' id='data-launch-aeLogins-${fieldDataObj[key].meta.name}'>`
                    firstIteration = false
                }
                else {
                    html += `<div class='data-launch-testers-screen data-launch-ae-logins-screen row' id='data-launch-aeLogins-${fieldDataObj[key].meta.name}'>`
                }
                let columns = fieldDataObj[key].meta.columns
                console.log('columns ', columns)
                let colIndex = 0
                for (let i = 0; i < columns; i++) {
                    html += `<div class='col-lg-4 col-md-6 col-sm-12 col-xs-12 data-launch-field-container'>`                 
                    colIndex = i + 1
                    for (let t = 0; t < fieldDataObj[key].fields.length; t++) {
                        if (fieldDataObj[key].fields[t].column === colIndex) {
                            if (fieldDataObj[key].fields[t].type === 'text') {
                                html += `<div class='data-launch-input-field-container'>
                                        <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                        <input id="${fieldDataObj[key].fields[t].field}_val_aeLogins" placeholder="${fieldDataObj[key].fields[t].label}" type='text' data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" value="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'hyperlink') {
                                html += `<div class='data-launch-input-field-container'>
                                        <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                        <a><input id="${fieldDataObj[key].fields[t].field}_val_aeLogins" placeholder="${fieldDataObj[key].fields[t].label}" type='url' data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" value="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable' style="width: 100%"></a>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'phone') {
                                html += `<div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_aeLogins" placeholder='${fieldDataObj[key].fields[t].label}' type='phone' value="${rec[fieldDataObj[key].fields[t].field]}" data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'email') {
                                html += ` <div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_aeLogins" placeholder='${fieldDataObj[key].fields[t].label}' type='email' value="${rec[fieldDataObj[key].fields[t].field]}" data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable'>
                                            <a style='position: relative; top: -34%; left: 95%;' href="mailto:${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field]}"><i class="bi bi-envelope"></i></a>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'spacer') {
                                html += `<div style='height: 60px' class='data-launch-empty-spacer'></div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'date') {
                                html += ` <div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_aeLogins" placeholder='${fieldDataObj[key].fields[t].label}' type='date' value="${rec[fieldDataObj[key].fields[t].field]}" data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'multi-text') {
                                html += `<div class='data-launch-input-field-container data-launch-input-field-container-multi-line-ae-logins'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <textarea style="height: 100%;" id="${fieldDataObj[key].fields[t].field}_val_aeLogins" class='data-launch-input-field-multi-line data-launch-field-editable' data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" data-launch-field-editable">${typeof rec[fieldDataObj[key].fields[t].field] !== undefined ? rec[fieldDataObj[key].fields[t].field] : ''}</textarea>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'checkbox') {
                                html += ` <div class='data-launch-input-field-container-checkbox'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_aeLogins" type='checkbox' class='data-launch-input-field-checkbox data-launch-field-editable' data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" checked="${rec[fieldDataObj[key].fields[t].field]}">
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'data_launch_notes') {
                                html += ` <div class='data-launch-notes-container'>
                                            <div class='data-launch-notes-table-cont'
                                            style="height: 60vh;overflow-y: auto;overflow-x: hidden;"
                                            id='data_launch_aeLogins_notes_table_${this.id}'>
                                            </div>
                                            <button class="data-launch-create-new-note-record" data-launch-tester-id='${this.id}'>
                                                <i class="bi bi-plus-circle"></i> Add New Note
                                            </button>
                                        </div>`
                            } 
                            else if (fieldDataObj[key].fields[t].type === 'all_garages') {
                                html += ` 
                                        <div class="row mt-4">
                                            <div class="col">
                                            <button id="aeUserSendLoginDetailsToEmail" class="data-launch-send-ae-user-login-details-email">Send Login Details To Email</button>
                                            <br><br>
                                                <h5>Available Garages</h5>
                                                <div>
                                                    <input style="width: 96%; display: inline-block;" type="text" class="data-launch-garage-global-filter-input" id="data-launch-ae-garage-global-filter-input" placeholder="Search">
                                                    <i style="width: 1%; display: inline-block; position: relative;  top: 4px; right: 9%;" class="bi bi-arrow-counterclockwise data-launch-reset-filters-icon data-launch-table-reset-all-garage-filters"></i>
                                                </div>
                                                <div class="data-launch-ae-garage-selector-box" id="available-garages"></div>
                                            </div>
                                        </div>
                                        `
                            }
                            else if (fieldDataObj[key].fields[t].type === 'arrows') {
                                html += ` 
                                        <div class="row mt-4">
                                            <div class="col">
                                                <button class="btn btn-primary mb-2 data-launch-ae-garages-move-right">→</button>
                                                <button class="btn btn-secondary data-launch-ae-garages-move-left">←</button>
                                            </div>
                                        </div>
                                        `
                            }                            
                            else if (fieldDataObj[key].fields[t].type === 'accessible_garages') {
                                html += ` 
                                        <div class="row mt-4">
                                                <div class="col">
                                                <h5>Selected Garages</h5>
                                                <div class="data-launch-ae-garage-selector-box" id="selected-garages"></div>
                                            </div>
                                        </div>
                                        `
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
                                        if (field === 'vtsId') {
                                            html += `<td><a class='data-launch-garage-record-click data-launch-change-page' data-launch-menu-item="garage" data-launch-id='${row[field]}' href='#'>${row[field]}</a></td>`
                                        }
                                        else {
                                            html += `<td>${row[field]}</td>`
                                        }
                                        
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
                    html += `<div class='data-launch-testers-screen row active' id='data-launch-aeLogins-${fieldDataObj[key].meta.name}'>`
                    firstIteration = false
                }
                else {
                    html += `<div class='data-launch-testers-screen row' id='data-launch-aeLogins-${fieldDataObj[key].meta.name}'>`
                }
                let columns = fieldDataObj[key].meta.columns
                console.log('columns ', columns)
                let colIndex = 0
                for (let i = 0; i < columns; i++) {
                    html += `<div class='col-lg-4 col-md-6 col-sm-12 col-xs-12 data-launch-field-container'>`                                  
                    colIndex = i + 1
                    for (let t = 0; t < fieldDataObj[key].fields.length; t++) {
                        if (fieldDataObj[key].fields[t].column === colIndex) {
                            if (fieldDataObj[key].fields[t].type === 'text') {
                                html += `<div class='data-launch-input-field-container'>
                                        <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                        <input id="${fieldDataObj[key].fields[t].field}_val_aeLogins" placeholder="${fieldDataObj[key].fields[t].label}" type='text' data-launch-field="" value="" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'hyperlink') {
                                html += `<div class='data-launch-input-field-container'>
                                        <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                        <a><input id="${fieldDataObj[key].fields[t].field}_val_aeLogins" placeholder="${fieldDataObj[key].fields[t].label}" type='url' data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" value="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable' style="width: 100%"></a>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'phone') {
                                html += `<div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_aeLogins" placeholder='${fieldDataObj[key].fields[t].label}' type='phone' value="" data-launch-field="" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'email') {
                                html += ` <div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_aeLogins" placeholder='${fieldDataObj[key].fields[t].label}' type='email' value="" data-launch-field="" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'date') {
                                html += ` <div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_aeLogins" placeholder='${fieldDataObj[key].fields[t].label}' type='date' value="" data-launch-field="" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'multi-text') {
                                html += `<div class='data-launch-input-field-container data-launch-input-field-container-multi-line'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <textarea id="${fieldDataObj[key].fields[t].field}_val_aeLogins" class='data-launch-input-field-multi-line data-launch-field-editable' data-launch-field="" data-launch-field-editable"></textarea>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'checkbox') {
                                html += ` <div class='data-launch-input-field-container-checkbox'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_aeLogins" type='checkbox' class='data-launch-input-field-checkbox data-launch-field-editable' data-launch-field="" checked="">
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'data_launch_notes') {
                                // do nothing because you can't add a note to a record that has yet to be added to the database as the id 
                                // won't be stored to be able to attach the note to the table
                                html += ``
                            }                            
                            else if (fieldDataObj[key].fields[t].type === 'subgrid') {
                                console.log('do nothing because the data wont be there yet')
                            }                           
                            else if (fieldDataObj[key].fields[t].type === 'googleMaps') {
                                // do nothing
                                console.log('do nothing')                                
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
    renderGaragePickers(selectedGarageIds = []) {
        const availableBox = document.getElementById('available-garages');
        const selectedBox = document.getElementById('selected-garages');

        availableBox.innerHTML = '';
        selectedBox.innerHTML = '';

        for (let garage of this.garageData) {
           const checkboxHTML = 
                                `<div class="data-launch-ae-garage-entry" data-garage-id="${garage.id}">
                                    <input type="checkbox" class="data-launch-ae-garage-checkbox" id="garage_${garage.id}" data-id="${garage.id}">
                                    <label for="garage_${garage.id}" class="data-launch-ae-garage-label">${garage.trading_name_garage}</label>
                                </div>`;
            if (selectedGarageIds.includes(garage.id)) {
            selectedBox.innerHTML += checkboxHTML;
            } else {
            availableBox.innerHTML += checkboxHTML;
            }
        }
    }
    async loadAccessibleGaragesForAE(userId) {
        try {
            const res = await fetch(`/api/accessible-garages/${userId}`);
            const { garage_ids } = await res.json();

            garage_ids.forEach(id => {
            const match = document.querySelector(`#available-garages .data-launch-ae-garage-entry[data-garage-id="${id}"]`);
            if (match) {
                // Move it to the selected list
                document.getElementById('selected-garages').appendChild(match);
            }
            });
        } catch (err) {
            console.error('❌ Failed to load accessible garages for AE:', err);
        }
    }
    openForm = (bool, rec) => {
        currentPage = 'aeLogins'
        let html = ''
        if (rec) {
            this.newRecord = false
            this.recordId = rec.id
            this.id = rec.id
            html = `
             <div class="success-box" id="ae_successBox-sendingLoginEmail">
                <span class="alert-icon">✅</span>
                <span class="alert-message">Login Details Sent Successfully....</span>
            </div>
            <div id="data-launch-saved-record-banner-ae-logins" class="data-launch-saved-record-banner-alert">Record Saved Successfully</div>  
            <div id="testers-screen-overlay-${this.id}" style="display:none" class="garage-screen-overlay"></div>   
            <div class='container-fluid'>
                                <div style='display: none' class='data-launch-confirmation-box-inject' id='data-launch-confirmation-box-inject'></div>
                                <span style='display:none' id='currentRecordID'>${rec.id}</span>   
                                <button type="button" id="data-launch-ae-logins-record-save2" class="btn btn-outline-primary data-launch-save-record">Save</button>
                                <button type="button" id="data-launch-ae-logins-record-save-close2" class="btn btn-outline-primary data-launch-save-close-record">Save & Close</button>
                                <button type="button" id="data-launch-ae-logins-back-to-list-view" class="btn btn-outline-primary btn-primary data-launch-record-back-to-list-view">< < Back To List</button>
                                <div class='data-launch-tabs-container data-launch-ae-logins-tabs-container'>
                                    <nav class="navbar navbar-expand-lg navbar-light modern-navbar">
                                        <div class="container-fluid data-launch-form-tabs-container">
                                            <div class="data-launch-form-tabs-container-row">
                                                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
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
                        ${this.buildFormSections(rec, html)}
                `
        }
        else {
            this.newRecord = true
            // <i class="bi bi-plus data-launch-nav-menu-plus-icon" id="data-launch-nav-menu-plus-icon"></i>
            html = `
            <div id="data-launch-saved-record-banner-ae-logins" class="data-launch-saved-record-banner-alert">Record Saved Successfully</div>        
            <div class='container-fluid'>
                            <div class='row'>
                                <div style='display: none' class='data-launch-confirmation-box-inject' id='data-launch-confirmation-box-inject'></div>
                                <button type="button" id="data-launch-ae-logins-save" class="btn btn-outline-primary data-launch-save-record">Save</button>
                                <button type="button" id="data-launch-ae-logins-save-close" class="btn btn-outline-primary data-launch-save-close-record">Save & Close</button>
                                <button type="button" id="data-launch-ae-logins-back-to-list-view" class="btn btn-outline-primary btn-primary data-launch-record-back-to-list-view">< < Back To List</button>
                                <div class='data-launch-record-header'>
                                    <h3>+ New</h3>                  
                                </div>
                                <div class='data-launch-tabs-container data-launch-ae-logins-tabs-container'>
                                    <nav class="navbar navbar-expand-lg navbar-light modern-navbar">
                                        <div class="container-fluid data-launch-form-tabs-container">
                                            <div class="data-launch-form-tabs-container-row">
                                                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
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
        document.getElementById('aeLoginsPage').innerHTML = html
        // this.injectGaragesIntoModalBox()
        if (this.recordId) {
            this.loadAccessibleGaragesForAE(this.recordId);
            this.renderGaragePickers(); 
        }           
    }
    handleFileUploadSuccess(event) {
        this.showCRUDAlert('File Uploaded Successfully', 'success');
        console.log(this.value); // The URL of the uploaded file
        console.log(event.detail.files); // Array of file details
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
    getFormattedDateTime() {
        const now = new Date();
        
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = now.getFullYear();
    
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
    
        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    }
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
}
