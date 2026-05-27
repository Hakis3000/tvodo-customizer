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
$('#addToCart').addEventListener('click',addCurrentToCart);$('#checkout').addEventListener('click',openOrder);$('#resetButton').addEventListener('click',resetDesign);$('#closeOrder').addEventListener('click',()=>$('#orderModal').hidden=true);$('#printOrder').addEventListener('click',printOrder);
$$('.info-tab').forEach(tab=>tab.addEventListener('click',()=>{$$('.info-tab').forEach(b=>b.classList.toggle('active',b===tab));$$('.info-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===tab.dataset.tab))}));
$('#orderForm').addEventListener('submit',event=>{event.preventDefault();if(orderSubmitted){showStatus('Objednavka uz bola odoslana');return}updateOrderForm();const form=event.currentTarget;const submitButton=form.querySelector('button[type="submit"]');if($('#websiteField').value.trim())return;if(Date.now()-pageStartedAt<2500){alert('Skuste objednavku odoslat este raz o par sekund.');return}if(!form.checkValidity()){form.reportValidity();return}if(submitButton)submitButton.disabled=true;const data=new FormData(form);if(APP_SCRIPT_ENDPOINT){fetch(APP_SCRIPT_ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(buildAppScriptPayload(data))}).catch(()=>{});}else{nativeSubmit(buildPayload(data));}showPayment();showStatus('Objednavka bola odoslana')});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){$('#orderModal').hidden=true;closeCartDrawer()}});
