/* ============================================================
   QC CHECK WIZARD  — Full-page step-by-step QC check form
   ============================================================ */

class QCCheckWizard {

  /* ── Section definitions for CAR (Group B) ───────────────── */
  static CAR_SECTIONS = [
    {
      id: 'setup', title: 'QC Check Details', subtitle: 'Enter the basic details for this Quality Control check.',
      items: [] // handled separately as a details form
    },
    {
      id: 'preChecks', title: 'Pre Checks', subtitle: 'Checks performed before the test begins.',
      items: [
        { key: 'all_required_doors_open',                label: 'All required doors open' },
        { key: 'bonnet_opens_as_required',                label: 'Bonnet opens as required' },
        { key: 'boot_opens_as_required',                  label: 'Boot opens as required' },
        { key: 'fuel_cap_opens',                          label: 'Fuel cap opens' },
        { key: 'chassis_number_taken',                    label: 'Chassis number taken' },
        { key: 'condition_of_registration_plate',         label: 'Condition of registration plate checked' },
        { key: 'vehicle_safe_for_test',                   label: 'Vehicle safe for test' },
        { key: 'presented_vehicle_correctly_registered',  label: 'Vehicle correctly registered' }
      ]
    },
    {
      id: 'gasAnalysis', title: 'Gas Analysis', subtitle: 'Emission testing checks. N/A for electric vehicles.',
      items: [
        { key: 'vehicle_correctly_entered_emission_machine', label: 'Vehicle correctly entered on emission machine' },
        { key: 'correct_emission_standards_applied',         label: 'Correct emission standards applied' },
        { key: 'nt_select_correct_emission_limits',          label: 'NT selects correct emission limits' },
        { key: 'oil_level_checked',                          label: 'Oil level checked' }
      ]
    },
    {
      id: 'insideVehicle', title: 'Inside Vehicle', subtitle: 'Interior and control checks.',
      items: [
        { key: 'passenger_door_opens',               label: 'Passenger door opens' },
        { key: 'all_passenger_seats_checked',         label: 'All passenger seats checked' },
        { key: 'all_mandatory_mirrors_checked',       label: 'All mandatory mirrors checked' },
        { key: 'handbrake_operation_checked',         label: 'Handbrake operation checked' },
        { key: 'steering_uj_checked',                 label: 'Steering UJ checked' },
        { key: 'steering_free_play_checked',          label: 'Steering free play checked' },
        { key: 'steering_anti_theft_lock_checked',    label: 'Steering anti-theft lock checked' },
        { key: 'audible_warning_checked',             label: 'Audible warning checked' },
        { key: 'all_washers_wipers_checked',          label: 'Washers and wipers checked' },
        { key: 'seatbelts_checked',                   label: 'Seatbelts checked' }
      ]
    },
    {
      id: 'vehicleLights', title: 'Vehicle Lights', subtitle: 'Lighting and beam checks.',
      items: [
        { key: 'nt_correctly_uses_beam_setter',  label: 'NT correctly uses beam setter' },
        { key: 'headlamp_aim_checked',           label: 'Headlamp aim checked' },
        { key: 'headlamp_units_secure',          label: 'Headlamp units secure' },
        { key: 'rear_light_units_secure',        label: 'Rear light units secure' },
        { key: 'lights_interfere_with_another',  label: 'Lights do not interfere with another' },
        { key: 'nt_uses_methodical_process',     label: 'NT uses a methodical process' }
      ]
    },
    {
      id: 'bonnetOpen', title: 'Bonnet Open', subtitle: 'Under-bonnet inspections.',
      items: [
        { key: 'steering_security_checked',              label: 'Steering security checked' },
        { key: 'battery_secure',                         label: 'Battery secure' },
        { key: 'brake_system_inspected_under_pressure',  label: 'Brake system inspected under pressure' },
        { key: 'all_fluid_levels_inspected',             label: 'All fluid levels inspected' },
        { key: 'fuel_system_inspected',                  label: 'Fuel system inspected' },
        { key: 'general_condition_inspected',            label: 'General condition inspected' }
      ]
    },
    {
      id: 'raisedFull', title: 'Vehicle Raised — Full Height', subtitle: 'Underside checks at full height.',
      items: [
        { key: 'steering_inspected_using_equipment',   label: 'Steering inspected using equipment' },
        { key: 'brake_system_inspected',               label: 'Brake system inspected' },
        { key: 'exhaust_checked',                      label: 'Exhaust checked' },
        { key: 'driveshaft_inspected',                 label: 'Driveshaft inspected' },
        { key: 'fuel_system_inspected_while_running',  label: 'Fuel system inspected while running' },
        { key: 'suspension_components_inspected',      label: 'Suspension components inspected' },
        { key: 'underside_inspected_for_corrosion',    label: 'Underside inspected for corrosion' },
        { key: 'vehicle_raised_correctly',             label: 'Vehicle raised correctly' }
      ]
    },
    {
      id: 'raisedHalf', title: 'Vehicle Raised — Half Height', subtitle: 'Wheel and brake component checks.',
      items: [
        { key: 'tyres_inspected',               label: 'Tyres inspected' },
        { key: 'suspension_components_checked',  label: 'Suspension components checked' },
        { key: 'brake_hoses_inspected',          label: 'Brake hoses inspected' },
        { key: 'all_gaiters_inspected',          label: 'All gaiters inspected' },
        { key: 'wheel_security_assessed',        label: 'Wheel security assessed' },
        { key: 'brake_components_assessed',      label: 'Brake components assessed' },
        { key: 'nt_used_atl',                    label: 'NT used ATL' }
      ]
    },
    {
      id: 'turnPlates', title: 'Use of Turn Plates', subtitle: 'Turn plate inspection checks.',
      items: [
        { key: 'condition_of_turn_plates',          label: 'Condition of turn plates' },
        { key: 'nt_can_use_turn_plates',             label: 'NT can use turn plates' },
        { key: 'turn_plates_used_for_lock_check',   label: 'Turn plates used for lock check' }
      ]
    },
    {
      id: 'brakePerformance', title: 'Brake Performance Test', subtitle: 'Brake roller and performance checks.',
      items: [
        { key: 'front_axle_brake_performance',  label: 'Front axle brake performance' },
        { key: 'rear_axle_brake_performance',   label: 'Rear axle brake performance' },
        { key: 'emergency_brake_performance',   label: 'Emergency brake performance' },
        { key: 'brake_bind_release_check',      label: 'Brake bind & release check' },
        { key: 'brake_judder_assessed',         label: 'Brake judder assessed' }
      ]
    },
    {
      id: 'notesConfirmation', title: 'Notes & Confirmation', subtitle: 'Final notes, TQI confirmation and tester sign-off.',
      items: [] // handled separately
    },
    {
      id: 'summary', title: 'QC Check Complete', subtitle: 'Review the results of this QC check.',
      items: [] // summary page
    }
  ];

