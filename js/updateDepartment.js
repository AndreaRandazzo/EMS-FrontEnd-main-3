$(document).ready(function() {

    let token = sessionStorage.getItem('token');
    if (!token) {
        console.log("Error with token");
    }
    const searchParams = new URLSearchParams(window.location.search);
    const departmentId = searchParams.get("id");

    //call to get department info
    var settings = {
        "url": "http://localhost:8080/admin/department/get/" +departmentId,
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": token
        },
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        $('#name').val(response.name);
        $('#description').val(response.description);
      });


    //call to update department

    $('#submit-btn').on('click', function(event) {
        event.preventDefault();

        var settings = {
            "url": "http://localhost:8080/admin/department/update",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Authorization": token,
              "Content-Type": "application/json"
            },
            "data": JSON.stringify({
              "id": departmentId,
              "name": $('#name').val(),
              "description": $('#description').val()
            }),
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
          })
          .catch((error) => console.log(error.responseJSON));
          

    })
})