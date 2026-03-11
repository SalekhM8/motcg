/* ============================================================
   ADD GARAGE WIZARD — Full-page step-by-step garage creation
   Follows the same pattern as QCCheckWizard / SiteAuditWizard
   ============================================================ */

class AddGarageWizard {

  static SECTIONS = [
    { id: 'business',    title: 'Business Details',       subtitle: 'Enter the core business information for this garage.' },
    { id: 'address',     title: 'Address',                subtitle: 'Where is this garage located?' },
    { id: 'operating',   title: 'Operating Hours & Days',  subtitle: 'Set the weekly schedule for this garage.' },
    { id: 'bays',        title: 'MOT Bays',               subtitle: 'Add the testing bays available at this garage.' },
    { id: 'consultant',  title: 'Consultant & Billing',    subtitle: 'Assign a consultant and set billing details.' },
    { id: 'review',      title: 'Review & Create',         subtitle: 'Check everything looks right before creating the garage.' }
  ];

  static DAYS = [
    { key: 'open_on_monday',    label: 'Monday' },
    { key: 'open_on_tuesday',   label: 'Tuesday' },
    { key: 'open_on_wednesday', label: 'Wednesday' },
    { key: 'open_on_thursday',  label: 'Thursday' },
    { key: 'open_on_friday',    label: 'Friday' },
    { key: 'open_on_saturday',  label: 'Saturday' },
    { key: 'open_on_sunday',    label: 'Sunday' }
  ];

  /* ────────────────────────────────────────────────────────── */
  constructor() {
    this.currentStep = 0;
    this.formData = {};
    this.bays = [{ name: 'Bay 1', timeSegments: 60 }];
    this.garageInstance = null;
    this._buildOverlay();
  }

  /* ── Build the overlay container once ──────────────────── */
  _buildOverlay() {
    if (document.getElementById('agw-overlay')) return;
    const el = document.createElement('div');
    el.id = 'agw-overlay';
    el.className = 'agw-overlay';
    el.innerHTML = `
      <div class="agw-header">
        <div class="agw-header-title">
          <i class="bi bi-car-front"></i>
          <span>Add New Garage</span>
        </div>
        <div class="agw-header-right">
          <button class="agw-close-btn" id="agw-close-btn" title="Close"><i class="bi bi-x-lg"></i></button>
        </div>
      </div>
      <div class="agw-progress-container">
        <div class="agw-progress-bar-wrap">
          <div class="agw-progress-bar-fill" id="agw-progress-fill"></div>
        </div>
        <div class="agw-progress-text">
          <span id="agw-progress-section">Step 1 of ${AddGarageWizard.SECTIONS.length}</span>
          <span id="agw-progress-pct">0%</span>
        </div>
        <div class="agw-step-dots" id="agw-step-dots"></div>
      </div>
      <div class="agw-body" id="agw-body"></div>
      <div class="agw-nav-bar">
        <button class="agw-nav-btn agw-nav-prev" id="agw-prev-btn"><i class="bi bi-chevron-left"></i> Previous</button>
        <button class="agw-nav-btn agw-nav-next" id="agw-next-btn">Next <i class="bi bi-chevron-right"></i></button>
      </div>
    `;
    document.body.appendChild(el);

    document.getElementById('agw-close-btn').addEventListener('click', () => this.close());
    document.getElementById('agw-prev-btn').addEventListener('click', () => this.prevStep());
    document.getElementById('agw-next-btn').addEventListener('click', () => this.nextStep());
  }

