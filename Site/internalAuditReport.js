/* ============================================================
   INTERNAL AUDIT REPORT — Consultant activity dashboard
   ============================================================ */

class InternalAuditReport {

  constructor() {
    this.data = null;
    this.selectedConsultant = '';
    this.container = document.getElementById('internalAuditReportPage');
    this._showLoading();
    this._fetchData();
  }

  /* ── Fetch data from server ─────────────────────────────── */
  async _fetchData() {
    try {
      const res = await fetch('/api/internal-audit/consultant-summary');
      if (!res.ok) throw new Error('Failed to fetch');
      this.data = await res.json();
      this._render();
    } catch (err) {
      console.error('Internal audit fetch error:', err);
      this.container.innerHTML = `
        <div class="iar-container">
          <div class="iar-empty">
            <i class="bi bi-exclamation-triangle"></i>
            <p>Unable to load audit data. Please try again later.</p>
          </div>
        </div>`;
    }
  }

  /* ── Get all unique consultant names ────────────────────── */
  _getConsultantNames() {
    const names = new Set();
    (this.data.garages || []).forEach(g => {
      if (g.consultant_name_garage) names.add(g.consultant_name_garage.trim());
      if (g.lead_consultant_name_garage) names.add(g.lead_consultant_name_garage.trim());
    });
    (this.data.audits || []).forEach(a => {
      if (a.consultant) names.add(a.consultant.trim());
    });
    (this.data.qcChecks || []).forEach(q => {
      if (q.consultant) names.add(q.consultant.trim());
    });
    return [...names].filter(Boolean).sort();
  }

  /* ── Filter data for selected consultant ────────────────── */
  _getConsultantData(name) {
    const lowerName = (name || '').toLowerCase();
    const garages = (this.data.garages || []).filter(g =>
      (g.consultant_name_garage || '').toLowerCase() === lowerName ||
      (g.lead_consultant_name_garage || '').toLowerCase() === lowerName
    );
    const garageIds = new Set(garages.map(g => g.id));
    const audits = (this.data.audits || []).filter(a =>
      (a.consultant || '').toLowerCase() === lowerName
    );
    const qcChecks = (this.data.qcChecks || []).filter(q =>
      (q.consultant || '').toLowerCase() === lowerName
    );
    return { garages, garageIds, audits, qcChecks };
  }

  /* ── Score badge helper ─────────────────────────────────── */
  _scoreBadge(score) {
    if (score === null || score === undefined || score === '') return '<span class="iar-score">—</span>';
    const n = parseFloat(score);
    if (n >= 80) return `<span class="iar-score iar-score-good">${n}%</span>`;
    if (n >= 50) return `<span class="iar-score iar-score-ok">${n}%</span>`;
    return `<span class="iar-score iar-score-bad">${n}%</span>`;
  }

  /* ── Days since helper ──────────────────────────────────── */
  _daysSince(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  }

  _flagForDays(days) {
    if (days === null) return '<span class="iar-flag iar-flag-red">No data</span>';
    if (days > 90) return `<span class="iar-flag iar-flag-red"><i class="bi bi-exclamation-triangle-fill"></i> ${days}d ago</span>`;
    if (days > 60) return `<span class="iar-flag iar-flag-amber"><i class="bi bi-exclamation-circle"></i> ${days}d ago</span>`;
    return `<span class="iar-flag iar-flag-green"><i class="bi bi-check-circle"></i> ${days}d ago</span>`;
  }

  _garageNameById(id) {
    const g = (this.data.garages || []).find(g => g.id === id);
    return g ? (g.trading_name_garage || `Garage #${id}`) : `Garage #${id}`;
  }

  /* ── Main render ────────────────────────────────────────── */
  _render() {
    const consultants = this._getConsultantNames();
    const options = consultants.map(n => `<option value="${n}" ${n === this.selectedConsultant ? 'selected' : ''}>${n}</option>`).join('');

    let html = `<div class="iar-container">
      <div class="iar-header">
        <h2><i class="bi bi-graph-up-arrow"></i> Internal Audit Report</h2>
        <select class="iar-consultant-select" id="iar-consultant-select">
          <option value="">All Consultants</option>
          ${options}
        </select>
      </div>
      <div id="iar-content"></div>
    </div>`;

    this.container.innerHTML = html;

    document.getElementById('iar-consultant-select').addEventListener('change', (e) => {
      this.selectedConsultant = e.target.value;
      this._renderContent();
    });

    this._renderContent();
  }

  _renderContent() {
    const contentEl = document.getElementById('iar-content');
    if (!this.selectedConsultant) {
      contentEl.innerHTML = this._renderAllConsultantsOverview();
    } else {
      contentEl.innerHTML = this._renderConsultantDetail(this.selectedConsultant);
    }
  }

