$(document).ready(function() {
    let token = sessionStorage.getItem('token');

    if (!token) {
        console.log('Token not found or not valid.');
        return;
    }


    // Call to populate Department Select
    var settings = {
        "url": "http://localhost:8080/admin/department/getAll",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": token
        },
    };

    $.ajax(settings).done(function(response) {
        let allDepartments = response;
        let departmentSelect = $('#department-select');
        allDepartments.forEach(function(department) {
            const option = $("<option></option>")
                .val(department.id)
                .text(department.name);

            departmentSelect.append(option);
        });
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error fetching departments:", textStatus, errorThrown);
    });

    // Call to add the employee
    $('#employee-form').on('submit', function(event) {
        event.preventDefault();

        if ($('#firstName').val() === '' || $('#lastName').val() === '' || $('#email').val() === '' || $('#role').val() === '' || $('#hireDate').val() === '' || $('#birthDate').val() === '' || $('#phone').val() === '' || $('#address').val() === '' || $('#department-select').val() === '' || $('#fiscalCode').val() === '') {
            console.log("Please fill in all required fields.");
            $('#errorMsg').removeClass('inactive');
            $('#errorMsg').text('Please fill in all required fields.');
            return;
        } else {

            var settings = {
                "url": "http://localhost:8080/admin/employee/add",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Authorization": token,
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "firstName": $('#firstName').val(),
                    "lastName": $('#lastName').val(),
                    "email": $('#email').val(),
                    "role": $('#role').val(),
                    "hireDate": $('#hireDate').val(),
                    "birthDate": $('#birthDate').val(),
                    "phone": $('#phone').val(),
                    "address": $('#address').val(),
                    "department": {
                        "id": $('#department-select').val()
                    },
                    "fiscalCode": $('#fiscalCode').val()
                }),
            };

            $.ajax(settings).done(function(response) {
                sessionStorage.setItem('employeeId', response.id);

                // Call to upload the photo
            
                var form = new FormData();
                form.append("image", $('#photo')[0].files[0]);
                let employeeId = sessionStorage.getItem('employeeId');

                var uploadSettings = {
                    "url": "http://localhost:8080/admin/employee/uploadPhoto/" + employeeId,
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Authorization": token
                    },
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form
                };

                $.ajax(uploadSettings).done(function(response) {
                    console.log(response);
                    window.location.href = "dashboard.html";
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.error("Error uploading photo:", textStatus, errorThrown);
                });

            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.error("Error adding employee:", textStatus, errorThrown);
            });
   }});
    
});

