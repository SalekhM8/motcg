function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        // fetchData('data_launch_users', 1, 0, null, null, null, null, username, password)
        fetchLogin(username, password).then(data => {
            document.getElementById('alertBoxLoginFailure').classList.remove('active');

            if (data[0] !== undefined) {
                document.getElementById('successBoxLogin').classList.add('active');

                let first = data[0].first_name;
                let second = data[0].last_name;
                let userId = data[0].id;
                let fullUser = data[0].full_user;
                let garageId = data[0].garage_id || null;

                // ✅ Store user details in localStorage (accessible by script.js)
                localStorage.setItem("full_user", fullUser);
                localStorage.setItem("first_name", first);
                localStorage.setItem("last_name", second);
                localStorage.setItem("user_id", userId);
                if (garageId) {
                    localStorage.setItem("garage_id", garageId);
                }

                // Redirect after a delay
                setTimeout(() => {
                    window.location.href = '/home.html';
                }, 2000);
            } else {
                document.getElementById('alertBoxLoginFailure').classList.add('active');
            }
        });
    }
}

function forgotPassword () {
    document.getElementById('forgotPasswordModal').classList.add('active');
}

function closeModal() {
    document.getElementById('forgotPasswordModal').classList.remove('active');
}

function submitEmail() {
    let email = document.getElementById('emailInput').value;
    fetchData('data_launch_users', 1, 0, null, null, null, null, email, null).then(data => {
        if (data[0] !== undefined) {
            let first = data[0].first_name;
            let second = data[0].last_name;
            let userId = data[0].id;
            let fullUser = data[0].full_user;
            let garageId = ''
            if (data[0].garage_id !== undefined) {
                garageId = data[0].garage_id;
                document.cookie = `garage_id=${garageId}; path=/`;
            }
            document.cookie = `full_user=${fullUser}; path=/`;
            document.cookie = `first_name=${first}; path=/`;
            document.cookie = `last_name=${second}; path=/`;
            document.cookie = `user_id=${userId}; path=/`;
            var emailParams = {
                to_email: email, // Replace with the recipient's email address
                from_name: 'support@vtspro.co.uk',
                garage_id: garageId,
                first_name: first,
                last_name: second
            };            
            // Send the email
// service_ykm9x5e
            // old hotmail account
            // emailjs.send('service_dlq', 'template_9q4c1yd', emailParams)
            /// new support@vtspro.co.uk
            emailjs.send('service_ykm9x5e', 'template_9q4c1yd', emailParams)
                .then(response => {
                    console.log('SUCCESS!', response.status, response.text);
                    closeModal();
                    document.getElementById('successBoxForgotPassword').classList.add('active')
                    setTimeout(() => {
                        document.getElementById('successBoxForgotPassword').classList.remove('active')
                    }, 2000);  
                }, error => {
                    console.error('FAILED...', error);
                });  
        }
        else {
            document.getElementById('alertBoxForgotPasswordFailure').classList.add('active')
            setTimeout(() => {
                document.getElementById('alertBoxForgotPasswordFailure').classList.remove('active')
            }, 2000);
        }
    });
}



