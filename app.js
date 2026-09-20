

const PAPER = { a4: [595.28,841.89], letter: [612,792], legal: [612,1008] };

const QUALITY_PRESETS = {
  compact:  {label:"Compacto", format:"jpeg", jpegQuality:.58, maxDim:1180, estimateBpp:.105, meter:25},
  standard: {label:"Padrão",   format:"jpeg", jpegQuality:.78, maxDim:1700, estimateBpp:.19,  meter:50},
  high:     {label:"Alta",     format:"jpeg", jpegQuality:.90, maxDim:2300, estimateBpp:.31,  meter:75},
  maximum:  {label:"Máxima",   format:"png",  jpegQuality:1,   maxDim:0,    estimateBpp:.78,  meter:100}
};

const BG_DATA = {
  mvsCover: "./assets/mvs-cover.png",
  mvsLetterhead: "./assets/mvs-letterhead.png",
  gdvCover: "./assets/gdv-cover.png",
  gdvLetterhead: "./assets/gdv-letterhead.png"
};

const DOC_TYPES = [
  "", "Procuração", "Substabelecimento", "Contrato social / atos constitutivos",
  "Documento de identificação", "CPF", "CNH", "Carteira profissional", "Comprovante de residência",
  "Comprovante de renda", "Extrato", "Contrato", "Declaração", "Certidão",
  "Laudo médico", "Relatório médico", "Exame", "Receita médica",
  "Comprovante", "Comprovante de pagamento", "Guia", "CTPS", "Passaporte",
  "Fotografias", "Documentos de comprovação", "Documentos de instrução",
  "Petição inicial", "Petição", "Contestação", "Réplica", "Recurso", "Contrarrazões",
  "Outros documentos"
];

const ATTACHMENT_IMPORTANCE = [
  "Procuração", "Substabelecimento", "Contrato social / atos constitutivos",
  "Documento de identificação", "CPF", "CNH", "Carteira profissional",
  "Comprovante de residência", "Comprovante de renda", "Extrato",
  "Contrato", "Declaração", "Certidão",
  "Laudo médico", "Relatório médico", "Exame", "Receita médica",
  "Comprovante", "Comprovante de pagamento", "Guia",
  "CTPS", "Passaporte", "Fotografias",
  "Documentos de comprovação", "Documentos de instrução",
  "Outros documentos", ""
];

const state = {
  docs: [],
  activeDocId: null,
  activeAttachmentId: null,
  activePageId: null,
  activeExportDocId: null,
  lastBlobUrl: null,
  drag: null,
  bgCache: {},
  customBackgrounds: { cover: null, letterhead: null },
  pendingAttachmentTarget: null,
  previewRaf: 0,
  fontBytes: { montserratRegular: null, montserratBold: null, libreRegular: null },
  fontsLoadedNotice: false,
  pdfQuality: "standard",
  ocrWorker: null,
  ocrWorkerLang: null
};

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

const $ = id => document.getElementById(id);
const els = {
  installBtn:$("installBtn"), installModal:$("installModal"), installInstructions:$("installInstructions"), installNativeBtn:$("installNativeBtn"), closeInstallBtn:$("closeInstallBtn"), aboutBtn:$("aboutBtn"), aboutModal:$("aboutModal"), closeAboutBtn:$("closeAboutBtn"), copyPixBtn:$("copyPixBtn"), newProjectBtn:$("newProjectBtn"), uploadSourceModal:$("uploadSourceModal"), chooseFilesBtn:$("chooseFilesBtn"), takePhotoBtn:$("takePhotoBtn"), closeUploadSourceBtn:$("closeUploadSourceBtn"),
  includeCover:$("includeCover"), includeLetterhead:$("includeLetterhead"), globalTemplate:$("globalTemplate"), customCoverFile:$("customCoverFile"), customLetterheadFile:$("customLetterheadFile"), customCoverName:$("customCoverName"), customLetterheadName:$("customLetterheadName"), clearCustomCoverBtn:$("clearCustomCoverBtn"), clearCustomLetterheadBtn:$("clearCustomLetterheadBtn"),
  fontMontserratRegular:$("fontMontserratRegular"), fontMontserratBold:$("fontMontserratBold"), fontLibreRegular:$("fontLibreRegular"),
  addDocBtn:$("addDocBtn"), renumberDocsBtn:$("renumberDocsBtn"), docTabs:$("docTabs"),
  docNumber:$("docNumber"), docTitle:$("docTitle"), docClassification:$("docClassification"),
  scanType:$("scanType"), scanInfoBtn:$("scanInfoBtn"), uploadMode:$("uploadMode"), facesPerSheet:$("facesPerSheet"), facesPerSheetWrap:$("facesPerSheetWrap"), scanHint:$("scanHint"), fileInput:$("fileInput"), cameraInput:$("cameraInput"), nestedAttachmentFileInput:$("nestedAttachmentFileInput"), dropzone:$("dropzone"), attachmentViewMode:$("attachmentViewMode"),
  sortImportanceBtn:$("sortImportanceBtn"), sortAlphaBtn:$("sortAlphaBtn"), sortTypeBtn:$("sortTypeBtn"), sortDateBtn:$("sortDateBtn"), attachmentSortSelect:$("attachmentSortSelect"), coverTemplatePreview:$("coverTemplatePreview"), letterheadTemplatePreview:$("letterheadTemplatePreview"),
  attachmentList:$("attachmentList"), removeAttachmentBtn:$("removeAttachmentBtn"), mergeSmallDocsBtn:$("mergeSmallDocsBtn"),
  editDocSelect:$("editDocSelect"), editAttachmentSelect:$("editAttachmentSelect"), attachmentThumbStrip:$("attachmentThumbStrip"),
  pageFilmstrip:$("pageFilmstrip"), removePageBtn:$("removePageBtn"), movePageUpBtn:$("movePageUpBtn"), movePageDownBtn:$("movePageDownBtn"), composeSelectedPagesBtn:$("composeSelectedPagesBtn"), clearPageSelectionBtn:$("clearPageSelectionBtn"), clearCompositionsBtn:$("clearCompositionsBtn"), pageSelectionCount:$("pageSelectionCount"),
  selectedPageInfo:$("selectedPageInfo"), previewCanvas:$("previewCanvas"), overlay:$("overlay"), quadPolygon:$("quadPolygon"), emptyCanvas:$("emptyCanvas"), precisionLoupe:$("precisionLoupe"), precisionLoupeCanvas:$("precisionLoupeCanvas"), precisionLoupeText:$("precisionLoupeText"),
  showCorrectedPreview:$("showCorrectedPreview"), autoCornersBtn:$("autoCornersBtn"), resetCornersBtn:$("resetCornersBtn"), rotateLeftBtn:$("rotateLeftBtn"), rotateRightBtn:$("rotateRightBtn"),
  paperScope:$("paperScope"), paperSize:$("paperSize"), orientation:$("orientation"), paperMargin:$("paperMargin"), paperMarginValue:$("paperMarginValue"), paperMarginY:$("paperMarginY"), paperMarginYValue:$("paperMarginYValue"), autoRotateFit:$("autoRotateFit"),
  perspectiveEnabled:$("perspectiveEnabled"), edgeTop:$("edgeTop"), edgeRight:$("edgeRight"), edgeBottom:$("edgeBottom"), edgeLeft:$("edgeLeft"),
  edgeTopValue:$("edgeTopValue"), edgeRightValue:$("edgeRightValue"), edgeBottomValue:$("edgeBottomValue"), edgeLeftValue:$("edgeLeftValue"),
  brightness:$("brightness"), contrast:$("contrast"), saturation:$("saturation"), grayscale:$("grayscale"), threshold:$("threshold"),
  brightnessValue:$("brightnessValue"), contrastValue:$("contrastValue"), saturationValue:$("saturationValue"), grayscaleValue:$("grayscaleValue"), thresholdValue:$("thresholdValue"),
  scannerPresetBtn:$("scannerPresetBtn"), cleanPresetBtn:$("cleanPresetBtn"), resetFilterBtn:$("resetFilterBtn"),
  includeHeader:$("includeHeader"), includePageNumbers:$("includePageNumbers"), includeFooterInfo:$("includeFooterInfo"), embedOcrText:$("embedOcrText"), ocrLang:$("ocrLang"),
  ocrPageBtn:$("ocrPageBtn"), ocrAttachmentBtn:$("ocrAttachmentBtn"), ocrAllBtn:$("ocrAllBtn"),
  applyToAttachmentBtn:$("applyToAttachmentBtn"), applyToDocBtn:$("applyToDocBtn"), applyToAllBtn:$("applyToAllBtn"), qualitySummaryBadge:$("qualitySummaryBadge"), qualityMeterFill:$("qualityMeterFill"), pdfSizeEstimate:$("pdfSizeEstimate"), preservePdfNative:$("preservePdfNative"),
  exportDocList:$("exportDocList"), exportThumbs:$("exportThumbs"), exportMode:$("exportMode"), outputName:$("outputName"),
  previewPdfBtn:$("previewPdfBtn"), downloadPdfBtn:$("downloadPdfBtn"), downloadPreviewBtn:$("downloadPreviewBtn"), pdfFrame:$("pdfFrame"), previewEmpty:$("previewEmpty"), openPreviewLink:$("openPreviewLink"),
  status:$("status")
};

// quality-choice-delegation-v34
document.addEventListener("click",event=>{
  const btn=event.target.closest?.(".quality-option");
  if(!btn)return;
  event.preventDefault();
  event.stopPropagation();
  const choice=btn.dataset.quality;
  if(!QUALITY_PRESETS[choice])return;
  state.pdfQuality=choice;
  updateQualityUi();
  if(document.getElementById("step3")?.classList.contains("active")){
    previewPdf().catch(()=>{});
  }
});


const uid = () => crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random());
const clamp = (n,min,max) => Math.max(min, Math.min(max,n));
const mmToPt = mm => mm * 2.8346456693;
const cleanName = s => String(s||"arquivo").replace(/\.[^.]+$/,"").replace(/[_-]+/g," ").trim();
const safeFile = s => String(s||"arquivo").replace(/[\\/:*?"<>|]+/g,"-").trim() || "arquivo";
const esc = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#039;"}[m]));

function currentDoc(){ return state.docs.find(d=>d.id===state.activeDocId) || null; }
function currentAttachment(){ return currentDoc()?.attachments.find(a=>a.id===state.activeAttachmentId) || null; }
function currentPage(){ return currentAttachment()?.pages.find(p=>p.id===state.activePageId) || null; }

function createDoc(initial={}){
  return { id:uid(), number:"", title:"", classification:"", coverContentMode:"list", coverDescription:"", attachmentsOpen:true, attachments:[], ...initial };
}
function createAttachment(initial={}){
  return {id:uid(),fileName:"",title:"",classification:"",showInCover:true,pages:[],createdAt:Date.now(),fileType:"",layoutFaces:1,sheetGroups:[],...initial};
}

function defaultAdjust(){
  return {
    brightness:100, contrast:100, saturation:100, grayscale:0, threshold:0,
    rotation:0, perspective:false,
    paperSize:"a4", orientation:"portrait", marginX:10, marginY:10, autoRotateFit:false, originalPaper:null,
    corners:[{x:0,y:0},{x:100,y:0},{x:100,y:100},{x:0,y:100}]
  };
}

let statusTimer = null;
function setStatus(msg){
  els.status.textContent = msg;
  els.status.classList.remove("leaving");
  els.status.classList.add("showing");
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    els.status.classList.add("leaving");
    setTimeout(() => els.status.classList.remove("showing", "leaving"), 260);
  }, 2400);
}

function addDoc(){
  const doc = createDoc();
  state.docs.push(doc);
  state.activeDocId = doc.id;
  state.activeAttachmentId = null;
  state.activePageId = null;
  state.activeExportDocId = doc.id;
  render({skipPreview:false});
}


function renderTemplatePreviews(){
  const template = els.globalTemplate?.value || "none";
  const builtIn = kind => template==="mvs" ? (kind==="cover"?BG_DATA.mvsCover:BG_DATA.mvsLetterhead) : template==="gdv" ? (kind==="cover"?BG_DATA.gdvCover:BG_DATA.gdvLetterhead) : null;
  const pairs = [
    [els.coverTemplatePreview, state.customBackgrounds.cover?.dataUrl || builtIn("cover"), "Sem capa"],
    [els.letterheadTemplatePreview, state.customBackgrounds.letterhead?.dataUrl || builtIn("letterhead"), "Sem timbrado"]
  ];
  pairs.forEach(([canvas,src,emptyText])=>{
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--card-solid").trim() || "#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if(!src){
      ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim() || "#667";
      ctx.font="12px sans-serif"; ctx.textAlign="center"; ctx.fillText(emptyText,canvas.width/2,canvas.height/2); return;
    }
    const img=new Image();
    img.onload=()=>{ const r=Math.min(canvas.width/img.width,canvas.height/img.height), w=img.width*r,h=img.height*r; ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,(canvas.width-w)/2,(canvas.height-h)/2,w,h); };
    img.src=src;
  });
}

function render(opts = {}){
  const step1 = document.getElementById("step1")?.classList.contains("active");
  const step2 = document.getElementById("step2")?.classList.contains("active");
  const step3 = document.getElementById("step3")?.classList.contains("active");
  if(step1){ renderDocTabs(); renderDocFields(); renderScanHint(); renderAttachments(); }
  if(step2){ renderEditSelectors(); renderAttachmentThumbStrip(); renderPageFilmstrip(); renderTemplatePreviews(); syncControls(); if(!opts.skipPreview) renderPreview(); }
  if(step3){ renderExportDocs(); renderExportThumbs(); }
  updateButtons();
  updateQualityUi();
}

