const SHEET_URL = 'https://script.google.com/macros/s/AKfycbw5MTPfQV6XNPLxqha6wvJeLzsfUJRpSVBO-iRhgLUGYG5E6Zp4dhRu-v_mlJXPVi01wA/exec';

async function fetchMembers() {
  const response = await fetch(SHEET_URL);
  const members = await response.json();
  const tableBody = document.querySelector('#memberTable tbody');

  members.forEach((member, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${member.Name}</td><td>${member.Suburb}</td>`;
    row.addEventListener('click', () => showMemberModal(member));
    tableBody.appendChild(row);
  });
}

function showMemberModal(member) {
  const modal = document.getElementById('memberModal');
  const body = document.getElementById('modalBody');

  body.innerHTML = `
    <img src="${member.PhotoURL}" alt="Member Photo">
    <h2>${member.Name}</h2>
    <p><strong>Suburb:</strong> ${member.Suburb}</p>
    <p><strong>Village:</strong> ${member.Village}</p>
    <p><strong>Marital Status:</strong> ${member.MaritalStatus || 'Unmarried'}</p>
    ${member.PartnerName ? `<p><strong>Partner:</strong> ${member.PartnerName}</p>` : ''}
    ${member.Children ? `<p><strong>Children:</strong> ${member.Children}</p>` : ''}
    <p><strong>Phone:</strong> ${member.Phone}</p>
    <p><strong>Email:</strong> ${member.Email}</p>
    <p><strong>Address:</strong> ${member.Address}</p>
  `;

  modal.style.display = 'block';
}

document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('memberModal').style.display = 'none';
});

window.addEventListener('click', e => {
  if (e.target.classList.contains('modal')) {
    document.getElementById('memberModal').style.display = 'none';
  }
});

fetchMembers();
