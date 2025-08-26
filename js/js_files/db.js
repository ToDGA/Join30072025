const BASE_URL = "firebase-link";

async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseData = await response.json();
    return responseData;
}

async function postData(path = "", data) {
    await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

async function putData(path = "", data) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    let responseData = await response.json();
    return responseData;
}

async function deleteData(path = "") {
    const response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE"
    });
    if (response.ok) {
        // placeholders for the functions to display the data again
    } else {
        console.error("Error deleting data");
    }
}