function renderDocTabs(){
  els.docTabs.innerHTML = "";
  state.docs.forEach(doc=>{
    if(!doc.coverContentMode) doc.coverContentMode="list";
    if(doc.coverDescription==null) doc.coverDescription="";
    if(doc.attachmentsOpen==null) doc.attachmentsOpen=true;
    const details = document.createElement("details");
    details.className = "doc-tab doc-index-card" + (doc.id===state.activeDocId ? " active" : "");
    details.open = doc.id===state.activeDocId;
    details.draggable = true;
    details.dataset.docId = doc.id;
    const titleLine = [doc.number || "Doc sem número", doc.title || doc.classification || "Sem classificação"].filter(Boolean).join(" - ");
    details.innerHTML = `
      <summary class="doc-index-summary">
        <span class="doc-grip" title="Arraste para organizar">⋮⋮</span>
        <span class="doc-summary-text"><strong>${esc(titleLine)}</strong><small>${doc.attachments.length} anexo(s)</small></span>
        <button class="small ghost danger doc-remove" type="button" title="Excluir este Doc">Excluir</button>
      </summary>
      <div class="doc-index-body">
        <div class="doc-inline-fields">
          <label>Número do Doc<input class="doc-number-inline" type="text" value="${esc(doc.number || "")}" placeholder="Ex.: Doc. 01" /></label>
          <label>Título do Doc<input class="doc-title-inline" type="text" value="${esc(doc.title || "")}" placeholder="Ex.: Documentos de instrução" /></label>
          <label>Classificação<select class="doc-class-inline">${DOC_TYPES.map(t=>`<option value="${esc(t)}" ${t===doc.classification?"selected":""}>${esc(t || "Sem classificação")}</option>`).join("")}</select></label>
        </div>
        <div class="cover-content-config">
          <label>Texto abaixo do título na capa
            <select class="cover-content-mode">
              <option value="list" ${doc.coverContentMode!=="description"?"selected":""}>Lista de anexos</option>
              <option value="description" ${doc.coverContentMode==="description"?"selected":""}>Descrição breve do Doc</option>
            </select>
          </label>
          <label class="cover-description-field" ${doc.coverContentMode==="description"?"":"hidden"}>Descrição breve
            <textarea class="cover-description" rows="3" maxlength="360" placeholder="Descreva brevemente o conteúdo deste Doc.">${esc(doc.coverDescription || "")}</textarea>
          </label>
          <button class="info-tip cover-mode-help" type="button" data-tip="A capa usa apenas uma opção por Doc: lista de anexos ou descrição breve. Nunca as duas ao mesmo tempo." aria-label="Ajuda sobre conteúdo da capa">i</button>
        </div>
        <details class="doc-index-attachments attachments-collapse" ${doc.attachmentsOpen ? "open" : ""}>
          <summary class="attachments-collapse-summary">
            <strong>Anexos</strong>
            <span class="attachments-count">${doc.attachments.length}</span>
          </summary>
          <div class="doc-index-attachment-list">
            ${doc.attachments.length ? doc.attachments.map(att=>`
              <div class="doc-index-attachment" data-attachment-id="${att.id}">
                <button type="button" class="ghost select-index-attachment"><strong>${esc(att.title || att.classification || "Anexo sem título")}</strong><small>${att.pages.length} página(s)${getAttachmentExportItems(att).some(x=>x.pages.length>1) ? " · há composição de folhas" : ""}</small></button>
                <label>Título<input class="idx-att-title" type="text" value="${esc(att.title || "")}" placeholder="Título do anexo" /></label>
                <label>Classificação<select class="idx-att-class">${DOC_TYPES.map(t=>`<option value="${esc(t)}" ${t===att.classification?"selected":""}>${esc(t || "Sem classificação")}</option>`).join("")}</select></label>
                <label class="checkline compact"><input class="idx-att-cover" type="checkbox" ${att.showInCover?"checked":""} /> Mostrar na capa</label>
                <div class="idx-att-actions"><button class="small ghost idx-att-add" type="button">Adicionar arquivos</button><button class="small ghost danger idx-att-remove" type="button">Excluir</button></div>
              </div>`).join("") : `<p class="hint">Nenhum anexo neste Doc ainda.</p>`}
          </div>
        </div>
      </div>`;
    details.querySelector(".doc-remove").onclick = e=>{e.preventDefault();e.stopPropagation();removeDoc(doc.id);};
    details.querySelector(".doc-index-summary").addEventListener("click",e=>{if(!e.target.closest("button")) selectDoc(doc.id);});
    const numberInput=details.querySelector(".doc-number-inline"), titleInput=details.querySelector(".doc-title-inline"), classSelect=details.querySelector(".doc-class-inline");
    numberInput.oninput=()=>{doc.number=numberInput.value;}; titleInput.oninput=()=>{doc.title=titleInput.value;}; classSelect.onchange=()=>{doc.classification=classSelect.value;};
    const mode=details.querySelector(".cover-content-mode"), descField=details.querySelector(".cover-description-field"), desc=details.querySelector(".cover-description");
    mode.onchange=()=>{doc.coverContentMode=mode.value; descField.hidden=mode.value!=="description";}; desc.oninput=()=>{doc.coverDescription=desc.value;};
    const attCollapse=details.querySelector(".attachments-collapse");
    if(attCollapse) attCollapse.addEventListener("toggle",()=>{doc.attachmentsOpen=attCollapse.open;});
    details.querySelectorAll(".doc-index-attachment").forEach(row=>{
      const att=doc.attachments.find(a=>a.id===row.dataset.attachmentId); if(!att)return;
      row.querySelector(".select-index-attachment").onclick=()=>{state.activeDocId=doc.id;selectAttachment(att.id);};
      row.querySelector(".idx-att-title").oninput=e=>{att.title=e.target.value;}; row.querySelector(".idx-att-class").onchange=e=>{att.classification=e.target.value;}; row.querySelector(".idx-att-cover").onchange=e=>{att.showInCover=e.target.checked;};
      row.querySelector(".idx-att-add").onclick=()=>{state.pendingAttachmentTarget={docId:doc.id,attId:att.id};els.nestedAttachmentFileInput?.click();};
      row.querySelector(".idx-att-remove").onclick=()=>{state.activeDocId=doc.id;removeAttachment(att.id);};
    });
    bindDragSort(details,"doc"); els.docTabs.appendChild(details);
  });
}

function removeDoc(id){
  if (state.docs.length <= 1) {
    setStatus("Mantenha pelo menos um Doc no projeto.");
    return;
  }
  const idx = state.docs.findIndex(d=>d.id===id);
  if (idx < 0) return;
  state.docs.splice(idx,1);
  const next = state.docs[Math.min(idx,state.docs.length-1)] || state.docs[0];
  state.activeDocId = next?.id || null;
  state.activeAttachmentId = next?.attachments[0]?.id || null;
  state.activePageId = next?.attachments[0]?.pages[0]?.id || null;
  state.activeExportDocId = state.activeDocId;
  render();
  setStatus("Doc excluído.");
}

function selectDoc(id){
  state.activeDocId = id;
  const d = currentDoc();
  state.activeAttachmentId = d?.attachments[0]?.id || null;
  state.activePageId = d?.attachments[0]?.pages[0]?.id || null;
  render();
}

function renderDocFields(){
  const d = currentDoc();
  els.docNumber.disabled = !d;
  els.docTitle.disabled = !d;
  els.docClassification.disabled = !d;
  els.docNumber.value = d?.number || "";
  els.docTitle.value = d?.title || "";
  els.docClassification.value = d?.classification || "";
}

function isMultiFaceCompatible(){
  return ["id-front-back","small-multipage","professional-id","photo-grid","multi-faces"].includes(els.scanType.value);
}

function renderScanHint(){
  const map = {
    standard: "Use para PDFs comuns, documentos já em A4 ou arquivos com páginas completas.",
    "id-front-back": "Envie frente e verso no mesmo anexo. O app monta as faces na mesma folha sem distorcer.",
    "small-multipage": "Use para documentos menores que A4. Escolha 2, 4 ou 6 faces por folha.",
    "professional-id": "Use para carteira da OAB, CRM, CRP e semelhantes. Frente e verso podem ficar na mesma folha A4.",
    passport: "Use para páginas de passaporte. O ideal é uma imagem por página aberta ou por folha.",
    ctps: "Use para CTPS física ou digitalizada. Para páginas pequenas, use várias faces em A4.",
    "photo-grid": "Use para fotografias. Selecione várias imagens e escolha 2, 4 ou 6 por folha A4.",
    "multi-faces": "Use quando um anexo tiver várias faces soltas. Cada face continua editável individualmente."
  };
  const compatible = isMultiFaceCompatible();
  if(els.facesPerSheetWrap) els.facesPerSheetWrap.hidden = !compatible;
  if(compatible && els.uploadMode?.value === "new-attachment") els.uploadMode.value = "group-selection";
  if(!compatible && els.uploadMode?.value === "group-selection") els.uploadMode.value = "new-attachment";
  if (els.scanType.value === "photo-grid" && els.facesPerSheet && !["2","4","6"].includes(els.facesPerSheet.value)) els.facesPerSheet.value = "4";
  const hint=map[els.scanType.value] || ""; if(els.scanHint) els.scanHint.textContent=hint; if(els.scanInfoBtn) els.scanInfoBtn.dataset.tip=hint || "Escolha o tipo do documento para adaptar a montagem.";
}

function renderAttachments(){
  const d = currentDoc();
  els.attachmentList.innerHTML = "";
  if(els.attachmentList.hidden) return;
  els.attachmentList.className = "attachment-list " + els.attachmentViewMode.value;
  if (!d) return;

  d.attachments.forEach(att=>{
    const card = document.createElement("div");
    card.className = "attachment-card" + (att.id===state.activeAttachmentId ? " active" : "");
    card.draggable = true;
    card.dataset.attachmentId = att.id;

    const preview = document.createElement("button");
    preview.className = "attachment-preview ghost";
    preview.type = "button";
    const canvas = document.createElement("canvas");
    if (att.pages[0]) drawThumb(att.pages[0], canvas, 92, 118);
    preview.appendChild(canvas);
    preview.onclick = () => selectAttachment(att.id);

    const fields = document.createElement("div");
    fields.className = "fields";
    fields.innerHTML = `
      <button class="ghost select-attachment" type="button"><strong>${esc(att.title || att.classification || "Anexo sem título")}</strong><small>${att.pages.length} face(s)${att.layoutFaces>1 ? ` · ${att.layoutFaces} por A4` : ""}</small></button>
      <label>Título do anexo, opcional
        <input type="text" value="${esc(att.title || "")}" placeholder="Não usa o nome do arquivo automaticamente" />
      </label>
      <label>Classificação do anexo
        <select>${DOC_TYPES.map(t=>`<option value="${esc(t)}" ${t===att.classification?"selected":""}>${esc(t || "Sem classificação")}</option>`).join("")}</select>
      </label>
    `;
    fields.querySelector(".select-attachment").onclick = () => selectAttachment(att.id);
    fields.querySelector("input").oninput = e => { att.title = e.target.value; renderEditSelectors(); renderExportThumbs(); };
    fields.querySelector("select").onchange = e => { att.classification = e.target.value; renderAttachments(); renderEditSelectors(); renderExportThumbs(); };

    const checks = document.createElement("div");
    checks.className = "checks";
    checks.innerHTML = `
      <label class="checkline"><input type="checkbox" ${att.showInCover ? "checked" : ""}/> Constar na lista da capa</label>
      <button class="small ghost use-name" type="button">Usar nome do arquivo como título</button>
      <button class="small ghost append-here" type="button">Adicionar arquivos neste anexo</button>
      <button class="small ghost danger remove-attachment" type="button">Excluir anexo</button>
    `;
    checks.querySelector("input").onchange = e => { att.showInCover = e.target.checked; };
    checks.querySelector(".use-name").onclick = e => { e.stopPropagation(); att.title = cleanName(att.fileName); render(); };
    checks.querySelector(".append-here").onclick = e => { e.stopPropagation(); selectAttachment(att.id); if (els.uploadMode) els.uploadMode.value="append-active"; els.fileInput.click(); };
    checks.querySelector(".remove-attachment").onclick = e => { e.stopPropagation(); removeAttachment(att.id); };

    card.append(preview, fields, checks);
    card.onclick = e => { if (!["INPUT","BUTTON","SELECT","OPTION"].includes(e.target.tagName)) selectAttachment(att.id); };
    bindDragSort(card, "attachment");
    els.attachmentList.appendChild(card);
  });
}

function removeAttachment(id){
  const d=currentDoc(); if(!d)return;
  const idx=d.attachments.findIndex(x=>x.id===id);
  if(idx<0)return;
  d.attachments.splice(idx,1);
  const next=d.attachments[Math.min(idx,d.attachments.length-1)] || d.attachments[0];
  state.activeAttachmentId=next?.id||null;
  state.activePageId=next?.pages[0]?.id||null;
  render();
  setStatus("Anexo excluído.");
}

function selectAttachment(id){
  state.activeAttachmentId = id;
  state.activePageId = currentAttachment()?.pages[0]?.id || null;
  render();
}

function renderEditSelectors(){
  els.editDocSelect.innerHTML = "";
  state.docs.forEach(d => els.editDocSelect.add(new Option([d.number || "Doc", d.title || d.classification || ""].filter(Boolean).join(" - "), d.id)));
  if (currentDoc()) els.editDocSelect.value = currentDoc().id;

  els.editAttachmentSelect.innerHTML = "";
  (currentDoc()?.attachments || []).forEach(a => els.editAttachmentSelect.add(new Option(a.title || a.classification || "Anexo sem título", a.id)));
  if (currentAttachment()) els.editAttachmentSelect.value = currentAttachment().id;
}

function renderAttachmentThumbStrip(){
  els.attachmentThumbStrip.innerHTML = "";
  (currentDoc()?.attachments || []).forEach(att=>{
    const b = document.createElement("button");
    b.className = "thumb-card" + (att.id===state.activeAttachmentId ? " active" : "");
    const c = document.createElement("canvas");
    if (att.pages[0]) drawThumb(att.pages[0], c, 78, 102);
    b.appendChild(c);
    const label = document.createElement("small");
    label.textContent = att.title || att.classification || "Anexo sem título";
    b.appendChild(label);
    b.onclick = () => selectAttachment(att.id);
    els.attachmentThumbStrip.appendChild(b);
  });
}

function renderPageFilmstrip(){
  const att=currentAttachment(); els.pageFilmstrip.innerHTML=""; if(!att){updatePageSelectionUi();return;}
  const groupMap=new Map(); (att.sheetGroups||[]).forEach((g,gi)=>g.pageIds.forEach(id=>groupMap.set(id,gi+1)));
  att.pages.forEach((p,idx)=>{
    const wrap=document.createElement("div"); wrap.className="page-select-card"+(p.id===state.activePageId?" active":"")+(p.selectedForSheet?" selected":""); wrap.draggable=true;wrap.dataset.pageId=p.id;bindPageDragSort(wrap);
    const check=document.createElement("label");check.className="page-select-check";check.innerHTML=`<input type="checkbox" ${p.selectedForSheet?"checked":""} aria-label="Selecionar página ${idx+1} para compor folha" /><span>Selecionar</span>`;
    check.querySelector("input").onchange=e=>togglePageSelection(p,e.target.checked);
    const b=document.createElement("button");b.type="button";b.className="page-card";const c=document.createElement("canvas");drawThumb(p,c,66,86);const label=document.createElement("small");const groupNo=groupMap.get(p.id);label.textContent=`Pág. ${idx+1}${p.ocrText?" · OCR":""}${groupNo?` · Folha ${groupNo}`:""}`;b.append(c,label);b.onclick=()=>{state.activePageId=p.id;render();};
    wrap.append(check,b);els.pageFilmstrip.appendChild(wrap);
  }); updatePageSelectionUi();
}
function togglePageSelection(page,checked){
  const att=currentAttachment(); if(!att)return;
  const selected=att.pages.filter(p=>p.selectedForSheet).length;
  if(checked && selected>=6){page.selectedForSheet=false;setStatus("Selecione no máximo 6 páginas por folha.");renderPageFilmstrip();return;}
  page.selectedForSheet=checked;updatePageSelectionUi();
}
function updatePageSelectionUi(){
  const selected=(currentAttachment()?.pages||[]).filter(p=>p.selectedForSheet).length;
  if(els.pageSelectionCount)els.pageSelectionCount.textContent=`${selected} de 6 selecionadas`;
  if(els.composeSelectedPagesBtn)els.composeSelectedPagesBtn.disabled=selected<2||selected>6;
}
function clearPageSelection(){(currentAttachment()?.pages||[]).forEach(p=>p.selectedForSheet=false);renderPageFilmstrip();}
function composeSelectedPages(){
  const att=currentAttachment(); if(!att)return; const pages=att.pages.filter(p=>p.selectedForSheet);
  if(pages.length<2||pages.length>6){setStatus("Selecione entre 2 e 6 páginas.");return;}
  const ids=new Set(pages.map(p=>p.id)); att.sheetGroups=(att.sheetGroups||[]).filter(g=>!g.pageIds.some(id=>ids.has(id)));
  att.layoutFaces=1;
  att.sheetGroups.push({id:uid(),pageIds:pages.map(p=>p.id),paper:paperSettingsFromAdjust(currentPage()?.adjust||defaultAdjust())});
  pages.forEach(p=>p.selectedForSheet=false);render();setStatus(`${pages.length} páginas serão compostas em uma única folha, sem distorção.`);
}
function clearCompositions(){const att=currentAttachment();if(!att)return;att.sheetGroups=[];att.layoutFaces=1;render();setStatus("Composições de páginas removidas.");}

function renderExportDocs(){
  els.exportDocList.innerHTML = "";
  state.docs.forEach(doc=>{
    const b = document.createElement("button");
    b.className = "doc-tab" + (doc.id===state.activeExportDocId ? " active" : "");
    b.innerHTML = `<strong>${esc([doc.number || "Doc", doc.title || doc.classification || ""].filter(Boolean).join(" - "))}</strong><small>${doc.attachments.length} anexo(s)</small>`;
    b.onclick = () => { state.activeExportDocId = doc.id; renderExportDocs(); renderExportThumbs(); };
    els.exportDocList.appendChild(b);
  });
}

