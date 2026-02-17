/* ============================================================
   SITE AUDIT WIZARD  — Full-page step-by-step site audit form
   Follows DVSA MOT testing station audit framework
   ============================================================ */

class SiteAuditWizard {

  /* ── Section definitions ─────────────────────────────────── */
  static SECTIONS = [
    {
      id: 'setup', title: 'Audit Details',
      subtitle: 'Enter the basic details for this site audit.',
      items: []
    },
    {
      id: 'premises', title: 'Premises & Customer Areas',
      subtitle: 'DVSA requires customer-facing areas to be accessible, clean and clearly signed.',
      items: [
        { key: 'are_customer_areas_accessible',            label: 'Customer areas are accessible and welcoming' },
        { key: 'are_customer_reception_clean',             label: 'Customer reception area is clean and tidy' },
        { key: 'can_customers_identify_viewing_area',      label: 'Customers can identify the viewing area for the MOT bay' },
        { key: 'are_customer_facilities_clean',            label: 'Customer facilities (toilets, waiting area) are clean' },
        { key: 'is_mot_bay_location_apparent',             label: 'MOT bay location is clearly apparent to customers' }
      ]
    },
    {
      id: 'displayCompliance', title: 'Display & Signage Compliance',
      subtitle: 'Mandatory DVSA display requirements — VT9A, fees, opening hours and examiner details.',
      items: [
        { key: 'is_notice_board_up_to_date',               label: 'Notice board is up to date with current information' },
        { key: 'are_notice_boards_visible',                label: 'Notice boards are visible and accessible to customers' },
        { key: 'are_vt9a_parts_displayed',                 label: 'VT9A (Parts I & II) displayed correctly in customer area' },
        { key: 'are_authorised_examiner_details_correct',  label: 'Authorised Examiner details are correct and displayed' },
        { key: 'are_test_fees_reduced',                    label: 'Test fees / reduced rate fees are clearly displayed' },
        { key: 'are_opening_hours_displayed_correctly',    label: 'Opening hours are displayed correctly' }
      ]
    },
    {
      id: 'qualityManagement', title: 'Quality Management Systems',
      subtitle: 'DVSA expects a demonstrable quality management process covering bookings, records, and handover.',
      items: [
        { key: 'does_vts_have_quality_management_process', label: 'VTS has a documented quality management process' },
        { key: 'can_management_system_be_demonstrated',    label: 'Management system can be demonstrated and evidenced' },
        { key: 'is_workload_management_system_appropriate',label: 'Workload management system is appropriate for volume' },
        { key: 'does_vts_have_booking_system',             label: 'VTS has an adequate booking system in place' },
        { key: 'does_vts_have_handover_process',           label: 'VTS has an effective vehicle handover process' },
        { key: 'is_documentation_easily_retrievable',      label: 'Documentation is easily retrievable for DVSA inspection' },
        { key: 'are_staff_suggestions_recorded',           label: 'Staff suggestions and feedback are recorded' },
        { key: 'is_vts_following_codes_of_practice',       label: 'VTS is following industry codes of practice' }
      ]
    },
    {
      id: 'calibration', title: 'Calibration & Documentation',
      subtitle: 'Equipment calibration records, DVSA forms and manufacturer manuals must be current.',
      items: [
        { key: 'are_calibration_records_correct',          label: 'Calibration records are correct and up to date' },
        { key: 'are_mot_equipment_manuals_available',      label: 'MOT equipment manuals are available on site' },
        { key: 'are_required_dvsa_forms_available',        label: 'Required DVSA forms are available and accessible' },
        { key: 'does_vts_have_recent_emission_reports',    label: 'Recent emission test reports are available for review' },
        { key: 'can_emission_reports_be_matched',          label: 'Emission reports can be matched to test findings' }
      ]
    },
    {
      id: 'testerCompliance', title: 'Tester & Staff Compliance',
      subtitle: 'DVSA mandates annual training, CPD completion, TQI monitoring and fraud awareness.',
      items: [
        { key: 'are_special_notices_accessible',           label: 'Special Notices are accessible to all testers' },
        { key: 'do_vts_employees_read_mot_blog',           label: 'Staff read the Matters of Testing blog regularly' },
        { key: 'can_staff_reference_mot_testing_guide',    label: 'MOT Testing Guide is available for reference' },
        { key: 'does_vts_have_correct_number_of_staff',    label: 'VTS has the correct number of qualified staff' },
        { key: 'can_staff_access_mts_system',              label: 'Tester Information (MTS) is accessible to staff' },
        { key: 'does_vts_have_dvsa_training_records',      label: 'DVSA annual training records are available' },
        { key: 'does_vts_have_cpd_training_records',       label: 'CPD training records are up to date' },
        { key: 'are_mot_testers_quality_checked',          label: 'Regular quality checks are performed on MOT testers' },
        { key: 'does_vts_monitor_test_logs',               label: 'VTS monitors test logs for anomalies' }
      ]
    },
    {
      id: 'riskIndicators', title: 'Risk & Fraud Indicators',
      subtitle: 'DVSA risk assessment — incentive schemes, password security and fraud indicators.',
      items: [
        { key: 'does_vts_offer_bonus_for_mot_testing',     label: 'VTS offers bonus/commission for MOT testing volume' },
        { key: 'does_vts_offer_incentives_influencing_mot', label: 'Other incentives exist that could influence MOT outcomes' },
        { key: 'have_tester_passwords_been_compromised',   label: 'Tester passwords / MTS credentials are secure' },
        { key: 'are_there_indications_of_fraud',           label: 'No indications of fraudulent or irregular testing found' },
        { key: 'can_vts_provide_no_mot_records',           label: 'VTS can provide records of all MOT tests conducted' }
      ]
    },
    {
      id: 'equipmentWorkshop', title: 'Equipment & Workshop',
      subtitle: 'MOT bay condition, equipment maintenance and workshop health & safety.',
      items: [
        { key: 'are_mot_bays_clearly_marked',              label: 'MOT bays are clearly marked and identified' },
        { key: 'do_bays_support_test_volume',              label: 'Bays allow for the current testing volume' },
        { key: 'is_correct_vehicle_registered_on_mts',     label: 'Correct vehicle is registered on MTS before testing' },
        { key: 'are_working_areas_clean_hazard_free',      label: 'Working areas are clean and free of hazards' },
        { key: 'does_regular_housekeeping_occur',          label: 'Regular housekeeping is carried out' },
        { key: 'are_waste_and_recyclables_stored_properly', label: 'Waste and recyclables are stored properly' },
        { key: 'do_staff_work_safely',                     label: 'Staff are working safely and using PPE where required' },
        { key: 'is_workshop_equipment_in_good_order',      label: 'Workshop equipment is in good working order' },
        { key: 'does_vts_maintain_equipment',              label: 'VTS maintains equipment to manufacturer standards' },
        { key: 'are_maintenance_logs_kept',                label: 'Maintenance logs are kept and up to date' }
      ]
    },
    {
      id: 'toolsInventory', title: 'Tools in Working Order',
      subtitle: 'DVSA-mandated tools that must be available and in working condition at the testing station.',
      items: [
        { key: 'tread_depth_gauge',                        label: 'Tread depth gauge' },
        { key: 'inspection_lamp',                          label: 'Inspection lamp / torch' },
        { key: 'pry_pinch_bars',                           label: 'Pry / pinch bars' },
        { key: 'corrosion_assessment_tool',                label: 'Corrosion assessment tool' },
        { key: 'steel_tape_measure',                       label: 'Steel tape measure' },
        { key: 'mirrors_or_cameras_for_light_check',       label: 'Mirrors or cameras for light alignment check' },
        { key: 'wheel_chocks',                             label: 'Wheel chocks' },
        { key: 'brake_pedal_depressor',                    label: 'Brake pedal depressor' },
        { key: 'trailer_socket_testing_tool',              label: 'Trailer socket testing tool' },
        { key: 'leak_detection_spray',                     label: 'Leak detection spray' },
        { key: 'oil_temperature_probe',                    label: 'Oil temperature probe' }
      ]
    },
    {
      id: 'auditFindings', title: 'Audit Findings & Notes',
      subtitle: 'Record findings, recommendations and remedial actions required.',
      items: []
    },
    {
      id: 'summary', title: 'Audit Complete',
      subtitle: 'Review the results of this site audit.',
      items: []
    }
  ];

