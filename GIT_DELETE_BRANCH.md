# 🗑️ Supprimer une Branche Git

## Supprimer une Branche Locale

### Étape 1 : Changer de branche

Vous ne pouvez pas supprimer la branche sur laquelle vous êtes actuellement.

```bash
# Retourner sur main
git checkout main
```

### Étape 2 : Supprimer la branche

```bash
# Suppression normale (branche mergée)
git branch -d nom-de-la-branche

# OU

# Suppression forcée (même si pas mergée)
git branch -D nom-de-la-branche
```

**Exemple** :
```bash
git checkout main
git branch -d pacao--1
```

---

## Supprimer une Branche Distante

Si la branche existe sur GitHub/GitLab :

```bash
git push origin --delete nom-de-la-branche
```

**Exemple** :
```bash
git push origin --delete pacao--1
```

---

## Commandes Utiles

| Commande | Description |
|----------|-------------|
| `git branch` | Liste les branches locales |
| `git branch -a` | Liste toutes les branches (locales + distantes) |
| `git branch -d nom` | Supprime une branche mergée |
| `git branch -D nom` | Force la suppression |
| `git push origin --delete nom` | Supprime du remote |

---

## Exemple Complet

```bash
# 1. Voir toutes les branches
git branch

# 2. Passer sur main
git checkout main

# 3. Supprimer localement
git branch -d pacao--1

# 4. Supprimer sur le remote (si elle y existe)
git push origin --delete pacao--1
```

---

## ⚠️ Notes Importantes

- **`-d`** : Suppression sécurisée (refuse si la branche n'est pas mergée)
- **`-D`** : Suppression forcée (supprime même si pas mergée)
- Vous ne pouvez pas supprimer la branche active
- Toujours vérifier avec `git branch` avant de supprimer

---

## 🔄 Workflows Courants

### Après un merge réussi

```bash
git checkout main
git merge feature-branch
git push
git branch -d feature-branch  # Nettoyage
```

### Abandonner une branche

```bash
git checkout main
git branch -D mauvaise-branche  # Force delete
```

### Nettoyer les branches distantes obsolètes

```bash
git fetch --prune  # Met à jour la liste des branches distantes
```
