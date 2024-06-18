let form = document.getElementById('login');
let username = document.getElementById('username');
let password = document.getElementById('password');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "username": username.value,
        "password": password.value
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://localhost:8080/all/user/login", requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        //Check user role to load the admin/employee dashboard
        
        let token = response.headers.get('Authorization');
        let tokenPayload = parseJwt(token);
        let role = tokenPayload.role;
        let id = tokenPayload.id;
        sessionStorage.setItem('token', token); 
        sessionStorage.setItem('role', role);
        sessionStorage.setItem('id', id);

        console.log(role);
        console.log(id);


        switch (role) {
            case "ADMIN":
                window.location.href = 'dashboard.html';
                break;
            case "EMPLOYEE":
                window.location.href = 'employee-dashboard.html';
                break;
            case 'MANAGER':
                window.location.href = 'manager-dashboard.html';
                break;


        }
    })
    .catch(function(jqXHR, textStatus, errorThrown) {
        let errorMessageObj = jqXHR.responseJSON;
        //let errorMessage = errorMessageObj.message;
        //console.error(errorMessage);
        //alert(errorMessage + '. Please try again.');
    });
});


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }

}
