$(document).ready(function () {
  

  let allDepartment = [];
  getAllDepartment();
  
  $('#employees-tab').on('click', function() {
    window.location.href = 'dashboard.html';
  })

  $('#department-tab').on('click', function() {
    window.location.href = 'department.html';
  })

  $('#addDepartment').on('click', function() {
    window.location.href = 'add-department.html';
  })

  //Function to get all department

  function getAllDepartment() {
    const myHeaders = new Headers();
    let token = sessionStorage.getItem("token");
    myHeaders.append("Authorization", token);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:8080/admin/department/getAll", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        allDepartment = result;
        const departmentList = document.getElementById("department");

        result.forEach((department) => {
          const departmentDiv = document.createElement("div");
          departmentDiv.className = "department row-item";
          let departmentInfo;
          if (department.name == "Unemployed") {
            departmentInfo = `
              <div id="departmentInfo" >
                <div>
                <input class="id" type="text" hidden value="${department.id}">
                  <p>Name: ${department.name}</p>
                  <p>Employees: ${department.numberOfEmployees}</p>
                </div>
              </div>
              <div class="department-actions">
                <button onclick="showInfoDepartment(${department.id})">Info</button>
              </div>
            `;
          } else {
            departmentInfo = `
            <div id="departmentInfo">
              <div>
                <input class="id" type="text" hidden value="${department.id}">
                <p>Name: ${department.name}</p>
                <p>Employees: ${department.numberOfEmployees}</p>
              </div>
            </div>
            <div class="department-actions">
              <button onclick="showInfoDepartment(${department.id})">Info</button>
              <button onclick="deleteDepartment(${department.id})">Delete</button>
              <button onclick="modifyDepartment(${department.id})">Modify</button>
            </div>
          `;
          }
          departmentDiv.innerHTML = departmentInfo;
          departmentList.appendChild(departmentDiv);

          //Search function
          let rows = $(".department.row-item");

          $("#search-bar").on("input", function () {
            let query = $("#search-bar").val().toLowerCase();

            for (let i = 0; i < rows.length; i++) {
              rows[i].classList.add("inactive");
            }

            for (let j = 0; j < allDepartment.length; j++) {
              if (allDepartment[j].name.toLowerCase().includes(query)) {
                    for (let k = 0; k < rows.length; k++) {
                      if (
                        rows[k].querySelector(".id").value == allDepartment[j].id
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

function deleteDepartment(id) {
  let token = sessionStorage.getItem("token");
  var settings = {
    url: `http://localhost:8080/admin/department/delete?id=${id}`,
    method: "DELETE",
    timeout: 0,
    headers: {
      Authorization: token,
    },
  };

  $.ajax(settings)
    .done(function (response) {
      console.log(response);
      location.reload();
    })
    .fail(function (xhr, status, error) {
      console.error(xhr.responseText);
    });
}

function modifyDepartment(id) {
  window.location.href = "updateDepartment.html?id=" + id;
}

function showInfoDepartment(id) {
  window.location.href = "infoDepartment.html?id=" + id;
}
