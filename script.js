const sheetURL = 'https://script.google.com/macros/s/AKfycbwMpqHDKB-NIZ27hjjk7UnoY_KgMFB_7iVbbqwvoe0Y4fGzM1VZIbKfEHu_AsrKx00upg/exec';

fetch(sheetURL)
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('memberTableBody');
    data.forEach((member, index) => {
      const name = member["What is your Name?"];
      const village = member["What is your Village?"];
      const suburb = member["What is your current Residential Address?"];

      const row = document.createElement('tr');
      row.innerHTML = `
        <td><a href="#" onclick="showModal(${index})">${name}</a></td>
        <td>${village}</td>
        <td>${suburb}</td>
      `;
      tableBody.appendChild(row);
    });

    // Save all member data for use in modal
    window.allMembers = data;
  });

function showModal(index) {
  const member = window.allMembers[index];
  const modal = document.getElementById('memberModal');
  const content = document.getElementById('modalContent');

  content.innerHTML = `
    <h2>${member["What is your Name?"]}</h2>
    <img src="${member["Please upload a photograph."]}" alt="Member Photo" style="width:150px"><br><br>
    <strong>DOB:</strong> ${member["What is your Date of Birth?"]}<br>
    <strong>Phone:</strong> ${member["What is your Phone Number?"]}<br>
    <strong>Email:</strong> ${member["What is your Email address?"]}<br>
    <strong>Village:</strong> ${member["What is your Village?"]}<br>
    <strong>Occupation:</strong> ${member["What is your current occupation?\n(If you are self-employed or run a business, please include the name of your business.)"]}<br>
    <strong>Partner:</strong> ${member["What is your Partner's Name?"] || "N/A"}<br>
    <strong>Child 1:</strong> ${member["What is your child’s full name?"] || "N/A"}<br>
    <!-- Add more fields as needed -->
    <br><button onclick="closeModal()">Close</button>
  `;

  modal.style.display = "block";
}

function closeModal() {
  document.getElementById('memberModal').style.display = "none";
}
