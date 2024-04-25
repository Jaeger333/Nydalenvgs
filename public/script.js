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
        const response2 = await fetch('/classes')

        students = await response.json()
        classes = await response2.json()
        console.log("students" + students)
        populateUserTable(students, classes);
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

function populateUserTable(students, classes) {
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
            <td>${user.class}</td>
        `;

        newRow.addEventListener('click', () => {
            const editForm = document.getElementById('editForm');
            editForm.class.innerHTML = "";

            editForm.userID.value = user.id;
            editForm.firstname.value = user.firstname;
            editForm.lastname.value = user.lastname;
            editForm.username.value = user.username;
            editForm.email.value = user.email;

            const selectedOption = document.createElement("option");
            selectedOption.value = user.classId;
            selectedOption.textContent = user.class;
            editForm.class.appendChild(selectedOption);
            
            classes.forEach(classItem => {
                if (classItem.id !== user.classId) { // Exclude the current class
                    const option = document.createElement("option");
                    option.value = classItem.id;
                    option.textContent = classItem.name;
                    editForm.class.appendChild(option);
                }
            });
        });
        tableBody.appendChild(newRow);
    }
}
