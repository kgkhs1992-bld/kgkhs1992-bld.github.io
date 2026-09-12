
// ===============================
// PAGE INITIALIZATION
// ===============================

document.addEventListener("DOMContentLoaded", function () {

  // MENU
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav-links");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      nav.classList.toggle("open");
    });
  }

});

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
function initStudentResultForm() {

  const form = document.getElementById("resultForm");
  const message = document.getElementById("resultMessage");
  const details = document.getElementById("resultDetails");

  if (!form) return; 
  const pinInput = document.getElementById("resultPin");
const rollInput = document.getElementById("resultRoll");
if (!pinInput || !rollInput) return;
pinInput.maxLength = 8;

pinInput.addEventListener("input", function () {
  this.value = this.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);
});

function generatePIN() {
    const roll = rollInput.value.trim();

    if (/^\d{1,3}$/.test(roll)) {
        pinInput.value = "471CA" + roll.padStart(2, "0");
    } else {
        pinInput.value = "";
    }
}

rollInput.addEventListener("input", function () {
  const roll = this.value.trim();

  if (/^\d{1,3}$/.test(roll)) {
    pinInput.value = "471CA" + roll.padStart(2, "0");
  } else {
    pinInput.value = "";
  }
});

rollInput.addEventListener("change", function () {
  const roll = this.value.trim();

  if (/^\d{1,3}$/.test(roll)) {
    pinInput.value = "471CA" + roll.padStart(2, "0");
  } else {
    pinInput.value = "";
  }
});

if (rollInput.value.trim()) {
  rollInput.dispatchEvent(new Event("input"));
}
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

if (classSelect) classSelect.addEventListener("change", updateResultTypes);
if (classSelect && resultTypeSelect) updateResultTypes();

  form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const studentClass =
    document.getElementById("resultClass").value.trim().replace(/^Class\s+/i, "");
    const rollNo =
      document.getElementById("resultRoll").value.trim();

    const pin =
      document.getElementById("resultPin").value.trim();
    const selectedAssessment = resultTypeSelect.value.trim();

const assessmentMap = {
  FA1: "Formative Assessment 1",
  FA2: "Formative Assessment 2",
  FA3: "Formative Assessment 3",
  FA4: "Formative Assessment 4",
  HALF_YEARLY: "Half Yearly",
  ANNUAL: "Annual",
  SA1: "SA1",
  SA2: "SA2",
  UT1: "UT1",
  UT2: "UT2",
  UT3: "UT3",
  UT4: "UT4"
};

const assessment =
  assessmentMap[selectedAssessment] || selectedAssessment;
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
  .eq("pin", pin)
.eq("assessment", assessment)
.limit(1);
if (error) {
  console.error(error);
  message.innerHTML =
    "<p>⚠️ Unable to check result. Please try again.</p>";
  return;
}



const data = rows && rows.length ? rows[0] : null;

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
<p><strong>Roll No.:</strong> ${data.roll_no || rollNo}</p>
<p><strong>Name:</strong> ${data.student_name || "—"}</p>
<p><strong>Assessment:</strong> ${data.assessment || assessment}</p>

