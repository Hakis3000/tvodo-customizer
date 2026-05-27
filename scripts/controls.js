function resetDesign(){state={product:'Tricko',position:'center',symbol:'',symbolGlyph:'',thread:'#ff7cc6',shirt:'Biele',size:'S',font:'Zakladny'};$('#textInput').value='';syncControls()}
$$('.product-btn').forEach(b=>b.addEventListener('click',()=>{state.product=b.dataset.product;state.position='center';state.shirt='Biele';state.size=products[state.product].sizes[0];syncControls()}));
$$('.position-btn').forEach(b=>b.addEventListener('click',()=>{state.position=b.dataset.position;syncControls()}));
$$('.shirt-color-btn').forEach(b=>b.addEventListener('click',()=>{state.shirt=b.dataset.shirt;syncControls()}));
$$('.font-btn').forEach(b=>b.addEventListener('click',()=>{state.font=b.dataset.font;syncControls()}));
$$('.swatch').forEach(b=>b.addEventListener('click',()=>{state.thread=b.dataset.color;syncControls()}));
$$('.symbol-btn').forEach(b=>b.addEventListener('click',()=>{state.symbol=b.dataset.symbol;state.symbolGlyph=b.dataset.glyph || '';syncControls()}));
$$('.pill-btn[data-text]').forEach(b=>b.addEventListener('click',()=>{$('#textInput').value=b.dataset.text;syncControls()}));
$('#textInput').addEventListener('input',syncControls);
$('#randomButton').addEventListener('click',()=>{$('#textInput').value=randomTexts[Math.floor(Math.random()*randomTexts.length)];state.thread=['#ff7cc6','#5c86ff','#55b96d','#f4c542','black'][Math.floor(Math.random()*5)];state.font=['Zakladny','Hravy','Pisany'][Math.floor(Math.random()*3)];syncControls()});
$('#cartToggle').addEventListener('click',event=>{event.stopPropagation();const d=$('#cartDrawer');d.classList.toggle('active');$('#cartToggle').setAttribute('aria-expanded',d.classList.contains('active'))});
$('#cartDrawer').addEventListener('click',event=>event.stopPropagation());
document.addEventListener('click',event=>{
if($('#cartDrawer').classList.contains('active') && !event.target.closest('#cartDrawer') && !event.target.closest('#cartToggle')){
closeCartDrawer();
}
});
$('#closeCart').addEventListener('click',closeCartDrawer);
function animateAddToCart(){
const source=document.querySelector('.preview-window');const target=$('#cartToggle');const svg=previewElement('#previewSvg');
if(!source || !target || !svg)return;
const from=source.getBoundingClientRect();const to=target.getBoundingClientRect();const ghost=document.createElement('div');
const size=Math.min(190,Math.max(120,from.width*.26));ghost.className='cart-flyout';ghost.style.left=from.left+from.width/2-size/2+'px';ghost.style.top=from.top+from.height/2-size/2+'px';ghost.style.width=size+'px';ghost.style.height=size+'px';ghost.innerHTML=new XMLSerializer().serializeToString(svg.cloneNode(true));
document.body.appendChild(ghost);
const startLeft=from.left+from.width/2-size/2;const startTop=from.top+from.height/2-size/2;const endLeft=to.left+to.width/2-size/2;const endTop=to.top+to.height/2-size/2;
requestAnimationFrame(()=>{ghost.style.transform='translate('+(endLeft-startLeft)+'px,'+(endTop-startTop)+'px) scale(.22)';ghost.style.opacity='0'});
setTimeout(()=>ghost.remove(),680);
}
$('#addToCart').addEventListener('click',()=>{animateAddToCart();addCurrentToCart()});$('#checkout').addEventListener('click',openOrder);$('#resetButton').addEventListener('click',resetDesign);$('#closeOrder').addEventListener('click',()=>$('#orderModal').hidden=true);
function openInfoModal(selected){
$('#infoModal').hidden=false;
$$('.info-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===selected));
$$('.info-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===selected));
const activePanel=document.querySelector('.info-panel.active h3');
if(activePanel)$('#infoModalTitle').textContent=activePanel.textContent;
}
function closeInfoModal(){
$('#infoModal').hidden=true;
}
$$('.info-tab').forEach(tab=>tab.addEventListener('click',()=>openInfoModal(tab.dataset.tab)));
$('#closeInfoModal').addEventListener('click',closeInfoModal);
$('#infoModal').addEventListener('click',event=>{if(event.target.id==='infoModal')closeInfoModal()});
$('#orderForm').addEventListener('submit',event=>{event.preventDefault();if(orderSubmitted){showStatus('Objednavka uz bola odoslana');return}updateOrderForm();const form=event.currentTarget;const submitButton=form.querySelector('button[type="submit"]');if($('#websiteField').value.trim())return;if(Date.now()-pageStartedAt<2500){alert('Skuste objednavku odoslat este raz o par sekund.');return}if(!form.checkValidity()){form.reportValidity();return}if(submitButton)submitButton.disabled=true;const data=new FormData(form);if(APP_SCRIPT_ENDPOINT){fetch(APP_SCRIPT_ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(buildAppScriptPayload(data))}).catch(()=>{});}else{nativeSubmit(buildPayload(data));}showPayment();showStatus('Objednavka bola odoslana')});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){$('#orderModal').hidden=true;closeCartDrawer();closeInfoModal()}});
