$(document).ready(function() {
    const employeeId = sessionStorage.getItem('id');
    const token = sessionStorage.getItem('token'); 

    if (employeeId && token) {
        $.ajax({
            url: `http://localhost:8080/employee/getById?id=${employeeId}`,
            method: 'GET',
            headers: {
                'Authorization':  token
            },
            success: function(data) {
                console.log(data);
                $('#full-name').val(data.firstName + " " + data.lastName);
                $('#role').val(data.role);
                $('#email').val(data.email);
                
            },
            error: function(error) {
                console.error('Error fetching employee data:', error);
            }
        });
    }

    $('.toggle-password').on('click', function() {
        const passwordInput = $('#password');
        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);
        $(this).text(type === 'password' ? '👁️' : '👁️‍🗨️');
    });

    $('#update-profile').on('click', function(event) {
        event.preventDefault();

        const updateData = {
            id: employeeId,
            fullName: $('#full-name').val(),
            email: $('#email').val(),
            password: $('#password').val()
        };

        $.ajax({
            url: 'http://localhost:8080/employee/update',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(updateData),
            success: function(data) {
                console.log('Success:', data);
                alert('Profile updated successfully!');
            },
            error: function(error) {
                console.error('Error updating profile:', error);
            }
        });
    });
});
