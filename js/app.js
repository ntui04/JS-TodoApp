
let textInput = document.getElementById("input");
let list = document.getElementById("list");

function addTask() {
    let content = textInput.value.trim(); // Capture input value and trim whitespace

    if (!content) {
        alert("Please enter a task."); // Alert if input is empty
        return; // Exit the function if no content
    }

    let data = {
        content: content
    };

    fetch("http://localhost:3000/task", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Task added:", data);
        textInput.value = ""; // Clear the input field after adding the task
        displayTasks(); // Call function to display tasks (you'll need to implement this)
    })
    .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
    });
}

function fetchData() {
    fetch("http://localhost:3000/task")
    .then(async (response) => {
        let tasks = await response.json();
        list.innerHTML = ""; // Clear existing list

        if (tasks.length === 0) {
            list.innerHTML = "<p>No items</p>";
            return;
        }

        tasks.forEach(task => {
            list.innerHTML += `
                <div class="task-item" id="${task.id}">
                    <span>${task.content}</span>
                    <span>
                        <button onclick="editTask('${task.id}', '${task.content}')">Edit</button>
                        <button onclick="deleteTask('${task.id}')">Delete</button>
                    </span>
                </div>
            `;
        });
    })
    .catch(error => {
        console.error("Error fetching tasks:", error);
    });
}
fetchData()


function editTask(id, content) {
    currentTaskId = id; // Track the ID of the task being edited
    textInput.value = content; // Populate input field with task content
    document.getElementById("update").style.display = "inline-block"; // Show the update button
}

function updateTask() {
    if (currentTaskId === null) {
        alert("No task selected for update.");
        return;
    }

    let content = textInput.value.trim(); // Capture updated input

    if (!content) {
        alert("Please enter a task."); // Alert if input is empty
        return; // Exit the function if no content
    }

    let data = { content: content };

    fetch(`http://localhost:3000/task/${currentTaskId}`, { // Assuming your server supports PUT requests
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Task updated:", data);
        textInput.value = ""; // Clear input field
        currentTaskId = null; // Reset current task ID
        document.getElementById("update").style.display = "none"; // Hide update button
        fetchData(); // Refresh the task list
    })
    .catch(error => {
        console.error("Error updating task:", error);
    });
}

function deleteTask(id) {
    fetch(`http://localhost:3000/task/${id}`, { // Assuming your server supports DELETE requests
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Task deleted:", data);
        fetchData(); // Refresh the task list
    })
    .catch(error => {
        console.error("Error deleting task:", error);
    });
}

// Initial fetch to load tasks
window.onload = fetchData;