function renderExportThumbs(){
  els.exportThumbs.innerHTML=""; const doc=state.docs.find(d=>d.id===state.activeExportDocId)||state.docs[0]; if(!doc)return;
  doc.attachments.forEach(att=>getAttachmentExportItems(att).forEach((item,idx)=>{
    const card=document.createElement("div");card.className="thumb-card";const c=document.createElement("canvas");
    if(item.pages.length>1) drawCanvasThumb(makePackedSheetCanvas(item.pages,item.pages.length),c,78,102); else drawThumb(item.pages[0],c,78,102);
    const label=document.createElement("small"); label.textContent=`${att.title||att.classification||"Anexo"} · ${item.pages.length>1?`${item.pages.length} págs./folha`:`pág. ${idx+1}`}`; card.append(c,label);els.exportThumbs.appendChild(card);
  }));
}
function drawCanvasThumb(src,canvas,w=78,h=102){
  canvas.width=w; canvas.height=h;
  const ctx=canvas.getContext("2d"); ctx.fillStyle="#fff"; ctx.fillRect(0,0,w,h);
  const r=Math.min(w/src.width,h/src.height), dw=src.width*r, dh=src.height*r;
  ctx.drawImage(src,(w-dw)/2,(h-dh)/2,dw,dh);
}

let dragPlaceholder = null;
function getDragPlaceholder(){
  if(!dragPlaceholder){
    dragPlaceholder=document.createElement("div");
    dragPlaceholder.className="drag-placeholder";
    dragPlaceholder.textContent="Solte aqui";
  }
  return dragPlaceholder;
}
function clearDragPlaceholder(){
  if(dragPlaceholder?.parentNode) dragPlaceholder.parentNode.removeChild(dragPlaceholder);
}

function bindDragSort(el, type){
  el.addEventListener("dragstart", e => {
    el.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", type === "doc" ? el.dataset.docId : el.dataset.attachmentId);
  });
  el.addEventListener("dragend", () => { el.classList.remove("dragging"); clearDragPlaceholder(); });
  el.addEventListener("dragover", e => {
    e.preventDefault();
    const ph=getDragPlaceholder();
    const rect=el.getBoundingClientRect();
    const after=e.clientY > rect.top + rect.height/2;
    if(after) el.after(ph); else el.before(ph);
    ph.dataset.targetId = type === "doc" ? el.dataset.docId : el.dataset.attachmentId;
    ph.dataset.position = after ? "after" : "before";
  });
  el.addEventListener("drop", e => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    const targetId = dragPlaceholder?.dataset.targetId || (type === "doc" ? el.dataset.docId : el.dataset.attachmentId);
    const position = dragPlaceholder?.dataset.position || "before";
    if (type === "doc") reorderArray(state.docs, draggedId, targetId, position);
    if (type === "attachment") reorderArray(currentDoc().attachments, draggedId, targetId, position);
    clearDragPlaceholder();
    render();
    setStatus(type === "doc" ? "Docs reorganizados." : "Anexos reorganizados.");
  });
}

function reorderArray(arr, fromId, toId, position="before"){
  const from = arr.findIndex(x=>x.id===fromId), to = arr.findIndex(x=>x.id===toId);
  if (from < 0 || to < 0 || from === to) return;
  const [item] = arr.splice(from,1);
  let target = arr.findIndex(x=>x.id===toId);
  if(target < 0) target = arr.length;
  if(position === "after") target += 1;
  arr.splice(target,0,item);
}

function bindPageDragSort(el){
  el.addEventListener("dragstart", e => {
    el.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/page-id", el.dataset.pageId);
  });
  el.addEventListener("dragend", () => { el.classList.remove("dragging"); clearDragPlaceholder(); });
  el.addEventListener("dragover", e => {
    e.preventDefault();
    const ph=getDragPlaceholder();
    ph.classList.add("horizontal");
    const rect=el.getBoundingClientRect();
    const after=e.clientX > rect.left + rect.width/2;
    if(after) el.after(ph); else el.before(ph);
    ph.dataset.targetId = el.dataset.pageId;
    ph.dataset.position = after ? "after" : "before";
  });
  el.addEventListener("drop", e => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/page-id") || e.dataTransfer.getData("text/plain");
    const targetId = dragPlaceholder?.dataset.targetId || el.dataset.pageId;
    const position = dragPlaceholder?.dataset.position || "before";
    const att = currentAttachment();
    if (!att || !draggedId || !targetId) return;
    reorderArray(att.pages, draggedId, targetId, position);
    state.activePageId = draggedId;
    clearDragPlaceholder();
    render();
    setStatus("Ordem das páginas atualizada.");
  });
}

function updateButtons(){
  const att = currentAttachment(), p = currentPage();
  if(els.removeAttachmentBtn) els.removeAttachmentBtn.disabled = !att;
  els.mergeSmallDocsBtn.disabled = !att || att.pages.length < 2;
  els.removePageBtn.disabled = !p;
  const idx = att ? att.pages.findIndex(x=>x.id===state.activePageId) : -1;
  els.movePageUpBtn.disabled = idx <= 0;
  els.movePageDownBtn.disabled = !att || idx < 0 || idx >= att.pages.length-1;
  [els.autoCornersBtn,els.resetCornersBtn,els.rotateLeftBtn,els.rotateRightBtn,els.ocrPageBtn,els.applyToAttachmentBtn,els.applyToDocBtn,els.applyToAllBtn].forEach(b=>b.disabled=!p);
}

function syncControls(){
  const p = currentPage();
  const a = p?.adjust || defaultAdjust();
  els.perspectiveEnabled.checked = a.perspective;
  els.brightness.value = a.brightness; els.contrast.value = a.contrast; els.saturation.value = a.saturation; els.grayscale.value = a.grayscale; els.threshold.value = a.threshold;
  if(els.paperSize)els.paperSize.value=a.paperSize||"a4"; if(els.orientation)els.orientation.value=a.orientation||"portrait"; if(els.paperMargin)els.paperMargin.value=Number(a.marginX??10); if(els.paperMarginY)els.paperMarginY.value=Number(a.marginY??10); if(els.autoRotateFit)els.autoRotateFit.checked=!!a.autoRotateFit;
  syncEdges(a.corners);
  syncPaperOriginalUi();
  updateLabels();
}

function saveControls(){
  const p = currentPage(); if (!p) return;
  p.adjust.perspective = els.perspectiveEnabled.checked;
  p.adjust.brightness = Number(els.brightness.value);
  p.adjust.contrast = Number(els.contrast.value);
  p.adjust.saturation = Number(els.saturation.value);
  p.adjust.grayscale = Number(els.grayscale.value);
  p.adjust.threshold = Number(els.threshold.value);
  updateLabels();
}

function applyPaperControlsFromUI(){
  const p=currentPage();if(!p)return; const settings={paperSize:els.paperSize.value,orientation:els.orientation.value,marginX:Number(els.paperMargin.value),marginY:Number(els.paperMarginY.value),autoRotateFit:els.autoRotateFit.checked};
  const targets=els.paperScope?.value==="attachment"?(currentAttachment()?.pages||[]):[p];targets.forEach(pg=>{Object.assign(pg.adjust,settings);pg.thumbCache=null;});syncPaperOriginalUi();updateLabels();schedulePreviewRender();
}

function updateLabels(){
  if(els.paperMarginValue) els.paperMarginValue.textContent = els.paperMargin.value;
  if(els.paperMarginYValue) els.paperMarginYValue.textContent = els.paperMarginY.value;
  els.brightnessValue.textContent = els.brightness.value;
  els.contrastValue.textContent = els.contrast.value;
  els.saturationValue.textContent = els.saturation.value;
  els.grayscaleValue.textContent = els.grayscale.value;
  els.thresholdValue.textContent = els.threshold.value;
  els.edgeTopValue.textContent = els.edgeTop.value;
  els.edgeRightValue.textContent = els.edgeRight.value;
  els.edgeBottomValue.textContent = els.edgeBottom.value;
  els.edgeLeftValue.textContent = els.edgeLeft.value;
}

function syncEdges(c){
  els.edgeTop.value = Math.round(Math.min(c[0].y,c[1].y));
  els.edgeRight.value = Math.round(100 - Math.max(c[1].x,c[2].x));
  els.edgeBottom.value = Math.round(100 - Math.max(c[2].y,c[3].y));
  els.edgeLeft.value = Math.round(Math.min(c[0].x,c[3].x));
}

function setCornersFromEdges(){
  const p = currentPage(); if (!p) return;
  p.adjust.perspective = true; if(els.perspectiveEnabled) els.perspectiveEnabled.checked = true;
  const t=+els.edgeTop.value, r=+els.edgeRight.value, b=+els.edgeBottom.value, l=+els.edgeLeft.value;
  p.adjust.corners = [{x:l,y:t},{x:100-r,y:t},{x:100-r,y:100-b},{x:l,y:100-b}];
  renderPreview();
}

function scaleCanvasForPreview(src,maxDim=1200){
  const scale=Math.min(1,maxDim/Math.max(src.width,src.height)); if(scale>=.999)return src;
  const c=document.createElement("canvas");c.width=Math.max(1,Math.round(src.width*scale));c.height=Math.max(1,Math.round(src.height*scale));c.getContext("2d").drawImage(src,0,0,c.width,c.height);return c;
}
function makePreviewCanvas(p,raw=false){
  const scaled=scaleCanvasForPreview(p.sourceCanvas,1200); const proxy={...p,sourceCanvas:scaled,adjust:{...p.adjust,corners:p.adjust.corners.map(x=>({...x}))}}; return makePageCanvas(proxy,raw);
}
function schedulePreviewRender(){ if(state.previewRaf) cancelAnimationFrame(state.previewRaf); state.previewRaf=requestAnimationFrame(()=>{state.previewRaf=0;renderPreview();}); }
function renderPreview(){
  const p = currentPage();
  if (!p) {
    els.previewCanvas.style.display="none"; els.overlay.hidden=true; els.emptyCanvas.style.display="block"; els.selectedPageInfo.textContent="Nenhuma página selecionada.";
    return;
  }
  saveControls();
  const canvas = makePreviewCanvas(p, !els.showCorrectedPreview.checked);
  els.previewCanvas.width = canvas.width; els.previewCanvas.height = canvas.height;
  const ctx = els.previewCanvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(canvas,0,0);
  els.previewCanvas.style.display="block"; els.emptyCanvas.style.display="none";
  els.overlay.hidden = els.showCorrectedPreview.checked;
  els.selectedPageInfo.textContent = `${currentDoc()?.number || "Doc"} | ${currentAttachment()?.title || currentAttachment()?.classification || "Anexo sem título"}`;
  requestAnimationFrame(updateOverlay);
}

function drawThumb(page, canvas, w=90, h=120){
  if (!page.thumbCache || page.thumbCache.key !== thumbKey(page)) {
    const c = makePageCanvas(page, true);
    const t = document.createElement("canvas");
    t.width=w; t.height=h;
    const ctx=t.getContext("2d"); ctx.fillStyle="#fff"; ctx.fillRect(0,0,w,h);
    const r=Math.min(w/c.width,h/c.height), dw=c.width*r, dh=c.height*r;
    ctx.drawImage(c,(w-dw)/2,(h-dh)/2,dw,dh);
    page.thumbCache = { key: thumbKey(page), canvas: t };
  }
  canvas.width=w; canvas.height=h;
  canvas.getContext("2d").drawImage(page.thumbCache.canvas,0,0,w,h);
}

function thumbKey(p){ const a=p.adjust; return [a.rotation,a.brightness,a.contrast,a.saturation,a.grayscale,a.threshold].join("|"); }

function applyFilters(src,a){
  const c=document.createElement("canvas"); c.width=src.width; c.height=src.height;
  const ctx=c.getContext("2d",{willReadFrequently:true});
  ctx.filter=`brightness(${a.brightness}%) contrast(${a.contrast}%) saturate(${a.saturation}%) grayscale(${a.grayscale}%)`;
  ctx.fillStyle="#fff"; ctx.fillRect(0,0,c.width,c.height); ctx.drawImage(src,0,0); ctx.filter="none";
  if(a.threshold>0) threshold(c,a.threshold);
  return c;
}

function threshold(c,limit){
  const ctx=c.getContext("2d",{willReadFrequently:true}), img=ctx.getImageData(0,0,c.width,c.height), d=img.data;
  for(let i=0;i<d.length;i+=4){const lum=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2]; const v=lum>=limit?255:0; d[i]=d[i+1]=d[i+2]=v;}
  ctx.putImageData(img,0,0);
}

function makePageCanvas(p, raw=false){
  let c=applyFilters(p.sourceCanvas,p.adjust);
  if(p.adjust.rotation%360!==0)c=rotateCanvas(c,p.adjust.rotation);
  if(!raw && p.adjust.perspective)c=perspectiveCanvas(c,p.adjust.corners);
  return c;
}

function rotateCanvas(src,deg){
  const n=((deg%360)+360)%360; if(!n)return src;
  const swap=n===90||n===270, c=document.createElement("canvas");
  c.width=swap?src.height:src.width; c.height=swap?src.width:src.height;
  const ctx=c.getContext("2d"); ctx.translate(c.width/2,c.height/2); ctx.rotate(n*Math.PI/180); ctx.drawImage(src,-src.width/2,-src.height/2);
  return c;
}

function perspectiveCanvas(src,pct){
  const pts=pct.map(p=>({x:p.x/100*src.width,y:p.y/100*src.height}));
  const top=dist(pts[0],pts[1]), bottom=dist(pts[3],pts[2]), left=dist(pts[0],pts[3]), right=dist(pts[1],pts[2]);
  let outW=Math.round(clamp(Math.max(top,bottom),120,2400));
  let outH=Math.round(clamp(Math.max(left,right),120,3200));
  const maxDim=2400, scale=Math.min(1,maxDim/Math.max(outW,outH));
  outW=Math.max(1,Math.round(outW*scale)); outH=Math.max(1,Math.round(outH*scale));
  const out=document.createElement("canvas"); out.width=outW; out.height=outH;
  const ctx=out.getContext("2d",{willReadFrequently:true});
  ctx.fillStyle="#fff"; ctx.fillRect(0,0,outW,outH);

  const tmp=document.createElement("canvas"); tmp.width=src.width; tmp.height=src.height;
  const sctx=tmp.getContext("2d",{willReadFrequently:true}); sctx.drawImage(src,0,0);
  let srcData;
  try { srcData=sctx.getImageData(0,0,src.width,src.height); } catch(e) { ctx.drawImage(src,0,0,outW,outH); return out; }
  const outImg=ctx.createImageData(outW,outH), d=outImg.data, sd=srcData.data;
  const H=quadToRectHomography(pts,outW,outH);
  for(let y=0;y<outH;y++){
    for(let x=0;x<outW;x++){
      const den=H[6]*x+H[7]*y+H[8];
      const sx=(H[0]*x+H[1]*y+H[2])/den, sy=(H[3]*x+H[4]*y+H[5])/den;
      sampleBilinear(sd,src.width,src.height,sx,sy,d,(y*outW+x)*4);
    }
  }
  ctx.putImageData(outImg,0,0);
  return out;
}

