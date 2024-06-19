
$(document).ready(function() {
    let token = sessionStorage.getItem('token');

    if (!token) {
        console.log('Token not found or not valid.');
        return;
    }

    function showLoading() {
        $('#loading').show();
    }

    function hideLoading() {
        $('#loading').hide();
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

    $('#generateCF').on('click', function(event) {
        event.preventDefault();

        let lname = $('#lastName').val();
        let fname = $('#firstName').val();
        let gender = $('#gender').val();
        let city = $('#city').val();
        let birthDate = new Date($('#birthDate').val());
        let day = birthDate.getDate();
        let month = birthDate.getMonth() + 1; // getMonth() returns month from 0-11
        let year = birthDate.getFullYear();

        if (lname && fname && gender && city && !isNaN(day) && !isNaN(month) && !isNaN(year)) {
            $.ajax({
                "url": `http://localhost:8080/api/generateFiscalCode`,
                "method": "GET",
                "timeout": 0,
                "data": {
                    lname: lname,
                    fname: fname,
                    gender: gender,
                    city: city,
                    day: day,
                    month: month,
                    year: year
                }
            }).done(function(response) {
                let responseObject = JSON.parse(response);
                $('#fiscalCode').val(responseObject.data.cf);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.error("Error generating fiscal code:", textStatus, errorThrown);
                alert('Error generating fiscal code. Please try again.');
            });
        } else {
            alert('Please fill in all required fields to generate the fiscal code.');
        }
    })

    // Call to add the employee
    $('#employee-form').on('submit', function(event) {
        event.preventDefault();

        if ($('#firstName').val() === '' || $('#lastName').val() === '' || $('#email').val() === '' || $('#role').val() === '' || $('#hireDate').val() === '' || $('#birthDate').val() === '' || $('#phone').val() === '' || $('#address').val() === '' || $('#department-select').val() === '' || $('#fiscalCode').val() === '') {
            console.log("Please fill in all required fields.");
            alert('Please fill in all required fields.');
            return;
        } else {
            showLoading();

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
                    "fiscalCode": $('#fiscalCode').val(),
                    "roleEnum": $('#roleEnum').val()
                }),
            };

            $.ajax(settings).done(function(response) {
                console.log(response);
                sessionStorage.setItem('employeeId', response.id);

                let photoFile = $('#photo')[0].files[0];
                if (photoFile) {
                // Call to upload the photo
            
                    var form = new FormData();
                    form.append("image", $('#photo')[0].files[0]);
                    let employeeId = sessionStorage.getItem('employeeId');

                    var uploadSettings = {
                        "url": "http://localhost:8080/employee/uploadPhoto/" + employeeId,
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
                        hideLoading();
                        window.location.href = "dashboard.html";
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("Error uploading photo:", textStatus, errorThrown);
                        hideLoading();
                        window.location.href = "dashboard.html";
                    });
                } else {
                    hideLoading();
                    window.location.href = "dashboard.html";
                }
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    let errorMessageObj = jqXHR.responseJSON;
                    let errorMessage = errorMessageObj.message;
                    let endIndex = errorMessage.indexOf("employee");
                    endIndex += "employee".length;
                    errorMessage = errorMessage.substr(0,endIndex);
                    console.error(errorMessage);
                    alert(errorMessage + '. Please try again.');
                    hideLoading();
                });
   }});
    
});




