const ORDER_ENDPOINT = 'https://docs.google.com/forms/d/e/1FAIpQLSepyUJ5aDK4GcTXfOUBUAd8xdwZflJ1cOTfmOeJvKh2hchXdw/formResponse';
const APP_SCRIPT_ENDPOINT = '';
const PAYMENT_IBAN = 'SK1009000000005154416378';
const PAYMENT_ACCOUNT_NAME = 'Compel Miroslav';
const SHIPPING_PRICE = 3.40;
const FREE_SHIPPING_LIMIT = 50;
const STORAGE_KEY = 'tvodo_cart_v2';
const ASSET_VERSION = '20260527b';
function asset(path){return path + '?v=' + ASSET_VERSION}
const GOOGLE_FIELDS = {
interneCislo:'entry.1943247834',meno:'entry.531831178',email:'entry.1398844849',telefon:'entry.2014121079',ulica:'entry.993318312',mesto:'entry.1875698237',psc:'entry.638573013',packeta:'entry.380080131',polozky:'entry.1722810673',vyrobnyFormat:'entry.320001101',pocetProduktov:'entry.830177637',produktySpolu:'entry.992906407',doprava:'entry.127799863',platba:'entry.1735533612',poplatokPlatby:'entry.736069030',sumaSpolu:'entry.2136560085',poznamka:'entry.1618273239',system:'entry.387972403'
};
const products = {
Tricko:{image:asset('shirt.svg'),price:24.90,sizes:['S','M','L','XL','2XL'],colors:['Biele','Cierne'],positions:{center:{x:403,y:321,w:193,h:182},chest:{x:535,y:297,w:193,h:182}}},
Body:{image:asset('body.svg'),price:22.90,sizes:['0-3 mes.','3-6 mes.','6-12 mes.','12-18 mes.','18-24 mes.'],colors:['Biele'],positions:{center:{x:403,y:367,w:193,h:182}}},
Bryndak:{image:asset('bib.svg'),price:18.90,sizes:['Univerzalna'],colors:['Biele'],positions:{center:{x:403,y:464,w:193,h:182}}}
};
const fontMap = {
Zakladny:{family:'Arial, Helvetica, sans-serif',weight:'800',style:'normal',factor:.68},
Hravy:{family:'Comic Sans MS, Trebuchet MS, cursive',weight:'800',style:'normal',factor:.72},
Pisany:{family:'Brush Script MT, Segoe Script, cursive',weight:'700',style:'normal',factor:.86}
};
const colorNames = {'#ff7cc6':'Ruzova','#5c86ff':'Modra','#55b96d':'Zelena','#f4c542':'Zlta',black:'Cierna',white:'Biela'};
const glyphs = {'srdce.svg':'\u2665','hviezda.svg':'\u2605','medved.svg':'\u25cf','zajac.svg':'\u2666'};
const randomTexts = ['Laska','Mamicka','Mini boss','Navzdy spolu','Maly poklad','Vitaj na svete','Mama boss','Tata boss','Mala hviezda','Nase stastie','Super tato','Naj mama','Moje slnko','Srdce rodiny','Prve Vianoce','Narodeniny'];
let state = {product:'Tricko',position:'center',symbol:'',symbolGlyph:'',thread:'#ff7cc6',shirt:'Biele',size:'S',font:'Zakladny'};
let cart = [];
let activeOrderCode = '';
let orderSubmitted = false;
let pageStartedAt = Date.now();
