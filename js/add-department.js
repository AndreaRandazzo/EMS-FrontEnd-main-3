$(document).ready(function() {
  let token = sessionStorage.getItem('token');
  if (!token) {
    console.log("Token not valid or not authorized");
    return;
  }
    $('#add-department').on('click', function(event) {
        event.preventDefault();
        
        
        let name = $('#name').val();
        let description = $('#description').val();

        if (!name || !description) {
          alert("Both name and description are required.");
          return;
        }
        
        var settings = {
            "url": "http://localhost:8080/admin/department/add",
            "method": "PUT",
            "timeout": 0,
            "headers": {
              "Authorization": token,
              "Content-Type": "application/json"
            },
            "data": JSON.stringify({
              "name": name,
              "description": description
            }),
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            window.location.href = 'department.html';
          }).fail(function (jqXHR, textStatus, errorThrown) {
            let errorMessage = jqXHR.responseJSON;
            console.log(errorMessage);
            alert(errorMessage.message + '. Please try again.');
            
          });
    })

    $('#back').on('click', function() {
        window.location.href = 'department.html';
    })
  });