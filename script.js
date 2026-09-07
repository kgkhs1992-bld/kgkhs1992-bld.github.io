
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
    const assessment = resultTypeSelect.value.trim();

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
      const { data: rows, error } = await supabaseClient
  .from(tableName)
  .select("*")
  .eq("roll_no", Number(rollNo))
  .eq("pin", pin);

if (error) {
  console.error(error);
  message.innerHTML =
    "<p>⚠️ Unable to check result. Please try again.</p>";
  return;
}

const data = (rows || []).find(row => {
    const dbAssessment = String(row.assessment || "").trim().toLowerCase();

    const aliases = {
        "sa1": ["sa1", "summative assessment 1"],
        "sa2": ["sa2", "summative assessment 2"],
        "ut1": ["ut1", "unit test 1"],
        "ut2": ["ut2", "unit test 2"],
        "ut3": ["ut3", "unit test 3"],
        "ut4": ["ut4", "unit test 4"]
    };

    const wanted = String(assessment || "").trim().toLowerCase();

    return dbAssessment === wanted ||
           (aliases[wanted] && aliases[wanted].includes(dbAssessment));
});
if (!data) {
  message.innerHTML =
    "<p>❌ Result not found. Please check Class, Roll No., PIN and Result Type.</p>";
  return;
}
    



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
const pdfButton = document.createElement("button");

pdfButton.type = "button";
pdfButton.className = "btn primary";
pdfButton.style.marginTop = "18px";
pdfButton.textContent =
  "📥 DOWNLOAD / SAVE RESULT AS PDF";

pdfButton.onclick = async function () {

  const script = document.createElement("script");

  script.src =
    "https://unpkg.com/jspdf@4.2.1/dist/jspdf.umd.min.js";

  script.onload = function () {

    const jsPDF = window.jspdf.jsPDF;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(16);

    doc.text(
      "KARUA GADADHAR KAR HIGH SCHOOL, BELDANDIA",
      105,
      y,
      { align: "center" }
    );

    y += 12;

    doc.setFontSize(14);

    doc.text(
      "STUDENT RESULT",
      105,
      y,
      { align: "center" }
    );

    y += 15;

    doc.setFontSize(11);

    doc.text(
      "Class: " + (data.class || ""),
      15,
      y
    );

    y += 8;

    doc.text(
      "Roll No.: " + data.roll_no,
      15,
      y
    );

    y += 8;

    doc.text(
      "Name: " + (data.student_name || ""),
      15,
      y
    );

    y += 8;

    doc.text(
      "Assessment: " +
      (data.assessment || ""),
      15,
      y
    );

    y += 12;

    doc.text(
      "Subjective: " +
      (data.subjective ?? "—"),
      15,
      y
    );

    y += 8;

    doc.text(
      "Objective: " +
      (data.objective ?? "—"),
      15,
      y
    );

    y += 8;

    doc.text(
      "Total: " +
      (data.total ?? "—"),
      15,
      y
    );

    y += 12;

    doc.setFontSize(12);

    doc.text("MARKS", 15, y);

    y += 10;

    doc.setFontSize(11);

    const marks = [
      ["MIL (Odia)", data.mil_odia],
      ["English", data.english],
      ["Hindi / Sanskrit", data.hindi_sanskrit],
      ["Mathematics", data.mathematics],
      ["Science", data.science],
      ["History", data.history],
      ["Geography", data.geography],
      ["Drawing", data.drawing]
    ];

    marks.forEach(item => {

      if (
        item[1] !== null &&
        item[1] !== undefined &&
        item[1] !== ""
      ) {

        doc.text(
          item[0] + ": " + item[1],
          20,
          y
        );

        y += 8;
      }
    });

    doc.save(
      "KGKHS_Result_" +
      (data.student_name || "Student") +
      "_" +
      data.roll_no +
      ".pdf"
    );
  };

  document.head.appendChild(script);
};

details.appendChild(pdfButton);

    } catch (err) {

      console.error(err);

      message.innerHTML =
        "<p>⚠️ Something went wrong. Please try again.</p>";
    }

  });

});
// ===============================
// ADMIN RESULT UPLOAD
// ===============================

