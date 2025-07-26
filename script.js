const scriptURL = 'https://script.google.com/macros/s/AKfycbwMpqHDKB-NIZ27hjjk7UnoY_KgMFB_7iVbbqwvoe0Y4fGzM1VZIbKfEHu_AsrKx00upg/exec';
const tableBody = document.querySelector("#memberTable tbody");
const modal = document.getElementById("memberModal");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.querySelector(".close-btn");
const languageToggle = document.getElementById("languageToggle");

fetch(scriptURL)
  .then(res => res.json())
  .then(data => {
    data.forEach(member => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${member.Name}</td>
        <td>${member.Address}</td>
        <td>${member.Village}</td>
      `;
      tr.addEventListener("click", () => showModal(member));
      tableBody.appendChild(tr);
    });
  });

function showModal(member) {
  const getAge = dob => {
    const birth = new Date(dob);
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  modalBody.innerHTML = `
    <img src="${member.Image || 'https://via.placeholder.com/150'}" alt="${member.Name}" class="member-photo">
    <table class="details-table">
      <tr><th>Name</th><td>${member.Name}</td></tr>
      <tr><th>Date of Birth</th><td>${member.DOB}</td></tr>
      <tr><th>Phone</th><td>${member.Phone}</td></tr>
      <tr><th>Email</th><td>${member.Email}</td></tr>
      <tr><th>Address</th><td>${member.Address}</td></tr>
      <tr><th>Village</th><td>${member.Village}</td></tr>
      <tr><th>Mosal</th><td>${member.Mosal}</td></tr>
      <tr><th>Occupation</th><td>${member.Occupation}</td></tr>
      <tr><th>Father's Name</th><td>${member["Father's Name"]}</td></tr>
      <tr><th>Mother's Name</th><td>${member["Mother's Name"]}</td></tr>
      <tr><th>Indian Address</th><td>${member["Indian address"]}</td></tr>
      <tr><th>Marital Status</th><td>${member["Marital status"]}</td></tr>
      <tr><th>Spouse Name</th><td>${member.Name1 || ""}</td></tr>
      <tr><th>Spouse DOB</th><td>${member.DOB1 || ""}</td></tr>
      <tr><th>Spouse Phone</th><td>${member.Phone1 || ""}</td></tr>
      <tr><th>Spouse Email</th><td>${member.Email1 || ""}</td></tr>
      <tr><th>Spouse Village</th><td>${member.Village1 || ""}</td></tr>
      <tr><th>Spouse Mosal</th><td>${member.Mosal1 || ""}</td></tr>
      <tr><th>Spouse Occupation</th><td>${member.Occupation1 || ""}</td></tr>
      <tr><th>Spouse Father's Name</th><td>${member["Father's Name1"] || ""}</td></tr>
      <tr><th>Spouse Mother's Name</th><td>${member["Mother's Name2"] || ""}</td></tr>
      <tr><th>Spouse Indian Address</th><td>${member["Indian Address1"] || ""}</td></tr>
      <tr><th>Children</th><td>${member.Children || ""}</td></tr>
      <tr><th>Child1</th><td>${member.Child1 || ""}</td></tr>
      <tr><th>Child DOB</th><td>${member["Child DOB"] || ""} (${member["Child DOB"] ? getAge(member["Child DOB"]) + ' yrs' : ''})</td></tr>
    </table>
  `;
  modal.style.display = "block";
}

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => e.target == modal && (modal.style.display = "none");

languageToggle.addEventListener("change", () => {
  const ths = document.querySelectorAll("th");
  ths.forEach(th => {
    const text = languageToggle.checked ? th.getAttribute("data-gu") : th.getAttribute("data-en");
    if (text) th.textContent = text;
  });
});