  /* ── Audit type options ────────────────────────────────────── */
  static AUDIT_TYPES = [
    { value: 'routine',      icon: 'bi-calendar-check', label: 'Routine Audit',     desc: 'Scheduled periodic audit' },
    { value: 'follow_up',    icon: 'bi-arrow-repeat',   label: 'Follow-Up',         desc: 'Revisit from a previous audit' },
    { value: 'dvsa_prep',    icon: 'bi-shield-check',   label: 'DVSA Preparation',  desc: 'Preparing for a DVSA visit' },
    { value: 'complaint',    icon: 'bi-exclamation-diamond', label: 'Complaint-Led', desc: 'Triggered by a complaint' },
    { value: 'new_site',     icon: 'bi-building-add',   label: 'New Site Setup',    desc: 'Initial audit for a new VTS' }
  ];

  /* ────────────────────────────────────────────────────────── */
  constructor() {
    this.currentStep = 0;
    this.maxVisitedStep = 0;
    this.formData = {};
    this.notes = {};
    this.garageId = null;
    this.garageInstance = null;
    this.recordId = null;
    this.sections = SiteAuditWizard.SECTIONS;
    this._menuOpen = false;
    this._buildOverlay();
  }

  /* ── Build the overlay container once ──────────────────── */
  _buildOverlay() {
    if (document.getElementById('saw-overlay')) return;
    const el = document.createElement('div');
    el.id = 'saw-overlay';
    el.className = 'qcw-overlay'; // reuse QC wizard styles
    el.innerHTML = `
      <!-- Header -->
      <div class="qcw-header saw-header">
        <div class="qcw-header-title">
          <i class="bi bi-clipboard2-check"></i>
          <span id="saw-header-text">MOT Site Audit</span>
        </div>
        <div class="qcw-header-right">
          <span class="qcw-draft-badge" id="saw-draft-badge">DRAFT</span>
          <button class="qcw-close-btn" id="saw-close-btn" title="Close"><i class="bi bi-x-lg"></i></button>
        </div>
      </div>
      <!-- Progress -->
      <div class="qcw-progress-container">
        <div class="qcw-progress-bar-wrap">
          <div class="qcw-progress-fill" id="saw-progress-fill"></div>
        </div>
        <div class="qcw-progress-info">
          <span id="saw-progress-section">Section 1 of ${this.sections.length}</span>
          <span id="saw-progress-pct">0%</span>
        </div>
      </div>
      <!-- Step dots -->
      <div class="qcw-step-dots" id="saw-step-dots"></div>
      <!-- Body -->
      <div class="qcw-body" id="saw-body"></div>
      <!-- Bottom nav -->
      <div class="qcw-nav-bar">
        <button class="qcw-nav-btn" id="saw-prev-btn"><i class="bi bi-chevron-left"></i> Previous</button>
        <button class="qcw-nav-btn" id="saw-menu-btn"><i class="bi bi-list"></i> Sections</button>
        <button class="qcw-nav-btn primary" id="saw-next-btn">Next <i class="bi bi-chevron-right"></i></button>
      </div>
      <!-- Section menu -->
      <div class="qcw-section-menu" id="saw-section-menu"></div>
    `;
    document.body.appendChild(el);

    document.getElementById('saw-close-btn').addEventListener('click', () => this.close());
    document.getElementById('saw-prev-btn').addEventListener('click', () => this.prevStep());
    document.getElementById('saw-next-btn').addEventListener('click', () => this.nextStep());
    document.getElementById('saw-menu-btn').addEventListener('click', () => this._toggleMenu());
    el.addEventListener('click', e => {
      if (this._menuOpen && !e.target.closest('.qcw-section-menu') && !e.target.closest('#saw-menu-btn')) {
        this._closeMenu();
      }
    });
  }

