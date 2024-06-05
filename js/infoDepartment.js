$(document).ready(function () {
  const token = sessionStorage.getItem("token");
  const searchParams = new URLSearchParams(window.location.search);
  const departmentId = searchParams.get("id");

  if (!token) {
    console.log("Error with token");
    return;
  }

  loadEmployees(departmentId);
  getDepartmentInfo(departmentId, token);
  
  const sortHandler = (order) => (event) => {
    const field = $(event.currentTarget).data("sort");
    loadEmployees(departmentId, field, order);
  };

  $(".up-sort").on("click", sortHandler("asc"));
  $(".down-sort").on("click", sortHandler("desc"));
});

//call to get department info
function getDepartmentInfo(id, token) {
  var settings = {
    "url": "http://localhost:8080/admin/department/get/"+id,
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": token
    },
  };
  
  $.ajax(settings).done(function (response) {
    $("#department-name").text(response.name);
    $("#department-description").text(response.description);
    $("#department-number-of-employees").text(response.numberOfEmployees);
  
  });
}



function loadEmployees(id, field = "firstName", order = "asc") {
  const settings = {
    url: `http://localhost:8080/all/employee/getAll/?departmentId=${id}`,
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
 
    const employeesTableBody = $("#table-content");
    employeesTableBody.html("");

    const data = response.slice(); // Clone array 
    data.sort((a, b) => {
      const valueA = a[field].toUpperCase();
      const valueB = b[field].toUpperCase();
      return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    data.forEach((emp) => {
      const row = $("<tr></tr>");

      row.append($("<td></td>").text(emp.firstName.toUpperCase()));
      row.append($("<td></td>").text(emp.lastName.toUpperCase()));
      row.append($("<td></td>").text(emp.email.toUpperCase()));
      row.append($("<td></td>").text(emp.role.toUpperCase()));
      row.append($("<td></td>").text(emp.address.toUpperCase()));
      row.append($("<td></td>").text(emp.phone));
      row.append($("<td></td>").text(emp.hireDate));
      row.append($("<td></td>").text(emp.birthDate));
      row.append($("<td></td>").text(emp.fiscalCode.toUpperCase()));
      row.append($("<td></td>").text(emp.department.name.toUpperCase()));

      employeesTableBody.append(row);
    });
  });
}

// Download table in xlsx format
document.getElementById("export-excel-button").addEventListener("click", function () {
  const htmltable = document.getElementById("employees-table");
  const wb = XLSX.utils.table_to_book(htmltable);
  XLSX.writeFile(wb, "employees_data.xlsx");
});
