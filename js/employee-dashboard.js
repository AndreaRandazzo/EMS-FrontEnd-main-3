$(document).ready(function() {
    let token = sessionStorage.getItem('token');


    $("#requestTimeOff").on('submit', function(event) {
        event.preventDefault();
        let id = sessionStorage.getItem("id");
        let startDate = $('#startDate').val();
        let endDate = $('#endDate').val();
        let reason = $('#reason').val();
        let today = new Date().toISOString().slice(0, 10)

        if (startDate < today) {
            alert('Start date cannot be before today.');
            return;
        }
        if (endDate < startDate) {
            alert('End date cannot be before start date.');
            return;
        }


        addTimeOffRequest(token,startDate,endDate,reason,id);


    })
    
})



function addTimeOffRequest(token, startDate, endDate, reason, employeeId) {
    var settings = {
        "url": "http://localhost:8080/employee/timeoff/add",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": token,
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "startDate": startDate,
          "endDate": endDate,
          "reason": reason,
          "employee": {
            "id": employeeId
          }
        }),
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
      });
}


