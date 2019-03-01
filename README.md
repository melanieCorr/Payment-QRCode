# Mobile-payment-QR-Code

Projet realisé par:
  - Kenza Saal
  - Mélanie De Jesus Correia

Ce projet est un projet réalisé dans le cadre d'un cours universitaire relatif au développement Web.

# Comment ça marche

Le but de ce projet est de créer une application mobile permettant le paiement via un QR Code.

Tout d'abord, l'utilisateur devra se connecter (créer un compte s'il n'en a pas). Une fois connecté, il pourra soit vendre un produit, soit en acheter un.

- S'il choisit de vendre un produit, il devra saisir les informations principales du produit, telles que sont nom et son prix. Après avoir saisi les informations sur le produit, un QR Code contenant l'id du produit sera généré automatiquement.

- S'il choisit d'acheter un produit, s'il utilise un téléphone, son appareil photo s'ouvira pour prendre en photo le QR Code généré par le vendeur et s'il est sur un pc, il faudra qu'il ai déjà prit en photo un QR Code pour qu'il puisse le récupérer dans ses photos (sur le pc). Après avoir scanné le QR Code, l'acheteur sera redirigé vers un récapitulatif d'achat (avec les informations du produit). Il pourra alors accepter ou refuser la transaction et un accusé de réception sera envoyer au vendeur.

# Installation et démarrage

- installation de nodejs (serveur):
	- sudo apt-get install nodejs npm

- installation de mongodb (Base de données) (https://hevodata.com/blog/install-mongodb-on-ubuntu/):
	- sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
	- echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
	- sudo apt-get update
	- sudo apt-get install -y mongodb-org
	
- Démarrage:
	- lancer sur un premier terminal la base de données avec la ligne de commande: mongod 
	- lancer sur un second terminal le serveur avec la ligne de commande: node server.js 
	- Sur pc: aller sur l'url donnée au lancement du serveur 
	- Sur mobile: être sur le même réseaux que le pc, faire un ifconfig/ipconfig sur un terminal et prendre l'adresse IP de la machine dans la rubrique enp0, puis dans le navigateur du portable rentrer l'url donnée par le serveur en remplaçant l'adresse IP: 127.0.0.1 par celle de la machine
	
	exemple: adresse donnée par le serveur: http://127.0.0.1:8081 et adresse IP de ma machine 172.20.10.14
	Dans le navigateur du portable rentrer l'URL http://172.20.10.14:8081