  /* ── Section definitions for BIKE (Group A) ──────────────── */
  static BIKE_SECTIONS = [
    {
      id: 'setup', title: 'QC Check Details', subtitle: 'Enter the basic details for this Quality Control check.',
      items: []
    },
    {
      id: 'preChecks', title: 'Pre Checks', subtitle: 'Checks performed before the test begins.',
      items: [
        { key: 'overall_condition_of_vehicle',    label: 'Overall condition of presented vehicle' },
        { key: 'does_fuel_cap_open',              label: 'Does the fuel cap open' },
        { key: 'chassis_number_taken',            label: 'Chassis number taken directly from presented vehicle' },
        { key: 'registration_number_taken',       label: 'Registration number taken directly from presented vehicle' },
        { key: 'vehicle_correctly_registered',    label: 'Presented vehicle correctly registered for test' }
      ]
    },
    {
      id: 'satOnVehicle', title: 'Sat on Vehicle', subtitle: 'Checks performed while sat on the motorcycle.',
      items: [
        { key: 'handlebars_checked',                label: 'Handlebars checked' },
        { key: 'brake_levers_pedals_checked',       label: 'Applicable brake levers and/or pedals checked' },
        { key: 'brake_pedal_servo_operation_checked',label: 'Brake pedal servo operation checked' },
        { key: 'accelerator_checked',               label: 'Accelerator checked' },
        { key: 'clutch_lever_checked',              label: 'Clutch lever checked' },
        { key: 'steering_head_bearings_checked',    label: 'Steering head bearings and locking devices checked' },
        { key: 'horn_operation_checked',            label: 'Operation of horn checked' },
        { key: 'front_suspension_bounce_checked',   label: 'Bounce check carried out on front suspension' },
        { key: 'rear_suspension_bounce_checked',    label: 'Bounce check carried out on rear suspension' }
      ]
    },
    {
      id: 'frontOfVehicle', title: 'Front of Vehicle', subtitle: 'Checks on the front of the motorcycle.',
      items: [
        { key: 'front_position_lamps_condition',        label: 'Condition of front position lamps checked' },
        { key: 'lamp_housing_units_condition',          label: 'Condition of lamp housing units checked' },
        { key: 'front_direction_lamps_condition',       label: 'Condition of front direction lamps checked' },
        { key: 'front_suspension_components_condition', label: 'Condition of front suspension components checked' },
        { key: 'brake_master_cylinder_condition',       label: 'Condition of brake master cylinder & reservoir checked' },
        { key: 'fairings_body_panels_condition',        label: 'Condition of fairings and body panels checked' }
      ]
    },
    {
      id: 'frontRaised', title: 'Front of Vehicle — Raised', subtitle: 'Front checks with the vehicle raised.',
      items: [
        { key: 'steering_condition',              label: 'Condition of steering checked' },
        { key: 'suspension_components_condition', label: 'Condition of suspension components checked' },
        { key: 'wheels_condition',                label: 'Condition of wheels checked' },
        { key: 'wheel_bearing_condition',         label: 'Condition of wheel bearing checked' },
        { key: 'front_tyre_condition',            label: 'Condition of front tyre checked' },
        { key: 'front_brake_condition',           label: 'Condition of front brake checked' }
      ]
    },
    {
      id: 'offsideVehicle', title: 'Offside of Vehicle', subtitle: 'Offside inspection checks.',
      items: [
        { key: 'frame_condition',                              label: 'Condition of frame (including welds) checked' },
        { key: 'seating_condition',                            label: 'Condition of seating checked' },
        { key: 'foot_rest_condition',                          label: 'Condition of foot rest checked' },
        { key: 'rear_suspension_components_condition_offside', label: 'Condition of rear suspension components checked' },
        { key: 'final_drive_components_condition',             label: 'Condition of final drive components checked' },
        { key: 'exhaust_system_condition',                     label: 'Condition of exhaust system checked' },
        { key: 'fuel_system_condition',                        label: 'Condition of fuel system checked' },
        { key: 'rear_tyre_condition_offside',                  label: 'Condition of rear tyre checked' },
        { key: 'rear_brake_condition',                         label: 'Condition of rear brake checked' }
      ]
    },
    {
      id: 'rearOfVehicle', title: 'Rear of Vehicle', subtitle: 'Rear lighting and alignment checks.',
      items: [
        { key: 'rear_lights_condition',              label: 'Condition of rear lights checked' },
        { key: 'stop_lamps_condition',               label: 'Condition of stop lamps checked' },
        { key: 'rear_direction_lamps_condition',     label: 'Condition of rear direction lamps checked' },
        { key: 'rear_reflector_condition',           label: 'Condition of rear reflector checked' },
        { key: 'registration_plate_lamps_condition', label: 'Condition of registration plate and lamps checked' },
        { key: 'wheel_alignment_checked',            label: 'Wheel alignment checked' }
      ]
    },
    {
      id: 'nearsideVehicle', title: 'Nearside of Vehicle', subtitle: 'Nearside inspection checks.',
      items: [
        { key: 'nearside_frame_condition',                         label: 'Condition of frame (including welds) checked' },
        { key: 'nearside_seating_condition',                       label: 'Condition of seating checked' },
        { key: 'nearside_foot_rest_condition',                     label: 'Condition of foot rest checked' },
        { key: 'nearside_rear_suspension_components_condition',    label: 'Condition of rear suspension components checked' },
        { key: 'nearside_final_drive_components_condition',        label: 'Condition of final drive components checked' },
        { key: 'nearside_exhaust_system_condition',                label: 'Condition of exhaust system checked' },
        { key: 'nearside_fuel_system_condition',                   label: 'Condition of fuel system checked' },
        { key: 'nearside_rear_tyre_condition',                     label: 'Condition of rear tyre checked' },
        { key: 'nearside_rear_brake_condition',                    label: 'Condition of rear brake checked' }
      ]
    },
    {
      id: 'rearRaised', title: 'Rear of Vehicle — Raised', subtitle: 'Rear checks with the vehicle raised.',
      items: [
        { key: 'rear_wheels_condition',                label: 'Condition of wheels checked' },
        { key: 'rear_wheel_bearing_condition',         label: 'Condition of wheel bearing checked' },
        { key: 'rear_suspension_components_condition', label: 'Condition of suspension components checked' },
        { key: 'rear_tyre_condition',                  label: 'Condition of rear tyre checked' }
      ]
    },
    {
      id: 'brakePerformance', title: 'Brake Performance', subtitle: 'Brake testing and recording checks.',
      items: [
        { key: 'brake_performance_checked',           label: 'Brake performance checked' },
        { key: 'brake_performance_results_recorded',  label: 'Brake performance results correctly recorded' }
      ]
    },
    {
      id: 'notesConfirmation', title: 'Notes & Confirmation', subtitle: 'Final notes and tester sign-off.',
      items: []
    },
    {
      id: 'summary', title: 'QC Check Complete', subtitle: 'Review the results of this QC check.',
      items: []
    }
  ];

