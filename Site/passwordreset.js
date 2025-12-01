let email = ''
let garageId = ''
let firstName = ''
let secondName = ''
let aeUserLogin = false
document.addEventListener("DOMContentLoaded", () => {
    // Example: load content based on a query parameter
    const urlParams = new URLSearchParams(window.location.search);
    console.log('url params' ,urlParams)
    email = urlParams.get('email')
    garageId = urlParams.get('garage')
    console.log('email ',email)
    firstName = urlParams.get('f')
    secondName = urlParams.get('s')
    console.log('garageId', garageId)
    aeUserLogin = urlParams.get('ae')
    console.log('aeUserLogin')
})

function resetPassword () {
    let pwd = document.getElementById('password').value
    let confirmPwd = document.getElementById('confirm-password').value
    if (pwd === confirmPwd) {
        hideAlert()
        let obj = {}
        if (aeUserLogin === 'true' && garageId === '') {
            obj = {
                        username: email,
                        password: confirmPwd,
                        first_name: firstName,
                        last_name: secondName,
                        full_user: 0,
                        ae_login: 1
                   }
        }
        else {
            obj = {
                        username: email,
                        password: confirmPwd,
                        first_name: firstName,
                        last_name: secondName,
                        full_user: 0,
                        garage_id: garageId
                   }
        }
        fetchData('data_launch_users', 1, 0, null, null, null, null, email, null).then(data => {
            console.log('Is there any data matches for the user? ', data);
            if (data[0] !== undefined) {
                updateRecord('data_launch_users',data[0].id, obj).then(res=>{
                    console.log('res', res)
                    showSuccessBox()
                    setTimeout(() => {
                        window.location.href = '/index.html'; 
                    }, 2000);                    
                }, error => {
                    console.error('error', error)
                })
            }
        })
    }
    else {
        showAlert()
    }
}

function showSuccessBox ()  {
    document.getElementById('successBox').style.display = 'flex';
}

function showAlert() {
    document.getElementById('alertBox').style.display = 'flex';
}

// Function to hide the alert
function hideAlert() {
    document.getElementById('alertBox').style.display = 'none';
}