function loadSheetJS() {
  return new Promise((resolve, reject) => {
    if (window.XLSX) return resolve();

    const s = document.createElement("script");
    s.src =
      "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";

    s.onload = resolve;
    s.onerror = () => reject(new Error("Unable to load Excel reader."));
    document.head.appendChild(s);
  });
}

function resultKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function resultNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

async function uploadStudentResults() {

  const fileInput =
    document.getElementById("result-marks-file");

  const classSelect =
    document.getElementById("result-upload-class");

  const assessmentSelect =
    document.getElementById("result-upload-assessment");

  const message =
    document.getElementById("result-upload-message");

  const file = fileInput.files[0];

  if (!file) {
    message.textContent =
      "❌ Please select a CSV or Excel marks file first.";
    return;
  }

  try {

    message.textContent =
      "⏳ Reading marks file...";

    await loadSheetJS();

    const buffer =
      await file.arrayBuffer();

    const workbook =
      XLSX.read(buffer, { type: "array" });

    const sheet =
      workbook.Sheets[workbook.SheetNames[0]];

    const rawRows =
      XLSX.utils.sheet_to_json(sheet, {
        defval: ""
      });

    if (!rawRows.length) {
      message.textContent =
        "❌ The marks file is empty.";
      return;
    }

    const studentClass =
      classSelect.value;

    const selectedAssessment =
      assessmentSelect.value;

    const tableName =
      "class_" +
      studentClass.toLowerCase() +
      "_results";

    const rows = rawRows.map(raw => {

      const r = {};

      Object.keys(raw).forEach(key => {
        r[resultKey(key)] = raw[key];
      });

      const roll =
        r.roll_no ??
        r.roll ??
        r.roll_number;

      if (roll === undefined || roll === "") {
        return null;
      }

      const pin =
        String(
          r.pin ||
          ("471CA" +
            String(roll)
              .trim()
              .padStart(2, "0"))
        )
        .trim()
        .toUpperCase();

      const payload = {

        class: studentClass,

        roll_no: Number(roll),

        pin: pin,

        student_name:
          r.student_name ||
          r.name ||
          "",

        assessment:
          r.assessment ||
          selectedAssessment
      };

      const markFields = [

        "subjective",
        "objective",
        "total",

        "mil_odia",
        "english",
        "hindi_sanskrit",
        "mathematics",
        "science",
        "history",
        "geography",
        "drawing"

      ];

      markFields.forEach(field => {

        if (
          r[field] !== undefined &&
          r[field] !== ""
        ) {
          payload[field] =
            resultNumber(r[field]);
        }

      });

      return payload;

    }).filter(Boolean);

    if (!rows.length) {

      message.textContent =
        "❌ No valid students found. Check the Roll No. column.";

      return;
    }

    message.textContent =
      "⏳ Saving " +
      rows.length +
      " result(s)...";

    let saved = 0;
    let failed = 0;
    let firstError = "";

    for (const row of rows) {

      const existing =
        await supabaseClient
          .from(tableName)
          .select("id")
          .eq("roll_no", row.roll_no)
          .eq("pin", row.pin)
          .eq("assessment", row.assessment)
          .limit(1);

      if (existing.error) {

        failed++;
        firstError =
          existing.error.message;

        continue;
      }

      let result;

      if (
        existing.data &&
        existing.data.length
      ) {

        result =
          await supabaseClient
            .from(tableName)
            .update(row)
            .eq(
              "id",
              existing.data[0].id
            );

      } else {

        result =
          await supabaseClient
            .from(tableName)
            .insert(row);
      }

      if (result.error) {

        failed++;

        firstError =
          result.error.message;

      } else {

        saved++;
      }
    }

    if (failed) {

      message.textContent =
        "⚠️ Saved " +
        saved +
        " result(s), but " +
        failed +
        " failed. " +
        firstError;

    } else {

      message.textContent =
        "✅ Successfully saved/published " +
        saved +
        " result(s) for Class " +
        studentClass +
        " — " +
        selectedAssessment +
        ".";

      fileInput.value = "";
    }

  } catch (error) {

    console.error(error);

    message.textContent =
      "❌ Upload failed: " +
      error.message;
  }
}
