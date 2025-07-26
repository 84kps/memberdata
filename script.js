const endpoint = "https://script.google.com/macros/s/AKfycbyNsVRbE4i_6uAim1wGKISXex5rkLn8NgJtsF7G-VIJI63WwT_RohB7mJrlA5joLzx2jQ/exec";

fetch(endpoint)
  .then((res) => res.json())
  .then((data) => {
    renderTable(data);
    setupModal(data);
  });

function renderTable(data) {
  const tbody = document.querySelector("#memberTable tbody");
  tbody.innerHTML = "";

  data.forEach((member, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><a href="#" class="member-link" data-index="${index}">${member.Name}</a></td>
      <td>${member.Address || ""}</td>
      <td>${member.Village || ""}</td>
    `;
    tbody.appendChild(row);
  });
}

function setupModal(data) {
  const modal = document.getElementById("memberModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.querySelector(".close-btn");

  document.querySelectorAll(".member-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const member = data[link.dataset.index];
      modalBody.innerHTML = generateModalContent(member);
      modal.style.display = "block";
    });
  });

  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (e) => {
    if (e.target == modal) modal.style.display = "none";
  };
}

function generateModalContent(member) {
  const photo = member.Image?.includes("drive.google.com")
    ? member.Image.replace("/open?", "/uc?export=view&")
    : member.Image;

  return `
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <img src="${photo}" class="member-photo" alt="Photo" />
      <table class="details-table">
        <tr><th colspan="2">${member.Name}</th><th colspan="2">${member.Name1 || "Not Married"}</th></tr>
        <tr><td><b>Age:</b></td><td>${calculateAge(member.DOB)}</td><td><b>Age:</b></td><td>${member.DOB1 ? calculateAge(member.DOB1) : ""}</td></tr>
        <tr><td><b>Phone:</b></td><td>${member.Phone}</td><td><b>Phone:</b></td><td>${member.Phone1 || ""}</td></tr>
        <tr><td><b>Email:</b></td><td>${member.Email}</td><td><b>Email:</b></td><td>${member.Email1 || ""}</td></tr>
        <tr><td><b>Village:</b></td><td>${member.Village}</td><td><b>Village:</b></td><td>${member.Village1 || ""}</td></tr>
        <tr><td><b>Mosal:</b></td><td>${member.Mosal}</td><td><b>Mosal:</b></td><td>${member.Mosal1 || ""}</td></tr>
        <tr><td><b>Occupation:</b></td><td>${member.Occupation}</td><td><b>Occupation:</b></td><td>${member.Occupation1 || ""}</td></tr>
        <tr><td><b>Marital Status:</b></td><td>${member["Marital status"]}</td><td><b>Children:</b></td><td>${member.Children}</td></tr>
        ${member["Child1"] ? `<tr><td><b>Child 1:</b></td><td>${member["Child1"]}</td><td><b>DOB:</b></td><td>${member["Child DOB"]}</td></tr>` : ""}
      </table>
    </div>
  `;
}

function calculateAge(dobString) {
  if (!dobString) return "";
  const parts = dobString.split(/[\/\-]/);
  let dob = new Date(parts[2], parts[1] - 1, parts[0]); // Assuming DD/MM/YYYY
  if (dob.toString() === "Invalid Date") dob = new Date(dobString);
  const diff = Date.now() - dob.getTime();
  const age = new Date(diff).getUTCFullYear() - 1970;
  return isNaN(age) ? "" : age;
}
