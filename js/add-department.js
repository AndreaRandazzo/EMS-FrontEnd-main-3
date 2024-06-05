$(document).ready(function() {
  let token = sessionStorage.getItem('token');
  if (!token) {
    console.log("Token not valid or not authorized");
}
    $('#add-department').on('click', function(event) {
        event.preventDefault();
        
        
        let name = $('#name').val();
        let description = $('#description').val();
        
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
          });
    })

    $('#back').on('click', function() {
        window.location.href = 'department.html';
    })
})