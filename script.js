const menuBtn=document.querySelector('.menu-btn');const nav=document.querySelector('.nav-links');menuBtn.addEventListener('click',()=>nav.classList.toggle('open'));document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));document.getElementById('year').textContent=new Date().getFullYear();
document.querySelectorAll('.gallery figure img').forEach(img=>{img.addEventListener('click',()=>{const o=document.createElement('div');o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;cursor:pointer';const i=document.createElement('img');i.src=img.src;i.style.cssText='max-width:95%;max-height:90%;object-fit:contain;border-radius:10px';o.appendChild(i);o.onclick=()=>o.remove();document.body.appendChild(o)})});
// ===============================
// ===============================
// STUDENT RESULT CHECK
// ===============================

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("resultForm");
  const message = document.getElementById("resultMessage");
  const details = document.getElementById("resultDetails");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const studentClass =
      document.getElementById("resultClass").value.trim();

    const rollNo =
      document.getElementById("resultRoll").value.trim();

    const pin =
      document.getElementById("resultPin").value.trim();

    message.innerHTML = "";
    details.innerHTML = "";

    if (!studentClass || !rollNo || !pin) {
      message.innerHTML =
        "<p>Please enter Class, Roll No. and PIN.</p>";
      return;
    }

    message.innerHTML = "<p>Checking result...</p>";

    try {

      const { data, error } = await supabaseClient
        .from(`class_${studentClass.toLowerCase()}_students`)
        .select("*")
        .eq("class", studentClass)
        .eq("roll_no", Number(rollNo))
        .eq("pin", pin)
        .single();

      if (error || !data) {
        message.innerHTML =
          "<p>❌ Student details not found. Please check Class, Roll No. and PIN.</p>";
        return;
      }

      message.innerHTML =
        "<p>✅ Student verified successfully.</p>";

      details.innerHTML = `
        <div class="info-box">
          <h3>Student Details</h3>
          <p><strong>Class:</strong> ${data.class}</p>
          <p><strong>Roll No.:</strong> ${data.roll_no}</p>
          <p><strong>Name:</strong> ${data.name}</p>
        </div>
      `;

    } catch (err) {

      console.error(err);

      message.innerHTML =
        "<p>⚠️ Something went wrong. Please try again.</p>";
    }

  });
