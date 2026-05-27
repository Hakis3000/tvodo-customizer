const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
function money(value){return value.toFixed(2).replace('.',',')+' EUR'}
function showStatus(text,type='ready'){const el=$('#runtimeStatus');if(!el)return;el.className='runtime-status '+type;el.textContent=text;setTimeout(()=>{if(el.textContent===text)el.className='runtime-status'},2200)}
function saveCart(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(cart))}catch(e){}}
function loadCart(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]').map(item=>({...item,previewSvg:sanitizeStoredPreview(item.previewSvg || '')}))}catch(e){return []}}
function sanitizeStoredPreview(svg){return String(svg).replace(/\sid="[^"]*"/g,'')}

function escapeHtml(text){return String(text).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
