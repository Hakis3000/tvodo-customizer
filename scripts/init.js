window.addEventListener('error',event=>{
console.error(event.error || event.message);
showStatus('Chyba stranky: '+(event.message || 'neznamy problem'),'error');
});
cart = loadCart();
try{
renderCart();
syncControls();
showStatus('Stranka je pripravena');
}catch(error){
console.error(error);
showStatus('Stranku sa nepodarilo spustit: '+(error.message || 'neznamy problem'),'error');
}
