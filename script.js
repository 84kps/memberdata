const scriptURL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhL0OsvpwOx24bdAN5He_RO6Rw5V3ocbEQEeretyn4iC8PiulW1Ms2zdOCkfI4oQCid5SK0YTXRhv-mFFKyociw6J3QJSpUkt4NiMyVoQN9mlbYKA1v6Uk8bOLNg7Q6S1heo6RQX2J3B4dgn_Rr5sAE3SKbpEynu_O0BdW3Z4PyF3s3qhX8HHdTxkaLJ4gGVz8V2_3vWfCqIh-WVovEt_UGE1kSCFNsHJmmLOKfaB2pvdqWVJ42tPn0jGCKdtV3nJBFm4NGnUEyTui2naJI8JaPaSDOuo4eMo9OjCdV&lib=MHnpweNuT6kWzrVxeb4EIfn3ussjxLWrt';

const tableBody = document.querySelector('#memberTable tbody');
const modal = document.getElementById('memberModal');
const modalName = document.getElementById('modalName');
const modalImage = document.getElementById('modalImage');
const detailsTable = document.getElementById('detailsTable');
const childrenTable = document.getElementById('childrenTable');
const closeBtn = document.querySelector('.close-btn');
const langToggle = document.getElementById('langToggle');
const loader = document.getElementById('loader');
const memberTable = document.getElementById('memberTable');

let isGujarati = false;
let fullDataCache = [];
let minimalData = [];

// Labels for bilingual support
const labels = {
  Name: ['Name', 'નામ'],
  DOB: ['Date of Birth', 'જન્મતારીખ'],
  Phone: ['Phone', 'ફોન નંબર'],
  Email: ['Email', 'ઈમેઇલ'],
  Address: ['Address', 'સરનામું'],
  Village: ['Village', 'ગામ'],
  Mosal: ['Mosal', 'મોસાળ'],
  Occupation: ['Occupation', 'વ્યવસાય'],
  "Father's Name": ["Father's Name", 'પિતાનું નામ'],
  "Mother's Name": ["Mother's Name", 'માતાનું નામ'],
  "Indian address": ['Indian Address', 'ભારતનું સરનામું'],
  "Marital status": ['Marital Status', 'પરિણીત સ્થિતિ'],
  Children: ['Children', 'બાળકો'],
  Education: ['Education', 'અભ્યાસ'],
  Age: ['Age', 'ઉમર']
};

function translate(key) {
  return labels[key] ? labels[key][isGujarati ? 1 : 0] : key;
}

