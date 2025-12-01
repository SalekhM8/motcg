console.log('testing station file')
class Testers {
    constructor(id) {
        console.log('hit this section')
        this.data = testersData
        console.log('this. data - TESTERS ', this.data)
        this.filteredData = []
        this.filters = []
        this.garageData = garageData
        this.testerNotesData = []
        this.testersTrainingFiles = []
        // this.generateDummyData()
        this.selectedGarageId = null;
        this.setupModal();
        document.getElementById('data-launch-side-bar').classList.remove('data-launch-activate-menu')
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
        <div id="testersDelModal" class="del-confirmation-modal">
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
        <div style="display: none; position: fixed; top: 0px; left: 0px; height: 100vh; width: 100vw; background-color: lightgrey; z-index: 999;" id="data-launch-testers-delete-confirmation-box">
            <div class="data-launch-testing-station-promote-garage-confirmation-box">
                <div class="data-launch-testing-station-promote-garage-confirmation-box-header">
                    <p>
                        Are you sure you want to delete Tester Record - <strong id="data-launch-delete-testers-dialogue-box-inject-name-strong-element">INJECT TESTER NAME AND ID HERE</strong>?
                    </p>
                    <div class="data-launch-testing-station-promote-garage-confirmation-box-actions">
                        <button class="data-launch-testing-station-promote-garage-confirmation-box-approve-btn data-launch-tester-delete-confirm">
                        Confirm
                        </button>
                        <button class="data-launch-testing-station-promote-garage-confirmation-box-cancel-btn data-launch-tester-delete-cancel">
                        Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="button-container">
            <button class="modern-button data-launch-add-new-tester-record">
                <span class="plus-icon">+</span>
                New
            </button>
        </div>
        <div class="container" style="height: 92vh; overflow-y: auto;">
            <table class="responsive-table">
                <thead class="responsive-table__head">
                    <tr class="responsive-table__row">
                       <th class="responsive-table__head__title responsive-table__head__title--name">
                            <span class='data-launch-header-label'></span>
                        </th>
                        <th class="responsive-table__head__title responsive-table__head__title--name">
                            <span class='data-launch-header-label'>First Name</span>
                        </th>
                        <th class="responsive-table__head__title responsive-table__head__title--name">
                            <span class='data-launch-header-label'>Last Name</span>
                        </th>
                        <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                          <span class='data-launch-header-label'>Phone</span>
                        </th>
                        <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                          <span class='data-launch-header-label'>Email</span>
                        </th>     
                         <th style="width: 5%;"></th>                   
                    </tr>                    
                </thead>
                <tbody class="responsive-table__body" id="data-launch-tester-records-table-body">
                `
                    // <tr class="responsive-table__row data-launch-inactive" id='data-launch-testing-station-filter-container'>
                    //     <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                    //         <input type="text" class="data-launch-filter-search" data-launch-header="first_name" style="width: 100%;" placeholder="" value="">
                    //     </th>
                    //     <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                    //         <input type="text" class="data-launch-filter-search" data-launch-header="first_name" style="width: 100%;" placeholder="" value="">
                    //     </th>
                    //     <th class="responsive-table__head__title responsive-table__head__title--name">
                    //         <input type="text" class="data-launch-filter-search" data-launch-header="last_name" style="width: 100%;" placeholder="" value="">
                    //     </th>
                    //     <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                    //         <input type="text" class="data-launch-filter-search" data-launch-header="phone_number" style="width: 100%;" placeholder="" value="">
                    //     </th>
                    //     <th class="responsive-table__head__title responsive-table__head__title--status" scope="col">
                    //         <input type="text" class="data-launch-filter-search" data-launch-header="email_address" style="width: 100%;" placeholder="" value="">
                    //     </th>
                    //     <th style="width: 5%;"></th>
                    // </tr>
        this.renderHTMLData(html)
    }
    renderHTMLData(html) {
        console.log('html is ', html)
        console.log('this.data is ', this.data)
        let data = this.data
        let exportRow = 0
        for (let i = 0; i < data.length; i++) {
            html += `
            <tr class="responsive-table__row export-row" data-export-row="${exportRow}" data-export-header="id" data-export-val="${data[i].id}" id="data-launch-tester-records-table-view-${data[i].id}" data-id="${data[i].id}">    
                <td class="responsive-table__body__text responsive-table__body__text--name export-record data-launch-testers-view-record-click" data-export-row="${exportRow}" data-export-header="first_name Name" data-export-val="${data[i].first_name}" scope="row">
					<svg class="user-icon" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
						<path d="m256.025 483.334 101.429-25.614c57.895-48.074 94.771-120.586 94.771-201.719 0-125.144-87.711-229.801-205.012-255.852-137.316 4.631-247.213 117.407-247.213 255.851 0 71.112 29 135.446 75.812 181.836z" fill="#cbe2ff" />
						<path d="m446.914 256c0 83.915-40.381 158.391-102.765 205.079l92.031-23.241c46.815-46.39 75.82-110.724 75.82-181.838 0-141.385-114.615-256-256-256-11.024 0-21.886.698-32.543 2.05 126.019 15.988 223.457 123.59 223.457 253.95z" fill="#bed8fb" />
						<path d="m319.621 96.952c0-13.075-10.599-23.674-23.674-23.674h-81.582c-30.091 0-54.485 24.394-54.485 54.485v60.493h192.209v-59.635c0-13.075-10.599-23.674-23.674-23.674h-.798c-4.416 0-7.996-3.579-7.996-7.995z" fill="#365e7d" />
						<path d="m328.415 104.947h-.798c-4.416 0-7.996-3.58-7.996-7.996 0-13.075-10.599-23.674-23.674-23.674h-8.945v114.978h65.086v-59.635c.001-13.073-10.599-23.673-23.673-23.673z" fill="#2b4d66" />
						<path d="m425.045 372.355c-6.259-6.182-14.001-10.963-22.79-13.745l-69.891-22.128-76.348-2.683-76.38 2.683-69.891 22.128c-23.644 7.486-39.713 29.428-39.713 54.229v19.094c44.789 47.328 107.451 77.568 177.183 79.92 78.128-17.353 143.129-69.576 177.83-139.498z" fill="#4a80aa" />
						<path d="m441.968 431.932v-19.094c0-17.536-8.04-33.635-21.105-44.213-37.111 75.626-110.422 130.268-197.346 141.317 10.492 1.329 21.178 2.038 32.026 2.057 10.423-.016 20.708-.62 30.824-1.782 61.031-7.212 115.485-35.894 155.601-78.285z" fill="#407093" />
						<path d="m261.796 508.168c15.489-30.751 55.822-118.067 44.321-172.609l-50.101-19.499-50.148 19.5c-11.856 56.225 31.37 147.277 45.681 175.29 3.442-.826 6.859-1.721 10.247-2.682z" fill="#e4f6ff" />
						<path d="m288.197 483.789-20.314-79.917h-23.767l-20.264 79.699 25.058 27.897c6.361-1.457 12.634-3.146 18.81-5.057z" fill="#e28086" />
						<path d="m249.302 511.905c2.075.054 4.154.091 6.241.095 2.415-.004 4.822-.046 7.222-.113l12.907-14.259c-10.159 3.564-20.61 6.506-31.309 8.779z" fill="#dd636e" />
						<path d="m298.774 328.183v-45.066h-85.58v45.066c0 23.632 42.79 49.446 42.79 49.446s42.79-25.814 42.79-49.446z" fill="#ffddce" />
						<path d="m352.089 180.318h-16.359c-9.098 0-16.473-7.375-16.473-16.473v-9.015c0-11.851-11.595-20.23-22.847-16.511-26.243 8.674-54.579 8.676-80.823.006l-.031-.01c-11.252-3.717-22.845 4.662-22.845 16.512v9.019c0 9.098-7.375 16.473-16.473 16.473h-16.358v26.938c0 6.883 5.58 12.464 12.464 12.464 2.172 0 3.939 1.701 4.076 3.869 2.628 41.668 37.235 74.654 79.565 74.654 42.33 0 76.937-32.986 79.565-74.654.137-2.167 1.904-3.869 4.076-3.869 6.883 0 12.464-5.58 12.464-12.464v-26.939z" fill="#ffddce" />
						<path d="m335.73 180.318c-9.098 0-16.473-7.375-16.473-16.473v-9.015c0-11.851-11.595-20.23-22.847-16.511-3.108 1.027-6.247 1.923-9.407 2.707v88.972c-.438 28.948-16.3 54.142-39.725 67.758 2.861.311 5.763.486 8.706.486 42.33 0 76.937-32.986 79.565-74.654.137-2.167 1.904-3.869 4.076-3.869 6.883 0 12.464-5.58 12.464-12.464v-26.938h-16.359z" fill="#ffcbbe" />
						<g fill="#f4fbff">
							<path d="m213.194 316.06-33.558 27.267 35.192 43.513c4.281 4.168 11.019 4.424 15.605.594l26.465-22.107z" />
							<path d="m298.79 316.06-41.892 49.267 24.874 21.268c4.557 3.896 11.327 3.7 15.651-.453l34.94-42.815z" />
						</g>
						<path d="m213.194 316.06-49.256 24.199c-3.75 1.842-5.256 6.404-3.341 10.117l9.65 18.71c2.501 4.848 1.578 10.756-2.282 14.61-1.987 1.983-4.139 4.131-6.004 5.993-3.338 3.332-4.537 8.255-3.067 12.737 11.651 35.517 67.725 89.828 88.946 109.478 1.427.038 2.857.064 4.29.08-15.389-29.933-69.922-143.655-38.936-195.924z" fill="#365e7d" />
						<path d="m344.019 383.695c-3.861-3.854-4.783-9.762-2.282-14.61l9.65-18.71c1.915-3.713.409-8.275-3.341-10.117l-49.256-24.198c30.978 52.255-23.517 165.929-38.923 195.9 1.448-.025 2.893-.061 4.335-.109 21.265-19.695 77.248-73.94 88.888-109.424 1.47-4.482.271-9.405-3.067-12.737-1.865-1.863-4.017-4.012-6.004-5.995z" fill="#365e7d" />
						<path d="m256.898 365.327-26.06 21.764 13.278 16.781h23.767l13.279-17.771z" fill="#dd636e" />
					</svg>
				</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testers-view-record-click" data-export-row="${exportRow}" data-export-header="first_name"                data-export-val="${data[i].first_name}" scope="row">${data[i].first_name}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testers-view-record-click" data-export-row="${exportRow}" data-export-header="last_name"                data-export-val="${data[i].last_name}" scope="row">${data[i].last_name}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testers-view-record-click" data-export-row="${exportRow}" data-export-header="phone_number"                data-export-val="${data[i].phone_number}" scope="row">${data[i].phone_number}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testers-view-record-click" data-export-row="${exportRow}" data-export-header="email_address"                data-export-val="${data[i].email_address}" scope="row">${data[i].email_address}</td>
                <td><i class="bi bi-trash data-launch-subgrid-delete-tester-item data-launch-delete-tester-record" data-tester-name="${data[i].first_name} ${data[i].last_name}" data-id='${data[i].id}'></i></td> 
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
        document.getElementById('testerRecordsPage').innerHTML = html
        this.addListeners()
    }
    navigateToGarageRecord (ev, id) {
        changePage(ev, id)  
    }
    openGarageModal() {
        const modal = document.getElementById('myModal');
        modal.style.display = 'block';
        this.populateGarageTable(this.garageData);
    }
    setupModal() {
        // Create modal elements
        let modalHtml = `
            <div id="myModal" class="tester-record-associated-garages-modal-popup">
                <div class="tester-record-associated-garages-modal-content">
                    <span class="tester-record-associated-garages-close">&times;</span>
                    <h2 class="tester-record-associated-garages-header">Select a Garage</h2>
                    <input type="text" id="searchInput" class="tester-record-associated-garages-search-input" placeholder="Search by trading name...">
                    <table id="garageTable" class="tester-record-associated-garages-table">
                        <thead>
                            <tr>
                                <th>Trading Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Garage rows will be inserted here -->
                        </tbody>
                    </table>
                    <button id="okButton" class="tester-record-associated-garages-ok-button">OK</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Modal event listeners
        const modal = document.getElementById('myModal');
        const closeSpan = document.getElementsByClassName('tester-record-associated-garages-close')[0];
        const searchInput = document.getElementById('searchInput');
        const garageTable = document.getElementById('garageTable').getElementsByTagName('tbody')[0];

        closeSpan.onclick = function() {
            modal.style.display = 'none';
        };

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };

        searchInput.onkeyup = () => {
            const filter = searchInput.value.toLowerCase();
            let filteredData;

            if (filter.startsWith('*') && filter.endsWith('*')) {
                const trimmedFilter = filter.slice(1, -1);
                filteredData = this.garageData.filter(garage =>
                    garage.trading_name.toLowerCase().includes(trimmedFilter)
                );
            } else if (filter.startsWith('*')) {
                const trimmedFilter = filter.slice(1);
                filteredData = this.garageData.filter(garage =>
                    garage.trading_name.toLowerCase().endsWith(trimmedFilter)
                );
            } else if (filter.endsWith('*')) {
                const trimmedFilter = filter.slice(0, -1);
                filteredData = this.garageData.filter(garage =>
                    garage.trading_name.toLowerCase().startsWith(trimmedFilter)
                );
            } else {
                filteredData = this.garageData.filter(garage =>
                    garage.trading_name.toLowerCase().startsWith(filter)
                );
            }

            this.populateGarageTable(filteredData);
        };

        document.getElementById('okButton').onclick = () => {
            if (this.selectedGarageId) {
                console.log('this.recordId ', this.recordId )
                console.log('this.selectedGarageId', this.selectedGarageId)
                let newData = {tester_id: this.recordId , garage_id: this.selectedGarageId}
                createRecord('tester_garages', newData).then(success => {
                    console.log('success', success)
                    let html = `<tr>
                                    <td data-garage-id='${this.selectedGarageId}' class='data-launch-open-garage-record-from-tester-garages-subgrid'>${this.selectedGarageName}</td>
                                    <td>${this.selectedGarageId}</td> 
                                    <td><i class="bi bi-trash data-launch-subgrid-delete-item" data-id='${this.selectedGarageId}'></i></td>       
                                </tr>`
                    document.getElementById('tester-garages-table-body').insertAdjacentHTML('afterbegin', html);
                    
                    modal.style.display = 'none';
                },
                error => {
                    console.error(error)
                })
            } else {
                // alert('Please select a garage.');
                this.showCRUDAlert('Please select a garage', 'error');
            }
        };
    }

    populateGarageTable(data) {
        const garageTable = document.getElementById('garageTable').getElementsByTagName('tbody')[0];
        
        // Sort the data by trading_name in alphabetical order
        data.sort((a, b) => {
            const nameA = a.trading_name.toLowerCase();
            const nameB = b.trading_name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
    
        garageTable.innerHTML = ''; // Clear the table
        data.forEach(garage => {
            const row = garageTable.insertRow();
            row.setAttribute('data-id', garage.id);
            row.setAttribute('data-garage-name', garage.trading_name);
            row.onclick = () => {
                this.selectGarageRow(row);
            };
            const cell = row.insertCell(0);
            cell.textContent = garage.trading_name;
        });
        
    }

    selectGarageRow(row) {
        const rows = document.getElementById('garageTable').getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            rows[i].classList.remove('tester-record-associated-garages-selected');
        }
        row.classList.add('tester-record-associated-garages-selected');
        this.selectedGarageId = row.getAttribute('data-id');
        this.selectedGarageName = row.getAttribute('data-garage-name')
        console.log('the garage selected (selectedGarageId) is ', this.selectedGarageId)
    }
    showTesterTrainingRecordsModal() {
        this.testersTrainingFiles = []
        document.getElementById(`testersTrainingTableBody_${this.id}`).innerHTML = ''
        document.getElementById('testerTrainingRecordModal').style.display = 'block';
        document.getElementById(`testersTrainingUploadBanner_${this.id}`).style.display = 'block';
        document.getElementById(`data-launch-upload-testers-training-document_${this.id}`).style.display = 'none'
        // Reset fields
        document.getElementById('trainingSubject').value = '';
        document.getElementById('date').value = '';
        document.getElementById('duration').value = '';
        document.getElementById('trainingTopics').value = '';
        document.getElementById('testerTrainingRecordId').value = '';
    }
    showTesterTrainingRecordsDetails(id) {
        this.testerTrainingRecordId = id
        console.log('this training record id', this.testerTrainingRecordId)
        this.testersTrainingFiles = []
        document.getElementById(`testersTrainingTableBody_${this.id}`).innerHTML = ''
        document.getElementById('testerTrainingRecordModal').style.display = 'block';
        document.getElementById(`testersTrainingUploadBanner_${this.id}`).style.display = 'none';
        document.getElementById(`data-launch-upload-testers-training-document_${this.id}`).style.display = 'block'
        let record;        
        for (let i = 0; i < this.testerTrainingRecordsData.length; i++) {
            if (this.testerTrainingRecordsData[i].id === parseInt(id)) {
                record = this.testerTrainingRecordsData[i];
                break;
            }
        }
        document.getElementById('trainingSubject').value = record.training_subject || '';
        document.getElementById('date').value = record.date.split('T')[0] || '';
        document.getElementById('duration').value = record.duration || '';
        document.getElementById('trainingTopics').value = record.training_topics || '';
        document.getElementById('testerTrainingRecordId').value = record.id || '';
        fetchData('data_launch_images', 100, 0, null, null, this.id,null, null, null, parseInt(this.testerTrainingRecordId)).then(
            res => {
                console.log('data_launch_images res', res)
                let imageData = res
                this.testersTrainingFiles = res

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
                      document.getElementById(`testersTrainingTableBody_${this.id}`).innerHTML = html;
                    })
                    .catch(err => {
                      console.error('Error building HTML:', err);
                    });
            },
            err => {
                console.log('error', err)
            }
        )
    }

    saveNewTesterTrainingRecordsRecord() {
        // Gathering data from the modal form
        const trainingSubject = document.getElementById('trainingSubject').value;
        const date = document.getElementById('date').value;
        const duration = document.getElementById('duration').value;
        const trainingTopics = document.getElementById('trainingTopics').value;
        const testerTrainingRecordId = document.getElementById('testerTrainingRecordId').value;

   
        // Creating the object to send to the server
        const testerTrainingRecordsData = {
            tester_id: this.id,
            training_subject: trainingSubject,
            date: date,
            duration: duration,
            training_topics: trainingTopics,
            created_by_name: user_FIRST_NAME + ' ' + user_LAST_NAME,
            user_id: user_ID
        };
    
        // Debugging
        console.log('testerTrainingRecordsData', testerTrainingRecordsData);
        console.log('testerTrainingRecordId', testerTrainingRecordId);
    
        if (testerTrainingRecordId === "") {
            // Sending the data to the server to create a new record
            createRecord('data_launch_tester_training_records', testerTrainingRecordsData).then(res => {
                // for (let i = 0; i < this.testersTrainingFiles.length; i++) {
                //     this.testersTrainingFiles[i].tester_id = this.id
                //     this.testersTrainingFiles[i].record_id = res.id
                //     this.testersTrainingFiles[i].record_type = 'tester_training_images'
                //     console.log('heres what im trying to send to data_launch_images ' , this.testersTrainingFiles[i])
                //     createRecord('data_launch_images', this.testersTrainingFiles[i]).then(result =>{
                //         console.log('successfully created data launch images result', result)
                //     }, err => {
                //         console.error(err)
                //     })                  
                // }               
                // console.log('data_launch_tester_training_records res', res);
                this.injectDataIntoTesterTrainingRecordsSubgrid();
            }, err => { 
                console.error(err); 
            });
        } else {
            // Updating the existing record
            let recordId = parseInt(testerTrainingRecordId);
            testerTrainingRecordsData.id = recordId;
            updateRecord('data_launch_tester_training_records', recordId, testerTrainingRecordsData).then(res => {
                console.log('data_launch_tester_training_records res', res);
                // for (let i = 0; i < this.testersTrainingFiles.length; i++) {
                //     this.testersTrainingFiles[i].tester_id = this.id
                //     this.testersTrainingFiles[i].record_id = res.id
                //     this.testersTrainingFiles[i].record_type = 'tester_training_images'
                //     console.log('heres what im trying to send to data_launch_images ' , this.testersTrainingFiles[i])
                //     createRecord('data_launch_images', this.testersTrainingFiles[i]).then(result =>{
                //         console.log('successfully created data launch images result', result)
                //     }, err => {
                //         console.error(err)
                //     })                  
                // }
                for (let i = 0; i < this.testerTrainingRecordsData.length; i++) {
                    if (this.testerTrainingRecordsData[i].id === recordId) {
                        this.testerTrainingRecordsData[i] = res;
                    }        
                }
                this.injectDataIntoTesterTrainingRecordsSubgrid();
            }, err => { 
                console.error(err); 
            });
        }

    }
    
    // closeTheSimpleImageUploadWindow (files) {
    //     document.getElementById('simple-file-upload-window').classList.remove('active')
    //     document.getElementById('data-launch-simple-image-upload-close-button').classList.remove('active')        
    //     // document.getElementById('simple-file-upload-window').innerHTML = `<input id="uploader-preview-here-1335" class="simple-file-upload" type="hidden" data-template="frosty" data-maxFileSize="50">`
    //     console.log('files for the image upload', files)
        
    //     files.forEach(file => {
    //         let match = false
    //         for (let i = 0; i < this.testersTrainingFiles.length; i++) {
    //             if (this.testersTrainingFiles[i].cdnUrl === file.cdnUrl) {
    //                 match = true
    //             }
    //         }
    //         if (match === false) {
    //             this.testersTrainingFiles.push(file)
    //         }        
    //     })
    //     let html = ''
    //     for (let i = 0; i < this.testersTrainingFiles.length; i++) {
    //         html += `
    //             <tr id='tester_training_files_row_${i}'>
    //                 <td id='tester_training_files_row_${i}_name'>${this.testersTrainingFiles[i].name}</td>
    //                 <td id='tester_training_files_row_${i}_type'>${this.testersTrainingFiles[i].type}</td>
    //                 `
    //         if (this.testersTrainingFiles[i].type === 'application/pdf') {
    //             html += `<td id='tester_training_files_row_${i}_cdnUrl'><a target="_blank" href="${this.testersTrainingFiles[i].cdnUrl}"><i class="bi bi-file-earmark-pdf-fill"></i></a></td>`
    //         }
    //         else if (this.testersTrainingFiles[i].type === 'application/msword') {
    //             html += `<td id='tester_training_files_row_${i}_cdnUrl'><a target="_blank" href="${this.testersTrainingFiles[i].cdnUrl}"><i class="bi bi-file-earmark-word-fill"></i></a></td>`
    //         }
    //         else {
    //             html += `<td id='tester_training_files_row_${i}_cdnUrl'><a target="_blank" href="${this.testersTrainingFiles[i].cdnUrl}"><img style='height: 50px; width: 50px;' src="${this.testersTrainingFiles[i].cdnUrl}"></a></td>`
    //         }
    //         html += `
    //                 <td><i class="bi bi-trash data-launch-subgrid-delete-tester-training-document-item" data-row='${i}' data-id='${this.testersTrainingFiles[i].id}'></i></td>  
    //             </tr>
    //         `            
    //     }
    //     document.getElementById(`testersTrainingTableBody_${this.id}`).innerHTML = html
    // }
    deleteTrainingDocumentImage (id, rowId) {
        console.log('here to delete the note record ', id)
        deleteRecord('data_launch_images', parseInt(id)).then(res => {
            console.log('succesfully deleted image ? ', res)
            document.getElementById(`tester_training_files_row_${rowId}`).style.display = 'none'
            this.testersTrainingFiles = this.testersTrainingFiles.filter(file => file.id !== id);
        },
        error => {
            console.error(error)
        })
    }
    addListeners () {
        console.log('adding event listeners to testers class')
        document.getElementById('testerRecordsPage').addEventListener('click', (event) => {
            event.stopPropagation()
            console.log('here lets go whats going on ')
            if (event.target.classList.contains('data-launch-testers-view-record-click')) {
                console.log('hope i get the right value for the tester')
                let id = event.target.parentElement.dataset.id
                console.log('id of the tester is ', id)
                this.currentRecordId = id
                this.openForm(true, id)
            }
             else if (event.target.classList.contains('data-launch-testers-menu-toggle-trigger')) {
                console.log('reaching here garage menu toggle ?')
                let garageSideMenu = document.getElementById("data-launch-testers-tabs-container")
                garageSideMenu.classList.toggle('active')
                if (garageSideMenu.classList.contains('active')) {
                    let x = Array.from(document.getElementsByClassName('bi-chevron-double-right'))
                    x.forEach(icon => {
                        icon.classList.remove('bi-chevron-double-right')
                        icon.classList.add('bi-chevron-double-left')
                    })
                }
                else {
                    let x = Array.from(document.getElementsByClassName('bi-chevron-double-left'))
                    x.forEach(icon => {
                        icon.classList.remove('bi-chevron-double-left')
                        icon.classList.add('bi-chevron-double-right')
                    })
                }                
            } 
            else if (event.target.classList.contains('data-launch-upload-testers-training-document')) {
                console.log('yup we want this')
                document.getElementById('tester-document-upload-popup-window').classList.add('active')
            }
            else if (event.target.classList.contains('data-launch-record-back-to-list-view')) {
                // this.renderHTMLHeader()
                this.saveAndClose()
            }
            else if (event.target.classList.contains('data-launch-tester-delete-confirm')) {
               this.secureAction('delete', 'data_launch_tester_records', this.testerRecordToDeleteId, null).then(
                    success => {
                        console.log('success', success)
                        document.getElementById('data-launch-testers-delete-confirmation-box').style.display = 'none'
                        document.getElementById(`data-launch-tester-records-table-view-${this.testerRecordToDeleteId}`).style.display = 'none'
                        // document.getElementById(`garage_mot_equipment_${this.id}_${id}`).style.display = 'none';
                    },
                    err => {
                        console.log(err)
                    }
                )
            }
            else if (event.target.classList.contains('data-launch-tester-delete-cancel')) {
                document.getElementById('data-launch-testers-delete-confirmation-box').style.display = 'none'
            }
            else if (event.target.classList.contains('data-launch-delete-tester-record')) {
                // this.testerRecordToDeleteId = event.target.attributes["data-id"].value;
                // let name = event.target.attributes["data-tester-name"].value;
                // let valueToInject = `${name} (${this.testerRecordToDeleteId })`
                // document.getElementById('data-launch-delete-testers-dialogue-box-inject-name-strong-element').innerHTML = valueToInject
                // document.getElementById('data-launch-testers-delete-confirmation-box').style.display = 'block'
                let id = event.target.attributes["data-id"].value;
                let delModal = document.getElementById('testersDelModal');
                delModal.classList.add('active');
                document.getElementById('confirmDelete').setAttribute('data-id', id)
                document.getElementById('confirmDelete').setAttribute('data-table', 'data_launch_tester_records')
                document.getElementById('confirmDelete').setAttribute('data-element-id', `data-launch-tester-records-table-view-${id}`)
            }
            else if (event.target.classList.contains('del-confirmation-modal__btn--confirm')) {
                let delModal = document.getElementById('testersDelModal');
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
                let delModal = document.getElementById('testersDelModal');
                delModal.classList.remove('active'); 
            }
            else if (event.target.classList.contains('data-launch-subgrid-delete-document-item')) {
                let fileKey = event.target.attributes["data-name"].value
                let id =  event.target.attributes["data-id"].value                
                deleteTheThing(fileKey)
                deleteRecord('data_launch_images', parseInt(id)).then(
                    success => {
                        console.log('success', success)
                        const row = event.target.closest('tr');
                        if (row) {
                            row.remove(); // Remove the row from the DOM
                        }
                    },
                    err => {
                        console.log(`Deletion Not Successful :  ${err}`)
                        this.showCRUDAlert('Deletion Not Successful', 'error');
                    }
                )                
            }
            else if (event.target.classList.contains('mot-calibration-image-preview')) {
                let src = event.target.attributes["src"].value
                let isItImg = event.target.attributes["data-image"].value
                if (isItImg === 'true') {
                    /// if the document selected is an image
                    document.getElementById(`testers-img_${this.id}`).src = src;
                    document.getElementById(`testers-anchor_${this.id}`).href = src;
                    document.getElementById(`testers-img_${this.id}`).style.display = 'block';
                    document.getElementById(`testers-filename_${this.id}`).style.display = 'none';
                    document.getElementById(`testers-large-image-preview-window_${this.id}`).style.display = 'block';
                    document.getElementById(`testers-screen-overlay-${this.id}`).style.display = 'block';
                }
                else {
                    /// if the document selected is a document
                    let name = event.target.attributes["data-name"].value
                    document.getElementById(`testers-img_${this.id}`).style.display = 'none';
                    document.getElementById(`testers-anchor_${this.id}`).href = src;
                    document.getElementById(`testers-filename_${this.id}`).innerHTML = name;            
                    document.getElementById(`testers-large-image-preview-window_${this.id}`).style.display = 'block';
                    document.getElementById(`testers-screen-overlay-${this.id}`).style.display = 'block';
                }       
            }
            else if (event.target.classList.contains('garages-mot-calibration-image-preview-window-close-button')) {
                console.log('getting here')
                document.getElementById(`testers-screen-overlay-${this.id}`).style.display = 'none'
                document.getElementById(`testers-large-image-preview-window_${this.id}`).style.display = 'none'
            }
            else if (event.target.classList.contains('testers-document-upload-button')) {
                event.preventDefault();  // Prevent form submission and page reload
                document.getElementById('tester-document-upload-popup-window').classList.remove('active');
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
                    console.log('Upload result:', result);  // Log the returned metadata
                    
                    if (response.ok) {
                      this.showCRUDAlert('File Uploaded Successfully', 'success');
                      // Use other metadata as needed
                      let imgObj = {
                        name: result.fileName,
                        record_id: this.testerTrainingRecordId,
                        record_type: 'tester_training_record',
                        tester_id: this.id,
                        etag: result.etag,
                        url: result.previewUrl
                      }
                      createRecord('data_launch_images', imgObj).then(
                        result => {
                            console.log('data launch images table record created successfully', result)
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
                            document.getElementById(`testersTrainingTableBody_${this.id}`).innerHTML += html
                        },
                        error => {
                            console.error(error)
                        }
                      )
                      console.log('ETag:', result.etag);  // ETag
                      console.log('File Key in S3:', result.key);  // File name used in S3
                    } else {
                      this.showCRUDAlert('File Upload Failed \n Please try again or contact your administrator', 'error');
                    }
                  } catch (error) {
                    console.error('Error uploading file:', error);
                    this.showCRUDAlert('File Upload Failed \n Please try again or contact your administrator', 'error');
                  }
                })();
            }
            else if (event.target.classList.contains('data-launch-subgrid-delete-tester-training-document-item')) {
                let id = event.target.attributes["data-id"].value
                let rowId = event.target.attributes["data-row-id"].value
                this.deleteTrainingDocumentImage(id, rowId)
            }
            else if (event.target.classList.contains('tester-training-record-close')) {
                document.getElementById('testerTrainingRecordModal').style.display = 'none'
            }
            else if (event.target.classList.contains('data-launch-save-tester-training-record-btn')) {
                document.getElementById('testerTrainingRecordModal').style.display = 'none'
                this.saveNewTesterTrainingRecordsRecord()
            }            
            else if (event.target.classList.contains('data-launch-create-new-training-record')) {
                this.showTesterTrainingRecordsModal()
            }
            else if (event.target.classList.contains('data-launch-table-clickable-tester-training-record')) {
                let id = event.target.attributes["data-id"].value
                this.showTesterTrainingRecordsDetails(id)
            }
            else if (event.target.classList.contains('data-launch-table-clickable-tester-note-row')) {
                let id = event.target.attributes["data-id"].value
                this.openNotesModalWithDetails(id)
            }            
            else if (event.target.classList.contains('data-launch-subgrid-delete-tester-training-record-item')) {
                let id = event.target.attributes["data-id"].value
                deleteRecord('data_launch_tester_training_records', parseInt(id)).then(
                    success => {
                        console.log('success', success)
                        document.getElementById(`testerTrainingRecords_${this.id}_${id}`).style.display = 'none'
                    },
                    err => {
                        console.log(`Deletion Not Successful :  ${err}`)
                        this.showCRUDAlert('Deletion Not Successful \n Please try again or contact your administrator', 'error');
                    }
                )                
            }
            else if (event.target.classList.contains('data-launch-add-new-tester-record')) {
                this.openForm(false)
            }
            else if (event.target.classList.contains('data-launch-testers-note-close-button')) {
                this.closeNotesModal()
            }
            
            else if (event.target.classList.contains('data-launch-subgrid-delete-note-item')) {
                let id = event.target.attributes["data-note-id"].value
                this.deleteNoteRecord(id)
            }
            else if (event.target.classList.contains('data-launch-save-testers-note')) {
                console.log('data-launch-notes-modal-box-popup save button clicked')
                this.saveTestersNote()
            }
            else if (event.target.classList.contains('data-launch-create-new-note-record')) {
                let testerID = event.target.attributes["data-launch-tester-id"].value
                console.log('testerID', testerID)
                /// INVOKE THE NOTES MODAL SECTION HERE ///
                this.openNotesModal();
            }
            else if (event.target.classList.contains('data-launch-open-garage-record-from-tester-garages-subgrid')) {
                console.log('should be opening the garage record about now')
                let garageId = event.target.attributes["data-garage-id"].value
                console.log('garageId is ', garageId)
                changePage(null, garageId, 'garage')
            }
            else if (event.target.classList.contains('data-launch-subgrid-delete-item')) {
                let id = event.target.attributes["data-id"].value
                console.log('id of the garage that needs to be deleted is ', id)
                deleteRecord('tester_garages', parseInt(id)).then(
                    success => {
                        console.log('success', success)
                        this.injectDataIntoTheSubgrid()
                    },
                    err => {
                        console.log(`Deletion Not Successful :  ${err}`)
                        this.showCRUDAlert('Deletion Not Successful \n Please try again or contact your administrator', 'error');
                    }
                )                
            }            
            else if (event.target.classList.contains('data-launch-associate-new-garage-record')) {
                console.log('add a new garage record to the tester')
                // this is where this button code is invoked from ///
                this.openGarageModal();
            }
            else if (event.target.classList.contains('data-launch-nav-menu-plus-icon')) {
                this.openForm(false)
            }
            else if (event.target.classList.contains('data-launch-tabs-clickable-testers')) {
                // data-launch-testers
                let x = Array.from(document.getElementsByClassName('data-launch-testers-screen'))
                x.forEach(el => {
                    if (el.classList.contains('active')) {
                        el.classList.remove('active')
                    }
                })
                let y = Array.from(document.getElementsByClassName('data-launch-tabs-clickable-testers'))
                y.forEach(el => {
                    if (el.classList.contains('active')) {
                        el.classList.remove('active')
                    }
                })
                let z = Array.from(document.getElementsByClassName('data-launch-tabs-parent-li-testers'))
                z.forEach(el => {
                    if (el.classList.contains('active')) {
                        el.classList.remove('active')
                    }
                })
                let page = event.target.attributes["data-launch-menu-item"].value
                document.getElementById(`testers_parent_li_${page}`).classList.add('active')
                document.getElementById(`data-launch-testers-${page}`).classList.add('active')
                document.getElementById(`data-launch-testers-${this.id}-what-tab`).innerHTML = page
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
                this.filterResetAll()
            }
            else if (event.target.classList.contains('data-launch-filter-icon')) {
                console.log('is this toggling the filter container?')
                document.getElementById('data-launch-testing-station-filter-container').classList.toggle('data-launch-inactive')
            }
        })
        document.getElementById('testerRecordsPage').addEventListener('change', (event) => {
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
                console.log('values empty apparently')
                let value = event.target.value
                this.filterRemove(header,value)
            }
            else if (event.target.classList.contains('data-launch-field-editable')) {
                let field = event.target.attributes["data-launch-field"].value
                let recordID = document.getElementById('currentRecordID').innerHTML
                this.data.forEach(row=> {
                    if (row.vtsId === recordID) {
                        console.log('updating data ???', event.target.value)
                        row[field] = event.target.value
                    }
                })
            }
         })
    }
    showCRUDAlert(message, type) {
        const alertBox = document.getElementById(`data-launch-crud-alert-box-tester`);
        const alertIcon = document.getElementById(`data-launch-crud-alert-icon-tester`);
        const alertMessage = document.getElementById(`data-launch-crud-alert-message-tester`);
    
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
            if (table === 'data_launch_garage_reminders') {
                return true
            }
            else if (table === 'data_launch_tester_records') {
                if (USER_RECORD.data_launch_tester_records_create === 1) {
                    return true
                }
                else {
                    return false
                }
            }           
        }
        else if (action === 'read') {
            if (table === 'data_launch_tester_records') {
                if (USER_RECORD.data_launch_tester_records_read === 1) {
                    return true
                }
                else {
                    return false
                }
            }          
        }
        else if (action === 'update') {
            if (table === 'data_launch_tester_records') {
                if (USER_RECORD.data_launch_tester_records_update === 1) {
                    return true
                }
                else {
                    return false
                }
            }          
        }
        else if (action === 'delete') {
            if (table === 'data_launch_tester_records') {
                if (USER_RECORD.data_launch_tester_records_delete === 1) {
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
    filterApply (header,value, filterJustRemoved) {
        console.log('filterApply HIT' , header, value, filterJustRemoved)
        // if a filter has just been removed and there are now 0 filters
        if (filterJustRemoved === true && this.filters.length === 0) {
            console.log('filterApply LANDED HERE    if (filterJustRemoved === true && this.filters.length === 0) ', header, value, filterJustRemoved)
            this.filteredData = []
            this.filters = []
            let html = this.buildTableBody(this.data)
            document.getElementById('data-launch-tester-records-table-body').innerHTML = html
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
            let html = this.buildTableBody(furtherFilteredData)
            document.getElementById('data-launch-tester-records-table-body').innerHTML = html
        }
        else if (this.filters.length === 0) {       
            console.log('filterApply LANDED HERE    else if (this.filters.length === 0) {    ', header, value, filterJustRemoved)  
            this.filters.push({header: header, value: value})
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i][header].toUpperCase().includes(value.toUpperCase()) || this.data[i][header].includes(value)) {
                    this.filteredData.push(this.data[i])
                }                
            }
            let html = this.buildTableBody(this.filteredData)
            document.getElementById('data-launch-tester-records-table-body').innerHTML = html
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
            let html = this.buildTableBody(furtherFilteredData)
            document.getElementById('data-launch-tester-records-table-body').innerHTML = html
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
        let html = this.buildTableBody(this.data)
        document.getElementById('data-launch-tester-records-table-body').innerHTML = html
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
                <tr class="responsive-table__row export-row" data-export-row="${exportRow}" data-export-header="VTS Site No" data-export-val="${data[i].vtsSiteNo}" data-vts-pro-id="${data[i].vtsId}">
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testers-view-record-click" data-export-row="${exportRow}" data-export-header="VTS ID" data-export-val="${data[i].vtsId}" scope="row">${data[i].vtsId}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--name export-record data-launch-testers-view-record-click" data-export-row="${exportRow}" data-export-header="Trading Name" data-export-val="${data[i].tradingName}" scope="row">
                        <svg class="user-icon" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
                            <path d="m256.025 483.334 101.429-25.614c57.895-48.074 94.771-120.586 94.771-201.719 0-125.144-87.711-229.801-205.012-255.852-137.316 4.631-247.213 117.407-247.213 255.851 0 71.112 29 135.446 75.812 181.836z" fill="#cbe2ff" />
                            <path d="m446.914 256c0 83.915-40.381 158.391-102.765 205.079l92.031-23.241c46.815-46.39 75.82-110.724 75.82-181.838 0-141.385-114.615-256-256-256-11.024 0-21.886.698-32.543 2.05 126.019 15.988 223.457 123.59 223.457 253.95z" fill="#bed8fb" />
                            <path d="m319.621 96.952c0-13.075-10.599-23.674-23.674-23.674h-81.582c-30.091 0-54.485 24.394-54.485 54.485v60.493h192.209v-59.635c0-13.075-10.599-23.674-23.674-23.674h-.798c-4.416 0-7.996-3.579-7.996-7.995z" fill="#365e7d" />
                            <path d="m328.415 104.947h-.798c-4.416 0-7.996-3.58-7.996-7.996 0-13.075-10.599-23.674-23.674-23.674h-8.945v114.978h65.086v-59.635c.001-13.073-10.599-23.673-23.673-23.673z" fill="#2b4d66" />
                            <path d="m425.045 372.355c-6.259-6.182-14.001-10.963-22.79-13.745l-69.891-22.128-76.348-2.683-76.38 2.683-69.891 22.128c-23.644 7.486-39.713 29.428-39.713 54.229v19.094c44.789 47.328 107.451 77.568 177.183 79.92 78.128-17.353 143.129-69.576 177.83-139.498z" fill="#4a80aa" />
                            <path d="m441.968 431.932v-19.094c0-17.536-8.04-33.635-21.105-44.213-37.111 75.626-110.422 130.268-197.346 141.317 10.492 1.329 21.178 2.038 32.026 2.057 10.423-.016 20.708-.62 30.824-1.782 61.031-7.212 115.485-35.894 155.601-78.285z" fill="#407093" />
                            <path d="m261.796 508.168c15.489-30.751 55.822-118.067 44.321-172.609l-50.101-19.499-50.148 19.5c-11.856 56.225 31.37 147.277 45.681 175.29 3.442-.826 6.859-1.721 10.247-2.682z" fill="#e4f6ff" />
                            <path d="m288.197 483.789-20.314-79.917h-23.767l-20.264 79.699 25.058 27.897c6.361-1.457 12.634-3.146 18.81-5.057z" fill="#e28086" />
                            <path d="m249.302 511.905c2.075.054 4.154.091 6.241.095 2.415-.004 4.822-.046 7.222-.113l12.907-14.259c-10.159 3.564-20.61 6.506-31.309 8.779z" fill="#dd636e" />
                            <path d="m298.774 328.183v-45.066h-85.58v45.066c0 23.632 42.79 49.446 42.79 49.446s42.79-25.814 42.79-49.446z" fill="#ffddce" />
                            <path d="m352.089 180.318h-16.359c-9.098 0-16.473-7.375-16.473-16.473v-9.015c0-11.851-11.595-20.23-22.847-16.511-26.243 8.674-54.579 8.676-80.823.006l-.031-.01c-11.252-3.717-22.845 4.662-22.845 16.512v9.019c0 9.098-7.375 16.473-16.473 16.473h-16.358v26.938c0 6.883 5.58 12.464 12.464 12.464 2.172 0 3.939 1.701 4.076 3.869 2.628 41.668 37.235 74.654 79.565 74.654 42.33 0 76.937-32.986 79.565-74.654.137-2.167 1.904-3.869 4.076-3.869 6.883 0 12.464-5.58 12.464-12.464v-26.939z" fill="#ffddce" />
                            <path d="m335.73 180.318c-9.098 0-16.473-7.375-16.473-16.473v-9.015c0-11.851-11.595-20.23-22.847-16.511-3.108 1.027-6.247 1.923-9.407 2.707v88.972c-.438 28.948-16.3 54.142-39.725 67.758 2.861.311 5.763.486 8.706.486 42.33 0 76.937-32.986 79.565-74.654.137-2.167 1.904-3.869 4.076-3.869 6.883 0 12.464-5.58 12.464-12.464v-26.938h-16.359z" fill="#ffcbbe" />
                            <g fill="#f4fbff">
                                <path d="m213.194 316.06-33.558 27.267 35.192 43.513c4.281 4.168 11.019 4.424 15.605.594l26.465-22.107z" />
                                <path d="m298.79 316.06-41.892 49.267 24.874 21.268c4.557 3.896 11.327 3.7 15.651-.453l34.94-42.815z" />
                            </g>
                            <path d="m213.194 316.06-49.256 24.199c-3.75 1.842-5.256 6.404-3.341 10.117l9.65 18.71c2.501 4.848 1.578 10.756-2.282 14.61-1.987 1.983-4.139 4.131-6.004 5.993-3.338 3.332-4.537 8.255-3.067 12.737 11.651 35.517 67.725 89.828 88.946 109.478 1.427.038 2.857.064 4.29.08-15.389-29.933-69.922-143.655-38.936-195.924z" fill="#365e7d" />
                            <path d="m344.019 383.695c-3.861-3.854-4.783-9.762-2.282-14.61l9.65-18.71c1.915-3.713.409-8.275-3.341-10.117l-49.256-24.198c30.978 52.255-23.517 165.929-38.923 195.9 1.448-.025 2.893-.061 4.335-.109 21.265-19.695 77.248-73.94 88.888-109.424 1.47-4.482.271-9.405-3.067-12.737-1.865-1.863-4.017-4.012-6.004-5.995z" fill="#365e7d" />
                            <path d="m256.898 365.327-26.06 21.764 13.278 16.781h23.767l13.279-17.771z" fill="#dd636e" />
                        </svg>
                        ${data[i].tradingName}
                    </td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testers-view-record-click" data-export-row="${exportRow}" data-export-header="Contact Main No"                data-export-val="${data[i].contactMainNo}" scope="row">${data[i].contactMainNo}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testers-view-record-click" data-export-row="${exportRow}" data-export-header="VTS Postcode"                data-export-val="${data[i].vtsPostcode}" scope="row">${data[i].vtsPostcode}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testers-view-record-click" data-export-row="${exportRow}" data-export-header="Date Called"                data-export-val="${data[i].dateCalled}" scope="row">${data[i].dateCalled}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testers-view-record-click" data-export-row="${exportRow}" data-export-header="CPD Needed"                data-export-val="${data[i].cpdNeeded}" scope="row">${data[i].cpdNeeded}</td>
                    <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testers-view-record-click" data-export-row="${exportRow}" data-export-header="Consultant"                data-export-val="${data[i].consultant}" scope="row">${data[i].consultant}</td>
                </tr>` 
                exportRow++           
            }
        }      
        return html
    }
    saveRecord () {
        if (!this.minimumDataValidation()) {
            this.showCRUDAlert('Please provide a User ID and First Name', 'error');
            return; // stop execution here
        } 
        this.saveDetailsAboutTheRecord(false)
    }
    showSavedBanner () {
        document.getElementById('data-launch-saved-record-banner').classList.add('active')
        setTimeout(() => {
            document.getElementById('data-launch-saved-record-banner').classList.remove('active')
        }, 4000);
    }
    saveAndClose () {
        if (!this.minimumDataValidation()) {
            this.showCRUDAlert('Please provide a User ID and First Name', 'error');
            return; // stop execution here
        }        
        // this effectively deletes the element, including all of the event listeners, and then creates a new copy with zero event listeners attached
        this.saveDetailsAboutTheRecord(true)
        const oldElement = document.getElementById('testerRecordsPage');
        const newElement = oldElement.cloneNode(true); // Cloning with all children and attributes
        oldElement.parentNode.replaceChild(newElement, oldElement);
    }
    minimumDataValidation() {
        /// this is NOT A SYSTEM ID, this is the TESTERID that testers get provided with by the DVSA or equivalent
        let testerUserId = document.getElementById('user_id_val').value
        let firstName = document.getElementById('first_name_val').value
        console.log('testerUserId', testerUserId)
        console.log('firstName', firstName)
        if (testerUserId === '' || firstName === '') {
            return false
        }
        else {
            return true
        }        
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
                fields[i].type === 'date' ) {
                if (document.getElementById(`${fields[i].field}_val`).value) {
                    console.log('this text field contains data ', fields[i], document.getElementById(`${fields[i].field}_val`).value)
                    createRecordObject[fields[i].field] = document.getElementById(`${fields[i].field}_val`).value
                }
            }
            else if (fields[i].type === 'checkbox') {
                if (document.getElementById(`${fields[i].field}_val`).checked) {
                    console.log('this text field contains data ', fields[i], document.getElementById(`${fields[i].field}_val`).checked)
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
            this.newRecord = false
            createRecordObject.id = tester_record_next_id
            createRecord('data_launch_tester_records', createRecordObject).then(res => {
                    console.log('CREATED NEW TESTER RECORD IN DB', res)
                    tester_record_next_id++
                    this.recordId = res.id                
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
            updateRecord('data_launch_tester_records', this.recordId, createRecordObject).then(
                res => {
                    console.log('UPDATED EXISTING TESTER RECORD ???', res)
                    console.log('UPDATED EXISTING GARAGE RECORDS ???', res)
                    for (let i = 0; i < this.data.length; i++) {
                        if (this.data[i].id === createRecordObject.id ) {
                            this.data[i] = createRecordObject                          
                        }        
                    }
                    for (let i = 0; i < testersData.length; i++) {
                        if (testersData[i].id === createRecordObject.id) {
                            testersData[i] = createRecordObject                         
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
                <td class="responsive-table__body__text responsive-table__body__text--name export-record data-launch-testers-view-record-click" data-export-row="${this.exportRow}" data-export-header="first_name Name" data-export-val="${rec.first_name}" scope="row">
					<svg class="user-icon" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
						<path d="m256.025 483.334 101.429-25.614c57.895-48.074 94.771-120.586 94.771-201.719 0-125.144-87.711-229.801-205.012-255.852-137.316 4.631-247.213 117.407-247.213 255.851 0 71.112 29 135.446 75.812 181.836z" fill="#cbe2ff" />
						<path d="m446.914 256c0 83.915-40.381 158.391-102.765 205.079l92.031-23.241c46.815-46.39 75.82-110.724 75.82-181.838 0-141.385-114.615-256-256-256-11.024 0-21.886.698-32.543 2.05 126.019 15.988 223.457 123.59 223.457 253.95z" fill="#bed8fb" />
						<path d="m319.621 96.952c0-13.075-10.599-23.674-23.674-23.674h-81.582c-30.091 0-54.485 24.394-54.485 54.485v60.493h192.209v-59.635c0-13.075-10.599-23.674-23.674-23.674h-.798c-4.416 0-7.996-3.579-7.996-7.995z" fill="#365e7d" />
						<path d="m328.415 104.947h-.798c-4.416 0-7.996-3.58-7.996-7.996 0-13.075-10.599-23.674-23.674-23.674h-8.945v114.978h65.086v-59.635c.001-13.073-10.599-23.673-23.673-23.673z" fill="#2b4d66" />
						<path d="m425.045 372.355c-6.259-6.182-14.001-10.963-22.79-13.745l-69.891-22.128-76.348-2.683-76.38 2.683-69.891 22.128c-23.644 7.486-39.713 29.428-39.713 54.229v19.094c44.789 47.328 107.451 77.568 177.183 79.92 78.128-17.353 143.129-69.576 177.83-139.498z" fill="#4a80aa" />
						<path d="m441.968 431.932v-19.094c0-17.536-8.04-33.635-21.105-44.213-37.111 75.626-110.422 130.268-197.346 141.317 10.492 1.329 21.178 2.038 32.026 2.057 10.423-.016 20.708-.62 30.824-1.782 61.031-7.212 115.485-35.894 155.601-78.285z" fill="#407093" />
						<path d="m261.796 508.168c15.489-30.751 55.822-118.067 44.321-172.609l-50.101-19.499-50.148 19.5c-11.856 56.225 31.37 147.277 45.681 175.29 3.442-.826 6.859-1.721 10.247-2.682z" fill="#e4f6ff" />
						<path d="m288.197 483.789-20.314-79.917h-23.767l-20.264 79.699 25.058 27.897c6.361-1.457 12.634-3.146 18.81-5.057z" fill="#e28086" />
						<path d="m249.302 511.905c2.075.054 4.154.091 6.241.095 2.415-.004 4.822-.046 7.222-.113l12.907-14.259c-10.159 3.564-20.61 6.506-31.309 8.779z" fill="#dd636e" />
						<path d="m298.774 328.183v-45.066h-85.58v45.066c0 23.632 42.79 49.446 42.79 49.446s42.79-25.814 42.79-49.446z" fill="#ffddce" />
						<path d="m352.089 180.318h-16.359c-9.098 0-16.473-7.375-16.473-16.473v-9.015c0-11.851-11.595-20.23-22.847-16.511-26.243 8.674-54.579 8.676-80.823.006l-.031-.01c-11.252-3.717-22.845 4.662-22.845 16.512v9.019c0 9.098-7.375 16.473-16.473 16.473h-16.358v26.938c0 6.883 5.58 12.464 12.464 12.464 2.172 0 3.939 1.701 4.076 3.869 2.628 41.668 37.235 74.654 79.565 74.654 42.33 0 76.937-32.986 79.565-74.654.137-2.167 1.904-3.869 4.076-3.869 6.883 0 12.464-5.58 12.464-12.464v-26.939z" fill="#ffddce" />
						<path d="m335.73 180.318c-9.098 0-16.473-7.375-16.473-16.473v-9.015c0-11.851-11.595-20.23-22.847-16.511-3.108 1.027-6.247 1.923-9.407 2.707v88.972c-.438 28.948-16.3 54.142-39.725 67.758 2.861.311 5.763.486 8.706.486 42.33 0 76.937-32.986 79.565-74.654.137-2.167 1.904-3.869 4.076-3.869 6.883 0 12.464-5.58 12.464-12.464v-26.938h-16.359z" fill="#ffcbbe" />
						<g fill="#f4fbff">
							<path d="m213.194 316.06-33.558 27.267 35.192 43.513c4.281 4.168 11.019 4.424 15.605.594l26.465-22.107z" />
							<path d="m298.79 316.06-41.892 49.267 24.874 21.268c4.557 3.896 11.327 3.7 15.651-.453l34.94-42.815z" />
						</g>
						<path d="m213.194 316.06-49.256 24.199c-3.75 1.842-5.256 6.404-3.341 10.117l9.65 18.71c2.501 4.848 1.578 10.756-2.282 14.61-1.987 1.983-4.139 4.131-6.004 5.993-3.338 3.332-4.537 8.255-3.067 12.737 11.651 35.517 67.725 89.828 88.946 109.478 1.427.038 2.857.064 4.29.08-15.389-29.933-69.922-143.655-38.936-195.924z" fill="#365e7d" />
						<path d="m344.019 383.695c-3.861-3.854-4.783-9.762-2.282-14.61l9.65-18.71c1.915-3.713.409-8.275-3.341-10.117l-49.256-24.198c30.978 52.255-23.517 165.929-38.923 195.9 1.448-.025 2.893-.061 4.335-.109 21.265-19.695 77.248-73.94 88.888-109.424 1.47-4.482.271-9.405-3.067-12.737-1.865-1.863-4.017-4.012-6.004-5.995z" fill="#365e7d" />
						<path d="m256.898 365.327-26.06 21.764 13.278 16.781h23.767l13.279-17.771z" fill="#dd636e" />
					</svg>
					${rec.first_name}
				</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testers-view-record-click" data-export-row="${this.exportRow}" data-export-header="last_name"                data-export-val="${rec.last_name}" scope="row">${rec.last_name}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testers-view-record-click" data-export-row="${this.exportRow}" data-export-header="phone_number"                data-export-val="${rec.phone_number}" scope="row">${rec.phone_number}</td>
                <td class="responsive-table__body__text responsive-table__body__text--types export-record data-launch-testers-view-record-click" data-export-row="${this.exportRow}" data-export-header="email_address"                data-export-val="${rec.email_address}" scope="row">${rec.email_address}</td>
            </tr>`
            console.log('html is ', html)
            document.getElementById('data-launch-tester-records-table-body').innerHTML('afterbegin', html);
            // document.getElementById('data-launch-testing-station-table-body').innerHTML += html
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
                    columns: 2,
                    name: 'summary'
                },
                fields: [
                    {
                        field: 'first_name',
                        label: 'First Name',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'last_name',
                        label: 'Last Name',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'phone_number',
                        label: 'Main Phone',
                        type: 'phone',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'email_address',
                        label: 'Email',
                        type: 'email',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'user_id',
                        label: 'UserID',
                        type: 'text',
                        section: 1,
                        column: 1
                    },
                    {
                        field: 'data_launch_notes',
                        type: 'data_launch_notes',
                        section: 1,
                        column: 2,
                        columnWidth: 2
                    }   
                ]
            },
            Garages: {
                        meta: {
                            columns: 1,
                            name: 'garages',
                            type: 'full'
                        },
                        fields: [
                            {
                                type: 'TestersGaragesSubgrid',
                                column: 1
                            }
                        ]
           },
           Training: {
                meta: {
                    columns: 1,
                    name: 'training',
                    type: 'full'
                },
                fields: [
                    {
                        type: 'trainingRecordsSubgrid',
                        column: 1
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
                html += `<li class="nav-item data-launch-tabs-parent-li-testers active modern-nav-item" id="testers_parent_li_${headers[key].meta.name}">
                            <a class="nav-link data-launch-tabs-clickable-testers active modern-nav-link" data-launch-menu-item="${headers[key].meta.name}" href="#">${key}</a>
                        </li>` 
                fistIteration = false
            }
            else {
            html +=     `<li class="nav-item data-launch-tabs-parent-li-testers modern-nav-item" id="testers_parent_li_${headers[key].meta.name}">
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
                    html += `<div class='data-launch-testers-screen row active' id='data-launch-testers-${fieldDataObj[key].meta.name}'>`
                    firstIteration = false
                }
                else {
                    html += `<div class='data-launch-testers-screen row' id='data-launch-testers-${fieldDataObj[key].meta.name}'>`
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
                                        <input id="${fieldDataObj[key].fields[t].field}_val" placeholder="${fieldDataObj[key].fields[t].label}" type='text' data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" value="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'phone') {
                                html += `<div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val" placeholder='${fieldDataObj[key].fields[t].label}' type='phone' value="${rec[fieldDataObj[key].fields[t].field]}" data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'email') {
                                html += ` <div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val" placeholder='${fieldDataObj[key].fields[t].label}' type='email' value="${rec[fieldDataObj[key].fields[t].field]}" data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable'>
                                            <a style='position: relative; top: -34%; left: 95%;' href="mailto:${typeof rec[fieldDataObj[key].fields[t].field] === 'undefined' ? '' : rec[fieldDataObj[key].fields[t].field]}"><i class="bi bi-envelope"></i></a>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'date') {
                                html += ` <div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val" placeholder='${fieldDataObj[key].fields[t].label}' type='date' value="${rec[fieldDataObj[key].fields[t].field]}" data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'multi-text') {
                                html += `<div class='data-launch-input-field-container data-launch-input-field-container-multi-line'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <textarea id="${fieldDataObj[key].fields[t].field}_val" class='data-launch-input-field-multi-line data-launch-field-editable' data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" data-launch-field-editable">${typeof rec[fieldDataObj[key].fields[t].field] !== undefined ? rec[fieldDataObj[key].fields[t].field] : ''}</textarea>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'checkbox') {
                                html += ` <div class='data-launch-input-field-container-checkbox'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val" type='checkbox' class='data-launch-input-field-checkbox data-launch-field-editable' data-launch-field="${rec[fieldDataObj[key].fields[t].field]}" checked="${rec[fieldDataObj[key].fields[t].field]}">
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'data_launch_notes') {
                                html += ` <div class='data-launch-notes-container'>
                                            <div class='data-launch-notes-table-cont'
                                            style="height: 60vh;overflow-y: auto;overflow-x: hidden;"
                                            id='data_launch_testers_notes_table_${this.id}'>
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
                            else if (fieldDataObj[key].fields[t].type === 'TestersGaragesSubgrid') {
                                html += `<div id='data-launch-testers-associated-garages-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'></div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'trainingRecordsSubgrid') {
                                html += `<div id='data-launch-training-records-subgrid-cont' class='data-launch-subgrid-container data-launch-input-field-container-multi-line'>
                                         </div>
                                         <button class="data-launch-create-new-training-record" data-launch-garage-id='${this.id}'>
                                                <i class="bi bi-plus-circle"></i> Add New Training Record
                                        </button>
                                         `
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
                    html += `<div class='data-launch-testers-screen row active' id='data-launch-testers-${fieldDataObj[key].meta.name}'>`
                    firstIteration = false
                }
                else {
                    html += `<div class='data-launch-testers-screen row' id='data-launch-testers-${fieldDataObj[key].meta.name}'>`
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
                                        <input id="${fieldDataObj[key].fields[t].field}_val" placeholder="${fieldDataObj[key].fields[t].label}" type='text' data-launch-field="" value="" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'phone') {
                                html += `<div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val" placeholder='${fieldDataObj[key].fields[t].label}' type='phone' value="" data-launch-field="" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'email') {
                                html += ` <div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val" placeholder='${fieldDataObj[key].fields[t].label}' type='email' value="" data-launch-field="" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'date') {
                                html += ` <div class='data-launch-input-field-container'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val" placeholder='${fieldDataObj[key].fields[t].label}' type='date' value="" data-launch-field="" class='data-launch-input-field data-launch-field-editable'>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'multi-text') {
                                html += `<div class='data-launch-input-field-container data-launch-input-field-container-multi-line'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <textarea id="${fieldDataObj[key].fields[t].field}_val" class='data-launch-input-field-multi-line data-launch-field-editable' data-launch-field="" data-launch-field-editable"></textarea>
                                        </div>`
                            }
                            else if (fieldDataObj[key].fields[t].type === 'checkbox') {
                                html += ` <div class='data-launch-input-field-container-checkbox'>
                                            <label class="data-launch-field-labels">${fieldDataObj[key].fields[t].label}</label>
                                            <input id="${fieldDataObj[key].fields[t].field}_val" type='checkbox' class='data-launch-input-field-checkbox data-launch-field-editable' data-launch-field="" checked="">
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
        currentPage = 'Testers'
        let rec;
        document.getElementById('data-launch-side-bar').classList.remove('data-launch-activate-menu')
        if (bool) {
            for (let i = 0; i < this.data.length; i++) {
                if (parseInt(this.data[i].id) === parseInt(id)) {
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
             <div id="data-launch-testers-menu-toggle" class="data-launch-testers-menu-toggle data-launch-testers-menu-toggle-trigger">
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
                <i class="bi bi-chevron-double-right data-launch-garage-menu-toggle-trigger-arrow-icons data-launch-testers-menu-toggle-trigger"></i>
            </div>
            <div class="data-launch-crud-security-alert" id="data-launch-crud-alert-box-tester">
                <div class="data-launch-crud-security-alert__icon" id="data-launch-crud-alert-icon-tester"></div>
                <div class="data-launch-crud-security-alert__message" id="data-launch-crud-alert-message-tester"></div>
            </div>
            <div id="data-launch-saved-record-banner" class="data-launch-saved-record-banner-alert">Record Saved Successfully</div>
            <div id="testers-screen-overlay-${this.id}" style="display:none" class="garage-screen-overlay"></div>   
            <div class='container-fluid'>
                            <div id="testers-large-image-preview-window_${this.id}" style="display:none" class="garages-mot-calibration-large-image-preview-window">
                                <img id="testers-img_${this.id}" class="garages-mot-calibration-images-preview">
                                <h1 id="testers-filename_${this.id}" class="garages-mot-calibration-images-filename"></h1>
                                <a id="testers-anchor_${this.id}" href=""><button class="garages-mot-calibration-download-image">Download</button></a>
                                <button class="garages-mot-calibration-image-preview-window-close-button">Close</button>
                            </div>
                            <div class="garages-document-upload-popup-window" id="tester-document-upload-popup-window">
                                <div id="garage-mot-calibration-new-document-window-v2-modal" class="garage-mot-calibration-new-document-window-v2-modal">
                                    <div class="garage-mot-calibration-new-document-window-v2-modal-content">
                                        <button class="garage-mot-calibration-new-document-window-v2-close-button">X</button>
                                        <h2>Upload Your File</h2>
                                        <form id="uploadForm_${this.id}" enctype="multipart/form-data">
                                        <input type="file" id="fileInput_${this.id}" name="file" required />
                                        <button class="testers-document-upload-button">Upload</button>
                                    </form>
                                    </div>
                                </div>                                    
                            </div>
                            <div id="testerTrainingRecordModal" style='display: none' class="tester-training-record-modal-popup">
                                <div class="tester-training-record-modal-content">
                                    <span class="tester-training-record-close">&times;</span>
                                    <h2>Tester Training Record</h2>
                                    <span style='display: none'><input id="testerTrainingRecordId" type="text" value=""></span>
                                    
                                    <!-- Log Details -->
                                    <div id="logDetailsSection" class="tab-content active">
                                        <label for="trainingSubject">Training Subject:</label>
                                        <input type="text" id="trainingSubject" name="trainingSubject">

                                        <label for="date">Date:</label>
                                        <input type="date" id="date" name="date">

                                        <label for="testersTrainingDocumentUpload">Document Upload</label>
                                        <button id="data-launch-upload-testers-training-document_${this.id}" class='data-launch-upload-testers-training-document'>Upload</button>
                                        <table class="table table-hover" id="testersTrainingTable_${this.id}">
                                            <thead>
                                                <tr>
                                                    <th style='width: 30%'>Name</th>
                                                    <th style='width: 30%'>Type</th>
                                                    <th style='width: 30%'>Preview</th>
                                                    <th style='width: 10%'></th>
                                                </tr>
                                            </thead>
                                            <tbody id="testersTrainingTableBody_${this.id}"></tbody>
                                         <h4 id="testersTrainingUploadBanner_${this.id}" style='text-align:center'><b>Please Note</b>: <br> Documents & Images can be uploaded once the Training Record has been Saved</h4>
                                        <br>
                                        </table>
                                        
                                        <label for="duration">Duration:</label>
                                        <input type="text" id="duration" name="duration">

                                        <label for="trainingTopics">Details of Training Topics Covered:</label>
                                        <textarea id="trainingTopics" name="trainingTopics"></textarea>                                        
                                    </div>

                                    <button class='data-launch-save-tester-training-record-btn' id="saveTesterTrainingRecordButton">Save</button>
                                </div>
                            </div>

                                <div style='display: none' class='data-launch-notes-modal-box-popup-cont' id='data-launch-notes-modal-box-popup'>
                                    <div class="modal-overlay">
                                        <div class="modal-content modern-modal">
                                            <button class='data-launch-testers-note-close-button modern-close-button'>X</button>
                                            <h2 class="modern-modal-title">Add New Note</h2>
                                            <span style='display:none' id="note_id_${this.id}"></span>
                                            <label for="noteSubject" class="modern-modal-label">Subject:</label>
                                            <input type="text" id="note_subject_${this.id}" name="noteSubject" placeholder="Enter subject..." class="modern-modal-input">
                                            <label for="noteBody" class="modern-modal-label">Note:</label>
                                            <textarea id="note_body_${this.id}" name="noteBody" rows="4" placeholder="Enter note..." class="modern-modal-textarea"></textarea>
                                             <div class="modern-modal-footer">
                                                <button class="btn btn-primary data-launch-save-testers-note modern-save-button">Save Note</button>
                                            </div>
                                        </div>
                                    </div>                                
                                </div>
                                <div style='display: none' class='data-launch-confirmation-box-inject' id='data-launch-confirmation-box-inject'></div>
                                <button type="button" id="data-launch-testers-record-save2" class="btn btn-outline-primary data-launch-save-record">Save</button>`
                                if (user_FULL_USER !== '0') {
                                    html += `<button type="button" id="data-launch-testers-record-save-close2" class="btn btn-outline-primary data-launch-save-close-record">Save & Close</button>`
                                    html += `<button type="button" id="data-launch-testers-record-back-to-list-view" class="btn btn-outline-primary btn-primary data-launch-record-back-to-list-view">< < Back To List</button>`
                                }
                                html += `
                                <div class='data-launch-record-header modern-record-header'>
                                    <h3 class="modern-record-title">${rec.first_name} ${rec.last_name} - (${rec.id})</h3>
                                    <h3 class="modern-record-subtitle" id="data-launch-testers-${this.id}-what-tab">Summary</h3>
                                    <span style='display:none' id='currentRecordID'>${rec.id}</span>                    
                                </div>
                                <div class='data-launch-tabs-container' id="data-launch-testers-tabs-container">
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
            <div class="data-launch-crud-security-alert" id="data-launch-crud-alert-box-tester">
                <div class="data-launch-crud-security-alert__icon" id="data-launch-crud-alert-icon-tester"></div>
                <div class="data-launch-crud-security-alert__message" id="data-launch-crud-alert-message-tester"></div>
            </div>
            <div id="data-launch-saved-record-banner" class="data-launch-saved-record-banner-alert">Record Saved Successfully</div>        
            <div class='container-fluid'>
                            <div class='row'>
                                <div style='display: none' class='data-launch-confirmation-box-inject' id='data-launch-confirmation-box-inject'></div>
                                <button type="button" id="data-launch-testers-record-save" class="btn btn-outline-primary data-launch-save-record">Save</button>
                                <button type="button" id="data-launch-testers-record-save-close" class="btn btn-outline-primary data-launch-save-close-record">Save & Close</button>
                                <button type="button" id="data-launch-testers-record-back-to-list-view" class="btn btn-outline-primary btn-primary data-launch-record-back-to-list-view">< < Back To List</button>
                                <div class='data-launch-record-header'>
                                    <h3>New</h3>                  
                                </div>
                                <div class='data-launch-tabs-container' id="data-launch-testers-tabs-container">
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
        document.getElementById('testerRecordsPage').innerHTML = html

    //    runThisTest()



        // let testerTrainingDocumentUpload = document.getElementById('uploader-preview-here-1335')
        // // Safely remove the event listener, even if it doesn't exist yet
        // testerTrainingDocumentUpload.removeEventListener('fileUploadSuccess', this.handleFileUploadSuccess);
        // // Add the new event listener
        // testerTrainingDocumentUpload.addEventListener('fileUploadSuccess', this.handleFileUploadSuccess);
        this.injectDataIntoTheSubgrid()
        this.injectNotesIntoSubgrid()
        this.injectDataIntoTesterTrainingRecordsSubgrid()
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
    injectDataIntoTesterTrainingRecordsSubgrid () {  
        fetchData('data_launch_tester_training_records', 100, 0, null, null, this.id).then(data => {
            console.log('data_launch_tester_training_records garage_id 5:', data);
            this.testerTrainingRecordsData = data
            new SubGrid(data, 'data-launch-training-records-subgrid-cont', 'testerTrainingRecords', this.id);
        });     
    }
    injectNotesIntoSubgrid () {
        fetchData('data_launch_notes', 2000).then(res => {
            let reducedArrayForTesterRecordID = []
            for (let i = 0; i < res.length; i++) {
                if (res[i]["note_table"] === 'testers' && res[i]["tester_record_id"] === parseInt(this.id)) {
                    reducedArrayForTesterRecordID.push(res[i])
                }                    
            }
            this.testerNotesData = reducedArrayForTesterRecordID
            new SubGrid(reducedArrayForTesterRecordID, `data_launch_testers_notes_table_${this.id}`, 'tester_notes', this.id)
        },
        err => {
            console.error(err);
        }); 
    }
    injectDataIntoTheSubgrid () {
        fetchData('tester_garages', 100).then(res => {
                console.log('tester_garages res', res);
                let reducedArrayForTesterRecordID = []
                for (let i = 0; i < res.length; i++) {
                    if (res[i]["tester_id"] === parseInt(this.id)) {
                        reducedArrayForTesterRecordID.push(res[i])
                    }                    
                }
                console.log('reducedArrayForTesterRecordID', reducedArrayForTesterRecordID)
                let data = []
                for (let i = 0; i < reducedArrayForTesterRecordID.length; i++) {
                    for (let t = 0; t < garageData.length; t++) {
                        if (reducedArrayForTesterRecordID[i]["garage_id"] === garageData[t].id) {
                            data.push({name: garageData[t].trading_name, id: garageData[t].id, tester_garages_id: reducedArrayForTesterRecordID[i].id})
                        }                        
                    }
                }        
                new SubGrid(data, 'data-launch-testers-associated-garages-cont', 'tester_garages');
            },
            err => {
                console.error(err);
            }
        );        
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
    openNotesModal () {
        document.getElementById('data-launch-notes-modal-box-popup').style.display = 'block'
    }
    openNotesModalWithDetails (id) {
        console.log('openNotes')
        let record;
        for (let i = 0; i < this.testerNotesData.length; i++) {
            if (parseInt(this.testerNotesData[i].id) === parseInt(id)) { 
                record = this.testerNotesData[i]
            }            
        }
        document.getElementById(`note_subject_${this.id}`).value = record.note_subject
        document.getElementById(`note_body_${this.id}`).value = record.note_body
        document.getElementById(`note_id_${this.id}`).value = record.id
        document.getElementById('data-launch-notes-modal-box-popup').style.display = 'block'
    }
    closeNotesModal () {
        document.getElementById(`note_subject_${this.id}`).value = ''
        document.getElementById(`note_body_${this.id}`).value = ''
        document.getElementById('data-launch-notes-modal-box-popup').style.display = 'none'
    }
    saveTestersNote() {
        let subject = document.getElementById(`note_subject_${this.id}`).value
        let note = document.getElementById(`note_body_${this.id}`).value
        // let date = document.getElementById(`note_date_${this.id}`).value
        console.log('the actual note is ', note)
        let object = {
            create_date: this.getFormattedDateTime(),
            note_subject: subject,
            note_body: note,
            note_table: 'testers',
            tester_record_id: this.id,
            user_id: user_ID,
            created_by_name: user_FIRST_NAME + ' ' + user_LAST_NAME
        }
        let id = document.getElementById(`note_id_${this.id}`).value
        if (id) {
            updateRecord('data_launch_notes', parseInt(id), object).then(res => {
                console.log(' data note added ? ', res)
                for (let i = 0; i < this.testerNotesData.length; i++) {
                    if (this.testerNotesData[i].id === res.id) {
                        this.testerNotesData[i] = res;
                    }        
                } 
                document.getElementById(`note_body_${this.id}`).value = ''
                document.getElementById(`note_subject_${this.id}`).value = ''
                document.getElementById(`note_id_${this.id}`).value = ''
                this.closeNotesModal()
                this.injectNotesIntoSubgrid()
            },
                error => {
                console.log('something went wrong', error)
                this.closeNotesModal()
            })
        }
        else {
            createRecord('data_launch_notes', object).then(res => {
                console.log(' data note added ? ', res)
                this.testerNotesData.push(res)
                // let newHTMLNoteRow = `<tr id='tester_notes_${this.id}_${res.id}'>
                //                         <td data-id="${res.id}" class="data-launch-table-clickable-tester-note-row">${object.create_date}</td>
                //                         <td data-id="${res.id}" class="data-launch-table-clickable-tester-note-row">${object.created_by_name}</td>  
                //                         <td data-id="${res.id}" class="data-launch-table-clickable-tester-note-row">${object.note_subject}</td> 
                //                         <td data-id="${res.id}" class="data-launch-table-clickable-tester-note-row">${object.note_body}</td>
                //                         <td>
                //                             <i class="bi bi-trash data-launch-subgrid-delete-note-item" data-note-id='${res.id}'></i>
                //                         </td>     
                //                     </tr>`
                // document.getElementById(`tester_notes_table_body_${this.id}`).innerHTML += newHTMLNoteRow
                document.getElementById(`note_body_${this.id}`).value = ''
                document.getElementById(`note_subject_${this.id}`).value = ''
                document.getElementById(`note_id_${this.id}`).value = ''
                this.closeNotesModal()
                this.injectNotesIntoSubgrid()
            },
                error => {
                console.log('something went wrong', error)
                this.closeNotesModal()
            })
        }        
        
    }
    deleteNoteRecord (id) {
        console.log('here to delete the note record ', id)
        deleteRecord('data_launch_notes', id).then(
            success => {
                console.log('success', success)
                document.getElementById(`tester_notes_${this.id}_${id}`).style.display = 'none'
            },
            err => {
                console.log(`Deletion Not Successful :  ${err}`)
                this.showCRUDAlert('Deletion Not Successful', 'error');
            }
        )
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


 // Object to store event listeners for reuse
 let eventListeners = [];

 // Function to add an event listener and store it
 function addEventListenerWithTracking(element, event, handler) {
     element.addEventListener(event, handler);
     eventListeners.push({ element: element, event: event, handler: handler });
 }

 // Function to clone event listeners to a new element
 function cloneEventListeners(sourceElement, targetElement) {
     eventListeners.forEach(listener => {
         if (listener.element === sourceElement) {
             targetElement.addEventListener(listener.event, listener.handler);
         }
     });
 }

//  function runThisTest(){
//     // Example usage
//     let originalElement = document.getElementById('simple-file-upload-window');
//     let newElement = document.getElementById('simple-file-upload-window2');
   
//     // Add an event listener to the original element
//     addEventListenerWithTracking(originalElement, 'click', function() {
//         console.log('Original element clicked');
//     });
   
//     // Clone event listeners to the new element
//     cloneEventListeners(originalElement, newElement);
//    }

