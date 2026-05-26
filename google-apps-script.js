const SHOP_EMAIL = 'tvorivy.domov@gmail.com';
const SHOP_NAME = 'TVODO';
const SHOP_FROM_ALIAS = 'tvorivy.domov@gmail.com';
const PAYMENT_IBAN = 'SK1009000000005154416378';
const PAYMENT_ACCOUNT_NAME = 'Compel Miroslav';
const SPREADSHEET_ID = 'SEM_VLOZTE_ID_GOOGLE_TABULKY';
const SHEET_NAME = 'Objednavky';

function testTvodoAliasEmail() {
  sendTvodoEmail_({
    to: SHOP_EMAIL,
    subject: 'TVODO test odosielania',
    htmlBody: '<p>Toto je test objednavkoveho e-mailu z aliasu TVODO.</p><p>Ak odosielatel vyzera ako TVODO &lt;' + SHOP_FROM_ALIAS + '&gt;, alias je nastaveny spravne.</p>',
    replyTo: SHOP_EMAIL
  });
}

function onFormSubmit(e) {
  const data = readFormSubmitPayload_(e);
  const orderCode = data.interne_cislo || data.interneCislo || createOrderCode_();
  const items = parseItems_(data.polozky_json);
  const total = data.suma_spolu || data.sumaSpolu || '';
  const qrUrl = data.qr_url || findQrUrl_(data.polozky_text || data.polozky || '');
  data.variabilny_symbol = data.variabilny_symbol || orderCode;

  sendCustomerEmail_(data, orderCode, items, total, qrUrl);
  sendShopEmail_(data, orderCode, items, total, qrUrl);
}

function doPost(e) {
  const data = readPayload_(e);
  const orderCode = data.interne_cislo || createOrderCode_();
  const items = parseItems_(data.polozky_json);
  const total = data.suma_spolu || '';
  const qrUrl = data.qr_url || '';
  data.variabilny_symbol = data.variabilny_symbol || orderCode;

  appendOrder_(data, orderCode, items);
  sendCustomerEmail_(data, orderCode, items, total, qrUrl);
  sendShopEmail_(data, orderCode, items, total, qrUrl);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, orderCode }))
    .setMimeType(ContentService.MimeType.JSON);
}

function readFormSubmitPayload_(e) {
  const named = (e && e.namedValues) || {};
  const data = {};

  Object.keys(named).forEach(function(key) {
    const normalized = normalizeKey_(key);
    data[normalized] = Array.isArray(named[key]) ? named[key][0] : named[key];
  });

  data.interne_cislo = data.interne_cislo || data.internecislo || data.interne_c_íslo || data.interne_cislo_objednavky || data['interné_číslo'];
  data.meno = data.meno || data.name;
  data.email = data.email || data.e_mail || data.mail;
  data.telefon = data.telefon || data.phone || data.telefón;
  data.ulica = data.ulica || data.adresa || data.ulica_a_cislo || data.ulica_a_číslo;
  data.mesto = data.mesto || data.city;
  data.psc = data.psc || data.psč || data.postal_code;
  data.packeta = data.packeta || data.zasielkovna || data.zásielkovňa;
  data.polozky_text = data.polozky_text || data.polozky || data.objednavka || data.objednávka;
  data.vyrobny_format = data.vyrobny_format || data.vyrobnyformat || data.výrobný_format;
  data.pocet_poloziek = data.pocet_poloziek || data.pocetproduktov || data.počet_produktov;
  data.suma_spolu = data.suma_spolu || data.sumaspolu || data.cena_spolu;
  data.poznamka = data.poznamka || data.poznámka;

  return data;
}

function readPayload_(e) {
  if (!e || !e.postData) return {};
  if (e.postData.type && e.postData.type.indexOf('application/json') !== -1) {
    return JSON.parse(e.postData.contents || '{}');
  }
  return e.parameter || {};
}

function parseItems_(value) {
  try {
    return JSON.parse(value || '[]');
  } catch (error) {
    return [];
  }
}

function findQrUrl_(text) {
  const match = String(text || '').match(/https:\/\/api\.qrserver\.com\/[^\s]+/);
  return match ? match[0] : '';
}

function normalizeKey_(key) {
  return String(key || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function appendOrder_(data, orderCode, items) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Datum',
      'Interne cislo',
      'Meno',
      'Email',
      'Telefon',
      'Adresa',
      'Packeta',
      'Pocet poloziek',
      'Suma spolu',
      'Polozky',
      'Vyrobny format',
      'Poznamka'
    ]);
  }

  const address = [data.ulica, data.mesto, data.psc].filter(Boolean).join(', ');
  sheet.appendRow([
    new Date(),
    orderCode,
    data.meno || '',
    data.email || '',
    data.telefon || '',
    address,
    data.packeta || '',
    items.length || data.pocet_poloziek || '',
    data.suma_spolu || '',
    data.polozky_text || '',
    data.vyrobny_format || '',
    data.poznamka || ''
  ]);
}