function convertDOBtoAge(dob) {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function formatMaritalStatus(value) {
  if (!value) return '';
  const val = value.toString().toLowerCase();
  if (val === 'yes' || val === 'married') return isGujarati ? 'પરિણીત' : 'Married';
  if (val === 'no' || val === 'unmarried') return isGujarati ? 'અપરિણીત' : 'Unmarried';
  return value;
}

function formatDOBorAge(dob) {
  if (!dob) return '';
  const age = convertDOBtoAge(dob);
  return age ? `${age} yrs` : '';
}

// Show loader and hide table initially
loader.style.display = 'block';
memberTable.hidden = true;

// Fetch all data once
fetch(scriptURL)
  .then(res => res.json())
  .then(data => {
    fullDataCache = data;
    minimalData = data.map(m => ({
      Name: m.Name,
      Village: m.Village,
      Address: m.Address
    }));
    renderTableMinimal();

    // Hide loader and show table
    loader.style.display = 'none';
    memberTable.hidden = false;
  })
  .catch(err => {
    loader.innerHTML = `<div style="color:red; font-weight:bold;">Failed to load data.</div>`;
    console.error('Fetch error:', err);
  });

// Render minimal table rows (Name, Village, Address)
function renderTableMinimal() {
  tableBody.innerHTML = '';
  minimalData.forEach(member => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${member.Name || ''}</td>
      <td>${member.Village || ''}</td>
      <td>${member.Address || ''}</td>
    `;
    tr.addEventListener('click', () => {
      const fullMember = fullDataCache.find(m => m.Name === member.Name);
      if (fullMember) showModal(fullMember);
      else alert('Full data not found');
    });
    tableBody.appendChild(tr);
  });
}

// Show modal with full member + spouse details side by side (hide spouse column if no spouse)
function showModal(member) {
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  
  modalImage.src = member.Image || 'https://via.placeholder.com/180';
  modalImage.alt = member.Name || 'Member Photo';

  const hasSpouse = member.Name1 && member.Name1.trim() !== '';

  modalName.textContent = hasSpouse
    ? `${member.Name || ''} & ${member.Name1 || ''}`
    : (member.Name || '');

  const mainFields = [
    'Name', 'DOB', 'Phone', 'Email', 'Address', 'Village', 'Mosal', 'Occupation',
    "Father's Name", "Mother's Name", "Indian address", "Marital status"
  ];

  const spouseFieldsMap = {
    Name: 'Name1',
    DOB: 'DOB1',
    Phone: 'Phone1',
    Email: 'Email1',
    Address: 'Indian Address1',
    Village: 'Village1',
    Mosal: 'Mosal1',
    Occupation: 'Occupation1',
    "Father's Name": "Father's Name1",
    "Mother's Name": "Mother's Name2",
    "Indian address": 'Indian Address1',
    "Marital status": 'Marital status1'
  };

  detailsTable.innerHTML = '';

  mainFields.forEach(field => {
    const spouseKey = spouseFieldsMap[field] || '';

    const mainRaw = member[field] || '';
    const spouseRaw = spouseKey ? (member[spouseKey] || '') : '';

    const mainVal = field === 'DOB' ? formatDOBorAge(mainRaw)
      : (field === 'Marital status' ? formatMaritalStatus(mainRaw) : mainRaw);

    const spouseVal = field === 'DOB' ? formatDOBorAge(spouseRaw)
      : (field === 'Marital status' ? formatMaritalStatus(spouseRaw) : spouseRaw);

    if (!mainVal && !spouseVal) return;

    const row = document.createElement('tr');

    if (hasSpouse) {
      row.innerHTML = `
        <th>${translate(field)}</th>
        <td>${mainVal || '-'}</td>
        <td>${spouseVal || '-'}</td>
      `;
    } else {
      // Only one member: just show label + one value, spanning two columns
      row.innerHTML = `
        <th>${translate(field)}</th>
        <td colspan="2">${mainVal || '-'}</td>
      `;
    }

    detailsTable.appendChild(row);
  });

  // Children table
  childrenTable.style.display = 'none';
  childrenTable.innerHTML = '';

  let childrenRows = '';
  const maxChildren = 5;
  for (let i = 1; i <= maxChildren; i++) {
    const name = member[`Child${i}`];
    const dob = member[`child dob${i}`];
    if (!name || !dob) continue;
    const age = convertDOBtoAge(dob);
    if (age < 1) continue;

    const occ = age > 16 ? (member[`Occupation${i}`] || '') : '';
    const edu = age > 16 ? (member[`Education${i}`] || '') : '';

    childrenRows += `<tr>
      <td>${name}</td>
      <td>${age}</td>
      <td>${occ}</td>
      <td>${edu}</td>
    </tr>`;
  }

  if (childrenRows) {
    childrenTable.style.display = 'table';
    childrenTable.innerHTML = `<tr>
      <th>${translate('Name')}</th>
      <th>${translate('Age')}</th>
      <th>${translate('Occupation')}</th>
      <th>${translate('Education')}</th>
    </tr>` + childrenRows;
  }

}

// Close modal handlers
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
});

window.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.style.display === 'block') {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }
});

// Language toggle
langToggle.addEventListener('click', () => {
  isGujarati = !isGujarati;
  langToggle.textContent = isGujarati ? 'English' : 'ગુજરાતી';
  langToggle.setAttribute('aria-pressed', isGujarati);
  translatePage();
});

function translatePage() {
  document.getElementById('pageTitleHeader').textContent = isGujarati
    ? 'શ્રી ૮૪ કડવા પટેલ સમાજ - મેલબોર્ન'
    : 'Shree 84 Kadva Patidar Samaj - Melbourne';

  document.getElementById('nameHeader').textContent = translate('Name');
  document.getElementById('villageHeader').textContent = translate('Village');
  document.getElementById('suburbHeader').textContent = translate('Address');

  if (modal.style.display === 'block') {
    // Redisplay modal to update labels
    const displayedNames = modalName.textContent.split('&').map(s => s.trim());
    const currentMember = fullDataCache.find(m => m.Name === displayedNames[0]);
    if (currentMember) showModal(currentMember);
  }
}
