class MOTReconciliation {
    constructor(data, garageId, allTheGarageBookingsData) {
        this.dvsaReport= [];
        this.redValues = [];
        this.bookingReport = [];
        this.recordHasBeenChanged = false;
        this.bookingReportMounted = false;
        this.dvsaReportMounted = false;
        this.exportRow = 0;
        this.fileNumber1Provided = false;
        this.tableHeaders = [];
        this.selectedBookingReport;
        this.selectedDvsaReport;
        this.usingExistingBookingsFromTheSystem = false
        this.existingBookingsFromTheSystemIDS = [];
        this.reconciliationFile = null;
        this.boundPageClickHandler = null;
        if (allTheGarageBookingsData) {
            this.allTheGarageBookingsData = allTheGarageBookingsData
        }
        if (data) {
            this.renderPage(data, garageId, allTheGarageBookingsData)
        }
        else {
            this.renderPage()
        }        
        document.getElementById('data-launch-side-bar').classList.remove('data-launch-activate-menu')
        this.addListeners()
    }
    updateInputStateUI () {
        const bookingSourceEl = document.getElementById('mot-rec-booking-source');
        const dvsaStateEl = document.getElementById('mot-rec-dvsa-state');
        const readyEl = document.getElementById('mot-rec-ready-state');
        if (!bookingSourceEl || !dvsaStateEl || !readyEl) return;

        const usingSystemBookings = this.usingExistingBookingsFromTheSystem === true || Number(this.data?.using_data_launch_booking_data) === 1;
        const bookingRowsFromArray = Math.max(0, (this.bookingReport?.length || 0) - 1);
        const bookingRowsFromSavedIds = usingSystemBookings ? (this.existingBookingsFromTheSystemIDS?.length || 0) : 0;
        const bookingRows = bookingRowsFromArray > 0 ? bookingRowsFromArray : bookingRowsFromSavedIds;
        const dvsaRows = Math.max(0, (this.dvsaReport?.length || 0) - 1);

        if (usingSystemBookings) {
            bookingSourceEl.textContent = bookingRows > 0
                ? `Booking source: System bookings loaded (${bookingRows} rows)`
                : 'Booking source: System bookings selected';
        } else if (bookingRows > 0) {
            bookingSourceEl.textContent = `Booking source: Uploaded booking report (${bookingRows} rows)`;
        } else {
            bookingSourceEl.textContent = 'Booking source: Not loaded';
        }

        dvsaStateEl.textContent = dvsaRows > 0
            ? `DVSA log loaded (${dvsaRows} rows)`
            : 'DVSA log: Not loaded';

        const isReadyToCompare = bookingRows > 0 && dvsaRows > 0;
        readyEl.textContent = isReadyToCompare
            ? 'Ready to reconcile'
            : 'Waiting for both booking source and DVSA log';
        readyEl.classList.toggle('mot-rec-input-state-pill--ready', isReadyToCompare);
        readyEl.classList.toggle('mot-rec-input-state-pill--waiting', !isReadyToCompare);
    }
    dataTransformation () {
        for (let i = 1; i < this.dvsaReport.length; i++) {

            for (let key in this.dvsaReport[i]) {
                if (this.dvsaReport[i][key] === undefined || this.dvsaReport[i][key] === 'undefined' || this.dvsaReport[i][key] === null) {
                    this.dvsaReport[i][key] = ''; // Replace undefined/null with an empty string
                }
            }
    
            let durationValue = this.dvsaReport[i].M;

            if (typeof durationValue === "string") {
                // If the value is already in "hh:mm:ss" format, do nothing
                if (/^\d{2}:\d{2}:\d{2}$/.test(durationValue)) {
                    continue;
                }
    
                // If the value is empty or not a number, default to "00:00:00"
                if (!durationValue || isNaN(durationValue)) {
                    this.dvsaReport[i].M = "00:00:00";
                    continue;
                }
            }
    
            let totalSeconds = this.dvsaReport[i].M * 24 * 60 * 60; // Convert fraction of day to total seconds
            let hours = Math.floor(totalSeconds / 3600); // Get hours
            let minutes = Math.floor((totalSeconds % 3600) / 60); // Get remaining minutes
            let seconds = Math.round(totalSeconds % 60); // Get remaining seconds
            this.dvsaReport[i].M = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`


            /// convert the serial date/time field to something recognisable
            let baseDate = new Date('1900-01-01T00:00:00Z');
        
            // Add the number of days (integer part of the serial number) to the base date
            const days = Math.floor(this.dvsaReport[i].B);
            baseDate.setDate(baseDate.getDate() + days);
            
            // Get the time from the fractional part
            const fraction = this.dvsaReport[i].B - days;
            const timeInMilliseconds = fraction * 24 * 60 * 60 * 1000; // Convert fraction of the day to milliseconds
            
            // Add the time (in milliseconds) to the date
            baseDate.setTime(baseDate.getTime() + timeInMilliseconds);
            
            // Format the date in a readable string (e.g., 'MM/DD/YYYY HH:mm:ss')
            // this.dvsaReport[i].B = baseDate.toLocaleString(); // You can customize the format if needed
            this.dvsaReport[i].B = baseDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        }
        this.renderHTML(this.dvsaReport)
    }
    normalizeReg(val) {
        return String(val || '').toUpperCase().replace(/\s+/g, '');
    }
    parseDurationToSeconds(duration) {
        const raw = String(duration || '').trim();
        const parts = raw.split(':').map(Number);
        if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
        return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    }
    getBookingIdsFromRecord() {
        const rawIds = this.data?.data_launch_booking_data_ids;
        if (!rawIds) return [];
        if (Array.isArray(rawIds)) return rawIds.map(id => parseInt(id, 10)).filter(Number.isFinite);
        if (typeof rawIds === 'string') {
            try {
                const parsed = JSON.parse(rawIds);
                if (Array.isArray(parsed)) return parsed.map(id => parseInt(id, 10)).filter(Number.isFinite);
            } catch (e) {
                console.error('Invalid data_launch_booking_data_ids JSON:', rawIds);
            }
        }
        return [];
    }   
    runQuery () {
        let bookingsHTML = ``;
        let missingBookingsFromDVSAReport = [];
        const stats = { matched: 0, review: 0, unmatched: 0, unmatchedBooking: 0 };
        const regCellCache = new Map();
        const vinCellCache = new Map();
        const getRegCells = (reg) => {
            const key = `regNumber_${reg}`;
            if (!regCellCache.has(key)) {
                regCellCache.set(key, Array.from(document.getElementsByClassName(key)));
            }
            return regCellCache.get(key);
        };
        const getVinCells = (vin) => {
            const key = `vinNumber_${vin}`;
            if (!vinCellCache.has(key)) {
                vinCellCache.set(key, Array.from(document.getElementsByClassName(key)));
            }
            return vinCellCache.get(key);
        };

        if (Number(this.data.using_data_launch_booking_data) === 1) {
            this.bookingReport = [{A:'mot_booking_date', B: 'vehicle_reg', C: 'vin'}];
            const selectedBookingIds = new Set(this.getBookingIdsFromRecord());
            if (selectedBookingIds.size > 0 && Array.isArray(this.allTheGarageBookingsData)) {
                for (let i = 0; i < this.allTheGarageBookingsData.length; i++) {
                    if (selectedBookingIds.has(parseInt(this.allTheGarageBookingsData[i].id, 10))) {
                        let formattedDate = this.formatDate(this.allTheGarageBookingsData[i].booking_date);
                        this.bookingReport.push({
                            A: formattedDate,
                            B: this.allTheGarageBookingsData[i].vehicle_reg || '',
                            C: this.allTheGarageBookingsData[i].vehicle_vin || ''
                        });
                    }
                }
                if (this.bookingReport.length > 1) {
                    document.getElementById("data-launch-existing-bookings-tick-element")?.classList.remove('data-launch-inactive');
                    this.showCRUDAlert('Successfully Retrieved Booking Records', 'success');
                } else {
                    this.showCRUDAlert('Error retrieving booking records \n Please contact your administrator ', 'error');
                }
            }
        }

        const bookingRegs = new Set();
        const bookingVins = new Set();
        for (let t = 1; t < this.bookingReport.length; t++) {
            this.bookingReport[t].match = false;
            bookingRegs.add(this.normalizeReg(this.bookingReport[t].B));
            if (this.bookingReport[t].C) bookingVins.add(String(this.bookingReport[t].C).trim());
        }

        for (let i = 1; i < this.dvsaReport.length; i++) {
            const row = this.dvsaReport[i];
            if (!row) continue;
            row.match = false;
            row.matchStatus = 'unmatched';
            row.matchReason = 'No booking match';

            const durationSeconds = this.parseDurationToSeconds(row.M);
            const isNormalShort = row.J === 'Normal Test' && durationSeconds !== null && durationSeconds < (25 * 60);
            const isRetestShort = row.J === 'Re-Test' && durationSeconds !== null && durationSeconds < (3 * 60);
            const hasIpMismatch = String(row.T || '').trim() !== String(row.U || '').trim();

            if (isNormalShort || isRetestShort) {
                row.match = true;
                row.matchStatus = 'review';
                row.matchReason = 'Short duration';
            }
            if (hasIpMismatch) {
                row.match = true;
                row.matchStatus = 'review';
                row.matchReason = 'IP mismatch';
            }

            const regMatch = bookingRegs.has(this.normalizeReg(row.D));
            const vinMatch = row.E && bookingVins.has(String(row.E).trim());
            if (regMatch || vinMatch) {
                row.match = true;
                row.matchStatus = 'matched';
                row.matchReason = regMatch && vinMatch ? 'Reg+VIN match' : (regMatch ? 'Reg match' : 'VIN match');
            }

            const rowEls = getRegCells(row.D);
            rowEls.forEach((el) => {
                if (row.matchStatus === 'matched') {
                    el.style.backgroundColor = '#75b798';
                } else if (row.matchStatus === 'review') {
                    el.style.backgroundColor = '#ffbf00';
                } else {
                    el.style.backgroundColor = 'red';
                }
            });

            const vinEls = getVinCells(row.E);
            vinEls.forEach((el) => {
                if (row.matchStatus === 'matched') {
                    el.style.backgroundColor = '#75b798';
                } else if (row.matchStatus === 'review') {
                    el.style.backgroundColor = hasIpMismatch ? '#ADD8E6' : '#ffbf00';
                } else {
                    el.style.backgroundColor = 'red';
                }
            });

            const rowContainer = document.querySelector(`#reconciliationTableBody tr.data-row[data-export-row="${i - 1}"]`);
            if (rowContainer) {
                rowContainer.dataset.matchStatus = row.matchStatus;
                rowContainer.dataset.matchReason = row.matchReason;
                rowContainer.classList.remove('mot-rec-row--matched', 'mot-rec-row--review', 'mot-rec-row--unmatched');
                rowContainer.classList.add(`mot-rec-row--${row.matchStatus}`);
                const statusCell = rowContainer.querySelector('.mot-rec-status-cell');
                const reasonCell = rowContainer.querySelector('.mot-rec-reason-cell');
                if (statusCell) {
                    const statusText = row.matchStatus === 'matched'
                        ? 'Matched'
                        : row.matchStatus === 'review'
                            ? 'Needs Review'
                            : 'Missing From Diary';
                    statusCell.textContent = statusText;
                    statusCell.setAttribute('data-export-val', statusText);
                    statusCell.classList.remove('status-matched', 'status-review', 'status-unmatched');
                    statusCell.classList.add(`status-${row.matchStatus}`);
                }
                if (reasonCell) {
                    reasonCell.textContent = row.matchReason || '';
                    reasonCell.setAttribute('data-export-val', row.matchReason || '');
                }
            }

            if (!row.match) {
                const missingAlertEl = document.getElementById(`${row.D}_${row.E}_missingFromAlert`);
                if (missingAlertEl) {
                    missingAlertEl.innerHTML = 'Missing from Booking Diary';
                }
                this.redValues.push(`regNumber_${row.D}`);
            }
            if (row.matchStatus === 'matched') stats.matched++;
            else if (row.matchStatus === 'review') stats.review++;
            else stats.unmatched++;
        }

        for (let t = 1; t < this.bookingReport.length; t++) {
            const bReg = this.normalizeReg(this.bookingReport[t].B);
            const bVin = String(this.bookingReport[t].C || '').trim();
            for (let i = 1; i < this.dvsaReport.length; i++) {
                const row = this.dvsaReport[i];
                if (!row) continue;
                if (this.normalizeReg(row.D) === bReg || (bVin && String(row.E || '').trim() === bVin)) {
                    this.bookingReport[t].match = true;
                    break;
                }
            }
            if (this.bookingReport[t].match === false) {
                missingBookingsFromDVSAReport.push(this.bookingReport[t]);
                let data = this.tableHeaders;
                bookingsHTML += `<tr class="export-row data-row mot-rec-row--unmatched-booking" data-match-status="unmatched-booking" data-export-row="${this.exportRow}">
                                <td class="export-record" data-export-header="${data[0].A}" style="background-color: red"  data-export-row="${this.exportRow}" data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].B}" style="background-color: red"  data-export-row="${this.exportRow}" data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].C}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].D}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].E}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val="${this.bookingReport[t].A}">${this.bookingReport[t].A}</td>
                                <td class="export-record" data-export-header="${data[0].F}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].G}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val="${this.bookingReport[t].B}">${this.bookingReport[t].B}</td>
                                <td class="export-record" data-export-header="${data[0].H}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val="${this.bookingReport[t].C}">${this.bookingReport[t].C}<h2>This is missing from the DVSA Report</h2></td>
                                <td class="export-record" data-export-header="${data[0].I}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].J}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].K}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].L}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].M}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].N}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].O}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].P}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].Q}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].R}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].S}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].T}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].U}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].V}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].W}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].X}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].Y}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].Z}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].AA}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].AB}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="export-record" data-export-header="${data[0].AC}" style="background-color: red"  data-export-row="${this.exportRow}"  data-export-val=""></td>
                                <td class="mot-rec-status-cell export-record status-unmatched-booking" data-export-header="Reconciliation Status" data-export-row="${this.exportRow}" data-export-val="Missing From DVSA">Missing From DVSA</td>
                                <td class="mot-rec-reason-cell export-record" data-export-header="Reason" data-export-row="${this.exportRow}" data-export-val="Booking found in system but not in DVSA log">Booking found in system but not in DVSA log</td>
                            </tr>`;
                this.exportRow++;
                stats.unmatchedBooking++;
            }
        }

        const tbody = document.getElementById('reconciliationTableBody');
        if (tbody) {
            tbody.innerHTML += bookingsHTML;
        }
        const setCount = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = String(value);
        };
        setCount('mot-rec-matched-count', stats.matched);
        setCount('mot-rec-review-count', stats.review);
        setCount('mot-rec-unmatched-count', stats.unmatched);
        setCount('mot-rec-unmatched-booking-count', stats.unmatchedBooking);
        this.updateInputStateUI();

