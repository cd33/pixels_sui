# Pixels

## Description

Pixels est un projet utilisant le réseau Sui pour apprendre le langage MOVE.

## Connexion au client Sui

Pour connecter le client Sui à un réseau, suivez les étapes ci-dessous :

1. Exécutez la commande suivante pour démarrer le client Sui :

   ```sh
   sui client
   ```

   Ensuite, suivez les instructions à l'écran :

   - Tapez `y`, appuyez sur `Enter`, puis tapez `0`.

2. Pour obtenir l'adresse active du client Sui, utilisez la commande :

   ```sh
   sui client active-address
   ```

3. Pour connaître votre clé privée, exécutez la commande suivante :

   ```sh
   cat ~/.sui/sui_config/sui.keystore
   ```

4. Convertissez votre clé privée avec l'outil `sui keytool` :

   ```sh
   sui keytool convert PRIVATE_KEY
   ```

5. Copiez la clé `bech32WithFlag` dans Suiet (extension de portefeuille Sui pour Chrome).

## Démarrer un local network

Pour démarrer un réseau local, exécutez la commande suivante :

```sh
RUST_LOG="off,sui_node=info" sui start --with-faucet --force-regenesis
```

Pour configurer un environnement local, exécutez les commandes suivantes :

```sh
sui client new-env --alias local --rpc http://127.0.0.1:9000
sui client switch --env local
sui client faucet
```

## Ressources supplémentaires

- [Guide de démarrage pour les développeurs Sui](https://docs.sui.io/guides/developer/getting-started/connect)
- [Vidéo tuto](https://www.youtube.com/watch?v=VfjrcD6jlh4&list=PLvrJ-5wsCykchZnZBIxj1NB_gwZqkfpLz&index=8)

## Notes d'apprentissage

### Déclaration du module

**Exemple** : `module pixels::board`

Les modules en Move permettent d'organiser le code de manière modulaire et réutilisable, facilitant ainsi la gestion et la maintenance du code. Un module est une collection de déclarations de fonctions, de structures et de types qui peuvent être importées et utilisées dans d'autres modules. Les modules sont déclarés à l'aide du mot-clé `module` suivi du nom du module et des déclarations de fonctions, de structures et de types qu'il contient.

### `has key`

Indique que la structure peut être utilisée comme une clé unique dans le stockage global de la blockchain. Cela signifie que chaque instance de cette structure aura un identifiant unique (UID) qui peut être utilisé pour référencer et accéder à l'objet dans le stockage global.

### `has store`

Indique que la structure peut être stockée dans le stockage global de la blockchain. Cela permet à la structure d'être persistée entre les transactions et d'être récupérée ultérieurement.

### `init(ctx: &mut TxContext)`

Cette fonction est utilisée lors du déploiement sur la blockchain. Le paramètre `ctx` représente le contexte de transaction (`TxContext`), qui fournit les informations et les outils nécessaires pour interagir avec la blockchain, tels que la génération d'identifiants uniques (`UID`).

### `share_object`

- **Description** : `share_object` est utilisé pour partager un objet, le rendant accessible à d'autres parties du programme ou à d'autres transactions.
- **Équivalent JS** : En JavaScript, cela pourrait être comparé à l'exportation d'un objet pour qu'il soit utilisé ailleurs.
- **Exemple JS** :

  ```javascript
  module.exports = board;
  ```

### `dynamic_object_field`

- **Description** : `dynamic_object_field` est utilisé pour ajouter, emprunter et modifier des champs dynamiques dans un objet.
- **Équivalent JS** : En JavaScript, cela pourrait être comparé à l'ajout de propriétés dynamiques à un objet.
- **Exemple JS** :

  ```javascript
  let board = {};
  board["quadrant_0"] = { id: 1, quadrant_id: 0, board: [] };
  ```

### `dynamic_object_field::borrow_mut`

- **Description** : `borrow_mut` est utilisé pour emprunter mutablement un champ dynamique d'un objet, permettant ainsi de le modifier.
- **Équivalent JS** : En JavaScript, cela pourrait être comparé à l'accès et à la modification directe d'une propriété d'un objet.
- **Exemple JS** :

  ```javascript
  let quadrant = board["quadrant_0"];
  quadrant.board.push([255, 255, 255]); // Ajoute une ligne de pixels blancs
  ```

### `vector::borrow_mut`

- **Description** : `borrow_mut` est utilisé pour emprunter mutablement un élément d'un vecteur, permettant ainsi de le modifier.
- **Équivalent JS** : En JavaScript, cela pourrait être comparé à l'accès et à la modification directe d'un élément d'un tableau.
- **Exemple JS** :

  ```javascript
  let row = quadrant.board[0];
  row[0] = 0; // Change la couleur du premier pixel de la première ligne
  ```

### `*pixel`

- **Description** : L'opérateur `*` est utilisé pour déréférencer une référence mutable, permettant d'accéder et de modifier la valeur à laquelle la référence pointe.
- **Équivalent JS** : En JavaScript, cela pourrait être comparé à l'accès direct à une variable pour la modifier.
- **Exemple JS** :

  ```javascript
  let pixel = row[0];
  pixel = 0; // Change la couleur du pixel
  ```

### Commandes utiles

### `Compiler pour voir s'il y a des erreurs`

```sh
sui move build
```

### `Basculer de l'environnement Testnet à Devnet`

Consultez les environnements disponibles :

```sh
sui client envs
```

S'il manque devnet :

```sh
sui client new-env --alias devnet --rpc https://fullnode.devnet.sui.io:443
```

Changer d'environnement :

```sh
sui client switch --env devnet
```