<hr>
`;

          
      const isHalfAnnual =
  (studentClass === "IX" || studentClass === "X") &&
  (
    assessment === "Half Yearly" ||
    assessment === "Annual"
  );

let foundMarks = false;

if (isHalfAnnual) {

  const subjectPairs = [
    ["mil_odia_sub", "mil_odia_obj", "MIL (Odia)"],
    ["english_sub", "english_obj", "English"],
    ["hindi_sanskrit_sub", "hindi_sanskrit_obj", "Hindi / Sanskrit"],
    ["mathematics_sub", "mathematics_obj", "Mathematics"],
    ["science_sub", "science_obj", "Science"],
    ["social_science_sub", "social_science_obj", "Social Science"]
  ];

  html += `
    <div style="overflow:auto;">
      <table style="width:100%;border-collapse:collapse;margin-top:15px;">
        <thead>
          <tr>
            <th style="padding:8px;border:1px solid #ccc;">Subject</th>
            <th style="padding:8px;border:1px solid #ccc;">Subjective</th>
            <th style="padding:8px;border:1px solid #ccc;">Objective</th>
          </tr>
        </thead>
        <tbody>
  `;

  subjectPairs.forEach(([subField, objField, subjectName]) => {

    const sub = data[subField];
    const obj = data[objField];

    if (
      sub !== null && sub !== undefined && sub !== "" ||
      obj !== null && obj !== undefined && obj !== ""
    ) {
      foundMarks = true;

      html += `
        <tr>
          <td style="padding:8px;border:1px solid #ccc;">
            <strong>${subjectName}</strong>
          </td>
          <td style="padding:8px;border:1px solid #ccc;">
            ${sub ?? "—"}
          </td>
          <td style="padding:8px;border:1px solid #ccc;">
            ${obj ?? "—"}
          </td>
        </tr>
      `;
    }

  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  if (foundMarks) {

    html += `
      <div style="margin-top:15px;">
        <p>
          <strong>SECURED MARKS:</strong>
          ${data.secured_marks ?? data.total ?? "—"}
        </p>

        <p>
          <strong>FULL MARKS:</strong>
          ${data.full_marks ?? 600}
        </p>
      </div>
    `;

  }

} else {

  const subjects = studentClass === "VIII"
    ? [
        ["mil_odia", "MIL (Odia)"],
        ["english", "English"],
        ["hindi_sanskrit", "Hindi / Sanskrit"],
        ["mathematics", "Mathematics"],
        ["science", "Science"],
        ["history", "History"],
        ["geography", "Geography"],
        ["drawing", "Drawing"]
      ]
    : [
        ["mil_odia", "MIL (Odia)"],
        ["english", "English"],
        ["hindi_sanskrit", "Hindi / Sanskrit"],
        ["mathematics", "Mathematics"],
        ["science", "Science"],
        ["social_science", "Social Science"]
      ];

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
    html += "<p>Marks have not been entered yet.</p>";
  }

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
  "Class: " + (data.class || studentClass),
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
      (data.assessment || assessment),
      15,
      y
    
  
);

y += 8;
  

    doc.text(
      "Subjective: " +
      (data.subjective ?? "—"),
      15,
y
);
      
const className = String(data.class || studentClass || "").trim().toUpperCase();

const assessmentName = String(data.assessment || assessment || "").trim().toUpperCase();
const totalMarks = Number(data.total);
let maxMarks = 0;

if (className === "VIII") {

    if (
        assessmentName.includes("SUMMATIVE") ||
        assessmentName.includes("SA1") ||
        assessmentName.includes("SA2")
    ) {
        maxMarks = 400;
    } 
    else if (
        assessmentName.includes("UNIT TEST") ||
        assessmentName.includes("UT1") ||
        assessmentName.includes("UT2") ||
        assessmentName.includes("UT3") ||
        assessmentName.includes("UT4")
    ) {
        maxMarks = 120;
    }

} else if (className === "IX" || className === "X") {
    if (
        assessmentName.includes("FORMATIVE") ||
        assessmentName === "FA1" ||
        assessmentName === "FA2" ||
        assessmentName === "FA3" ||
        assessmentName === "FA4"
    ) {
        maxMarks = 300;
    } 
    else if (
        assessmentName.includes("HALF YEARLY") ||
        assessmentName.includes("ANNUAL")
    ) {
        maxMarks = 600;
    } 
    else if (
        assessmentName.includes("UNIT TEST") ||
        assessmentName.includes("UT1") ||
        assessmentName.includes("UT2") ||
        assessmentName.includes("UT3") ||
        assessmentName.includes("UT4")
    ) {
        maxMarks = 90;
    }
}

        if (totalMarks !== "" && !isNaN(totalMarks) && maxMarks > 0) {
            const percentage = (totalMarks / maxMarks) * 100;

            let grade = "";

            if (percentage >= 90) grade = "A1";
else if (percentage >= 80) grade = "A2";
else if (percentage >= 70) grade = "B1";
else if (percentage >= 60) grade = "B2";
else if (percentage >= 50) grade = "C";
else if (percentage >= 40) grade = "D";
else if (percentage >= 33) grade = "E";
else grade = "F";

            y += 8;

            doc.text(
                "Percentage: " + percentage.toFixed(2) + "%",
                15,
                y
            );

            y += 8;

            doc.text(
                "Grade: " + grade,
                15,
                y
            );
        }
    y += 12;

    doc.setFontSize(12);

    doc.text("MARKS", 15, y);

    y += 10;

    doc.setFontSize(11);

    
const isHalfAnnual =
  (className === "IX" || className === "X") &&
  (
    assessmentName.includes("HALF YEARLY") ||
    assessmentName.includes("ANNUAL")
  );

if (isHalfAnnual) {

  doc.text("Subject", 20, y);
  doc.text("Subjective", 95, y);
  doc.text("Objective", 135, y);

  y += 8;

  const marks = [
    ["MIL (Odia)", data.mil_odia_sub, data.mil_odia_obj],
    ["English", data.english_sub, data.english_obj],
    ["Hindi / Sanskrit", data.hindi_sanskrit_sub, data.hindi_sanskrit_obj],
    ["Mathematics", data.mathematics_sub, data.mathematics_obj],
    ["Science", data.science_sub, data.science_obj],
    ["Social Science", data.social_science_sub, data.social_science_obj]
  ];

  marks.forEach(item => {

    if (
      (item[1] !== null && item[1] !== undefined && item[1] !== "") ||
      (item[2] !== null && item[2] !== undefined && item[2] !== "")
    ) {

      doc.text(item[0], 20, y);
      doc.text(String(item[1] ?? "—"), 95, y);
      doc.text(String(item[2] ?? "—"), 135, y);

      y += 8;
    }

  });

} else {

  const marks = className === "VIII"
    ? [
        ["MIL (Odia)", data.mil_odia],
        ["English", data.english],
        ["Hindi / Sanskrit", data.hindi_sanskrit],
        ["Mathematics", data.mathematics],
        ["Science", data.science],
        ["History", data.history],
        ["Geography", data.geography],
        ["Drawing", data.drawing]
      ]
    : [
        ["MIL (Odia)", data.mil_odia],
        ["English", data.english],
        ["Hindi / Sanskrit", data.hindi_sanskrit],
        ["Mathematics", data.mathematics],
        ["Science", data.science],
        ["Social Science", data.social_science]
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
}
  // RESULT SUMMARY - UPDATED
  y += 10;

  doc.setFontSize(11);

  const pdfPercentage =
    maxMarks > 0 ? (Number(data.total) / maxMarks) * 100 : 0;

  doc.text("Total = " + (data.total ?? "—"), 15, y);

  y += 8;

  doc.text(
    "Percentage = " + pdfPercentage.toFixed(2) + "%",
    15,
    y
  );

  y += 8;

doc.text(
  "Result Published on : " +
    (
      data.result_publication_date
        ? new Date(data.result_publication_date).toLocaleDateString("en-IN")
        : "Not available"
    ),
  15,
  y
);

y += 8;

doc.text(
  "Downloaded on : " +
    new Date().toLocaleDateString("en-IN"),
  15,
  y
);

  y += 18;

  doc.text("Sign of HM", 150, y);

  y += 10;

  
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

}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStudentResultForm);
} else {
  initStudentResultForm();
}
// ===============================
// SCHOOL FILE UPLOAD
// ===============================

async function uploadSchoolFile() {

  const fileInput = document.getElementById("school-file");
 const categorySelect = document.getElementById("file-category");
const message = document.getElementById("upload-message");
  if (!fileInput || !fileInput.files.length) {
    if (message) message.textContent = "❌ Please choose a file first.";
    return;
  }

  const file = fileInput.files[0];

  try {

    if (message) message.textContent = "⏳ Uploading...";

    const category =
      categorySelect ? categorySelect.value : "Gallery";

    const fileName =
      Date.now() + "_" + file.name.replace(/\s+/g, "_");

    const filePath =
      category + "/" + fileName;

    const { error } = await supabaseClient.storage
      .from("school-files")
      .upload(filePath, file, {
        upsert: true
      });

    if (error) {
      console.error(error);
      if (message) {
        message.textContent =
          "❌ Upload failed: " + error.message;
      }
      return;
    }

    if (message) {
      message.textContent =
        "✅ File uploaded successfully.";
    }

    fileInput.value = "";

  } catch (error) {

    console.error(error);

    if (message) {
      message.textContent =
        "❌ Upload failed: " + error.message;
    }
  }
}

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

// ===============================
// NEW ADMIN RESULT UPLOAD WORKFLOW
// ===============================



const RESULT_ASSESSMENTS = {
  VIII: [
    ["SA1", "Summative Assessment 1", "VIII SA-1"],
    ["SA2", "Summative Assessment 2", "VIII SA-2"],
    ["UT1", "Unit Test 1", "VIII UT-1"],
    ["UT2", "Unit Test 2", "VIII UT-2"],
    ["UT3", "Unit Test 3", "VIII UT-3"],
    ["UT4", "Unit Test 4", "VIII UT-4"]
    ],

  IX: [
    ["FA1", "Formative Assessment 1", "IX FA-1"],
    ["FA2", "Formative Assessment 2", "IX FA-2"],
    ["FA3", "Formative Assessment 3", "IX FA-3"],
    ["FA4", "Formative Assessment 4", "IX FA-4"],
    ["HALF_YEARLY", "Half Yearly", "IX Half-Yearly"],
    ["ANNUAL", "Annual", "IX Annual"]
  ],

  X: [
    ["FA1", "Formative Assessment 1", "X FA-1"],
    ["FA2", "Formative Assessment 2", "X FA-2"],
    ["FA3", "Formative Assessment 3", "X FA-3"],
    ["FA4", "Formative Assessment 4", "X FA-4"],
    ["HALF_YEARLY", "Half Yearly", "X Half-Yearly"],
    ["ANNUAL", "Annual", "X Annual"]
  ]
};


// Populate assessment list according to class
function setupResultUploadOptions() {

  const classSelect =
    document.getElementById("result-upload-class");

  const assessmentSelect =
    document.getElementById("result-upload-assessment");

  if (!classSelect || !assessmentSelect) return;

  function refreshAssessments() {

    const list =
      RESULT_ASSESSMENTS[classSelect.value] || [];

    assessmentSelect.innerHTML = "";

    list.forEach(item => {

      const option =
        document.createElement("option");

      option.value = item[0];
      option.textContent = item[1];

      assessmentSelect.appendChild(option);

    });
  }

  classSelect.addEventListener(
    "change",
    refreshAssessments
  );

  refreshAssessments();
}


// Get selected class / assessment
function getSelectedResultAssessment() {

  const classValue =
    document.getElementById(
      "result-upload-class"
    ).value;

  const assessmentValue =
    document.getElementById(
      "result-upload-assessment"
    ).value;

  const list =
    RESULT_ASSESSMENTS[classValue] || [];

  const item =
    list.find(
      x => x[0] === assessmentValue
    );

  return {
    classValue: classValue,
    assessmentValue: assessmentValue,
    assessmentLabel: item ? item[1] : "",
    sheetName: item ? item[2] : ""
  };
}


// Convert Excel column names to safe keys
function normalizeResultKey(value) {
  const key = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  const aliases = {
    "mil_odia_total": "mil_odia",
    "mil_odia_marks": "mil_odia",
        "mil_odia_subj": "mil_odia_sub",
    "english_subj": "english_sub",
    "hindi_sanskrit_subj": "hindi_sanskrit_sub",
    "mathematics_subj": "mathematics_sub",
    "science_subj": "science_sub",
    "social_science_subj": "social_science_sub",
    "english_total": "english",
    "english_marks": "english",
    "hindi_sanskrit_total": "hindi_sanskrit",
    "hindi_sanskrit_marks": "hindi_sanskrit",
    "mathematics_total": "mathematics",
    "mathematics_marks": "mathematics",
    "science_total": "science",
    "science_marks": "science",
    "history_total": "history",
    "history_marks": "history",
    "geography_total": "geography",
    "geography_marks": "geography",
    "drawing_total": "drawing",
    "drawing_marks": "drawing",
    "social_science_total": "social_science",
    "social_science_marks": "social_science"
  };

  return aliases[key] || key;
}


// Convert marks to number
function resultMark(value) {

  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const n = Number(value);

  return Number.isFinite(n) ? n : null;
}


// Create Supabase record
function makeStudentResultPayload(
  raw,
  meta
) {

  const r = {};

  Object.keys(raw).forEach(key => {

    r[normalizeResultKey(key)] =
      raw[key];

  });


  const roll =
    r.roll_no ??
    r.roll ??
    r.roll_number;


  const name =
    r.student_name ??
    r.name ??
    "";


  if (
    roll === undefined ||
    roll === "" ||
    !name
  ) {
    return null;
  }


  const payload = {

    roll_no: Number(roll),

    pin:
      String(
        r.pin ||
        (
          "471CA" +
          String(roll)
            .trim()
            .padStart(2, "0")
        )
      )
      .trim()
      .toUpperCase(),

    student_name:
      String(name).trim(),

    assessment:
      
    meta.assessmentLabel

  };


  // Normal single-mark subjects
  const fields = [

    "mil_odia",
    "english",
    "hindi_sanskrit",
    "mathematics",
    "science",
    "history",
    "geography",
    "drawing",
    "social_science",
    

  ];


  fields.forEach(field => {

    if (
      r[field] !== undefined &&
      r[field] !== ""
    ) {

      payload[field] =
        resultMark(r[field]);

    }

  });
// Automatically calculate totals
if (meta.classValue === "VIII") {

  const totalSubjects = [
    "mil_odia",
    "english",
    "hindi_sanskrit",
    "mathematics",
    "science",
    "history",
    "geography",
    "drawing"
  ];

  payload.total = totalSubjects.reduce(
    (sum, field) => sum + (payload[field] ?? 0),
    0
  );

} else if (
  (meta.classValue === "IX" || meta.classValue === "X") &&
  ["FA1", "FA2", "FA3", "FA4"].includes(meta.assessmentValue)
) {

  const totalSubjects = [
    "mil_odia",
    "english",
    "hindi_sanskrit",
    "mathematics",
    "science",
    "social_science"
  ];

  payload.total = totalSubjects.reduce(
    (sum, field) => sum + (payload[field] ?? 0),
    0
  );
}

  // Half-Yearly / Annual:
  // combine Subjective + Objective
  const subjectPairs = [

    ["mil_odia", "mil_odia_sub", "mil_odia_obj"],

    ["english", "english_sub", "english_obj"],

    [
      "hindi_sanskrit",
      "hindi_sanskrit_sub",
      "hindi_sanskrit_obj"
    ],

    [
      "mathematics",
      "mathematics_sub",
      "mathematics_obj"
    ],

    [
      "science",
      "science_sub",
      "science_obj"
    ],

    [
      "social_science",
      "social_science_sub",
      "social_science_obj"
    ]

  ];


  let calculatedTotal = 0;
  let hasMarks = false;


  subjectPairs.forEach(pair => {

    const subject = pair[0];
    const sub = resultMark(r[pair[1]]);
    const obj = resultMark(r[pair[2]]);


    if (sub !== null || obj !== null) {

      const total =
        (sub || 0) +
        (obj || 0);

      payload[subject] =
        total;
payload[pair[1]] = sub;
payload[pair[2]] = obj;
      calculatedTotal +=
        total;

      hasMarks = true;

    }

  });


  if (
    hasMarks &&
    (
      payload.total === undefined ||
      payload.total === null
    )
  ) {

    payload.total =
      calculatedTotal;

  }

// Class IX/X Half-Yearly and Annual Full Marks
if (
  (meta.classValue === "IX" ||
   meta.classValue === "X") &&
  ["HALF_YEARLY", "ANNUAL"].includes(meta.assessmentValue) &&
  hasMarks
) {
  payload.total = calculatedTotal;
  payload.full_marks = 600;
}
  return payload;
}


// Escape preview text safely
function escapeResultHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// =====================================
// STEP 1 — READ EXCEL AND PREVIEW
// =====================================

async function previewStudentResults() {

  const fileInput =
    document.getElementById(
      "result-marks-file"
    );

  const preview =
    document.getElementById(
      "result-upload-preview"
    );

  const actions =
    document.getElementById(
      "result-upload-actions"
    );

  const message =
    document.getElementById(
      "result-upload-message"
    );


  const file =
    fileInput &&
    fileInput.files[0];


  if (!file) {

    message.textContent =
      "❌ Please choose the School Marks Entry Master Excel file first.";

    return;
  }


  try {

    message.textContent =
      "⏳ Reading Excel...";

    preview.innerHTML = "";

    actions.style.display =
      "none";


    pendingStudentResults = [];
    pendingResultMeta = null;


    await loadSheetJS();


    const meta =
      getSelectedResultAssessment();


    if (!meta.sheetName) {

      message.textContent =
        "❌ Please select Class and Assessment.";

      return;
    }


    const workbook =
      XLSX.read(
        await file.arrayBuffer(),
        { type: "array" }
      );


    const sheet =
      workbook.Sheets[
        meta.sheetName
      ];


    if (!sheet) {

      message.textContent =
        "❌ Excel sheet not found: " +
        meta.sheetName;

      return;
    }


    const rawRows =
      XLSX.utils.sheet_to_json(
        sheet,
        { defval: "" }
      );


    if (!rawRows.length) {

      message.textContent =
        "❌ The selected sheet is empty.";

      return;
    }


    const rows =
  rawRows
    .filter(raw =>
      Object.values(raw)
        .slice(4)
        .some(value =>
          value !== null &&
          value !== undefined &&
          value !== ""
        )
    )
    .map(raw =>
      makeStudentResultPayload(
        raw,
        meta
      )
    )
    .filter(Boolean);


    if (!rows.length) {

      message.textContent =
        "❌ No valid student records were found.";

      return;
    }


    pendingStudentResults =
      rows;

    pendingResultMeta =
      meta;


    // Preview columns
const columns =
  meta.classValue === "VIII"
    ? [
        ["roll_no", "Roll No."],
        ["student_name", "Student Name"],
        ["mil_odia", "MIL (Odia)"],
        ["english", "English"],
        ["hindi_sanskrit", "Hindi/Sanskrit"],
        ["mathematics", "Mathematics"],
        ["science", "Science"],
        ["history", "History"],
        ["geography", "Geography"],
        ["drawing", "Drawing"],
        ["total", "Grand Total"]
      ]
    : [
        ["roll_no", "Roll No."],
        ["student_name", "Student Name"],
        ["mil_odia", "MIL (Odia)"],
        ["english", "English"],
        ["hindi_sanskrit", "Hindi/Sanskrit"],
        ["mathematics", "Mathematics"],
        ["science", "Science"],
        ["social_science", "Social Science"],
        ["total", "Grand Total"]
      ];


    const header =
      columns
        .map(
          item =>
            "<th style='padding:8px;border:1px solid #ccc;'>" +
            item[1] +
            "</th>"
        )
        .join("");


    const body =
      rows
        .map(row => {

          return (
            "<tr>" +
            columns
              .map(item => {

                return (
                  "<td style='padding:8px;border:1px solid #ccc;'>" +
                  escapeResultHtml(
                    row[item[0]] ?? ""
                  ) +
                  "</td>"
                );

              })
              .join("") +
            "</tr>"
          );

        })
        .join("");


    preview.innerHTML =

      "<div style='overflow:auto;max-height:420px;border:1px solid #ccc;border-radius:8px;'>" +

      "<table style='width:100%;border-collapse:collapse;min-width:850px;'>" +

      "<thead><tr>" +
      header +
      "</tr></thead>" +

      "<tbody>" +
      body +
      "</tbody>" +

      "</table></div>" +

      "<p><strong>Preview ready:</strong> " +
      rows.length +
      " student result(s) from <strong>" +
      escapeResultHtml(
        meta.sheetName
      ) +
      "</strong>.</p>" +

      "<p>⚠️ Check the marks carefully before confirming.</p>";


    actions.style.display =
      "block";


    message.textContent =
      "✅ Excel read successfully. Please review the preview.";

  } catch (error) {

    console.error(error);

    message.textContent =
      "❌ Preview failed: " +
      error.message;

  }

}


// =====================================
// STEP 2 — CANCEL PREVIEW
// =====================================

function cancelStudentResultsPreview() {

  pendingStudentResults = [];
  pendingResultMeta = null;


  const preview =
    document.getElementById(
      "result-upload-preview"
    );

  const actions =
    document.getElementById(
      "result-upload-actions"
    );

  const message =
    document.getElementById(
      "result-upload-message"
    );


  if (preview)
    preview.innerHTML = "";


  if (actions)
  actions.style.display = "none";
}

async function confirmStudentResults() {
  const message =
    document.getElementById("result-upload-message");

  const meta =
    getSelectedResultAssessment();

  if (!meta || !meta.classValue) {
    message.textContent =
      "❌ Class and Assessment information is missing.";
    return;
  }

  if (
    !pendingStudentResults ||
    !pendingStudentResults.length
  ) {
    message.textContent =
      "❌ No student results are ready to save.";
    return;
  }

  pendingResultMeta = meta;

  const tableName =
    "class_" +
    meta.classValue.toLowerCase() +
    "_results";

  try {
    message.textContent =
      "⏳ Saving " +
      pendingStudentResults.length +
      " result(s) to Supabase...";

    const result =
      await supabaseClient
        .from(tableName)
        .insert(pendingStudentResults)
        .select("*");

    if (result.error) {
      console.error("Supabase save error:", result.error);

      message.textContent =
        "❌ Save failed: " +
        result.error.message;

      return;
    }

    if (
      !result.data ||
      result.data.length === 0
    ) {
      message.textContent =
        "❌ Supabase did not return the saved result rows.";

      return;
    }

    message.textContent =
      "✅ Successfully saved " +
      result.data.length +
      " result(s) for Class " +
      pendingResultMeta.classValue +
      " — " +
      pendingResultMeta.assessmentLabel +
      ".";

    const preview =
      document.getElementById(
        "result-upload-preview"
      );

    const actions =
      document.getElementById(
        "result-upload-actions"
      );

    if (preview) {
      preview.innerHTML =
        "<p>✅ Results saved successfully to Supabase.</p>";
    }

    if (actions) {
      actions.style.display = "none";
    }

    pendingStudentResults = [];
    pendingResultMeta = null;

  } catch (error) {
    console.error(
      "Unexpected result save error:",
      error
    );

    message.textContent =
      "❌ Save failed: " +
      (error.message || String(error));
  }
} 


