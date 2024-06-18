$(document).ready(function() {

    const token = sessionStorage.getItem('token');
    const searchParams = new URLSearchParams(window.location.search);
    const timeoffRequestId = searchParams.get("id");

    getRequestById(timeoffRequestId, token);
    
})



function getRequestById(id, token) {
    var settings = {
        "url": "http://localhost:8080/employee/timeoff/findById?id=" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": token
        },
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        showRequestInfo(response);
      });
}

function showRequestInfo(response) {

    let startDate = $('#startDate').val(response.startDate);
    let endDate = $('#endDate').val(response.endDate);
    let reason = $('#reason').val(response.reason);
}