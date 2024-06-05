document.addEventListener("DOMContentLoaded", function () {
  const searchParams = new URLSearchParams(window.location.search);
  const employeeId = searchParams.get("id");
  const token = sessionStorage.getItem("token");
  const form = document.getElementById('employeeForm');

  document.getElementById('back').addEventListener('click', function() {
    window.location.href = 'dashboard.html';
  });

  form.addEventListener('submit', updateEmployee)

  if (!employeeId || !token) {
    console.error("Employee ID or token is missing");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  // GET EMPLOYEE
  fetch(
    `http://localhost:8080/admin/employee/getById?id=${employeeId}`,
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((employeeData) => {
      document.getElementById("firstName").value = employeeData.firstName;
      document.getElementById("lastName").value = employeeData.lastName;
      document.getElementById("email").value = employeeData.email;
      document.getElementById("role").value = employeeData.role;
      document.getElementById("address").value = employeeData.address;
      document.getElementById("phone").value = employeeData.phone;
      document.getElementById("hireDate").value = employeeData.hireDate;
      document.getElementById("birthDate").value = employeeData.birthDate;
      document.getElementById('CF').value = employeeData.fiscalCode;

      // Fetch department data
      fetch("http://localhost:8080/admin/department/getAll", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((departmentsData) => {
          const departmentSelect = document.getElementById("department");
          departmentsData.forEach((department) => {
            const option = document.createElement("option");
            option.value = department.id;
            option.textContent = department.name;
            if (department.id === employeeData.department.id) {
              option.selected = true;
            }
            departmentSelect.appendChild(option);
          });
        })
        .catch((error) => console.error("Error fetching departments:", error));
    })
    .catch((error) => console.error("Error fetching employee:", error));
});

//FUNCTION TO UPDATE AN EMPLOYEE
function updateEmployee(event) {
  event.preventDefault();
  const searchParams = new URLSearchParams(window.location.search);
  const employeeId = searchParams.get("id");
  const token = sessionStorage.getItem("token");
  const form = document.getElementById("employeeForm");

  const firstName = form.elements["firstName"].value;
  const lastName = form.elements["lastName"].value;
  const email = form.elements["email"].value;
  const role = form.elements["role"].value;
  const address = form.elements["address"].value;
  const phone = form.elements["phone"].value;
  const hireDate = form.elements["hireDate"].value;
  const birthDate = form.elements["birthDate"].value;
  const departmentId = parseInt(form.elements["department"].value);
  const CF = form.elements['CF'].value;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    id: employeeId,
    firstName: firstName,
    lastName: lastName,
    email: email,
    role: role,
    hireDate: hireDate,
    birthDate: birthDate,
    phone: phone,
    address: address,
    department: {
      id: departmentId,
    },
    fiscalCode: CF
  });

  console.log(raw);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8080/admin/employee/update", requestOptions)
  .then((response) => response.text())
  .then((result) => {
    console.log(result);
    window.location.href = "dashboard.html";
  }
)
  .catch((error) => console.error(error));


  if ($('#photo')[0].files[0]) {
    var formData = new FormData();
    formData.append("image", $('#photo')[0].files[0]);
  
    var settings = {
      "url": `http://localhost:8080/admin/employee/uploadPhoto/${employeeId}`,
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Authorization": token
      },
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": formData
    };
  
    $.ajax(settings).done(function (response) {
      console.log(response);
      window.location.href = "dashboard.html";
    });
  }
  
}
