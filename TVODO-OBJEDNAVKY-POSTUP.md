# TVODO objednavkovy system

## Odporucany postup teraz

Nemusime vytvarat druhu Google tabulku ako novy subor. Najlepsie je pouzit existujucu Google tabulku, do ktorej uz zapisuje Google Form.

Odporucane nastavenie:

1. Web posiela objednavku do existujuceho Google Formu.
2. Google Form zapisuje objednavku do existujucej Google tabulky.
3. V tej istej tabulke je Google Apps Script.
4. Apps Script sa spusti pri novej odpovedi formulara.
5. Zakaznik dostane potvrdzujuci e-mail s objednavkou, QR kodom a platobnymi udajmi.
6. TVODO dostane interny e-mail s vyrobnym formatom.
7. Objednavka ostane zapisana v tabulke.

Toto je pre zaciatok najbezpecnejsie, lebo nemenime existujuci zber objednavok.

## Co treba nastavit v Google

1. Otvor existujucu Google tabulku s odpovedami z formulara.
2. Hore klikni na `Rozsirenia` -> `Apps Script`.
3. Vloz obsah suboru `google-apps-script.js`.
4. V skripte uprav:
   - `SHOP_EMAIL`
   - `SHOP_NAME`
   - ak pouzijes aj priamy zapis, tak aj `SPREADSHEET_ID`
5. Uloz projekt.
6. V Apps Script klikni na `Triggers` / `Spustace`.
7. Pridaj novy trigger:
   - function: `onFormSubmit`
   - event source: `From spreadsheet`
   - event type: `On form submit`
8. Pri prvom spusteni Google vypyta povolenia na odosielanie e-mailov.

## Kedy robit priamy Apps Script endpoint

Priamy endpoint sa oplati az vtedy, ked budeme chciet uplne obist Google Form.

Vtedy bude tok:

web -> Apps Script -> Google tabulka + e-maily

V `index.html` sa potom vyplni:

```js
const APP_SCRIPT_ENDPOINT = 'URL_WEB_APP';
```

Kym je tato hodnota prazdna, web pouziva existujuci Google Form fallback.

## Moje odporucanie

Teraz nechajme existujuci Google Form a tabulku. Je to stabilnejsie a rychlejsie na spustenie. Apps Script doplnime ako automat nad existujucu tabulku, aby zacali chodit pekne e-maily a vyrobny format.

Neskor, ked bude web odskusany na realnych objednavkach, mozeme Form vypnut a posielat objednavky priamo do Apps Scriptu.

## Sukromny vs firemny Google ucet

Technicky nevadi, ak je tabulka na sukromnom Google ucte. Objednavky sa budu zapisovat aj tak.

Lepsie riesenie pre predaj je ale toto:

1. Tabulka s objednavkami je vlastnena firemnym Google uctom.
2. Apps Script trigger je vytvoreny pod firemnym uctom.
3. Potvrdzovacie e-maily odchadzaju z firemnej adresy.
4. Sukromny ucet moze mat pristup ako editor alebo spravca.

Dovod je jednoduchy: zakaznik potom vidi firemny odosielatelsky e-mail, objednavkove data nie su viazane na sukromny ucet a v buducnosti sa to lahsie odovzdava, zalohuje a spravuje.

Ak tabulka ostane na sukromnom ucte, odporucam aspon:

1. zapnut dvojfaktorove prihlasovanie,
2. zdielat tabulku aj na firemny e-mail,
3. vytvorit Apps Script trigger z firemneho uctu, ak to Google povoli,
4. pravidelne exportovat alebo zalohovat objednavky.