  /* ── QC type options ─────────────────────────────────────── */
  static QC_TYPES = [
    { value: 'routine',         icon: 'bi-clipboard-check', label: 'Routine QC',         desc: 'Regular scheduled check' },
    { value: 'targeted',        icon: 'bi-bullseye',        label: 'Targeted QC',        desc: 'Based on specific concern' },
    { value: 'remedial',        icon: 'bi-tools',           label: 'Remedial QC',        desc: 'Follow-up from a failure' },
    { value: 'closely_observed',icon: 'bi-eye',             label: 'Closely Observed',   desc: 'DVSA observed test' },
    { value: 'reinspection',    icon: 'bi-arrow-repeat',    label: 'Re-inspection',      desc: 'Repeat of a previous check' }
  ];

  /* ────────────────────────────────────────────────────────── */
  constructor() {
    this.currentStep = 0;
    this.maxVisitedStep = 0;  // highest step the user has legitimately reached
    this.formData = {};
    this.notes = {};          // key -> note text for fail items
    this.garageId = null;
    this.garageInstance = null;
    this.recordId = null;     // null = new, number = editing
    this.groupType = 'car';   // 'car' (Group B) or 'bike' (Group A)
    this.sections = QCCheckWizard.CAR_SECTIONS;
    this.testers = [];
    this.isHybridElectric = false;
    this._menuOpen = false;
    this._buildOverlay();
  }

  /* ── Build the overlay container once ──────────────────── */
  _buildOverlay() {
    if (document.getElementById('qcw-overlay')) return;
    const el = document.createElement('div');
    el.id = 'qcw-overlay';
    el.className = 'qcw-overlay';
    el.innerHTML = `
      <!-- Header -->
      <div class="qcw-header">
        <div class="qcw-header-title">
          <i class="bi bi-shield-check"></i>
          <span id="qcw-header-text">QC Check — Car (Group B)</span>
        </div>
        <div class="qcw-header-right">
          <span class="qcw-draft-badge" id="qcw-draft-badge">DRAFT</span>
          <button class="qcw-close-btn" id="qcw-close-btn" title="Close"><i class="bi bi-x-lg"></i></button>
        </div>
      </div>
      <!-- Progress -->
      <div class="qcw-progress-container">
        <div class="qcw-progress-bar-wrap">
          <div class="qcw-progress-bar-fill" id="qcw-progress-fill"></div>
        </div>
        <div class="qcw-progress-text">
          <span id="qcw-progress-section">Section 1 of ${this.sections.length}</span>
          <span id="qcw-progress-pct">0%</span>
        </div>
        <div class="qcw-step-dots" id="qcw-step-dots"></div>
      </div>
      <!-- Body -->
      <div class="qcw-body" id="qcw-body"></div>
      <!-- Nav -->
      <div class="qcw-nav-bar">
        <button class="qcw-nav-btn qcw-nav-prev" id="qcw-prev-btn"><i class="bi bi-chevron-left"></i> Previous</button>
        <div class="qcw-nav-center">
          <button class="qcw-nav-section-menu-btn" id="qcw-menu-btn"><i class="bi bi-list-ul"></i> Sections</button>
        </div>
        <button class="qcw-nav-btn qcw-nav-next" id="qcw-next-btn">Next <i class="bi bi-chevron-right"></i></button>
      </div>
      <!-- Section menu -->
      <div class="qcw-section-menu" id="qcw-section-menu"></div>
    `;
    document.body.appendChild(el);

    // Events
    document.getElementById('qcw-close-btn').addEventListener('click', () => this.close());
    document.getElementById('qcw-prev-btn').addEventListener('click', () => this.prevStep());
    document.getElementById('qcw-next-btn').addEventListener('click', () => this.nextStep());
    document.getElementById('qcw-menu-btn').addEventListener('click', () => this._toggleMenu());
    // Close menu on outside click
    el.addEventListener('click', e => {
      if (this._menuOpen && !e.target.closest('.qcw-section-menu') && !e.target.closest('#qcw-menu-btn')) {
        this._closeMenu();
      }
    });
  }

