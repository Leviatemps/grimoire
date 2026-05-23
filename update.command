#!/bin/zsh

# ── Grimoire — Mise à jour OTA (Over-the-Air) ────────────────────────────────

cd "$(dirname "$0")"

echo ""
echo "🔮 Grimoire — Mise à jour rapide OTA"
echo "──────────────────────────────────────"

# Vérifier s'il y a des changements
if [ -z "$(git status --porcelain)" ]; then
  echo "✅ Aucun changement à déployer."
  echo ""
  read -k1 "?Appuyez sur une touche pour fermer…"
  exit 0
fi

# Afficher les fichiers modifiés
echo ""
echo "📝 Fichiers modifiés :"
git status --short
echo ""

# Demander le message de mise à jour
echo -n "💬 Description de la mise à jour (Entrée = 'update') : "
read MSG
MSG=${MSG:-"update"}

echo ""
echo "⬆️  Push GitHub…"
git add .
git commit -m "$MSG"
git push

echo ""
echo "🚀 Envoi de la mise à jour OTA vers les appareils…"
eas update --channel preview --message "$MSG" --non-interactive

echo ""
echo "✅ Mise à jour déployée ! L'app se mettra à jour au prochain lancement."
echo ""
read -k1 "?Appuyez sur une touche pour fermer…"
