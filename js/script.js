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
        window.location.href = 'dashboard.html';
        return response.headers;
    })
    .then(headers => {
        const token = headers.get('Authorization'); 
        if (token) {
            sessionStorage.setItem('token', token); 
        } else {
            console.error('Token not found in response headers');
        }
    })
    .catch(error => console.error('Error:', error));
});
