console.log('testing station file')
class SpecialNotices {
    constructor(id) {
        console.log('hit this section')
        this.data = specialNoticesData
        console.log('this. data - TESTERS ', this.data)
        if (id) {
            this.id = id
            this.addListeners()
            this.openForm(true, id)
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
        <div id="specialNoticeDelModal" class="del-confirmation-modal">
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
                    <tr class="responsive-table__row">
                        <th class="responsive-table__head__title responsive-table__head__title--name">
                            <span class='data-launch-header-label'>Notice Name</span>
                        </th>
                        <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                          <span class='data-launch-header-label'>Hyperlink</span>
                        </th>                        
                         <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                          <span class='data-launch-header-label'>Created By</span>
                        </th>
                        <th class="responsive-table__head__title responsive-table__head__title--name">
                            <span class='data-launch-header-label'>Notice Date</span>
                        </th>
                        <th class="responsive-table__head__title responsive-table__head__title--name">
                            <span class='data-launch-header-label'>Expiry Date</span>
                        </th>
                        <th class="responsive-table__head__title responsive-table__head__title--name">
                            <span class='data-launch-header-label'></span>
                        </th>                      
                    </tr>                    
                </thead>
                <tbody class="responsive-table__body" id="data-launch-special-notices-records-table-body">
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
            <tr class="responsive-table__row export-row" data-export-row="${exportRow}" id="data_launch_special_notice_row_${data[i].id}" data-export-header="id" data-export-val="${data[i].id}" data-id="${data[i].id}">
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-special-notices-view-record-click" data-export-row="${exportRow}" data-export-header="notice_name" data-export-val="${data[i].notice_name}" scope="row">${data[i].notice_name}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-special-notices-view-record-click" data-export-row="${exportRow}" data-export-header="hyperlink"  data-export-val="${data[i].hyperlink}" scope="row">${data[i].hyperlink}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-special-notices-view-record-click" data-export-row="${exportRow}" data-export-header="created_by"   data-export-val="${data[i].created_by}" scope="row">${data[i].created_by}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-special-notices-view-record-click" data-export-row="${exportRow}" data-export-header="notice_date"  data-export-val="${data[i].notice_date}" scope="row">${data[i].notice_date}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-special-notices-view-record-click" data-export-row="${exportRow}" data-export-header="expiry_date"  data-export-val="${data[i].expiry_date}" scope="row">${data[i].expiry_date}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types"><i class="bi bi-trash data-launch-subgrid-delete-special-notice-item" data-special-notice-id='${data[i].id}' data-id='${data[i].id}'></i></td>  
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
        document.getElementById('specialNoticesPage').innerHTML = html
        this.addListeners()
    }
    navigateToGarageRecord (ev, id) {
        changePage(ev, id)  
    }
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
    
    addListeners () {
        console.log('adding event listeners to special Notices class')
        document.getElementById('specialNoticesPage').addEventListener('click', (event) => {
            event.stopPropagation()
            console.log('here lets go whats going on ')
            if (event.target.classList.contains('data-launch-special-notices-view-record-click')) {
                console.log('hope i get the right special notice')
                let id = event.target.parentElement.dataset.id
                console.log('id of the tester is ', id)
                this.currentRecordId = id
                this.openForm(true, id)
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
            else if (event.target.classList.contains('data-launch-subgrid-delete-special-notice-item')) {
                // this.idToDelete = event.target.attributes["data-special-notice-id"].value
                // this.deleteRecordConfirmationBox()
                let id = event.target.attributes["data-special-notice-id"].value;
                let delModal = document.getElementById('specialNoticeDelModal');
                delModal.classList.add('active');
                document.getElementById('confirmDelete').setAttribute('data-id', id)
                document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_special_notices')
                document.getElementById('confirmDelete').setAttribute('data-element-id', `data_launch_special_notice_row_${id}`)
            }
            else if (event.target.classList.contains('del-confirmation-modal__btn--confirm')) {
                let delModal = document.getElementById('specialNoticeDelModal');
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
                let delModal = document.getElementById('specialNoticeDelModal');
                delModal.classList.remove('active'); 
            }

            else if (event.target.classList.contains('data-launch-mot-special-notice-delete-item-dialogue-box-cancel')) {
                this.hideDeleteRecordConfirmationBox()
            }
            else if (event.target.classList.contains('data-launch-mot-special-notice-delete-item-dialogue-box-confirm')) {
                this.hideDeleteRecordConfirmationBox()
                this.secureAction('delete','data_launch_special_notices', parseInt(this.idToDelete), null).then(
                    success => {
                        console.log('success', success)
                        document.getElementById(`data_launch_special_notice_row_${this.idToDelete}`).style.display = 'none'
                    },
                    err => {
                        console.error(err)
                    }
                )
            }
            else if (event.target.classList.contains('data-launch-record-back-to-list-view')) {
                this.renderHTMLHeader()
            }   

// data-launch-save-close-record
            
        })
        document.getElementById('specialNoticesPage').addEventListener('change', (event) => {
            // if (event.target.classList.contains('data-launch-filter-search') && event.target.value !== '') {
            //     let header = event.target.attributes["data-launch-header"].value
            //     let value = event.target.value
            //     this.filterApply(header,value)
            // }
         })
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
                <tr class="responsive-table__row export-row" data-export-row="${exportRow}" id="data_launch_special_notice_row_${data[i].id}" data-export-header="id" data-export-val="${data[i].id}" data-id="${data[i].id}">
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-special-notices-view-record-click" data-export-row="${exportRow}" data-export-header="notice_name" data-export-val="${data[i].notice_name}" scope="row">${data[i].notice_name}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-special-notices-view-record-click" data-export-row="${exportRow}" data-export-header="hyperlink"  data-export-val="${data[i].hyperlink}" scope="row">${data[i].hyperlink}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-special-notices-view-record-click" data-export-row="${exportRow}" data-export-header="created_by"   data-export-val="${data[i].created_by}" scope="row">${data[i].created_by}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-special-notices-view-record-click" data-export-row="${exportRow}" data-export-header="notice_date"  data-export-val="${data[i].notice_date}" scope="row">${data[i].notice_date}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-special-notices-view-record-click" data-export-row="${exportRow}" data-export-header="expiry_date"  data-export-val="${data[i].expiry_date}" scope="row">${data[i].expiry_date}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types"><i class="bi bi-trash data-launch-subgrid-delete-special-notice-item" data-special-notice-id='${data[i].id}' data-id='${data[i].id}'></i></td>  
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
        document.getElementById('data-launch-saved-record-banner-special-notices').classList.add('active')
        setTimeout(() => {
            document.getElementById('data-launch-saved-record-banner-special-notices').classList.remove('active')
        }, 4000);
    }
    saveAndClose () {
        // this effectively deletes the element, including all of the event listeners, and then creates a new copy with zero event listeners attached
        this.saveDetailsAboutTheRecord(true)
        const oldElement = document.getElementById('specialNoticesPage');
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
                if (document.getElementById(`${fields[i].field}_val_specialNotices`).value) {
                    console.log('this text field contains data ', fields[i], document.getElementById(`${fields[i].field}_val_specialNotices`).value)
                    createRecordObject[fields[i].field] = document.getElementById(`${fields[i].field}_val_specialNotices`).value
                }
            }
            else if (fields[i].type === 'checkbox') {
                if (document.getElementById(`${fields[i].field}_val_specialNotices`).checked) {
                    console.log('this text field contains data ', fields[i], document.getElementById(`${fields[i].field}_val_specialNotices`).checked)
                    let val = document.getElementById(`${fields[i].field}_val_specialNotices`).checked
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
            createRecord('data_launch_special_notices', createRecordObject).then(res => {
                    console.log('CREATED NEW data_launch_special_notices RECORD IN DB', res)                 
                    this.data.splice(0,0, res)
                    if (closeRecord === true) {
                        this.renderHTMLHeader()
                        this.addNewTableRowToListView(res)
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
        else {
            createRecordObject.id = this.recordId
            updateRecord('data_launch_special_notices', this.recordId, createRecordObject).then(
                res => {
                    console.log('UPDATED EXISTING data_launch_special_notices RECORD ???', res)
                    console.log('UPDATED EXISTING data_launch_special_notices RECORDS ???', res)
                    for (let i = 0; i < this.data.length; i++) {
                        if (this.data[i].id === createRecordObject.id ) {
                            this.data[i] = createRecordObject                          
                        }        
                    }
                    for (let i = 0; i < specialNoticesData.length; i++) {
                        if (specialNoticesData[i].id === createRecordObject.id) {
                            specialNoticesData[i] = createRecordObject                         
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
             <tr class="responsive-table__row export-row" data-export-row="${this.exportRow}" data-export-header="id" data-export-val="${rec.id}" data-id="${rec.id}">
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-special-notices-view-record-click" data-export-row="${this.exportRow}" data-export-header="notice_name" data-export-val="${rec.notice_name}" scope="row">${rec.notice_name}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-special-notices-view-record-click" data-export-row="${this.exportRow}" data-export-header="hyperlink"  data-export-val="${rec.hyperlink}" scope="row">${rec.hyperlink}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-special-notices-view-record-click" data-export-row="${this.exportRow}" data-export-header="created_by"   data-export-val="${rec.created_by}" scope="row">${rec.created_by}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-special-notices-view-record-click" data-export-row="${this.exportRow}" data-export-header="notice_date"  data-export-val="${rec.notice_date}" scope="row">${rec.notice_date}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-special-notices-view-record-click" data-export-row="${this.exportRow}" data-export-header="expiry_date"  data-export-val="${rec.expiry_date}" scope="row">${rec.expiry_date}</td>
            </tr>`
            console.log('html is ', html)
            this.exportRow++
            document.getElementById('data-launch-special-notices-table-body').innerHTML += html
    }
    generateRandomId () {
        const timestamp = new Date().getTime().toString(16); // Get current timestamp in hexadecimal
        let random = Math.random().toString(16).substring(2); // Get random number in hexadecimal
        random = random.substring(0, 4)
        return random; // Combine timestamp and random number
    }
    fieldObjectMeta () {
        return {
            "Special Notice" : {
                meta: {
                    columns: 3,
                    name: 'specialNotice'
                },
                fields: [
                    {
                        field: 'notice_name',
                        label: 'Notice Name',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'notice_date',
                        label: 'Notice Date',
                        type: 'date',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'created_by',
                        label: 'Created By',
                        type: 'text',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'hyperlink',
                        label: 'Hyperlink',
                        type: 'hyperlink',
                        section: 1,
                        column: 2,
                        columnWidth: 2
                    },
                    {
                        field: 'expiry_date',
                        label: 'Expiry Date',
                        type: 'date',
                        section: 1,
                        column: 2
                    },
                    {
                        field: 'description',
                        label: 'Description',
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
                html += `<li class="nav-item data-launch-tabs-parent-li-testers active modern-nav-item" id="specialNotices_parent_li_${headers[key].meta.name}">
                            <a class="nav-link data-launch-tabs-clickable-testers active modern-nav-link" data-launch-menu-item="${headers[key].meta.name}" href="#">${key}</a>
                        </li>` 
                fistIteration = false
            }
            else {
            html +=     `<li class="nav-item data-launch-tabs-parent-li-testers modern-nav-item" id="specialNotices_parent_li_${headers[key].meta.name}">
                            <a class="nav-link data-launch-tabs-clickable-testers modern-nav-link" data-launch-menu-item="${headers[key].meta.name}" href="#">${key}</a>
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
                    html += `<div class='data-launch-testers-screen data-launch-special-notices-screen row active' id='data-launch-specialNotices-${fieldDataObj[key].meta.name}'>`
                    firstIteration = false
                }
                else {
                    html += `<div class='data-launch-testers-screen data-launch-special-notices-screen row' id='data-launch-specialNotices-${fieldDataObj[key].meta.name}'>`
                }
                let columns = fieldDataObj[key].meta.columns
                console.log('columns ', columns)
                let colIndex = 0
                for (let i = 0; i < columns; i++) {
                    if (fieldDataObj[key].meta.type === 'full') {
                        html += `<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 data-launch-field-container'>` 
                    }
                    /// this else if is so the notes subgrid takes us more space than just a 1/3 of the page
                    else if (fieldDataObj[key].meta.name === 'summary' && i === 1) {
                        html += `<div class='col-lg-8 col-md-6 col-sm-12 col-xs-12 data-launch-field-container'>` 
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
                                        <input id="${fieldDataObj[key].fields[t].field}_val_specialNotices" placeholder="${fieldDataObj[key].fields[t].label}" type='text' data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" value="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'hyperlink') {
                                html += `<div class='data-launch-input-field-container'>
                                        <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                        <a><input id="${fieldDataObj[key].fields[t].field}_val_specialNotices" placeholder="${fieldDataObj[key].fields[t].label}" type='url' data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" value="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable' style="width: 100%"></a>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'phone') {
                                html += `<div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_specialNotices" placeholder='${fieldDataObj[key].fields[t].label}' type='phone' value="${rec[fieldDataObj[key].fields[t].field]}" data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'email') {
                                html += ` <div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_specialNotices" placeholder='${fieldDataObj[key].fields[t].label}' type='email' value="${rec[fieldDataObj[key].fields[t].field]}" data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable'>
                                            <a style='position: relative; top: -34%; left: 95%;' href="mailto:${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field]}"><i class="bi bi-envelope"></i></a>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'date') {
                                html += ` <div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_specialNotices" placeholder='${fieldDataObj[key].fields[t].label}' type='date' value="${rec[fieldDataObj[key].fields[t].field]}" data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'multi-text') {
                                html += `<div class='data-launch-input-field-container data-launch-input-field-container-multi-line-special-notices'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <textarea style="height: 100%;" id="${fieldDataObj[key].fields[t].field}_val_specialNotices" class='data-launch-input-field-multi-line data-launch-field-editable' data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" data-launch-field-editable">${typeof rec[fieldDataObj[key].fields[t].field] !== undefined ? rec[fieldDataObj[key].fields[t].field] : ''}</textarea>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'checkbox') {
                                html += ` <div class='data-launch-input-field-container-checkbox'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_specialNotices" type='checkbox' class='data-launch-input-field-checkbox data-launch-field-editable' data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" checked="${rec[fieldDataObj[key].fields[t].field]}">
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'data_launch_notes') {
                                html += ` <div class='data-launch-notes-container'>
                                            <div class='data-launch-notes-table-cont'
                                            style="height: 60vh;overflow-y: auto;overflow-x: hidden;"
                                            id='data_launch_specialNotices_notes_table_${this.id}'>
                                            </div>
                                            <button class="data-launch-create-new-note-record" data-launch-tester-id='${this.id}'>
                                                <i class="bi bi-plus-circle"></i> Add New Note
                                            </button>
                                        </div>`
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
                    html += `<div class='data-launch-testers-screen row active' id='data-launch-specialNotices-${fieldDataObj[key].meta.name}'>`
                    firstIteration = false
                }
                else {
                    html += `<div class='data-launch-testers-screen row' id='data-launch-specialNotices-${fieldDataObj[key].meta.name}'>`
                }
                let columns = fieldDataObj[key].meta.columns
                console.log('columns ', columns)
                let colIndex = 0
                for (let i = 0; i < columns; i++) {
                    if (i === 0) {
                        html += `<div class='col-lg-4 col-md-6 col-sm-12 col-xs-12 data-launch-field-container'>` 
                    }
                    else {
                        html += `<div class='col-lg-8 col-md-6 col-sm-12 col-xs-12 data-launch-field-container'>` 
                    }                
                    colIndex = i + 1
                    for (let t = 0; t < fieldDataObj[key].fields.length; t++) {
                        if (fieldDataObj[key].fields[t].column === colIndex) {
                            if (fieldDataObj[key].fields[t].type === 'text') {
                                html += `<div class='data-launch-input-field-container'>
                                        <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                        <input id="${fieldDataObj[key].fields[t].field}_val_specialNotices" placeholder="${fieldDataObj[key].fields[t].label}" type='text' data-launch-field="" value="" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'hyperlink') {
                                html += `<div class='data-launch-input-field-container'>
                                        <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                        <a><input id="${fieldDataObj[key].fields[t].field}_val_specialNotices" placeholder="${fieldDataObj[key].fields[t].label}" type='url' data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" value="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable' style="width: 100%"></a>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'phone') {
                                html += `<div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_specialNotices" placeholder='${fieldDataObj[key].fields[t].label}' type='phone' value="" data-launch-field="" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'email') {
                                html += ` <div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_specialNotices" placeholder='${fieldDataObj[key].fields[t].label}' type='email' value="" data-launch-field="" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'date') {
                                html += ` <div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_specialNotices" placeholder='${fieldDataObj[key].fields[t].label}' type='date' value="" data-launch-field="" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'multi-text') {
                                html += `<div class='data-launch-input-field-container data-launch-input-field-container-multi-line'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <textarea id="${fieldDataObj[key].fields[t].field}_val_specialNotices" class='data-launch-input-field-multi-line data-launch-field-editable' data-launch-field="" data-launch-field-editable"></textarea>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'checkbox') {
                                html += ` <div class='data-launch-input-field-container-checkbox'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val_specialNotices" type='checkbox' class='data-launch-input-field-checkbox data-launch-field-editable' data-launch-field="" checked="">
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
    openForm = (bool, id) => {
        currentPage = 'specialNotices'
        let rec;
        document.getElementById('data-launch-side-bar').classList.remove('data-launch-activate-menu')
        if (bool) {
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i].id === parseInt(id)) {
                    rec = this.data[i]
                }        
            }            
        }
        let html = ''
        if (rec) {
            this.newRecord = false
            this.recordId = rec.id
            this.id = id
            let googleMapsString = ''
            if (rec.vtsAddress1) {
                googleMapsString += `${rec.vtsAddress1}$20`
            }
            else if (rec.vtsAddress2) {
                googleMapsString += `${rec.vtsAddress2}$20`
            }
            else if (rec.vtsAddress3) {
                googleMapsString += `${rec.vtsAddress3},`
            }
            else if (rec.vtsCity) {
                googleMapsString += `$20${rec.vtsCity},`
            }
            else if (rec.vtsCounty) {
                googleMapsString += `$20${rec.vtsCounty},`
            }
            else if (rec.vtsPostcode) {
                googleMapsString += `$20${rec.vtsPostcode}`
            }
            // <i class="bi bi-plus data-launch-nav-menu-plus-icon" id="data-launch-nav-menu-plus-icon"></i>
            html = `
            <div id="data-launch-saved-record-banner-special-notices" class="data-launch-saved-record-banner-alert">Record Saved Successfully</div>  
            <div id="testers-screen-overlay-${this.id}" style="display:none" class="garage-screen-overlay"></div>   
            <div class='container-fluid'>
                                <div style='display: none' class='data-launch-confirmation-box-inject' id='data-launch-confirmation-box-inject'></div>
                                <span style='display:none' id='currentRecordID'>${rec.id}</span>   
                                <button type="button" id="data-launch-testers-record-save2" class="btn btn-outline-primary data-launch-save-record">Save</button>`
                                if (user_FULL_USER !== '0') {
                                    html += `<button type="button" id="data-launch-testers-record-save-close2" class="btn btn-outline-primary data-launch-save-close-record">Save & Close</button>`
                                    html += `<button type="button" id="data-launch-garages-back-to-list-view" class="btn btn-outline-primary btn-primary data-launch-record-back-to-list-view">< < Back To List</button>`
                                }
                                html += `
                                <div class='data-launch-tabs-container data-launch-special-notices-tabs-container'>
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
            <div id="data-launch-saved-record-banner-special-notices" class="data-launch-saved-record-banner-alert">Record Saved Successfully</div>        
            <div class='container-fluid'>
                            <div class='row'>
                                <div style='display: none' class='data-launch-confirmation-box-inject' id='data-launch-confirmation-box-inject'></div>
                                <button type="button" id="data-launch-special-notices-save" class="btn btn-outline-primary data-launch-save-record">Save</button>
                                <button type="button" id="data-launch-special-notices-save-close" class="btn btn-outline-primary data-launch-save-close-record">Save & Close</button>
                                <button type="button" id="data-launch-special-notices-back-to-list-view" class="btn btn-outline-primary btn-primary data-launch-record-back-to-list-view">< < Back To List</button>
                                <div class='data-launch-record-header'>
                                    <h3>+ New</h3>                  
                                </div>
                                <div class='data-launch-tabs-container data-launch-special-notices-tabs-container'>
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
        document.getElementById('specialNoticesPage').innerHTML = html        
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
