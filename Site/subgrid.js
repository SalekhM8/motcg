class SubGrid {
    constructor(data = [], containerId, type, id, rows, baysData, operatingDays, operatingHours) {
      this.data = data;
      this.containerId = containerId;
      this.type = type
      this.container = document.getElementById(containerId);
      this.rows = rows
      this.baysData = baysData
      this.colors = ["#3c9df4", "#1a1736"]; 
      // Use a local copy to avoid mutating the shared operatingHours object
      const opStart = operatingHours?.start || 8;
      const opEnd   = operatingHours?.end   || 18;
      this.operatingStart  = opStart * 60;           // Convert hours to minutes
      this.operatingFinish = (opEnd + 1) * 60;       // +1 so the grid extends to cover the final hour
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
          const auditTypeLabels = { routine: 'Routine', follow_up: 'Follow-Up', dvsa_prep: 'DVSA Prep', complaint: 'Complaint-Led', new_site: 'New Site' };
          html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
          <thead>
              <tr>
                  <th style="width: 8%;">Score</th>
                  <th style="width: 12%;">Auditor</th>
                  <th style="width: 12%;">Date</th>
                  <th style="width: 12%;">Audit Type</th>
                  <th style="width: 8%;">Status</th>
                  <th style="width: 12%;">Consultant</th>
                  <th style="width: 4%;"></th>
              </tr>
            </thead>
            <tbody id="motsiteaudit_tbody_${this.id}">
          `;
          this.data.sort((a, b) => {
            const da = a.date ? new Date(a.date) : new Date(0);
            const db = b.date ? new Date(b.date) : new Date(0);
            return db - da;
          });
          this.data.forEach(row => {
            const score = row.score_percentage != null ? parseFloat(row.score_percentage) : null;
            let scoreBadge = '<span style="color:#94a3b8;font-size:12px">—</span>';
            if (score !== null) {
              const scoreColor = score >= 80 ? '#27ae60' : score >= 50 ? '#f39c12' : '#e74c3c';
              scoreBadge = `<span style="display:inline-block;padding:3px 10px;border-radius:12px;font-weight:700;font-size:12px;color:#fff;background:${scoreColor}">${score}%</span>`;
            }
            const auditTypeLabel = auditTypeLabels[row.audit_type] || row.audit_type || '—';
            const statusBadge = row.status === 'complete'
              ? '<span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;background:#e8f5e9;color:#2e7d32">Complete</span>'
              : '<span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;background:#fff3e0;color:#e65100">Draft</span>';

            let dateFormatted = '';
            if (row.date) {
              let fd = row.date.split('T')[0];
              dateFormatted = this.getFormattedDate(fd);
            }

            html += `<tr class='data-launch-table-clickable-mot-site-audit-record' data-id='${row.id}' id='motsiteaudit_${this.id}_${row.id}'>
                      <td class='data-launch-table-clickable-mot-site-audit-record' data-id='${row.id}'>${scoreBadge}</td>
                      <td class='data-launch-table-clickable-mot-site-audit-record' data-id='${row.id}'>${row.auditor || ''}</td>
                      <td class='data-launch-table-clickable-mot-site-audit-record' data-id='${row.id}'>${dateFormatted}</td>
                      <td class='data-launch-table-clickable-mot-site-audit-record' data-id='${row.id}'>${auditTypeLabel}</td>
                      <td class='data-launch-table-clickable-mot-site-audit-record' data-id='${row.id}'>${statusBadge}</td>
                      <td class='data-launch-table-clickable-mot-site-audit-record' data-id='${row.id}'>${row.consultant || ''}</td>
                      <td><i class="bi bi-trash data-launch-subgrid-delete-mot-site-audit-item" data-id='${row.id}'></i></td>             
                  </tr>`;
          });
          html += `</tbody></table>`;
          this.container.innerHTML = html;
      }
      else if (this.type === 'qccheckers') {
        html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
          <thead>
            <tr>
                <th style="width: 7%;">Score</th>
                <th style="width: 18%;">Tester Name</th>
                <th style="width: 15%;">Vehicle Reg</th>
                <th style="width: 15%;">Date of QC</th>
                <th style="width: 12%;">QC Type</th>
                <th style="width: 18%;">QC Carried out by</th>
                <th style="width: 10%;">Status</th>
                <th style="width: 5%;"></th>
            </tr>
          </thead>
          <tbody id="qccheckers_tbody_${this.id}">
        `;
        this.data.sort((a, b) => new Date(b.date_of_qc) - new Date(a.date_of_qc));
        this.data.forEach(row => {
          // Traffic light score badge
          let scoreBadge = '';
          if (row.score_percentage !== null && row.score_percentage !== undefined) {
            const pct = parseFloat(row.score_percentage);
            const bgColor = pct >= 80 ? '#27ae60' : pct >= 50 ? '#f39c12' : '#e74c3c';
            scoreBadge = `<span style="display:inline-block;background:${bgColor};color:#fff;padding:3px 8px;border-radius:12px;font-size:12px;font-weight:700;min-width:42px;text-align:center;">${pct}%</span>`;
          } else {
            scoreBadge = `<span style="color:#94a3b8;font-size:12px;">—</span>`;
          }
          // Status badge
          let statusBadge = '';
          if (row.status === 'complete') {
            statusBadge = `<span style="display:inline-block;background:#e8f5e9;color:#27ae60;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600;">Complete</span>`;
          } else if (row.status === 'draft') {
            statusBadge = `<span style="display:inline-block;background:#fff3e0;color:#f39c12;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600;">Draft</span>`;
          } else {
            statusBadge = `<span style="color:#94a3b8;font-size:11px;">—</span>`;
          }
          // QC Type label
          const qcTypeLabels = { routine: 'Routine', targeted: 'Targeted', remedial: 'Remedial', closely_observed: 'Observed', reinspection: 'Re-inspection' };
          const qcTypeLabel = row.qc_type ? (qcTypeLabels[row.qc_type] || row.qc_type) : '—';

          html += `<tr class='data-launch-table-clickable-qc-checker-record' data-id='${row.id}' id='qccheckers_${this.id}_${row.id}'>
                    <td class='data-launch-table-clickable-qc-checker-record' data-id='${row.id}'>${scoreBadge}</td>
                    <td class='data-launch-table-clickable-qc-checker-record' data-id='${row.id}'>${row.tester_name || ''}</td>
                    <td class='data-launch-table-clickable-qc-checker-record' data-id='${row.id}' style="text-transform:uppercase;font-weight:600;">${row.vehicle_reg || ''}</td>`
                    if (row.date_of_qc) {
                      let formattedDate = row.date_of_qc.split('T')[0];
                      html += `<td class='data-launch-table-clickable-qc-checker-record' data-id='${row.id}'>${this.getFormattedDate(formattedDate)}</td>`
                  }
                  else {
                      html += `<td class='data-launch-table-clickable-qc-checker-record' data-id='${row.id}'></td>`
                  }
          html += `
                    <td class='data-launch-table-clickable-qc-checker-record' data-id='${row.id}'>${qcTypeLabel}</td>
                    <td class='data-launch-table-clickable-qc-checker-record' data-id='${row.id}'>${row.qc_carried_out_by || ''}</td>
                    <td class='data-launch-table-clickable-qc-checker-record' data-id='${row.id}'>${statusBadge}</td>
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
       
        // ── Booking Diary — redesigned header & toolbar ──
        html += `<div class="bd-toolbar-wrapper">
                    <div class="bd-toolbar">
                      <div class="bd-toolbar-left">`
                if (this.viewType === 'bayGrid') {
                    html += `<input type="date" id="monthPicker" class="bd-date-picker">`
                }
                html += `<select class="bd-view-select data-launch-bookings-subgrid-grid-type-select-element" id="data-launch-bookings-subgrid-grid-type-select-element_${this.id}">`
                if (this.viewType === 'bayGrid') {
                    html += `<option value="list">List View</option><option value="bayGrid" selected>Bay Grid</option>`
                } else {
                    html += `<option value="list" selected>List View</option><option value="bayGrid">Bay Grid</option>`
                }
                html += `</select>`
                if (this.viewType === 'bayGrid') {
                    html += `<div class="bd-nav-group">
                              <button class="bd-nav-btn prevWeekBtn" id="prevWeekBtn"><i class="bi bi-chevron-left"></i> Prev</button>
                              <button class="bd-today-btn todayBtn" id="todayBtn">Today</button>
                              <button class="bd-nav-btn nextWeekBtn" id="nextWeekBtn">Next <i class="bi bi-chevron-right"></i></button>
                             </div>`
                } else {
                    html += `<button class="bd-nav-btn data-launch-bookings-list-print"><i class="bi bi-printer"></i> Print</button>`
                }
                html += `</div><div class="bd-toolbar-right">`
                if (USER_RECORD.bookings_create === 1) {
                    html += `<button class="bd-add-btn data-launch-create-new-booking-record" data-launch-garage-id='${this.id}'>
                               <i class="bi bi-plus-circle"></i> New Booking</button>`
                }
                html += `</div></div>
                    <div class="bd-legend">
                      <div class="bd-legend-item"><span class="bd-legend-dot" style="background:#759AF7;"></span>Booked</div>
                      <div class="bd-legend-item"><span class="bd-legend-dot" style="background:#E4ADFB;"></span>On Site</div>
                      <div class="bd-legend-item"><span class="bd-legend-dot" style="background:#F5E77F;"></span>In Progress</div>
                      <div class="bd-legend-item"><span class="bd-legend-dot" style="background:#C4EAA2;"></span>Complete</div>
                      <div class="bd-legend-hint"><i class="bi bi-arrows-move"></i> Drag to reschedule</div>
                    </div>
                  </div>
                <div id="navContainer" style="display:none;">`
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
      timeColumn.innerHTML = "";
      // Time column header cell (aligns with day headers)
      const timeHeaderCell = document.createElement("div");
      timeHeaderCell.className = "bd-time-header-cell";
      timeHeaderCell.innerHTML = '<i class="bi bi-clock"></i>';
      timeColumn.appendChild(timeHeaderCell);
      for (let t = this.operatingStart; t <= this.operatingFinish; t += 60) {
          const marker = document.createElement("div");
          marker.className = "time-marker";
          marker.style.top = (this.timeHeaderHeight + this.BAY_HEADER_HEIGHT + (t - this.operatingStart)) + "px";
          marker.innerText = this.formatTime(t);
          timeColumn.appendChild(marker);
      }
      const totalHeight = this.timeHeaderHeight + this.BAY_HEADER_HEIGHT + this.operatingDuration;
      document.getElementById("timeColumn").style.height = totalHeight + "px";
      
      const daysColumns = document.getElementById("daysColumns");
      daysColumns.innerHTML = ""; // Clear previous entries
      
      this.daysData.forEach(dayObj => {
          const dayCol = document.createElement("div");
          dayCol.className = "day-column";
      
          const dateStr = this.formatDate(dayObj.date);
          dayCol.dataset.date = dateStr;
          const isToday = dateStr === this.formatDate(new Date());
          if (isToday) dayCol.classList.add('today-column');
          const dayHeader = document.createElement("div");
          dayHeader.className = "day-header" + (isToday ? " today-header" : "");
          dayHeader.innerText = `${dayObj.day} ${dateStr}`;
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
              bay.setAttribute("data-bay-id", bayData.id);
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

       

              // Timeslot grid — clickable areas for creating new bookings
              for (let time = this.operatingStart; time < this.operatingFinish; time += bayData.increment) {
                  const timeslot = document.createElement("div");
                  timeslot.className = "timeslot";
                  timeslot.style.top = (this.BAY_HEADER_HEIGHT + (time - this.operatingStart)) + "px";
                  timeslot.style.height = bayData.increment + "px";
                  timeslot.dataset.time = this.formatTime(time);
                  timeslot.dataset.bay = bayData.name;
                  timeslot.dataset.date = dateStr;
                  timeslot.dataset.increment = bayData.increment;

                  // Consolidated hover handlers
                  timeslot.addEventListener("mouseenter", (e) => {
                    timeslot.style.transform = "scaleY(1.05)";
                    timeslot.style.backgroundColor = "rgba(0, 128, 255, 0.15)";
                    timeslot.style.border = "1px solid rgba(0,120,212,0.4)";
                    timeslot.style.cursor = "pointer";
                    // Show time tooltip
                    let tooltip = document.getElementById('hover-time-tooltip');
                    if (!tooltip) {
                        tooltip = document.createElement('div');
                        tooltip.id = 'hover-time-tooltip';
                        Object.assign(tooltip.style, {
                          position: 'absolute', background: '#1a1a2e', color: 'white',
                          padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                          fontWeight: '600', pointerEvents: 'none', zIndex: '999999',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        });
                        document.body.appendChild(tooltip);
                    }
                    tooltip.innerText = timeslot.dataset.time;
                    tooltip.style.top = (e.pageY + 10) + 'px';
                    tooltip.style.left = (e.pageX + 10) + 'px';
                    tooltip.style.display = 'block';
                  });
                  timeslot.addEventListener("mousemove", (e) => {
                    const tooltip = document.getElementById('hover-time-tooltip');
                    if (tooltip) {
                      tooltip.style.top = (e.pageY + 10) + 'px';
                      tooltip.style.left = (e.pageX + 10) + 'px';
                    }
                  });
                  timeslot.addEventListener("mouseleave", () => {
                    timeslot.style.transform = "";
                    timeslot.style.backgroundColor = "";
                    timeslot.style.border = "";
                    const tooltip = document.getElementById('hover-time-tooltip');
                    if (tooltip) tooltip.style.display = 'none';
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
                      if (!row || !row.booking_date || !row.time_start || !row.time_end) {
                        console.error('[BOOKING RENDER] skipping malformed row:', row);
                        return;
                      }
                      const rawBookingDate = String(row.booking_date);
                      let formattedDate = rawBookingDate.includes('T') ? rawBookingDate.split('T')[0] : rawBookingDate;
                      if (!/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
                        console.error('[BOOKING RENDER] invalid booking_date format:', row.booking_date, '| id:', row.id);
                        return;
                      }
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
                      let bayName = this.baysData.find(rowBay => parseInt(rowBay.id) === parseInt(bay))?.bay_name?.trim();
                      if (!bayName) {
                        console.error('[BOOKING RENDER] BAY NAME NOT FOUND for booking', id, reg, '| row.bay =', bay, typeof bay, '| baysData IDs =', this.baysData.map(b => b.id + '(' + typeof b.id + ')'));
                      }
                      this.createEvent(formattedDate, bayName, bay, startMinutes, duration, reg, id, startTime, endTime, notes, workCompleted,vehicleInProgress,vehicleArrived,bookingMade, firstName, lastName);
      })
      // 🔥 Force recalculation of booking widths **AFTER** render
      // Wait until all bookings are added before running layoutBay

      // Use requestAnimationFrame for faster, more reliable layout
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const uniqueBays = [...new Set(this.resizingBaysArray)];
          uniqueBays.forEach(bay => this.layoutBay(bay));
          this.resizingBaysArray = [];
        });
      });


    

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
      const qcTypeLabels = { routine: 'Routine', targeted: 'Targeted', remedial: 'Remedial', closely_observed: 'Closely Observed', reinspection: 'Re-inspection' };
      html += `<table class="table table-hover data-launch-table-clickable-row notes-table" style='width: 100%; table-layout: fixed;'>
      <thead>
          <tr>
              <th style="width: 12%;">Tester Name</th>
              <th style="width: 10%;">Vehicle Reg</th>
              <th style="width: 12%;">Date of QC</th>
              <th style="width: 10%;">Score</th>
              <th style="width: 10%;">QC Type</th>
              <th style="width: 8%;">Status</th>
              <th style="width: 10%;">QC Carried out by</th>
              <th style="width: 3% !important;"></th>
          </tr>
        </thead>
        <tbody id="qcCheckersForBike_tbody_${this.id}">
      `;
      this.data.sort((a, b) => new Date(b.date_of_qc) - new Date(a.date_of_qc));
      this.data.forEach(row => {
        const score = row.score_percentage != null ? parseFloat(row.score_percentage) : null;
        let scoreBadge = '<span style="color:#94a3b8;font-size:12px">—</span>';
        if (score !== null) {
          const scoreColor = score >= 80 ? '#27ae60' : score >= 50 ? '#f39c12' : '#e74c3c';
          scoreBadge = `<span style="display:inline-block;padding:3px 10px;border-radius:12px;font-weight:700;font-size:12px;color:#fff;background:${scoreColor}">${score}%</span>`;
        }
        const qcTypeLabel = qcTypeLabels[row.qc_type] || row.qc_type || '—';
        const statusBadge = row.status === 'complete'
          ? '<span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;background:#e8f5e9;color:#2e7d32">Complete</span>'
          : '<span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;background:#fff3e0;color:#e65100">Draft</span>';

        html += `<tr class='data-launch-table-clickable-qc-checker-bike-record' data-id='${row.id}' id='qcCheckersForBike_${this.id}_${row.id}'>
                  <td class='data-launch-table-clickable-qc-checker-bike-record' data-id='${row.id}'>${row.tester_name}</td>
                  <td class='data-launch-table-clickable-qc-checker-bike-record' data-id='${row.id}'>${row.vehicle_reg}</td>
                  <td class='data-launch-table-clickable-qc-checker-bike-record' data-id='${row.id}'>${this.getFormattedDate(row.date_of_qc)}</td>
                  <td class='data-launch-table-clickable-qc-checker-bike-record' data-id='${row.id}'>${scoreBadge}</td>
                  <td class='data-launch-table-clickable-qc-checker-bike-record' data-id='${row.id}'>${qcTypeLabel}</td>
                  <td class='data-launch-table-clickable-qc-checker-bike-record' data-id='${row.id}'>${statusBadge}</td>
                  <td class='data-launch-table-clickable-qc-checker-bike-record' data-id='${row.id}'>${row.qc_carried_out_by || ''}</td>
                  <td><i class="bi bi-trash data-launch-subgrid-delete-qc-checker-bike-item" data-id='${row.id}'></i></td>             
              </tr>`;
      });
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
    

    // Determine the target bay ID directly from the data-bay-id attribute
    let newBayID = parseInt(targetBay.getAttribute('data-bay-id'));
    if (isNaN(newBayID)) {
      // Fallback to text matching if data attribute missing
      const targetBayName = targetBay.querySelector('.bay-header')?.innerText?.trim();
      this.baysData.forEach(b => {
        if (b.bay_name?.trim() === targetBayName) {
          newBayID = b.id;
        }
      });
      console.error('[DRAG] data-bay-id missing, fell back to text match. newBayID:', newBayID);
    }
    if (isNaN(newBayID)) {
      this.showCRUDAlert('Could not determine target bay. Please try again.', 'error');
      garageClassInstantiated.injectDataIntoGarageBookingsSubgrid();
      this.dragEventElem = null;
      this.sourceBay = null;
      return;
    }
    
    // Get date from the parent day-column
    const dayColumn = targetBay.closest('.day-column') || targetBay.parentElement?.closest('.day-column');
    const dropDate = dayColumn?.dataset?.date;
    
    const endTime = this.addMinutesToTime(timeStr, Number(this.recordBeingDraggedDuration));
    const updateObj = {
      time_start: timeStr,
      time_end: endTime,
      bay: newBayID
    };
    // If dropped on a different day, also update booking_date
    if (dropDate) {
      updateObj.booking_date = dropDate;
    }

    const recordId = parseInt(this.recordBeingDraggedId);
    this.secureAction('update', 'data_launch_garage_bookings', recordId, updateObj).then(res => {
        this.showCRUDAlert('Booking moved to ' + timeStr + ' successfully', 'success');
        const savedWeekOffset = this.currentWeekOffset || 0;
        garageClassInstantiated.injectDataIntoGarageBookingsSubgrid().then(() => {
          if (savedWeekOffset !== 0 && garageClassInstantiated.garageBookingsSubgridClass) {
            garageClassInstantiated.garageBookingsSubgridClass.render(null, null, savedWeekOffset, 'garageBookings');
          }
        });
    }, err => {
        console.error(err);
        this.showCRUDAlert('Failed to move booking — please try again', 'error');
        // Re-render to reset visual state
        garageClassInstantiated.injectDataIntoGarageBookingsSubgrid();
    });

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
 
  
  createEvent(eventDate, bayName, bayId, startMinute, duration, text, id, startTime, endTime, notes, workCompleted, vehicleInProgress, vehicleArrived, bookingMade, firstName, lastName) {
    const eventDateObj = new Date(eventDate);
    const eventDateStr = eventDateObj.toISOString().split("T")[0];


    const currentWeekMonday = this.normalize(this.daysData[0].date);
    const currentWeekSunday = new Date(currentWeekMonday);
    currentWeekSunday.setDate(currentWeekSunday.getDate() + 6);
    const eventDateNorm = this.normalize(eventDateObj);
    
    if (eventDateNorm < currentWeekMonday || eventDateNorm > currentWeekSunday) {
      return;
    }

    let dayObj = this.daysData.find(d => d.date.toISOString().split("T")[0] === eventDateStr);
    if (!dayObj) {
        console.error("[createEvent FAIL] date not in daysData:", eventDateStr, "| id:", id, text);
        return;
    }

    // Find the correct day column inside THIS subgrid instance only
    const allDayCols = Array.from(this.container.getElementsByClassName("day-column"));
    const dayCol = allDayCols.find(dc => dc.dataset.date === eventDateStr);
    if (!dayCol) {
        console.error("[createEvent FAIL] dayCol not found for day:", dayObj.day, "| id:", id, text, "| all day-columns:", allDayCols.map(dc => dc.querySelector(".day-header")?.innerText));
        return;
    }

    const allBays = Array.from(dayCol.getElementsByClassName("bay"));
    const bayHeaders = allBays.map(b => b.querySelector(".bay-header")?.innerText?.trim());
    const bay = allBays.find(b => parseInt(b.getAttribute('data-bay-id')) === parseInt(bayId))
      || allBays.find(b => b.querySelector(".bay-header").innerText.trim() === (bayName || '').trim());
    if (!bay) {
        console.error("[createEvent FAIL] bay not found! bayId:", bayId, "| bayName:", JSON.stringify(bayName), "| available:", bayHeaders, "| available IDs:", allBays.map(b => b.getAttribute('data-bay-id')), "| id:", id, text);
        return;
    }

    // Status label + icon
    let statusLabel = 'Booked';
    let statusIcon = '📅';
    if (workCompleted === 1)          { statusLabel = 'Complete';    statusIcon = '✅'; }
    else if (vehicleInProgress === 1) { statusLabel = 'In Progress'; statusIcon = '🔧'; }
    else if (vehicleArrived === 1)    { statusLabel = 'On Site';     statusIcon = '🚗'; }

    const customerName = ((firstName || '') + ' ' + (lastName || '')).trim();
    const timeLabel = this.formatTime(startMinute) + '–' + this.formatTime(startMinute + duration);
    const minHeight = Math.max(duration, 28);

    // Create the event element with rich content
    const eventElem = document.createElement("div");
    eventElem.className = "event data-launch-table-clickable-garage-booking-record";
    eventElem.setAttribute("data-id", id);
    eventElem.style.top = (startMinute - this.operatingStart + this.BAY_HEADER_HEIGHT) + "px";
    eventElem.style.height = minHeight + "px";
    eventElem.dataset.duration = duration;
    eventElem.dataset.start = startMinute;
    eventElem.dataset.recordId = id;
    eventElem.dataset.id = id;
    eventElem.style.backgroundColor = this.getRandomHex(workCompleted, vehicleInProgress, vehicleArrived, bookingMade);
    eventElem.style.color = '#1a1a2e';
    eventElem.style.overflow = 'hidden';
    eventElem.style.cursor = 'pointer';
    eventElem.style.borderLeft = '3px solid rgba(0,0,0,0.2)';
    eventElem.style.padding = '2px 4px';
    eventElem.style.lineHeight = '1.2';
    eventElem.style.boxSizing = 'border-box';

    // Rich inner HTML — show time, reg, customer name depending on available height
    if (minHeight >= 50) {
      eventElem.innerHTML = `<div style="font-size:10px;font-weight:600;opacity:0.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${timeLabel}</div><div style="font-size:12px;font-weight:800;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${text || ''}</div><div style="font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${customerName || ''}</div>`;
    } else if (minHeight >= 35) {
      eventElem.innerHTML = `<div style="font-size:11px;font-weight:800;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${text || ''}</div><div style="font-size:9px;opacity:0.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${timeLabel}</div>`;
    } else {
      eventElem.innerHTML = `<div style="font-size:10px;font-weight:800;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${text || ''}</div>`;
    }

    // Enable drag-and-drop
    eventElem.setAttribute("draggable", "true");
    eventElem.addEventListener("dragstart", (e) => this.onDragStart(e));

    // Rich tooltip with full booking details
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.innerHTML = `<div style="font-weight:700;font-size:14px;margin-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:6px;">${statusIcon} ${text || 'No Reg'} <span style="font-weight:400;font-size:11px;opacity:0.7;">— ${statusLabel}</span></div><div style="display:grid;grid-template-columns:auto 1fr;gap:2px 8px;font-size:12px;"><span style="opacity:0.6;">Time</span><span>${this.formatTime(startMinute)} – ${this.formatTime(startMinute + duration)}</span><span style="opacity:0.6;">Duration</span><span>${duration} mins</span><span style="opacity:0.6;">Bay</span><span>${bayName || '—'}</span><span style="opacity:0.6;">Date</span><span>${eventDate}</span>${customerName ? `<span style="opacity:0.6;">Customer</span><span>${customerName}</span>` : ''}${notes ? `<span style="opacity:0.6;">Notes</span><span style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${notes}</span>` : ''}</div><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;"><button class="btn btn-primary data-launch-garage-bookings-grid-view-tooltip-open-booking-btn data-launch-table-clickable-garage-booking-record" data-id="${id}" style="font-size:11px;padding:4px 10px;border-radius:4px;">Open</button><a class="data-launch-garage-bookings-grid-view-tooltip-open-booking-btn data-launch-table-clickable-garage-booking-record-duplicate" data-id="${id}" style="font-size:11px;padding:4px 10px;border-radius:4px;background:rgba(255,255,255,0.15);color:#fff;cursor:pointer;text-decoration:none;">Duplicate</a><i class="bi bi-trash data-launch-subgrid-delete-garage-booking-item-bay-grid-view bay-grid-view-delete-button" data-id="${id}" style="font-size:14px;padding:4px;cursor:pointer;opacity:0.7;"></i></div>`;
    tooltip.style.position = "absolute";
    tooltip.style.left = "0";
    tooltip.style.bottom = "100%";
    tooltip.style.marginBottom = "4px";
    tooltip.style.zIndex = "999999";
    tooltip.style.minWidth = "240px";

    eventElem.appendChild(tooltip);
    bay.appendChild(eventElem);
    this.resizingBaysArray.push(bay);

    // Tooltip hover behavior
    eventElem.addEventListener("mouseenter", () => {
      tooltip.style.display = "block";
    });
    eventElem.addEventListener("mouseleave", (e) => {
      if (!tooltip.contains(e.relatedTarget)) {
        tooltip.style.display = "none";
      }
    });
    tooltip.addEventListener("mouseleave", (e) => {
      if (!eventElem.contains(e.relatedTarget)) {
        tooltip.style.display = "none";
      }
    });
  }

}