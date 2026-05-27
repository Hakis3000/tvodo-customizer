function currentItem(){
const price=products[state.product].price;
return {id:Date.now()+'-'+Math.random().toString(16).slice(2),product:state.product,text:currentText(),size:state.size,productColor:state.shirt,position:state.position==='center'?'Na stred':'Na prsia',threadColor:colorNames[state.thread]||state.thread,threadValue:state.thread,font:state.font,symbol:state.symbol?state.symbol.replace('.svg',''):'Bez symbolu',price:price,priceLabel:money(price),previewSvg:getPreviewSvg(),signature:[state.product,currentText(),state.size,state.shirt,state.position,state.thread,state.font,state.symbol].join('|')}
}
function getPreviewSvg(){const clone=previewElement('#previewSvg').cloneNode(true);clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.querySelectorAll('[id]').forEach((node,index)=>node.setAttribute('id','cartPreview'+Date.now()+index));return new XMLSerializer().serializeToString(clone)}
function totals(){const items=cart.reduce((s,i)=>s+i.price,0);const shipping=items>=FREE_SHIPPING_LIMIT?0:SHIPPING_PRICE;return {items,shipping,total:items+shipping}}
function bumpCart(){const button=$('#cartToggle');if(!button)return;button.classList.remove('cart-bump');void button.offsetWidth;button.classList.add('cart-bump')}
function addCurrentToCart(){const item=currentItem();const duplicate=cart.find(cartItem=>cartItem.signature===item.signature);if(duplicate){showStatus('Tento produkt uz je v kosiku');$('#cartDrawer').classList.add('active');$('#cartToggle').setAttribute('aria-expanded','true');renderCart();bumpCart();return duplicate}cart.push(item);activeOrderCode='';orderSubmitted=false;saveCart();renderCart();showStatus('Produkt je v kosiku');$('#cartDrawer').classList.add('active');$('#cartToggle').setAttribute('aria-expanded','true');bumpCart();updateSummary();return item}
function ensureCart(){if(cart.length===0)addCurrentToCart()}
function renderCart(){
$('#cartCount').textContent=cart.length;$('#cartSub').textContent=cart.length?cart.length+' produkt'+(cart.length>1?'y':'')+' v objednavke':'Kosik je prazdny';const body=$('#cartBody');
if(cart.length===0){body.innerHTML='<div class="cart-empty">Kosik je prazdny. Navrhnite si produkt a kliknite na Pridat do kosika.</div>';updateSummary();updateCheckoutProgress();return}
const t=totals();const missing=Math.max(0,FREE_SHIPPING_LIMIT-t.items);const progress=Math.min(100,Math.round((t.items/FREE_SHIPPING_LIMIT)*100));
body.innerHTML='<div class="cart-list">'+cart.map((item,index)=>'<div class="cart-row"><div class="cart-thumb">'+item.previewSvg+'</div><div><div class="cart-name">'+(index+1)+'. '+item.product+' / '+item.size+'</div><div class="cart-meta">'+escapeHtml(item.text)+'<br>'+item.threadColor+' - '+item.position+'<br>'+money(item.price)+'</div></div><button class="remove-item" data-id="'+item.id+'" type="button">x</button></div>').join('')+'</div><div class="shipping-box"><div class="shipping-line"><span>Doprava zdarma</span><span>'+money(t.items)+' / '+money(FREE_SHIPPING_LIMIT)+'</span></div><div class="shipping-progress"><span style="width:'+progress+'%"></span></div><div class="shipping-note">'+(missing>0?'Pridajte este za '+money(missing)+' a dopravu mate zdarma.':'Doprava zdarma je aktivna.')+'</div></div><div class="cart-total"><span>Spolu</span><span>'+money(t.total)+'</span></div><div class="cart-actions"><button class="primary-btn" id="cartCheckout" type="button">Dokoncit objednavku</button></div>';
$$('.remove-item').forEach(b=>b.addEventListener('click',()=>{cart=cart.filter(i=>i.id!==b.dataset.id);activeOrderCode='';orderSubmitted=false;saveCart();renderCart();updateOrderForm();updateSummary()}));$('#cartCheckout').addEventListener('click',openOrder);updateSummary();updateCheckoutProgress();
}

function closeCartDrawer(){
$('#cartDrawer').classList.remove('active');
$('#cartToggle').setAttribute('aria-expanded','false');
}