function quadToRectHomography(pts,w,h){
  const dst=[{x:0,y:0},{x:w-1,y:0},{x:w-1,y:h-1},{x:0,y:h-1}], A=[], b=[];
  for(let i=0;i<4;i++){
    const x=dst[i].x,y=dst[i].y,X=pts[i].x,Y=pts[i].y;
    A.push([x,y,1,0,0,0,-X*x,-X*y]); b.push(X);
    A.push([0,0,0,x,y,1,-Y*x,-Y*y]); b.push(Y);
  }
  const h8=solveLinear8(A,b);
  return [h8[0],h8[1],h8[2],h8[3],h8[4],h8[5],h8[6],h8[7],1];
}
function solveLinear8(A,b){
  const n=8; A=A.map((row,i)=>row.concat(b[i]));
  for(let i=0;i<n;i++){
    let max=i; for(let r=i+1;r<n;r++) if(Math.abs(A[r][i])>Math.abs(A[max][i])) max=r;
    [A[i],A[max]]=[A[max],A[i]];
    const piv=A[i][i] || 1e-12; for(let c=i;c<=n;c++) A[i][c]/=piv;
    for(let r=0;r<n;r++){ if(r===i) continue; const f=A[r][i]; for(let c=i;c<=n;c++) A[r][c]-=f*A[i][c]; }
  }
  return A.map(row=>row[n]);
}
function sampleBilinear(sd,w,h,x,y,out,oi){
  if(x<0||y<0||x>w-1||y>h-1){out[oi]=out[oi+1]=out[oi+2]=255;out[oi+3]=255;return;}
  const x0=Math.floor(x), y0=Math.floor(y), x1=Math.min(w-1,x0+1), y1=Math.min(h-1,y0+1), dx=x-x0, dy=y-y0;
  const i00=(y0*w+x0)*4, i10=(y0*w+x1)*4, i01=(y1*w+x0)*4, i11=(y1*w+x1)*4;
  for(let k=0;k<4;k++) out[oi+k]=sd[i00+k]*(1-dx)*(1-dy)+sd[i10+k]*dx*(1-dy)+sd[i01+k]*(1-dx)*dy+sd[i11+k]*dx*dy;
}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function lerp(a,b,t){return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}}
function quad(pts,u,v){return lerp(lerp(pts[0],pts[1],u),lerp(pts[3],pts[2],u),v)}
function tri(ctx,img,s0,s1,s2,d0,d1,d2){
  const den=s0.x*(s1.y-s2.y)+s1.x*(s2.y-s0.y)+s2.x*(s0.y-s1.y); if(Math.abs(den)<.001)return;
  const a=(d0.x*(s1.y-s2.y)+d1.x*(s2.y-s0.y)+d2.x*(s0.y-s1.y))/den;
  const b=(d0.y*(s1.y-s2.y)+d1.y*(s2.y-s0.y)+d2.y*(s0.y-s1.y))/den;
  const c=(d0.x*(s2.x-s1.x)+d1.x*(s0.x-s2.x)+d2.x*(s1.x-s0.x))/den;
  const d=(d0.y*(s2.x-s1.x)+d1.y*(s0.x-s2.x)+d2.y*(s1.x-s0.x))/den;
  const e=(d0.x*(s1.x*s2.y-s2.x*s1.y)+d1.x*(s2.x*s0.y-s0.x*s2.y)+d2.x*(s0.x*s1.y-s1.x*s0.y))/den;
  const f=(d0.y*(s1.x*s2.y-s2.x*s1.y)+d1.y*(s2.x*s0.y-s0.x*s2.y)+d2.y*(s0.x*s1.y-s1.x*s0.y))/den;
  ctx.save();ctx.beginPath();ctx.moveTo(d0.x,d0.y);ctx.lineTo(d1.x,d1.y);ctx.lineTo(d2.x,d2.y);ctx.closePath();ctx.clip();ctx.transform(a,b,c,d,e,f);ctx.drawImage(img,0,0);ctx.restore();
}

function updateOverlay(){
  const p=currentPage(); if(!p||els.overlay.hidden)return;
  const r=els.previewCanvas.getBoundingClientRect();
  els.overlay.style.width=r.width+"px"; els.overlay.style.height=r.height+"px";
  const pts=p.adjust.corners.map(q=>({x:q.x/100*r.width,y:q.y/100*r.height}));
  els.quadPolygon.setAttribute("points",pts.map(q=>`${q.x},${q.y}`).join(" "));
  const map={tl:pts[0],tr:pts[1],br:pts[2],bl:pts[3],top:mid(pts[0],pts[1]),right:mid(pts[1],pts[2]),bottom:mid(pts[3],pts[2]),left:mid(pts[0],pts[3])};
  els.overlay.querySelectorAll(".drag").forEach(h=>{const q=map[h.dataset.handle]; h.style.left=q.x+"px"; h.style.top=q.y+"px";});
}
function mid(a,b){return{x:(a.x+b.x)/2,y:(a.y+b.y)/2}}

function showPrecisionLoupe(clientX,clientY,xPct,yPct){
  if(!els.precisionLoupe || !els.precisionLoupeCanvas || !currentPage()) return;
  const rect=els.previewCanvas.getBoundingClientRect();
  const canvas=els.precisionLoupeCanvas, ctx=canvas.getContext("2d");
  const src=currentPage().sourceCanvas, sx=xPct/100*src.width, sy=yPct/100*src.height, size=86;
  ctx.fillStyle="#fff"; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(src, sx-size/2, sy-size/2, size, size, 0, 0, canvas.width, canvas.height);
  ctx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue("--action").trim() || "#e85145";
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(canvas.width/2,0); ctx.lineTo(canvas.width/2,canvas.height);
  ctx.moveTo(0,canvas.height/2); ctx.lineTo(canvas.width,canvas.height/2);
  ctx.stroke();
  if(els.precisionLoupeText) els.precisionLoupeText.textContent=`${xPct.toFixed(1)}%, ${yPct.toFixed(1)}%`;
  const preferRight=clientX<window.innerWidth/2, preferBelow=clientY<window.innerHeight/2;
  const left=preferRight?Math.min(rect.width-190,(clientX-rect.left)+34):Math.max(8,(clientX-rect.left)-200);
  const top=preferBelow?Math.min(rect.height-208,(clientY-rect.top)+30):Math.max(8,(clientY-rect.top)-216);
  els.precisionLoupe.style.left=left+"px";
  els.precisionLoupe.style.top=top+"px";
  els.precisionLoupe.hidden=false;
}
function hidePrecisionLoupe(){ if(els.precisionLoupe) els.precisionLoupe.hidden=true; }

function setHandle(handle,x,y){
  const p=currentPage(); if(!p)return;
  p.adjust.perspective=true; if(els.perspectiveEnabled) els.perspectiveEnabled.checked=true;
  const c=p.adjust.corners.map(q=>({...q})), gap=3;
  if(handle==="tl")c[0]={x:clamp(x,0,c[1].x-gap),y:clamp(y,0,c[3].y-gap)};
  if(handle==="tr")c[1]={x:clamp(x,c[0].x+gap,100),y:clamp(y,0,c[2].y-gap)};
  if(handle==="br")c[2]={x:clamp(x,c[3].x+gap,100),y:clamp(y,c[1].y+gap,100)};
  if(handle==="bl")c[3]={x:clamp(x,0,c[2].x-gap),y:clamp(y,c[0].y+gap,100)};
  if(handle==="top"){c[0].y=clamp(y,0,c[3].y-gap);c[1].y=clamp(y,0,c[2].y-gap)}
  if(handle==="right"){c[1].x=clamp(x,c[0].x+gap,100);c[2].x=clamp(x,c[3].x+gap,100)}
  if(handle==="bottom"){c[2].y=clamp(y,c[1].y+gap,100);c[3].y=clamp(y,c[0].y+gap,100)}
  if(handle==="left"){c[0].x=clamp(x,0,c[1].x-gap);c[3].x=clamp(x,0,c[2].x-gap)}
  p.adjust.corners=c; syncEdges(c); updateLabels(); updateOverlay();
}

function robustLineFit(points,mode){if(points.length<8)return null;let pts=points.slice(),fit=null;for(let pass=0;pass<3;pass++){let sw=0,sx=0,sy=0,sxx=0,sxy=0;for(const p of pts){const x=mode==="y"?p.x:p.y,y=mode==="y"?p.y:p.x,w=p.w||1;sw+=w;sx+=w*x;sy+=w*y;sxx+=w*x*x;sxy+=w*x*y;}const den=sw*sxx-sx*sx;if(Math.abs(den)<1e-6)return null;const a=(sw*sxy-sx*sy)/den,b=(sy-a*sx)/sw;fit={a,b};const residuals=pts.map(p=>Math.abs((mode==="y"?p.y:p.x)-(a*(mode==="y"?p.x:p.y)+b))).sort((a,b)=>a-b),med=residuals[Math.floor(residuals.length/2)]||1,limit=Math.max(3.5,med*2.8);pts=pts.filter(p=>Math.abs((mode==="y"?p.y:p.x)-(a*(mode==="y"?p.x:p.y)+b))<=limit);if(pts.length<8)break;}return fit;}
function intersectBoundary(hLine,vLine){if(!hLine||!vLine)return null;const den=1-vLine.a*hLine.a;if(Math.abs(den)<1e-5)return null;const x=(vLine.a*hLine.b+vLine.b)/den;return{x,y:hLine.a*x+hLine.b};}
function polygonArea(pts){let a=0;for(let i=0;i<pts.length;i++){const j=(i+1)%pts.length;a+=pts[i].x*pts[j].y-pts[j].x*pts[i].y;}return Math.abs(a)/2;}
function detectPerspectiveQuad(canvas){const ctx=canvas.getContext("2d",{willReadFrequently:true}),img=ctx.getImageData(0,0,canvas.width,canvas.height),d=img.data,w=canvas.width,h=canvas.height,lum=new Float32Array(w*h),grad=new Float32Array(w*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;lum[y*w+x]=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];}const border=[];for(let x=0;x<w;x+=5){border.push(lum[x],lum[(h-1)*w+x]);}for(let y=0;y<h;y+=5){border.push(lum[y*w],lum[y*w+w-1]);}border.sort((a,b)=>a-b);const bg=border[Math.floor(border.length*.65)]||245,gradSamples=[];for(let y=1;y<h-1;y+=2)for(let x=1;x<w-1;x+=2){const gx=lum[y*w+x+1]-lum[y*w+x-1],gy=lum[(y+1)*w+x]-lum[(y-1)*w+x],g=Math.hypot(gx,gy);grad[y*w+x]=g;gradSamples.push(g);}gradSamples.sort((a,b)=>a-b);const gradTh=Math.max(24,gradSamples[Math.floor(gradSamples.length*.84)]||32),contrastTh=Math.max(18,Math.min(55,Math.abs(bg-128)*.18+20)),scoreAt=(x,y)=>{const g=grad[y*w+x]||0,c=Math.abs(lum[y*w+x]-bg);return g*.92+c*.42;},edgeTh=gradTh*.92+contrastTh*.30,top=[],bottom=[],left=[],right=[],step=Math.max(3,Math.round(Math.min(w,h)/220)),pickVertical=(x,start,end,dir)=>{let best=null,bestS=0;for(let y=start;dir>0?y<=end:y>=end;y+=dir){const sc=scoreAt(x,y);if(sc>edgeTh&&sc>=scoreAt(x,clamp(y-dir,1,h-2))*.88){best={x,y,w:Math.min(4,sc/edgeTh)};break;}if(sc>bestS){bestS=sc;best={x,y,w:Math.min(3,sc/Math.max(1,edgeTh))};}}return bestS>edgeTh*.72?best:null;},pickHorizontal=(y,start,end,dir)=>{let best=null,bestS=0;for(let x=start;dir>0?x<=end:x>=end;x+=dir){const sc=scoreAt(x,y);if(sc>edgeTh&&sc>=scoreAt(clamp(x-dir,1,w-2),y)*.88){best={x,y,w:Math.min(4,sc/edgeTh)};break;}if(sc>bestS){bestS=sc;best={x,y,w:Math.min(3,sc/Math.max(1,edgeTh))};}}return bestS>edgeTh*.72?best:null;};for(let x=2;x<w-2;x+=step){const a=pickVertical(x,2,Math.floor(h*.52),1),b=pickVertical(x,h-3,Math.ceil(h*.48),-1);if(a)top.push(a);if(b)bottom.push(b);}for(let y=2;y<h-2;y+=step){const a=pickHorizontal(y,2,Math.floor(w*.52),1),b=pickHorizontal(y,w-3,Math.ceil(w*.48),-1);if(a)left.push(a);if(b)right.push(b);}const t=robustLineFit(top,"y"),b=robustLineFit(bottom,"y"),l=robustLineFit(left,"x"),r=robustLineFit(right,"x");let quad=[intersectBoundary(t,l),intersectBoundary(t,r),intersectBoundary(b,r),intersectBoundary(b,l)];if(quad.some(x=>!x))return null;const margin=Math.max(w,h)*.08;if(quad.some(p=>p.x<-margin||p.y<-margin||p.x>w+margin||p.y>h+margin))return null;if(polygonArea(quad)<w*h*.20)return null;const cx=quad.reduce((s,p)=>s+p.x,0)/4,cy=quad.reduce((s,p)=>s+p.y,0)/4,expand=1.008;return quad.map(p=>({x:clamp(cx+(p.x-cx)*expand,0,w-1),y:clamp(cy+(p.y-cy)*expand,0,h-1)}));}
function autoCorners(){const p=currentPage();if(!p)return;setStatus("Analisando perspectiva...");const base=scaleCanvasForPreview(p.sourceCanvas,1000),c=applyFilters(base,{...p.adjust,perspective:false}),quad=detectPerspectiveQuad(c);if(!quad){setStatus("Não detectei quatro bordas com segurança. Ajuste os vértices manualmente.");return;}p.adjust.corners=quad.map(pt=>({x:pt.x/c.width*100,y:pt.y/c.height*100}));p.adjust.perspective=true;if(els.perspectiveEnabled)els.perspectiveEnabled.checked=true;syncEdges(p.adjust.corners);p.thumbCache=null;renderPreview();renderPageFilmstrip();setStatus("Perspectiva detectada. Confira os quatro vértices antes de exportar.");}
function dist2(a,b){return (a[0]-b[0])**2+(a[1]-b[1])**2}
function setBoxCorners(p,l,t,r,b){p.adjust.corners=[{x:l,y:t},{x:r,y:t},{x:r,y:b},{x:l,y:b}]}