function sendCustomerEmail_(data, orderCode, items, total, qrUrl) {
  if (!data.email) return;

  const subject = 'Dakujeme za objednavku ' + orderCode + ' | TVODO';
  const html = buildCustomerHtml_(data, orderCode, items, total, qrUrl);

  sendTvodoEmail_({
    to: data.email,
    subject,
    htmlBody: html,
    replyTo: SHOP_EMAIL
  });
}

function sendShopEmail_(data, orderCode, items, total, qrUrl) {
  const subject = 'Nova objednavka ' + orderCode + ' | TVODO';
  const html = buildShopHtml_(data, orderCode, items, total, qrUrl);

  sendTvodoEmail_({
    to: SHOP_EMAIL,
    subject,
    htmlBody: html,
    replyTo: SHOP_EMAIL
  });
}

function sendTvodoEmail_(message) {
  const aliases = GmailApp.getAliases();
  const options = {
    name: SHOP_NAME,
    htmlBody: message.htmlBody,
    replyTo: message.replyTo || SHOP_EMAIL
  };

  if (aliases.indexOf(SHOP_FROM_ALIAS) !== -1) {
    options.from = SHOP_FROM_ALIAS;
  }

  GmailApp.sendEmail(message.to, message.subject, stripHtml_(message.htmlBody), options);
}

function buildCustomerHtml_(data, orderCode, items, total, qrUrl) {
  return [
    '<h2>Dakujeme za objednavku ' + esc_(orderCode) + '</h2>',
    '<p>Objednavku sme prijali. Vyroba personalizovaneho produktu zacina po pripisani platby.</p>',
    buildItemsHtml_(items),
    items.length ? '' : '<h3>Objednavka</h3><pre style="white-space:pre-wrap;font-family:Arial,sans-serif">' + esc_(data.polozky_text || data.polozky || '') + '</pre>',
    '<h3>Platba</h3>',
    '<p><strong>Na uhradu:</strong> ' + esc_(total) + '<br>',
    '<strong>IBAN:</strong> ' + esc_(formatIban_(PAYMENT_IBAN)) + '<br>',
    '<strong>Prijemca:</strong> ' + esc_(PAYMENT_ACCOUNT_NAME) + '<br>',
    '<strong>Variabilny symbol:</strong> ' + esc_(data.variabilny_symbol || orderCode) + '<br>',
    '<strong>Sprava pre prijemcu:</strong> Objednavka ' + esc_(orderCode) + '</p>',
    qrUrl ? '<p><img src="' + esc_(qrUrl) + '" alt="QR platba" width="220" height="220"></p>' : '',
    '<p>Ak ste v objednavke nasli chybu, odpiste prosim na tento e-mail co najskor.</p>'
  ].join('');
}

function buildShopHtml_(data, orderCode, items, total, qrUrl) {
  return [
    '<h2>Nova objednavka ' + esc_(orderCode) + '</h2>',
    '<p><strong>Meno:</strong> ' + esc_(data.meno) + '<br>',
    '<strong>Email:</strong> ' + esc_(data.email) + '<br>',
    '<strong>Telefon:</strong> ' + esc_(data.telefon) + '<br>',
    '<strong>Adresa:</strong> ' + esc_([data.ulica, data.mesto, data.psc].filter(Boolean).join(', ')) + '<br>',
    '<strong>Packeta:</strong> ' + esc_(data.packeta) + '</p>',
    buildItemsHtml_(items),
    items.length ? '' : '<h3>Polozky</h3><pre style="white-space:pre-wrap;font-family:Arial,sans-serif">' + esc_(data.polozky_text || data.polozky || '') + '</pre>',
    '<h3>Vyrobny format</h3>',
    '<pre style="white-space:pre-wrap;font-family:Arial,sans-serif">' + esc_(data.vyrobny_format || data.polozky_text || '') + '</pre>',
    '<p><strong>Suma spolu:</strong> ' + esc_(total) + '</p>',
    '<p><strong>Variabilny symbol:</strong> ' + esc_(data.variabilny_symbol || orderCode) + '</p>',
    qrUrl ? '<p><img src="' + esc_(qrUrl) + '" alt="QR platba" width="180" height="180"></p>' : ''
  ].join('');
}

function buildItemsHtml_(items) {
  if (!items || !items.length) return '<p>Ziadne polozky.</p>';
  return '<h3>Polozky</h3>' + items.map(function(item, index) {
    return [
      '<div style="border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin:10px 0">',
      '<strong>' + (index + 1) + '. ' + esc_(item.product) + ' / ' + esc_(item.size) + '</strong><br>',
      'Text: ' + esc_(item.text) + '<br>',
      'Produkt: ' + esc_(item.productColor) + '<br>',
      'Miesto: ' + esc_(item.position) + '<br>',
      'Nit: ' + esc_(item.threadColor) + '<br>',
      'Pismo: ' + esc_(item.font) + '<br>',
      'Symbol: ' + esc_(item.symbol) + '<br>',
      'Cena: ' + esc_(item.priceLabel || item.price),
      '</div>'
    ].join('');
  }).join('');
}

function createOrderCode_() {
  return 'TV' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyMMdd-HHmmss');
}

function esc_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatIban_(iban) {
  return String(iban || '').replace(/(.{4})/g, '$1 ').trim();
}

function stripHtml_(html) {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}
