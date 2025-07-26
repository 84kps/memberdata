const SHEET_URL = 'https://script.google.com/macros/s/AKfycbz8ZFTpP1bg3Qtm8WlCHQoF3L9gI6QUYP2Z1f8AdWEfMpjtA7dq-CAjRMOOYaymrMFEUA/exec';

window.onload = () => {
  fetch(SHEET_URL)
    .then(res => res.json())
    .then(data => showMembers(data))
    .catch(err => console.error("Error fetching data", err));
};

function showMembers(data) {
  const container = document.getElementById("membersTable");
  container.innerHTML = "";

  data.forEach((member, index) => {
    const card = document.createElement("div");
    card.className = "member-card";
    card.innerHTML = `
      <h3>${member.Name}</h3>
      <p><strong>Village:</strong> ${member.Village}</p>
      <p><strong>Suburb:</strong> ${member.Address}</p>
    `;
    card.onclick = () => openModal(member);
    container.appendChild(card);
  });
}

function openModal(member) {
  const modal = document.getElementById("modal");
  const content = document.getElementById("modalContent");

  content.innerHTML = `
    <h2>${member.Name} Family</h2>
    <div style="display: flex; gap: 20px;">
      <img src="${member.Photo}" class="member-photo" alt="Photo" />
      <table class="details-table">
        <tr><th colspan="2">${member.Name}</th><th colspan="2">${member["Partner Name"] || "Not Married"}</th></tr>
        <tr><td><b>Age:</b></td><td>${calculateAge(member.DOB)}</td><td><b>DOB:</b></td><td>${member["Partner DOB"] || ""}</td></tr>
        <tr><td><b>Phone:</b></td><td>${member.Phone}</td><td><b>Phone:</b></td><td>${member["Partner Phone"] || ""}</td></tr>
        <tr><td><b>Email:</b></td><td>${member.Email}</td><td><b>Email:</b></td><td>${member["Partner Email"] || ""}</td></tr>
        <tr><td><b>Village:</b></td><td>${member.Village}</td><td><b>Village:</b></td><td>${member["Partner Village"] || ""}</td></tr>
        <tr><td><b>Mosal:</b></td><td>${member.Mosal}</td><td><b>Mosal:</b></td><td>${member["Partner Mosal"] || ""}</td></tr>
        <tr><td><b>Occupation:</b></td><td>${member.Occupation}</td><td><b>Occupation:</b></td><td>${member["Partner Occupation"] || ""}</td></tr>
        <tr><td><b>Marital Status:</b></td><td>${member["Marital Status"]}</td><td><b>Children:</b></td><td>${member.Children}</td></tr>
        ${member["Child1 Name"] ? `<tr><td><b>Child 1:</b></td><td>${member["Child1 Name"]}</td><td><b>DOB:</b></td><td>${member["Child1 DOB"]}</td></tr>` : ""}
        ${member["Child2 Name"] ? `<tr><td><b>Child 2:</b></td><td>${member["Child2 Name"]}</td><td><b>DOB:</b></td><td>${member["Child2 DOB"]}</td></tr>` : ""}
      </table>
    </div>
  `;
  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function calculateAge(dob) {
  if (!dob) return "N/A";
  const birthDate = new Date(dob);
  const ageDiff = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
