$(document).ready(function () {
  console.log(sessionStorage);
  const employeesTab = document.getElementById("employees-tab");
  const departmentTab = document.getElementById("department-tab");

  employeesTab.addEventListener("click", function () {
    window.location.href = "dashboard.html";
  });

  departmentTab.addEventListener("click", function () {
    window.location.href = "department.html";
  });

  $('#addEmployee').on('click', function() {
    window.location.href = 'addEmployee.html';
  })

  $('#logout').on('click', function() {
    sessionStorage.setItem('token',null);
    window.location.href = 'index.html';
  })


  let allEmployees = [];
  getAllEmployees();


  //FUNCTION TO GET ALL EMPLOYEE

  function getAllEmployees() {
    let token = sessionStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:8080/admin/employee/getAll", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        const employeeList = document.getElementById("employee-list");
        allEmployees = result;
        

        result.forEach((employee) => {
          const employeeDiv = document.createElement("div");
          employeeDiv.className = "employee row-item";
          if (!employee.pathImage) {
            src = "../res/user.png";
          }
          else{
            src = "http://localhost:8080/" + employee.pathImage;
          }
          const employeeInfo = `
              <div id="employeeInfo">
                <div class="imageContainer">
                  <input class="id" type="text" hidden value="${employee.id}">
                  <img src="${src}">
                </div>
                <div class="infoContainer">
                  <p>Full Name: ${employee.firstName} ${employee.lastName}</p>
                  <p>Birth Date: ${employee.birthDate}</p>
                  <p>Department: ${employee.department.name}</p>
                </div>
              </div>
              <div class="employee-actions">
                <button class="infoEmployee" onclick="showInfo(${employee.id})">Info</button>
                <button class="deleteEmployee" onclick="deleteEmployee(${employee.id})">Delete</button>
                <button class="modifyEmployee" onclick="modifyEmployee(${employee.id})">Modify</button>
              </div>
            `;

          employeeDiv.innerHTML = employeeInfo;
          employeeList.appendChild(employeeDiv);
          

          //Search function
          let rows = $(".employee.row-item");

          $("#search-bar").on("input", function () {
            let query = $("#search-bar").val().toLowerCase();

            for (let i = 0; i < rows.length; i++) {
              rows[i].classList.add("inactive");
            }

            for (let j = 0; j < allEmployees.length; j++) {
              if ((allEmployees[j].firstName + " " + allEmployees[j].lastName).toLowerCase().includes(query) ||
                allEmployees[j].department.name.toLowerCase().includes(query)) {
                  for (let k = 0; k < rows.length; k++) {
                    if (
                      rows[k].querySelector(".id").value == allEmployees[j].id
                    ) {
                      rows[k].classList.remove("inactive");
                    }
                  }
              }
            }
          });
          //End of search function
        });
      })
      .catch((error) => console.error(error));
  }
});

//Delete employee
function deleteEmployee(employeeId) {
  let token = sessionStorage.getItem("token");

  if (!token) {
    console.error("Token not found");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(
    `http://localhost:8080/admin/employee/delete?id=${employeeId}`,
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      window.location.reload();
    }).catch((error) => console.error("Error:", error));
}
//--------------------------

//Update Employee
function modifyEmployee(id) {
  window.location.href = "updateEmployee.html?id=" + id;
}

//Show info employee
function showInfo(id) {
  window.location.href = "infoEmployee.html?id=" + id;
}