async function handleFiles(files){
  let doc=currentDoc(); if(!doc){addDoc(); doc=currentDoc();}
  const incoming = [...files];
  if(!incoming.length) return;

  const compatible = isMultiFaceCompatible();
  const mode = els.uploadMode?.value || "new-attachment";
  const layoutFaces = compatible && mode === "group-selection" ? Number(els.facesPerSheet?.value || 2) : 1;

  if(mode === "doc-per-file"){
    for(const file of incoming){
      const newDoc = createDoc({classification:"Documentos de instrução"});
      const att=createAttachment({fileName:file.name,title:"",classification:classificationFromScanType(file),showInCover:true,pages:[],createdAt:file.lastModified||Date.now(),fileType:file.type||file.name.split(".").pop()||"",layoutFaces:1});
      newDoc.attachments.push(att);
      state.docs.push(newDoc);
      state.activeDocId=newDoc.id; state.activeAttachmentId=att.id;
      if(file.type==="application/pdf"||file.name.toLowerCase().endsWith(".pdf")) await importPdf(file,att);
      else if(file.type.startsWith("image/")) await importImage(file,att);
      else setStatus(`Ignorado: ${file.name}`);
      state.activePageId=att.pages[0]?.id || state.activePageId;
    }
    if(state.docs.length>1 && state.docs[0].attachments.length===0 && !state.docs[0].title && !state.docs[0].classification) state.docs.shift();
    render();
    setStatus("Cada arquivo foi transformado em um Doc.");
    return;
  }

  if(mode === "append-active" && currentAttachment()){
    const att=currentAttachment();
    for(const file of incoming){
      if(file.type==="application/pdf"||file.name.toLowerCase().endsWith(".pdf")) await importPdf(file,att);
      else if(file.type.startsWith("image/")) await importImage(file,att);
      else setStatus(`Ignorado: ${file.name}`);
      att.createdAt = Math.min(att.createdAt || Date.now(), file.lastModified || Date.now());
      att.fileType = att.fileType || file.type || file.name.split(".").pop() || "";
    }
    if(compatible && att.pages.length>1) att.layoutFaces = Number(els.facesPerSheet?.value || att.layoutFaces || 2);
    state.activeAttachmentId=att.id;
    state.activePageId=att.pages[att.pages.length-1]?.id || state.activePageId;
    render();
    setStatus("Arquivos adicionados ao anexo selecionado.");
    return;
  }

  if(mode === "group-selection" && compatible){
    const att=createAttachment({fileName:incoming.map(f=>f.name).join(", "),classification:classificationFromScanType(incoming[0]),createdAt:Math.min(...incoming.map(f=>f.lastModified||Date.now())),fileType:"grupo",layoutFaces});
    doc.attachments.push(att);
    for(const file of incoming){
      if(file.type==="application/pdf"||file.name.toLowerCase().endsWith(".pdf")) await importPdf(file,att);
      else if(file.type.startsWith("image/")) await importImage(file,att);
      else setStatus(`Ignorado: ${file.name}`);
    }
    state.activeAttachmentId=att.id;
    state.activePageId=att.pages[0]?.id || null;
    render();
    setStatus(`${att.pages.length} face(s) agrupadas. Cada face continua editável.`);
    return;
  }

  for(const file of incoming){
    const att=createAttachment({fileName:file.name,title:"",classification:classificationFromScanType(file),showInCover:true,pages:[],createdAt:file.lastModified||Date.now(),fileType:file.type||file.name.split(".").pop()||"",layoutFaces:1});
    doc.attachments.push(att);
    state.activeAttachmentId=att.id;
    if(file.type==="application/pdf"||file.name.toLowerCase().endsWith(".pdf")) await importPdf(file,att);
    else if(file.type.startsWith("image/")) await importImage(file,att);
    else setStatus(`Ignorado: ${file.name}`);
    state.activePageId=att.pages[0]?.id || state.activePageId;
  }
  render();
  setStatus("Arquivos adicionados.");
}

async function addFilesToSpecificAttachment(files,target){
  const doc=state.docs.find(d=>d.id===target?.docId), att=doc?.attachments.find(a=>a.id===target?.attId); if(!doc||!att)return;
  state.activeDocId=doc.id;state.activeAttachmentId=att.id;
  for(const file of [...files]){ if(file.type==="application/pdf"||file.name.toLowerCase().endsWith(".pdf"))await importPdf(file,att); else if(file.type.startsWith("image/"))await importImage(file,att); }
  state.activePageId=att.pages[att.pages.length-1]?.id||state.activePageId; render(); setStatus("Arquivos adicionados ao anexo.");
}

function classificationFromScanType(file){
  const type = els.scanType?.value || "standard";
  if(type==="photo-grid") return "Fotografias";
  if(["id-front-back","professional-id"].includes(type)) return "Documento de identificação";
  if(type==="ctps") return "CTPS";
  if(type==="passport") return "Passaporte";
  if(file?.type?.startsWith("image/")) return "Documentos de comprovação";
  return "";
}

async function importPdf(file,att){
  const bytes=new Uint8Array(await file.arrayBuffer());
  const pdf=await pdfjsLib.getDocument({data:bytes}).promise;
  const pageCount=pdf.numPages;
  try{
    for(let i=1;i<=pageCount;i++){
      setStatus(`Carregando ${file.name}, página ${i}/${pageCount}...`);
      const page=await pdf.getPage(i), originalView=page.getViewport({scale:1}), view=page.getViewport({scale:1.30});
      const c=document.createElement("canvas"); c.width=Math.floor(view.width); c.height=Math.floor(view.height);
      await page.render({canvasContext:c.getContext("2d",{willReadFrequently:true}),viewport:view}).promise;
      const adjust=defaultAdjust();
      adjust.originalPaper={width:originalView.width,height:originalView.height,kind:"pdf"};
      att.pages.push({
        id:uid(), sourceCanvas:c, adjust, ocrText:"", ocrWords:[], ocrConfidence:null,
        thumbCache:null, selectedForSheet:false,
        sourceKind:"pdf", sourcePdfFile:file, sourcePdfPageIndex:i-1, sourcePdfPageCount:pageCount
      });
      try{page.cleanup?.();}catch(_){}
    }
  }finally{
    try{await pdf.destroy?.();}catch(_){}
  }
}

async function importImage(file,att){
  const url=URL.createObjectURL(file),img=new Image();img.src=url;await img.decode();
  const max=1800,scale=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight)),c=document.createElement("canvas");c.width=Math.round(img.naturalWidth*scale);c.height=Math.round(img.naturalHeight*scale);
  const ctx=c.getContext("2d",{willReadFrequently:true});ctx.fillStyle="#fff";ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);
  const adjust=defaultAdjust(),baseMax=841.89,physicalScale=baseMax/Math.max(img.naturalWidth,img.naturalHeight);adjust.originalPaper={width:img.naturalWidth*physicalScale,height:img.naturalHeight*physicalScale,kind:"image"};
  att.pages.push({id:uid(),sourceCanvas:c,adjust,ocrText:"",ocrWords:[],ocrConfidence:null,thumbCache:null,selectedForSheet:false,sourceKind:"image"});
}

function mergeFirstTwoToA4(){
  const count = Number(els.facesPerSheet?.value || 2);
  packPagesIntoA4(count);
}

function packPagesIntoA4(count=2){
  const att=currentAttachment(); if(!att || att.pages.length<2)return;
  count = [1,2,4,6].includes(Number(count)) ? Number(count) : 2;
  if(count===1){
    att.layoutFaces = 1;
    render();
    setStatus("Montagem em A4 desativada para este anexo.");
    return;
  }
  // v21: não compacta/destrói páginas. Mantém cada face como página editável.
  // A montagem em A4 acontece apenas na prévia/exportação, usando o ajuste individual de cada face.
  att.layoutFaces = count;
  att.sheetGroups = [];
  att.pages.forEach(p=>p.selectedForSheet=false);
  render();
  setStatus(`${count} faces por folha A4 aplicadas ao anexo. Cada face continua editável individualmente.`);
}

function getSheetLayout(group,count){
  const A4P={pw:1240,ph:1754},A4L={pw:1754,ph:1240}; const portraits=group.filter(img=>img.height>=img.width).length; let pw=A4P.pw,ph=A4P.ph,cols=1,rows=count;
  if(count===2){ if(portraits===2){pw=A4L.pw;ph=A4L.ph;cols=2;rows=1;} else {cols=1;rows=2;} }
  else if(count===3){ if(portraits>=2){pw=A4L.pw;ph=A4L.ph;cols=3;rows=1;} else {cols=1;rows=3;} }
  else if(count===4){cols=2;rows=2;}
  else if(count===5||count===6){cols=2;rows=3;}
  const margin=72,gap=34,cellW=(pw-margin*2-gap*(cols-1))/cols,cellH=(ph-margin*2-gap*(rows-1))/rows,cells=[];
  for(let idx=0;idx<count;idx++){const col=idx%cols,row=Math.floor(idx/cols);cells.push({x:margin+col*(cellW+gap),y:margin+row*(cellH+gap),w:cellW,h:cellH});}
  return {pw,ph,cells};
}

function makePackedSheetCanvas(pages,count){
  count = [2,3,4,5,6].includes(Number(count)) ? Number(count) : 2;
  const group = pages.map(page=>makePageCanvas(page,false));
  const layout = getSheetLayout(group,count);
  const c=document.createElement("canvas");
  c.width=layout.pw; c.height=layout.ph;
  const ctx=c.getContext("2d",{willReadFrequently:true});
  ctx.fillStyle="#fff"; ctx.fillRect(0,0,c.width,c.height);
  group.forEach((img,idx)=>{
    const cell=layout.cells[idx];
    if(cell) drawContained(ctx,img,cell.x,cell.y,cell.w,cell.h,{allowRotate:false});
  });
  return c;
}

function drawContained(ctx,img,x,y,w,h,options={}){
  // Nunca distorcer, nunca cortar. Só reduzir, centralizar e, se fizer sentido, girar.
  let drawable = img;
  const allowRotate = options.allowRotate !== false;
  if(allowRotate && shouldRotateToFit(img,w,h)){
    drawable = rotateCanvas(img,90);
  }
  const ratio = Math.min(w/drawable.width, h/drawable.height);
  const dw = drawable.width * ratio;
  const dh = drawable.height * ratio;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#fff";
  ctx.fillRect(x,y,w,h);
  ctx.drawImage(drawable, x+(w-dw)/2, y+(h-dh)/2, dw, dh);
  ctx.restore();
}

function shouldRotateToFit(img,w,h){
  const imgLandscape = img.width > img.height;
  const boxLandscape = w > h;
  if(imgLandscape === boxLandscape) return false;
  const currentScale = Math.min(w/img.width,h/img.height);
  const rotatedScale = Math.min(w/img.height,h/img.width);
  return rotatedScale > currentScale * 1.08;
}

function pageLooksUpsideDown(page){
  // Heurística conservadora. Sem OCR confiável, melhor não inventar rotação agressiva.
  return false;
}

function removePage(){
  const att=currentAttachment(), p=currentPage(); if(!att||!p)return;
  const idx=att.pages.findIndex(x=>x.id===p.id);
  att.pages.splice(idx,1);
  att.sheetGroups=(att.sheetGroups||[]).map(g=>({...g,pageIds:g.pageIds.filter(id=>id!==p.id)})).filter(g=>g.pageIds.length>=2);
  state.activePageId=att.pages[Math.min(idx,att.pages.length-1)]?.id || null;
  render();
}

function movePage(delta){
  const att=currentAttachment(), p=currentPage(); if(!att||!p)return;
  const i=att.pages.findIndex(x=>x.id===p.id), j=i+delta;
  if(j<0||j>=att.pages.length)return;
  [att.pages[i],att.pages[j]]=[att.pages[j],att.pages[i]];
  render();
}

function paperSettingsFromAdjust(a=defaultAdjust()){
  return {paperSize:a.paperSize||"a4",orientation:a.orientation||"portrait",marginX:Number(a.marginX??10),marginY:Number(a.marginY??10),autoRotateFit:!!a.autoRotateFit,originalPaper:a.originalPaper?{...a.originalPaper}:null};
}
function getPaperFromSettings(settings){
  if(settings.paperSize==="original"&&settings.originalPaper?.width&&settings.originalPaper?.height)return [Math.max(36,settings.originalPaper.width),Math.max(36,settings.originalPaper.height)];
  let [w,h]=PAPER[settings.paperSize]||PAPER.a4;if(settings.orientation==="landscape")[w,h]=[h,w];return [w,h];
}
function getPaper(){return getPaperFromSettings(paperSettingsFromAdjust(currentPage()?.adjust||defaultAdjust()));}
function syncPaperOriginalUi(){if(!els.paperSize||!els.orientation)return;const original=els.paperSize.value==="original";els.orientation.disabled=original;if(els.autoRotateFit)els.autoRotateFit.disabled=original;}

async function canvasBlob(canvas,type="image/png",quality){
  return new Promise((resolve,reject)=>{
    try{canvas.toBlob(b=>b?resolve(b):reject(new Error("Não foi possível exportar a página.")),type,quality);}
    catch(err){reject(new Error("Canvas bloqueado pelo navegador. Recarregue esta versão e evite imagens externas coladas diretamente."));}
  });
}
function qualityPreset(){return QUALITY_PRESETS[state.pdfQuality]||QUALITY_PRESETS.standard;}
function prepareCanvasForQuality(canvas){const preset=qualityPreset();if(!preset.maxDim||Math.max(canvas.width,canvas.height)<=preset.maxDim)return canvas;const sc=preset.maxDim/Math.max(canvas.width,canvas.height),c=document.createElement("canvas");c.width=Math.max(1,Math.round(canvas.width*sc));c.height=Math.max(1,Math.round(canvas.height*sc));const ctx=c.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,c.width,c.height);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";ctx.drawImage(canvas,0,0,c.width,c.height);return c;}
async function embedCanvasForQuality(pdf,canvas){const preset=qualityPreset(),prepared=prepareCanvasForQuality(canvas);if(preset.format==="png")return await pdf.embedPng(await (await canvasBlob(prepared,"image/png")).arrayBuffer());return await pdf.embedJpg(await (await canvasBlob(prepared,"image/jpeg",preset.jpegQuality)).arrayBuffer());}
function estimateItemPixels(item){const preset=qualityPreset();let w,h;if(item.pages.length>1){w=1240;h=1754;}else{const c=item.pages[0]?.sourceCanvas;if(!c)return 0;w=c.width;h=c.height;}if(preset.maxDim&&Math.max(w,h)>preset.maxDim){const sc=preset.maxDim/Math.max(w,h);w*=sc;h*=sc;}return Math.max(1,w*h);}
function formatBytes(n){if(!Number.isFinite(n)||n<=0)return "Sem páginas";if(n<1024*1024)return `${Math.max(1,Math.round(n/1024))} KB`;return `${(n/(1024*1024)).toFixed(n<10*1024*1024?1:0).replace(".",",")} MB`;}
function estimatePdfBytes(){
  let bytes=0,sheets=0,covers=0;
  const preset=qualityPreset();
  for(const d of state.docs){
    if(els.includeCover?.checked)covers++;
    for(const a of d.attachments){
      for(const item of getAttachmentExportItems(a)){
        sheets++;
        for(const p of item.pages){
          if(canPreservePdfPage(p)){
            bytes+=nativePageApproxBytes(p)*.92;
          }else{
            const c=p.sourceCanvas;if(!c)continue;
            let w=c.width,h=c.height;
            if(preset.maxDim && Math.max(w,h)>preset.maxDim){const sc=preset.maxDim/Math.max(w,h);w*=sc;h*=sc;}
            bytes+=Math.max(1,w*h)*preset.estimateBpp;
          }
        }
      }
    }
  }
  if(!sheets&&!covers)return null;
  bytes+=sheets*16000+covers*180000;
  if(els.includeLetterhead?.checked)bytes+=sheets*45000;
  if(els.embedOcrText?.checked)bytes+=sheets*5000;
  return {low:bytes*.70,high:bytes*1.38,mid:bytes};
}

async function backgroundFileToData(file){
  if(!file)return null;
  if(file.type==="application/pdf"||file.name.toLowerCase().endsWith(".pdf")){
    const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise, page=await pdf.getPage(1), view=page.getViewport({scale:1.4});
    const max=1800,scale=Math.min(1,max/Math.max(view.width,view.height)),v=page.getViewport({scale:1.4*scale}); const c=document.createElement("canvas");c.width=Math.round(v.width);c.height=Math.round(v.height);await page.render({canvasContext:c.getContext("2d"),viewport:v}).promise;return {name:file.name,dataUrl:c.toDataURL("image/png")};
  }
  const url=URL.createObjectURL(file),img=new Image();img.src=url;await img.decode();const max=1800,s=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight)),c=document.createElement("canvas");c.width=Math.round(img.naturalWidth*s);c.height=Math.round(img.naturalHeight*s);const ctx=c.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);return {name:file.name,dataUrl:c.toDataURL("image/png")};
}
function getBackgroundUri(brand,kind){
  const custom=state.customBackgrounds[kind]; if(custom?.dataUrl)return custom.dataUrl; if(brand==="none")return null;
  if(brand==="mvs")return kind==="cover"?BG_DATA.mvsCover:BG_DATA.mvsLetterhead;
  if(brand==="gdv")return kind==="cover"?BG_DATA.gdvCover:BG_DATA.gdvLetterhead; return null;
}

