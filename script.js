
// MENU
// ===============================

const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav-links');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}


// ===============================
// GALLERY IMAGE VIEW
// ===============================

document.querySelectorAll('.gallery figure img').forEach(img => {
  img.addEventListener('click', () => {
    const viewer = document.createElement('div');

    viewer.style.position = 'fixed';
    viewer.style.inset = '0';
    viewer.style.background = 'rgba(0,0,0,0.9)';
    viewer.style.display = 'flex';
    viewer.style.alignItems = 'center';
    viewer.style.justifyContent = 'center';
    viewer.style.zIndex = '9999';

    const bigImage = document.createElement('img');
    bigImage.src = img.src;
    bigImage.style.maxWidth = '95%';
    bigImage.style.maxHeight = '95%';

    viewer.appendChild(bigImage);

    viewer.addEventListener('click', () => {
      viewer.remove();
    });

    document.body.appendChild(viewer);
  });
});


// ===============================
// STUDENT RESULT CHECK
// ===============================

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("resultForm");
  const message = document.getElementById("resultMessage");
  const details = document.getElementById("resultDetails");

  if (!form) return; 
  const pinInput = document.getElementById("resultPin");
const rollInput = document.getElementById("resultRoll");

pinInput.maxLength = 8;

pinInput.addEventListener("input", function () {
  this.value = this.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);
});

rollInput.addEventListener("input", function () {
  const roll = this.value.trim();

  if (/^\d{1,3}$/.test(roll)) {
    pinInput.value = "471CA" + roll.padStart(2, "0");
  }
});
const classSelect = document.getElementById("resultClass");
const resultTypeSelect = document.getElementById("resultType");

function updateResultTypes() {
    const selectedClass = classSelect.value;

    const groups = resultTypeSelect.querySelectorAll("optgroup");

    groups.forEach(group => {
        if (group.label === "Class VIII") {
            group.hidden = selectedClass !== "VIII";
        }

        if (group.label === "Class IX & X") {
            group.hidden = !(selectedClass === "IX" || selectedClass === "X");
        }
    });

    resultTypeSelect.value = "";
}

classSelect.addEventListener("change", updateResultTypes);
updateResultTypes();

  form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const studentClass =
      document.getElementById("resultClass").value.trim();

    const rollNo =
      document.getElementById("resultRoll").value.trim();

    const pin =
      document.getElementById("resultPin").value.trim();
const assessmentLabel =
  document.getElementById("resultType").value.trim();

const assessmentMap = {
  "SA1": "Summative Assessment 1",
  "SA2": "Summative Assessment 2",
  "UT1": "Unit Test 1",
  "UT2": "Unit Test 2",
  "UT3": "Unit Test 3",
  "UT4": "Unit Test 4",
"Summative Assessment 1": "SA1",
"Summative Assessment 2": "SA2",
"Unit Test 1": "UT1",
"Unit Test 2": "UT2",
"Unit Test 3": "UT3",
"Unit Test 4": "UT4",
  "Formative Assessment 1": "Formative Assessment 1",
  "Formative Assessment 2": "Formative Assessment 2",
  "Formative Assessment 3": "Formative Assessment 3",
  "Formative Assessment 4": "Formative Assessment 4",
  "Half Yearly": "Half Yearly",
  "Annual": "Annual"
};

 const assessment =
  assessmentMap[assessmentLabel] || assessmentLabel;


    message.innerHTML = "";
    details.innerHTML = "";


    // Check empty fields
    if (!studentClass || !rollNo || !pin || !assessment) {

      message.innerHTML =
        "<p>Please enter Class, Roll No., PIN and Result Type.</p>";

      return;
    }
// Check PIN format
if (!/^471CA\d{2,3}$/.test(pin)) {
  
  message.innerHTML =
  "<p>❌ Invalid PIN. Use 471CA01, 471CA02, ... 471CA100, 471CA123.</p>";
  return;
}

    message.innerHTML =
      "<p>Checking result...</p>";


    try {

      // Table name
      const tableName =
        `class_${studentClass.toLowerCase()}_results`;


      // Search result table
      const { data, error } = await supabaseClient
        .from(tableName)
        .select("*")
        .eq("roll_no", Number(rollNo))
        .eq("pin", pin)
        .eq("assessment", assessment)
        .maybeSingle();


      // Error
      if (error) {

        console.error(error);

        message.innerHTML =
          "<p>⚠️ Unable to check result. Please try again.</p>";

        return;
      }


      // No result
      if (!data) {

        message.innerHTML =
          "<p>❌ Result not found. Please check Class, Roll No., PIN and Result Type.</p>";

        return;
      }


      // Success
      message.innerHTML =
        "<p>✅ Result found successfully.</p>";


      // Build result display
      let html = `
        <div class="info-box">

          <p><strong>Class:</strong> ${data.class || studentClass}</p>

<p><strong>Roll No.:</strong> ${data.roll_no}</p>

<p><strong>Name:</strong> ${data.student_name}</p>

<p><strong>Assessment:</strong> ${data.assessment}</p>

<hr>

<p><strong>Subjective:</strong> ${data.subjective ?? "—"}</p>

<p><strong>Objective:</strong> ${data.objective ?? "—"}</p>

<p><strong>Total:</strong> ${data.total ?? "—"}</p>

          <hr>

          <h3>Marks</h3>
      `;


      // Subject columns
      const subjects = [
        ["mil_odia", "MIL (Odia)"],
        ["english", "English"],
        ["hindi_sanskrit", "Hindi / Sanskrit"],
        ["mathematics", "Mathematics"],
        ["science", "Science"],
        ["history", "History"],
        ["geography", "Geography"],
        ["drawing", "Drawing"]
      ];


      let foundMarks = false;


      subjects.forEach(([column, name]) => {

        if (data[column] !== null && data[column] !== undefined) {

          foundMarks = true;

          html += `
            <p>
              <strong>${name}:</strong>
              ${data[column]}
            </p>
          `;
        }

      });


      if (!foundMarks) {

        html +=
          "<p>Marks have not been entered yet.</p>";
      }


      html += `
        </div>
      `;


      details.innerHTML = html;


    } catch (err) {

      console.error(err);

      message.innerHTML =
        "<p>⚠️ Something went wrong. Please try again.</p>";
    }

  });

});