  /* ── Open the wizard ────────────────────────────────────── */
  open(garageInstance, existingRecord = null, groupType = 'car') {
    this.garageInstance = garageInstance;
    this.garageId = garageInstance.id;
    this.testers = garageInstance.garageTestersData || [];
    this.currentStep = 0;
    this.maxVisitedStep = 0;
    this.formData = {};
    this.notes = {};
    this.recordId = null;
    this.isHybridElectric = false;
    this.groupType = groupType;

    // Set sections based on group type
    this.sections = groupType === 'bike' ? QCCheckWizard.BIKE_SECTIONS : QCCheckWizard.CAR_SECTIONS;

    // Update header
    const headerText = document.getElementById('qcw-header-text');
    if (groupType === 'bike') {
      headerText.innerHTML = '<i class="bi bi-bicycle"></i> QC Check — Motorcycle (Group A)';
    } else {
      headerText.innerHTML = '<i class="bi bi-shield-check"></i> QC Check — Car (Group B)';
    }

    // If editing an existing record, pre-fill data and unlock all steps
    if (existingRecord) {
      this.recordId = existingRecord.id;
      this._prefillFromRecord(existingRecord);
      this.maxVisitedStep = this.sections.length - 1; // unlock all for existing records
    } else {
      // Auto-fill some defaults
      if (typeof USER_RECORD !== 'undefined') {
        this.formData._consultant = (USER_RECORD.first_name || '') + ' ' + (USER_RECORD.last_name || '');
      }
      const today = new Date().toISOString().split('T')[0];
      this.formData._dateOfQC = today;
    }

    // Render
    this._renderAllSections();
    this._renderStepDots();
    this._showStep(0);
    this._updateProgress();

    document.getElementById('qcw-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /* ── Close the wizard ───────────────────────────────────── */
  close() {
    document.getElementById('qcw-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ── Navigation ─────────────────────────────────────────── */
  nextStep() {
    if (this.currentStep === 0) {
      // Validate setup form
      if (!this._validateSetup()) return;
    }
    // Validate fail notes on current section before proceeding
    if (!this._validateFailNotes()) return;

    if (this.currentStep < this.sections.length - 1) {
      this._saveCurrentStepData();
      this.currentStep++;
      // Track highest step reached
      if (this.currentStep > this.maxVisitedStep) {
        this.maxVisitedStep = this.currentStep;
      }
      // If going to summary, compute score first
      if (this.sections[this.currentStep].id === 'summary') {
        this._renderSummary();
      }
      this._showStep(this.currentStep);
      this._updateProgress();
    }
  }
  prevStep() {
    if (this.currentStep > 0) {
      this._saveCurrentStepData();
      this.currentStep--;
      this._showStep(this.currentStep);
      this._updateProgress();
    }
  }
  goToStep(idx) {
    if (idx >= 0 && idx < this.sections.length) {
      // Only allow navigation to steps already visited (or back)
      if (idx > this.maxVisitedStep) {
        return; // blocked — haven't reached this step yet
      }
      this._saveCurrentStepData();
      this.currentStep = idx;
      if (this.sections[idx].id === 'summary') this._renderSummary();
      this._showStep(idx);
      this._updateProgress();
      this._closeMenu();
    }
  }

  /* ── Render all sections HTML ───────────────────────────── */
  _renderAllSections() {
    const body = document.getElementById('qcw-body');
    let html = '';
    this.sections.forEach((sec, idx) => {
      html += `<div class="qcw-section" data-step="${idx}" id="qcw-section-${idx}">`;
      html += `<h2 class="qcw-section-title">${sec.title}</h2>`;
      html += `<p class="qcw-section-subtitle">${sec.subtitle}</p>`;

      if (sec.id === 'setup') {
        html += this._renderSetupForm();
      } else if (sec.id === 'notesConfirmation') {
        html += this._renderNotesSection();
      } else if (sec.id === 'summary') {
        html += `<div id="qcw-summary-content"></div>`;
      } else {
        html += this._renderCheckItems(sec.items);
      }
      html += `</div>`;
    });
    body.innerHTML = html;
    this._bindEvents();
  }

  /* ── Setup form (step 0) ────────────────────────────────── */
  _renderSetupForm() {
    // QC Type selection
    let html = `
      <h3 style="font-size:16px;font-weight:700;color:#344054;margin-bottom:12px;">Select QC Type</h3>
      <div class="qcw-type-grid">`;
    QCCheckWizard.QC_TYPES.forEach(t => {
      const selected = this.formData._qcType === t.value ? ' selected' : '';
      html += `
        <div class="qcw-type-card${selected}" data-qctype="${t.value}">
          <div class="qcw-type-icon"><i class="bi ${t.icon}"></i></div>
          <div class="qcw-type-label">${t.label}</div>
          <div class="qcw-type-desc">${t.desc}</div>
        </div>`;
    });
    html += `</div>`;

    // Details form
    const testerOpts = this.testers.map(t =>
      `<option data-tester-id="${t.user_id}" value="${t.name}">${t.name}</option>`
    ).join('');

    html += `
      <div style="margin-top:32px;">
        <h3 style="font-size:16px;font-weight:700;color:#344054;margin-bottom:12px;">Vehicle & Tester Details</h3>
        <div class="qcw-details-form">
          <div class="qcw-field-group">
            <label class="qcw-field-label">Tester Name <span style="color:#e74c3c">*</span></label>
            <select class="qcw-field-input" id="qcw-testerName">
              <option value="">Select a tester...</option>
              ${testerOpts}
            </select>
          </div>
          <div class="qcw-field-group">
            <label class="qcw-field-label">Tester ID</label>
            <input class="qcw-field-input" id="qcw-testerID" type="text" readonly disabled placeholder="Auto-filled">
          </div>
          <div class="qcw-field-group">
            <label class="qcw-field-label">Vehicle Reg <span style="color:#e74c3c">*</span></label>
            <input class="qcw-field-input" id="qcw-vehicleReg" type="text" placeholder="e.g. AB12 CDE" style="text-transform:uppercase">
          </div>
          <div class="qcw-field-group">
            <label class="qcw-field-label">Date of QC</label>
            <input class="qcw-field-input" id="qcw-dateOfQC" type="date" value="${this.formData._dateOfQC || ''}">
          </div>
          <div class="qcw-field-group">
            <label class="qcw-field-label">Vehicle Make</label>
            <input class="qcw-field-input" id="qcw-vehicleMake" type="text" placeholder="e.g. Ford">
          </div>
          <div class="qcw-field-group">
            <label class="qcw-field-label">Vehicle Model</label>
            <input class="qcw-field-input" id="qcw-vehicleModel" type="text" placeholder="e.g. Focus">
          </div>
          <div class="qcw-field-group">
            <label class="qcw-field-label">Vehicle Class</label>
            <input class="qcw-field-input" id="qcw-vehicleClass" type="text" placeholder="e.g. Class 4">
          </div>
          <div class="qcw-field-group">
            <label class="qcw-field-label">QC Carried Out By</label>
            <input class="qcw-field-input" id="qcw-qcCarriedOutBy" type="text" placeholder="Name of person performing QC">
          </div>
          <div class="qcw-field-group">
            <label class="qcw-field-label">Consultant</label>
            <input class="qcw-field-input" id="qcw-consultant" type="text" value="${this.formData._consultant || ''}" placeholder="Consultant name">
          </div>
          ${this.groupType === 'car' ? `
          <div class="qcw-field-group">
            <label class="qcw-field-label">Hybrid / Electric Vehicle?</label>
            <select class="qcw-field-input" id="qcw-isHybridElectric">
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>` : ''}
        </div>
      </div>`;
    return html;
  }

  /* ── Check items ────────────────────────────────────────── */
  _renderCheckItems(items) {
    let html = '<div class="qcw-check-list">';
    items.forEach(item => {
      const val = this.formData[item.key] || '';
      const passClass  = val === 'yes' ? ' active-pass' : '';
      const failClass  = val === 'no'  ? ' active-fail' : '';
      const naClass    = val === 'n/a' ? ' active-na'   : '';
      const itemClass  = val === 'yes' ? ' pass' : val === 'no' ? ' fail' : val === 'n/a' ? ' na' : '';

      html += `
        <div class="qcw-check-item${itemClass}" data-key="${item.key}">
          <div style="flex:1">
            <div class="qcw-check-label">${item.label}</div>
            <div class="qcw-fail-note">
              <div class="qcw-fail-note-label"><i class="bi bi-exclamation-triangle-fill"></i> Note required for failure</div>
              <textarea placeholder="Describe the issue found..." data-note-key="${item.key}">${this.notes[item.key] || ''}</textarea>
            </div>
          </div>
          <div class="qcw-toggle-group">
            <button class="qcw-toggle-btn${passClass}" data-val="yes" data-key="${item.key}">Pass</button>
            <button class="qcw-toggle-btn${failClass}" data-val="no" data-key="${item.key}">Fail</button>
            <button class="qcw-toggle-btn${naClass}" data-val="n/a" data-key="${item.key}">N/A</button>
          </div>
        </div>`;
    });
    html += '</div>';
    return html;
  }

  /* ── Notes & Confirmation section ───────────────────────── */
  _renderNotesSection() {
    return `
      <div class="qcw-check-list">
        <div class="qcw-field-group" style="margin-bottom:20px">
          <label class="qcw-field-label">Additional Notes</label>
          <textarea class="qcw-field-input" id="qcw-notes" rows="5" placeholder="Any additional observations or comments about this QC check...">${this.formData._notes || ''}</textarea>
        </div>
        <div class="qcw-check-item" data-key="tqi_checked">
          <div class="qcw-check-label">TQI data has been checked</div>
          <div class="qcw-toggle-group">
            <button class="qcw-toggle-btn${this.formData.tqi_checked === 'yes' ? ' active-pass' : ''}" data-val="yes" data-key="tqi_checked">Yes</button>
            <button class="qcw-toggle-btn${this.formData.tqi_checked === 'no' ? ' active-fail' : ''}" data-val="no" data-key="tqi_checked">No</button>
            <button class="qcw-toggle-btn${this.formData.tqi_checked === 'n/a' ? ' active-na' : ''}" data-val="n/a" data-key="tqi_checked">N/A</button>
          </div>
        </div>
        <div class="qcw-field-group" style="margin-top:20px">
          <label class="qcw-field-label">Confirmed by Tester (name)</label>
          <input class="qcw-field-input" id="qcw-confirmedByTester" type="text" value="${this.formData._confirmedByTester || ''}" placeholder="Tester name to confirm">
        </div>
      </div>`;
  }

  /* ── Bind events ────────────────────────────────────────── */
  _bindEvents() {
    const overlay = document.getElementById('qcw-overlay');

    // QC Type cards
    overlay.querySelectorAll('.qcw-type-card').forEach(card => {
      card.addEventListener('click', () => {
        overlay.querySelectorAll('.qcw-type-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.formData._qcType = card.dataset.qctype;
      });
    });

    // Tester selector -> auto-fill ID
    const testerSel = document.getElementById('qcw-testerName');
    if (testerSel) {
      testerSel.addEventListener('change', () => {
        const opt = testerSel.options[testerSel.selectedIndex];
        document.getElementById('qcw-testerID').value = opt?.dataset?.testerId || '';
      });
    }

    // Hybrid/Electric toggle -> auto N/A gas analysis
    const hybridSel = document.getElementById('qcw-isHybridElectric');
    if (hybridSel) {
      hybridSel.addEventListener('change', () => {
        this.isHybridElectric = hybridSel.value === '1';
        if (this.isHybridElectric) {
          // Auto-set gas analysis items to N/A
          const gasSection = this.sections.find(s => s.id === 'gasAnalysis');
          if (gasSection) {
            gasSection.items.forEach(item => {
              this.formData[item.key] = 'n/a';
            });
            // Re-render gas section if visible
            const gasIdx = this.sections.indexOf(gasSection);
            if (this.currentStep === gasIdx) {
              this._showStep(gasIdx);
            }
          }
        }
      });
    }

    // Toggle buttons (Pass/Fail/N/A)
    overlay.querySelectorAll('.qcw-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => this._handleToggle(btn));
    });

    // Notes textareas (for fail items)
    overlay.querySelectorAll('textarea[data-note-key]').forEach(ta => {
      ta.addEventListener('input', () => {
        this.notes[ta.dataset.noteKey] = ta.value;
        // Clear error styling once they start typing
        if (ta.value.trim()) {
          ta.style.borderColor = '';
          ta.style.boxShadow = '';
          ta.style.animation = '';
        }
      });
    });
  }

  /* ── Handle toggle click ────────────────────────────────── */
  _handleToggle(btn) {
    const key = btn.dataset.key;
    const val = btn.dataset.val;
    const checkItem = btn.closest('.qcw-check-item');
    const group = btn.closest('.qcw-toggle-group');

    // Remove active from siblings
    group.querySelectorAll('.qcw-toggle-btn').forEach(b => {
      b.classList.remove('active-pass', 'active-fail', 'active-na');
    });

    // Set active on clicked
    if (val === 'yes') btn.classList.add('active-pass');
    else if (val === 'no') btn.classList.add('active-fail');
    else btn.classList.add('active-na');

    // Update item class
    checkItem.classList.remove('pass', 'fail', 'na');
    if (val === 'yes') checkItem.classList.add('pass');
    else if (val === 'no') checkItem.classList.add('fail');
    else checkItem.classList.add('na');

    // Store value
    this.formData[key] = val;

    // Update dots
    this._updateStepDots();
  }

  /* ── Show a specific step ───────────────────────────────── */
  _showStep(idx) {
    const overlay = document.getElementById('qcw-overlay');
    overlay.querySelectorAll('.qcw-section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById(`qcw-section-${idx}`);
    if (section) section.classList.add('active');

    // Update nav buttons
    const prevBtn = document.getElementById('qcw-prev-btn');
    const nextBtn = document.getElementById('qcw-next-btn');
    prevBtn.disabled = idx === 0;
    prevBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';

    const isLast = idx === this.sections.length - 1;
    const isSecondToLast = idx === this.sections.length - 2;

    if (isLast) {
      // On summary page, hide next and prev
      nextBtn.style.display = 'none';
      prevBtn.style.display = 'none';
      document.getElementById('qcw-menu-btn').style.display = 'none';
    } else {
      nextBtn.style.display = '';
      prevBtn.style.display = '';
      document.getElementById('qcw-menu-btn').style.display = '';

      if (isSecondToLast) {
        nextBtn.className = 'qcw-nav-btn qcw-nav-finish';
        nextBtn.innerHTML = 'Finish & Review <i class="bi bi-check-circle"></i>';
      } else {
        nextBtn.className = 'qcw-nav-btn qcw-nav-next';
        nextBtn.innerHTML = 'Next <i class="bi bi-chevron-right"></i>';
      }
    }

    // Update active dot
    this._updateStepDots();

    // Scroll to top
    overlay.scrollTo({ top: 0, behavior: 'smooth' });

    // Pre-fill setup fields if returning to step 0
    if (idx === 0) this._prefillSetupFields();
  }

  /* ── Progress bar ───────────────────────────────────────── */
  _updateProgress() {
    const total = this.sections.length;
    const pct = Math.round(((this.currentStep + 1) / total) * 100);
    document.getElementById('qcw-progress-fill').style.width = pct + '%';
    document.getElementById('qcw-progress-pct').textContent = pct + '%';
    document.getElementById('qcw-progress-section').textContent =
      `Section ${this.currentStep + 1} of ${total}`;
  }

  /* ── Step dots ──────────────────────────────────────────── */
  _renderStepDots() {
    const container = document.getElementById('qcw-step-dots');
    let html = '';
    this.sections.forEach((sec, idx) => {
      html += `<div class="qcw-step-dot" data-dot="${idx}" title="${sec.title}">${idx + 1}</div>`;
    });
    container.innerHTML = html;
    container.querySelectorAll('.qcw-step-dot').forEach(dot => {
      dot.addEventListener('click', () => this.goToStep(parseInt(dot.dataset.dot)));
    });
  }

  _updateStepDots() {
    document.querySelectorAll('.qcw-step-dot').forEach((dot, idx) => {
      dot.classList.remove('active', 'completed', 'has-fail', 'locked');
      if (idx === this.currentStep) {
        dot.classList.add('active');
      } else if (idx <= this.maxVisitedStep) {
        // Visited step — show status
        const sec = this.sections[idx];
        if (sec.items && sec.items.length > 0) {
          const hasFail = sec.items.some(i => this.formData[i.key] === 'no');
          if (hasFail) dot.classList.add('has-fail');
          else dot.classList.add('completed');
        } else {
          dot.classList.add('completed');
        }
      } else {
        // Future step — locked
        dot.classList.add('locked');
      }
    });

    // Also update section menu
    this._renderSectionMenu();
  }

  /* ── Section menu ───────────────────────────────────────── */
  _toggleMenu() {
    const menu = document.getElementById('qcw-section-menu');
    this._menuOpen = !this._menuOpen;
    if (this._menuOpen) {
      this._renderSectionMenu();
      menu.classList.add('active');
    } else {
      menu.classList.remove('active');
    }
  }
  _closeMenu() {
    this._menuOpen = false;
    document.getElementById('qcw-section-menu').classList.remove('active');
  }

  _renderSectionMenu() {
    const menu = document.getElementById('qcw-section-menu');
    let html = '';
    this.sections.forEach((sec, idx) => {
      const isLocked = idx > this.maxVisitedStep;
      let dotColor = isLocked ? 'locked' : 'grey';
      if (!isLocked) {
        if (sec.items && sec.items.length > 0) {
          const hasFail = sec.items.some(i => this.formData[i.key] === 'no');
          const allAnswered = sec.items.every(i => this.formData[i.key]);
          if (hasFail) dotColor = 'red';
          else if (allAnswered) dotColor = 'green';
        } else if (idx < this.currentStep) {
          dotColor = 'green';
        }
      }
      const activeClass = idx === this.currentStep ? ' active-menu' : '';
      const lockedClass = isLocked ? ' menu-locked' : '';
      html += `
        <div class="qcw-section-menu-item${activeClass}${lockedClass}" data-menu-idx="${idx}">
          <span class="menu-dot ${dotColor}"></span>
          ${sec.title}
        </div>`;
    });
    menu.innerHTML = html;
    menu.querySelectorAll('.qcw-section-menu-item').forEach(item => {
      item.addEventListener('click', () => this.goToStep(parseInt(item.dataset.menuIdx)));
    });
  }

  /* ── Validate setup form ────────────────────────────────── */
  _validateSetup() {
    this._saveCurrentStepData();
    const tester = document.getElementById('qcw-testerName')?.value;
    const reg = document.getElementById('qcw-vehicleReg')?.value?.trim();
    if (!tester) {
      alert('Please select a tester.');
      return false;
    }
    if (!reg) {
      alert('Please enter a vehicle registration.');
      return false;
    }
    if (!this.formData._qcType) {
      alert('Please select a QC check type.');
      return false;
    }
    return true;
  }

  /* ── Validate fail notes are filled ─────────────────────── */
  _validateFailNotes() {
    const sec = this.sections[this.currentStep];
    if (!sec.items || sec.items.length === 0) return true;

    const missingNotes = [];
    sec.items.forEach(item => {
      if (this.formData[item.key] === 'no') {
        const note = (this.notes[item.key] || '').trim();
        if (!note) {
          missingNotes.push(item.label);
        }
      }
    });

    if (missingNotes.length > 0) {
      // Highlight the missing note fields
      const overlay = document.getElementById('qcw-overlay');
      missingNotes.forEach(label => {
        const items = overlay.querySelectorAll('.qcw-check-item.fail');
        items.forEach(el => {
          const ta = el.querySelector('textarea[data-note-key]');
          if (ta && !(ta.value || '').trim()) {
            ta.style.borderColor = '#e74c3c';
            ta.style.boxShadow = '0 0 0 3px rgba(231,76,60,0.2)';
            ta.setAttribute('placeholder', 'Required — please describe the issue found');
            // Shake animation
            ta.style.animation = 'none';
            ta.offsetHeight; // trigger reflow
            ta.style.animation = 'qcwShake 0.4s ease';
          }
        });
      });

      alert(`Please add a note for ${missingNotes.length} failed item${missingNotes.length > 1 ? 's' : ''} before continuing:\n\n• ${missingNotes.join('\n• ')}`);
      return false;
    }
    return true;
  }

  /* ── Save current step data into formData ───────────────── */
  _saveCurrentStepData() {
    const sec = this.sections[this.currentStep];

    if (sec.id === 'setup') {
      this.formData._testerName     = document.getElementById('qcw-testerName')?.value || '';
      this.formData._testerID       = document.getElementById('qcw-testerID')?.value || '';
      this.formData._vehicleReg     = (document.getElementById('qcw-vehicleReg')?.value || '').toUpperCase().trim();
      this.formData._dateOfQC       = document.getElementById('qcw-dateOfQC')?.value || '';
      this.formData._vehicleMake    = document.getElementById('qcw-vehicleMake')?.value || '';
      this.formData._vehicleModel   = document.getElementById('qcw-vehicleModel')?.value || '';
      this.formData._vehicleClass   = document.getElementById('qcw-vehicleClass')?.value || '';
      this.formData._qcCarriedOutBy = document.getElementById('qcw-qcCarriedOutBy')?.value || '';
      this.formData._consultant     = document.getElementById('qcw-consultant')?.value || '';
      const hybridEl = document.getElementById('qcw-isHybridElectric');
      if (hybridEl) this.isHybridElectric = hybridEl.value === '1';
    }
    else if (sec.id === 'notesConfirmation') {
      this.formData._notes            = document.getElementById('qcw-notes')?.value || '';
      this.formData._confirmedByTester = document.getElementById('qcw-confirmedByTester')?.value || '';
    }
    // Check items are saved in real-time via _handleToggle
  }

  /* ── Pre-fill setup fields (when navigating back to step 0) */
  _prefillSetupFields() {
    const el = id => document.getElementById(id);
    if (el('qcw-testerName'))     el('qcw-testerName').value     = this.formData._testerName || '';
    if (el('qcw-testerID'))       el('qcw-testerID').value       = this.formData._testerID || '';
    if (el('qcw-vehicleReg'))     el('qcw-vehicleReg').value     = this.formData._vehicleReg || '';
    if (el('qcw-dateOfQC'))       el('qcw-dateOfQC').value       = this.formData._dateOfQC || '';
    if (el('qcw-vehicleMake'))    el('qcw-vehicleMake').value    = this.formData._vehicleMake || '';
    if (el('qcw-vehicleModel'))   el('qcw-vehicleModel').value   = this.formData._vehicleModel || '';
    if (el('qcw-vehicleClass'))   el('qcw-vehicleClass').value   = this.formData._vehicleClass || '';
    if (el('qcw-qcCarriedOutBy')) el('qcw-qcCarriedOutBy').value = this.formData._qcCarriedOutBy || '';
    if (el('qcw-consultant'))     el('qcw-consultant').value     = this.formData._consultant || '';
    if (el('qcw-isHybridElectric')) el('qcw-isHybridElectric').value = this.isHybridElectric ? '1' : '0';

    // Re-select QC type card
    if (this.formData._qcType) {
      document.querySelectorAll('.qcw-type-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.qctype === this.formData._qcType);
      });
    }
  }

  /* ── Pre-fill from existing record ──────────────────────── */
  _prefillFromRecord(r) {
    this.formData._testerName     = r.tester_name || '';
    this.formData._testerID       = r.tester_id || '';
    this.formData._vehicleReg     = r.vehicle_reg || '';
    this.formData._dateOfQC       = r.date_of_qc || '';
    this.formData._vehicleMake    = r.vehicle_make || '';
    this.formData._vehicleModel   = r.vehicle_model || '';
    this.formData._vehicleClass   = r.vehicle_class || '';
    this.formData._qcCarriedOutBy = r.qc_carried_out_by || r.name_qc_checker || '';
    this.formData._consultant     = r.consultant || '';
    this.formData._qcType         = r.qc_type || '';
    this.formData._notes          = r.notes || '';
    this.formData._confirmedByTester = r.confirmed_by_tester || '';
    this.isHybridElectric = r.is_hybrid_electric === 1;

    // Populate all check item keys from the record
    // Normalize old tinyint 0/1 values to 'yes'/'no' strings
    this.sections.forEach(sec => {
      sec.items.forEach(item => {
        const val = r[item.key];
        if (val !== undefined && val !== null) {
          // Normalize: 1/'1' -> 'yes', 0/'0' -> 'no', else keep as-is
          if (val === 1 || val === '1') this.formData[item.key] = 'yes';
          else if (val === 0 || val === '0') this.formData[item.key] = 'no';
          else this.formData[item.key] = val;
        }
      });
    });
    // TQI
    if (r.tqi_checked) {
      const v = r.tqi_checked;
      if (v === 1 || v === '1') this.formData.tqi_checked = 'yes';
      else if (v === 0 || v === '0') this.formData.tqi_checked = 'no';
      else this.formData.tqi_checked = v;
    }
  }

  /* ── Compute score ──────────────────────────────────────── */
  _computeScore() {
    let total = 0, pass = 0, fail = 0, na = 0, unanswered = 0;
    this.sections.forEach(sec => {
      sec.items.forEach(item => {
        total++;
        const v = this.formData[item.key];
        if (v === 'yes') pass++;
        else if (v === 'no') fail++;
        else if (v === 'n/a') na++;
        else unanswered++;
      });
    });
    // Also count tqi_checked
    if (this.formData.tqi_checked) {
      total++;
      if (this.formData.tqi_checked === 'yes') pass++;
      else if (this.formData.tqi_checked === 'no') fail++;
      else na++;
    }
    const answered = pass + fail;
    const applicable = total - na;
    const pct = applicable > 0 ? Math.round((pass / applicable) * 100) : 100;
    return { total, pass, fail, na, unanswered, pct, applicable };
  }

  /* ── Render summary page ────────────────────────────────── */
  _renderSummary() {
    this._saveCurrentStepData();
    const s = this._computeScore();
    const ringClass = s.pct >= 80 ? 'green' : s.pct >= 50 ? 'amber' : 'red';
    const resultText = s.pct >= 80 ? 'Good Result' : s.pct >= 50 ? 'Needs Improvement' : 'Poor Result';

    let failItemsHtml = '';
    if (s.fail > 0) {
      failItemsHtml = `<div class="qcw-fail-items-list"><h4><i class="bi bi-exclamation-triangle-fill"></i> Items That Failed</h4>`;
      this.sections.forEach(sec => {
        sec.items.forEach(item => {
          if (this.formData[item.key] === 'no') {
            failItemsHtml += `
              <div class="qcw-fail-item-row">
                <strong>${item.label}</strong>
                <p>${this.notes[item.key] ? this.notes[item.key] : '<em style="color:#94a3b8">No note provided</em>'}</p>
              </div>`;
          }
        });
      });
      failItemsHtml += `</div>`;
    }

    const container = document.getElementById('qcw-summary-content');
    container.innerHTML = `
      <div class="qcw-summary">
        <div class="qcw-score-ring ${ringClass}">
          <div class="qcw-score-number">${s.pct}%</div>
          <div class="qcw-score-label">${resultText}</div>
        </div>
        <h3 class="qcw-summary-title">QC Check Complete</h3>
        <p class="qcw-summary-subtitle">
          ${this.formData._testerName || 'Tester'} — ${this.formData._vehicleReg || 'Vehicle'} — ${this.formData._dateOfQC || 'Today'}
        </p>
        <div class="qcw-summary-cards">
          <div class="qcw-summary-card">
            <div class="qcw-summary-card-number pass-num">${s.pass}</div>
            <div class="qcw-summary-card-label">Passed</div>
          </div>
          <div class="qcw-summary-card">
            <div class="qcw-summary-card-number fail-num">${s.fail}</div>
            <div class="qcw-summary-card-label">Failed</div>
          </div>
          <div class="qcw-summary-card">
            <div class="qcw-summary-card-number na-num">${s.na}</div>
            <div class="qcw-summary-card-label">N/A</div>
          </div>
        </div>
        ${failItemsHtml}
        <div class="qcw-summary-actions">
          <button class="qcw-action-btn qcw-action-save" id="qcw-save-btn"><i class="bi bi-check-circle"></i> Save QC Check</button>
          <button class="qcw-action-btn qcw-action-email" id="qcw-email-btn"><i class="bi bi-envelope"></i> Email Tester</button>
          <button class="qcw-action-btn qcw-action-print" id="qcw-print-btn"><i class="bi bi-printer"></i> Print</button>
          <button class="qcw-action-btn qcw-action-close" id="qcw-close-final-btn"><i class="bi bi-x-circle"></i> Close</button>
        </div>
      </div>`;

    // Bind summary actions
    document.getElementById('qcw-save-btn').addEventListener('click', () => this._save());
    document.getElementById('qcw-email-btn').addEventListener('click', () => this._emailTester());
    document.getElementById('qcw-print-btn').addEventListener('click', () => window.print());
    document.getElementById('qcw-close-final-btn').addEventListener('click', () => this.close());
  }

  /* ── Build save payload ─────────────────────────────────── */
  _buildPayload() {
    const s = this._computeScore();
    const payload = {
      garage_id: this.garageId,
      tester_name: this.formData._testerName,
      tester_id: this.formData._testerID,
      vehicle_reg: this.formData._vehicleReg,
      date_of_qc: this.formData._dateOfQC,
      qc_carried_out_by: this.formData._qcCarriedOutBy,
      vehicle_class: this.formData._vehicleClass,
      qc_type: this.formData._qcType || null,
      vehicle_make: this.formData._vehicleMake || null,
      vehicle_model: this.formData._vehicleModel || null,
      is_hybrid_electric: this.isHybridElectric ? 1 : 0,
      score_percentage: s.pct,
      status: 'complete',
      notes: this.formData._notes || '',
      tqi_checked: this.formData.tqi_checked || 'yes',
      confirmed_by_tester: this.formData._confirmedByTester || ''
    };

    // Car-specific fields
    if (this.groupType === 'car') {
      payload.consultant = this.formData._consultant;
    }
    // Bike-specific fields
    if (this.groupType === 'bike') {
      payload.name_qc_checker = this.formData._qcCarriedOutBy || '';
    }

    // Dynamically add all check item values from sections
    this.sections.forEach(sec => {
      sec.items.forEach(item => {
        payload[item.key] = this.formData[item.key] || 'yes';
      });
    });

    return payload;
  }

  /* ── Save ───────────────────────────────────────────────── */
  async _save() {
    const payload = this._buildPayload();
    const btn = document.getElementById('qcw-save-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Saving...';

    const tableName = this.groupType === 'bike'
      ? 'data_launch_qc_checkers_for_bike'
      : 'data_launch_qc_checkers_for_car';

    const cacheKey = this.groupType === 'bike' ? 'qcCheckersForBikeData' : 'qcCheckerData';

    try {
      if (this.recordId) {
        payload.id = this.recordId;
        await this.garageInstance.secureAction('update', tableName, this.recordId, payload);
        // Update local cache
        const cache = this.garageInstance[cacheKey] || [];
        for (let i = 0; i < cache.length; i++) {
          if (cache[i].id === this.recordId) {
            cache[i] = { ...cache[i], ...payload };
          }
        }
      } else {
        const result = await this.garageInstance.secureAction('create', tableName, null, payload);
        this.recordId = result.id;
      }

      // Refresh the correct subgrid
      if (this.groupType === 'bike') {
        this.garageInstance.injectDataIntoQcCheckersForBikesSubgrid();
      } else {
        this.garageInstance.injectDataIntoQcCheckersSubgrid();
      }

      btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Saved!';
      btn.style.background = '#27ae60';
      document.getElementById('qcw-draft-badge').textContent = 'SAVED';
      document.getElementById('qcw-draft-badge').classList.add('saved');

      if (this.garageInstance.showCRUDAlert) {
        this.garageInstance.showCRUDAlert('QC Check saved successfully!', 'success');
      }
    } catch (err) {
      console.error('QC save error:', err);
      btn.innerHTML = '<i class="bi bi-x-circle"></i> Error — try again';
      btn.disabled = false;
      btn.style.background = '#e74c3c';
      setTimeout(() => {
        btn.style.background = '';
        btn.innerHTML = '<i class="bi bi-check-circle"></i> Save QC Check';
      }, 2000);
    }
  }

  /* ── Email tester ───────────────────────────────────────── */
  async _emailTester() {
    // First ensure saved
    if (!this.recordId) {
      await this._save();
    }
    if (!this.recordId) return; // save failed

    const btn = document.getElementById('qcw-email-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';

    try {
      const response = await fetch(`/api/qc-check/${this.recordId}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garage_id: this.garageId,
          tester_name: this.formData._testerName,
          vehicle_reg: this.formData._vehicleReg,
          score: this._computeScore().pct,
          date: this.formData._dateOfQC,
          group_type: this.groupType  // 'car' or 'bike'
        })
      });
      if (response.ok) {
        btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Email Sent!';
        btn.style.background = '#27ae60';
      } else {
        throw new Error('Email send failed');
      }
    } catch (err) {
      console.error('Email error:', err);
      btn.innerHTML = '<i class="bi bi-x-circle"></i> Email Failed';
      btn.style.background = '#e74c3c';
      setTimeout(() => {
        btn.style.background = '';
        btn.innerHTML = '<i class="bi bi-envelope"></i> Email Tester';
        btn.disabled = false;
      }, 2000);
    }
  }
}

// Create global instance
const qcCheckWizard = new QCCheckWizard();
