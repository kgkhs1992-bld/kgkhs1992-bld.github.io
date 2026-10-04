/* NEVER MISS TO KNOW — Dynamic Supabase File Browser */
(function () {
  "use strict";

  const SUPABASE_URL = "https://tpnsjuajpsrclzbyqldt.supabase.co";
  const SUPABASE_KEY = "sb_publishable_BJJsT6hN4F1wHIrncc-mFw_YaAvaPZx";
  const BUCKET = "school-files";
  const ROOT = "admin/assets";

  const ICONS = {
    notices:"📢", examinations:"📝", "exam-messages":"📨",
    programs:"🎉", programmes:"🎉", events:"📅",
    "upcoming-events":"🔔", celebrations:"🎊", holidays:"🏖️",
    sports:"🏆", "annual-sports":"🏆", drill:"🥁",
    functions:"🎭", games:"🎮", dances:"💃", gallery:"🖼️",
    suravi:"🎪", "sishu-utsav":"🎈", "national-day":"🇮🇳",
    "national-days":"🇮🇳", observe:"👀", celebration:"🎊"
  };

  const GRADIENTS = [
    "linear-gradient(135deg,#ff5f8f,#ff9f68)",
    "linear-gradient(135deg,#2196f3,#64b5f6)",
    "linear-gradient(135deg,#8e5de7,#c084fc)",
    "linear-gradient(135deg,#22c55e,#6ee7b7)",
    "linear-gradient(135deg,#facc15,#fb923c)",
    "linear-gradient(135deg,#38bdf8,#67e8f9)",
    "linear-gradient(135deg,#a3e635,#4ade80)",
    "linear-gradient(135deg,#f472b6,#c084fc)"
  ];

async function start() {
    // Load the central folder icon engine first
    if (!window.KGKHSFolderIcons) {
        await new Promise((resolve, reject) => {
            const iconScript = document.createElement("script");
            iconScript.src = "folder-icons.js";
            iconScript.onload = resolve;
            iconScript.onerror = reject;
            document.head.appendChild(iconScript);
        });
    }
    const details = [...document.querySelectorAll("details")].find(d =>
      (d.querySelector("summary")?.textContent || "")
        .toUpperCase()
        .includes("TAP HERE TO OPEN SCHOOL UPDATES")
    );
    if (!details || details.dataset.dynamicNmk === "1") return;
    details.dataset.dynamicNmk = "1";

    const oldGrid = [...details.querySelectorAll("div")].find(el => {
      const s = el.getAttribute("style") || "";
      return s.includes("display:grid") &&
             s.includes("grid-template-columns") &&
             el.children.length > 3;
    });
    if (oldGrid) oldGrid.style.display = "none";

    const oldMessage = [...details.querySelectorAll("div")].find(el =>
      (el.textContent || "").includes("Stay Connected With Our School")
    );
    if (oldMessage) oldMessage.style.display = "none";

    const root = document.createElement("div");
    root.id = "dynamicNeverMiss";
    root.innerHTML = `
<style>
#dynamicNeverMiss{max-width:1100px;margin:0 auto}
#nmkStatus{text-align:center;padding:22px;color:#557080;font-weight:700}
#nmkFolders{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:18px}
.nmk-folder{border:0;border-radius:22px;padding:22px 12px;min-height:150px;
color:#17324d;cursor:pointer;text-align:center;box-shadow:0 8px 20px rgba(0,0,0,.12);
transition:.2s;position:relative}
.nmk-folder:hover{transform:translateY(-4px);box-shadow:0 14px 28px rgba(0,0,0,.16)}
.nmk-icon{font-size:46px}.nmk-name{display:block;font-size:20px;font-weight:800;margin:10px 0}
.nmk-open{display:inline-block;padding:6px 13px;border-radius:18px;background:#fff;
font-size:13px;font-weight:800}
#nmkFiles{display:none;margin-top:8px}
.nmk-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:14px;margin-bottom:18px;
border-radius:18px;background:linear-gradient(135deg,#fff7d6,#e8f8ff);box-shadow:0 6px 18px rgba(0,0,0,.08)}
.nmk-btn{border:0;border-radius:22px;padding:10px 16px;font-weight:800;cursor:pointer}
.nmk-back{background:#087fce;color:#fff}.nmk-refresh,.nmk-sort{background:#fff;color:#075a96;border:1px solid #cce3f3}
.nmk-title{flex:1;min-width:180px;text-align:center;font-size:26px;font-weight:900;color:#174a6b}
#nmkGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px}
.nmk-file{background:#fff;border:1px solid #dcecf7;border-radius:18px;overflow:hidden;
box-shadow:0 8px 22px rgba(0,50,100,.10);text-align:center}
.nmk-preview{height:210px;background:#f2f7fb;display:flex;align-items:center;justify-content:center;overflow:hidden}
.nmk-preview img{width:100%;height:100%;object-fit:cover;cursor:pointer}
.nmk-file-icon{font-size:72px}.nmk-name-file{padding:12px 10px 5px;font-weight:800;color:#174a6b;word-break:break-word}
.nmk-type{display:inline-block;margin:5px auto;padding:4px 8px;border-radius:10px;background:#e74c3c;color:#fff;font-size:11px;font-weight:900}
.nmk-date{margin:6px 10px 12px;padding:8px;border:1px solid #d8eaf7;border-radius:12px;
background:#f8fcff;color:#38566b;font-size:12px;font-weight:700}
.nmk-link{display:inline-block;margin:0 10px 14px;padding:9px 15px;border-radius:22px;
background:#075a96;color:#fff;text-decoration:none;font-weight:800}
.nmk-empty{text-align:center;padding:28px;background:#fff;border:1px dashed #c8dce9;border-radius:18px;color:#557080;font-weight:700}
.nmk-lightbox{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.92);
display:flex;align-items:center;justify-content:center;padding:20px;cursor:pointer}
.nmk-lightbox img{max-width:95vw;max-height:92vh;object-fit:contain;border-radius:12px}
@media(max-width:600px){
#nmkFolders{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.nmk-folder{min-height:135px;padding:18px 8px}.nmk-icon{font-size:38px}.nmk-name{font-size:16px}
.nmk-title{font-size:21px}
}
</style>
<div id="nmkStatus">Loading folders from Supabase...</div>
<div id="nmkFolders"></div>
<div id="nmkFiles">
  <div class="nmk-bar">
    <button class="nmk-btn nmk-back" type="button">← Back to Categories</button>
    <div class="nmk-title" id="nmkTitle">Files</div>
    <button class="nmk-btn nmk-refresh" type="button">↻ Refresh</button>
    <button class="nmk-btn nmk-sort" type="button">Latest First</button>
  </div>
  <div id="nmkGrid"></div>
</div>`;
    (oldGrid || details.querySelector("summary")).insertAdjacentElement("afterend", root);

    const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const status = root.querySelector("#nmkStatus");
    const foldersEl = root.querySelector("#nmkFolders");
    const filesEl = root.querySelector("#nmkFiles");
    const grid = root.querySelector("#nmkGrid");
    const title = root.querySelector("#nmkTitle");
    const back = root.querySelector(".nmk-back");
    const refresh = root.querySelector(".nmk-refresh");
    const sort = root.querySelector(".nmk-sort");

    let currentFolder = "";
    let latestFirst = true;

    const pretty = s => String(s).replace(/[_-]+/g," ").replace(/\s+/g," ").trim()
      .replace(/\b\w/g,c=>c.toUpperCase());

const icon = name => window.KGKHSFolderIcons?.getIcon(name) || "📁";

    const dateTime = value => {
      if (!value) return "Upload time unavailable";
      const d = new Date(value);
      if (isNaN(d)) return "Upload time unavailable";
      return d.toLocaleString("en-IN", {
        day:"2-digit", month:"short", year:"numeric",
        hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:true
      });
    };

    const kind = f => {
      const m = String(f.metadata?.mimetype || "").toLowerCase();
      const e = String(f.name).split(".").pop().toLowerCase();
      if (m.startsWith("image/") || ["jpg","jpeg","png","gif","webp","bmp","svg"].includes(e)) return "image";
      if (m === "application/pdf" || e === "pdf") return "pdf";
      if (m.startsWith("video/")) return "video";
      if (m.startsWith("audio/")) return "audio";
      return "file";
    };

    async function listAll(path) {
      let out=[], offset=0;
      while(true) {
        const {data,error}=await db.storage.from(BUCKET).list(path,{
          limit:100,offset,sortBy:{column:"created_at",order:"desc"}
        });
        if(error) throw error;
        const rows=data||[];
        out.push(...rows);
        if(rows.length<100) break;
        offset+=100;
      }
      return out;
    }

    function publicUrl(folder,name) {
      return db.storage.from(BUCKET).getPublicUrl(`${ROOT}/${folder}/${name}`).data.publicUrl;
    }

    async function loadFolders() {
      filesEl.style.display="none";
      foldersEl.style.display="grid";
      foldersEl.innerHTML="";
      status.style.display="block";
      status.textContent="Reading admin/assets/ from Supabase...";
      try {
        const rows=await listAll(ROOT);
        const folders=rows.filter(x=>x && x.id===null && x.name);
        if(!folders.length){
          status.textContent="No folders found inside admin/assets/.";
          return;
        }
        status.style.display="none";
        folders.forEach((f,i)=>{
          const b=document.createElement("button");
          b.type="button";
          b.className="nmk-folder";
          b.style.background=GRADIENTS[i%GRADIENTS.length];
        b.innerHTML = `<div class="nmk-icon">${window.KGKHSFolderIcons.getIcon(f.name)}</div>
            <span class="nmk-name">${pretty(f.name)}</span>
            <span class="nmk-open">OPEN FOLDER →</span>`;
          b.onclick=()=>loadFolder(f.name);
          foldersEl.appendChild(b);
        });
      } catch(e) {
        console.error(e);
        status.style.display="block";
        status.textContent="Unable to read Supabase folders. Please refresh the page.";
      }
    }

    async function loadFolder(folder) {
      currentFolder=folder;
   title.textContent = `${window.KGKHSFolderIcons.getIcon(folder)} ${pretty(folder)}`;
      foldersEl.style.display="none";
      status.style.display="none";
      filesEl.style.display="block";
      grid.innerHTML=`<div class="nmk-empty">Loading files...</div>`;
      try {
        const files=(await listAll(`${ROOT}/${folder}`)).filter(x=>x && x.id!==null && x.name);
        files.sort((a,b)=>{
          const ad=new Date(a.created_at||a.updated_at||0).getTime();
          const bd=new Date(b.created_at||b.updated_at||0).getTime();
          return latestFirst ? bd-ad : ad-bd;
        });
        render(files);
      } catch(e) {
        console.error(e);
        grid.innerHTML=`<div class="nmk-empty">Unable to load files from this folder.</div>`;
      }
    }

    function render(files) {
      grid.innerHTML="";
      if(!files.length) {
        grid.innerHTML=`<div class="nmk-empty">No files are currently inside this folder.</div>`;
        return;
      }
      files.forEach(f=>{
        const k=kind(f), u=publicUrl(currentFolder,f.name);
        const card=document.createElement("article");
        card.className="nmk-file";
        const preview=document.createElement("div");
        preview.className="nmk-preview";
        if(k==="image") {
          const img=document.createElement("img");
          img.src=u; img.alt=f.name; img.loading="lazy";
          img.onclick=()=>lightbox(u);
          preview.appendChild(img);
        } else {
          const x=document.createElement("div");
          x.className="nmk-file-icon";
          x.textContent=k==="pdf"?"📄":k==="video"?"🎬":k==="audio"?"🎵":"📎";
          preview.appendChild(x);
        }
        const name=document.createElement("div");
        name.className="nmk-name-file"; name.textContent=f.name;
        const type=document.createElement("span");
        type.className="nmk-type"; type.textContent=k.toUpperCase();
        const dt=document.createElement("div");
        dt.className="nmk-date"; dt.textContent=`📅 Uploaded: ${dateTime(f.created_at||f.updated_at)}`;
        const a=document.createElement("a");
        a.className="nmk-link"; a.href=u; a.target="_blank"; a.rel="noopener";
        a.textContent=k==="pdf"?"📄 OPEN PDF":"🔗 OPEN FILE";
        card.append(preview,name,type,dt,a);
        grid.appendChild(card);
      });
    }

    function lightbox(url) {
      const box=document.createElement("div");
      box.className="nmk-lightbox";
      const img=document.createElement("img");
      img.src=url; box.appendChild(img);
      box.onclick=()=>box.remove();
      document.body.appendChild(box);
    }

    back.onclick=loadFolders;
    refresh.onclick=()=>currentFolder && loadFolder(currentFolder);
    sort.onclick=()=>{
      latestFirst=!latestFirst;
      sort.textContent=latestFirst?"Latest First":"Oldest First";
      if(currentFolder) loadFolder(currentFolder);
    };

    loadFolders();
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start);
  else start();
})();
