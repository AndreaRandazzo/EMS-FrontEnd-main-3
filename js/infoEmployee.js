document.addEventListener("DOMContentLoaded", function () {
  const searchParams = new URLSearchParams(window.location.search);
  const employeeId = searchParams.get("id");
  const token = sessionStorage.getItem("token");
  const goToUpdate = document.getElementById('update');
  const goBack = document.getElementById('back');

  goToUpdate.addEventListener('click', function() {
      window.location.href = 'updateEmployee.html?id=' + employeeId;
  })

  goBack.addEventListener('click', function() {
    window.location.href = 'dashboard.html';
  })


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

  // Fetch employee data
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
      document.getElementById("department").value = employeeData.department.name;
      document.getElementById("fiscalCode").value = employeeData.fiscalCode;
    })
    .catch((error) => console.error("Error fetching employee:", error));
});
