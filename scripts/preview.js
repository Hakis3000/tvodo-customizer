function zone(){const p=products[state.product];return p.positions[state.position] || p.positions.center}
function currentText(){return $('#textInput').value.trim() || 'Vasa vysivka'}
function splitLines(text,maxChars,maxLines){const words=text.split(/\s+/).filter(Boolean);const lines=[];let line='';words.forEach(word=>{if(word.length>maxChars){if(line){lines.push(line);line=''}for(let i=0;i<word.length;i+=maxChars)lines.push(word.slice(i,i+maxChars));return}const test=(line+' '+word).trim();if(test.length>maxChars && line){lines.push(line);line=word}else line=test});if(line)lines.push(line);return lines.slice(0,maxLines)}
function renderPreview(){
const z=zone();const centerX=z.x+z.w/2;const centerY=z.y+z.h/2;$('#clipRect').setAttribute('x',z.x);$('#clipRect').setAttribute('y',z.y);$('#clipRect').setAttribute('width',z.w);$('#clipRect').setAttribute('height',z.h);
$('#productImage').setAttribute('href',products[state.product].image);$('#productImage').style.filter=state.shirt==='Cierne'?'brightness(.18) drop-shadow(0 22px 30px rgba(0,0,0,.18))':'drop-shadow(0 22px 30px rgba(0,0,0,.1))';
const sym=$('#symbolText');sym.textContent=state.symbol?state.symbolGlyph:'';sym.setAttribute('x',centerX);sym.setAttribute('y',z.y+32);sym.style.fill=state.thread;sym.style.fontSize='30px';
const textEl=$('#embroideryText');textEl.innerHTML='';const hasSymbol=!!state.symbol;const maxChars=state.font==='Pisany'?9:11;const lines=splitLines(currentText(),maxChars,hasSymbol?2:3);const cfg=fontMap[state.font];const longest=lines.reduce((m,l)=>Math.max(m,l.length),1);const size=Math.floor(Math.max(16,Math.min(hasSymbol?25:30,(z.w*.68)/(longest*cfg.factor),(z.h*(hasSymbol?.48:.68))/lines.length)));textEl.style.fontFamily=cfg.family;textEl.style.fontWeight=cfg.weight;textEl.style.fontStyle=cfg.style;textEl.style.fill=state.thread;textEl.style.fontSize=size+'px';
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
const position=state.position==='center'?'stred':'prsia';$('#summaryText').textContent=state.product+' - '+position+' - '+state.size;$('#priceText').textContent='od '+money(products[state.product].price);$('#charCount').textContent=$('#textInput').value.length+'/34';
const note=$('#nextProductNote');if(cart.length>0){note.classList.add('active');note.textContent='V kosiku uz mate '+cart.length+' produkt'+(cart.length>1?'y':'')+'. Teraz tvorite '+(cart.length+1)+'. produkt.'}else note.classList.remove('active');
}
