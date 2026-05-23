#!/bin/zsh

# ── Grimoire — Push automatique vers GitHub ──────────────────────────────────

cd "$(dirname "$0")"

echo ""
echo "🔮 Grimoire — Push GitHub"
echo "─────────────────────────"

# Vérifier s'il y a des changements
if [ -z "$(git status --porcelain)" ]; then
  echo "✅ Aucun changement à pousser."
  echo ""
  read -k1 "?Appuyez sur une touche pour fermer…"
  exit 0
fi

# Afficher les fichiers modifiés
echo ""
echo "📝 Fichiers modifiés :"
git status --short
echo ""

# Demander le message de commit
echo -n "💬 Message de commit (Entrée = 'update') : "
read MSG
MSG=${MSG:-"update"}

echo ""
echo "⬆️  Envoi vers GitHub…"
git add .
git commit -m "$MSG"
git push

echo ""
echo "✅ Poussé avec succès sur github.com/Leviatemps/grimoire"
echo ""
read -k1 "?Appuyez sur une touche pour fermer…"
