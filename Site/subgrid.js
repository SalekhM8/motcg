class SubGrid {
    constructor(data = [], containerId, type, id, rows, baysData, operatingDays, operatingHours) {
      this.data = data;
      this.containerId = containerId;
      this.type = type
      this.container = document.getElementById(containerId);
      this.rows = rows
      this.baysData = baysData
      this.colors = ["#3c9df4", "#1a1736"]; 
      if (operatingHours) {
        operatingHours.end++
      }
      this.operatingStart = (operatingHours?.start || 8) * 60; // Convert hours to minutes
      this.operatingFinish = (operatingHours?.end || 18) * 60; // Convert hours to minutes
      this.operatingDuration = this.operatingFinish - this.operatingStart
      this.operatingDays = operatingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      this.weekCache = {}; // cache for daysData, keyed by Monday's date string
      this.referenceDate = this.getMonday(new Date()); // Monday of current week
      if (type === "garageBookings") {
        this.weekCache[this.formatDate(this.referenceDate)] = this.buildWeekData(this.referenceDate);
      }
      this.viewType = 'bayGrid'
      this.timeHeaderHeight = 30; // top header
      this.BAY_HEADER_HEIGHT = 20; // each bay's header
      this.DROP_OFFSET = 5; // vertical offset so the drag ghost doesn't obscure
      this.dragEventElem = null;
      this.dragOffsetY = 0;
      this.sourceBay = null;
      this.daysData = [];
      if (id) {
        this.id = id
      }
      this.render('nothing');
      
    }

     // Helper: Given a date, return the Monday for that week (local time)
    getMonday(date) {
      let d = new Date(date);
      const dayOfWeek = (d.getDay() + 6) % 7; // Monday = 0, Sunday = 6
      d.setDate(d.getDate() - dayOfWeek);
      d.setHours(12, 0, 0, 0);
      return d;
    }

    buildWeekData(monday) {
      let days = [];
      
      // Define the garage's operating days (Mon-Fri by default)
      const openDays = this.operatingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      
      for (let i = 0; i < 7; i++) {
          let d = new Date(monday);
          d.setDate(monday.getDate() + i);
          d.setHours(12, 0, 0, 0);
          
          // Get the weekday name
          const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
          
          // Only include the day if it's in the operatingDays array
          if (openDays.includes(dayName)) {
              days.push({
                  day: dayName,
                  date: d,
                  bays: this.baysData.map(bay => ({
                      name: bay.bay_name,
                      create_date: bay.create_date,
                      garage_id: bay.garage_id,
                      id: bay.id,
                      mot_bay: bay.mot_bay,
                      increment: bay.time_segments
                  }))
              });
          }
      }
      return days;
  }
  

      // When you need daysData for a week, check cache:
  getWeekDataForOffset(offsetInWeeks) {
    // Calculate new Monday.
    const newMonday = new Date(this.referenceDate);
    newMonday.setDate(newMonday.getDate() + offsetInWeeks * 7);
    const key = this.formatDate(newMonday);
    if (!this.weekCache[key]) {
      // Generate and store if not in cache.
      this.weekCache[key] = this.buildWeekData(newMonday);
    }
    return this.weekCache[key];
  }

  normalize(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  
    render(params, reducedData, weekOffset, type, viewType) {
      if (params === '30 Days') {
        this.rows = 30
      }
      else if (params === '60 Days') {
        this.rows = 60
      }
      else if (params === 'All Dates') {
        this.rows = 'All Dates'
      }
      if (reducedData) {
        this.data = reducedData
      }
      if (typeof weekOffset === 'number') {
        this.currentWeekOffset = (this.currentWeekOffset || 0) + weekOffset;
      }    
      if (type) {
        this.type = 'garageBookings'
      }
      if (viewType) {
        this.viewType = viewType
      }
      
      // // console.log('this.data', this.data)
      // // console.log('reduced data ? ', reducedData)
      this.container.innerHTML = '';
      let html =  `<div class="data-launch-crud-security-alert" id="data-launch-subgrid-crud-alert-box">
                      <div class="data-launch-crud-security-alert__icon" id="data-launch-subgrid-crud-alert-icon"></div>
                      <div class="data-launch-crud-security-alert__message" id="data-launch-subgrid-crud-alert-message"></div>
                  </div>`
      // // console.log('this.data in the subgrid is ', this.data)
        if (this.type === 'tester_garages') {
          html += `<table class="table table-hover data-launch-table-clickable-row notes-table">
                                          <thead>
                                              <tr>
                                                <th>Garage Name</th>
                                                <th>Garage Id</th>
                                                <th></th>
                                              </tr>
                                            </thead>
                                            <tbody id='tester-garages-table-body'>
          `
          this.data.forEach(row =>  {
            html += `<tr>
                <td data-garage-id='${row.id}' class='data-launch-open-garage-record-from-tester-garages-subgrid'>${row.name}</td>
                <td>${row.id}</td> 
                <td><i class="bi bi-trash data-launch-subgrid-delete-item" data-id='${row.tester_garages_id}'></i></td>       
            </tr>`
          })
          html += `</tbody></table>`
          html += `<button class='data-launch-associate-new-garage-record'>
                      <i class="bi bi-plus-circle"></i>Associate New Garage
                    </button>`
          this.container.innerHTML = html
        }
        else if (this.type === 'garage_testers') {
          html += `<table class="table table-hover data-launch-table-clickable-row notes-table">
                                    <thead>
                                        <tr>
                                          <th>Tester Name</th>
                                          <th>Tester Id</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
            `
            this.data.forEach(row => {
            html += `<tr data-tester-id='${row.id}' class='data-launch-open-tester-record-from-garage-testers-subgrid'>
                      <td data-tester-id='${row.id}' class='data-launch-open-tester-record-from-garage-testers-subgrid'>${row.name}</td>
                      <td data-tester-id='${row.id}' class='data-launch-open-tester-record-from-garage-testers-subgrid'>${row.user_id}</td> 
                      <td><i class="bi bi-trash data-launch-subgrid-delete-item" data-id='${row.tester_garages_id}'></i></td>       
                    </tr>`
            })
            html += `</tbody></table>`
            this.container.innerHTML = html
        }
        else if (this.type === 'tester_notes') {
          html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
          <thead>
              <tr>
                <th style="width: 20%;">Create Date</th>
                <th style="width: 20%;">User</th>
                <th style="width: 15%;">Subject</th>
                <th style="width: 40%;">Note</th>                
                <th style="width: 3% !important;"></th>
              </tr>
            </thead>
            <tbody id="tester_notes_table_body_${this.id}">
          `
          this.data.forEach(row =>  {
          html += `<tr id='tester_notes_${this.id}_${row.id}'>`
              if (row.create_date) {
                let formattedDate = row.create_date.split('T')[0];
                html += `<td class='data-launch-table-clickable-tester-note-row' data-id='${row.id}'>${formattedDate}</td>`
              }
              else {
                  html += `<td class='data-launch-table-clickable-tester-note-row' data-id='${row.id}'></td>`
              }
          html += `
                      <td class='data-launch-table-clickable-tester-note-row' data-id='${row.id}'>${row.created_by_name}</td> 
                      <td class='data-launch-table-clickable-tester-note-row' data-id='${row.id}'>${row.note_subject}</td> 
                      <td class='data-launch-table-clickable-tester-note-row' data-id='${row.id}'>${row.note_body}</td>
                      <td><i class="bi bi-trash data-launch-subgrid-delete-note-item" data-note-id='${row.id}' data-id='${row.id}'></i></td>             
                  </tr>`
         })
          html += `</tbody></table>`
          this.container.innerHTML = html
        }
        else if (this.type === 'garage_mot_equipment') {
          html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
          <thead>
              <tr>
                <th style="width: 20%;">Equipment Type</th>
                <th style="width: 20%;">Make</th>
                <th style="width: 20%;">Model</th>
                <th style="width: 20%;">Calibration Frequency</th>
                <th style="width: 15%;">Bay</th>
                <th style="width: 3% !important;"></th>
              </tr>
            </thead>
            <tbody id="garage_mot_equipment_tbody_${this.id}">
          `
          this.data.forEach(row => {
          html += `<tr id='garage_mot_equipment_${this.id}_${row.id}'>
                      <td class="data-launch-table-clickable-mot-equipment-row" data-id='${row.id}'>${row.equipment_type}</td>
                      <td class="data-launch-table-clickable-mot-equipment-row" data-id='${row.id}'>${row.make}</td>
                      <td class="data-launch-table-clickable-mot-equipment-row" data-id='${row.id}'>${row.model}</td>
                      <td class="data-launch-table-clickable-mot-equipment-row" data-id='${row.id}'>${row.calibration_frequency}</td>
                      <td class="data-launch-table-clickable-mot-equipment-row" data-id='${row.id}'>${row.bay}</td> 
                      <td><i class="bi bi-trash data-launch-subgrid-delete-mot-equipment-item" data-id='${row.id}' data-mot-equipment-id='${row.id}'></i></td>             
                  </tr>`
          })
          html += `</tbody></table>`
          this.container.innerHTML = html
        }
        

        else if (this.type === 'associatedGarages') {
          html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
          <thead>
              <tr>
                <th style="width: 20%;">Garage Name</th>
                <th style="width: 20%;">Postcode</th>
                <th style="width: 20%;">ID</th>
                <th style="width: 3% !important;"></th>
              </tr>
            </thead>
            <tbody id="garage_associated_garages_tbody_${this.id}">
          `
          this.data.forEach(row => {
          html += `<tr id='garage_associated_garages_${this.id}_${row.id}'>
                      <td class="data-launch-table-clickable-associated-garages-row" data-id='${row.id}'>${row.trading_name_garage}</td>
                      <td class="data-launch-table-clickable-associated-garages-row" data-id='${row.id}'>${row.vts_postcode_garage}</td>
                      <td class="data-launch-table-clickable-associated-garages-row" data-id='${row.id}'>${row.id}</td>
                      <td><i class="bi bi-trash data-launch-subgrid-delete-garage-associated-garages-item" data-id='${row.id}'></i></td>             
                  </tr>`
          })
          html += `</tbody></table>`
          this.container.innerHTML = html
        }


        
        else if (this.type === 'motcalibration') {
          html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
          <thead>
              <tr>
                <th style="width: 15%;">Equipment Type</th>
                <th style="width: 15%;">Make</th>
                
                <th style="width: 15%;">Serial No</th>
                <th style="width: 15%;">Calibration Date</th>
                <th style="width: 15%;">Expiry Date</th>
                
                <th style="width: 3% !important;"></th>
              </tr>
            </thead>
            <tbody id="motcalibration_tbody_${this.id}">
          `;
          // <th style="width: 15%;">Model</th>
          // <th style="width: 5%;">Bay</th>
          this.data.forEach(row => {
          html += `<tr class='data-launch-table-clickable-mot-calibration-row' id='motcalibration_${this.id}_${row.id}'>
                      <td class='data-launch-table-clickable-mot-calibration-row' data-id='${row.id}'>${row.equipment_type}</td>
                      <td class='data-launch-table-clickable-mot-calibration-row' data-id='${row.id}'>${row.make}</td>
                      <td class='data-launch-table-clickable-mot-calibration-row' data-id='${row.id}'>${row.serial_no}</td>
                      `
                      if (row.calibration_date) {
                        let formattedDate = row.calibration_date.split('T')[0];
                        html += `<td class='data-launch-table-clickable-mot-calibration-row' data-id='${row.id}'>${this.getFormattedDate(formattedDate)}</td>`
                      }
                      else {
                          html += `<td class='data-launch-table-clickable-mot-calibration-row' data-id='${row.id}'></td>`
                      }
                      if (row.calibration_expiry_date) {
                        let formattedDate = row.calibration_expiry_date.split('T')[0];
                        html += `<td class='data-launch-table-clickable-mot-calibration-row' data-id='${row.id}'>${this.getFormattedDate(formattedDate)}</td>`
                      }
                      else {
                          html += `<td class='data-launch-table-clickable-mot-calibration-row' data-id='${row.id}'></td>`
                      }
          html += `
                                
                      <td><i class="bi bi-trash data-launch-mot-calibration-delete-item" data-id='${row.id}'></i></td>             
                  </tr>`
         });
        //  <td class='data-launch-table-clickable-mot-calibration-row' data-id='${row.id}'>${row.model}</td>
        // <td class='data-launch-table-clickable-mot-calibration-row' data-id='${row.id}'>${row.bay}</td>    
          html += `</tbody></table>`;
          this.container.innerHTML = html;
        }
        else if (this.type === 'motsiteaudits') {
          html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
          <thead>
              <tr>
                  <th style="width: 20%;">Consultant</th>
                  <th style="width: 20%;">Auditor</th>
                  <th style="width: 20%;">Date</th>
                  <th style="width: 5%;"></th>
              </tr>
            </thead>
            <tbody id="motsiteaudit_tbody_${this.id}">
          `;
          this.data.forEach(row =>  {
            html += `<tr class='data-launch-table-clickable-mot-site-audit-record' data-id='${row.id}' id='motsiteaudit_${this.id}_${row.id}'>
                      <td class='data-launch-table-clickable-mot-site-audit-record' data-id='${row.id}'>${row.consultant}</td>
                      <td class='data-launch-table-clickable-mot-site-audit-record' data-id='${row.id}'>${row.auditor}</td>
                      `
                      if (row.date) {
                          let formattedDate = row.date.split('T')[0];
                          html += `<td class='data-launch-table-clickable-mot-site-audit-record' data-id='${row.id}'>${this.getFormattedDate(formattedDate)}</td>`
                      }
                      else {
                          html += `<td class='data-launch-table-clickable-mot-site-audit-record' data-id='${row.id}'></td>`
                      }
            html += `
                      <td><i class="bi bi-trash data-launch-subgrid-delete-mot-site-audit-item" data-id='${row.id}'></i></td>             
                  </tr>`
          });
          html += `</tbody></table>`;
          this.container.innerHTML = html;
      }
      else if (this.type === 'qccheckers') {
        html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
          <thead>
            <tr>
                <th style="width: 20%;">Tester Name</th>
                <th style="width: 20%;">Vehicle Reg</th>
                <th style="width: 20%;">Date of QC</th>
                <th style="width: 20%;">QC Carried out by</th>
                <th style="width: 5%;"></th>
            </tr>
          </thead>
          <tbody id="qccheckers_tbody_${this.id}">
        `;
        console.log('this.data that needs sorting Liam qccheckers', this.data)
        this.data.sort((a, b) => new Date(b.date_of_qc) - new Date(a.date_of_qc));
        this.data.forEach(row => {
          html += `<tr class='data-launch-table-clickable-qc-checker-record' data-id='${row.id}' id='qccheckers_${this.id}_${row.id}'>
                    <td class='data-launch-table-clickable-qc-checker-record' data-id='${row.id}'>${row.tester_name}</td>
                    <td class='data-launch-table-clickable-qc-checker-record' data-id='${row.id}'>${row.vehicle_reg}</td>`
                    if (row.date_of_qc) {
                      let formattedDate = row.date_of_qc.split('T')[0];
                      html += `<td class='data-launch-table-clickable-qc-checker-record' data-id='${row.id}'>${this.getFormattedDate(formattedDate)}</td>`
                  }
                  else {
                      html += `<td class='data-launch-table-clickable-qc-checker-record' data-id='${row.id}'></td>`
                  }
          html += `
                    <td class='data-launch-table-clickable-qc-checker-record' data-id='${row.id}'>${row.qc_carried_out_by}</td>
                    <td><i class="bi bi-trash data-launch-subgrid-delete-qc-checker-item" data-id='${row.id}'></i></td>             
                </tr>`
      });
        html += `</tbody></table>`;
        this.container.innerHTML = html;
      }
      else if (this.type === 'garageBookings') {
        if (document.getElementById("daysColumns")) {
          document.getElementById("daysColumns").innerHTML = ""; 
        }
  
        // console.log('this.data GARAGE BOOKINGS', this.data)
        if (this.baysData.length === 0 || this.baysData === undefined) {
          this.container.innerHTML = `<h2 style="text-align:center;margin-top: 50px;"> Please add Bay records to use the bookings features</h2><br>
                                      <h2 class="data-launch-tabs-clickable-garages" style="text-align: center; cursor: pointer;color: #f39c12 !important;font-weight: bold;text-decoration: underline;" data-launch-menu-item="bays">Go To Bays</h2>`
          return;
        }
        if (this.operatingDays.length === 0) {
          this.container.innerHTML = `<h2 style="text-align:center;margin-top: 50px;"> Please configure opening hours on the Garage Initial Setup Tab to use the bookings features</h2><br>`
            return;
        }
       
        html += `<div id="booking-status-key-wrapper" style="display: flex; justify-content: center;margin-bottom:2px;">
                                <div id="booking-status-key" style="display: flex; flex-wrap: wrap; gap: 12px; font-family: sans-serif; font-size: 14px;">
                                  <div style="display: flex; align-items: center;">
                                    <span style="width: 20px; height: 20px; background-color: #759AF7; display: inline-block; border: 1px solid #aaa; margin-right: 6px;"></span>
                                    Booking Made
                                  </div>
                                  <div style="display: flex; align-items: center;">
                                    <span style="width: 20px; height: 20px; background-color: #E4ADFB; display: inline-block; border: 1px solid #aaa; margin-right: 6px;"></span>
                                    Vehicle Arrived On Site
                                  </div>
                                  <div style="display: flex; align-items: center;">
                                    <span style="width: 20px; height: 20px; background-color: #F5E77F; display: inline-block; border: 1px solid #aaa; margin-right: 6px;"></span>
                                    Work In Progress
                                  </div>
                                  <div style="display: flex; align-items: center;">
                                    <span style="width: 20px; height: 20px; background-color: #C4EAA2; display: inline-block; border: 1px solid #aaa; margin-right: 6px;"></span>
                                    Work Completed
                                  </div>
                                </div>
                            </div>
                <div id="navContainer" style="text-align:center; margin-bottom:10px; height: 37px;">`
                if (this.viewType === 'bayGrid') {
                    html += `     
                              <input type="date" id="monthPicker" style="display: inline-block; width: 135px; float: left;">
                             `
                  }
                  html += `                  
                  <select style="display: inline-block; width: 200px; float: left; margin-left: 23px;" class="data-launch-bookings-subgrid-grid-type-select-element" id="data-launch-bookings-subgrid-grid-type-select-element_${this.id}">
                  `
                  if (this.viewType === 'bayGrid') {
                    html += ` <option value="list">List View</option>
                              <option value="bayGrid" selected>Bay Grid</option>`
                  }
                  else {
                             html += `
                             <option value="list" selected>List View</option>
                              <option value="bayGrid">Bay Grid</option>`
                  }
                  html += `</select>`
                  if (this.viewType === 'bayGrid') {
                    html += `<button style="float: left; margin-left: 20px; height: 37px; text-align: center;" class="prevWeekBtn" id="prevWeekBtn">&lt; Prev Week</button>
                             <button style="float: left; margin-left: 20px; height: 37px; text-align: center;" class="nextWeekBtn" id="nextWeekBtn">Next Week &gt;</button>`
                  }
                  else {
                    html += `<button class="data-launch-bookings-list-print">Print  <i class="bi bi-printer"></i></button>`
                  }
                  if (USER_RECORD.bookings_create === 1) {
                    html += `<button class="data-launch-create-new-booking-record" style="float:right;" data-launch-garage-id='${this.id}'>
                               <i class="bi bi-plus-circle"></i> Add New Booking Record</button>`
                  }
                  html += `</div>`
        
        if (this.viewType === 'bayGrid') {
          html += `<div id="garageBookingsCalendarContainer" class="calendar-container">`
        }
        else {
           html += `<div id="garageBookingsCalendarContainer"  class="calendar-container inactive">`
        }
        
        html += `
                  <div class="time-column" id="timeColumn">
                    <div class="time-header"></div>
                  </div>
                  <div class="days-columns" id="daysColumns"></div>
                </div>
          `
          // console.log('this.baysData', this.baysData)


        
        // this html below is the actual subgrid for the bookings tab, the above code is for the garageBookings tab BAY GRID View, which basically just shows a calendar and then the bays as columns within each//

        if (this.viewType === 'bayGrid') {
            html += `<div class="table-scroll-container inactive">
                        <table id="garageBookingsListView" class="table inactive table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>`
        }
        else {
            html += `<div class="table-scroll-container">
                      <table id="garageBookingsListView" class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>`
        }
        html += `
        <thead>
            <tr>
                <th style="width: 10%;">Booking Date</th>
                <th style="width: 15%;">Vehicle Reg</th>
                <th style="width: 15%;">Vehicle Make</th>
                <th style="width: 15%;">Vehicle Model</th>
                <th style="width: 15%;">Customer Name</th>
                <th style="width: 10%;">Bay</th>              
                <th style="width: 3% !important;"></th>
            </tr>
          </thead>
          <tbody id="garageBookings_tbody_${this.id}">
        `;
        this.data.forEach(row => {
        html += `<tr class='data-launch-table-clickable-garage-booking-record' data-id='${row.id}' id='garageBookings_${this.id}_${row.id}'>`
                    if (row.booking_date) {
                      let formattedDate = row.booking_date.split('T')[0];
                      html += `<td class='data-launch-table-clickable-garage-booking-record' data-id='${row.id}'>${this.getFormattedDate(formattedDate)}</td>`
                    }
                    else {
                      html += `<td class='data-launch-table-clickable-garage-booking-record' data-id='${row.id}'></td>`
                    }
                    html += 
                    `<td class='data-launch-table-clickable-garage-booking-record' data-id='${row.id}'>${row.vehicle_reg}</td>
                    <td class='data-launch-table-clickable-garage-booking-record' data-id='${row.id}'>${row.vehicle_make}</td>
                    <td class='data-launch-table-clickable-garage-booking-record' data-id='${row.id}'>${row.vehicle_model}</td>
                    <td class='data-launch-table-clickable-garage-booking-record' data-id='${row.id}'>${row.customer_first_name} ${row.customer_last_name}</td>
                    <td class='data-launch-table-clickable-garage-booking-record' data-id='${row.id}'>${row.bay}</td>
                    `                    
                    html += `
                    <td><i class="bi bi-trash data-launch-subgrid-delete-garage-booking-item" data-id='${row.id}'></i></td>             
                </tr>`
      });
      html += `</tbody></table></div>`;
      this.container.innerHTML = html;
      this.daysData = this.getWeekDataForOffset(this.currentWeekOffset || 0);
      if (this.viewType === 'bayGrid') {
        this.addMonthlyWidget();
      }
      
      
      const timeColumn = document.getElementById("timeColumn");
      timeColumn.innerHTML = ""; // Clear previous time slots
      
      timeColumn.innerHTML = `<div id="navToggle" style="cursor: pointer; text-align: left; width: 80px; background-color: #1abc9c; color: white; margin-bottom: 3px; height: 50px;">
                    <span id="navToggleArrow">Hide &#x25BC;</span> <!-- down arrow initially -->
                  </div>`
      for (let t = this.operatingStart; t <= this.operatingFinish; t += 60) {
          const marker = document.createElement("div");
          marker.className = "time-marker";
          marker.style.top = (this.timeHeaderHeight + this.BAY_HEADER_HEIGHT + (t - this.operatingStart)) + "px";
          marker.innerText = this.formatTime(t);
          timeColumn.appendChild(marker);
      }
      const totalHeight = this.timeHeaderHeight + this.BAY_HEADER_HEIGHT + this.operatingDuration;
      document.getElementById("timeColumn").style.height = totalHeight + "px";
      const toggleArrow = document.getElementById("navToggleArrow");
      const nav = document.getElementById("navContainer");
      toggleArrow.addEventListener("click", () => {
        if (nav.classList.contains("hidden")) {
          nav.classList.remove("hidden");
          toggleArrow.innerHTML = "Hide &#x25BC;";
        } else {
          nav.classList.add("hidden");
          toggleArrow.innerHTML = "Options &#x25BC;";
        }
      }) 
      
      const daysColumns = document.getElementById("daysColumns");
      daysColumns.innerHTML = ""; // Clear previous entries
      
      this.daysData.forEach(dayObj => {
          const dayCol = document.createElement("div");
          dayCol.className = "day-column";
      
          const dayHeader = document.createElement("div");
          dayHeader.className = "day-header";
          dayHeader.innerText = `${dayObj.day} ${this.formatDate(dayObj.date)}`;
          dayCol.appendChild(dayHeader);
      
          const baysContainer = document.createElement("div");
          baysContainer.className = "bays-container";
          // baysContainer.style.height = this.operatingDuration + "px";
          baysContainer.style.height = totalHeight + "px"; // same 650px as timeColumn
      
          dayObj.bays.forEach(bayData => {
            // // console.log('bayData', bayData)
              const bay = document.createElement("div");
              bay.className = "bay";
              bay.setAttribute("data-increment", bayData.increment);
              bay.style.height = this.operatingDuration + "px"; // ✅ Add this line
              bay.style.backgroundImage = "linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)";
              bay.style.backgroundSize = `100% ${bayData.increment}px`;
              bay.style.backgroundPosition = `0 ${this.BAY_HEADER_HEIGHT}px`;
      
              const bayHeader = document.createElement("div");
              bayHeader.className = "bay-header";
              bayHeader.innerText = bayData.name;
              bay.appendChild(bayHeader);
      
              bay.addEventListener("dragover", (e) => this.onBayDragOver(e, bay));
              bay.addEventListener("dragleave", (e) => this.onBayDragLeave(e, bay));
              bay.addEventListener("drop", (e) => this.onBayDrop(e, bay));

       

              // ✅ Add new timeslots (without affecting existing functionality)
              for (let time = this.operatingStart; time < this.operatingFinish; time += bayData.increment) {
                  const timeslot = document.createElement("div");
                  timeslot.className = "timeslot";
                  // timeslot.style.top = (time - this.operatingStart + this.BAY_HEADER_HEIGHT) + "px";
                  // timeslot.style.height = bayData.increment + "px";
                  // timeslot.dataset.time = this.formatTime(time);
                  // timeslot.dataset.bay = bayData.name;
                  // timeslot.dataset.date = this.formatDate(dayObj.date);
                  // timeslot.dataset.increment = bayData.increment

                  timeslot.style.top = (this.BAY_HEADER_HEIGHT + ((time - this.operatingStart) / bayData.increment) * bayData.increment) + "px";
                  timeslot.style.height = bayData.increment + "px";
                  
                  // Directly use `time`, do NOT recompute using slotIndex
                  timeslot.dataset.time = this.formatTime(time);
                  timeslot.dataset.bay = bayData.name;
                  timeslot.dataset.date = this.formatDate(dayObj.date);
                  timeslot.dataset.increment = bayData.increment;

                  timeslot.addEventListener("mouseenter", () => {
                    timeslot.style.transform = "scaleY(1.1)";
                    timeslot.style.backgroundColor = "rgba(0, 128, 255, 0.3)"; // Subtle highlight
                    timeslot.style.border = "1px solid #0078D4"; // Slight outline effect
                    timeslot.style.cursor = "pointer";
                    timeslot.style.width = "100%"
                });
            
                timeslot.addEventListener("mouseleave", () => {
                    timeslot.style.transform = "scale(1)";
                    timeslot.style.backgroundColor = ""; // Reset background
                    timeslot.style.border = ""; // Reset border
                    timeslot.style.left = '0px'
                    timeslot.style.width = "auto"
                });


              timeslot.addEventListener('mouseover', (e) => {             
                const bayElement = e.target.closest('.bay'); 
                if (!bayElement) return;
            
                const bayId = timeslot.dataset.bay;
                const date = timeslot.dataset.date;
            
                // // console.log('timeslot.dataset', timeslot.dataset);
            
                // Get correct bay increment from dataset
                const bayIncrement = parseInt(timeslot.dataset.increment, 10) || 30;  // Default to 30 mins
            
                // Compute slotIndex correctly
                const slotIndex = Math.floor((e.target.offsetTop - this.BAY_HEADER_HEIGHT) / bayIncrement); 
            
                // Compute the correct time using bayIncrement
                const hoveredTime = this.operatingStart + (slotIndex * bayIncrement);
            
                // Convert to HH:MM format
                const hours = Math.floor(hoveredTime / 60);
                const minutes = hoveredTime % 60;
                const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
                timeslot.dataset.time = formattedTime;                
                // // console.log(`Selected time: ${formattedTime}, Bay: ${bayId}, Date: ${date}`);
            
                // Display Tooltip
                let tooltip = document.getElementById('hover-time-tooltip');
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.id = 'hover-time-tooltip';
                    tooltip.style.position = 'absolute';
                    tooltip.style.background = 'black';
                    tooltip.style.color = 'white';
                    tooltip.style.padding = '5px';
                    tooltip.style.borderRadius = '3px';
                    tooltip.style.fontSize = '12px';
                    tooltip.style.pointerEvents = 'none';
                    document.body.appendChild(tooltip);
                }
            
                tooltip.innerText = `${formattedTime}`;
                tooltip.style.top = `${e.pageY + 10}px`;
                tooltip.style.left = `${e.pageX + 10}px`;
                tooltip.style.display = 'block';
            
                timeslot.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                });
            });
            

                  // ✅ Click event to trigger the booking modal
                  timeslot.addEventListener("click", (e) => {
                    e.stopPropagation();
                
                    // Ensure we're using the correct dataset time
                    const selectedTime = timeslot.dataset.time;
                    const selectedBay = timeslot.dataset.bay;
                    const selectedDate = timeslot.dataset.date;
                
                    // // console.log(`🔹 Clicked Slot: ${selectedTime}, Bay: ${selectedBay}, Date: ${selectedDate}`);
                
                    // Pass correctly formatted time to the booking modal
                    garageClassInstantiated.showGarageBookingsModal(selectedTime, selectedBay, selectedDate);
                });
                

                  bay.appendChild(timeslot);
              }

              baysContainer.appendChild(bay);
          });
      
          dayCol.appendChild(baysContainer);
          daysColumns.appendChild(dayCol);
      });
      this.resizingBaysArray = []
      this.data.forEach(row => {
                      let formattedDate = row.booking_date.split('T')[0];
                      let date = this.getFormattedDate(formattedDate)
                      let reg = row.vehicle_reg
                      let make = row.vehicle_make
                      let model = row.vehicle_model
                      let firstName = row.customer_first_name 
                      let lastName = row.customer_last_name
                      let startTime = row.time_start
                      let endTime = row.time_end
                      let bay = row.bay
                      let notes = row.notes
                      let dayOfWeek = new Date(row.booking_date).toLocaleString('en-US', { weekday: 'long' });
                      let id = row.id
                      let workCompleted = row.status_work_completed
                      let vehicleInProgress = row.status_work_on_vehicle_in_progress
                      let vehicleArrived = row.status_vehicle_arrived_on_site
                      let bookingMade = row.status_booking_made


                      const startMinutes = this.timeStringToMinutes(startTime); // 480
                      const endMinutes = this.timeStringToMinutes(endTime);     // 540

                      const duration = endMinutes - startMinutes;          // 60
                      // let bayName = this.baysData.find(rowBay => rowBay.id === bay)?.bay_name;
                      let bayName = this.baysData.find(rowBay => rowBay.id === bay)?.bay_name?.trimEnd();
                      // Now call createEvent with these values:
                      // // console.log('CREATE EVENT FUNCTION', {formattedDate, bayName, startMinutes, duration, reg, id})
                      this.createEvent(formattedDate, bayName, startMinutes, duration, reg, id, startTime, endTime, notes, workCompleted,vehicleInProgress,vehicleArrived,bookingMade);
      })
      // 🔥 Force recalculation of booking widths **AFTER** render
      // Wait until all bookings are added before running layoutBay

      setTimeout(() => {
        // // console.log("✅ Running layoutBay for all bays...");
        if (document.querySelectorAll(".event").length === 0) {
          console.warn('there  are not elements with .event in the DOM? ???')
          return
        }
        else {
          console.warn('there ARE elements with .event in the DOM? ???', document.querySelectorAll(".event").length)
        }
        const uniqueBays = [...new Set(this.resizingBaysArray)]; // Remove duplicates
        uniqueBays.forEach(bay => this.layoutBay(bay));
        this.resizingBaysArray = []; // Clear after execution
      }, 1800);


    

      if (document.getElementById("monthPicker")) {
        document.getElementById("monthPicker").value = this.formatDate(this.daysData[0].date);
      }
    }
      else if (this.type === 'defectReports') {
        html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
        <thead>
            <tr>
                <th style="width: 10%;">Reference</th>
                <th style="width: 15%;">Reported Date</th>
                <th style="width: 30%;">Defect Description</th>
                <th style="width: 15%;">DVSA Notified</th>
                <th style="width: 15%;">Repaired</th>
                <th style="width: 3% !important;"></th>
            </tr>
          </thead>
          <tbody id="defectReports_tbody_${this.id}">
        `;
        this.data.forEach(row => {
        html += `<tr class='data-launch-table-clickable-defect-report-record' data-id='${row.id}' id='defectReports_${this.id}_${row.id}'>
                    <td class='data-launch-table-clickable-defect-report-record' data-id='${row.id}'>${row.reference}</td>`
                    if (row.reported_date) {
                      let formattedDate = row.reported_date.split('T')[0];
                      html += `<td class='data-launch-table-clickable-defect-report-record' data-id='${row.id}'>${this.getFormattedDate(formattedDate)}</td>`
                    }
                    else {
                      html += `<td class='data-launch-table-clickable-defect-report-record' data-id='${row.id}'></td>`
                    }
    html += `
                    <td class='data-launch-table-clickable-defect-report-record' data-id='${row.id}'>${row.defect_description}</td>
                    <td class='data-launch-table-clickable-defect-report-record' data-id='${row.id}'>${row.dvsa_notified ? 'Yes' : 'No'}</td>
                    <td class='data-launch-table-clickable-defect-report-record' data-id='${row.id}'>${row.repaired ? 'Yes' : 'No'}</td>
                    <td><i class="bi bi-trash data-launch-subgrid-delete-defect-report-item" data-id='${row.id}'></i></td>             
                </tr>`
      });
        html += `</tbody></table>`;
        this.container.innerHTML = html;
    }

    else if (this.type === 'motBayCleaningLog') {
      html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
      <thead>
          <tr>
              <th style="width: 20%;">Date</th>
              <th style="width: 20%;">Signed</th>
              <th style="width: 50%;">Description</th>
              <th style="width: 3% !important;"></th>
          </tr>
        </thead>
        <tbody id="motBayCleaningLog_tbody_${this.id}">
      `;
      this.data.forEach(row =>  {
      html += `<tr class='data-launch-table-clickable-mot-bay-cleaning-log-record' data-id='${row.id}' id='motBayCleaningLog_${this.id}_${row.id}'>`
                    if (row.date) {
                      let formattedDate = row.date.split('T')[0];
                      html += `<td class='data-launch-table-clickable-mot-bay-cleaning-log-record' data-id='${row.id}'>${this.getFormattedDate(formattedDate)}</td>`
                    }
                    else {
                      html += `<td class='data-launch-table-clickable-mot-bay-cleaning-log-record' data-id='${row.id}'></td>`
                    }
        html +=  `<td class='data-launch-table-clickable-mot-bay-cleaning-log-record' data-id='${row.id}'>${row.signed}</td>
                  <td class='data-launch-table-clickable-mot-bay-cleaning-log-record' data-id='${row.id}'>${row.description || ''}</td>
                  <td><i class="bi bi-trash data-launch-subgrid-delete-mot-bay-cleaning-log-item" data-id='${row.id}'></i></td>             
              </tr>`
      });
      html += `</tbody></table>`;
      this.container.innerHTML = html;
    }

    else if (this.type === 'tqis') {
      html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
      <thead>
          <tr>
              <th style="width: 20%;">Create Date</th>
              <th style="width: 20%;">Month</th>
              <th style="width: 20%;">Year</th>
              <th style="width: 20%;">Class</th>
              <th style="width: 3% !important;"></th>
          </tr>
        </thead>
        <tbody id="tqi_tbody_${this.id}">
      `;
      this.data.forEach(row =>  {
      html += `<tr class='data-launch-table-clickable-tqi-record' data-id='${row.id}' id='tqi_${this.id}_${row.id}'>`
                    if (row.create_date) {
                      let formattedDate = row.create_date.split('T')[0];
                      html += `<td class='data-launch-table-clickable-tqi-record' data-id='${row.id}'>${this.getFormattedDate(formattedDate)}</td>`
                    }
                    else {
                      html += `<td class='data-launch-table-clickable-tqi-record' data-id='${row.id}'></td>`
                    }
        html +=  `<td class='data-launch-table-clickable-tqi-record' data-id='${row.id}'>${row.month || ''}</td>
                  <td class='data-launch-table-clickable-tqi-record' data-id='${row.id}'>${row.year || ''}</td>
                  <td class='data-launch-table-clickable-tqi-record' data-id='${row.id}'>${row.class || ''}</td>
                  <td><i class="bi bi-trash data-launch-subgrid-delete-tqi-record-item" data-id='${row.id}'></i></td>             
              </tr>`
      });
      html += `</tbody></table>`;
      this.container.innerHTML = html;
    }

    else if (this.type === 'testerTrainingRecords') {
      html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
      <thead>
          <tr>
              <th style="width: 20%;">Training Subject</th>
              <th style="width: 10%;">Created By</th>
              <th style="width: 20%;">Date</th>
              <th style="width: 12.5%;">Duration</th>
              <th style="width: 32.5%;">Training Topics Covered</th>
              <th style="width: 3% !important;"></th>
          </tr>
        </thead>
        <tbody id="testerTrainingRecords_tbody_${this.id}">
      `;
      this.data.forEach(row => 
      html += `<tr class='data-launch-table-clickable-tester-training-record' data-id='${row.id}' id='testerTrainingRecords_${this.id}_${row.id}'>
                  <td class='data-launch-table-clickable-tester-training-record' data-id='${row.id}'>${row.training_subject}</td>
                  <td class='data-launch-table-clickable-tester-training-record' data-id='${row.id}'>${row.created_by_name}</td>
                  <td class='data-launch-table-clickable-tester-training-record' data-id='${row.id}'>${this.getFormattedDate(row.date)}</td>
                  <td class='data-launch-table-clickable-tester-training-record' data-id='${row.id}'>${row.duration}</td>
                  <td class='data-launch-table-clickable-tester-training-record' data-id='${row.id}'>${row.training_topics}</td>
                  <td><i class="bi bi-trash data-launch-subgrid-delete-tester-training-record-item" data-id='${row.id}'></i></td>             
              </tr>`
      );
      html += `</tbody></table>`;
      this.container.innerHTML = html;
    }

    else if (this.type === 'qcCheckersForBike') {
      html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
      <thead>
          <tr>
              <th style="width: 10%;">Tester Name</th>
              <th style="width: 10%;">Vehicle Reg</th>
              <th style="width: 15%;">Date of QC</th>
              <th style="width: 10%;">QC Carried out by</th>
              <th style="width: 10%;">Vehicle Class</th>
              <th style="width: 10%;">Name QC Checker</th>
              <th style="width: 3% !important;"></th>
          </tr>
        </thead>
        <tbody id="qcCheckersForBike_tbody_${this.id}">
      `;
      console.log('this.data that needs sorting Liam qcCheckersForBike', this.data)
      this.data.sort((a, b) => new Date(b.date_of_qc) - new Date(a.date_of_qc));
      this.data.forEach(row => 
      html += `<tr class='data-launch-table-clickable-qc-checker-bike-record' data-id='${row.id}' id='qcCheckersForBike_${this.id}_${row.id}'>
                  <td class='data-launch-table-clickable-qc-checker-bike-record' data-id='${row.id}'>${row.tester_name}</td>
                  <td class='data-launch-table-clickable-qc-checker-bike-record' data-id='${row.id}'>${row.vehicle_reg}</td>
                  <td class='data-launch-table-clickable-qc-checker-bike-record' data-id='${row.id}'>${this.getFormattedDate(row.date_of_qc)}</td>
                  <td class='data-launch-table-clickable-qc-checker-bike-record' data-id='${row.id}'>${row.qc_carried_out_by}</td>
                  <td class='data-launch-table-clickable-qc-checker-bike-record' data-id='${row.id}'>${row.vehicle_class}</td>
                  <td class='data-launch-table-clickable-qc-checker-bike-record' data-id='${row.id}'>${row.name_qc_checker}</td>
                  <td><i class="bi bi-trash data-launch-subgrid-delete-qc-checker-bike-item" data-id='${row.id}'></i></td>             
              </tr>`
      );
      html += `</tbody></table>`;
      this.container.innerHTML = html;
    }

    else if (this.type === 'garageUsers') {
      html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
      <thead>
          <tr>
              <th style="width: 10%;">Created On</th>
              <th style="width: 10%;">Email</th>            
              <th style="width: 10%;">First Name</th>
              <th style="width: 10%;">Last Name</th>
              <th style="width: 3% !important;"></th>
          </tr>
        </thead>
        <tbody id="garageUsers_tbody_${this.id}">
      `;
      this.data.forEach(row => 
      html += `<tr class='data-launch-table-clickable-garage-user-record' data-id='${row.id}' id='garageUser_${this.id}_${row.id}'>
                  <td class='data-launch-table-clickable-garage-user-record' data-id='${row.id}'>${this.getFormattedDate(row.create_date)}</td>
                  <td class='data-launch-table-clickable-garage-user-record' data-id='${row.id}'>${row.username}</td>
                  <td class='data-launch-table-clickable-garage-user-record' data-id='${row.id}'>${row.first_name}</td>
                  <td class='data-launch-table-clickable-garage-user-record' data-id='${row.id}'>${row.last_name}</td>
                  <td><i class="bi bi-trash data-launch-subgrid-delete-garage-user-item" data-id='${row.id}'></i></td>       
              </tr>`
      );
      html += `</tbody></table>`;
      this.container.innerHTML = html;
    }

    else if (this.type === 'garageBays') {
      html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
      <thead>
          <tr>
              <th style="width: 10%;">Created On</th>
              <th style="width: 10%;">Bay Name</th>            
              <th style="width: 5%;">MOT Bay?</th>
              <th style="width: 10%;">Time Segments</th>
              <th style="width: 3% !important;"></th>
          </tr>
        </thead>
        <tbody id="garageUsers_tbody_${this.id}">
      `;
      this.data.forEach(row => 
      html += `<tr class='data-launch-table-clickable-garage-bay-record' data-id='${row.id}' id='garageBay_${this.id}_${row.id}'>
                  <td class='data-launch-table-clickable-garage-bay-record' data-id='${row.id}'>${this.getFormattedDate(row.create_date)}</td>
                  <td class='data-launch-table-clickable-garage-bay-record' data-id='${row.id}'>${row.bay_name}</td>
                  <td class='data-launch-table-clickable-garage-bay-record' 
                      data-id='${row.id}'>${row.mot_bay === 1 ? '<i style="font-size:18px; color: green; font-weight:bold;" class="bi bi-check-circle"></i>' : '<i style="font-size:18px; color: red; font-weight:bold;" class="bi bi-x-circle"></i>'}</td>
                  <td class='data-launch-table-clickable-garage-bay-record' data-id='${row.id}'>${row.time_segments}</td>
                  <td><i class="bi bi-trash data-launch-subgrid-delete-garage-bay-item" data-id='${row.id}'></i></td>       
              </tr>`
      );
      html += `</tbody></table>`;
      this.container.innerHTML = html;
    }
    
    else if (this.type === 'motReconciliations') {
      html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
      <thead>
          <tr>
              <th style="width: 10%;">Month</th>
              <th style="width: 10%;">Year</th>            
              <th style="width: 10%;">Status</th>
              <th style="width: 10%;">Create Date</th>
              <th style="width: 10%;">Submitted Date</th>
              <th style="width: 3% !important;"></th>
          </tr>
        </thead>
        <tbody id="motReconciliations_tbody_${this.id}">
      `;
      this.data.forEach(row => 
      html += `<tr class='data-launch-table-clickable-mot-reconciliation-record' data-id='${row.id}' id='motReconciliation_${this.id}_${row.id}'>
                  <td style="${row.status === 1 ? 'background-color: #17b117; color: #ffffff' : ''}" class='data-launch-table-clickable-mot-reconciliation-record' data-id='${row.id}'>${row.month}</td>
                  <td style="${row.status === 1 ? 'background-color: #17b117; color: #ffffff' : ''}" class='data-launch-table-clickable-mot-reconciliation-record' data-id='${row.id}'>${row.year}</td>
                  <td style="${row.status === 1 ? 'background-color: #17b117; color: #ffffff' : ''}" class='data-launch-table-clickable-mot-reconciliation-record' data-id='${row.id}'>${row.status === 1 ? 'Submitted' : 'Draft'}</td>
                  <td style="${row.status === 1 ? 'background-color: #17b117; color: #ffffff' : ''}" class='data-launch-table-clickable-mot-reconciliation-record' data-id='${row.id}'>${this.getFormattedDate(row.create_date)}</td>
                  <td style="${row.status === 1 ? 'background-color: #17b117; color: #ffffff' : ''}" class='data-launch-table-clickable-mot-reconciliation-record' data-id='${row.id}'>${this.getFormattedDate(row.submitted_date)}</td>
                  <td style="${row.status === 1 ? 'background-color: #17b117; color: #ffffff' : ''}"><i style="${row.status === 1 ? 'display: none' : ''}" class="bi bi-trash data-launch-subgrid-delete-mot-reconcilation-item" data-id='${row.id}'></i></td>       
              </tr>`
      );
      html += `</tbody></table>`;
      this.container.innerHTML = html;
    }

    else if (this.type === 'garageReminders') {

      let todaysDate = new Date()
      let reducedData = []
      let anyRecordsBeforeToday = false
      for (let i = 0; i < this.data.length; i++) {
        if (this.rows === 30) {
          if (this.isDateInNext30Days(todaysDate, this.parseDate(this.data[i].due_date))) {
            // let beforeToday = this.isDateBeforeToday(this.data[i].due_date)
            // if (beforeToday) {
            //   anyRecordsBeforeToday = true
            //   this.data[i].beforeToday = true
            // }
            reducedData.push(this.data[i])
          } else {
            // // console.log(`The date ${this.data[i].due_date} is NOT within 30 days of today.`);
          }
        }
        else if (this.rows === 60) {
          if (this.isDateInNext60Days(todaysDate, this.parseDate(this.data[i].due_date))) {
            // let beforeToday = this.isDateBeforeToday(this.data[i].due_date)
            // if (beforeToday) {
            //   anyRecordsBeforeToday = true
            //   this.data[i].beforeToday = true
            // }
            reducedData.push(this.data[i])
          } else {
            // // console.log(`The date ${this.data[i].due_date} is NOT within 30 days of today.`);
          }
        }
        else if (this.rows === 'All Dates') {
          let beforeToday = this.isDateBeforeToday(this.data[i].due_date)
            if (beforeToday) {
              anyRecordsBeforeToday = true
              this.data[i].beforeToday = true
            }
            reducedData.push(this.data[i])
        }      
      }

      html += `<div style="
                            background-color: #0068B5;
                            height: 40px;
                            border-radius: 5.5px;
                            padding-top: 5px;">
                <h2 style="
                            display: inline-block;
                            width: 75%;
                            text-align: center;
                            color: #fff3cd !important;">
                            
                            Overdue Reminders
                </h2>
              </div>`
      html += `<table class="table table-hover data-launch-table-clickable-row data-launch-garage-reminders-table" style='width: 100%; table-layout: fixed;'>
      <thead>
          <tr>
              <th style="width: 20%;">Title</th>            
              <th style="width: 20%;">Description</th>
              <th style="width: 12.5%;">Created By</th>
              <th style="width: 15%;">Due Date</th>
              <th style="width: 5%;"></th>
          </tr>
        </thead>
        <tbody id="garageRemindersOverdue_tbody_${this.id}">
        `
        this.data.forEach(row => {
              if (this.isDateBeforeToday(row.due_date)) {
                html+= 
                  `<tr 
                      class='data-launch-table-clickable-garage-reminder-record'
                      data-id='${row.id}'
                      id='garageReminder_${this.id}_${row.id}'
                      style='background-color: red'
                    >
                    <td style="background-color: red" class='data-launch-table-clickable-garage-reminder-record' data-id='${row.id}'>${row.title}</td>
                    <td style="background-color: red" class='data-launch-table-clickable-garage-reminder-record' data-id='${row.id}'>${row.description}</td>
                    <td style="background-color: red" class='data-launch-table-clickable-garage-reminder-record' data-id='${row.id}'>${row.created_by}</td>
                    <td style="background-color: red" class='data-launch-table-clickable-garage-reminder-record' data-id='${row.id}'>${row.due_date}</td>
                    <td style="background-color: red" ><i class="bi bi-trash data-launch-subgrid-delete-garage-reminder-item" data-id='${row.id}'></i></td>       
                </tr>`
              } 
      });
      html += `</tbody>
        </table>`;
      ///// reminders 
      html += `<div style="
                            background-color: #0068B5;
                            height: 40px;
                            border-radius: 5.5px;
                            padding-top: 5px;">
                <h2 style="
                            display: inline-block;
                            width: 75%;
                            text-align: center;
                            color: #fff3cd !important;">
                            
                            Reminders
                </h2>
                <select 
                        id="data-launch-garage-reminders-subgrid-number-of-rows-filter_${this.id}"
                        class="data-launch-garage-reminders-subgrid-number-of-rows-filter"
                        style="
                            display: inline-block;
                            width: 20%;
                            font-size: 14px;
                            height: 24px;
                            padding: 0px 0px 0px 0px;
                            margin-bottom: 0px;">
                                                  <option ${this.rows === 30 ? 'selected': ''}>Within 30 Days</option>
                                                  <option ${this.rows === 60 ? 'selected': ''}>Within 60 Days</option>
                                                  <option ${this.rows === 'All Dates' ? 'selected': ''}>All Dates</option>
                </select>
              </div>`
      html += `<table class="table table-hover data-launch-table-clickable-row data-launch-garage-reminders-table" style='width: 100%; table-layout: fixed;'>
      <thead>
          <tr>
              <th style="width: 20%;">Title</th>            
              <th style="width: 20%;">Description</th>
              <th style="width: 12.5%;">Created By</th>
              <th style="width: 15%;">Due Date</th>
              <th style="width: 5%;"></th>
          </tr>
        </thead>
        <tbody id="garageReminders_tbody_${this.id}">
      `;
      
      reducedData.forEach(row => {
        if (!this.isDateBeforeToday(row.due_date)) {
            html += `<tr 
                      class='data-launch-table-clickable-garage-reminder-record'
                      data-id='${row.id}'
                      id='garageReminder_${this.id}_${row.id}'>
                    <td class='data-launch-table-clickable-garage-reminder-record' data-id='${row.id}'>${row.title}</td>
                    <td class='data-launch-table-clickable-garage-reminder-record' data-id='${row.id}'>${row.description}</td>
                    <td class='data-launch-table-clickable-garage-reminder-record' data-id='${row.id}'>${row.created_by}</td>
                    <td class='data-launch-table-clickable-garage-reminder-record' data-id='${row.id}'>${row.due_date}</td>
                    <td><i class="bi bi-trash data-launch-subgrid-delete-garage-reminder-item" data-id='${row.id}'></i></td>       
                </tr>`
        }
      });
      html += `</tbody></table>`;
      this.container.innerHTML = html;
      if (anyRecordsBeforeToday) {
        this.sendOverdueAlertReminder(reducedData)
      }      
     } 
    }

    sendOverdueAlertReminder (reducedData) {
      let messageString = ''
      reducedData.forEach(item => {
            if (item.beforeToday) {
              messageString += `<li>${item.title} - ${item.due_date} </li>`
          }
      })
      // alert(`${messageString}`)
      document.getElementById('data-launch-garage-overdue-reminders-alert').style.display = 'block'
      document.getElementById('data-launch-garage-overdue-reminders-alert-list-ul').innerHTML = messageString     
    }
    isDateBeforeToday(dateStr) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
      const parsedDate = this.parseDate(dateStr);
      return parsedDate < today;
    }
    parseDate(ddmmyyyy) {
      const [day, month, year] = ddmmyyyy.split("/").map(Number);
      return new Date(year, month - 1, day); // month is 0-indexed
    }
    timeStringToMinutes(timeStr) {
      const parts = timeStr.split(":");
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      return hours * 60 + minutes;
    }
    areDatesWithin30Days(date1, date2) {
      const timeDifference = Math.abs(date2 - date1); // Difference in milliseconds
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert to days
      return daysDifference <= 30;
    }
    isDateInNext30Days(date1, date2) {
      const timeDifference = date2 - date1; // in milliseconds
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

      return daysDifference >= 0 && daysDifference <= 30;
    }
    isDateInNext60Days(date1, date2) {
      const timeDifference = date2 - date1; // in milliseconds
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

      return daysDifference >= 0 && daysDifference <= 60;
    }
    areDatesWithin60Days(date1, date2) {
      const timeDifference = Math.abs(date2 - date1); // Difference in milliseconds
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert to days
      return daysDifference <= 60;
    }

    getThisWeekDays() {
      // If we have not set a referenceDate yet, initialize it to this Monday.
      if (!this.referenceDate) {
        const now = new Date();
        // Force the time to noon to avoid timezone shifts.
        now.setHours(12, 0, 0, 0);
        // Compute Monday (with Monday=0, Sunday=6).
        const dayOfWeek = (now.getDay() + 6) % 7;
        now.setDate(now.getDate() - dayOfWeek);
        // Now is Monday. Store it.
        this.referenceDate = now;
      }
      
      // If weekOffset is nonzero, apply it to the referenceDate.
      if (this.weekOffset) {
        // Add or subtract 7, for example.
        this.referenceDate.setDate(this.referenceDate.getDate() + this.weekOffset);
        // Reset the offset so we don’t apply it again next time.
        this.weekOffset = 0;
      }
      
      // Now build the days array from this.referenceDate (which is always a Monday).
      let days = [];
      for (let i = 0; i < 7; i++) {
        let d = new Date(this.referenceDate);
        d.setDate(this.referenceDate.getDate() + i);
        // Force each day to noon.
        d.setHours(12, 0, 0, 0);
        // Convert to a day name.
        const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
        days.push({
          day: dayName,
          date: d,
          bays: this.baysData.map(bay => ({
            name: bay.bay_name,
            create_date: bay.create_date,
            garage_id: bay.garage_id,
            id: bay.id,
            mot_bay: bay.mot_bay,
            increment: bay.time_segments
          }))
        });
      }
      return days;
    }
    
    
    

    getFormattedDateTime(date) {
      if (date) {
          const now = new Date(date);
      
          const day = String(now.getDate()).padStart(2, '0');
          const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
          const year = now.getFullYear();
      
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
      
          return `${day}/${month}/${year} - ${hours}:${minutes}`;
      }
      else {
        return ''
      }
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
    addItem() {
      const newItem = prompt('Enter new item:');
      if (newItem) {
        this.data.push(newItem);
        this.render();
      }
    }
  
    deleteItem(index) {
      this.data.splice(index, 1);
      this.render();
    }

    formatDate(date) {
      return date.toISOString().split("T")[0];
    }
    formatTime(totalMinutes) {
      totalMinutes = Math.round(totalMinutes);
      let hours = Math.floor(totalMinutes / 60);
      let minutes = totalMinutes % 60;
      return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
    }
    addMonthlyWidget() {
      document.getElementById("monthPicker").addEventListener("change", (e) => {
        const parts = e.target.value.split("-");
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
    
        // Create a date at noon
        const selectedDate = new Date(year, month, day, 12, 0, 0, 0);
    
        // Compute Monday for the selected week.
        const selectedDayOfWeek = (selectedDate.getDay() + 6) % 7;
        selectedDate.setDate(selectedDate.getDate() - selectedDayOfWeek);
    
        // Update the reference date.
        this.referenceDate = selectedDate;
    
        // Correctly reset the week offset.
        this.currentWeekOffset = 0;
    
        // Re-render the calendar.
        this.render();
      })
          
    }

    onBayDragOver(e, bay) {
      e.preventDefault();
      bay.classList.add("dragover");
      const rect = bay.getBoundingClientRect();
      let predictedTop = e.clientY - rect.top - this.dragOffsetY + this.DROP_OFFSET;
      if (predictedTop < this.BAY_HEADER_HEIGHT) predictedTop = this.BAY_HEADER_HEIGHT;
      const inc = Number(bay.getAttribute("data-increment"));
      let relativePredicted = predictedTop - this.BAY_HEADER_HEIGHT;
      let snappedRelative = Math.round(relativePredicted / 5) * 5; // Force 5-minute grid
      let snapTop = snappedRelative + this.BAY_HEADER_HEIGHT;
      let hoverTime = this.formatTime(snappedRelative + this.operatingStart);
      let hoverIndicator = bay.querySelector(".hover-time");
      if (!hoverIndicator) {
        hoverIndicator = document.createElement("div");
        hoverIndicator.className = "hover-time";
        bay.appendChild(hoverIndicator);
      }
      hoverIndicator.innerText = hoverTime;
      hoverIndicator.style.top = snapTop + "px";
    }

  
  
    onBayDragLeave(e, bay) {
      bay.classList.remove("dragover");
      let hoverIndicator = bay.querySelector(".hover-time");
      if (hoverIndicator) hoverIndicator.remove();
    }
    

  onBayDrop(e, bay) {
    e.preventDefault();
    bay.classList.remove("dragover");
    let hoverIndicator = bay.querySelector(".hover-time");
    if (hoverIndicator) hoverIndicator.remove();
    this.dropEvent(e, bay);
  }
  
  onDragStart(e) {
    this.dragEventElem = e.target;
    this.sourceBay = this.dragEventElem.parentElement;
    this.dragOffsetY = e.offsetY;
    let tooltip = this.dragEventElem.querySelector('.tooltip');
    if (tooltip) tooltip.style.display = 'none';
    const ghost = new Image();
    ghost.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    e.dataTransfer.setDragImage(ghost, 0, 0);
    e.dataTransfer.setData("text/plain", "dummy");
    // // console.log('onDragStart', e.target.dataset)
    this.recordBeingDraggedId = e.target.dataset.recordId
    this.recordBeingDraggedDuration = e.target.dataset.duration
  }

//   addMinutesToTime(startTime, minutesToAdd) {
//     let time = new Date(`1970-01-01T${startTime}:00`); // Create a Date object with a fixed date
//     time.setMinutes(time.getMinutes() + minutesToAdd); // Add minutes
//     return time.toTimeString().slice(0, 5); // Return HH:MM format
// }

addMinutesToTime(startTime, minutesToAdd) {
  let [hours, minutes] = startTime.split(":").map(Number);
  let time = new Date(Date.UTC(1970, 0, 1, hours, minutes)); // Ensure UTC
  time.setUTCMinutes(time.getUTCMinutes() + minutesToAdd); // Use UTC for consistency
  return time.toISOString().slice(11, 16); // Extract HH:MM from ISO format
}

  
  dropEvent(e, targetBay) {
    if (!this.dragEventElem) return;
    const rect = targetBay.getBoundingClientRect();
    let newTop = e.clientY - rect.top - this.dragOffsetY + this.DROP_OFFSET;
    if (newTop < this.BAY_HEADER_HEIGHT) newTop = this.BAY_HEADER_HEIGHT;
    const inc = Number(targetBay.getAttribute("data-increment"));
    let relativeTime = newTop - this.BAY_HEADER_HEIGHT;
    let snappedRelative = Math.round(relativeTime / 5) * 5; // 5-minute increments
    newTop = snappedRelative + this.BAY_HEADER_HEIGHT;
    if (newTop + this.dragEventElem.offsetHeight > targetBay.clientHeight + this.BAY_HEADER_HEIGHT) {
      newTop = targetBay.clientHeight + this.BAY_HEADER_HEIGHT - this.dragEventElem.offsetHeight;
    }
    this.dragEventElem.style.top = newTop + "px";
    targetBay.appendChild(this.dragEventElem);
    
    let tooltip = this.dragEventElem.querySelector('.tooltip');
    if (tooltip) tooltip.style.display = '';
    
    // let finalTime = snappedRelative + this.operatingStart;
    // if (finalTime < this.operatingStart) finalTime = this.operatingStart;
    // if (finalTime + duration > this.operatingFinish) finalTime = this.operatingFinish - duration;


    
    // const duration = Number(this.dragEventElem.dataset.duration);

    const duration = Number(this.dragEventElem.dataset.duration);
    let finalTime = snappedRelative + this.operatingStart;
    if (finalTime < this.operatingStart) finalTime = this.operatingStart;
    if (finalTime + duration > this.operatingFinish) finalTime = this.operatingFinish - duration;
    let timeStr = this.formatTime(finalTime);
    this.dragEventElem.dataset.start = finalTime;
    // tooltip.innerHTML = "Time: " + this.formatTime(finalTime) + " - " + this.formatTime(finalTime + duration) +
    //                     "<br>" + this.dragEventElem.dataset.metadata + 
    //                     "<br>" + "<button class='btn btn-primary data-launch-garage-bookings-grid-view-tooltip-open-booking-btn'>Open Booking</button>"
    
    if (this.sourceBay && this.sourceBay !== targetBay) this.layoutBay(this.sourceBay);
    this.layoutBay(targetBay);
    

    this.showCRUDAlert('Booking has not been moved \n This functionality is in progress \n The existing booking date & time will NOT have changed', 'error')
    // // console.log('tooltip', tooltip)
    // // console.log('dropevent', e.target.dataset)
    // // console.log('finalTime', finalTime)
    // // console.log('need to update this record value ', this.recordBeingDraggedId )
    // // console.log('this.baysData', this.baysData)
    // // console.log('timeStr', timeStr)
    // let newBayID;
    // this.baysData.forEach(bay => {
    //   if (bay.bay_name === e.target.dataset.bay) {
    //     newBayID = bay.id
    //   }
    // })
    // let endTime = this.addMinutesToTime(timeStr, this.recordBeingDraggedDuration)
    // // console.log('START TIME OF EVENT',e.target.dataset.time)
    // // console.log('END TIME OF EVENT', endTime)
    // let obj = {
    //   booking_date: e.target.dataset.date,
    //   time_start: timeStr,
    //   time_end: endTime,
    //   bay: newBayID
    // }

    //     this.secureAction('update', 'data_launch_garage_bookings', parseInt(this.recordBeingDraggedId), obj).then(res => {
    //         // console.log('data_launch_garage_bookings res', res);
    //         for (let i = 0; i < garageClassInstantiated.garageBookingsData.length; i++) {
    //             if (garageClassInstantiated.garageBookingsData[i].id === parseInt(this.recordBeingDraggedId)) {
    //               garageClassInstantiated.garageBookingsData[i] = res;
    //             }        
    //         }
    //         garageClassInstantiated.injectDataIntoGarageBookingsSubgrid();
    //     }, err => { 
    //         console.error(err); 
    // });


    // this.secureAction('update', 'data_launch_garage_bookings', parseInt(this.recordBeingDraggedId), obj).then(res => {
    //         // console.log('data_launch_garage_bookings res', res);
    //         this.garageBookingsSubgridClass.render(null, null, 0, 'garageBookings')
    //         this.garageBookingsData.forEach(booking => {
    //           if (booking.id === parseInt(this.recordBeingDraggedId)) {
    //             booking = res
    //           }
    //         })
    //         this.data.forEach(booking => {
    //           if (booking.id === parseInt(this.recordBeingDraggedId)) {
    //             booking = res
    //           }
    //         })
    //     }, err => { 
    //         console.error(err); 
    // });


    this.dragEventElem = null;
    this.sourceBay = null;
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
        else if (table === 'tester_garages') {
            if (USER_RECORD.testers_create === 1) {
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
        else if (table === 'data_launch_bays') {
            if (USER_RECORD.data_launch_bays_update === 1) {
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
        else if (table === 'data_launch_garage_records') {
            if (USER_RECORD.garage_details_delete === 1) {
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
        // // console.log('this is all being processed via the new secureAction function');    
        
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

  showCRUDAlert(message, type) {
    const alertBox = document.getElementById("data-launch-subgrid-crud-alert-box");
    const alertMessage = document.getElementById("data-launch-subgrid-crud-alert-message");
    const alertIcon = document.getElementById("data-launch-subgrid-crud-alert-icon");

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
  
  // layoutBay(bay) {
  //   const events = Array.from(bay.querySelectorAll('.event'));
  //   let eventInfos = events.map(event => {
  //     let start = parseInt(event.style.top);
  //     let end = start + event.offsetHeight;
  //     return { element: event, start: start, end: end, col: 0, totalCols: 1 };
  //   });
  //   eventInfos.sort((a, b) => a.start - b.start);
  //   let active = [];
  //   for (let info of eventInfos) {
  //     active = active.filter(e => e.end > info.start);
  //     let usedCols = active.map(e => e.col);
  //     let col = 0;
  //     while (usedCols.includes(col)) { col++; }
  //     info.col = col;
  //     active.push(info);
  //     let groupSize = active.length;
  //     for (let e of active) {
  //       e.totalCols = groupSize;
  //     }
  //   }
  //   eventInfos.forEach(info => {
  //     let widthPercent = 100 / info.totalCols;
  //     info.element.style.width = widthPercent + "%";
  //     info.element.style.left = (info.col * widthPercent) + "%";
  //   });
  // }
  

  layoutBay(bay) {
      // // console.log("Layout recalculating for bay:", bay);
      // // console.log("Events inside bay before layout:", bay.querySelectorAll(".event").length);
      const events = Array.from(bay.querySelectorAll('.event'));

      if (events.length === 0) return;

      let eventInfos = events.map(event => {
          let start = parseInt(event.style.top, 10);
          let end = start + event.offsetHeight;
          return { element: event, start, end, col: 0, totalCols: 1 };
      });

      // Sort events by start time
      eventInfos.sort((a, b) => a.start - b.start);

      let active = [];

      for (let info of eventInfos) {
          active = active.filter(e => e.end > info.start); // Remove past events

          let usedCols = active.map(e => e.col);
          let col = 0;
          while (usedCols.includes(col)) { col++; }

          info.col = col;
          active.push(info);

          let maxCols = active.length;
          for (let e of active) {
              e.totalCols = Math.max(e.totalCols, maxCols);
          }
      }

      eventInfos.forEach(info => {
          let widthPercent = 100 / info.totalCols;
          info.element.style.width = `calc(${widthPercent}% - 2px)`;
          info.element.style.left = `calc(${info.col * widthPercent}% + 1px)`;
      });
      // // console.log("Updated event layout:", eventInfos);

}


  
 
  getMetaData(eventDate,bayName,duration,reg, notes) {
    // // console.log(eventDate,bayName,duration,reg)
    return `Date: ${eventDate}<br>Bay: ${bayName}<br>Duration: ${duration}<br>Reg: ${reg}<br>Notes: ${notes}`;
  }
  // getRandomHex() {
  //       return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  // }

  // getRandomHex() {
  //   // Toggle between the two colors
  //   this.lastColor = this.lastColor === this.colors[0] ? this.colors[1] : this.colors[0];
  //   return this.lastColor;
  // }
 getRandomHex( workCompleted,vehicleInProgress,vehicleArrived,bookingMade) {
   const statusColorMap = {
  status_booking_made: '#759AF7',                   // Stronger Lavender
  status_vehicle_arrived_on_site: '#E4ADFB',        // Hot Pink
  status_work_on_vehicle_in_progress: '#F5E77F',    // Bright Yellow
  status_work_completed: '#C4EAA2'                  // Brighter Mint Green
  };
  if (workCompleted === 1) {
    return statusColorMap.status_work_completed
  }
  else if (vehicleInProgress === 1) {
    return statusColorMap.status_work_on_vehicle_in_progress
  }
  else if (vehicleArrived === 1) {
    return statusColorMap.status_vehicle_arrived_on_site
  }
  else {
    return statusColorMap.status_booking_made
  }
 }
 
  
  createEvent(eventDate, bayName, startMinute, duration, text, id ,startTime, endTime, notes, workCompleted,vehicleInProgress,vehicleArrived,bookingMade) {
    const eventDateObj = new Date(eventDate);
    const eventDateStr = eventDateObj.toISOString().split("T")[0];


    const currentWeekMonday = this.normalize(this.daysData[0].date);
    const currentWeekSunday = new Date(currentWeekMonday);
    currentWeekSunday.setDate(currentWeekSunday.getDate() + 6);
    const eventDateNorm = this.normalize(eventDateObj);
    
    if (eventDateNorm < currentWeekMonday || eventDateNorm > currentWeekSunday) {
      // // console.log("Skipping event outside of current week:", eventDateStr);
      return;
    }

    let dayObj = this.daysData.find(d => d.date.toISOString().split("T")[0] === eventDateStr);
    if (!dayObj) {
        console.error("Event date not found in current week:", eventDateStr);
        return;
    }

    // Find the correct column for the event
    const dayCol = Array.from(document.getElementsByClassName("day-column"))
        .find(dc => dc.querySelector(".day-header").innerText.startsWith(dayObj.day));
    if (!dayCol) return;

    const bay = Array.from(dayCol.getElementsByClassName("bay"))
        .find(b => b.querySelector(".bay-header").innerText.trimEnd() === bayName.trimEnd());
    if (!bay) return;

    // Create the event element
    const eventElem = document.createElement("div");
    eventElem.className = "event data-launch-table-clickable-garage-booking-record";
    eventElem.innerText = text;
    eventElem.style.top = (startMinute - this.operatingStart + this.BAY_HEADER_HEIGHT) + "px";
    eventElem.style.height = duration + "px"
    eventElem.dataset.duration = duration;
    eventElem.dataset.start = startMinute;
    eventElem.dataset.recordId = id;
    eventElem.dataset.id = id;
    eventElem.dataset.metadata = this.getMetaData(eventDate,bayName,duration,text, notes);
    eventElem.style.backgroundColor = this.getRandomHex(workCompleted,vehicleInProgress,vehicleArrived,bookingMade)
    eventElem.style.color = 'black'
    eventElem.style.fontWeight = 'bold';
    eventElem.style.textTransform = 'uppercase';
    eventElem.style.textAlign = 'center';
    // eventElem.setAttribute("draggable", "true");
    // eventElem.addEventListener("dragstart", (e) => this.onDragStart(e));

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.innerHTML = "Time: " + this.formatTime(startMinute) + " - " +
                        this.formatTime(startMinute + duration) +
                        "<br>" + eventElem.dataset.metadata + "<br>" + `<button class='btn btn-primary data-launch-garage-bookings-grid-view-tooltip-open-booking-btn data-launch-table-clickable-garage-booking-record' data-id="${id}">Open Booking</button>
                        <br><br><a class='data-launch-garage-bookings-grid-view-tooltip-open-booking-btn data-launch-table-clickable-garage-booking-record-duplicate' data-id="${id}">Duplicate in Non MOT Bay</a>
                        <br><i class='bi bi-trash data-launch-subgrid-delete-garage-booking-item-bay-grid-view bay-grid-view-delete-button' data-id="${id}"></i> `;
    tooltip.style.position = "absolute";
                        
    // tooltip.style.top = "10%";  // positions below the event element
    tooltip.style.left = "0";
    tooltip.style.marginTop = "5px"; // adjust this value as needed
    tooltip.style.height = 'fit-content';

    const rect = eventElem.getBoundingClientRect();
    const offset = 5; // gap between event and tooltip

    // Determine vertical position:
    if (rect.top < 50) {
      // Not enough room above—place tooltip below the event.
      tooltip.style.top = (rect.bottom + window.scrollY + offset + 15) - 10 + "px";
    } else {
      // Enough room above—place tooltip above the event.
      tooltip.style.top = (rect.top + window.scrollY - tooltip.offsetHeight - offset) - 10 + "px";
    }

    // Determine horizontal position:
    if (rect.left < 100) {
      // If too far left, position tooltip to the right.
      tooltip.style.left = (rect.right + window.scrollX + offset - 15) + "px";
    } else {
      // Otherwise, align it with the left side of the event.
      tooltip.style.left = (rect.left + window.scrollX) + "px";
    }

    // Make sure the tooltip is on top.
    tooltip.style.position = "absolute";
    tooltip.style.zIndex = "999999";


    eventElem.appendChild(tooltip);

    bay.appendChild(eventElem);
  
    // this.layoutBay(bay)
    this.resizingBaysArray.push(bay)

    // Show tooltip when mouse enters the event element.
    eventElem.addEventListener("mouseenter", () => {
      tooltip.style.display = "block";
    });

    // When leaving the event element, only hide if the mouse isn’t going into the tooltip.
    eventElem.addEventListener("mouseleave", (e) => {
      if (!tooltip.contains(e.relatedTarget)) {
        tooltip.style.display = "none";
      }
    });

    // Keep the tooltip visible while the mouse is over it.
    tooltip.addEventListener("mouseleave", (e) => {
      if (!eventElem.contains(e.relatedTarget)) {
        tooltip.style.display = "none";
      }
    });

}
 

}