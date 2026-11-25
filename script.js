
const API_URL = "/api/users";

let editingUserId = null;
let authHeader = "";

function getAuthHeader() {
    if (!authHeader) {
        const username = prompt("Enter API username:");
        const password = prompt("Enter API password:");

        if (username === null || password === null) {
            return null;
        }

        authHeader = "Basic " + btoa(username + ":" + password);
    }

    return authHeader;
}

// Fetch all users
async function loadUsers() {
    const auth = getAuthHeader();

    if (!auth) return;

    try {
        const response = await fetch(API_URL, {
            headers: {
                Authorization: auth
            }
        });

        if (response.status === 401) {
            authHeader = "";
            document.getElementById("message").textContent =
                "Invalid credentials. Refresh and try again.";
            return;
        }

        const users = await response.json();

        const table = document.getElementById("usersTable");
        table.innerHTML = "";

        if (users.length === 0) {
            table.innerHTML =
                '<tr><td colspan="4">No users found.</td></tr>';
            return;
        }

        users.forEach(user => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHTML(user.name)}</td>
                <td>${escapeHTML(user.email)}</td>
                <td>${user.age ?? "-"}</td>
                <td>
                    <button class="edit-btn"
                        onclick="editUser('${user._id}')">Edit</button>
                    <button class="delete-btn"
                        onclick="deleteUser('${user._id}')">Delete</button>
                </td>
            `;

            table.appendChild(row);
        });

    } catch (error) {
        document.getElementById("message").textContent =
            "Could not connect to the server.";
    }
}

// Prevent HTML injection in displayed text
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Add or update user
document.getElementById("userForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const auth = getAuthHeader();
    if (!auth) return;

    const userData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        age: document.getElementById("age").value
            ? Number(document.getElementById("age").value)
            : undefined
    };

    const password = document.getElementById("password").value;

    if (password) {
        userData.password = password;
    }

    if (!editingUserId && !password) {
        alert("Password is required for a new user.");
        return;
    }

    try {
        const response = await fetch(
            editingUserId ? `${API_URL}/${editingUserId}` : API_URL,
            {
                method: editingUserId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: auth
                },
                body: JSON.stringify(userData)
            }
        );

        const result = await response.json();

        document.getElementById("message").textContent = result.message;

        if (response.ok) {
            resetForm();
            loadUsers();
        }

    } catch (error) {
        alert("Something went wrong!");
    }
});

// Edit user
async function editUser(id) {
    const auth = getAuthHeader();
    if (!auth) return;

    const response = await fetch(`${API_URL}/${id}`, {
        headers: { Authorization: auth }
    });

    const user = await response.json();

    if (!response.ok) {
        alert(user.message || "Could not load user.");
        return;
    }

    editingUserId = id;

    document.getElementById("name").value = user.name;
    document.getElementById("email").value = user.email;
    document.getElementById("age").value = user.age ?? "";
    document.getElementById("password").value = "";
    document.getElementById("password").required = false;

    document.getElementById("formTitle").textContent = "Edit User";
    document.getElementById("submitBtn").textContent = "Update User";
    document.getElementById("cancelBtn").hidden = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Delete user
async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) {
        return;
    }

    const auth = getAuthHeader();
    if (!auth) return;

    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: auth }
    });

    const result = await response.json();

    document.getElementById("message").textContent = result.message;
    loadUsers();
}

// Reset form
function resetForm() {
    editingUserId = null;

    document.getElementById("userForm").reset();
    document.getElementById("password").required = true;

    document.getElementById("formTitle").textContent = "Add New User";
    document.getElementById("submitBtn").textContent = "Add User";
    document.getElementById("cancelBtn").hidden = true;
}

document.getElementById("cancelBtn").addEventListener("click", resetForm);
document.getElementById("refreshBtn").addEventListener("click", loadUsers);

// Load users when page opens
loadUsers();
