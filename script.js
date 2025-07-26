const sheetURL = 'https://script.google.com/macros/s/AKfycbwMpqHDKB-NIZ27hjjk7UnoY_KgMFB_7iVbbqwvoe0Y4fGzM1VZIbKfEHu_AsrKx00upg/exec';

fetch(sheetURL)
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('memberTableBody');
    data.forEach((member, index) => {
      const name = member["What is your Name?"] || "Unnamed";
      const village = member["What is your Village?"] || "-";
      const suburb = member["What is your current Residential Address?"] || "-";

      const row = document.createElement('tr');
      row.innerHTML = `
        <td><a href="#" onclick="showModal(${index})">${name}</a></td>
        <td>${village}</td>
        <td>${suburb}</td>
      `;
      tableBody.appendChild(row);
    });
    window.allMembers = data;
  });

function showModal(index) {
  const member = window.allMembers[index];
  const modal = document.getElementById('memberModal');
  const overlay = document.getElementById('overlay');
  const content = document.getElementById('modalContent');

  content.innerHTML = `
    <h2>${member["What is your Name?"]}</h2>
    ${member["Please upload a photograph."] ? `<img src="${member["Please upload a photograph."]}" alt="Photo">` : ""}
    <p><strong>DOB:</strong> ${member["What is your Date of Birth?"] || "-"}</p>
    <p><strong>Phone:</strong> ${member["What is your Phone Number?"] || "-"}</p>
    <p><strong>Email:</strong> ${member["What is your Email address?"] || "-"}</p>
    <p><strong>Village:</strong> ${member["What is your Village?"] || "-"}</p>
    <p><strong>Occupation:</strong> ${member["What is your current occupation?\n(If you are self-employed or run a business, please include the name of your business.)"] || "-"}</p>
    <p><strong>Partner:</strong> ${member["What is your Partner's Name?"] || "-"}</p>
    <p><strong>Children:</strong> ${member["What is your child’s full name?"] || "None"}</p>
  `;

  modal.style.display = "block";
  overlay.style.display = "block";
}

function closeModal() {
  document.getElementById('memberModal').style.display = "none";
  document.getElementById('overlay').style.display = "none";
}