async function getFonts(pdf){
  const { StandardFonts } = PDFLib;
  if (window.fontkit && pdf.registerFontkit) {
    try { pdf.registerFontkit(fontkit); } catch(e) {}
  }
  const fallback = {
    montserrat: await pdf.embedFont(StandardFonts.Helvetica),
    montserratBold: await pdf.embedFont(StandardFonts.HelveticaBold),
    libre: await pdf.embedFont(StandardFonts.TimesRoman)
  };
  if (!window.fontkit) return fallback;
  try {
    return {
      montserrat: state.fontBytes.montserratRegular ? await pdf.embedFont(state.fontBytes.montserratRegular) : fallback.montserrat,
      montserratBold: state.fontBytes.montserratBold ? await pdf.embedFont(state.fontBytes.montserratBold) : fallback.montserratBold,
      libre: state.fontBytes.libreRegular ? await pdf.embedFont(state.fontBytes.libreRegular) : fallback.libre
    };
  } catch(e) {
    setStatus("Fonte enviada não pôde ser embutida. Usando fonte padrão.");
    return fallback;
  }
}

async function loadBg(pdfDoc,brand,kind){
  const uri=getBackgroundUri(brand,kind); if(!uri)return null;
  // Sempre incorpora no PDF atual. PDFImage não pode ser reaproveitado entre PDFDocument diferentes.
  let bytes;
  if(uri.startsWith("data:")){
    const base64=uri.split(",")[1]||"";
    bytes=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));
  } else {
    const response=await fetch(uri,{cache:"force-cache"});
    if(!response.ok) throw new Error(`Não foi possível carregar ${kind === "cover" ? "a capa" : "o timbrado"}.`);
    bytes=new Uint8Array(await response.arrayBuffer());
  }
  return await pdfDoc.embedPng(bytes);
}


function orientCanvasForBox(canvas, paperW, paperH){
  const boxLandscape = paperW > paperH;
  const canvasLandscape = canvas.width > canvas.height;
  if(canvasLandscape === boxLandscape) return canvas;
  const currentScale = Math.min(paperW/canvas.width, paperH/canvas.height);
  const rotatedScale = Math.min(paperW/canvas.height, paperH/canvas.width);
  return rotatedScale > currentScale * 1.08 ? rotateCanvas(canvas,90) : canvas;
}


function hasPixelPdfAdjustments(p){
  const a=p?.adjust||defaultAdjust();
  return !!a.perspective ||
    Number(a.brightness??100)!==100 ||
    Number(a.contrast??100)!==100 ||
    Number(a.saturation??100)!==100 ||
    Number(a.grayscale??0)!==0 ||
    Number(a.threshold??0)!==0;
}
function canPreservePdfPage(p){
  return !!(els.preservePdfNative?.checked !== false &&
    p?.sourceKind==="pdf" &&
    p?.sourcePdfFile &&
    Number.isInteger(p?.sourcePdfPageIndex) &&
    !hasPixelPdfAdjustments(p));
}
function rotatedVisualSize(width,height,rotation=0){
  const n=((Number(rotation)||0)%360+360)%360;
  return (n===90||n===270)?{width:height,height:width}:{width,height};
}
function nativePageApproxBytes(p){
  const f=p?.sourcePdfFile, count=Math.max(1,Number(p?.sourcePdfPageCount)||1);
  return f?.size ? f.size/count : 0;
}
async function getNativePdfBytes(p,ctx){
  const file=p.sourcePdfFile;
  if(ctx.bytesByFile.has(file))return ctx.bytesByFile.get(file);
  const bytes=new Uint8Array(await file.arrayBuffer());
  ctx.bytesByFile.set(file,bytes);
  return bytes;
}
async function getNativeEmbeddedPage(pdf,p,ctx){
  if(ctx.embeddedByPage.has(p.id))return ctx.embeddedByPage.get(p.id);
  const bytes=await getNativePdfBytes(p,ctx);
  const [embedded]=await pdf.embedPdf(bytes,[p.sourcePdfPageIndex]);
  ctx.embeddedByPage.set(p.id,embedded);
  return embedded;
}
async function getNativeSourceDocument(p,ctx){
  const file=p.sourcePdfFile;
  if(ctx.sourceDocs.has(file))return ctx.sourceDocs.get(file);
  const bytes=await getNativePdfBytes(p,ctx);
  const doc=await PDFLib.PDFDocument.load(bytes,{ignoreEncryption:false});
  ctx.sourceDocs.set(file,doc);
  return doc;
}
function shouldAutoRotatePdf(embedded,rotation,boxW,boxH){
  const base=rotatedVisualSize(embedded.width,embedded.height,rotation);
  const current=Math.min(boxW/base.width,boxH/base.height);
  const rotated={width:base.height,height:base.width};
  const alt=Math.min(boxW/rotated.width,boxH/rotated.height);
  return alt>current*1.08;
}
function drawEmbeddedPdfContained(targetPage,embedded,box,rotation=0,allowAutoRotate=false){
  let n=((Number(rotation)||0)%360+360)%360;
  if(allowAutoRotate && shouldAutoRotatePdf(embedded,n,box.w,box.h))n=(n+90)%360;
  const visual=rotatedVisualSize(embedded.width,embedded.height,n);
  const scale=Math.min(box.w/visual.width,box.h/visual.height);
  const visualW=visual.width*scale,visualH=visual.height*scale;
  const x0=box.x+(box.w-visualW)/2,y0=box.y+(box.h-visualH)/2;
  const w=embedded.width*scale,h=embedded.height*scale;
  const {degrees}=PDFLib;
  if(n===90)targetPage.drawPage(embedded,{x:x0+visualW,y:y0,width:w,height:h,rotate:degrees(90)});
  else if(n===180)targetPage.drawPage(embedded,{x:x0+visualW,y:y0+visualH,width:w,height:h,rotate:degrees(180)});
  else if(n===270)targetPage.drawPage(embedded,{x:x0,y:y0+visualH,width:w,height:h,rotate:degrees(270)});
  else targetPage.drawPage(embedded,{x:x0,y:y0,width:w,height:h});
}
function drawEmbeddedImageContained(targetPage,img,box){
  const ratio=Math.min(box.w/img.width,box.h/img.height);
  const w=img.width*ratio,h=img.height*ratio;
  targetPage.drawImage(img,{x:box.x+(box.w-w)/2,y:box.y+(box.h-h)/2,width:w,height:h});
}
function compositionGrid(pages,box){
  const count=pages.length;
  const portraits=pages.filter(p=>{
    const a=p.adjust||defaultAdjust();
    const base=canPreservePdfPage(p)&&a.originalPaper
      ? rotatedVisualSize(a.originalPaper.width,a.originalPaper.height,a.rotation)
      : rotatedVisualSize(p.sourceCanvas?.width||1,p.sourceCanvas?.height||1,a.rotation);
    return base.height>=base.width;
  }).length;
  let cols=1,rows=count;
  if(count===2){if(portraits===2){cols=2;rows=1;}else{cols=1;rows=2;}}
  else if(count===3){if(portraits>=2){cols=3;rows=1;}else{cols=1;rows=3;}}
  else if(count===4){cols=2;rows=2;}
  else if(count===5||count===6){cols=2;rows=3;}
  const gap=Math.min(14,Math.max(7,Math.min(box.w,box.h)*.018));
  const cellW=(box.w-gap*(cols-1))/cols,cellH=(box.h-gap*(rows-1))/rows,cells=[];
  for(let i=0;i<count;i++){
    const col=i%cols,row=Math.floor(i/cols);
    cells.push({x:box.x+col*(cellW+gap),y:box.y+box.h-(row+1)*cellH-row*gap,w:cellW,h:cellH});
  }
  return cells;
}
function canDirectCopyNativeItem(item,settings){
  if(item.pages.length!==1)return false;
  const p=item.pages[0],a=p.adjust||defaultAdjust();
  return canPreservePdfPage(p) &&
    settings.paperSize==="original" &&
    Number(settings.marginX||0)===0 &&
    Number(settings.marginY||0)===0 &&
    !settings.autoRotateFit &&
    (((Number(a.rotation)||0)%360+360)%360)===0 &&
    !els.includeLetterhead.checked &&
    !els.includeHeader.checked &&
    !els.includePageNumbers.checked &&
    !els.includeFooterInfo.checked;
}
async function addHiddenOcrText(page,item,fonts){
  if(!els.embedOcrText.checked)return;
  const text=item.pages.map(p=>p.ocrText||"").filter(Boolean).join("\n");
  if(text)page.drawText(text.slice(0,5000),{x:8,y:4,size:1,font:fonts.montserrat,color:PDFLib.rgb(1,1,1),opacity:.01});
}
async function addNativeOrRasterExportItem(pdf,item,doc,att,cfg){
  const settings=cfg.paper||item.paper||paperSettingsFromAdjust(item.pages[0]?.adjust||defaultAdjust());

  if(canDirectCopyNativeItem(item,settings)){
    const p=item.pages[0],src=await getNativeSourceDocument(p,cfg.nativeCtx);
    const [copied]=await pdf.copyPages(src,[p.sourcePdfPageIndex]);
    pdf.addPage(copied);
    await addHiddenOcrText(copied,item,cfg.fonts);
    return copied;
  }

  const {rgb}=PDFLib,[paperW,paperH]=getPaperFromSettings(settings);
  const page=pdf.addPage([paperW,paperH]);
  page.drawRectangle({x:0,y:0,width:paperW,height:paperH,color:rgb(1,1,1)});
  const template=els.globalTemplate.value;
  if(els.includeLetterhead.checked){
    const bg=await loadBg(pdf,template,"letterhead");
    if(bg)page.drawImage(bg,{x:0,y:0,width:paperW,height:paperH});
  }

  const marginX=mmToPt(settings.marginX),marginY=mmToPt(settings.marginY);
  const header=els.includeHeader.checked?36:10,footer=(els.includePageNumbers.checked||els.includeFooterInfo.checked)?34:10;
  const box={x:marginX,y:marginY+footer,w:Math.max(20,paperW-2*marginX),h:Math.max(20,paperH-2*marginY-header-footer)};
  const cells=item.pages.length>1?compositionGrid(item.pages,box):[box];

  for(let i=0;i<item.pages.length;i++){
    const p=item.pages[i],cell=cells[i]||box;
    if(canPreservePdfPage(p)){
      const embedded=await getNativeEmbeddedPage(pdf,p,cfg.nativeCtx);
      drawEmbeddedPdfContained(page,embedded,cell,p.adjust?.rotation||0,!!settings.autoRotateFit);
    }else{
      let c=makePageCanvas(p,false);
      if(settings.autoRotateFit)c=orientCanvasForBox(c,cell.w,cell.h);
      const img=await embedCanvasForQuality(pdf,c);
      drawEmbeddedImageContained(page,img,cell);
    }
  }

  drawHeaderFooter(page,doc,att,{paperW,paperH,fonts:cfg.fonts,counter:cfg.counter,total:cfg.total});
  await addHiddenOcrText(page,item,cfg.fonts);
  return page;
}

function getAttachmentExportItems(att){
  const pages=att.pages||[],byId=new Map(pages.map(p=>[p.id,p])),groups=(att.sheetGroups||[]).filter(g=>g.pageIds?.length>=2&&g.pageIds.length<=6),grouped=new Set(groups.flatMap(g=>g.pageIds)),firstMap=new Map(groups.map(g=>[g.pageIds[0],g])),items=[];
  if(groups.length){for(const p of pages){if(grouped.has(p.id)){const g=firstMap.get(p.id);if(g){const gp=g.pageIds.map(id=>byId.get(id)).filter(Boolean);if(gp.length)items.push({pages:gp,paper:g.paper||paperSettingsFromAdjust(gp[0].adjust)});}continue;}items.push({pages:[p],paper:paperSettingsFromAdjust(p.adjust)});}return items;}
  const faces=Number(att.layoutFaces||1); if(faces>1){for(let i=0;i<pages.length;i+=faces){const gp=pages.slice(i,i+faces);items.push({pages:gp,paper:paperSettingsFromAdjust(gp[0]?.adjust||defaultAdjust())});}} else pages.forEach(p=>items.push({pages:[p],paper:paperSettingsFromAdjust(p.adjust)})); return items;
}

function countExportSheets(docs){let total=0;for(const d of docs)for(const a of d.attachments)total+=getAttachmentExportItems(a).length;return total;}

async function addCanvasPageToPdf(pdf,pdfPageCanvas,doc,att,cfg){
  const {rgb}=PDFLib,{fonts,counter,total}=cfg,settings=cfg.paper||paperSettingsFromAdjust(currentPage()?.adjust||defaultAdjust()),[paperW,paperH]=getPaperFromSettings(settings); const page=pdf.addPage([paperW,paperH]);page.drawRectangle({x:0,y:0,width:paperW,height:paperH,color:rgb(1,1,1)});
  const template=els.globalTemplate.value; if(els.includeLetterhead.checked){const bg=await loadBg(pdf,template,"letterhead");if(bg)page.drawImage(bg,{x:0,y:0,width:paperW,height:paperH});}
  let c=settings.autoRotateFit?orientCanvasForBox(pdfPageCanvas,paperW,paperH):pdfPageCanvas; const img=await embedCanvasForQuality(pdf,c);
  const marginX=mmToPt(settings.marginX),marginY=mmToPt(settings.marginY),header=els.includeHeader.checked?36:10,footer=(els.includePageNumbers.checked||els.includeFooterInfo.checked)?34:10;
  const boxW=Math.max(20,paperW-2*marginX),boxH=Math.max(20,paperH-2*marginY-header-footer),ratio=Math.min(boxW/img.width,boxH/img.height),w=img.width*ratio,h=img.height*ratio;
  page.drawImage(img,{x:marginX+(boxW-w)/2,y:marginY+footer+(boxH-h)/2,width:w,height:h});drawHeaderFooter(page,doc,att,{paperW,paperH,fonts,counter,total});
}

async function buildPdf(docs){
  const {PDFDocument}=PDFLib,pdf=await PDFDocument.create(),fonts=await getFonts(pdf),template=els.globalTemplate.value,total=countExportSheets(docs);
  const nativeCtx={bytesByFile:new Map(),embeddedByPage:new Map(),sourceDocs:new Map()};
  let counter=0;
  for(const doc of docs){
    if(els.includeCover.checked)await addCover(pdf,doc,{fonts,template});
    for(const att of doc.attachments){
      for(const item of getAttachmentExportItems(att)){
        counter++;
        await addNativeOrRasterExportItem(pdf,item,doc,att,{fonts,counter,total,paper:item.paper,nativeCtx});
      }
    }
  }
  return new Blob([await pdf.save()],{type:"application/pdf"});
}

function wrapTextLines(text,font,size,maxWidth,maxLines=6){
  const words=String(text||"").trim().split(/\s+/).filter(Boolean),lines=[];let line="";for(const word of words){const next=line?line+" "+word:word;if(font.widthOfTextAtSize(next,size)<=maxWidth)line=next;else{if(line)lines.push(line);line=word;if(lines.length>=maxLines-1)break;}}if(line&&lines.length<maxLines)lines.push(line);return lines;
}
async function addCover(pdf,doc,cfg){
  const {fonts,template}=cfg,[paperW,paperH]=PAPER.a4,page=pdf.addPage([paperW,paperH]);page.drawRectangle({x:0,y:0,width:paperW,height:paperH,color:PDFLib.rgb(1,1,1)});const bg=await loadBg(pdf,template,"cover");if(bg)page.drawImage(bg,{x:0,y:0,width:paperW,height:paperH});
  const docNo=doc.number||"",title=doc.title||doc.classification||"",centerY=paperH/2+32,builtGdv=template==="gdv"&&!state.customBackgrounds.cover,builtMvs=template==="mvs"&&!state.customBackgrounds.cover;
  const numFont=builtGdv?fonts.libre:fonts.montserratBold,titleFont=fonts.montserratBold,subFont=fonts.montserrat,numColor=builtGdv?hex("#eee4d7"):hex("#000000"),titleColor=builtGdv?hex("#c29348"):builtMvs?hex("#c5a001"):hex("#8a651c"),subColor=builtGdv?hex("#ffffff"):hex("#111827");
  centerText(page,docNo,centerY,58,numFont,numColor,paperW);centerText(page,title,centerY-42,20,titleFont,titleColor,paperW);let y=centerY-78;
  if(doc.coverContentMode==="description"){
    const lines=wrapTextLines(doc.coverDescription,subFont,11,paperW-mmToPt(60),6);lines.forEach(line=>{centerText(page,line,y,11,subFont,subColor,paperW);y-=16;});
  }else{
    doc.attachments.filter(a=>a.showInCover).map(a=>a.title||a.classification||"").filter(Boolean).forEach(item=>{if(y>90){centerText(page,item,y,11,subFont,subColor,paperW);y-=15;}});
  }
}