  /* ── Open the wizard ────────────────────────────────────── */
  open(garageInstance, existingRecord = null) {
    this.garageInstance = garageInstance;
    this.garageId = garageInstance.id;
    this.currentStep = 0;
    this.maxVisitedStep = 0;
    this.formData = {};
    this.notes = {};
    this.recordId = null;

    if (existingRecord) {
      this.recordId = existingRecord.id;
      this._prefillFromRecord(existingRecord);
      this.maxVisitedStep = this.sections.length - 1;
    } else {
      if (typeof USER_RECORD !== 'undefined') {
        this.formData._consultant = (USER_RECORD.first_name || '') + ' ' + (USER_RECORD.last_name || '');
      }
      const today = new Date().toISOString().split('T')[0];
      this.formData._auditDate = today;
    }

    // Reset draft badge
    const badge = document.getElementById('saw-draft-badge');
    badge.textContent = 'DRAFT';
    badge.classList.remove('saved');

    this._renderAllSections();
    this._renderStepDots();
    this._showStep(0);
    this._updateProgress();

    document.getElementById('saw-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    document.getElementById('saw-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ── Navigation ─────────────────────────────────────────── */
  nextStep() {
    if (this.currentStep === 0) {
      if (!this._validateSetup()) return;
    }
    if (!this._validateFailNotes()) return;

    if (this.currentStep < this.sections.length - 1) {
      this._saveCurrentStepData();
      this.currentStep++;
      if (this.currentStep > this.maxVisitedStep) {
        this.maxVisitedStep = this.currentStep;
      }
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
      if (idx > this.maxVisitedStep) return;
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
    const body = document.getElementById('saw-body');
    let html = '';
    this.sections.forEach((sec, idx) => {
      html += `<div class="qcw-section" data-step="${idx}" id="saw-section-${idx}">`;
      html += `<h2 class="qcw-section-title">${sec.title}</h2>`;
      html += `<p class="qcw-section-subtitle">${sec.subtitle}</p>`;

      if (sec.id === 'setup') {
        html += this._renderSetupForm();
      } else if (sec.id === 'auditFindings') {
        html += this._renderFindingsSection();
      } else if (sec.id === 'summary') {
        html += `<div id="saw-summary-content"></div>`;
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
    let html = `
      <h3 style="font-size:16px;font-weight:700;color:#344054;margin-bottom:12px;">Select Audit Type</h3>
      <div class="qcw-type-grid">`;
    SiteAuditWizard.AUDIT_TYPES.forEach(t => {
      const selected = this.formData._auditType === t.value ? ' selected' : '';
      html += `
        <div class="qcw-type-card${selected}" data-audittype="${t.value}">
          <div class="qcw-type-icon"><i class="bi ${t.icon}"></i></div>
          <div class="qcw-type-label">${t.label}</div>
          <div class="qcw-type-desc">${t.desc}</div>
        </div>`;
    });
    html += `</div>`;

    html += `
      <div style="margin-top:32px;">
        <h3 style="font-size:16px;font-weight:700;color:#344054;margin-bottom:12px;">Audit Information</h3>
        <div class="qcw-details-form">
          <div class="qcw-field-group">
            <label class="qcw-field-label">Auditor Name <span style="color:#e74c3c">*</span></label>
            <input class="qcw-field-input" id="saw-auditor" type="text" placeholder="Name of person conducting the audit" value="${this.formData._auditor || ''}">
          </div>
          <div class="qcw-field-group">
            <label class="qcw-field-label">Consultant</label>
            <input class="qcw-field-input" id="saw-consultant" type="text" placeholder="Consultant name" value="${this.formData._consultant || ''}">
          </div>
          <div class="qcw-field-group">
            <label class="qcw-field-label">Audit Date <span style="color:#e74c3c">*</span></label>
            <input class="qcw-field-input" id="saw-auditDate" type="date" value="${this.formData._auditDate || ''}">
          </div>
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
              <div class="qcw-fail-note-label"><i class="bi bi-exclamation-triangle-fill"></i> Note required — describe the issue and remedial action needed</div>
              <textarea placeholder="Describe the non-compliance found and what remedial action is required..." data-note-key="${item.key}">${this.notes[item.key] || ''}</textarea>
            </div>
          </div>
          <div class="qcw-toggle-group">
            <button class="qcw-toggle-btn${passClass}" data-val="yes" data-key="${item.key}">Yes</button>
            <button class="qcw-toggle-btn${failClass}" data-val="no" data-key="${item.key}">No</button>
            <button class="qcw-toggle-btn${naClass}" data-val="n/a" data-key="${item.key}">N/A</button>
          </div>
        </div>`;
    });
    html += '</div>';
    return html;
  }

  /* ── Audit Findings section ─────────────────────────────── */
  _renderFindingsSection() {
    return `
      <div class="qcw-check-list">
        <div class="qcw-field-group" style="margin-bottom:20px">
          <label class="qcw-field-label">Site Audit Findings</label>
          <textarea class="qcw-field-input" id="saw-findings" rows="5" placeholder="Summarise the key findings from this audit...">${this.formData._findings || ''}</textarea>
        </div>
        <div class="qcw-field-group" style="margin-bottom:20px">
          <label class="qcw-field-label">Emission Report Observations</label>
          <textarea class="qcw-field-input" id="saw-emissionReport" rows="3" placeholder="Any observations from reviewing emission test reports...">${this.formData._emissionReport || ''}</textarea>
        </div>
        <div class="qcw-field-group" style="margin-bottom:20px">
          <label class="qcw-field-label">Auditor Sign-off</label>
          <input class="qcw-field-input" id="saw-auditorPrint" type="text" value="${this.formData._auditorPrint || ''}" placeholder="Auditor name to confirm">
        </div>
      </div>`;
  }

  /* ── Bind events ────────────────────────────────────────── */
  _bindEvents() {
    const overlay = document.getElementById('saw-overlay');

    // Audit Type cards
    overlay.querySelectorAll('.qcw-type-card').forEach(card => {
      card.addEventListener('click', () => {
        overlay.querySelectorAll('.qcw-type-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.formData._auditType = card.dataset.audittype;
      });
    });

    // Toggle buttons (Yes/No/N/A)
    overlay.querySelectorAll('.qcw-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => this._handleToggle(btn));
    });

    // Notes textareas
    overlay.querySelectorAll('textarea[data-note-key]').forEach(ta => {
      ta.addEventListener('input', () => {
        this.notes[ta.dataset.noteKey] = ta.value;
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

    group.querySelectorAll('.qcw-toggle-btn').forEach(b => {
      b.classList.remove('active-pass', 'active-fail', 'active-na');
    });

    if (val === 'yes') btn.classList.add('active-pass');
    else if (val === 'no') btn.classList.add('active-fail');
    else btn.classList.add('active-na');

    checkItem.classList.remove('pass', 'fail', 'na');
    if (val === 'yes') checkItem.classList.add('pass');
    else if (val === 'no') checkItem.classList.add('fail');
    else checkItem.classList.add('na');

    this.formData[key] = val;
    this._updateStepDots();
  }

  /* ── Show a specific step ───────────────────────────────── */
  _showStep(idx) {
    const overlay = document.getElementById('saw-overlay');
    overlay.querySelectorAll('.qcw-section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById(`saw-section-${idx}`);
    if (section) section.classList.add('active');

    // Pre-fill setup when going back to step 0
    if (idx === 0) this._prefillSetupFields();

    // Update nav buttons
    document.getElementById('saw-prev-btn').style.visibility = idx === 0 ? 'hidden' : '';
    const nextBtn = document.getElementById('saw-next-btn');
    if (idx === this.sections.length - 1) {
      nextBtn.style.visibility = 'hidden';
    } else {
      nextBtn.style.visibility = '';
      nextBtn.innerHTML = idx === this.sections.length - 2
        ? 'Finish <i class="bi bi-check-lg"></i>'
        : 'Next <i class="bi bi-chevron-right"></i>';
    }
    this._updateStepDots();
  }

  /* ── Progress bar ───────────────────────────────────────── */
  _updateProgress() {
    const total = this.sections.length;
    const pct = Math.round(((this.currentStep + 1) / total) * 100);
    document.getElementById('saw-progress-fill').style.width = pct + '%';
    document.getElementById('saw-progress-pct').textContent = pct + '%';
    document.getElementById('saw-progress-section').textContent =
      `Section ${this.currentStep + 1} of ${total}`;
  }

  /* ── Step dots ──────────────────────────────────────────── */
  _renderStepDots() {
    const container = document.getElementById('saw-step-dots');
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
    document.querySelectorAll('#saw-step-dots .qcw-step-dot').forEach((dot, idx) => {
      dot.classList.remove('active', 'completed', 'has-fail', 'locked');
      if (idx === this.currentStep) {
        dot.classList.add('active');
      } else if (idx <= this.maxVisitedStep) {
        const sec = this.sections[idx];
        if (sec.items && sec.items.length > 0) {
          const hasFail = sec.items.some(i => this.formData[i.key] === 'no');
          if (hasFail) dot.classList.add('has-fail');
          else dot.classList.add('completed');
        } else {
          dot.classList.add('completed');
        }
      } else {
        dot.classList.add('locked');
      }
    });
    this._renderSectionMenu();
  }

  /* ── Section menu ───────────────────────────────────────── */
  _toggleMenu() {
    const menu = document.getElementById('saw-section-menu');
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
    document.getElementById('saw-section-menu').classList.remove('active');
  }

  _renderSectionMenu() {
    const menu = document.getElementById('saw-section-menu');
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
    const auditor = document.getElementById('saw-auditor')?.value?.trim();
    const date = document.getElementById('saw-auditDate')?.value;
    if (!auditor) {
      alert('Please enter the auditor name.');
      return false;
    }
    if (!date) {
      alert('Please select an audit date.');
      return false;
    }
    if (!this.formData._auditType) {
      alert('Please select an audit type.');
      return false;
    }
    return true;
  }

  /* ── Validate fail notes ────────────────────────────────── */
  _validateFailNotes() {
    const sec = this.sections[this.currentStep];
    if (!sec.items || sec.items.length === 0) return true;

    const missingNotes = [];
    sec.items.forEach(item => {
      if (this.formData[item.key] === 'no') {
        const note = (this.notes[item.key] || '').trim();
        if (!note) missingNotes.push(item.label);
      }
    });

    if (missingNotes.length > 0) {
      const overlay = document.getElementById('saw-overlay');
      const items = overlay.querySelectorAll('.qcw-check-item.fail');
      items.forEach(el => {
        const ta = el.querySelector('textarea[data-note-key]');
        if (ta && !(ta.value || '').trim()) {
          ta.style.borderColor = '#e74c3c';
          ta.style.boxShadow = '0 0 0 3px rgba(231,76,60,0.2)';
          ta.setAttribute('placeholder', 'Required — describe the non-compliance and remedial action');
          ta.style.animation = 'none';
          ta.offsetHeight;
          ta.style.animation = 'qcwShake 0.4s ease';
        }
      });

      alert(`Please add a note for ${missingNotes.length} non-compliant item${missingNotes.length > 1 ? 's' : ''} before continuing:\n\n• ${missingNotes.join('\n• ')}`);
      return false;
    }
    return true;
  }

  /* ── Save current step data ─────────────────────────────── */
  _saveCurrentStepData() {
    const sec = this.sections[this.currentStep];
    if (sec.id === 'setup') {
      this.formData._auditor     = document.getElementById('saw-auditor')?.value || '';
      this.formData._consultant  = document.getElementById('saw-consultant')?.value || '';
      this.formData._auditDate   = document.getElementById('saw-auditDate')?.value || '';
    }
    else if (sec.id === 'auditFindings') {
      this.formData._findings       = document.getElementById('saw-findings')?.value || '';
      this.formData._emissionReport = document.getElementById('saw-emissionReport')?.value || '';
      this.formData._auditorPrint   = document.getElementById('saw-auditorPrint')?.value || '';
    }
  }

  /* ── Pre-fill setup fields ──────────────────────────────── */
  _prefillSetupFields() {
    const el = id => document.getElementById(id);
    if (el('saw-auditor'))    el('saw-auditor').value    = this.formData._auditor || '';
    if (el('saw-consultant')) el('saw-consultant').value = this.formData._consultant || '';
    if (el('saw-auditDate'))  el('saw-auditDate').value  = this.formData._auditDate || '';

    if (this.formData._auditType) {
      document.querySelectorAll('#saw-overlay .qcw-type-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.audittype === this.formData._auditType);
      });
    }
  }

  /* ── Pre-fill from existing record ──────────────────────── */
  _prefillFromRecord(r) {
    this.formData._auditor        = r.auditor || '';
    this.formData._consultant     = r.consultant || '';
    this.formData._auditDate      = r.date || '';
    this.formData._auditType      = r.audit_type || '';
    this.formData._findings       = r.site_audit_findings || '';
    this.formData._emissionReport = r.emission_report_same_findings || r.emission_report || '';
    this.formData._auditorPrint   = r.auditor_print || '';

    this.sections.forEach(sec => {
      sec.items.forEach(item => {
        if (r[item.key] !== undefined && r[item.key] !== null) {
          this.formData[item.key] = r[item.key];
        }
      });
    });
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
    const applicable = total - na;
    const pct = applicable > 0 ? Math.round((pass / applicable) * 100) : 100;
    return { total, pass, fail, na, unanswered, pct, applicable };
  }

  /* ── Render summary page ────────────────────────────────── */
  _renderSummary() {
    this._saveCurrentStepData();
    const s = this._computeScore();
    const ringClass = s.pct >= 80 ? 'green' : s.pct >= 50 ? 'amber' : 'red';
    const resultText = s.pct >= 80 ? 'Compliant' : s.pct >= 50 ? 'Partially Compliant' : 'Non-Compliant';

    // Group failures by section
    let failItemsHtml = '';
    if (s.fail > 0) {
      failItemsHtml = `<div class="qcw-fail-items-list"><h4><i class="bi bi-exclamation-triangle-fill"></i> Non-Compliant Items — Remedial Action Required</h4>`;
      this.sections.forEach(sec => {
        const secFails = sec.items.filter(i => this.formData[i.key] === 'no');
        if (secFails.length > 0) {
          failItemsHtml += `<div style="margin-top:12px;margin-bottom:4px;font-weight:700;color:#667085;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">${sec.title}</div>`;
          secFails.forEach(item => {
            failItemsHtml += `
              <div class="qcw-fail-item-row">
                <strong>${item.label}</strong>
                <p>${this.notes[item.key] ? this.notes[item.key] : '<em style="color:#94a3b8">No note provided</em>'}</p>
              </div>`;
          });
        }
      });
      failItemsHtml += `</div>`;
    }

    // Section breakdown
    let breakdownHtml = '<div style="margin-top:24px;"><h4 style="font-size:15px;font-weight:700;color:#344054;margin-bottom:12px;">Section Breakdown</h4>';
    this.sections.forEach(sec => {
      if (sec.items.length === 0) return;
      const secPass = sec.items.filter(i => this.formData[i.key] === 'yes').length;
      const secFail = sec.items.filter(i => this.formData[i.key] === 'no').length;
      const secNa = sec.items.filter(i => this.formData[i.key] === 'n/a').length;
      const secApplicable = sec.items.length - secNa;
      const secPct = secApplicable > 0 ? Math.round((secPass / secApplicable) * 100) : 100;
      const barColor = secPct >= 80 ? '#27ae60' : secPct >= 50 ? '#f39c12' : '#e74c3c';
      breakdownHtml += `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
          <div style="flex:1;font-size:13px;color:#344054;font-weight:500;">${sec.title}</div>
          <div style="width:120px;height:8px;background:#f0f4f8;border-radius:4px;overflow:hidden;">
            <div style="width:${secPct}%;height:100%;background:${barColor};border-radius:4px;transition:width 0.5s;"></div>
          </div>
          <div style="width:50px;text-align:right;font-weight:700;font-size:13px;color:${barColor}">${secPct}%</div>
        </div>`;
    });
    breakdownHtml += '</div>';

    const container = document.getElementById('saw-summary-content');
    container.innerHTML = `
      <div class="qcw-summary">
        <div class="qcw-score-ring ${ringClass}">
          <div class="qcw-score-number">${s.pct}%</div>
          <div class="qcw-score-label">${resultText}</div>
        </div>
        <h3 class="qcw-summary-title">Site Audit Complete</h3>
        <p class="qcw-summary-subtitle">
          Audited by ${this.formData._auditor || 'Auditor'} — ${this.formData._auditDate || 'Today'}
        </p>
        <div class="qcw-summary-cards">
          <div class="qcw-summary-card">
            <div class="qcw-summary-card-number pass-num">${s.pass}</div>
            <div class="qcw-summary-card-label">Compliant</div>
          </div>
          <div class="qcw-summary-card">
            <div class="qcw-summary-card-number fail-num">${s.fail}</div>
            <div class="qcw-summary-card-label">Non-Compliant</div>
          </div>
          <div class="qcw-summary-card">
            <div class="qcw-summary-card-number na-num">${s.na}</div>
            <div class="qcw-summary-card-label">N/A</div>
          </div>
        </div>
        ${breakdownHtml}
        ${failItemsHtml}
        <div class="qcw-summary-actions">
          <button class="qcw-action-btn qcw-action-save" id="saw-save-btn"><i class="bi bi-check-circle"></i> Save Audit</button>
          <button class="qcw-action-btn qcw-action-email" id="saw-email-btn"><i class="bi bi-envelope"></i> Email to Manager</button>
          <button class="qcw-action-btn qcw-action-print" id="saw-print-btn"><i class="bi bi-printer"></i> Print Report</button>
          <button class="qcw-action-btn qcw-action-close" id="saw-close-final-btn"><i class="bi bi-x-circle"></i> Close</button>
        </div>
      </div>`;

    document.getElementById('saw-save-btn').addEventListener('click', () => this._save());
    document.getElementById('saw-email-btn').addEventListener('click', () => this._emailManager());
    document.getElementById('saw-print-btn').addEventListener('click', () => window.print());
    document.getElementById('saw-close-final-btn').addEventListener('click', () => this.close());
  }

  /* ── Build save payload ─────────────────────────────────── */
  _buildPayload() {
    const s = this._computeScore();
    const payload = {
      garage_id: this.garageId,
      consultant: this.formData._consultant || '',
      auditor: this.formData._auditor || '',
      date: this.formData._auditDate || '',
      audit_type: this.formData._auditType || null,
      score_percentage: s.pct,
      status: 'complete',
      site_audit_findings: this.formData._findings || '',
      emission_report_same_findings: this.formData._emissionReport || '',
      auditor_print: this.formData._auditorPrint || '',
      notes: this.formData._findings || ''
    };

    // Dynamically add all check items
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
    const btn = document.getElementById('saw-save-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Saving...';

    try {
      if (this.recordId) {
        payload.id = this.recordId;
        await this.garageInstance.secureAction('update', 'data_launch_mot_site_audits', this.recordId, payload);
        const cache = this.garageInstance.motSiteAuditData || [];
        for (let i = 0; i < cache.length; i++) {
          if (cache[i].id === this.recordId) {
            cache[i] = { ...cache[i], ...payload };
          }
        }
      } else {
        const result = await this.garageInstance.secureAction('create', 'data_launch_mot_site_audits', null, payload);
        this.recordId = result.id;
      }

      this.garageInstance.injectDataIntoMotSiteAuditsSubgrid();

      btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Saved!';
      btn.style.background = '#27ae60';
      document.getElementById('saw-draft-badge').textContent = 'SAVED';
      document.getElementById('saw-draft-badge').classList.add('saved');

      if (this.garageInstance.showCRUDAlert) {
        this.garageInstance.showCRUDAlert('Site Audit saved successfully!', 'success');
      }
    } catch (err) {
      console.error('Site audit save error:', err);
      btn.innerHTML = '<i class="bi bi-x-circle"></i> Error — try again';
      btn.disabled = false;
      btn.style.background = '#e74c3c';
      setTimeout(() => {
        btn.style.background = '';
        btn.innerHTML = '<i class="bi bi-check-circle"></i> Save Audit';
      }, 2000);
    }
  }

  /* ── Email to manager ───────────────────────────────────── */
  async _emailManager() {
    if (!this.recordId) {
      await this._save();
    }
    if (!this.recordId) return;

    const btn = document.getElementById('saw-email-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';

    try {
      const response = await fetch(`/api/site-audit/${this.recordId}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garage_id: this.garageId,
          auditor: this.formData._auditor,
          score: this._computeScore().pct,
          date: this.formData._auditDate,
          fail_count: this._computeScore().fail
        })
      });
      if (response.ok) {
        btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Email Sent!';
        btn.style.background = '#27ae60';
      } else {
        throw new Error('Email send failed');
      }
    } catch (err) {
      console.error('Site audit email error:', err);
      btn.innerHTML = '<i class="bi bi-x-circle"></i> Email Failed';
      btn.style.background = '#e74c3c';
      setTimeout(() => {
        btn.style.background = '';
        btn.innerHTML = '<i class="bi bi-envelope"></i> Email to Manager';
        btn.disabled = false;
      }, 2000);
    }
  }
}

// Create global instance
const siteAuditWizard = new SiteAuditWizard();
