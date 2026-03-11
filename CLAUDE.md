# MOTCG - MOT Compliance Group Platform

## Architecture

Single-page vanilla-JS app with one Express backend and MySQL (JawsDB).
**No bundler, no ES modules, no framework.** Global-script, load-order-dependent.

### Critical Files (by importance)
| File | Lines | Role |
|------|-------|------|
| `Site/garages.js` | 11,008 | Center of gravity. Garage CRUD, bookings, QC, audits, equipment, calibration, reminders, permissions |
| `server.js` | 2,122 | Entire Express backend. All routes, DB pool, S3, email, DVSA, AutoGuru, cron |
| `Site/script.js` | 922 | Bootstrap, globals, fetchData/createRecord/updateRecord/deleteRecord, page switching, auth |
| `Site/subgrid.js` | 2,160 | Renders all subgrid tables + booking bay-grid with week navigation |
| `Site/testers.js` | 2,267 | Tester records and training |
| `Site/motReconciliation.js` | 1,899 | Reconciliation flow, spreadsheet parsing |
| `Site/qcCheckWizard.js` | 1,190 | QC check wizard (cars + bikes) |
| `Site/siteAuditWizard.js` | 896 | Site audit wizard |
| `Site/home.html` | 224 | SPA shell, script load order, page containers |

### Script Load Order (matters!)
```
subgrid.js -> carTqi.js -> motEquipment.js -> motCalibration.js -> testingStation.js
-> qcCheckWizard.js -> siteAuditWizard.js -> garages.js -> testers.js
-> globalOptionSets.js -> motReconciliation.js -> specialNotices.js -> aeLogins.js
-> script.js (LAST - contains shared helpers)
```

### Key Global Functions (script.js)
- `fetchData(table, limit, offset, id, garageId, testerId, imagesAssociatedRecordId, username, password, recordId, special_notice_id, user_id, record_type, create_date, multipleIds, aeLogin)` - **16 positional params, order matters**
- `createRecord(table, recordData)` - POST to /api/{table}/data
- `updateRecord(table, id, updatedData)` - PUT to /api/{table}/data/{id}
- `deleteRecord(table, id)` - DELETE to /api/{table}/data/{id}

### Key Global Variables (script.js)
- `class_invoked_*` flags - singleton guards for page classes
- `garageData`, `testersData`, `testingStationData`, `specialNoticesData`, `aeLoginsData`
- `user_ID`, `user_FULL_USER`, `USER_RECORD`, `currentPage`
- `garageClassInstantiated`, `testersClassInstantiated`, etc.

## Database

### Connection
- Pool: WhiteTip JawsDB (`DB_HOST_WHITETIP`, `DB_USER_WHITETIP`, `DB_PASSWORD_WHITETIP`, `DB_NAME_WHITETIP`)
- `connectionLimit: 10`, `dateStrings: ['DATE']` (frontend assumes string dates)

### Allowed Tables (21 + 2)
```
testing_station, data_launch_garage_records, tester_garages,
data_launch_tester_records, data_launch_notes, data_launch_mot_equipment,
data_launch_images, data_launch_mot_calibration, data_launch_mot_site_audits,
data_launch_qc_checkers_for_car, data_launch_garage_bookings,
data_launch_defect_reports, data_launch_mot_bay_cleaning_log,
data_launch_tester_training_records, data_launch_qc_checkers_for_bike,
data_launch_users, data_launch_garage_reminders, data_launch_mot_reconciliations,
data_launch_special_notices, data_launch_special_notices_acknowledgements,
data_launch_bays, data_launch_tqis, data_launch_ae_users_accessible_garages
```

### Generic CRUD
Backend trusts frontend payloads completely. If frontend sends a column that doesn't exist in DB, the INSERT/UPDATE fails silently. **Every new field requires DB schema change first.**

## Backend Routes (server.js)

### Generic CRUD
- `GET /api/:table/data` - Read with complex query builder (id, garage_id, tester_id, pagination, deletion filter)
- `POST /api/:table/data` - Create record
- `PUT /api/:table/data/:id` - Update record
- `DELETE /api/:table/data/:id` - Delete record

### Special Endpoints
- `GET /api/frontend-flags` - Feature flags (hidePastQcAudits)
- `GET /api/login/data` - User auth lookup
- `GET /api/mot/expiry` - DVSA MOT expiry check
- `GET /api/mot/vehicle` - DVSA vehicle metadata
- `GET /api/vehicle/:vrm` - AutoGuru vehicle lookup
- `GET /api/testing_station/search` - VTS search by number
- `POST /api/qc-check/:id/email` - Send QC results email
- `POST /api/site-audit/:id/email` - Send audit results email
- `POST /upload` - File upload (multer -> S3/local)
- `POST /login` / `POST /logout` - Auth

### Cron
- Daily 9AM: `runInspectionReminderJob()` - emails for MOT inspections due within 31 days

### Write Protection
Non-production: POST/PUT/PATCH/DELETE blocked unless `ALLOW_DB_WRITES=true`

## Deployment

### Remotes
- `salekh` -> github.com/SalekhM8/motcg.git (active deploy source)
- `origin` -> github.com/datalaunchltd/provideDevForMOTCG.git (stale)
- `heroku` -> git.heroku.com/motexpert.git (production app)

### Branches
- `staging` (current) -> `salekh/staging` -> motcg-staging Heroku app
- `main` / `salekh/main` -> motexpert Heroku app (production)
- `prod-release` -> used for surgical production patches
- **WARNING: main and staging are diverged sibling histories, NOT linear**

### Current State
- **Staging (a78b701)**: Full feature bundle (QC wizard, site audit wizard, calibration redesign, reconciliation improvements, hide-past filter)
- **Production (54c0c5b on salekh/main)**: Rolled-back old code + hide-past QC/audit env-gated patch only

### Environment Flags
- `HIDE_PAST_QC_AUDITS=true` - Hide QC/audit rows before today
- `ALLOW_DB_WRITES=true` - Enable writes in non-prod
- `NODE_ENV=production` - Production mode

## Rules for Working on This Codebase

1. **Read the full code path** before changing anything. garages.js is 11K lines and everything touches everything.
2. **DB schema first.** New frontend fields = new DB columns. Generic CRUD will fail instantly otherwise.
3. **Never change fetchData() parameter order.** 16 positional params - one shift breaks all callers.
4. **SubGrid is overloaded.** It renders simple tables AND the booking bay-grid. Changes affect both.
5. **Test singleton state.** Many classes use `class_invoked_*` flags. Stale state is a real bug source.
6. **Smallest possible changes.** This codebase punishes broad refactors.
7. **Check branch/deploy state** before every session. Don't assume main = latest.
8. **garages.js Garage class** owns: permissions (isUserAuthorized), all subgrid injection, booking validation, modal management, event delegation (~1500 lines of click handlers in addListeners).
9. **Booking system is fragile.** Sensitive to bay data, date formatting, operating hours. Conflict detection in bookingDataValidation().
10. **Feature flags change behavior materially.** Always check /api/frontend-flags usage.

## Uncommitted Changes (as of audit)
- `.gitignore` - modified
- `Site/motReconciliation.js` - modified