  /* ── Open the wizard ────────────────────────────────────── */
  open(garageInstance) {
    this.garageInstance = garageInstance;
    this.currentStep = 0;
    this.formData = {};
    this.bays = [{ name: 'Bay 1', timeSegments: 60 }];

    // Auto-fill consultant from current user
    if (typeof USER_RECORD !== 'undefined') {
      this.formData.consultant_name_garage = ((USER_RECORD.first_name || '') + ' ' + (USER_RECORD.last_name || '')).trim();
      this.formData.lead_consultant_name_garage = this.formData.consultant_name_garage;
    }

    // Default operating days: Mon-Fri checked
    AddGarageWizard.DAYS.forEach(d => {
      this.formData[d.key] = ['open_on_saturday', 'open_on_sunday'].includes(d.key) ? 0 : 1;
    });
    this.formData.opening_hours_start_garage = '08:00';
    this.formData.opening_hours_end_garage = '18:00';

    this._renderAll();
    this._renderStepDots();
    this._showStep(0);
    this._updateProgress();

    document.getElementById('agw-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /* ── Close ──────────────────────────────────────────────── */
  close() {
    document.getElementById('agw-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ── Navigation ─────────────────────────────────────────── */
  nextStep() {
    if (!this._validateCurrentStep()) return;
    this._saveCurrentStepData();
    if (this.currentStep < AddGarageWizard.SECTIONS.length - 1) {
      this.currentStep++;
      if (AddGarageWizard.SECTIONS[this.currentStep].id === 'review') {
        this._renderReview();
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

  /* ── Render all sections ────────────────────────────────── */
  _renderAll() {
    const body = document.getElementById('agw-body');
    let html = '';
    AddGarageWizard.SECTIONS.forEach((sec, idx) => {
      html += `<div class="agw-section" data-step="${idx}" id="agw-section-${idx}">`;
      html += `<h2 class="agw-section-title">${sec.title}</h2>`;
      html += `<p class="agw-section-subtitle">${sec.subtitle}</p>`;
      html += this['_render_' + sec.id]();
      html += `</div>`;
    });
    body.innerHTML = html;
    this._bindBayEvents();
  }

  /* ── Step 1: Business Details ───────────────────────────── */
  _render_business() {
    return `
      <div class="agw-field-group">
        <label class="agw-required">Trading Name</label>
        <input type="text" id="agw-trading-name" placeholder="e.g. Smith's MOT Centre" value="${this.formData.trading_name_garage || ''}">
      </div>
      <div class="agw-field-row">
        <div class="agw-field-group">
          <label class="agw-required">Contact First Name</label>
          <input type="text" id="agw-contact-forename" placeholder="First name" value="${this.formData.contact_forename_garage || ''}">
        </div>
        <div class="agw-field-group">
          <label class="agw-required">Contact Last Name</label>
          <input type="text" id="agw-contact-surname" placeholder="Last name" value="${this.formData.contact_surname_garage || ''}">
        </div>
      </div>
      <div class="agw-field-row">
        <div class="agw-field-group">
          <label>Phone</label>
          <input type="tel" id="agw-phone" placeholder="e.g. 01onal 234 5678" value="${this.formData.contact_main_number_garage || ''}">
        </div>
        <div class="agw-field-group">
          <label>Mobile</label>
          <input type="tel" id="agw-mobile" placeholder="e.g. 07700 900000" value="${this.formData.contact_mobile_number_garage || ''}">
        </div>
      </div>
      <div class="agw-field-group">
        <label>Email</label>
        <input type="email" id="agw-email" placeholder="email@example.com" value="${this.formData.contact_email_garage || ''}">
      </div>
      <div class="agw-field-group">
        <label>VTS Site Number</label>
        <input type="text" id="agw-vts-number" placeholder="Optional — link to an existing Testing Station" value="${this.formData.vts_site_number_garage || ''}">
        <div class="agw-hint">Leave blank if this garage doesn't have a VTS number yet.</div>
      </div>
    `;
  }

  /* ── Step 2: Address ────────────────────────────────────── */
  _render_address() {
    return `
      <div class="agw-field-group">
        <label class="agw-required">Address Line 1</label>
        <input type="text" id="agw-addr1" placeholder="Street address" value="${this.formData.vts_address_line_1_garage || ''}">
      </div>
      <div class="agw-field-group">
        <label>Address Line 2</label>
        <input type="text" id="agw-addr2" placeholder="Building, suite, etc." value="${this.formData.vts_address_line_2_garage || ''}">
      </div>
      <div class="agw-field-row">
        <div class="agw-field-group">
          <label>Town / City</label>
          <input type="text" id="agw-addr3" placeholder="Town or city" value="${this.formData.vts_address_line_3_garage || ''}">
        </div>
        <div class="agw-field-group">
          <label>County</label>
          <input type="text" id="agw-addr4" placeholder="County" value="${this.formData.vts_address_line_4_garage || ''}">
        </div>
      </div>
      <div class="agw-field-group" style="max-width: 250px;">
        <label class="agw-required">Postcode</label>
        <input type="text" id="agw-postcode" placeholder="e.g. SW1A 1AA" value="${this.formData.vts_postcode_garage || ''}">
      </div>
    `;
  }

  /* ── Step 3: Operating Hours & Days ─────────────────────── */
  _render_operating() {
    let daysHtml = '';
    AddGarageWizard.DAYS.forEach(d => {
      const checked = this.formData[d.key] ? 'checked' : '';
      daysHtml += `
        <div class="agw-day-toggle ${checked ? 'checked' : ''}" data-day="${d.key}">
          <input type="checkbox" ${checked}>
          <span>${d.label}</span>
        </div>`;
    });

    return `
      <div class="agw-field-group">
        <label>Operating Days</label>
        <div class="agw-days-grid">${daysHtml}</div>
      </div>
      <div class="agw-field-row" style="margin-top: 20px;">
        <div class="agw-field-group">
          <label class="agw-required">Opening Time</label>
          <input type="time" id="agw-hours-start" value="${this.formData.opening_hours_start_garage || '08:00'}">
        </div>
        <div class="agw-field-group">
          <label class="agw-required">Closing Time</label>
          <input type="time" id="agw-hours-end" value="${this.formData.opening_hours_end_garage || '18:00'}">
        </div>
      </div>
    `;
  }

  /* ── Step 4: Bays ───────────────────────────────────────── */
  _render_bays() {
    let baysHtml = '';
    this.bays.forEach((bay, i) => {
      baysHtml += `
        <div class="agw-bay-card" data-bay-index="${i}">
          <div class="agw-bay-num">${i + 1}</div>
          <input type="text" class="agw-bay-name" placeholder="Bay name" value="${bay.name}">
          <input type="number" class="agw-bay-time" placeholder="Mins" value="${bay.timeSegments}" style="max-width: 90px;" min="15" step="15">
          <span style="font-size: 12px; color: #7f8c9b;">min</span>
          ${i > 0 ? '<button class="agw-bay-remove" title="Remove bay"><i class="bi bi-trash"></i></button>' : ''}
        </div>`;
    });

    return `
      <div class="agw-bay-list" id="agw-bay-list">${baysHtml}</div>
      <button class="agw-add-bay-btn" id="agw-add-bay-btn"><i class="bi bi-plus-circle"></i> Add Another Bay</button>
      <div class="agw-hint" style="margin-top: 8px;">Set the default test duration (in minutes) for each bay. You can adjust these later.</div>
    `;
  }

  /* ── Step 5: Consultant & Billing ───────────────────────── */
  _render_consultant() {
    return `
      <div class="agw-field-row">
        <div class="agw-field-group">
          <label>Consultant Name</label>
          <input type="text" id="agw-consultant" value="${this.formData.consultant_name_garage || ''}">
        </div>
        <div class="agw-field-group">
          <label>Lead Consultant</label>
          <input type="text" id="agw-lead-consultant" value="${this.formData.lead_consultant_name_garage || ''}">
        </div>
      </div>
      <div class="agw-field-row-3">
        <div class="agw-field-group">
          <label>Charge Rate</label>
          <input type="text" id="agw-charge-rate" placeholder="e.g. 250" value="${this.formData.charge_rate_garage || ''}">
        </div>
        <div class="agw-field-group">
          <label>Payment Type</label>
          <input type="text" id="agw-payment-type" placeholder="e.g. Monthly" value="${this.formData.payment_type_garage || ''}">
        </div>
        <div class="agw-field-group">
          <label>Package Required</label>
          <input type="text" id="agw-package" placeholder="e.g. Standard" value="${this.formData.package_required_garage || ''}">
        </div>
      </div>
    `;
  }

  /* ── Step 6: Review ─────────────────────────────────────── */
  _render_review() {
    return `<div id="agw-review-content"></div>`;
  }

  _renderReview() {
    const f = this.formData;
    const days = AddGarageWizard.DAYS.filter(d => f[d.key]).map(d => d.label).join(', ') || 'None';
    const baysText = this.bays.map((b, i) => `${b.name} (${b.timeSegments} min)`).join(', ');

    const html = `
      <div class="agw-review-card">
        <h3><i class="bi bi-building"></i> Business Details</h3>
        <div class="agw-review-row"><span class="agw-review-label">Trading Name</span><span class="agw-review-value">${f.trading_name_garage || '—'}</span></div>
        <div class="agw-review-row"><span class="agw-review-label">Contact</span><span class="agw-review-value">${(f.contact_forename_garage || '') + ' ' + (f.contact_surname_garage || '')}</span></div>
        <div class="agw-review-row"><span class="agw-review-label">Phone</span><span class="agw-review-value">${f.contact_main_number_garage || '—'}</span></div>
        <div class="agw-review-row"><span class="agw-review-label">Email</span><span class="agw-review-value">${f.contact_email_garage || '—'}</span></div>
        <div class="agw-review-row"><span class="agw-review-label">VTS Number</span><span class="agw-review-value">${f.vts_site_number_garage || 'Not set'}</span></div>
      </div>
      <div class="agw-review-card">
        <h3><i class="bi bi-geo-alt"></i> Address</h3>
        <div class="agw-review-row"><span class="agw-review-label">Address</span><span class="agw-review-value">${[f.vts_address_line_1_garage, f.vts_address_line_2_garage, f.vts_address_line_3_garage, f.vts_address_line_4_garage].filter(Boolean).join(', ')}</span></div>
        <div class="agw-review-row"><span class="agw-review-label">Postcode</span><span class="agw-review-value">${f.vts_postcode_garage || '—'}</span></div>
      </div>
      <div class="agw-review-card">
        <h3><i class="bi bi-clock"></i> Operating Schedule</h3>
        <div class="agw-review-row"><span class="agw-review-label">Days</span><span class="agw-review-value">${days}</span></div>
        <div class="agw-review-row"><span class="agw-review-label">Hours</span><span class="agw-review-value">${f.opening_hours_start_garage || '—'} – ${f.opening_hours_end_garage || '—'}</span></div>
      </div>
      <div class="agw-review-card">
        <h3><i class="bi bi-columns-gap"></i> Bays</h3>
        <div class="agw-review-row"><span class="agw-review-label">Configured</span><span class="agw-review-value">${baysText}</span></div>
      </div>
      <div class="agw-review-card">
        <h3><i class="bi bi-person-badge"></i> Consultant & Billing</h3>
        <div class="agw-review-row"><span class="agw-review-label">Consultant</span><span class="agw-review-value">${f.consultant_name_garage || '—'}</span></div>
        <div class="agw-review-row"><span class="agw-review-label">Lead Consultant</span><span class="agw-review-value">${f.lead_consultant_name_garage || '—'}</span></div>
        <div class="agw-review-row"><span class="agw-review-label">Charge Rate</span><span class="agw-review-value">${f.charge_rate_garage || '—'}</span></div>
        <div class="agw-review-row"><span class="agw-review-label">Payment Type</span><span class="agw-review-value">${f.payment_type_garage || '—'}</span></div>
        <div class="agw-review-row"><span class="agw-review-label">Package</span><span class="agw-review-value">${f.package_required_garage || '—'}</span></div>
      </div>
    `;
    document.getElementById('agw-review-content').innerHTML = html;
  }

  /* ── Step dots ──────────────────────────────────────────── */
  _renderStepDots() {
    const container = document.getElementById('agw-step-dots');
    let html = '';
    AddGarageWizard.SECTIONS.forEach((_, i) => {
      html += `<div class="agw-step-dot" data-step="${i}"></div>`;
    });
    container.innerHTML = html;
    container.querySelectorAll('.agw-step-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.step);
        if (idx <= this.currentStep) {
          this._saveCurrentStepData();
          this.currentStep = idx;
          if (AddGarageWizard.SECTIONS[idx].id === 'review') this._renderReview();
          this._showStep(idx);
          this._updateProgress();
        }
      });
    });
  }

  _showStep(idx) {
    document.querySelectorAll('.agw-section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById(`agw-section-${idx}`);
    if (section) section.classList.add('active');

    // Update dots
    document.querySelectorAll('.agw-step-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
      dot.classList.toggle('visited', i < idx);
    });

    // Update nav buttons
    const prevBtn = document.getElementById('agw-prev-btn');
    const nextBtn = document.getElementById('agw-next-btn');
    prevBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';

    const isLast = idx === AddGarageWizard.SECTIONS.length - 1;
    if (isLast) {
      nextBtn.innerHTML = '<i class="bi bi-check-circle"></i> Create Garage';
      nextBtn.className = 'agw-nav-btn agw-nav-create';
      nextBtn.onclick = () => this._createGarage();
    } else {
      nextBtn.innerHTML = 'Next <i class="bi bi-chevron-right"></i>';
      nextBtn.className = 'agw-nav-btn agw-nav-next';
      nextBtn.onclick = () => this.nextStep();
    }

    // Re-bind bay events if on bays step
    if (AddGarageWizard.SECTIONS[idx].id === 'bays') {
      this._bindBayEvents();
    }
    // Re-bind day toggle events if on operating step
    if (AddGarageWizard.SECTIONS[idx].id === 'operating') {
      this._bindDayEvents();
    }
  }

  _updateProgress() {
    const pct = Math.round(((this.currentStep) / (AddGarageWizard.SECTIONS.length - 1)) * 100);
    document.getElementById('agw-progress-fill').style.width = pct + '%';
    document.getElementById('agw-progress-section').textContent = `Step ${this.currentStep + 1} of ${AddGarageWizard.SECTIONS.length}`;
    document.getElementById('agw-progress-pct').textContent = pct + '%';
  }

  /* ── Bay events ─────────────────────────────────────────── */
  _bindBayEvents() {
    const addBtn = document.getElementById('agw-add-bay-btn');
    if (addBtn) {
      addBtn.onclick = () => {
        this._saveBayData();
        this.bays.push({ name: `Bay ${this.bays.length + 1}`, timeSegments: 60 });
        this._rerenderBays();
      };
    }
    document.querySelectorAll('.agw-bay-remove').forEach(btn => {
      btn.onclick = (e) => {
        const card = e.target.closest('.agw-bay-card');
        const idx = parseInt(card.dataset.bayIndex);
        this.bays.splice(idx, 1);
        this._rerenderBays();
      };
    });
  }

  _rerenderBays() {
    const section = document.getElementById(`agw-section-3`);
    if (!section) return;
    section.innerHTML = `
      <h2 class="agw-section-title">${AddGarageWizard.SECTIONS[3].title}</h2>
      <p class="agw-section-subtitle">${AddGarageWizard.SECTIONS[3].subtitle}</p>
      ${this._render_bays()}
    `;
    this._bindBayEvents();
  }

  _saveBayData() {
    document.querySelectorAll('.agw-bay-card').forEach((card, i) => {
      const nameInput = card.querySelector('.agw-bay-name');
      const timeInput = card.querySelector('.agw-bay-time');
      if (nameInput && this.bays[i]) {
        this.bays[i].name = nameInput.value || `Bay ${i + 1}`;
        this.bays[i].timeSegments = parseInt(timeInput.value) || 60;
      }
    });
  }

  /* ── Day toggle events ──────────────────────────────────── */
  _bindDayEvents() {
    document.querySelectorAll('.agw-day-toggle').forEach(toggle => {
      toggle.onclick = () => {
        const key = toggle.dataset.day;
        const isChecked = toggle.classList.contains('checked');
        toggle.classList.toggle('checked', !isChecked);
        this.formData[key] = isChecked ? 0 : 1;
      };
    });
  }

  /* ── Save current step data ─────────────────────────────── */
  _saveCurrentStepData() {
    const secId = AddGarageWizard.SECTIONS[this.currentStep].id;

    if (secId === 'business') {
      this.formData.trading_name_garage = (document.getElementById('agw-trading-name') || {}).value || '';
      this.formData.contact_forename_garage = (document.getElementById('agw-contact-forename') || {}).value || '';
      this.formData.contact_surname_garage = (document.getElementById('agw-contact-surname') || {}).value || '';
      this.formData.contact_main_number_garage = (document.getElementById('agw-phone') || {}).value || '';
      this.formData.contact_mobile_number_garage = (document.getElementById('agw-mobile') || {}).value || '';
      this.formData.contact_email_garage = (document.getElementById('agw-email') || {}).value || '';
      this.formData.vts_site_number_garage = (document.getElementById('agw-vts-number') || {}).value || '';
    }
    else if (secId === 'address') {
      this.formData.vts_address_line_1_garage = (document.getElementById('agw-addr1') || {}).value || '';
      this.formData.vts_address_line_2_garage = (document.getElementById('agw-addr2') || {}).value || '';
      this.formData.vts_address_line_3_garage = (document.getElementById('agw-addr3') || {}).value || '';
      this.formData.vts_address_line_4_garage = (document.getElementById('agw-addr4') || {}).value || '';
      this.formData.vts_postcode_garage = (document.getElementById('agw-postcode') || {}).value || '';
    }
    else if (secId === 'operating') {
      this.formData.opening_hours_start_garage = (document.getElementById('agw-hours-start') || {}).value || '08:00';
      this.formData.opening_hours_end_garage = (document.getElementById('agw-hours-end') || {}).value || '18:00';
    }
    else if (secId === 'bays') {
      this._saveBayData();
    }
    else if (secId === 'consultant') {
      this.formData.consultant_name_garage = (document.getElementById('agw-consultant') || {}).value || '';
      this.formData.lead_consultant_name_garage = (document.getElementById('agw-lead-consultant') || {}).value || '';
      this.formData.charge_rate_garage = (document.getElementById('agw-charge-rate') || {}).value || '';
      this.formData.payment_type_garage = (document.getElementById('agw-payment-type') || {}).value || '';
      this.formData.package_required_garage = (document.getElementById('agw-package') || {}).value || '';
    }
  }

  /* ── Validation ─────────────────────────────────────────── */
  _validateCurrentStep() {
    const secId = AddGarageWizard.SECTIONS[this.currentStep].id;
    this._clearErrors();

    if (secId === 'business') {
      let valid = true;
      if (!this._valRequired('agw-trading-name', 'Trading name is required')) valid = false;
      if (!this._valRequired('agw-contact-forename', 'First name is required')) valid = false;
      if (!this._valRequired('agw-contact-surname', 'Last name is required')) valid = false;
      return valid;
    }
    if (secId === 'address') {
      let valid = true;
      if (!this._valRequired('agw-addr1', 'Address is required')) valid = false;
      if (!this._valRequired('agw-postcode', 'Postcode is required')) valid = false;
      return valid;
    }
    if (secId === 'operating') {
      let valid = true;
      if (!this._valRequired('agw-hours-start', 'Opening time is required')) valid = false;
      if (!this._valRequired('agw-hours-end', 'Closing time is required')) valid = false;
      return valid;
    }
    return true;
  }

  _valRequired(id, msg) {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) {
      if (el) {
        el.closest('.agw-field-group').classList.add('agw-field-error');
        const errDiv = document.createElement('div');
        errDiv.className = 'agw-error-msg';
        errDiv.textContent = msg;
        el.closest('.agw-field-group').appendChild(errDiv);
      }
      return false;
    }
    return true;
  }

  _clearErrors() {
    document.querySelectorAll('.agw-field-error').forEach(el => el.classList.remove('agw-field-error'));
    document.querySelectorAll('.agw-error-msg').forEach(el => el.remove());
  }

  /* ── Create the garage ──────────────────────────────────── */
  async _createGarage() {
    const btn = document.getElementById('agw-next-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Creating...';

    const f = this.formData;
    const payload = {
      id: garage_record_next_id,
      trading_name_garage: f.trading_name_garage || '',
      contact_forename_garage: f.contact_forename_garage || '',
      contact_surname_garage: f.contact_surname_garage || '',
      contact_main_number_garage: f.contact_main_number_garage || '',
      contact_mobile_number_garage: f.contact_mobile_number_garage || '',
      contact_email_garage: f.contact_email_garage || '',
      vts_site_number_garage: f.vts_site_number_garage || '',
      vts_address_line_1_garage: f.vts_address_line_1_garage || '',
      vts_address_line_2_garage: f.vts_address_line_2_garage || '',
      vts_address_line_3_garage: f.vts_address_line_3_garage || '',
      vts_address_line_4_garage: f.vts_address_line_4_garage || '',
      vts_postcode_garage: f.vts_postcode_garage || '',
      opening_hours_start_garage: f.opening_hours_start_garage || '08:00',
      opening_hours_end_garage: f.opening_hours_end_garage || '18:00',
      open_on_monday: f.open_on_monday || 0,
      open_on_tuesday: f.open_on_tuesday || 0,
      open_on_wednesday: f.open_on_wednesday || 0,
      open_on_thursday: f.open_on_thursday || 0,
      open_on_friday: f.open_on_friday || 0,
      open_on_saturday: f.open_on_saturday || 0,
      open_on_sunday: f.open_on_sunday || 0,
      consultant_name_garage: f.consultant_name_garage || '',
      lead_consultant_name_garage: f.lead_consultant_name_garage || '',
      charge_rate_garage: f.charge_rate_garage || '',
      payment_type_garage: f.payment_type_garage || '',
      package_required_garage: f.package_required_garage || '',
      create_date: new Date().toISOString().split('T')[0]
    };

    try {
      const result = await this.garageInstance.secureAction('create', 'data_launch_garage_records', null, payload);
      const newId = result.id || garage_record_next_id;
      payload.id = newId;
      garage_record_next_id++;

      // Create bay records
      for (const bay of this.bays) {
        await createRecord('data_launch_bays', {
          garage_id: newId,
          bay_name: bay.name,
          time_segments: bay.timeSegments
        });
      }

      // Update global data
      garageData.push(payload);

      btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Created!';
      btn.style.background = '#27ae60';

      if (this.garageInstance.showCRUDAlert) {
        this.garageInstance.showCRUDAlert('Garage created successfully!', 'success');
      }

      // Close wizard and open the new garage record in full form
      setTimeout(() => {
        this.close();
        btn.disabled = false;
        btn.style.background = '';
        // Navigate to the new garage record
        changePage(null, newId, 'garage');
      }, 800);

    } catch (err) {
      console.error('Garage creation error:', err);
      btn.innerHTML = '<i class="bi bi-x-circle"></i> Error — try again';
      btn.disabled = false;
      btn.style.background = '#e74c3c';
      setTimeout(() => {
        btn.style.background = '';
        btn.innerHTML = '<i class="bi bi-check-circle"></i> Create Garage';
      }, 2000);
    }
  }
}

// Create global instance
const addGarageWizard = new AddGarageWizard();