        if (Number(this.data.status) === 1) {
            document.getElementById('data-launch-mot-reconciliation-save-button')?.classList.add('data-launch-inactive');
            document.getElementById('data-launch-mot-reconciliation-submit-button')?.classList.add('data-launch-inactive');
        }
    }    
    // onlyShowRed () {
    //     let x = Array.from(document.getElementsByClassName('data-row'))
    //     x.forEach(el => {
    //         el.classList.add('data-launch-inactive')
    //     })
    //     for (let i = 0; i < this.redValues.length; i++) {
    //         let y = Array.from(document.getElementsByClassName(`${this.redValues[i]}_row`))
    //         y.forEach(el => {
    //             el.classList.remove('data-launch-inactive')
    //         })       
    //     }    
    // }
    onlyShowRed() {
        const rows = document.querySelectorAll('.data-row');
        rows.forEach(row => {
            const status = String(row.dataset.matchStatus || '').toLowerCase();
            const statusCell = row.querySelector('.mot-rec-status-cell');
            const statusText = String(statusCell?.textContent || '').toLowerCase();
            const reasonCell = row.querySelector('.mot-rec-reason-cell');
            const reasonText = String(reasonCell?.textContent || '').toLowerCase();
            const rowText = String(row.textContent || '').toLowerCase();

            let keepRow =
                status === 'unmatched' ||
                status === 'unmatched-booking' ||
                row.classList.contains('mot-rec-row--unmatched') ||
                row.classList.contains('mot-rec-row--unmatched-booking') ||
                statusText.includes('missing from') ||
                reasonText.includes('missing') ||
                rowText.includes('missing from booking diary') ||
                rowText.includes('missing from dvsa');

            // Fallback for older saved tables with no status metadata.
            if (!keepRow) {
                row.querySelectorAll('td').forEach(cell => {
                    const bg = window.getComputedStyle(cell).backgroundColor;
                    if (
                        bg === 'rgb(255, 0, 0)' ||
                        bg === 'rgb(255, 241, 243)' ||
                        bg === 'rgb(254, 242, 242)'
                    ) {
                        keepRow = true;
                    }
                });
            }
            if (keepRow) {
                row.classList.remove('data-launch-inactive');
            } else {
                row.classList.add('data-launch-inactive');
            }
        });
    }

    showAll () {
        let x = Array.from(document.getElementsByClassName('data-row'))
        x.forEach(el => {
            el.classList.remove('data-launch-inactive')
        })
    }
    excelSerialToJSDate(serial) {
        let excelStart = new Date(1899, 11, 30); // Excel thinks 1900 was a leap year, so adjust
        let millisecondsPerDay = 24 * 60 * 60 * 1000;
        return new Date(excelStart.getTime() + serial * millisecondsPerDay).toLocaleDateString('en-GB');
    }
    normalizeHeaderName(val) {
        return String(val || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');
    }
    getDvsaSchema() {
        return [
            { key: 'A', label: 'Site Number', aliases: ['sitenumber', 'site'] },
            { key: 'B', label: 'Test date/time', aliases: ['testdatetime', 'testdate', 'testdateandtime'] },
            { key: 'C', label: 'Test Number', aliases: ['testnumber'] },
            { key: 'D', label: 'Registration', aliases: ['registration', 'vehicleregistration', 'vehiclereg'] },
            { key: 'E', label: 'VIN', aliases: ['vin', 'vehiclevin'] },
            { key: 'F', label: 'Make', aliases: ['make', 'vehiclemake'] },
            { key: 'G', label: 'Model', aliases: ['model', 'vehiclemodel'] },
            { key: 'H', label: 'Class', aliases: ['class', 'vehicleclass'] },
            { key: 'I', label: 'User Id', aliases: ['userid', 'testerid', 'user'] },
            { key: 'J', label: 'Test type', aliases: ['testtype'] },
            { key: 'K', label: 'Result', aliases: ['result', 'testresult'] },
            { key: 'L', label: 'Reason for aborting', aliases: ['reasonforaborting', 'abortreason'] },
            { key: 'M', label: 'Test Duration', aliases: ['testduration', 'duration'] },
            { key: 'N', label: 'Tester who recorded test', aliases: ['testerwhorecordedtest', 'testerwhorecordedcttest'] },
            { key: 'O', label: 'Date/time of recording CT test', aliases: ['datetimeofrecordingcttest', 'recordingcttestdatetime'] },
            { key: 'P', label: 'Contingency Test Reason', aliases: ['contingencytestreason'] },
            { key: 'Q', label: 'Contingency Code', aliases: ['contingencycode'] },
            { key: 'R', label: 'Login type at start', aliases: ['logintypeatstart'] },
            { key: 'S', label: 'Login type at completion', aliases: ['logintypeatcompletion'] },
            { key: 'T', label: 'Client IP address at start', aliases: ['clientipaddressatstart', 'ipstart'] },
            { key: 'U', label: 'Client IP address at completion', aliases: ['clientipaddressatcompletion', 'ipcompletion'] },
            { key: 'V', label: 'Browser agent at start', aliases: ['browseragentatstart'] },
            { key: 'W', label: 'Browser agent at completion', aliases: ['browseragentatcompletion'] },
            { key: 'X', label: 'Cookie code at start', aliases: ['cookiecodeatstart'] },
            { key: 'Y', label: 'Cookie code at completion', aliases: ['cookiecodeatcompletion'] },
            { key: 'Z', label: 'Brake Test Type', aliases: ['braketesttype'] },
            { key: 'AA', label: 'Entry Type', aliases: ['entrytype'] },
            { key: 'AB', label: 'Emissions Type', aliases: ['emissionstype', 'emissiontype'] },
            { key: 'AC', label: 'Entry Type', aliases: ['entrytype2', 'entrytypeb'] }
        ];
    }
    getBookingSchema() {
        return [
            { key: 'A', label: 'mot_booking_date', aliases: ['motbookingdate', 'bookingdate', 'date'] },
            { key: 'B', label: 'vehicle_reg', aliases: ['vehiclereg', 'registration', 'vehicleregistration'] },
            { key: 'C', label: 'vin', aliases: ['vin', 'vehiclevin'] }
        ];
    }
    scoreSheetAgainstSchema(rows, schema) {
        if (!rows || rows.length === 0) return 0;
        const headerRow = rows[0] || {};
        let score = 0;
        Object.keys(headerRow).forEach((col) => {
            if (col === '__rowNum__') return;
            const normalized = this.normalizeHeaderName(headerRow[col]);
            if (!normalized) return;
            const match = schema.find((item) => item.aliases.includes(normalized));
            if (match) score++;
        });
        return score;
    }
    pickBestSheet(workbook, schema) {
        let best = { score: -1, rows: [], sheetName: '' };
        workbook.SheetNames.forEach((sheetName) => {
            const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false, defval: '', header: 'A' });
            const score = this.scoreSheetAgainstSchema(rows, schema);
            if (score > best.score) {
                best = { score, rows, sheetName };
            }
        });
        return best;
    }
    mapRowsBySchema(rows, schema) {
        const headerRow = rows[0] || {};
        const canonicalToColumn = {};
        Object.keys(headerRow).forEach((col) => {
            if (col === '__rowNum__') return;
            const normalized = this.normalizeHeaderName(headerRow[col]);
            const match = schema.find((item) => item.aliases.includes(normalized));
            if (match && !canonicalToColumn[match.key]) {
                canonicalToColumn[match.key] = col;
            }
        });

        const output = [];
        const outHeader = {};
        schema.forEach((item) => {
            outHeader[item.key] = item.label;
        });
        output.push(outHeader);

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i] || {};
            const mappedRow = {};
            schema.forEach((item) => {
                const sourceCol = canonicalToColumn[item.key];
                let value = sourceCol ? row[sourceCol] : '';
                if (value === undefined || value === null) value = '';
                mappedRow[item.key] = value;
            });
            output.push(mappedRow);
        }

        return {
            mappedRows: output,
            mappedFieldCount: Object.keys(canonicalToColumn).length
        };
    }
    parseExcel (file, num) {
        var reader = new FileReader();
        reader.onload = (e) => {
          var data = e.target.result;
          var workbook = XLSX.read(data, {
              type: 'binary',
              cellDates: true,
              raw: false,
              dateNF: 'yyyy-mm-dd hh:mm:ss'
          });

          const targetIsBooking = num === '1';
          const schema = targetIsBooking ? this.getBookingSchema() : this.getDvsaSchema();
          const threshold = targetIsBooking ? 2 : 8;
          const picked = this.pickBestSheet(workbook, schema);

          if (!picked.rows || picked.rows.length === 0) {
              this.showCRUDAlert('Uploaded file appears empty.', 'error');
              return;
          }

          const mapped = this.mapRowsBySchema(picked.rows, schema);
          if (mapped.mappedFieldCount < threshold) {
              this.showCRUDAlert(
                  `Could not identify a valid ${targetIsBooking ? 'Booking' : 'DVSA'} sheet. Please check headers.`,
                  'error'
              );
              return;
          }

          if (targetIsBooking) {
              this.bookingReportMounted = true;
              this.bookingReport = mapped.mappedRows;
              this.bookingReport.forEach((row) => {
                  if (!isNaN(row.A)) {
                      row.A = this.excelSerialToJSDate(row.A);
                  }
              });
              document.getElementById("data-launch-booking-report-tick-element").classList.remove('data-launch-inactive');
              document.getElementById("bookingReportFileName").innerHTML = `${file.name} (${picked.sheetName})`;
              if (document.getElementById('data-launch-upload-file-2-initial-wizard-button')) {
                  document.getElementById('data-launch-upload-file-2-initial-wizard-button').classList.remove('not-ready-yet');
              }
          } else {
              this.dvsaReport = mapped.mappedRows;
              this.dvsaReport.forEach((row) => {
                  if (!isNaN(row.B)) {
                      row.B = this.excelSerialToJSDate(row.B);
                  }
              });
              this.dvsaReportMounted = true;
              document.getElementById("data-launch-dvsa-report-tick-element").classList.remove('data-launch-inactive');
              document.getElementById("dvsaReportFileName").innerHTML = `${file.name} (${picked.sheetName})`;
          }

          if (this.dvsaReportMounted === true) {
              this.dataTransformation();
          }
          this.updateInputStateUI();
        };
  
        reader.onerror = function(ex) {
          console.error(ex);
        };
  
        reader.readAsBinaryString(file);
      }; // end parseExcel
    ExcelToJSON () {        
        var objMyObject = function(row) {
          this.colA = row.A;
          this.colB = row.B;
          this.colC = row.C;
          this.colD = row.D;
          this.colE = row.E;
          this.colF = row.F;
          this.colG = row.G;
        };
    };
    renderPage(data, garageId, allTheGarageBookingsData, params) {
        if (params) {
            if (params.removePreviousFile) {
                this.reconciliationFile = null
            }
        }
        if (data) {
            this.data = data
            this.garageId = garageId
            this.allTheGarageBookingsData = allTheGarageBookingsData
            this.dvsaReport = []
            this.bookingReport = []
            this.redValues = []
            this.bookingReportMounted = false
            this.dvsaReportMounted = false
            this.usingExistingBookingsFromTheSystem = this.data.using_data_launch_booking_data === 1
            this.existingBookingsFromTheSystemIDS = this.getBookingIdsFromRecord()
        }
        let html = `
        <div class='container-fluid mot-rec-page'>
            <div class="data-launch-crud-security-alert" id="data-launch-crud-alert-box-mot-reconciliations">
                <div class="data-launch-crud-security-alert__icon" id="data-launch-crud-alert-icon-mot-reconciliations"></div>
                <div class="data-launch-crud-security-alert__message" id="data-launch-crud-alert-message-mot-reconciliations"></div>
            </div>
            <button type="button" id="data-launch-mot-reconciliation-back-to-garage-view" class="btn btn-outline-primary btn-primary data-launch-mot-reconciliation-back-to-garage-view"><i class="bi bi-arrow-left"></i> Back To Garage</button>
            <div class='data-launch-mot-reconciliation-header-tick-containers'>
                <div class='data-launch-booking-report-tick-container' id='data-launch-booking-report-tick-container'>
                    <i id="data-launch-booking-report-tick-element" class="bi bi-check-circle data-launch-inactive"></i>
                    <h4 id="bookingReportFileName">Booking Report</h4>
                </div>
                 <div class='data-launch-booking-report-tick-container' id='data-launch-existing-bookings-tick-container'>
                    <i id="data-launch-existing-bookings-tick-element" class="bi bi-check-circle data-launch-inactive"></i>
                    <h4>System Bookings</h4>
                </div>
                <div class='data-launch-booking-report-tick-container' id='data-launch-dvsa-report-tick-container'>
                    <i id='data-launch-dvsa-report-tick-element' class="bi bi-check-circle data-launch-inactive"></i>
                    <h4 id="dvsaReportFileName">DVSA Log</h4>
                </div>
            </div>
            <div class="data-launch-mot-reconciliation-meta">
                <button class='btn btn-warning data-launch-mot-reconciliation-table-controls-buttons data-launch-no-click mot-rec-pill' id='data-launch-mot-reconciliation-month'>Month: <span id="mot_reconciliation_month">${this.data.month}</span></button>
                <button class='btn btn-warning data-launch-mot-reconciliation-table-controls-buttons data-launch-no-click mot-rec-pill' id='data-launch-mot-reconciliation-year'>Year: <span id="mot_reconciliation_year">${this.data.year}</span></button>
                <button class='btn btn-warning data-launch-mot-reconciliation-table-controls-buttons data-launch-no-click mot-rec-pill ${Number(this.data.status) === 1 ? 'mot-rec-pill--submitted' : 'mot-rec-pill--draft'}' id='data-launch-mot-reconciliation-status-btn'>Status: <span id="mot_reconciliation_status">${Number(this.data.status) === 1 ? 'Submitted': 'Draft'}</span></button>
                <div class='data-launch-mot-reconciliation-table-controls-container'>
                    <button class="btn btn-primary data-launch-mot-reconciliation-save-button data-launch-mot-reconciliation-table-controls-buttons data-launch-inactive mot-rec-btn mot-rec-btn--save" id="data-launch-mot-reconciliation-save-button"><i class="bi bi-floppy"></i> Save</button>
                    <button class='btn btn-warning data-launch-export-all-records data-launch-mot-reconciliation-table-controls-buttons data-launch-inactive mot-rec-btn mot-rec-btn--ghost' id='data-launch-mot-reconciliation-export-all'><i class="bi bi-file-earmark-arrow-down"></i> Export</button>
                    <button class='btn btn-warning data-launch-only-show-red data-launch-mot-reconciliation-table-controls-buttons data-launch-inactive mot-rec-btn mot-rec-btn--danger' id='data-launch-mot-reconciliation-red-only'>Red Only</button>
                    <button class='btn btn-warning data-launch-show-all data-launch-mot-reconciliation-table-controls-buttons data-launch-inactive mot-rec-btn mot-rec-btn--ghost' id='data-launch-mot-reconciliation-show-all'>Show All</button>
                </div>
                <button class="btn btn-primary data-launch-mot-reconciliation-submit-button data-launch-mot-reconciliation-table-controls-buttons data-launch-inactive mot-rec-btn mot-rec-btn--submit" id="data-launch-mot-reconciliation-submit-button"><i class="bi bi-send-check"></i> Submit Reconciliation</button>
            </div>
            <div class='data-launch-mot-reconciliation-header'>
                <button class="btn btn-primary data-launch-upload-booking-report-btn data-launch-upload-file-1 mot-rec-btn mot-rec-btn--upload" id="xpg_uploadFile1Btn"><i class="bi bi-file-earmark-spreadsheet"></i> Upload Booking Report</button>
                 <button class='btn btn-primary data-launch-mot-reconciliation-import-garage-boooking-reports-from-data-launch-system mot-rec-btn mot-rec-btn--primary' id='data-launch-mot-reconciliation-import-garage-boooking-reports-from-data-launch-system'><i class="bi bi-database-check"></i> Use System Bookings</button>
                <button class="btn btn-primary data-launch-upload-booking-report-btn data-launch-upload-file-2 mot-rec-btn mot-rec-btn--upload" id="xpg_uploadFile2Btn"><i class="bi bi-cloud-upload"></i> Upload DVSA Log</button><br>
                <input type="file" id="fileInput_bookingReport_${this.garageId}" name="file" required hidden />
                <input type="file" id="fileInput_dvsaReport_${this.garageId}" name="file" required hidden />
            </div>
            <div class="mot-rec-input-state" id="mot-rec-input-state">
                <span class="mot-rec-input-state-pill" id="mot-rec-booking-source">Booking source: Not loaded</span>
                <span class="mot-rec-input-state-pill" id="mot-rec-dvsa-state">DVSA log: Not loaded</span>
                <span class="mot-rec-input-state-pill mot-rec-input-state-pill--waiting" id="mot-rec-ready-state">Waiting for both booking source and DVSA log</span>
            </div>
            <div class="mot-rec-summary" id="mot-rec-summary">
                <div class="mot-rec-summary-card"><span class="mot-rec-summary-label">Matched</span><span class="mot-rec-summary-value" id="mot-rec-matched-count">0</span></div>
                <div class="mot-rec-summary-card"><span class="mot-rec-summary-label">Needs Review</span><span class="mot-rec-summary-value" id="mot-rec-review-count">0</span></div>
                <div class="mot-rec-summary-card"><span class="mot-rec-summary-label">Missing From Diary</span><span class="mot-rec-summary-value" id="mot-rec-unmatched-count">0</span></div>
                <div class="mot-rec-summary-card"><span class="mot-rec-summary-label">Missing From DVSA</span><span class="mot-rec-summary-value" id="mot-rec-unmatched-booking-count">0</span></div>
            </div>        
                         
            <div class="data-launch-mot-reconciliation-data-query-table" id="motExpertHTML"></div>
            <div id="rowContextMenu" class="data-launch-context-menu" style="display:none; position:absolute; z-index:9999; background:white; border:1px solid #ccc; padding:8px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
                <div id="addRowBelowOption" class="data-launch-add-new-row-to-rec-for-notes" style="cursor:pointer;">+ Add Note Row Below</div>
            </div>
        </div>
        `
        document.getElementById('motReconciliationsPage').innerHTML = html
        this.injectExistingRecordValues()
        this.updateInputStateUI()
    }
    showRowContextMenu(event) {
        // event.preventDefault();

        // // Store clicked row reference
        // this.rightClickedRow = event.currentTarget;

        // // Position the menu
        // const menu = document.getElementById('rowContextMenu');
        // menu.style.left = `${event.pageX}px`;
        // menu.style.top = `${event.pageY}px`;
        // menu.style.display = 'block';

            event.preventDefault();
    this.rightClickedRow = event.currentTarget;

    const menu = document.getElementById('rowContextMenu');
    menu.style.position = 'fixed';        // <—
    menu.style.left = `${event.clientX + window.scrollX}px`;
    menu.style.top  = `${event.clientY + window.scrollY}px`;
    menu.style.display = 'block';

        // Hide if clicking elsewhere
        document.addEventListener('click', this.hideContextMenu.bind(this));
    }

    hideContextMenu() {
        document.getElementById('rowContextMenu').style.display = 'none';
        document.removeEventListener('click', this.hideContextMenu.bind(this));
    }
    injectExistingRecordValues () {
        if (this.data) {
            // if (this.data.dvsa_report_id) {
                // alert('there is a booking report present')
                this.injectDocumentsIntoPage()
            // }
            // else {
            //     document.getElementById("xpg_uploadFile1Btn").style.display = 'none';
            //     document.getElementById("xpg_uploadFile2Btn").style.display = 'none';
            //     document.getElementById('motExpertHTML').innerHTML = 
            //     `<div style="max-width: 800px; margin: 0 auto; padding: 30px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);">
            //         <h2 style="text-align: center;text-transform: uppercase; color: #333; font-weight: bold; margin-bottom: 20px;">To perform a reconciliation</h2>
                    
            //         <div class="data-launch-upload-reconciliation-file-buttons data-launch-upload-file-1" style="cursor: pointer; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); margin-bottom: 30px;">
            //             <h3 style="text-align: center; color: #0068B5; font-weight: 600; margin-bottom: 10px;" class="data-launch-upload-file-1">Step 1</h3>
            //             <p class="data-launch-upload-file-1" style="font-size: 18px; text-align: center; color: #555;">Please upload a booking report</p>
            //         </div>
                    
            //         <div id="data-launch-upload-file-2-initial-wizard-button" class="data-launch-upload-reconciliation-file-buttons data-launch-upload-file-2 not-ready-yet" style="cursor: pointer; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); margin-bottom: 30px;">
            //             <h3 class="data-launch-upload-file-2" style="text-align: center; color: #0068B5; font-weight: 600; margin-bottom: 10px;">Step 2</h3>
            //             <p class="data-launch-upload-file-2" style="font-size: 18px; text-align: center; color: #555;">Please upload the DVSA Log</p>
            //         </div>
                    
            //         <p style="text-align: center; font-size: 16px; color: #777; font-style: italic;">Ensure both files are uploaded correctly for successful reconciliation.</p>
            //     </div>
            //     `
            // }
        }
        // bookingReportFileName
        // dvsaReportFileName
    }
    // injectDocumentsIntoPage () {
    //     fetchData('data_launch_images', 2, 0, null, this.garageId, null,null,null,null, parseInt(this.data.id), null, null, 'garage_mot_reconciliation').then(
    //         res => {
    //             console.log('has it fetched the documents as it should ???')
    //             // alert('has it fetched them both successfully ??? ')
    //             console.log('res ', res)
    //             let docs = res
    //             docs.forEach(doc => {
    //                 if (doc.type === 'Booking Report') {
    //                     //// i need to get the file here and pass it 
    //                     this.uploadFile('1', doc.url, doc)
    //                 }
    //                 else if (doc.type === 'DVSA Report') {
    //                     this.uploadFile('2', doc.url, doc)
    //                 }                    
    //             })
    //         },
    //         err => {
    //             console.error(err)
    //         }            
    //     )
    // }
    injectDocumentsIntoPage () {
    fetchData('data_launch_images', 3, 0, null, this.garageId, null, null, null, null, parseInt(this.data.id), null, null, 'garage_mot_reconciliation')
    .then(res => {
        let docs = res;
        const reconciliationFile = docs.find(doc => doc.type === 'Reconciliation Report');

        if (reconciliationFile) {
            this.renderFromReconciliationFile(reconciliationFile);
            return; // ✅ Don't load DVSA/Booking reports
        }

        docs.forEach(doc => {
            if (doc.type === 'Booking Report') {
                this.uploadFile('1', doc.url, doc);
            } else if (doc.type === 'DVSA Report') {
                this.uploadFile('2', doc.url, doc);
            }
        });
    })
    .catch(err => {
        console.error(err);
    });
}
renderFromReconciliationFile(fileRecord) {
    const fileName = fileRecord.name;
    this.reconciliationFile = fileRecord;

    getImageDocUrl(fileName)
        .then(signedUrl => {
            const cacheBust = fileRecord.etag || Date.now()
            return fetch(`/fetch-file?fileUrl=${encodeURIComponent(signedUrl)}&v=${cacheBust}`);
        })
        .then(res => res.arrayBuffer())
        .then(buffer => {
            const wb = new ExcelJS.Workbook();
            return wb.xlsx.load(buffer);
        })
        .then(workbook => {
            const ws = workbook.worksheets[0];
            let html = `<table class='table'><thead><tr>`;
            // Headers
            // ws.columns.forEach(col => {
            //     html += `<th>${col.header}</th>`;
            // });
            // this.tableHeaders.forEach(header => {
            //     html += `<th>${header}</th>`
            // })
            html += `<tr>
               <th>Site Number</th>
               <th>Test date/time</th>
               <th>Test Number</th>
               <th>Registration</th>
               <th>VIN</th>
               <th>Make</th>
               <th>Model</th>
               <th>Class</th>
               <th>User Id</th>
               <th>Test type</th>
               <th>Result</th>
               <th>Reason for aborting</th>
               <th>Test Duration</th>
               <th>Tester who recorded test</th>
               <th>Date/time of recording CT test</th>
               <th>Contingency Test Reason</th>
               <th>Contingency Code</th>
               <th>Login type at start</th>
               <th>Login type at completion</th>
               <th>Client IP address at start</th>
               <th>Client IP address at completion</th>
               <th>Browser agent at start</th>
               <th>Browser agent at completion</th>
               <th>Cookie code at start</th>
               <th>Cookie code at completion</th>
               <th>Brake Test Type</th>
               <th>Entry Type</th>
               <th>Emissions Type</th>
               <th>Entry Type</th>
               </tr>`
            html += `</tr></thead><tbody>`;

          ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header
            // html += `<tr class='data-row'>`;
            // row.eachCell((cell, colIndex) => {
            //     let style = '';

            //     // Extract fill color
            //     if (cell.fill && cell.fill.fgColor && cell.fill.fgColor.argb) {
            //         style += `background-color: #${cell.fill.fgColor.argb};`;
            //     }

            //     // Extract font styles
            //     if (cell.font) {
            //         if (cell.font.bold) style += 'font-weight: bold;';
            //         if (cell.font.color && cell.font.color.argb) {
            //             style += `color: #${cell.font.color.argb};`;
            //         }
            //     }

            //     html += `<td style="${style}">${cell.value || ''}</td>`;
            // });
            html += `<tr class='data-row export-row' data-export-row="${this.exportRow}">`;
            row.eachCell((cell, colIndex) => {
                const headerKey = ws.getRow(1).getCell(colIndex + 1).value;
                const cellValue = cell.value || '';
                const cellStyle = [];

                if (cell.fill?.fgColor?.argb) cellStyle.push(`background-color: #${cell.fill.fgColor.argb}`);
                if (cell.font?.bold) cellStyle.push(`font-weight: bold`);
                if (cell.font?.color?.argb) cellStyle.push(`color: #${cell.font.color.argb}`);

                const style = cellStyle.join(';');

                html += `<td class='export-record' data-export-header="${headerKey}" data-export-row="${this.exportRow}" data-export-val="${cellValue}" style="${style}">${cellValue}</td>`;
            });
            html += `</tr>`;
            this.exportRow++;
        });


            html += `</tbody></table>`;
            document.getElementById('motExpertHTML').innerHTML = html;
            setTimeout(() => {
                const rows = document.querySelectorAll('.data-row');
                rows.forEach(row => {
                    row.addEventListener('contextmenu', this.showRowContextMenu.bind(this));
                });
            }, 0);
            document.getElementById('data-launch-mot-reconciliation-save-button').classList.remove('data-launch-inactive');
            document.getElementById('data-launch-mot-reconciliation-submit-button').classList.remove('data-launch-inactive');
            document.getElementById('data-launch-mot-reconciliation-red-only').classList.remove('data-launch-inactive')
            document.getElementById('data-launch-mot-reconciliation-show-all').classList.remove('data-launch-inactive')
            document.getElementById('data-launch-mot-reconciliation-export-all').classList.remove('data-launch-inactive')
        })
        .catch(err => {
            console.error('Failed to render reconciliation file:', err);
            this.showCRUDAlert('Failed to load saved Reconciliation file.', 'error');
        });
}


    // fetchFile = async (fileUrl, num) => {
    //     try {
    //         console.log('fetchFile fileUrl', fileUrl)
    //       const response = await fetch(`/fetch-file?fileUrl=${encodeURIComponent(fileUrl)}`);
    //       if (response.ok) {
    //         const blob = await response.blob();
      
    //         // Convert blob to a File-like object
    //         const fileName = fileUrl.split('/').pop().split('?')[0];
    //         const file = new File([blob], fileName, { type: blob.type });
        
    //         // Assign the file to the correct input element
    //         let inputElement = document.getElementById(num === '1' ? 
    //             `fileInput_bookingReport_${this.garageId}` : 
    //             `fileInput_dvsaReport_${this.garageId}`);

    //         let dataTransfer = new DataTransfer();
    //         dataTransfer.items.add(file);
    //         inputElement.files = dataTransfer.files;


    //         // Pass the file to parseExcel
    //         this.parseExcel(file, num);
    //       } else {
    //         console.error('Failed to fetch file');
    //       }
    //     } catch (error) {
    //       console.error('Error:', error);
    //     }
    //   };


    fetchFile = (fileUrl, num, fileRecord) => {
    
        let fileName = fileRecord.name;
    
        // Get pre-signed URL as a promise
        getImageDocUrl(fileName)
            .then((signedUrl) => {
                if (!signedUrl) {
                    throw new Error('Failed to generate a fresh pre-signed URL.');
                }
    
    
                // Fetch the file using the signed URL
                return fetch(`/fetch-file?fileUrl=${encodeURIComponent(signedUrl)}`);
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch file. Status: ${response.status}`);
                }
                return response.blob(); // Convert response to blob
            })
            .then((blob) => {
    
                const file = new File([blob], fileName, { type: blob.type });
                if (num === '1') {
                    this.selectedBookingReport = file;
                } else {
                    this.selectedDvsaReport = file;
                }
    
                let inputElement = document.getElementById(num === '1' ? 
                    `fileInput_bookingReport_${this.garageId}` : 
                    `fileInput_dvsaReport_${this.garageId}`);
    
                if (!inputElement) {
                    throw new Error('Input element not found!');
                }
    
                let dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                inputElement.files = dataTransfer.files;
    
    
                this.parseExcel(file, num);
            })
            .catch((error) => {
                console.error('Error fetching file:', error);
            });
    };
    

    // fetchFile = async (fileUrl, num, fileRecord) => {
    //     try {
    //         console.log('fetchFile called with:', fileUrl);
    
    //         // Get a fresh pre-signed URL before fetching the file
    //         // const fileName = fileUrl.split('/').pop().split('?')[0];
    //         let fileName = fileRecord.name
    //         console.log('MOT RECONCILIATION fileName is ', fileName)
    //         const signedUrl = await getImageDocUrl(fileName);  // Get fresh URL
    
    //         if (!signedUrl) {
    //             console.error('Failed to generate a fresh pre-signed URL.');
    //             return;
    //         }
    
    //         console.log('Using fresh pre-signed URL:', signedUrl);
    
    //         const response = await fetch(signedUrl);
    //         if (!response.ok) {
    //             throw new Error(`Failed to fetch file. Status: ${response.status}`);
    //         }
    
    //         const blob = await response.blob();
    //         console.log('Blob received:', blob);
    
    //         const file = new File([blob], fileName, { type: blob.type });
    
    //         let inputElement = document.getElementById(num === '1' ? 
    //             `fileInput_bookingReport_${this.garageId}` : 
    //             `fileInput_dvsaReport_${this.garageId}`);
    
    //         if (!inputElement) {
    //             console.error('Input element not found!');
    //             return;
    //         }
    
    //         let dataTransfer = new DataTransfer();
    //         dataTransfer.items.add(file);
    //         inputElement.files = dataTransfer.files;
    
    //         console.log('File successfully assigned to input field.');
    
    //         this.parseExcel(file, num);
    
    //     } catch (error) {
    //         console.error('Error fetching file:', error);
    //     }
    // };
      
    uploadFile (num, fileUrl, fileRecord) {
        if (num === '1') {
            if (fileUrl) {
                // If the URL is provided, fetch the file from the URL
                this.fetchFile(fileUrl, num, fileRecord);
            }
            else {
                this.recordHasBeenChanged = true
                let input = document.getElementById(`fileInput_bookingReport_${this.garageId}`)
                input.onchange = _ => {
                  // you can use this method to get file and perform respective operations
                          let files =   Array.from(input.files);
                        //   var xl2json = this.ExcelToJSON();
                        //   this.parseExcel(files[0], num);
                          
                          this.selectedBookingReport = files[0];  // ✅ Store reference
                          var xl2json = this.ExcelToJSON();
                          this.parseExcel(this.selectedBookingReport, num);
                      };
                input.click();
            }
        
        }
        else {
            if (fileUrl) {
                // If the URL is provided, fetch the file from the URL
                this.fetchFile(fileUrl, num, fileRecord);
            }
            else {   
                this.recordHasBeenChanged = true             
                let input = document.getElementById(`fileInput_dvsaReport_${this.garageId}`)
                input.onchange = _ => {
                // you can use this method to get file and perform respective operations
                        let files =   Array.from(input.files);
                        // var xl2json = this.ExcelToJSON();
                        // this.parseExcel(files[0], num);
                        
                        this.selectedDvsaReport = files[0];  // ✅ Store reference
                        var xl2json = this.ExcelToJSON();
                        this.parseExcel(this.selectedDvsaReport, num);
                    };
                input.click();
            }
        }       
    }
    fetchFileFromUrl(fileUrl, num) {
        // Use fetch to get the file from the URL
        fetch(fileUrl)
            .then(response => response.blob())  // Get the file as a Blob
            .then(blob => {
                // Convert the blob to a file object
                const file = new File([blob], "file-from-url.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                this.parseExcel(file, num);  // Pass the file to parseExcel
            })
            .catch(error => {
                console.error("Error fetching file from URL:", error);
            });
    }  
    renderHTML (data) {  
        // document.getElementById('data-launch-mot-reconciliation-close-button').classList.remove('data-launch-inactive')
        document.getElementById('data-launch-mot-reconciliation-red-only').classList.remove('data-launch-inactive')
        document.getElementById('data-launch-mot-reconciliation-show-all').classList.remove('data-launch-inactive')
        document.getElementById('data-launch-mot-reconciliation-export-all').classList.remove('data-launch-inactive')
        document.getElementById('data-launch-mot-reconciliation-import-garage-boooking-reports-from-data-launch-system').classList.remove('data-launch-inactive')
        if (this.recordHasBeenChanged == true) {
            document.getElementById('data-launch-mot-reconciliation-save-button').classList.remove('data-launch-inactive')   
        }
        if (Number(this.data.status) === 0) {
            document.getElementById('data-launch-mot-reconciliation-submit-button').classList.remove('data-launch-inactive')
        }    
        this.exportRow = 0
           let html = `<table class='table'><thead>`
           for (let i = 0; i < data.length; i++) {
              if (i === 0) {
                this.tableHeaders.push(data[i])
                html += ` <tr>
               <th>${data[i].A}</th>
               <th>${data[i].B}</th>
               <th>${data[i].C}</th>
               <th>${data[i].D}</th>
               <th>${data[i].E}</th>
               <th>${data[i].F}</th>
               <th>${data[i].G}</th>
               <th>${data[i].H}</th>
               <th>${data[i].I}</th>
               <th>${data[i].J}</th>
               <th>${data[i].K}</th>
               <th>${data[i].L}</th>
               <th>${data[i].M}</th>
               <th>${data[i].N}</th>
               <th>${data[i].O}</th>
               <th>${data[i].P}</th>
               <th>${data[i].Q}</th>
               <th>${data[i].R}</th>
               <th>${data[i].S}</th>
               <th>${data[i].T}</th>
               <th>${data[i].U}</th>
               <th>${data[i].V}</th>
               <th>${data[i].W}</th>
               <th>${data[i].X}</th>
               <th>${data[i].Y}</th>
               <th>${data[i].Z}</th>
               <th>${data[i].AA}</th>
               <th>${data[i].AB}</th>
               <th>${data[i].AC}</th>
               <th>Reconciliation Status</th>
               <th>Reason</th>
               </tr>
               </thead><tbody id="reconciliationTableBody">`
              }
              else {
               html += `<tr class='data-row regNumber_${data[i].D}_row export-row' data-export-row="${this.exportRow}">
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].A}" data-export-row="${this.exportRow}" data-export-val="${data[i].A}">${data[i].A}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].B}" data-export-row="${this.exportRow}" data-export-val="${data[i].B}">${data[i].B}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].C}" data-export-row="${this.exportRow}" data-export-val="${data[i].C}">${data[i].C}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].D}" data-export-row="${this.exportRow}" data-export-val="${data[i].D}">${data[i].D}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].E}" data-export-row="${this.exportRow}" data-export-val="${data[i].E}">${data[i].E} <h3 id="${data[i].D}_${data[i].E}_missingFromAlert"></h3></td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].F}" data-export-row="${this.exportRow}" data-export-val="${data[i].F}">${data[i].F}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].G}" data-export-row="${this.exportRow}" data-export-val="${data[i].G}">${data[i].G}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].H}" data-export-row="${this.exportRow}" data-export-val="${data[i].H}">${data[i].H}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].I}" data-export-row="${this.exportRow}" data-export-val="${data[i].I}">${data[i].I}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].J}" data-export-row="${this.exportRow}" data-export-val="${data[i].J}">${data[i].J}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].K}" data-export-row="${this.exportRow}" data-export-val="${data[i].K}">${data[i].K}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].L}" data-export-row="${this.exportRow}" data-export-val="${data[i].L}">${data[i].L}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].M}" data-export-row="${this.exportRow}" data-export-val="${data[i].M}">${data[i].M}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].N}" data-export-row="${this.exportRow}" data-export-val="${data[i].N}">${data[i].N}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].O}" data-export-row="${this.exportRow}" data-export-val="${data[i].O}">${data[i].O}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].P}" data-export-row="${this.exportRow}" data-export-val="${data[i].P}">${data[i].P}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].Q}" data-export-row="${this.exportRow}" data-export-val="${data[i].Q}">${data[i].Q}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].R}" data-export-row="${this.exportRow}" data-export-val="${data[i].R}">${data[i].R}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].S}" data-export-row="${this.exportRow}" data-export-val="${data[i].S}">${data[i].S}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].T}" data-export-row="${this.exportRow}" data-export-val="${data[i].T}">${data[i].T}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].U}" data-export-row="${this.exportRow}" data-export-val="${data[i].U}">${data[i].U}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].V}" data-export-row="${this.exportRow}" data-export-val="${data[i].V}">${data[i].V}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].W}" data-export-row="${this.exportRow}" data-export-val="${data[i].W}">${data[i].W}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].X}" data-export-row="${this.exportRow}" data-export-val="${data[i].X}">${data[i].X}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].Y}" data-export-row="${this.exportRow}" data-export-val="${data[i].Y}">${data[i].Y}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].Z}" data-export-row="${this.exportRow}" data-export-val="${data[i].Z}">${data[i].Z}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].AA}" data-export-row="${this.exportRow}" data-export-val="${data[i].AA}">${data[i].AA}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].AB}" data-export-row="${this.exportRow}" data-export-val="${data[i].AB}">${data[i].AB}</td>
               <td class='regNumber_${data[i].D} vinNumber_${data[i].E} export-record' data-export-header="${data[0].AC}" data-export-row="${this.exportRow}" data-export-val="${data[i].AC}">${data[i].AC}</td>
               <td class='mot-rec-status-cell export-record' data-export-header="Reconciliation Status" data-export-row="${this.exportRow}" data-export-val=""></td>
               <td class='mot-rec-reason-cell export-record' data-export-header="Reason" data-export-row="${this.exportRow}" data-export-val=""></td>
                       </tr>`
               this.exportRow++   
              }                
           }
           html += `</tbody></table>`
           document.getElementById('motExpertHTML').innerHTML = html
           setTimeout(() => {
                const rows = document.querySelectorAll('.data-row');
                rows.forEach(row => {
                    row.addEventListener('contextmenu', this.showRowContextMenu.bind(this));
                });
            }, 0);
           this.runQuery()
    }
    export = () => {

        const wb = new ExcelJS.Workbook();
        const worksheetName = 'Simple Worksheet';
        const ws = wb.addWorksheet(worksheetName);

        let x = Array.from(document.getElementsByClassName('export-record'))
        let r = Array.from(document.getElementsByClassName('export-row'))
        // Filter the array
        r = r.filter(element => {
            const hasInactiveClass = element.classList.contains('data-launch-inactive');
            // Log the elements being checked
            return !hasInactiveClass;
        });



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
        // for (let p = 0; p < r.length; p++) {  
        //     let val = {}  
        //     for (let i = 0; i < x.length; i++) {              
        //         if (x[i].getAttribute('data-export-row') == p){
        //             val[x[i].getAttribute('data-export-header')] = x[i].getAttribute('data-export-val')
        //         }                     
        //     }
        //     ws.addRow(val)  
        // }
        for (let p = 0; p < r.length; p++) {  
            let val = {}  
            for (let i = 0; i < x.length; i++) {
                if (x[i].getAttribute('data-export-row') == p) {
                // Look for a textarea first
                const textarea = x[i].querySelector('textarea');
                if (textarea) {
                    val[x[i].getAttribute('data-export-header')] = textarea.value;
                } else {
                    val[x[i].getAttribute('data-export-header')] = x[i].getAttribute('data-export-val');
                }
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
    closeMotReconciliationRecord () {
        document.getElementById('garagePage').classList.remove('data-launch-hide')
        document.getElementById('motReconciliationsPage').classList.add('data-launch-hide')
    }
    submitMotReconciliationRecord () {
        return garageClassInstantiated.secureAction('update', 'data_launch_mot_reconciliations', this.data.id, {status: 1, submitted_by: user_ID, submitted_date: new Date()}).then(
            res => {
                this.showCRUDAlert('MOT Reconciliation Successfully Submitted', "success")
                document.getElementById('garagePage').classList.remove('data-launch-hide')
                document.getElementById('motReconciliationsPage').classList.add('data-launch-hide')
                garageClassInstantiated.injectDataIntoMotReconciliationSubgrid()
            }
        )
    }
    generateExcelFromTable() {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('MOT Reconciliation');

    const table = document.querySelector('#motExpertHTML table');
    if (!table) return null;

    // Set columns
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => ({
        header: th.textContent.trim(),
        key: th.textContent.trim(),
        width: 20
    }));
    ws.columns = headers;

    // Write rows
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((row, rowIndex) => {
        const excelRow = ws.addRow();
        row.querySelectorAll('td').forEach((cell, colIndex) => {
            const cellText = cell.querySelector('textarea') ? cell.querySelector('textarea').value : cell.textContent.trim();
            const excelCell = excelRow.getCell(colIndex + 1);
            excelCell.value = cellText;

            const style = window.getComputedStyle(cell);

            // Background colour
            const bgColor = style.backgroundColor;
            if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                // Convert rgb(x,x,x) to hex
                const rgb = bgColor.match(/\d+/g);
                const hex = rgb ? '#' + rgb.map(x => parseInt(x).toString(16).padStart(2, '0')).join('') : null;
                if (hex) {
                    excelCell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: hex.replace('#', '') }
                    };
                }
            }

            // Bold or font styles (optional)
            if (style.fontWeight === '700' || style.fontWeight === 'bold') {
                excelCell.font = { bold: true };
            }

            const color = style.color;
            if (color && color !== 'rgb(0, 0, 0)') {
                const rgb = color.match(/\d+/g);
                const hex = rgb ? '#' + rgb.map(x => parseInt(x).toString(16).padStart(2, '0')).join('') : null;
                if (hex) {
                    if (!excelCell.font) excelCell.font = {};
                    excelCell.font.color = { argb: hex.replace('#', '') };
                }
            }
        });
    });

    return wb.xlsx.writeBuffer();
}

    // generateExcelFromTable() {
    // const wb = new ExcelJS.Workbook();
    // const ws = wb.addWorksheet('MOT Reconciliation');

    // const table = document.querySelector('#motExpertHTML table');
    // if (!table) return null;

    //     // Build headers
    //     const headers = Array.from(table.querySelectorAll('thead th')).map(th => ({
    //         header: th.textContent.trim(),
    //         key: th.textContent.trim(),
    //         width: 20
    //     }));
    //     ws.columns = headers;

    //     // Build rows
    //     const rows = table.querySelectorAll('tbody tr');
    //     rows.forEach(row => {
    //         const values = {};
    //         row.querySelectorAll('td').forEach((cell, index) => {
    //             const key = headers[index]?.key;
    //             let val = cell.querySelector('textarea') ? cell.querySelector('textarea').value : cell.textContent.trim();
    //             values[key] = val;
    //         });
    //         ws.addRow(values);
    //     });

    //     return wb.xlsx.writeBuffer();
    // }
    // saveMotReconciliationRecord() {
    //     this.generateExcelFromTable().then(buffer => {
    //         const excelFile = new File([buffer], "MOT_Reconciliation.xlsx", {
    //             type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    //         });

    //         const formData = new FormData();
    //         formData.append('file', excelFile);

    //         fetch('/upload', {
    //             method: 'POST',
    //             body: formData
    //         })
    //         .then(res => res.json())
    //         .then(result => {
    //             if (!result || !result.fileName) {
    //                 throw new Error("Upload response missing expected fileName");
    //             }

    //             const imgObj = {
    //                 name: result.fileName,
    //                 record_id: this.data.id,
    //                 record_type: 'garage_mot_reconciliation',
    //                 garage_id: this.garageId,
    //                 etag: result.etag,
    //                 url: result.previewUrl,
    //                 type: 'Reconciliation Report'
    //             };

    //             garageClassInstantiated.secureAction('create', 'data_launch_images', null, imgObj).then(
    //                 result => {
    //                     this.showCRUDAlert('Reconciliation Excel saved successfully', 'success');
    //                     console.log('Saved reconciliation Excel:', result);
    //                     garageClassInstantiated.injectDataIntoMotReconciliationSubgrid();
    //                 },
    //                 error => {
    //                     console.error('Error saving metadata:', error);
    //                     this.showCRUDAlert('Failed to save Excel metadata. Contact admin.', 'error');
    //                 }
    //             );
    //         })
    //         .catch(err => {
    //             console.error('Upload failed:', err);
    //             this.showCRUDAlert('Failed to upload reconciliation file', 'error');
    //         });
    //     });
    // }

    saveMotReconciliationRecord() {
        if (!this.data || !this.data.id) {
            this.showCRUDAlert("No Reconciliation record loaded", "error");
            return Promise.reject(new Error("No reconciliation record loaded"));
        }
        return this.generateExcelFromTable().then(async (buffer) => {
        const isOverwrite = !!this.reconciliationFile;
        const fileName = isOverwrite
            ? this.reconciliationFile.name
            : `MOT_Reconciliation_${this.data.id}_${Date.now()}.xlsx`;

        const excelFile = new File([buffer], fileName, {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const formData = new FormData();
        formData.append('file', excelFile);

        // const blob = new Blob([buffer], {
        //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        // });
        // const tempUrl = URL.createObjectURL(blob);
        // console.log("🧪 Download this Excel and inspect it before upload:", tempUrl);

        // const a = document.createElement('a');
        // a.href = tempUrl;
        // a.download = 'test-before-upload.xlsx';
        // a.click();

        return fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(async result => {
            if (isOverwrite) {
                // ✅ Update existing metadata
                const updated = {
                    ...this.reconciliationFile,
                    name: result.fileName,
                    etag: result.etag,
                    url: result.previewUrl
                };
                // await fetch('/api/mot-reconciliation/delete-file', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ key: this.reconciliationFile.name })
                // });
                // 🔥 delete previous file before overwriting
                await fetch('/api/mot-reconciliation/delete-file', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: this.reconciliationFile.name })
                });
                return garageClassInstantiated.secureAction(
                    'update',
                    'data_launch_images',
                    updated.id,
                    updated
                ).then((res) => {
                    this.reconciliationFile = updated;
                    return res;
                });
            } else {
                // ✅ Create new metadata
                const imgObj = {
                    name: result.fileName,
                    record_id: this.data.id,
                    record_type: 'garage_mot_reconciliation',
                    garage_id: this.garageId,
                    etag: result.etag,
                    url: result.previewUrl,
                    type: 'Reconciliation Report'
                };


                return garageClassInstantiated.secureAction(
                    'create',
                    'data_launch_images',
                    null,
                    imgObj
                ).then((res) => {
                    this.reconciliationFile = res;
                    return res;
                });
            }
        })
        .then(() => {
            const payload = {
                using_data_launch_booking_data: this.usingExistingBookingsFromTheSystem ? 1 : 0,
                data_launch_booking_data_ids: JSON.stringify(this.existingBookingsFromTheSystemIDS || [])
            };
            return garageClassInstantiated.secureAction(
                'update',
                'data_launch_mot_reconciliations',
                this.data.id,
                payload
            );
        })
        .then(() => {
            this.showCRUDAlert("Reconciliation Excel saved successfully", "success");
        })
        .catch(err => {
            console.error("Save failed:", err);
            this.showCRUDAlert("Save failed", "error");
            throw err;
        });
    });
}



    // saveMotReconciliationRecord () {

    //     //// if there are any existing documents stored (data-launch-images) - booking report / dvsa report///
    //     //// need to find  them and then delete them

    //     if(this.data.booking_report_id) {
    //         garageClassInstantiated.secureAction('delete', 'data_launch_images', this.data.booking_report_id).then(
    //             res => {
    //                 console.log('existing booking report document DELETED', res)
    //             }
    //         )
    //     }
    //     if(this.data.dvsa_report_id) {
    //         garageClassInstantiated.secureAction('delete', 'data_launch_images', this.data.dvsa_report_id).then(
    //             res => {
    //                 console.log('existing dvsa report document DELETED', res)
    //             }
    //         )
    //     }

    //     if (this.dvsaReportMounted === true && this.bookingReportMounted === false) {
    //         const fileInput2 = document.getElementById(`fileInput_dvsaReport_${this.garageId}`);
    //         const formData2 = new FormData();
    //         formData2.append('file', fileInput2.files[0]);   
    //         console.log('formData2:', formData2 || '❌ formData2 is undefined');
    //         (async () => {
    //             try {
    //                 const response = await fetch('/upload', {
    //                     method: 'POST',
    //                     body: formData2
    //                 });        
    //                 const result = await response.json();
    //                 console.log('Upload result:', result || '❌ result is undefined');
                    
    //                 if (response.ok) {
    //                     // alert(`Thank you. \n fileInput_bookingReport_ FILE uploaded successfully!`);
    //                     let imgObj = {
    //                                     name: result.fileName,
    //                                     record_id: this.data.id,
    //                                     record_type: 'garage_mot_reconciliation',
    //                                     garage_id: this.garageId,
    //                                     etag: result.etag,
    //                                     url: result.previewUrl,
    //                                     type: 'DVSA Report'
    //                     }
    //                     garageClassInstantiated.secureAction('create', 'data_launch_images', null, imgObj).then(
    //                         result => {
    //                             console.log('data launch images table record created successfully', result)
    //                             let obj = {dvsa_report_id: result.id, using_data_launch_booking_data: false}
    //                             if (this.usingExistingBookingsFromTheSystem  === true) {
    //                                 obj.using_data_launch_booking_data = true
    //                                 obj.data_launch_booking_data_ids = JSON.stringify(this.existingBookingsFromTheSystemIDS)
    //                             }
    //                             garageClassInstantiated.secureAction('update', 'data_launch_mot_reconciliations', this.data.id, obj).then(
    //                                 res => {
    //                                     // alert(' mot reconciliation successfully updated with the dvsa report documentid', res)
    //                                     console.log(' mot reconciliation successfully updated with the dvsa report documentid', res)
    //                                     // document.getElementById('garagePage').classList.remove('data-launch-hide')
    //                                     // document.getElementById('motReconciliationsPage').classList.add('data-launch-hide')
    //                                     garageClassInstantiated.injectDataIntoMotReconciliationSubgrid()
    //                                 }
    //                             )
    //                         },
    //                         error => {
    //                             console.error('there has been an error uploading the file to the cloud', error)
    //                         }
    //                     )
    //                 }
    //             }
    //             catch (error) {
    //                 console.error('Error uploading file:', error);
    //                 this.showCRUDAlert('File upload failed. Please try again \n If issue persists, please contact your administrator', "error")
    //             }
    //         })();

    //     }
    //     else if (this.dvsaReportMounted === true && this.bookingReportMounted === true) {
    //             //// save the booking report record to the cloud first
    //             const fileInput = document.getElementById(`fileInput_bookingReport_${this.garageId}`);
    //             const formData = new FormData();
    //             formData.append('file', fileInput.files[0]);
    //             const fileInput2 = document.getElementById(`fileInput_dvsaReport_${this.garageId}`);
    //             const formData2 = new FormData();
    //             formData2.append('file', fileInput2.files[0]);   
    //             // Make this section async since we're using await
    //             (async () => {
    //                 try {
    //                     const response = await fetch('/upload', {
    //                         method: 'POST',
    //                         body: formData
    //                     });        
    //                     // const result = await response.json();  // Parse the JSON response
    //                     // console.log('Upload result:', result || '❌ result is undefined');
    //                     // const text = await response.text();  // Read raw response first
    //                     // console.log('Raw response:', text);  // Log it for debugging

    //                     // try {
    //                     //     const result = JSON.parse(text);  // Now try to parse it as JSON
    //                     //     console.log('Upload result:', result);
    //                     // } catch (error) {
    //                     //     console.error('❌ JSON Parse Error: The server did not return valid JSON');
    //                     // }
    //                     const result = await response.json();  // Parse the JSON response
    //                     console.log('Upload result:', result || '❌ result is undefined');
    

                        
    //                     if (response.ok) {
    //                         let imgObj = {
    //                                         name: result.fileName,
    //                                         record_id: this.data.id,
    //                                         record_type: 'garage_mot_reconciliation',
    //                                         garage_id: this.garageId,
    //                                         etag: result.etag,
    //                                         url: result.previewUrl,
    //                                         type: 'Booking Report'
    //                         }
    //                         garageClassInstantiated.secureAction('create', 'data_launch_images', null, imgObj).then(
    //                             result => {
    //                                 // alert('created the record of the fileInput_bookingReport_ in the data-launch-images table too !!! wahooo')
    //                                 console.log('data launch images table record created successfully', result)
    //                                 garageClassInstantiated.secureAction('update', 'data_launch_mot_reconciliations', this.data.id, {booking_report_id: result.id}).then(
    //                                     res => {
    //                                         console.log(' mot reconciliation successfully updated with the bookingreportdocumentid', res)
    //                                     }
    //                                 )
    //                             },
    //                             error => {
    //                                 console.error('there has been an error uploading the file to the cloud', error)
    //                             }
    //                         )
    //                     }
    //                 }
    //                 catch (error) {
    //                     console.error('Error uploading file:', error);
    //                     this.showCRUDAlert('File upload failed. Please try again \n If issue persists, please contact your administrator', "error")
    //                 }
    //             })();

    //             (async () => {
    //                 try {
    //                     const response2 = await fetch('/upload', {
    //                         method: 'POST',
    //                         body: formData2
    //                     });

    //                     const result = await response2.json();  // Parse the JSON response
    //                     console.log('Upload result:', result || '❌ result is undefined');

    //                     if (response2.ok) {
    //                         let imgObj = {
    //                                         name: result.fileName,
    //                                         record_id: this.data.id,
    //                                         record_type: 'garage_mot_reconciliation',
    //                                         garage_id: this.garageId,
    //                                         etag: result.etag,
    //                                         url: result.previewUrl,
    //                                         type: 'DVSA Report'
    //                         }
    //                         garageClassInstantiated.secureAction('create', 'data_launch_images', null, imgObj).then(
    //                             result => {
    //                                 console.log('data launch images table record created successfully', result)
    //                                 garageClassInstantiated.secureAction('update', 'data_launch_mot_reconciliations', this.data.id, {dvsa_report_id: result.id}).then(
    //                                     res => {
    //                                         console.log(' mot reconciliation successfully updated with the dvsa report documentid', res)
    //                                         // document.getElementById('garagePage').classList.remove('data-launch-hide')
    //                                         // document.getElementById('motReconciliationsPage').classList.add('data-launch-hide')
    //                                         garageClassInstantiated.injectDataIntoMotReconciliationSubgrid()
    //                                     }
    //                                 )
    //                             },
    //                             error => {
    //                                 console.error('there has been an error uploading the file to the cloud', error)
    //                             }
    //                         )
    //                     }
    //                 }
    //                 catch (error) {
    //                     console.error('Error uploading file:', error);
    //                     this.showCRUDAlert('File upload failed. Please try again \n If issue persists, please contact your administrator', "error")
    //                 }
    //             })();
    //     }
    // }
    showCRUDAlert(message, type) {
        const alertBox = document.getElementById("data-launch-crud-alert-box-mot-reconciliations");
        const alertMessage = document.getElementById("data-launch-crud-alert-message-mot-reconciliations");
        const alertIcon = document.getElementById("data-launch-crud-alert-icon-mot-reconciliations");
    
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
    findBookingsInOurSystem () {
        // Convert month and year to numbers if they're not already
        const targetMonth = Number(this.data.month); // Expected: 1-12
        const targetYear = Number(this.data.year);   // Expected: YYYY

        // Filter bookings matching the specified month and year
        const filteredBookings = this.allTheGarageBookingsData.filter(booking => {
            if (!booking.booking_date) return false; // Ensure booking_date exists

            const bookingDate = new Date(booking.booking_date); // Convert to Date object

            return (
                bookingDate.getFullYear() === targetYear && // Match year
                bookingDate.getMonth() + 1 === targetMonth  // Match month (getMonth() returns 0-11)
            );
        });
        this.bookingReport = [{A:'mot_booking_date', B: 'vehicle_reg', C: 'vin'}]
        this.existingBookingsFromTheSystemIDS = []
        for (let i = 0; i < filteredBookings.length; i++) {
            this.existingBookingsFromTheSystemIDS.push(filteredBookings[i].id)
            let formattedDate = this.formatDate(filteredBookings[i].booking_date)            
            this.bookingReport.push({
                A: formattedDate,
                B: filteredBookings[i].vehicle_reg,
                C: filteredBookings[i].vehicle_vin || ''
            })        
        }
        if (filteredBookings.length >= 1) {
            document.getElementById("data-launch-existing-bookings-tick-element").classList.remove('data-launch-inactive')
            this.usingExistingBookingsFromTheSystem = true
            this.using_data_launch_booking_data = true
            this.recordHasBeenChanged = true
            let saveBtn = document.getElementById('data-launch-mot-reconciliation-save-button')
            if(saveBtn.classList.contains('data-launch-inactive')) {
                saveBtn.classList.remove('data-launch-inactive')
            }
        }
        this.updateInputStateUI()
        this.runQuery()
    }
    formatDate = (isoDate) => {
        return new Date(isoDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };
    
autoResizeTextarea(textarea) {
    textarea.style.height = 'auto'; // Reset first
    textarea.style.height = textarea.scrollHeight + 'px'; // Adjust to fit text
}


    addListeners () {
        const page = document.getElementById('motReconciliationsPage');
        if (!page) return;
        if (MOTReconciliation.activeClickHandler) {
            page.removeEventListener('click', MOTReconciliation.activeClickHandler);
        }
        this.boundPageClickHandler = (event) => {
            event.stopPropagation()
            if (event.target.classList.contains('data-launch-only-show-red')) {
                this.onlyShowRed()
            }
            else if (event.target.classList.contains('data-launch-show-all')) {
                this.showAll()
            }
            else if (event.target.classList.contains('data-launch-upload-file-1')) {
                if (Number(this.data.status) === 1) {
                    this.showCRUDAlert('You cannot modify a submitted reconciliation', "error")
                }
                else {
                    this.uploadFile('1')
                }                
            }
            else if (event.target.classList.contains('data-launch-upload-file-2')) {
                if (Number(this.data.status) === 1) {
                    this.showCRUDAlert('You cannot modify a submitted reconciliation', "error")
                }
                else {
                    this.uploadFile('2')
                }              
            }
            else if (event.target.classList.contains('data-launch-add-new-row-to-rec-for-notes')) {
                if (Number(this.data.status) === 1) {
                    this.showCRUDAlert('You cannot modify a submitted reconciliation', "error")
                }
                else {
                    const currentRow = this.rightClickedRow;
                    const exportRowId = currentRow.getAttribute('data-export-row');
                    const tbody = currentRow.parentElement;

                    const newRow = currentRow.cloneNode(true); // Deep clone
                    this.exportRow++; // Keep ID uniqueness
                    newRow.setAttribute('data-export-row', this.exportRow);
                    newRow.classList.remove('data-launch-inactive');

                    const cells = newRow.querySelectorAll('.export-record, input, textarea');
                    cells.forEach((cell, index) => {
                        if (cell.hasAttribute('data-export-val')) {
                            cell.setAttribute('data-export-val', '');
                        }

                        // Column 8 = index 7 → insert <textarea>
                        if (cell.tagName === 'TD' && index === 7) {
                        const textarea = document.createElement('textarea');
                        textarea.className = 'notes-textarea export-record';
                        textarea.setAttribute('data-export-header', 'Notes');
                        textarea.setAttribute('data-export-val', '');
                        textarea.setAttribute('data-export-row', this.exportRow);
                        textarea.rows = 1;
                        textarea.wrap = 'soft';
                        textarea.style.width = '100%';
                        textarea.style.resize = 'none';
                        textarea.style.overflow = 'hidden';
                        textarea.style.whiteSpace = 'pre-wrap';
                        textarea.style.wordBreak = 'break-word';
                        textarea.style.height = "30px"


                        textarea.addEventListener('input', () => {
                            this.autoResizeTextarea(textarea);
                        });

                        // Optionally trigger once to set initial height
                        // this.autoResizeTextarea(textarea);


                        cell.innerHTML = '';
                        cell.appendChild(textarea);

                        } else if (cell.tagName === 'TD') {
                            cell.innerHTML = ''; // Clear other TDs
                        }
                    });

                    tbody.insertBefore(newRow, currentRow.nextSibling); // Insert after clicked row
                    this.hideContextMenu();
                    this.recordHasBeenChanged = true;
                }
            }           
            else if (event.target.classList.contains('data-launch-export-all-records')) {
                this.export()
            }
            else if (event.target.classList.contains('data-launch-mot-reconciliation-save-button')) {
                this.saveMotReconciliationRecord()   
            }
            else if (event.target.classList.contains('data-launch-mot-reconciliation-submit-button')) {
                if (Number(this.data.status) === 1) {
                    this.showCRUDAlert('Reconciliation has already been submitted', "success")
                }
                else {
                    this.saveMotReconciliationRecord()
                        .then(() => this.submitMotReconciliationRecord())
                        .catch(() => {
                            this.showCRUDAlert('Submit blocked because save failed', "error");
                        });
                }
            }
            else if (event.target.classList.contains('data-launch-mot-reconciliation-back-to-garage-view')) {
                // changePage(null, this.garageId, 'garage')
                document.getElementById('garagePage').classList.remove('data-launch-hide')
                document.getElementById('motReconciliationsPage').classList.add('data-launch-hide')
            }
            else if (event.target.classList.contains('data-launch-mot-reconciliation-import-garage-boooking-reports-from-data-launch-system')) {
                this.findBookingsInOurSystem()
            }           
        };
        MOTReconciliation.activeClickHandler = this.boundPageClickHandler;
        page.addEventListener('click', this.boundPageClickHandler);
    }    
}
window.addEventListener('contextmenu', function (e) {
    if (e.target.closest('.data-row')) {
        e.preventDefault();
    }
});
});