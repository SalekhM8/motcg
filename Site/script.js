// Complete code with all functionalities combined

let class_invoked_testingStation = false;
let class_invoked_garage = false;
let class_invoked_testers = false;
let class_invoked_motReconciliation = false;
let class_invoked_specialNotices = false;
let class_invoked_aeLogins = false;
let aeLoginsClassInstantiated;
let testingStationData = null;
let garageClassInstantiated;
let testingStationClassInstantiated;
let testersClassInstantiated;
let specialNoticesClassInstantiated;
let currentPage;
let user_ID;
let user_FIRST_NAME;
let user_LAST_NAME;
let user_FULL_USER;
let user_GARAGE_ID;
let USER_RECORD;
let specialNoticesData;
let aeLoginsData;
let originalGarageID;
let accessibleGarages;

//// encryption test 

// async function getDecryptedData() {
//   try {
//     const response = await fetch('/decrypt');
//     const f = await response.text();
//     console.log('Decrypted Data:', f);
//   } catch (error) {
//     console.error('Error fetching decrypted data:', error);
//   }
// }

// getDecryptedData();




//// end of encyrption test

/// test delete bucketeer 
// Function to delete a file by its key (filename) from the server
async function deleteTheThing(fileKey) {
  try {
    const response = await fetch(`/files/delete/${fileKey}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // alert(`File deleted successfully: ${fileKey}`);
      console.log('file deleted successfully')
    } else {
      const error = await response.text();
      // alert(`Failed to delete file: ${error}`);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    // alert('An error occurred while deleting the file.');
  }
}


// const fileKey1 = 'example2 (3).txt';  
// deleteTheThing(fileKey1);  // Call the delete function

async function fetchPresignedUrl(fileName) {
  try {
    const response = await fetch(`/get-presigned-url?fileName=${encodeURIComponent(fileName)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch pre-signed URL');
    }
    const data = await response.json();
    return data.url;  // This is the pre-signed URL
  } catch (err) {
    console.error('Error fetching pre-signed URL:', err);
  }
}

async function getImageDocUrl(fileName) {
  const url = await fetchPresignedUrl(fileName);
  if (url) {
    // console.log('Pre-signed URL:', url);
    return url;
  }
  return null;
}

// getImageDocUrl('example2.txt')


// Function to decode encoded strings
function decodeVTS(encodedString) {
    const prefix = '[VTS_]';
    if (encodedString.startsWith(prefix)) {
      const base64String = encodedString.substring(prefix.length);
      // Decode base64 string to UTF-8
      const decodedString = atob(base64String);
      return decodedString;
    }
    return encodedString;
}


function changePage(event, id, urlRedirectToPage) {
    if (event) {
        event.stopPropagation();
    }
    let desiredPage = '';
    if (urlRedirectToPage) {
        desiredPage = urlRedirectToPage
    }
    else {
        event.target.classList.forEach((item, index) => {
            if (item === 'data-launch-change-page') {
            desiredPage = event.target.getAttribute('data-launch-menu-item');
            }
        });
    }
    if (desiredPage === 'Home') {
      if (!document.body.classList.contains('data-launch-home-page-image')) {
        document.body.classList.add('data-launch-home-page-image')
      }      
    }
    else {
      document.body.classList.remove('data-launch-home-page-image')
    }
    let x = Array.from(document.getElementsByClassName('data-launch-main-screen'));
    x.forEach(el => {
        if (!el.classList.contains('data-launch-hide')) {
        el.classList.add('data-launch-hide');
        }
    });

    for (let i = 0; i < x.length; i++) {
        let attr = x[i].attributes;
        for (let y = 0; y < attr.length; y++) {
        if (attr[y].name === 'data-launch-page') {
            if (attr[y].value === desiredPage) {
            attr[y].ownerElement.classList.remove('data-launch-hide');
            }
        }
        }
    }
    let label = '';
    if (desiredPage === 'testingStation') {
      label = 'Testing Stations'
      if (class_invoked_testingStation === false) {
        class_invoked_testingStation = true;
        if (id) {
          testingStationClassInstantiated = new TestingStation(id);
        }
        else {
          testingStationClassInstantiated = new TestingStation();
        }
      }
      else {        
        if (id) {
          testingStationClassInstantiated.openFormLaunchPad(true, id)
        }        
      }
    } else if (desiredPage === 'garage') {
      label = 'Garages'
      if (class_invoked_garage === false) {
        class_invoked_garage = true;
        if (id) {
          garageClassInstantiated = new Garage(id);
        } else {
          garageClassInstantiated = new Garage();
        }        
      }
      else {
        if (id) {
          let rec;
          for (let i = 0; i < garageData.length; i++) {
              if (garageData[i].id === parseInt(id)) {
                  rec = garageData[i]
              }        
          }          
          garageClassInstantiated.openForm(true, rec)
        }
        else {
          // fetchData('data_launch_garage_records', 50, null, null, null, null, null, null, null, null, null, null, null, dateUserLoggedIn).then(res => {
          //   let newRowsToAdd = []
          //   for (let i = 0; i < res.length; i++) {
          //     let match = false
          //     for (let t = 0; t < garageData.length; t++) {
          //         if (parseInt(res.id) === parseInt(garageData.id)) {
          //           match = true
          //         }       
          //     }
          //     if(match === false) {
          //       newRowsToAdd.push(res[i])
          //       garageData.push(res[i])
          //     }            
          //   }
          //   if (newRowsToAdd.length > 0) {
          //     garageClassInstantiated.renderHTMLHeader(true)
          //   }
          // }) 
          garageClassInstantiated.renderHTMLHeader(true);
        }            
      }
    }
     else if (desiredPage === 'testerRecords') {
      label = 'Testers'
      if (class_invoked_testers === false) {
        class_invoked_testers = true
        if (id) {
          testersClassInstantiated = new Testers(id);
        } else {
          testersClassInstantiated = new Testers();
        }
      }
      else {        
        if (id) {
          testersClassInstantiated.openForm(true, id)
        }        
      }
    } 
    else if (desiredPage === 'specialNotices') {
      label = 'Special Notices'
      if (class_invoked_specialNotices === false) {
        class_invoked_specialNotices = true
        if (id) {
          specialNoticesClassInstantiated = new SpecialNotices(id);
        } else {
          specialNoticesClassInstantiated = new SpecialNotices();
        }
      }
      else {        
        if (id) {
          specialNoticesClassInstantiated.openForm(true, id)
        }        
      }
    }
    else if (desiredPage === 'aeLogins') {
      label = 'AE Logins'
      if (class_invoked_aeLogins === false) {
        class_invoked_aeLogins = true
        if (id) {
          aeLoginsClassInstantiated = new AELogins(id);
        } else {
          aeLoginsClassInstantiated = new AELogins();
        }
      }
      else {        
        if (id) {
          aeLoginsClassInstantiated.openForm(true, id)
        }        
      }
    }


    else if (desiredPage === 'motReconciliations') {
      if (class_invoked_motReconciliation === false) {
        class_invoked_motReconciliation = true;
        new MOTReconciliation();
        label = 'MOT Reconciliations'
      }       
    }
    document.getElementById('data-launch-side-bar').classList.remove('data-launch-activate-menu');
    document.getElementById('data-launch-current-item-header').innerHTML = label;
}


(function() {
    emailjs.init("nOVy_MTjfwOeJAa8W"); // MOTCG EmailJS Public Key
    })
();

// define('smsapi', [], function() {
//   return {
//     sendSMS: function(number, message) {
//       console.log('Sending SMS to ' + number + ': ' + message);
//     }
//   };
// });

// var smsapi2;
// require(['smsapi'], function(smsapi) {
//   smsapi.sendSMS('+447584433817', 'Hello, World!');
//   smsapi.sms.sendSms('+447584433817', 'My first message!').then(
//     function res(res) {
//       console.log('res', res);
//     },
//     function err(err) {
//       console.error(err);
//     }
//   );
//   smsapi2 = new smsapi('L8ktAalrNomQiTI3dnXfIGqF5xYHMLRo7NIWaP41');
// });

function toggleMenu() {
  document.getElementById('data-launch-side-bar').classList.toggle('data-launch-activate-menu');
}

function closeMenu() {
  document.getElementById('data-launch-side-bar').classList.remove('data-launch-activate-menu');
}

function logout() {
  logoutUser()
}

document.addEventListener("DOMContentLoaded", async () => {
    // Example usage of create, update, and fetch functions
    const path = window.location.pathname;
    const page = path.split("/").pop();
    if (page === 'index.html') {
      // console.log('its only the login page, no need to fetch the data')
    }
    else if (page === "home.html") {
      fetchInitialData()
        // 🔎 Example: get MOT expiry for RO06 XXN on launch
      // const mot = await fetchMotExpiry('RO06XXN');
      // if (mot) {
      //   console.log(`MOT expiry for ${mot.registration}:`, mot.expiryDate, `(last result: ${mot.lastTestResult} on ${mot.lastCompletedDate})`);
      //   // TODO: render into your UI if desired:
      //   // document.getElementById('some-element').textContent = mot.expiryDate || 'N/A';
      // }
      // else {
      //   console.warn('No MOT data for RO06 XXN');
      // }
      // const meta = await fetchVehicleMeta('RO06 XXN');
      // console.log('Vehicle meta:', meta);
    }
  })

  // Function to get a specific cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

let dateUserLoggedIn;

async function fetchInitialData() {
  try {
    user_FIRST_NAME = localStorage.getItem("first_name") || "Unknown";
    user_LAST_NAME = localStorage.getItem("last_name") || "User";
    user_ID = localStorage.getItem("user_id") || "0";
    user_FULL_USER = localStorage.getItem("full_user") || "0";
    user_GARAGE_ID = localStorage.getItem("garage_id") || null;
    dateUserLoggedIn = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (user_FIRST_NAME === "Unknown") {
      window.location.href = "/index.html";
      return;
    }

    const loginResult = await fetchLogin(null, null, parseInt(user_ID));
    USER_RECORD = loginResult[0];
    console.log('user_GARAGE_ID', user_GARAGE_ID)
    console.log('USER_RECORD.garage_id ', USER_RECORD.garage_id )
    if (USER_RECORD.garage_id !== null) {    
      // User has a garage_id — load tester records, special notices, garage records
      try {
        const [testerRecords, specialNotices, garageRecords] = await Promise.all([
          fetchData('data_launch_tester_records', 1500),
          fetchData('data_launch_special_notices', 1000),
          fetchData('data_launch_garage_records', 1500)
        ]);
      
        testersData = testerRecords;
        specialNoticesData = specialNotices;
        garageData = garageRecords;
      
        document.getElementById('data-launch-toggle-menu-button').style.display = 'none';
      
        // Now that all data has successfully loaded, call changePage
        originalGarageID = user_GARAGE_ID;
        changePage(null, user_GARAGE_ID, 'garage');
      
      } catch (error) {
        console.error('Failed to fetch all data:', error);
        // Optional: Show error message to user
        window.location.href = "/errorPage.html"; // Redirect to error page
      }

    }
    else if (USER_RECORD.ae_login === 1) {
      /// user has an ae login, fetch the garages that they can access
       try {
        const [testerRecords,accessibleGaragesRaw] = await Promise.all([
          fetchData('data_launch_tester_records', 1500),
          fetchData('data_launch_ae_users_accessible_garages', 1500, 0,null,null,null, null,null,null,null, null, USER_RECORD.id)
        ]);
        accessibleGarages = accessibleGaragesRaw.map(g => g.garage_id);
        console.log('accessibleGarages are', accessibleGarages)
        const garageRecords = await fetchData('data_launch_garage_records', 1500, 0, null,null,null,null,null,null,null,null,null,null,null, accessibleGarages, true)
        console.log('garage records that this AE USER Can access', garageRecords)
        testersData = testerRecords;
        garageData = garageRecords;         
        document.getElementById('data-launch-toggle-menu-button').style.display = 'none';
        changePage(null, null, 'garage')  
        //// now need to restrict the other tables that the user sees from the navigation
      } catch (error) {
        console.error('Failed to fetch all data:', error);
        // Optional: Show error message to user
        window.location.href = "/errorPage.html"; // Redirect to error page
      }
    }    
    else {
      // User does NOT have a garage_id — admin loading flow

      // ✅ Set user's name
      document.getElementById('data_launch_logged_in_as_banner').innerHTML =
        `Logged in as: ${user_FIRST_NAME} ${user_LAST_NAME}`;

      try {
        // ✅ Fetch all required data in parallel
        const [testingStations, garages, testers, notices, aeLogins] = await Promise.all([
          fetchData('testing_station', 150),
          fetchData('data_launch_garage_records', 1500),
          fetchData('data_launch_tester_records', 1500),
          fetchData('data_launch_special_notices', 1000),
          fetchData('data_launch_users', 1000, null, null, null, null, null, null, null, null, null, null, null, null, null, 1)
        ]);

        testingStationData = testingStations;
        garageData = garages;
        testersData = testers;
        specialNoticesData = notices;
        aeLoginsData = aeLogins

        // ✅ Then sequentially get all the Max IDs
        testing_station_next_id = (await getMaxId('testing_station')) + 1;
        tester_record_next_id = (await getMaxId('data_launch_tester_records')) + 1;
        garage_record_next_id = (await getMaxId('data_launch_garage_records')) + 1;

        document.getElementById('data-launch-toggle-menu-button').style.display = 'flex';
        document.getElementById('data-launch-home-page-card-navigations').style.display = 'block';
      }
      catch (error) {
        console.error('Failed to fetch all data:', error);
        window.location.href = "/errorPage.html"; // Redirect to error page
      }
    }

  } catch (error) {
    console.error('❌ Error in fetchInitialData:', error);
    // showCRUDAlert("There was a problem loading your data. Please refresh the page.", 'error');
    window.location.href = "/errorPage.html"; // Redirect to error page
    // showServiceUnavailableMessage()
  }
}


function showServiceUnavailableMessage() {
  const errorDiv = document.createElement("div");
  errorDiv.style.position = "fixed";
  errorDiv.style.top = "50%";
  errorDiv.style.left = "50%";
  errorDiv.style.transform = "translate(-50%, -50%)";
  errorDiv.style.background = "white";
  errorDiv.style.border = "1px solid #ccc";
  errorDiv.style.padding = "30px";
  errorDiv.style.zIndex = "9999";
  errorDiv.style.textAlign = "center";
  errorDiv.style.boxShadow = "0 0 15px rgba(0,0,0,0.3)";
  errorDiv.innerHTML = `
    <h2>Service Unavailable</h2>
    <p>Were having trouble connecting to the server.<br>Please refresh the page or try again later.</p>
    <button id="retry-button">Retry</button>
  `;
  document.body.appendChild(errorDiv);

  document.getElementById("retry-button").addEventListener("click", () => {
    window.location.reload();
  });
}

function showCRUDAlert(message, type) {
  const alertBox = document.getElementById("HOMEPAGE-data-launch-crud-alert-box");
  const alertMessage = document.getElementById("HOMEPAGE-data-launch-crud-alert-message");
  const alertIcon = document.getElementById("HOMEPAGE-data-launch-crud-alert-icon");

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





  // Function to update a record
  async function updateRecord(table, id, updatedData) {
    try {
      const response = await fetch(`/api/${table}/data/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
    
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error updating record: ${error.message}`);
      } else {
        const result = await response.json();
        // console.log('Record updated successfully:', result);
        return result
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  function hideLoginSentSuccessAlert () {
    document.getElementById('successBox-sendingLoginEmail').style.display = 'none'
  }
  
  async function fetchData(table, limit = 50, offset = 0, id = null, garageId = null, testerId = null, imagesAssociatedRecordId = null, username = null, password = null, recordId = null, special_notice_id = null, user_id = null, record_type = null, create_date = null, multipleIds = null, aeLogin = null) {
    try {
        let url = `/api/${table}/data?limit=${limit}&offset=${offset}`;
        if (id) {
            url += `&id=${id}`;
        }
        if (multipleIds) {
            url += `&ids=${multipleIds.join(',')}`; // Append multiple IDs
        }
        if (garageId) {
            url += `&garage_id=${garageId}`;
        }
        if (testerId) {
            url += `&tester_id=${testerId}`
        }
        if (imagesAssociatedRecordId) {
            url += `&record_id=${imagesAssociatedRecordId}`
        }
        if (recordId) {
            url += `&record_id=${recordId}`
        }
        if (record_type) {
            url += `&record_type=${record_type}`
        }
        if (username && password) {
          url += `&username=${username}&password=${password}`
        }
        else if (username) {
          url += `&username=${username}`
        }
        if (special_notice_id && user_id) {
          url += `&special_notice_id=${special_notice_id}&user_id=${user_id}`
        }
        if (create_date){
          url += `&create_date=${dateUserLoggedIn}`
        }
        if (USER_RECORD) {
          url += `&logged_in_user_id=${USER_RECORD.id}`
        }
        if (aeLogin) {
          url += `&ae_login=${aeLogin}`
        }
        if (user_id) {
          url += `&user_id=${user_id}`
        }
        const response = await fetch(url);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Error fetching data: ${error.message}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error.message);
    }
}

async function fetchLogin (username, password, id) {
  try {
    let url = `/api/login/data?`
    if (username && password) {
          url += `&username=${username}&password=${password}`
    }
    else if (id) {
        url += `&id=${id}`
    }
    const response = await fetch(url);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error fetching login: ${error.message}`);
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
        console.error(error.message);
  }
}


async function checkIfVtsNumberExists (vtsNumber, excludeId = null) {
  let url = `/api/testing_station/check-vts/${encodeURIComponent(vtsNumber)}`;
  if (excludeId) {
    url += `?excludeId=${encodeURIComponent(excludeId)}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data.exists;
};
  

  async function countRows(table) {
    try {
      const url = `/api/${table}/count`; // Use the new endpoint to count rows
      const response = await fetch(url);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error fetching row count: ${error.message}`);
      }
      const data = await response.json();
      return data.count; // Return the row count
    } catch (error) {
      console.error(error.message);
    }
  }
  
  let testing_station_next_id;
  let tester_record_next_id;
  let garage_record_next_id;
  // Usage example
  // countRows('testing_station').then(count => {
  //   console.log('Number of rows in the table:', count);
  //   testing_station_next_id = count++
  // });


  async function getMaxId(table) {
    try {
      const url = `/api/${table}/max-id`; // Use the new endpoint to get the max ID
      const response = await fetch(url);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error fetching max ID: ${error.message}`);
      }
      const data = await response.json();
      return data.maxId; // Return the max ID
    } catch (error) {
      console.error(error.message);
    }
  }
  
async function createRecord(table, recordData) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`/api/${table}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recordData)
      });
      
      if (!response.ok) {
        const error = await response.json();  // Attempt to parse the error response
        reject(new Error(`Error creating record: ${error.message || response.statusText}`));  // Use the detailed error message if available
      } else {
        const result = await response.json();
        resolve(result);
      }
    } catch (error) {
      reject(new Error(`Error creating record: ${error.message}`));
    }
  });
}

async function deleteRecord(table, id) {
  if (user_FULL_USER === '0') {
    return Promise.reject("User doesn't have the necessary privileges");
  }
  try {
    const response = await fetch(`/api/${table}/data/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error deleting record: ${error.message}`);
    } else {
      const result = await response.json();
      // console.log('Record deleted successfully:', result);
      return result;  // Return the result of the deletion
    }
  } catch (error) {
    console.error(error.message);
    return Promise.reject(error.message);  // Return a rejected promise with the error message
  }
}

  // // Function to delete a record
  // async function deleteRecord(table, id) {
  //   try {
  //     const response = await fetch(`/api/${table}/data/${id}`, {
  //       method: 'DELETE'
  //     });
    
  //     if (!response.ok) {
  //       const error = await response.json();
  //       throw new Error(`Error deleting record: ${error.message}`);
  //     } else {
  //       const result = await response.json();
  //       console.log('Record deleted successfully:', result);
  //     }
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // }

  // Example: Load content based on a URL parameter or user action
// document.addEventListener("DOMContentLoaded", () => {
//     // Example: load content based on a query parameter
//     const urlParams = new URLSearchParams(window.location.search);
//     console.log('url params' ,urlParams)
//     let garageId = urlParams.get('garage')
//     console.log('garageId ',garageId)
//     if (garageId) {
//         fetchData('data_launch_garage_records', null, null, garageId).then(
//             function success (res) {
//                 console.log('result is', res)
//                 garageData = res
//                 changePage(null, garageId, 'garage')
//             },
//             function error (err) {
//                 console.error(err)
//             }
//         )
//     }
//     // new Garage(garageId);
//     // const section = urlParams.get('section') || 'default'; // Default or fallback section
//     // loadContent(section);
// });

// let imageValues = []

// let elll = document.getElementById('uploader-preview-here-1335')

// elll.addEventListener("fileUploadSuccess", function (e) {
//   console.log('file upload data this ', this)
//   console.log(this.value) // The url of the uploaded file
//   console.log(e.detail.files) // Array of file details 
//   imageValues.push(this.value)
//   this.value = '';  // Clears the input value
//   console.log('currentPage is ', currentPage)
//   if (currentPage === 'Testers') {
//     testersClassInstantiated.closeTheSimpleImageUploadWindow(e.detail.files)
//   }
//   else if (currentPage === 'Garages') {
//     garageClassInstantiated.closeTheSimpleImageUploadWindow(e.detail.files)
//   }
// })

// document.body.addEventListener('click', event => {
//   console.log('event', event)
//   if (event.target.classList.contains('data-launch-simple-file-upload-button')) {
//     console.log('clicked data launch simple file upload button dz-preview dz-image-preview dz-processing dz-success dz-complete')
//     let elements = document.querySelectorAll('.dz-preview.dz-image-preview.dz-processing.dz-success.dz-complete');
//     elements.forEach(el => {el.style.display = 'none'})
//   } 
// })



async function getVehicleData(vrm) {
  try {
      const response = await fetch(`/api/vehicle/${vrm}`);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const vehicleData = await response.json();
      console.log("Vehicle Data:", vehicleData);
      // let make = vehicleData.GetVehicles.DataArea.Vehicles.Vehicle.DVLA_Make
      // let model = vehicleData.GetVehicles.DataArea.Vehicles.Vehicle.DVLA_Model
      return vehicleData;
  } catch (error) {
      console.error("Error fetching vehicle data:", error);
  }
}





//////  timeout feature /////


let idleTime = 0;
let countdownTime = 30;
let countdownInterval;
const logoutWarningPopup = document.createElement("div");

// Function to reset idle timer
function resetIdleTimer() {
    idleTime = 0;
    if (logoutWarningPopup.parentNode) {
        logoutWarningPopup.remove(); // Hide popup if user interacts
        clearInterval(countdownInterval);
    }
}

// Function to start countdown
function startCountdown() {
    logoutWarningPopup.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; padding: 20px; border: 1px solid #ccc; z-index: 1000;">
            <p>You will be logged out in <span id="countdown">${countdownTime}</span> seconds.</p>
            <button id="stayLoggedIn">Stay Logged In</button>
        </div>`;
    document.body.appendChild(logoutWarningPopup);

    // Start countdown
    countdownInterval = setInterval(() => {
        countdownTime--;
        document.getElementById("countdown").textContent = countdownTime;
        
        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            logoutUser();
        }
    }, 1000);

    // If user clicks "Stay Logged In", reset timer
    document.getElementById("stayLoggedIn").addEventListener("click", resetIdleTimer);
}

