const studentsDiv = document.getElementById('students');



async function main() {
    console.log("main")
    await fetchData()
}

async function fetchData() {
    console.log ("fetchData")
    await fetchStudents()

}

document.addEventListener('DOMContentLoaded', main)

async function fetchStudents() {
    try {
        const response = await fetch('/users')

        students = await response.json()
        console.log("students" + students)
        populateUserTable(students);
        populateStudents(students);
    } catch (error) {
        console.log('Failed to fetch students:', error);
    }
}

function populateStudents(students) {
    studentsDiv.innerHTML = "";
    console.log(students)
    for (let i = 0; i<students.length; i++) {
        const option = document.createElement("option");
        option.value = students[i].id;
        option.textContent = students[i].username
        studentsDiv.appendChild(option);
    }
}

function populateUserTable(students) {
    const sortedStudents = students.slice().sort((a, b) => a.username.localeCompare(b.username));
    const tableBody = document.getElementById('tbody');
    tableBody.innerHTML = ""; // Clear existing rows

    for (let i = 0; i < sortedStudents.length; i++) {
        const user = sortedStudents[i];
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
        `;
        newRow.addEventListener('click', () => {
            const editFirstname = document.getElementById('edit-firstname');
            const editLastname = document.getElementById('edit-lastname');
            const editUsername = document.getElementById('edit-username');
            const editEmail = document.getElementById('edit-email');

            editFirstname.value = user.firstname;
            editLastname.value = user.lastname;
            editUsername.value = user.username;
            editEmail.value = user.email;
        });
        tableBody.appendChild(newRow);
    }
}