function hex(h){
  const n=h.replace("#",""); return PDFLib.rgb(parseInt(n.slice(0,2),16)/255,parseInt(n.slice(2,4),16)/255,parseInt(n.slice(4,6),16)/255);
}
function centerText(page,text,y,size,font,color,paperW){
  text=String(text||"");
  const w=font.widthOfTextAtSize(text,size);
  page.drawText(text,{x:(paperW-w)/2,y,size,font,color});
}
function drawHeaderFooter(page,doc,att,cfg){
  const {paperW,paperH,fonts,counter,total}=cfg;
  const titleOrClass = doc.title || doc.classification || "";
  if(els.includeHeader.checked){
    const attLabel = att.title || att.classification || "";
    const text=`${doc.number||""}${titleOrClass? " - "+titleOrClass : ""}${attLabel ? " | "+attLabel : ""}`;
    page.drawText(text.slice(0,110),{x:mmToPt(12),y:paperH-mmToPt(24),size:8,font:fonts.montserratBold,color:hex("#1d2433"),maxWidth:paperW-mmToPt(24)});
  }
  const footerParts=[];
  if(els.includeFooterInfo.checked && doc.classification) footerParts.push(`Classificação: ${doc.classification}`);
  if(els.includeFooterInfo.checked && att.classification) footerParts.push(`Anexo: ${att.classification}`);
  if(footerParts.length) page.drawText(footerParts.join(" · ").slice(0,130),{x:mmToPt(12),y:mmToPt(8),size:7,font:fonts.montserrat,color:hex("#333333"),maxWidth:paperW-mmToPt(24)});
  if(els.includePageNumbers.checked) centerText(page,`${counter} de ${total}`,mmToPt(18),9,fonts.montserrat,hex("#333333"),paperW);
}

function outputNameForDocs(docs){
  const custom=els.outputName.value.trim();
  if(custom) return safeFile(custom.toLowerCase().endsWith(".pdf")?custom:custom+".pdf");
  if(docs.length===1){
    const d=docs[0];
    const base=[d.number,d.title || d.classification].filter(Boolean).join(" - ") || "documento";
    return safeFile(base)+".pdf";
  }
  return "documentos.pdf";
}

async function previewPdf(){
  if(!state.docs.some(d=>d.attachments.length)){setStatus("Nenhum anexo para gerar.");return;}
  setStatus("Gerando pré-visualização...");
  const blob=await buildPdf(state.docs);
  if(state.lastBlobUrl)URL.revokeObjectURL(state.lastBlobUrl);
  state.lastBlobUrl=URL.createObjectURL(blob);
  els.pdfFrame.src=state.lastBlobUrl;
  els.pdfFrame.style.display="block";
  if(els.openPreviewLink){els.openPreviewLink.href=state.lastBlobUrl; els.openPreviewLink.hidden=false;}
  els.previewEmpty.style.display="none";
  els.downloadPreviewBtn.disabled=false;
  setStatus("Pré-visualização gerada.");
}

async function downloadDirect(){
  setStatus("Gerando arquivo para download...");
  if(els.exportMode.value==="zip"){
    const zip=new JSZip();
    for(const d of state.docs){
      if(!d.attachments.length)continue;
      zip.file(outputNameForDocs([d]), await buildPdf([d]));
    }
    downloadBlob(await zip.generateAsync({type:"blob"}), safeFile(els.outputName.value || "documentos")+".zip");
  } else {
    downloadBlob(await buildPdf(state.docs), outputNameForDocs(state.docs));
  }
  setStatus("Arquivo baixado.");
}

function downloadBlob(blob,name){
  const a=document.createElement("a"), url=URL.createObjectURL(blob);
  a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function downloadBlobUrl(url,name){const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();}

function otsuThreshold(hist,total){let sum=0;for(let i=0;i<256;i++)sum+=i*hist[i];let sumB=0,wB=0,maxVariance=-1,threshold=145;for(let i=0;i<256;i++){wB+=hist[i];if(!wB)continue;const wF=total-wB;if(!wF)break;sumB+=i*hist[i];const mB=sumB/wB,mF=(sum-sumB)/wF,variance=wB*wF*(mB-mF)*(mB-mF);if(variance>maxVariance){maxVariance=variance;threshold=i;}}return threshold;}
function makeOcrCanvas(p,binary=false){const src=makePageCanvas(p,false),target=2400,scale=Math.min(2.2,Math.max(1,target/Math.max(src.width,src.height))),c=document.createElement("canvas");c.width=Math.max(1,Math.round(src.width*scale));c.height=Math.max(1,Math.round(src.height*scale));const ctx=c.getContext("2d",{willReadFrequently:true});ctx.fillStyle="#fff";ctx.fillRect(0,0,c.width,c.height);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";ctx.drawImage(src,0,0,c.width,c.height);const img=ctx.getImageData(0,0,c.width,c.height),d=img.data,hist=new Uint32Array(256);for(let i=0;i<d.length;i+=4){const g=Math.round(.2126*d[i]+.7152*d[i+1]+.0722*d[i+2]);hist[g]++;}const total=c.width*c.height,percentile=q=>{let n=0,targetN=total*q;for(let i=0;i<256;i++){n+=hist[i];if(n>=targetN)return i;}return 255;},lo=percentile(.02),hi=Math.max(lo+20,percentile(.985)),den=hi-lo,stretchedHist=new Uint32Array(256);for(let i=0;i<d.length;i+=4){const g=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];let v=clamp(Math.round((g-lo)*255/den),0,255);v=clamp(Math.round((v-128)*1.08+128),0,255);d[i]=d[i+1]=d[i+2]=v;d[i+3]=255;stretchedHist[v]++;}if(binary){const th=otsuThreshold(stretchedHist,total);for(let i=0;i<d.length;i+=4){const v=d[i]<th?0:255;d[i]=d[i+1]=d[i+2]=v;}}ctx.putImageData(img,0,0);return c;}
async function ensureOcrWorker(lang){if(state.ocrWorker&&state.ocrWorkerLang===lang)return state.ocrWorker;if(state.ocrWorker){try{await state.ocrWorker.terminate();}catch(_){}state.ocrWorker=null;}try{state.ocrWorker=await Tesseract.createWorker(lang,Tesseract.OEM?.LSTM_ONLY||1,{logger:m=>m.status&&setStatus("OCR: "+m.status+(m.progress?` ${(m.progress*100).toFixed(0)}%`:""))});state.ocrWorkerLang=lang;try{await state.ocrWorker.setParameters({preserve_interword_spaces:"1",tessedit_pageseg_mode:"3"});}catch(_){}return state.ocrWorker;}catch(_){state.ocrWorker=null;state.ocrWorkerLang=null;return null;}}
async function recognizeOcrCanvas(canvas,lang){const worker=await ensureOcrWorker(lang);if(worker)return await worker.recognize(canvas);return await Tesseract.recognize(canvas,lang,{logger:m=>m.status&&setStatus("OCR: "+m.status+(m.progress?` ${(m.progress*100).toFixed(0)}%`:""))});}
async function runOcr(p){if(!p||!window.Tesseract)return;const lang=els.ocrLang.value;setStatus("Preparando imagem para OCR...");let res=await recognizeOcrCanvas(makeOcrCanvas(p,false),lang),confidence=Number(res.data?.confidence||0);if(confidence<62){setStatus("OCR com baixa confiança. Tentando leitura reforçada...");const retry=await recognizeOcrCanvas(makeOcrCanvas(p,true),lang),retryConfidence=Number(retry.data?.confidence||0);if(retryConfidence>confidence){res=retry;confidence=retryConfidence;}}p.ocrText=res.data?.text?.trim()||"";p.ocrWords=res.data?.words||[];p.ocrConfidence=confidence;setStatus(p.ocrText?`OCR concluído · confiança ${Math.round(confidence)}%`:"OCR concluído sem texto reconhecido.");}

function applyAdjust(scope){
  saveControls();
  const p=currentPage(); if(!p)return;
  const common={
    brightness:p.adjust.brightness,
    contrast:p.adjust.contrast,
    saturation:p.adjust.saturation,
    grayscale:p.adjust.grayscale,
    threshold:p.adjust.threshold,
    rotation:p.adjust.rotation
  };
  const targets=scope==="attachment"?currentAttachment().pages:scope==="doc"?currentDoc().attachments.flatMap(a=>a.pages):state.docs.flatMap(d=>d.attachments.flatMap(a=>a.pages));
  targets.forEach(pg=>{
    pg.adjust={...pg.adjust, ...JSON.parse(JSON.stringify(common))};
    pg.thumbCache=null;
  });
  render(); setStatus("Padrão comum aplicado. A perspectiva individual de cada face foi preservada.");
}

function bind(){
  DOC_TYPES.forEach(t=>els.docClassification.add(new Option(t || "Sem classificação", t)));

  document.querySelectorAll(".step,.next,.prev").forEach(b=>b.onclick=()=>goStep(+(b.dataset.step||b.dataset.next||b.dataset.prev)));
  els.addDocBtn.onclick=addDoc;
  els.renumberDocsBtn.onclick=()=>{state.docs.forEach((d,i)=>d.number=`Doc. ${String(i+1).padStart(2,"0")}`);render();};

  [els.docNumber,els.docTitle,els.docClassification].forEach(el=>el.oninput=()=>{const d=currentDoc();if(!d)return;d.number=els.docNumber.value;d.title=els.docTitle.value;d.classification=els.docClassification.value;renderDocTabs();renderEditSelectors();renderExportDocs();});
  [els.includeCover,els.includeLetterhead,els.globalTemplate].forEach(el=>el&& (el.onchange=()=>{renderTemplatePreviews(); setStatus("Padrão visual atualizado.");}));
  const bindCustomBg=(input,kind,nameEl)=>{if(!input)return;input.onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{state.customBackgrounds[kind]=await backgroundFileToData(file);state.bgCache={};if(nameEl)nameEl.textContent=file.name;renderTemplatePreviews();setStatus(kind==="cover"?"Capa própria carregada.":"Timbrado próprio carregado.");}catch(err){setStatus("Não foi possível carregar o fundo: "+err.message);}};};
  bindCustomBg(els.customCoverFile,"cover",els.customCoverName);bindCustomBg(els.customLetterheadFile,"letterhead",els.customLetterheadName);
  if(els.clearCustomCoverBtn)els.clearCustomCoverBtn.onclick=()=>{state.customBackgrounds.cover=null;state.bgCache={};if(els.customCoverFile)els.customCoverFile.value="";if(els.customCoverName)els.customCoverName.textContent="Nenhuma capa própria.";renderTemplatePreviews();};
  if(els.clearCustomLetterheadBtn)els.clearCustomLetterheadBtn.onclick=()=>{state.customBackgrounds.letterhead=null;state.bgCache={};if(els.customLetterheadFile)els.customLetterheadFile.value="";if(els.customLetterheadName)els.customLetterheadName.textContent="Nenhum timbrado próprio.";renderTemplatePreviews();};

  els.fontMontserratRegular.onchange=async e=>{state.fontBytes.montserratRegular=await readFileBytes(e.target.files[0]); setStatus("Montserrat Regular carregada.");};
  els.fontMontserratBold.onchange=async e=>{state.fontBytes.montserratBold=await readFileBytes(e.target.files[0]); setStatus("Montserrat Negrito carregada.");};
  els.fontLibreRegular.onchange=async e=>{state.fontBytes.libreRegular=await readFileBytes(e.target.files[0]); setStatus("Libre Baskerville carregada.");};

  els.scanType.onchange=renderScanHint;
  if(els.uploadMode) els.uploadMode.onchange=renderScanHint;
  els.attachmentViewMode.onchange=renderAttachments;
  els.fileInput.onchange=async e=>{
    await handleFiles(e.target.files);
    e.target.value="";
  };
  if(els.nestedAttachmentFileInput) els.nestedAttachmentFileInput.onchange=async e=>{
    await addFilesToSpecificAttachment(e.target.files,state.pendingAttachmentTarget);
    state.pendingAttachmentTarget=null;
    e.target.value="";
  };
  if(els.cameraInput) els.cameraInput.onchange=async e=>{
    await handleFiles(e.target.files);
    e.target.value="";
  };

  const openUploadSource=()=>{
    if(!els.uploadSourceModal)return;
    els.uploadSourceModal.hidden=false;
    els.uploadSourceModal.setAttribute("aria-hidden","false");
    requestAnimationFrame(()=>els.uploadSourceModal.classList.add("visible"));
  };
  const closeUploadSource=()=>{
    if(!els.uploadSourceModal)return;
    els.uploadSourceModal.classList.remove("visible");
    els.uploadSourceModal.setAttribute("aria-hidden","true");
    setTimeout(()=>{els.uploadSourceModal.hidden=true;},140);
  };
  els.dropzone.addEventListener("click",openUploadSource);
  els.dropzone.addEventListener("keydown",e=>{
    if(e.key==="Enter"||e.key===" "){e.preventDefault();openUploadSource();}
  });
  if(els.chooseFilesBtn)els.chooseFilesBtn.onclick=()=>{closeUploadSource();els.fileInput.click();};
  if(els.takePhotoBtn)els.takePhotoBtn.onclick=()=>{closeUploadSource();els.cameraInput.click();};
  if(els.closeUploadSourceBtn)els.closeUploadSourceBtn.onclick=closeUploadSource;
  if(els.uploadSourceModal)els.uploadSourceModal.onclick=e=>{if(e.target===els.uploadSourceModal)closeUploadSource();};

  ["dragenter","dragover"].forEach(evt=>els.dropzone.addEventListener(evt,e=>{e.preventDefault();els.dropzone.classList.add("dragover")}));
  ["dragleave","drop"].forEach(evt=>els.dropzone.addEventListener(evt,e=>{e.preventDefault();els.dropzone.classList.remove("dragover")}));
  els.dropzone.addEventListener("drop",e=>handleFiles(e.dataTransfer.files));
  els.removeAttachmentBtn.onclick=()=>{const d=currentDoc(),a=currentAttachment();if(!d||!a)return;d.attachments=d.attachments.filter(x=>x.id!==a.id);state.activeAttachmentId=d.attachments[0]?.id||null;state.activePageId=d.attachments[0]?.pages[0]?.id||null;render();};
  els.mergeSmallDocsBtn.onclick=mergeFirstTwoToA4;
  if(els.attachmentSortSelect) els.attachmentSortSelect.onchange=e=>{ if(e.target.value){ sortAttachments(e.target.value); e.target.value=""; } };
  if(els.sortImportanceBtn) els.sortImportanceBtn.onclick=()=>sortAttachments("importance");
  if(els.sortAlphaBtn) els.sortAlphaBtn.onclick=()=>sortAttachments("alpha");
  if(els.sortTypeBtn) els.sortTypeBtn.onclick=()=>sortAttachments("type");
  if(els.sortDateBtn) els.sortDateBtn.onclick=()=>sortAttachments("date");
  els.editDocSelect.onchange=e=>selectDoc(e.target.value);
  els.editAttachmentSelect.onchange=e=>selectAttachment(e.target.value);
  els.removePageBtn.onclick=removePage;
  els.movePageUpBtn.onclick=()=>movePage(-1);
  els.movePageDownBtn.onclick=()=>movePage(1);
  if(els.composeSelectedPagesBtn)els.composeSelectedPagesBtn.onclick=composeSelectedPages;
  if(els.clearPageSelectionBtn)els.clearPageSelectionBtn.onclick=clearPageSelection;
  if(els.clearCompositionsBtn)els.clearCompositionsBtn.onclick=clearCompositions;
  [els.brightness,els.contrast,els.saturation,els.grayscale,els.threshold,els.perspectiveEnabled].forEach(el=>el&& (el.oninput=()=>{saveControls();const p=currentPage();if(p)p.thumbCache=null;schedulePreviewRender();}));
  [els.brightness,els.contrast,els.saturation,els.grayscale,els.threshold].forEach(el=>el&& (el.onchange=()=>renderPageFilmstrip()));
  [els.edgeTop,els.edgeRight,els.edgeBottom,els.edgeLeft].forEach(el=>el&& (el.oninput=()=>{setCornersFromEdges();}));
  [els.paperSize,els.orientation,els.paperMargin,els.paperMarginY,els.autoRotateFit].forEach(el=>{if(!el)return;el.oninput=applyPaperControlsFromUI;el.onchange=applyPaperControlsFromUI;});
  if(els.showCorrectedPreview)els.showCorrectedPreview.onchange=schedulePreviewRender;
  els.scannerPresetBtn.onclick=()=>{Object.assign(currentPage().adjust,{brightness:112,contrast:150,saturation:0,grayscale:100,threshold:0}); currentPage().thumbCache=null; render();};
  els.cleanPresetBtn.onclick=()=>{Object.assign(currentPage().adjust,{brightness:106,contrast:125,saturation:108,grayscale:0,threshold:0}); currentPage().thumbCache=null; render();};
  els.resetFilterBtn.onclick=()=>{Object.assign(currentPage().adjust,{brightness:100,contrast:100,saturation:100,grayscale:0,threshold:0}); currentPage().thumbCache=null; render();};
  els.autoCornersBtn.onclick=autoCorners;
  document.querySelectorAll(".quality-option").forEach(btn=>btn.onclick=()=>{state.pdfQuality=btn.dataset.quality||"standard";updateQualityUi();if(document.getElementById("step3")?.classList.contains("active"))previewPdf().catch(()=>{});});
  els.resetCornersBtn.onclick=()=>{const p=currentPage();if(p){p.adjust.corners=defaultAdjust().corners;render();}};
  els.rotateLeftBtn.onclick=()=>{const p=currentPage();if(p){p.adjust.rotation=(p.adjust.rotation-90)%360;p.thumbCache=null;render();}};
  els.rotateRightBtn.onclick=()=>{const p=currentPage();if(p){p.adjust.rotation=(p.adjust.rotation+90)%360;p.thumbCache=null;render();}};
  els.applyToAttachmentBtn.onclick=()=>applyAdjust("attachment");
  els.applyToDocBtn.onclick=()=>applyAdjust("doc");
  els.applyToAllBtn.onclick=()=>applyAdjust("all");
  els.ocrPageBtn.onclick=async()=>{await runOcr(currentPage());render();};
  els.ocrAttachmentBtn.onclick=async()=>{for(const p of currentAttachment()?.pages||[])await runOcr(p);render();};
  els.ocrAllBtn.onclick=async()=>{for(const d of state.docs)for(const a of d.attachments)for(const p of a.pages)await runOcr(p);render();};
  if (els.previewPdfBtn && els.previewPdfBtn.tagName === "BUTTON") els.previewPdfBtn.onclick=()=>previewPdf().catch(e=>setStatus("Erro ao pré-visualizar: "+e.message));
  els.downloadPdfBtn.onclick=()=>downloadDirect().catch(e=>setStatus("Erro ao baixar: "+e.message));
  [els.exportMode, els.outputName].forEach(el => el && el.addEventListener("change", () => { if ($("step3").classList.contains("active")) previewPdf().catch(e=>setStatus("Erro ao pré-visualizar: "+e.message)); }));
  els.downloadPreviewBtn.onclick=()=>{if(state.lastBlobUrl)downloadBlobUrl(state.lastBlobUrl,outputNameForDocs(state.docs));};
  els.newProjectBtn.onclick=()=>openNewProjectConfirm();
  if(els.aboutBtn)els.aboutBtn.onclick=()=>openAbout();
  if(els.closeAboutBtn)els.closeAboutBtn.onclick=closeAbout;
  if(els.aboutModal)els.aboutModal.onclick=e=>{if(e.target===els.aboutModal)closeAbout();};
  if(els.copyPixBtn)els.copyPixBtn.onclick=async()=>{
    const key="moisesdovalesouza@gmail.com";
    try{
      await navigator.clipboard.writeText(key);
      setStatus("Chave Pix copiada.");
    }catch(_){
      const ta=document.createElement("textarea");
      ta.value=key;ta.style.position="fixed";ta.style.opacity="0";
      document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();
      setStatus("Chave Pix copiada.");
    }
  };
  els.overlay.querySelectorAll(".drag").forEach(h=>h.onpointerdown=e=>{e.preventDefault();h.setPointerCapture(e.pointerId);state.drag=h.dataset.handle;});
  window.onpointermove=e=>{
    if(!state.drag)return;
    const r=els.previewCanvas.getBoundingClientRect();
    const x=clamp((e.clientX-r.left)/r.width*100,0,100), y=clamp((e.clientY-r.top)/r.height*100,0,100);
    setHandle(state.drag,x,y);
    showPrecisionLoupe(e.clientX,e.clientY,x,y);
  };
  window.onpointerup=()=>{if(state.drag){state.drag=null;hidePrecisionLoupe();renderPreview();renderPageFilmstrip();}};
  document.addEventListener("click",e=>{
    const tip=e.target.closest?.(".info-tip");
    document.querySelectorAll(".info-tip.open").forEach(el=>{if(el!==tip)el.classList.remove("open");});
    if(tip){e.preventDefault();e.stopPropagation();tip.classList.toggle("open");}
  });
  setupPwa();
  // Efeito de luz interativo desativado para reduzir uso de CPU/GPU.
}

function movePage(delta){
  const att=currentAttachment(), p=currentPage(); if(!att||!p)return;
  const i=att.pages.findIndex(x=>x.id===p.id), j=i+delta;
  if(j<0||j>=att.pages.length)return;
  [att.pages[i],att.pages[j]]=[att.pages[j],att.pages[i]];
  render();
}


function openAbout(){if(!els.aboutModal)return;els.aboutModal.hidden=false;els.aboutModal.setAttribute("aria-hidden","false");requestAnimationFrame(()=>els.aboutModal.classList.add("visible"));}
function closeAbout(){if(!els.aboutModal)return;els.aboutModal.classList.remove("visible");els.aboutModal.setAttribute("aria-hidden","true");setTimeout(()=>{els.aboutModal.hidden=true;},160);}

function openNewProjectConfirm(){
  const modal = document.getElementById("confirmModal");
  if(!modal) return resetProject();
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => modal.classList.add("visible"));
  const cancel = document.getElementById("cancelNewProjectBtn");
  const confirm = document.getElementById("confirmNewProjectBtn");
  if(cancel) cancel.onclick = closeNewProjectConfirm;
  if(confirm) confirm.onclick = () => { closeNewProjectConfirm(); resetProject(); };
  modal.onclick = (event) => { if(event.target === modal) closeNewProjectConfirm(); };
  document.addEventListener("keydown", closeConfirmOnEsc);
}