  /* ── All consultants overview ────────────────────────────── */
  _renderAllConsultantsOverview() {
    const consultants = this._getConsultantNames();
    if (consultants.length === 0) {
      return `<div class="iar-empty"><i class="bi bi-people"></i><p>No consultant data found.</p></div>`;
    }

    // Build summary rows
    let rows = '';
    consultants.forEach(name => {
      const cd = this._getConsultantData(name);
      const auditCount = cd.audits.length;
      const qcCount = cd.qcChecks.length;
      const avgAuditScore = auditCount > 0
        ? Math.round(cd.audits.reduce((s, a) => s + (parseFloat(a.score_percentage) || 0), 0) / auditCount)
        : null;
      const avgQcScore = qcCount > 0
        ? Math.round(cd.qcChecks.reduce((s, q) => s + (parseFloat(q.score_percentage) || 0), 0) / qcCount)
        : null;

      // Last activity
      const allDates = [
        ...cd.audits.map(a => a.date),
        ...cd.qcChecks.map(q => q.date_of_qc)
      ].filter(Boolean).sort().reverse();
      const lastActivity = allDates[0] || null;
      const daysSince = this._daysSince(lastActivity);

      // Revenue estimate
      const totalCharge = cd.garages.reduce((s, g) => s + (parseFloat(g.charge_rate_garage) || 0), 0);

      rows += `
        <tr style="cursor: pointer;" data-consultant="${name}">
          <td><strong>${name}</strong></td>
          <td>${cd.garages.length}</td>
          <td>${auditCount}</td>
          <td>${this._scoreBadge(avgAuditScore)}</td>
          <td>${qcCount}</td>
          <td>${this._scoreBadge(avgQcScore)}</td>
          <td>${this._flagForDays(daysSince)}</td>
          <td>${totalCharge ? '£' + totalCharge.toFixed(0) : '—'}</td>
        </tr>`;
    });

    const html = `
      <div class="iar-section">
        <h3><i class="bi bi-people"></i> Consultant Overview</h3>
        <table class="iar-table">
          <thead>
            <tr>
              <th>Consultant</th>
              <th>Garages</th>
              <th>Audits</th>
              <th>Avg Audit Score</th>
              <th>QC Checks</th>
              <th>Avg QC Score</th>
              <th>Last Activity</th>
              <th>Est. Revenue</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;

    // Bind row clicks after render
    setTimeout(() => {
      document.querySelectorAll('#iar-content tr[data-consultant]').forEach(row => {
        row.addEventListener('click', () => {
          this.selectedConsultant = row.dataset.consultant;
          document.getElementById('iar-consultant-select').value = this.selectedConsultant;
          this._renderContent();
        });
      });
    }, 0);

    return html;
  }

  /* ── Single consultant detail ───────────────────────────── */
  _renderConsultantDetail(name) {
    const cd = this._getConsultantData(name);
    const auditCount = cd.audits.length;
    const qcCount = cd.qcChecks.length;
    const avgAuditScore = auditCount > 0
      ? Math.round(cd.audits.reduce((s, a) => s + (parseFloat(a.score_percentage) || 0), 0) / auditCount)
      : null;
    const avgQcScore = qcCount > 0
      ? Math.round(cd.qcChecks.reduce((s, q) => s + (parseFloat(q.score_percentage) || 0), 0) / qcCount)
      : null;
    const totalCharge = cd.garages.reduce((s, g) => s + (parseFloat(g.charge_rate_garage) || 0), 0);

    // All dates for last activity
    const allDates = [
      ...cd.audits.map(a => a.date),
      ...cd.qcChecks.map(q => q.date_of_qc)
    ].filter(Boolean).sort().reverse();
    const lastActivity = allDates[0] || null;

    // Red flags: garages with no audit in 90+ days
    const garagesOverdue = cd.garages.filter(g => {
      const garageAudits = cd.audits.filter(a => a.garage_id === g.id);
      if (garageAudits.length === 0) return true;
      const latest = garageAudits.map(a => a.date).filter(Boolean).sort().reverse()[0];
      return this._daysSince(latest) > 90;
    });

    let html = '';

    // Overview cards
    html += `
      <div class="iar-overview-row">
        <div class="iar-stat-card">
          <div class="iar-stat-label">Garages Assigned</div>
          <div class="iar-stat-value">${cd.garages.length}</div>
        </div>
        <div class="iar-stat-card">
          <div class="iar-stat-label">Site Audits</div>
          <div class="iar-stat-value">${auditCount}</div>
          <div class="iar-stat-sub">${avgAuditScore !== null ? 'Avg score: ' + avgAuditScore + '%' : 'No audits yet'}</div>
        </div>
        <div class="iar-stat-card">
          <div class="iar-stat-label">QC Checks</div>
          <div class="iar-stat-value">${qcCount}</div>
          <div class="iar-stat-sub">${avgQcScore !== null ? 'Avg score: ' + avgQcScore + '%' : 'No QC checks yet'}</div>
        </div>
        <div class="iar-stat-card iar-stat-revenue">
          <div class="iar-stat-label">Est. Revenue</div>
          <div class="iar-stat-value">${totalCharge ? '£' + totalCharge.toFixed(0) : '—'}</div>
          <div class="iar-stat-sub">Sum of charge rates</div>
        </div>
        <div class="iar-stat-card ${garagesOverdue.length > 0 ? 'iar-stat-alert' : ''}">
          <div class="iar-stat-label">Overdue Garages</div>
          <div class="iar-stat-value">${garagesOverdue.length}</div>
          <div class="iar-stat-sub">${garagesOverdue.length > 0 ? '90+ days since last audit' : 'All up to date'}</div>
        </div>
      </div>`;

    // Garage portfolio
    html += `<div class="iar-section"><h3><i class="bi bi-building"></i> Garage Portfolio</h3>`;
    if (cd.garages.length === 0) {
      html += `<p style="color: #9ca3af;">No garages assigned.</p>`;
    } else {
      html += `<table class="iar-table"><thead><tr>
        <th>Garage</th><th>VTS</th><th>Postcode</th><th>Charge Rate</th><th>Last Audit</th><th>Last Audit Score</th><th>Status</th>
      </tr></thead><tbody>`;
      cd.garages.forEach(g => {
        const garageAudits = cd.audits.filter(a => a.garage_id === g.id).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        const lastAudit = garageAudits[0];
        const lastAuditDate = lastAudit ? lastAudit.date : null;
        const lastAuditScore = lastAudit ? lastAudit.score_percentage : null;
        const days = this._daysSince(lastAuditDate);
        html += `<tr>
          <td><strong>${g.trading_name_garage || '—'}</strong></td>
          <td>${g.vts_site_number_garage || '—'}</td>
          <td>${g.vts_postcode_garage || '—'}</td>
          <td>${g.charge_rate_garage ? '£' + g.charge_rate_garage : '—'}</td>
          <td>${lastAuditDate || 'Never'}</td>
          <td>${this._scoreBadge(lastAuditScore)}</td>
          <td>${this._flagForDays(days)}</td>
        </tr>`;
      });
      html += `</tbody></table>`;
    }
    html += `</div>`;

    // Site audit history
    html += `<div class="iar-section"><h3><i class="bi bi-clipboard-check"></i> Site Audit History</h3>`;
    const sortedAudits = [...cd.audits].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    if (sortedAudits.length === 0) {
      html += `<p style="color: #9ca3af;">No site audits found.</p>`;
    } else {
      html += `<table class="iar-table"><thead><tr>
        <th>Garage</th><th>Date</th><th>Type</th><th>Score</th><th>Auditor</th><th>Findings</th>
      </tr></thead><tbody>`;
      sortedAudits.forEach(a => {
        const findings = (a.site_audit_findings || a.notes || '').substring(0, 80);
        html += `<tr>
          <td>${this._garageNameById(a.garage_id)}</td>
          <td>${a.date || '—'}</td>
          <td>${(a.audit_type || '—').replace(/_/g, ' ')}</td>
          <td>${this._scoreBadge(a.score_percentage)}</td>
          <td>${a.auditor || '—'}</td>
          <td>${findings ? findings + (findings.length >= 80 ? '...' : '') : '—'}</td>
        </tr>`;
      });
      html += `</tbody></table>`;
    }
    html += `</div>`;

    // QC check history
    html += `<div class="iar-section"><h3><i class="bi bi-shield-check"></i> QC Check History</h3>`;
    const sortedQc = [...cd.qcChecks].sort((a, b) => (b.date_of_qc || '').localeCompare(a.date_of_qc || ''));
    if (sortedQc.length === 0) {
      html += `<p style="color: #9ca3af;">No QC checks found.</p>`;
    } else {
      html += `<table class="iar-table"><thead><tr>
        <th>Garage</th><th>Date</th><th>Tester</th><th>Vehicle</th><th>Type</th><th>Score</th>
      </tr></thead><tbody>`;
      sortedQc.forEach(q => {
        html += `<tr>
          <td>${this._garageNameById(q.garage_id)}</td>
          <td>${q.date_of_qc || '—'}</td>
          <td>${q.tester_name || '—'}</td>
          <td>${q.vehicle_reg || '—'}</td>
          <td>${(q.qc_type || '—').replace(/_/g, ' ')}</td>
          <td>${this._scoreBadge(q.score_percentage)}</td>
        </tr>`;
      });
      html += `</tbody></table>`;
    }
    html += `</div>`;

    return html;
  }

  /* ── Loading state ──────────────────────────────────────── */
  _showLoading() {
    this.container.innerHTML = `
      <div class="iar-container">
        <div class="iar-loading">
          <i class="bi bi-hourglass-split" style="font-size: 32px;"></i>
          <p>Loading audit data...</p>
        </div>
      </div>`;
  }
}
