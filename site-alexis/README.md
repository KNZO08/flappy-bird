# Growth Editing — site vitrine

Site statique (HTML/CSS/JS, sans dépendance) pour vendre les mogrts Premiere Pro de la boutique
[payhip.com/GrowthEditing](https://payhip.com/GrowthEditing).

## Voir le site

Ouvre `index.html` dans un navigateur, ou lance un petit serveur :

```sh
cd site-alexis
python3 -m http.server 8000
# puis http://localhost:8000
```

## Modifier les produits

Tout se passe dans `script.js`, tableau `PRODUCTS` en haut du fichier :

- `name` : nom affiché sous la boîte (« MOGRT – … »)
- `box` : texte écrit sur la boîte 3D rouge
- `cat` : onglet de la section « Contenu inclus » (`phares`, `interfaces` ou `effets`)
- `price` : prix affiché (3,00 € par défaut)
- `url` : lien du bouton « Acheter ». Par défaut il ouvre la boutique ; colle ici le lien
  Payhip exact du produit (ex. `https://payhip.com/b/XXXX`) pour envoyer directement vers sa page.

Chaque produit a une animation dessinée en CSS (objet `SCENES`, même clé que `id`).

## Fichiers

- `index.html` — structure des sections
- `style.css` — design, effets et animations
- `script.js` — produits, carrousel, compteurs, tilt 3D, particules
- `fonts/` — polices Google Fonts (licence SIL OFL) hébergées localement