// Function to log out user
// function logoutUser() {
//   fetch('/logout', { method: 'POST' })
//     .then(() => {
//         localStorage.clear(); // Clear all stored user data        
//         document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//         sessionStorage.clear();
//         window.location.href = "/index.html"; // Redirect to login
//     })
//     .catch(err => console.error("Logout error:", err)); 
// }


function logoutUser() {
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.clear();
      sessionStorage.clear();      
      // console.log("✅ Logout complete, redirecting...");
      window.location.href = "/index.html";
}



// Increment idle time every minute
setInterval(() => {
    idleTime++;

    if (idleTime >= 10) { // 10 minutes of inactivity
        startCountdown();
    }
}, 60000); // Check every 1 minute

// Reset idle timer on user activity
document.addEventListener("mousemove", resetIdleTimer);
document.addEventListener("keypress", resetIdleTimer);
document.addEventListener("click", resetIdleTimer);
document.addEventListener("scroll", resetIdleTimer);

//// DVSA MOT HISTORY API ////


// === MOT expiry (frontend helper) ===
async function fetchMotExpiry(registration) {
  try {
    const res = await fetch(`/api/mot/expiry?registration=${encodeURIComponent(registration)}`);
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.error || `HTTP ${res.status}`);
    }
    return await res.json();  // { registration, expiryDate, lastTestResult, lastCompletedDate, make, model }
  } catch (err) {
    console.error('fetchMotExpiry error:', err.message);
    return null;
  }
}
// === end MOT expiry helper ===

async function fetchVehicleMeta(registration) {
  try {
    const res = await fetch(`/api/mot/vehicle?registration=${encodeURIComponent(registration)}`);
    if (!res.ok) throw new Error((await res.json()).error || `HTTP ${res.status}`);
    return await res.json(); // { registration, make, model, primaryColour, engineSizeCc, ... }
  } catch (e) {
    console.error('fetchVehicleMeta error:', e.message);
    return null;
  }
}

// Example call
// const meta = await fetchVehicleMeta('RO06 XXN');
// console.log('Vehicle meta:', meta);






///// END OF DVSA MOT HISTORY API //////