function closeConfirmOnEsc(event){
  if(event.key === "Escape") closeNewProjectConfirm();
}

function closeNewProjectConfirm(){
  const modal = document.getElementById("confirmModal");
  if(!modal) return;
  modal.classList.remove("visible");
  modal.setAttribute("aria-hidden", "true");
  setTimeout(() => { modal.hidden = true; }, 180);
  document.removeEventListener("keydown", closeConfirmOnEsc);
}

function resetProject(){
  if(state.lastBlobUrl)URL.revokeObjectURL(state.lastBlobUrl);
  state.docs=[];state.activeDocId=null;state.activeAttachmentId=null;state.activePageId=null;state.activeExportDocId=null;state.lastBlobUrl=null;state.bgCache={};state.customBackgrounds={cover:null,letterhead:null};state.pendingAttachmentTarget=null;state.fontBytes={montserratRegular:null,montserratBold:null,libreRegular:null};state.pdfQuality="standard";if(state.ocrWorker){try{state.ocrWorker.terminate();}catch(_){ }state.ocrWorker=null;state.ocrWorkerLang=null;}
  const set=(el,val,prop="value")=>{if(el)el[prop]=val;}; set(els.includeCover,false,"checked");set(els.includeLetterhead,false,"checked");set(els.globalTemplate,"none");set(els.scanType,"standard");set(els.uploadMode,"new-attachment");set(els.facesPerSheet,"2");set(els.paperScope,"page");set(els.paperSize,"a4");set(els.orientation,"portrait");set(els.paperMargin,10);set(els.paperMarginY,10);set(els.autoRotateFit,false,"checked");set(els.brightness,100);set(els.contrast,100);set(els.saturation,100);set(els.grayscale,0);set(els.threshold,0);set(els.perspectiveEnabled,false,"checked");set(els.showCorrectedPreview,false,"checked");set(els.includeHeader,true,"checked");set(els.includePageNumbers,true,"checked");set(els.includeFooterInfo,true,"checked");set(els.embedOcrText,true,"checked");set(els.ocrLang,"por");set(els.exportMode,"single");set(els.outputName,"");const fontPreset=$("fontPresetSelect");if(fontPreset)fontPreset.value="montserrat";
  [els.customCoverFile,els.customLetterheadFile,els.fontMontserratRegular,els.fontMontserratBold,els.fontLibreRegular].forEach(el=>{if(el)el.value="";});if(els.customCoverName)els.customCoverName.textContent="Nenhuma capa própria.";if(els.customLetterheadName)els.customLetterheadName.textContent="Nenhum timbrado próprio.";
  if(els.pdfFrame){els.pdfFrame.removeAttribute("src");els.pdfFrame.style.display="none";}if(els.openPreviewLink){els.openPreviewLink.hidden=true;els.openPreviewLink.removeAttribute("href");}if(els.previewEmpty)els.previewEmpty.style.display="block";if(els.downloadPreviewBtn)els.downloadPreviewBtn.disabled=true;
  addDoc();goStep(1);setStatus("Novo projeto iniciado com todas as configurações do documento restauradas.");
}
function goStep(n){
  document.querySelectorAll(".step-panel").forEach(p=>p.classList.remove("active"));
  $("step"+n).classList.add("active");
  document.querySelectorAll(".step").forEach(s=>s.classList.toggle("active",+s.dataset.step===n));
  render();
  if(n===3){
    const hasAttachments=state.docs.some(d=>d.attachments.length);
    if(!hasAttachments){
      if(els.pdfFrame){els.pdfFrame.removeAttribute("src");els.pdfFrame.style.display="none";}
      if(els.previewEmpty){els.previewEmpty.style.display="grid";els.previewEmpty.textContent="Adicione documentos para gerar a pré-visualização.";}
      if(els.downloadPreviewBtn)els.downloadPreviewBtn.disabled=true;
      if(els.openPreviewLink)els.openPreviewLink.hidden=true;
    }else{
      setTimeout(()=>previewPdf().catch(e=>setStatus("Erro ao pré-visualizar: "+e.message)),260);
    }
  }
}

async function setupPwa(){
  const isStandalone=()=>window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone===true;
  const ua=navigator.userAgent||"";
  const isIOS=/iPad|iPhone|iPod/.test(ua) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
  const isAndroid=/Android/i.test(ua);
  const isSafari=isIOS && /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
  let deferredPrompt=null;

  if("serviceWorker" in navigator){
    try{
      const registration=await navigator.serviceWorker.register("./sw.js?v=37",{scope:"./"});
      await navigator.serviceWorker.ready;
      registration.update?.().catch(()=>{});
    }catch(err){
      console.warn("Service Worker não registrado:",err);
    }
  }

  const closeInstall=()=>{
    if(!els.installModal)return;
    els.installModal.classList.remove("visible");
    els.installModal.setAttribute("aria-hidden","true");
    setTimeout(()=>{els.installModal.hidden=true;},120);
  };

  const installText=()=>{
    if(isStandalone())return `<div class="install-state installed"><strong>Aplicativo instalado</strong><p>O MVS Editor de PDF já está sendo executado como aplicativo neste dispositivo.</p></div>`;
    if(isIOS){
      if(isSafari){
        return `<div class="install-steps">
          <p><strong>No iPhone ou iPad:</strong></p>
          <ol>
            <li>Toque no botão <strong>Compartilhar</strong> do Safari.</li>
            <li>Role o menu e escolha <strong>Adicionar à Tela de Início</strong>.</li>
            <li>Confirme em <strong>Adicionar</strong>.</li>
          </ol>
          <p class="hint">O iOS não exibe a janela automática de instalação usada pelo Android.</p>
        </div>`;
      }
      return `<div class="install-steps"><p>Para instalar no iPhone/iPad, abra esta página no <strong>Safari</strong> e use <strong>Compartilhar → Adicionar à Tela de Início</strong>.</p></div>`;
    }
    if(isAndroid){
      return `<div class="install-steps"><p><strong>No Android:</strong> use <strong>Instalar agora</strong>. Se o navegador não liberar o botão, abra o menu ⋮ do Chrome e escolha <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.</p></div>`;
    }
    return `<div class="install-steps"><p>Use <strong>Instalar agora</strong> quando disponível. No Chrome/Edge, a opção também pode aparecer no menu do navegador como <strong>Instalar aplicativo</strong>.</p></div>`;
  };

  const refreshInstallUi=()=>{
    if(!els.installBtn)return;
    const standalone=isStandalone();
    els.installBtn.hidden=standalone;
    els.installBtn.textContent=standalone?"Instalado":"Instalar app";
    if(els.installNativeBtn){
      els.installNativeBtn.hidden=!deferredPrompt || standalone;
      els.installNativeBtn.disabled=!deferredPrompt || standalone;
    }
    if(els.installInstructions)els.installInstructions.innerHTML=installText();
  };

  const openInstall=()=>{
    refreshInstallUi();
    if(!els.installModal)return;
    els.installModal.hidden=false;
    els.installModal.setAttribute("aria-hidden","false");
    requestAnimationFrame(()=>els.installModal.classList.add("visible"));
  };

  window.addEventListener("beforeinstallprompt",event=>{
    event.preventDefault();
    deferredPrompt=event;
    refreshInstallUi();
  });

  window.addEventListener("appinstalled",()=>{
    deferredPrompt=null;
    refreshInstallUi();
    setStatus("Aplicativo instalado.");
    closeInstall();
  });

  if(els.installBtn)els.installBtn.onclick=openInstall;
  if(els.closeInstallBtn)els.closeInstallBtn.onclick=closeInstall;
  if(els.installModal)els.installModal.onclick=event=>{if(event.target===els.installModal)closeInstall();};
  if(els.installNativeBtn)els.installNativeBtn.onclick=async()=>{
    if(!deferredPrompt){refreshInstallUi();return;}
    try{
      await deferredPrompt.prompt();
      const choice=await deferredPrompt.userChoice;
      if(choice?.outcome==="accepted")setStatus("Instalação iniciada.");
    }catch(err){
      console.warn("Falha no prompt de instalação:",err);
    }finally{
      deferredPrompt=null;
      refreshInstallUi();
    }
  };

  refreshInstallUi();
}

bind();
addDoc();


function setupInteractiveLight(){ /* desativado por desempenho */ }


