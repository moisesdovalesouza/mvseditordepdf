// MVS Editor de PDF
// Versão reduzida de segurança para inicialização do projeto no GitHub.
// O pacote completo permanece disponível no ZIP v14 gerado na conversa.

(function () {
  const status = document.getElementById('status');
  const steps = [...document.querySelectorAll('.step')];
  const panels = [...document.querySelectorAll('.step-panel')];
  const fileInput = document.getElementById('fileInput');
  const attachmentList = document.getElementById('attachmentList');
  const docTabs = document.getElementById('docTabs');
  const exportDocList = document.getElementById('exportDocList');
  const exportThumbs = document.getElementById('exportThumbs');
  const previewEmpty = document.getElementById('previewEmpty');
  const pdfFrame = document.getElementById('pdfFrame');
  const confirmModal = document.getElementById('confirmModal');

  const state = {
    step: 1,
    docs: [{ number: 'Doc. 01', title: '', classification: 'Documentos de instrução', attachments: [] }],
    activeDoc: 0,
  };

  const showStatus = (message) => {
    if (!status) return;
    status.textContent = message;
    status.classList.add('show');
    clearTimeout(showStatus.timer);
    showStatus.timer = setTimeout(() => status.classList.remove('show'), 2400);
  };

  const setStep = (step) => {
    state.step = step;
    steps.forEach((btn) => btn.classList.toggle('active', Number(btn.dataset.step) === step));
    panels.forEach((panel) => panel.classList.toggle('active', panel.id === `step${step}`));
    if (step === 3) renderExportPreview();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderDocs = () => {
    if (!docTabs) return;
    docTabs.innerHTML = '';
    state.docs.forEach((doc, index) => {
      const btn = document.createElement('button');
      btn.className = `doc-tab ${index === state.activeDoc ? 'active' : ''}`;
      btn.type = 'button';
      btn.innerHTML = `<strong>${doc.number || `Doc. ${String(index + 1).padStart(2, '0')}`}</strong><small>${doc.title || doc.classification || 'Sem título'}</small>`;
      btn.addEventListener('click', () => { state.activeDoc = index; renderDocs(); renderAttachments(); syncDocFields(); });
      docTabs.appendChild(btn);
    });
  };

  const syncDocFields = () => {
    const doc = state.docs[state.activeDoc];
    const number = document.getElementById('docNumber');
    const title = document.getElementById('docTitle');
    const cls = document.getElementById('docClassification');
    if (number) number.value = doc.number || '';
    if (title) title.value = doc.title || '';
    if (cls) cls.value = doc.classification || 'Documentos de instrução';
  };

  const renderAttachments = () => {
    if (!attachmentList) return;
    const doc = state.docs[state.activeDoc];
    attachmentList.innerHTML = '';
    if (!doc.attachments.length) {
      const empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = 'Nenhum arquivo anexado neste Doc.';
      attachmentList.appendChild(empty);
      return;
    }
    doc.attachments.forEach((att, index) => {
      const card = document.createElement('article');
      card.className = 'attachment-card';
      card.draggable = true;
      card.innerHTML = `<div class="attachment-preview"><canvas width="90" height="116"></canvas></div><div class="fields"><strong>${att.title || att.name}</strong><small>${att.type || 'arquivo'} · ${(att.size / 1024).toFixed(1)} KB</small></div><div class="checks"><label class="checkline"><input type="checkbox" ${att.cover !== false ? 'checked' : ''}> Listar na capa</label><button class="small danger" type="button">Remover</button></div>`;
      const remove = card.querySelector('button');
      remove.addEventListener('click', () => { doc.attachments.splice(index, 1); renderAttachments(); showStatus('Anexo removido.'); });
      const canvas = card.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0,0,90,116);
      ctx.fillStyle = '#d9ddeb'; ctx.fillRect(12,16,66,10); ctx.fillRect(12,34,54,8); ctx.fillRect(12,50,62,8);
      ctx.fillStyle = '#ef5a4d'; ctx.fillRect(12,88,38,10);
      card.addEventListener('dragstart', (event) => event.dataTransfer.setData('text/plain', String(index)));
      card.addEventListener('dragover', (event) => event.preventDefault());
      card.addEventListener('drop', (event) => {
        event.preventDefault();
        const from = Number(event.dataTransfer.getData('text/plain'));
        const item = doc.attachments.splice(from, 1)[0];
        doc.attachments.splice(index, 0, item);
        renderAttachments();
      });
      attachmentList.appendChild(card);
    });
  };

  const renderExportPreview = () => {
    if (exportDocList) {
      exportDocList.innerHTML = '';
      state.docs.forEach((doc) => {
        const item = document.createElement('div');
        item.className = 'doc-tab';
        item.innerHTML = `<strong>${doc.number}</strong><small>${doc.title || doc.classification} · ${doc.attachments.length} anexo(s)</small>`;
        exportDocList.appendChild(item);
      });
    }
    if (exportThumbs) {
      exportThumbs.innerHTML = '';
      state.docs.flatMap(d => d.attachments).slice(0, 8).forEach((att) => {
        const card = document.createElement('div');
        card.className = 'thumb-card';
        card.innerHTML = `<canvas width="76" height="100"></canvas><small>${att.name}</small>`;
        const ctx = card.querySelector('canvas').getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0,0,76,100);
        ctx.fillStyle = '#d9ddeb'; ctx.fillRect(10,16,56,8); ctx.fillRect(10,32,48,7); ctx.fillRect(10,46,52,7);
        exportThumbs.appendChild(card);
      });
    }
    if (previewEmpty) previewEmpty.textContent = 'Pré-visualização simplificada. Para exportação completa, use o ZIP local v14.';
    if (pdfFrame) pdfFrame.hidden = true;
  };

  const resetProject = () => {
    state.docs = [{ number: 'Doc. 01', title: '', classification: 'Documentos de instrução', attachments: [] }];
    state.activeDoc = 0;
    if (fileInput) fileInput.value = '';
    renderDocs(); renderAttachments(); syncDocFields(); setStep(1);
    showStatus('Novo projeto iniciado.');
  };

  document.querySelectorAll('[data-next]').forEach((btn) => btn.addEventListener('click', () => setStep(Number(btn.dataset.next))));
  document.querySelectorAll('[data-prev]').forEach((btn) => btn.addEventListener('click', () => setStep(Number(btn.dataset.prev))));
  steps.forEach((btn) => btn.addEventListener('click', () => setStep(Number(btn.dataset.step))));

  document.getElementById('addDocBtn')?.addEventListener('click', () => {
    const n = state.docs.length + 1;
    state.docs.push({ number: `Doc. ${String(n).padStart(2, '0')}`, title: '', classification: 'Documentos de instrução', attachments: [] });
    state.activeDoc = state.docs.length - 1;
    renderDocs(); renderAttachments(); syncDocFields();
    showStatus('Novo Doc criado.');
  });

  document.getElementById('renumberDocsBtn')?.addEventListener('click', () => {
    state.docs.forEach((doc, i) => doc.number = `Doc. ${String(i + 1).padStart(2, '0')}`);
    renderDocs(); syncDocFields(); showStatus('Docs renumerados.');
  });

  document.getElementById('docNumber')?.addEventListener('input', (e) => { state.docs[state.activeDoc].number = e.target.value; renderDocs(); });
  document.getElementById('docTitle')?.addEventListener('input', (e) => { state.docs[state.activeDoc].title = e.target.value; renderDocs(); });
  document.getElementById('docClassification')?.addEventListener('change', (e) => { state.docs[state.activeDoc].classification = e.target.value; renderDocs(); });

  fileInput?.addEventListener('change', (event) => {
    const files = [...event.target.files];
    const doc = state.docs[state.activeDoc];
    files.forEach((file) => doc.attachments.push({ name: file.name, size: file.size, type: file.type, title: '', cover: true }));
    renderAttachments();
    showStatus(`${files.length} arquivo(s) adicionado(s).`);
  });

  document.getElementById('downloadPdfBtn')?.addEventListener('click', () => {
    const summary = state.docs.map(d => `${d.number} - ${d.title || d.classification} - ${d.attachments.length} anexo(s)`).join('\n');
    const blob = new Blob([`MVS Editor de PDF\n\nResumo do projeto:\n${summary}\n\nEsta versão publicada no GitHub é uma prévia web. Para geração completa de PDF, use o pacote ZIP local v14.`], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mvs-editor-de-pdf-resumo.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  document.getElementById('newProjectBtn')?.addEventListener('click', () => {
    if (confirmModal) { confirmModal.hidden = false; confirmModal.setAttribute('aria-hidden', 'false'); }
  });
  document.getElementById('cancelNewProjectBtn')?.addEventListener('click', () => {
    if (confirmModal) { confirmModal.hidden = true; confirmModal.setAttribute('aria-hidden', 'true'); }
  });
  document.getElementById('confirmNewProjectBtn')?.addEventListener('click', () => {
    if (confirmModal) { confirmModal.hidden = true; confirmModal.setAttribute('aria-hidden', 'true'); }
    resetProject();
  });

  const classifications = ['Petição inicial','Petição','Contestação','Réplica','Recurso','Contrarrazões','Procuração','Substabelecimento','Documento de identificação','CPF','Comprovante de residência','Contrato','Declaração','Comprovante','Certidão','Laudo médico','Relatório médico','Exame','Receita médica','CNH','CTPS','Passaporte','Carteira profissional','Comprovante de renda','Extrato','Guia','Comprovante de pagamento','Documentos de instrução','Outros documentos'];
  const cls = document.getElementById('docClassification');
  if (cls) {
    cls.innerHTML = classifications.map((item) => `<option value="${item}">${item}</option>`).join('');
    cls.value = 'Documentos de instrução';
  }

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => null);

  renderDocs();
  renderAttachments();
  syncDocFields();
  showStatus('Aplicativo carregado.');
})();
