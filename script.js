const tableBody = document.querySelector("#memberTable tbody");
const modal = document.getElementById("memberModal");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.querySelector(".close-btn");

// Define fields for main member and spouse for side-by-side display
const mainFields = [
  { label: "Name", key: "Name" },
  { label: "Date of Birth", key: "DOB" },
  { label: "Phone", key: "Phone" },
  { label: "Email", key: "Email" },
  { label: "Address", key: "Address" },
  { label: "Village", key: "Village" },
  { label: "Mosal", key: "Mosal" },
  { label: "Occupation", key: "Occupation" },
  { label: "Father's Name", key: "Father's Name" },
  { label: "Mother's Name", key: "Mother's Name" },
  { label: "Indian Address", key: "Indian address" },
  { label: "Marital Status", key: "Marital status" }
];

const spouseFields = [
  { label: "Name", key: "Name1" },
  { label: "Date of Birth", key: "DOB1" },
  { label: "Phone", key: "Phone1" },
  { label: "Email", key: "Email1" },
  { label: "Address", key: "Indian Address1" },
  { label: "Village", key: "Village1" },
  { label: "Mosal", key: "Mosal1" },
  { label: "Occupation", key: "Occupation1" },
  { label: "Father's Name", key: "Father's Name1" },
  { label: "Mother's Name", key: "Mother's Name2" }
];

// Convert DOB to age string
function getAge(dob) {
  const birth = new Date(dob);
  if (isNaN(birth)) return "";
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

const scriptURL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhL0OsvpwOx24bdAN5He_RO6Rw5V3ocbEQEeretyn4iC8PiulW1Ms2zdOCkfI4oQCid5SK0YTXRhv-mFFKyociw6J3QJSpUkt4NiMyVoQN9mlbYKA1v6Uk8bOLNg7Q6S1heo6RQX2J3B4dgn_Rr5sAE3SKbpEynu_O0BdW3Z4PyF3s3qhX8HHdTxkaLJ4gGVz8V2_3vWfCqIh-WVovEt_UGE1kSCFNsHJmmLOKfaB2pvdqWVJ42tPn0jGCKdtV3nJBFm4NGnUEyTui2naJI8JaPaSDOuo4eMo9OjCdV&lib=MHnpweNuT6kWzrVxeb4EIfn3ussjxLWrt';

let membersData = [];

// Fetch all data once, display minimal in table
fetch(scriptURL)
  .then(resp => resp.json())
  .then(data => {
    membersData = data;
    tableBody.innerHTML = "";
    data.forEach(member => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${member.Name || ""}</td>
        <td>${member.Address || ""}</td>
        <td>${member.Village || ""}</td>
      `;
      tr.addEventListener("click", () => showModal(member));
      tableBody.appendChild(tr);
    });
  })
  .catch(err => {
    console.error("Fetch error:", err);
    tableBody.innerHTML = '<tr><td colspan="3">Failed to load data.</td></tr>';
  });

// Show modal with full data side-by-side
function showModal(member) {
  let rows = "";
  for (let i = 0; i < mainFields.length; i++) {
    const label = mainFields[i].label;
    const mainValRaw = member[mainFields[i].key] || "";
    const spouseValRaw = spouseFields[i] ? (member[spouseFields[i].key] || "") : "";

    // Convert DOB fields to age only
    const mainVal = (mainFields[i].key.includes("DOB") && mainValRaw) ? `${getAge(mainValRaw)} yrs` : mainValRaw;
    const spouseVal = (spouseFields[i] && spouseFields[i].key.includes("DOB") && spouseValRaw) ? `${getAge(spouseValRaw)} yrs` : spouseValRaw;

    if (!mainVal && !spouseVal) continue;

    rows += `
      <tr>
        <th>${label}</th>
        <td>${mainVal || "-"}</td>
        <td>${spouseVal || "-"}</td>
      </tr>
    `;
  }

  // Children section
  let childrenHTML = "";
  if (member.Children || member.Child1) {
    childrenHTML += `<h3>Children</h3><table class="children-table" aria-label="Children Information"><tbody>`;
    if (member.Child1) {
      const childAge = member["Child DOB"] ? `${getAge(member["Child DOB"])} yrs` : member["Child DOB"] || "";
      childrenHTML += `
        <tr>
          <th>Child Name</th><td>${member.Child1}</td>
          <th>Child DOB</th><td>${childAge}</td>
        </tr>
      `;
    }
    childrenHTML += `</tbody></table>`;
  }

  modalBody.innerHTML = `
    <div class="popup-image">
      <img src="${member.Image || 'https://via.placeholder.com/180'}" alt="${member.Name || 'No Image'}" />
    </div>
    <div class="popup-details">
      <h2>${member.Name || ""} & ${member.Name1 || ""}</h2>
      <table class="details-table" aria-label="Member and Spouse Details">
        <thead>
          <tr>
            <th></th>
            <th>${member.Name || "Member"}</th>
            <th>${member.Name1 || "Spouse"}</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      ${childrenHTML}
    </div>
  `;

  modal.style.display = "block";
  modal.setAttribute('aria-hidden', 'false');
}

closeBtn.addEventListener('click', () => {
  modal.style.display = "none";
  modal.setAttribute('aria-hidden', 'true');
});

window.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
  }
});

window.addEventListener('keydown', e => {
  if (e.key === "Escape" && modal.style.display === "block") {
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
  }
});
