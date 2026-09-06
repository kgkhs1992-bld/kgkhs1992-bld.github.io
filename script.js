const menuBtn=document.querySelector('.menu-btn');const nav=document.querySelector('.nav-links');menuBtn.addEventListener('click',()=>nav.classList.toggle('open'));document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));document.getElementById('year').textContent=new Date().getFullYear();
document.querySelectorAll('.gallery figure img').forEach(img=>{img.addEventListener('click',()=>{const o=document.createElement('div');o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;cursor:pointer';const i=document.createElement('img');i.src=img.src;i.style.cssText='max-width:95%;max-height:90%;object-fit:contain;border-radius:10px';o.appendChild(i);o.onclick=()=>o.remove();document.body.appendChild(o)})});
// ===============================
// STUDENT RESULT CHECK
// ===============================

document.addEventListener("DOMContentLoaded", function () {

  const checkButton = document.getElementById("checkResultBtn");

  if (!checkButton) return;

  checkButton.addEventListener("click", async function () {

    const studentClass = document.getElementById("resultClass").value;
    const rollNo = document.getElementById("resultRoll").value.trim();
    const pin = document.getElementById("resultPin").value.trim();

    const message = document.getElementById("resultMessage");
    const resultDisplay = document.getElementById("resultDisplay");

    message.innerHTML = "";
    resultDisplay.style.display = "none";

    if (!studentClass || !rollNo || !pin) {
      message.innerHTML =
        "<p>Please enter Class, Roll No. and PIN.</p>";
      return;
    }

    message.innerHTML = "<p>Checking result...</p>";

    // Supabase connection will be added in the next step.
    // Do not change this section yet.

  });

});
