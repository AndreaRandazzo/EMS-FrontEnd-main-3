$(document).ready(function() {
    let token = sessionStorage.getItem('token');
    let employeeId = sessionStorage.getItem('id');

    findEmployeeById(employeeId, token);

    $('#logoutBtn').on('click', function() {
        handleLogout();
    })
});


function handleLogout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

function findEmployeeById(id, token) {
    var settings = {
        "url": "http://localhost:8080/manager/employee/getByManagerDepartment?managerId=" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": token
        },
    };
      
    $.ajax(settings).done(function (response) {
        console.log(response);
        populateEmployeesContainer(response);
    });
}

function populateEmployeesContainer(employees) {
    const container = $('#employeesContainer');
    const managerContainer = $('#managerContainer');

    container.empty(); 

    employees.forEach(employee => {
        let src = "http://localhost:8080/" + employee.pathImage;
        if (!employee.pathImage) {
            src = "../res/user.png";
        }

        if (employee.roleEnum === "MANAGER") {
            const managerCard = $(`
                <div class="employee-card manager-card">
                    <img src="${src}" alt="Manager Image">
                    <p><strong>${employee.firstName} ${employee.lastName}</strong></p>
                    <p><strong>Role: ${employee.role}</strong></p>
                    <p class="manager-label">Department Manager</p>
                </div>
            `);
            managerContainer.prepend(managerCard);
        } else {
            const employeeCard = $(`
                <div class="employee-card">
                    <img src="${src}" alt="Employee Image">
                    <p><strong>${employee.firstName} ${employee.lastName}</strong></p>
                    <p><strong>Role: ${employee.role}</strong></p>
                </div>
            `);
            container.append(employeeCard);
        }
    });
}
