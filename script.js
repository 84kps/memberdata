const sheetURL = "https://script.google.com/macros/s/AKfycbwMpqHDKB-NIZ27hjjk7UnoY_KgMFB_7iVbbqwvoe0Y4fGzM1VZIbKfEHu_AsrKx00upg/exec";

async function fetchMembers() {
  try {
    const response = await fetch(sheetURL);
    const data = await response.json();
    populateTable(data);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

function populateTable(members) {
  const tbody = document.querySelector("#memberTable tbody");
  members.forEach((member, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${member.Name}</td><td>${member.Suburb}</td>`;
    row.addEventListener("click", () => openModal(member));
    tbody.appendChild(row);
  });
}

function openModal(member) {
  const modal = document.getElementById("memberModal");
  const modalDetails = document.getElementById("modalDetails");

  modalDetails.innerHTML = `
    <h2>${member.Name}</h2>
    <p><strong>Suburb:</strong> ${member.Suburb}</p>
    <p><strong>Occupation:</strong> ${member.Occupation || 'N/A'}</p>
    <p><strong>Email:</strong> ${member.Email || 'N/A'}</p>
    <p><strong>Phone:</strong> ${member.Phone || 'N/A'}</p>
  `;

  modal.style.display = "block";
}

document.querySelector(".close-button").addEventListener("click", () => {
  document.getElementById("memberModal").style.display = "none";
});

window.onclick = function(event) {
  const modal = document.getElementById("memberModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

fetchMembers();
