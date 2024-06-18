$(document).ready(function() {
    let token = sessionStorage.getItem('token');
    getRequests(token);

    $('#logoutBtn').on('click', function() {
        handleLogout();
    });

    $('#requestTimeOffBtn').on('click', function() {
        handleRequestTimeOff();
    });
})

function handleLogout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

function handleRequestTimeOff() {
    window.location.href = 'request-timeoff.html';
}

function getRequests(token) {
    var settings = {
        "url": "http://localhost:8080/manager/timeoff/getAll",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": token
        },
    };

    $.ajax(settings).done(function(response) {
        displayTimeOffRequests(response);
    });
}

function displayTimeOffRequests(requests) {
    const container = $('#timeOffRequestsContainer');
    container.empty(); 

    requests.forEach(request => {
        if (request.status == "ACCEPTED") {
            const requestDiv = $(`
                <div class="timeOffRequest">
                    <p><strong>Employee:</strong> ${request.employee.firstName} ${request.employee.lastName}</p>
                    <p><strong>Department:</strong> ${request.employee.department.name}</p>
                    <p><strong>Request Date:</strong> ${request.requestDate}</p>
                    <p><strong>Start Date:</strong> ${request.startDate}</p>
                    <p><strong>End Date:</strong> ${request.endDate}</p>
                    <p><strong>Reason:</strong> ${request.reason ? request.reason : 'N/A'}</p>
                    <p><strong>Status:</strong> ${request.status}</p>
                    <button class="acceptBtn">Accept</button>
                    <button class="declineBtn">Decline</button>
                    <button class="modifyBtn">Modify</button>
                </div>
            `);

            
            requestDiv.find('.acceptBtn').on('click', function() {
                handleAcceptRequest(request);
            });

            requestDiv.find('.declineBtn').on('click', function() {
                handleDeclineRequest(request);
            });

            requestDiv.find('.modifyBtn').on('click', function() {
                handleModifyRequest(request);
            });

            container.append(requestDiv);
        }
    });
}


function updateRequest(token, request, status) {
    var settings = {
        "url": "http://localhost:8080/employee/timeoff/update",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": token,
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "id": request.id,
          "updateDate": request.updateDate,
          "startDate": request.startDate,
          "endDate": request.endDate,
          "status": status
        }),
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        getRequests(sessionStorage.getItem('token'));
      });
}



function handleAcceptRequest(request) {
    let token = sessionStorage.getItem('token');
    updateRequest(token, request, "ACCEPTED");
}

function handleDeclineRequest(request) {
    let token = sessionStorage.getItem('token');
    updateRequest(token, request, "REJECTED");
}

function handleModifyRequest(request) {
    window.location.href = 'update-timeoff-request.html?id=' + request.id;
}