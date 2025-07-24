const sheetURL = "YOUR_WEB_APP_URL_HERE"; // Replace with your Web App URL

fetch(sheetURL)
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector("#memberTable tbody");
    data.forEach((member, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${member.Name}</td><td>${member.Suburb}</td>`;
      tr.addEventListener("click", () => showDetails(member));
      tbody.appendChild(tr);
    });
  });

function showDetails(member) {
  const modal = document.getElementById("modal");
  const detailDiv = document.getElementById("memberDetails");

  detailDiv.innerHTML = `
    <h2>${member.Name}</h2>
    <p><strong>Suburb:</strong> ${member.Suburb}</p>
    <p><strong>Email:</strong> ${member.Email || "N/A"}</p>
    <p><strong>Phone:</strong> ${member.Phone || "N/A"}</p>
    <p><strong>Village:</strong> ${member.Village || "N/A"}</p>
    <p><strong>Spouse:</strong> ${member.Spouse || "N/A"}</p>
  `;

  modal.style.display = "block";
}

document.getElementById("closeBtn").onclick = () => {
  document.getElementById("modal").style.display = "none";
};

window.onclick = event => {
  if (event.target === document.getElementById("modal")) {
    document.getElementById("modal").style.display = "none";
  }
};
