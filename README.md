# Projet : API - DB Mongo
![enter image description here](https://zupimages.net/up/20/43/sqd7.jpg) 


Dans ce projet, il nous est demandé de créer une API Javascript avec une BDD Mongo associé.

## Lancement du projet

Pour lancer le Projet, il faut exécuter les commandes :
````
cd masterclass_project
npm install
npm start
````

## Mise en place de la BDD

#### 1. Créer une base de données.
```js
use masterclass_project
```
#### 2. Créer un utilisateur qui a le droit de lire et d’écrire dans la base de données "masterclass_project", et seul cet utilisateur peut lire et écrire dans cette base de données.
```js
db.createUser(
	{ user:"joe",
	  pwd:"doe",
	  roles:[{role:"readWrite",db:"masterclass_project"}]
	}
)
```
Afin d'activer la sécurité authentification , modifier le fichier mongod.cong  `/etc/mongod.conf`
```
security:
	authorization: enabled
```
Relancer les services mongod
```
sudo systemctl restart mongod
```
Connexion à la BDD avec les identifiants
```
mongo --authenticationDatabase "masterclass_project" -u "joe" -p
```

#### 3. Import de tout le contenu du fichier "restaurants.json" dans la base de données "masterclass_project" sous la collection "restaurants".
```
mongoimport --db=masterclass_project --collection=restaurants --file=restaurants.json
```
#### 4. Insertion d'un champ "prix <numéro>" au hasard entre 2 et 100 parmi tous les documents.
```js
db.restaurants.updateMany(
	{ price: { $exists: false } },
	[{ $set:
		{ price:
			{ $function:
				{ body: function() 
					{ return (Math.floor(Math.random() * (100 - 2 + 1)) + 2); },
				args: [],
				lang: "js"
				}
			}
		}
	}]
)
```
#### 5. Insertion d'un champ "avis [<numéro>]" avec 5 taux à l'intérieur, au hasard entre 0 et 5 parmi tous les documents.
```js
db.restaurants.updateMany(
	{ reviews: { $exists: false } },
	[{ $set:
		{ reviews:
			{ $function: {
				body: function() {
				const randomArray = [];
				for(let i = 0; i<5; i++) {
					randomArray.push(Math.floor(Math.random() * (5 - 0 + 1)) + 0)
				}
			return randomArray;
			},
			args: [],
			lang: "js"
			}}
		}
	}]
)
```

## Création d'un Replica

#### 1. Lancement de la première instance de mongod (27017)
```
mongod --auth --port 27017 --dbpath /var/lib/mongodb --replSet rs0
```
#### 2. Création un dossier pour la réplique
```
mkdir /var/lib/mongodb1/
```
#### 3. Lancement de la deuxième instance de mongod (27018)
```
mongod --auth --port 27018 --dbpath /var/lib/mongodb1 --replSet rs0
```
#### 4. Lancement de la deuxième instance de mongod
```
mongod --auth --port 27018 --dbpath /var/lib/mongodb1 --replSet rs0
```
#### 5. Authentification de l'administrateur sur la première instance (27017)
```
mongo --port 27017  --authenticationDatabase "admin" -u "admin" -p "admin"
```
#### 6. Initialisation du Replica set
```js
rs.initiate()
```
#### 7. Ajoutez un deuxième localhost au replica set
```js
rs.add("localhost:27018")
```
#### 8. Afficher l'état du replica set
```js
rs.status()
```
