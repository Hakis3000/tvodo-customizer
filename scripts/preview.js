function zone(){const p=products[state.product];return p.positions[state.position] || p.positions.center}
function currentText(){return $('#textInput').value.trim() || 'Vasa vysivka'}
function previewElement(selector){return document.querySelector('.preview-window ' + selector)}
function splitLines(text,maxChars,maxLines){const words=text.split(/\s+/).filter(Boolean);const lines=[];let line='';words.forEach(word=>{if(word.length>maxChars){if(line){lines.push(line);line=''}for(let i=0;i<word.length;i+=maxChars)lines.push(word.slice(i,i+maxChars));return}const test=(line+' '+word).trim();if(test.length>maxChars && line){lines.push(line);line=word}else line=test});if(line)lines.push(line);return lines.slice(0,maxLines)}
function renderPreview(){
const z=zone();const centerX=z.x+z.w/2;const centerY=z.y+z.h/2;const clipRect=previewElement('#clipRect');clipRect.setAttribute('x',z.x);clipRect.setAttribute('y',z.y);clipRect.setAttribute('width',z.w);clipRect.setAttribute('height',z.h);
const product=previewElement('#productImage');product.setAttribute('href',products[state.product].image);product.style.filter=state.shirt==='Cierne'?'brightness(.16) contrast(1.08) saturate(.7) drop-shadow(0 22px 30px rgba(0,0,0,.18))':'drop-shadow(0 22px 30px rgba(0,0,0,.1))';
const sym=previewElement('#symbolText');sym.textContent=state.symbol?state.symbolGlyph:'';sym.setAttribute('x',centerX);sym.setAttribute('y',z.y+32);sym.style.fill=state.thread;sym.style.fontSize='30px';
const textEl=previewElement('#embroideryText');textEl.innerHTML='';const hasSymbol=!!state.symbol;const maxChars=state.font==='Pisany'?9:11;const lines=splitLines(currentText(),maxChars,hasSymbol?2:3);const cfg=fontMap[state.font];const longest=lines.reduce((m,l)=>Math.max(m,l.length),1);const size=Math.floor(Math.max(16,Math.min(hasSymbol?25:30,(z.w*.68)/(longest*cfg.factor),(z.h*(hasSymbol?.48:.68))/lines.length)));textEl.style.fontFamily=cfg.family;textEl.style.fontWeight=cfg.weight;textEl.style.fontStyle=cfg.style;textEl.style.fill=state.thread;textEl.style.fontSize=size+'px';
const lineHeight=Math.round(size*1.08);const offset=hasSymbol?Math.round(z.h*.12):0;const total=(lines.length-1)*lineHeight;lines.forEach((line,i)=>{const t=document.createElementNS('http://www.w3.org/2000/svg','tspan');t.setAttribute('x',centerX);t.setAttribute('y',centerY+offset-total/2+i*lineHeight);t.textContent=line;textEl.appendChild(t)});
}
function syncControls(){
$$('.product-btn').forEach(b=>b.classList.toggle('active',b.dataset.product===state.product));
$$('.position-btn').forEach(b=>{const allowed=!!products[state.product].positions[b.dataset.position];b.hidden=!allowed;b.disabled=!allowed;b.classList.toggle('active',b.dataset.position===state.position)});
if(!products[state.product].positions[state.position])state.position='center';
$$('.shirt-color-btn').forEach(b=>{const allowed=products[state.product].colors.includes(b.dataset.shirt);b.hidden=!allowed;b.disabled=!allowed;b.classList.toggle('active',b.dataset.shirt===state.shirt)});
if(!products[state.product].colors.includes(state.shirt))state.shirt='Biele';
if(!products[state.product].sizes.includes(state.size))state.size=products[state.product].sizes[0];
const sizes=$('#sizeButtons');
sizes.innerHTML=products[state.product].sizes.map(size=>'<button class="control-btn size-btn'+(size===state.size?' active':'')+'" data-size="'+escapeHtml(size)+'" type="button">'+escapeHtml(size)+'</button>').join('');
$$('.size-btn').forEach(b=>b.addEventListener('click',()=>{state.size=b.dataset.size;syncControls();updateSummary()}));
$$('.font-btn').forEach(b=>b.classList.toggle('active',b.dataset.font===state.font));$$('.swatch').forEach(b=>b.classList.toggle('active',b.dataset.color===state.thread));$$('.symbol-btn').forEach(b=>b.classList.toggle('active',b.dataset.symbol===state.symbol));
renderPreview();updateSummary();
}
function updateSummary(){
const price=$('#priceText');if(price)price.textContent='od '+money(products[state.product].price);
const count=$('#charCount');if(count)count.textContent=$('#textInput').value.length+'/34';
updateCheckoutProgress();
}
function updateCheckoutProgress(){
const items=cart.reduce((sum,item)=>sum+item.price,0);const previewTotal=items>0?items:products[state.product].price;const progress=Math.min(100,Math.round((previewTotal/FREE_SHIPPING_LIMIT)*100));const missing=Math.max(0,FREE_SHIPPING_LIMIT-previewTotal);
const value=$('#checkoutProgressValue');const bar=$('#checkoutProgressBar');const note=$('#checkoutProgressNote');
if(value)value.textContent=money(previewTotal)+' / '+money(FREE_SHIPPING_LIMIT);
if(bar)bar.style.width=progress+'%';
if(note){note.textContent=missing>0?'Do dopravy zdarma chyba '+money(missing)+'.':'Doprava zdarma je aktivna.';note.classList.toggle('done',missing===0)}
const topValue=$('#topShippingValue');const topBar=$('#topShippingBar');
if(topValue)topValue.textContent=money(previewTotal)+' / '+money(FREE_SHIPPING_LIMIT);
if(topBar)topBar.style.width=progress+'%';
}
