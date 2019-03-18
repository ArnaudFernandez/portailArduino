# Rapport IoT - Projet Arduino #

## Pour commencer ##

LISEZ-CECI S'IL VOUS PLAIT ! Merci, si vous êtes là c'est que vous lisez. Merci de nous contacter si vous avez n'importe quel problème
sur l'installation de notre projet. Je sais que vous n'avez pas que ça a faire, mais on aimerait vraiment que vous 
voyez le fruit de nos travaux, et même si l'installation est fastidieuse, nous pensons que notre système vaut le détour !

En cas de problème, contactez nous sur
> arnaud.fernandez1@gmail.com

> anais.khorn@gmail.com

Nous répondrons dès que possible pour vous aider

Merci de votre compréhension !

### Qu'est ce qu'il fait alors ce projet ? ###

L'idée de ce projet est d'interconnecter un ensemble d'objets connectés afin de récupérer à plusieurs endroits des températures 
et de pouvoir visualiser l'ensemble de leur état sur un tableau de bord.

Voici ci-dessous un schéma explicatif de notre architecture :

![](https://i1.wp.com/www.internetoflego.com/wp-content/uploads/2015/12/mqtt-nodered-topology.png)

Notre objet connecté (un Arduino pour le projet) récupère à intervalle régulier la température grâce à un thermomètre.
Une fois la valeur récupérée, il va alors la publier dans un topic à destination du broker. Un serveur node (ici node-red)
subscribe alors aux topics et ajoute un document dans une base mongoDB

#### Quoi ? On stock dans une base de données ? ####

Oui. Notre projet est passé par plusieurs états, broker public, puis privé, subscribe du front au broker direct, et autres.
Après réflexion, nous voulions pouvoir garder une trace des différentes températures relevées par les objets connectés.
C'est pourquoi nous avons opté pour un stockage de ces valeurs dans une base de données, mais on va y revenir, ne vous
inquiétez pas !

### Prérequis ###

• Node-RED

• MongoDB

• Mosca

• Angular (6+)

• NodeJS


### Installation ###

#### 1) NodeJS ####

Afin de pouvoir installer correctement tout ça, vous aurez besoin de NodeJS pour utiliser npm. Je ne doute pas que 
vous le possédez déjà, mais au cas ou, voici le lien pour son installation 

    https://nodejs.org/en/
    
Une fois installé, ouvrez votre console en faisant : Windows + R, saisissez cmd et appuyez sur entrée.

Tapez alors la commande 

    npm -v
    
Cela devrait afficher votre version de NodeJS si tout va bien, et on va supposer que oui, opopop au suivant !

#### 2) Node-RED ####

Pour installer Node-RED, tapez dans une console la commande suivante:

    sudo npm install -g --unsafe-perm node-red

> Euh sudo Arnaud & Anaïs ? Mais je suis sur Windows ...

Pas de panique, vous pouvez lancer votre console en administrateur ou utiliser powershell en tapant la commande 

    powershell
    
Et ressaisissez la commande précédente ;) 

---------------------------


Pour lancer Node-RED, rien de plus facile, saissisez la commande

    node-red
    
Tadaa, ça devrait se lancer ! Ensuite, saisissez dans votre navigateur favori :

    http://localhost:1880
    
Vous devriez arriver sur la page d'administration de Node-RED. Oui, c'est une jolie interface graphique,
afin de pouvoir créer rapidement et efficacement notre système, mais on y reviendra plus tard. Laissez tout ça dans un coin 
et passons à la suite !

#### 3) MongoDB ####

Avant de pouvoir commencer l'installation, veuillez télécharger la dernière version de MongoDB. 
Pour ce faire, veuillez vous rendre à l'adresse suivante :
 [https://www.mongodb.com/download-center/community](https://www.mongodb.com/download-center/community) 

##### Installation de MongoDB #####

Quand cela est fait, exécutez le paquet msi et suivez les différentes instructions. 

Ensuite, vous devez créer le dossier qui contiendra vos bases de données. Pour ce faire, créez les dossiers suivants :

    C:\data\db

##### Démarrer MongoDB #####
Pour se connecter à MongoDB, vous devez exécuter le fichier "**mongod.exe**", ce fichier se trouve dans le dossier "**bin**" du répertoire d'installation de MongoDB. Par défaut, le répertoire d'installation se trouve sur:

    C:\Program Files\MongoDB\bin\mongod.exe


##### Se connecter à MongoDB #####

Personnellement, nous avons téléchargé **MongoDB Compass** pour pouvoir visualiser les données dans notre base de données. 
Vous pouvez le télécharger à l'adresse suivante : [https://www.mongodb.com/products/compass](https://www.mongodb.com/products/compass)
 
 La base de données est de base ouverte sur localhost:27017, cette information devrait suffir pour vous connecter à celle-ci
 avec MongoDB Compass
 

### Installation de Angular 6+ ###

#### Euh .. Pourquoi Angular en fait ? ####

Nous avons fait le choix d'utiliser Angular pour notre front-end, c'est un framework JS assez puissant que nous maitrisons,
nous avons pu faire très rapidement le portail grâce à lui et nous avons un front qui s'adapte en fonction des appareils
connectés, plutôt cool !

> J'achète ! Installons ça

Ouvrez une console et saisissez 

    npm install -g @angular/cli
    
Il devrait alors s'installer comme un grand ... et voilà !

## Utilisation ##

### Bon alors ! Je veux prendre la température moi, comment ça marche tout ça ! ##

Ça arrive ! Dans un premier temps, ouvrez une console et naviguez jusqu'à la racine du projet, ensuite saisissez 

    npm install
    
Cela devrait résoudre certaines dépendances.

Puisque vous y êtes, naviguez également dans le dossier "portailArduino" et saisissez également cette commande, ça va
nous servir pour plus tard !


### Arduino ###

Vous trouverez à la racine du projet un dossier mqtt-full, qui contient un fichier mqtt-full.ino.
Ouvrez-le. Vous allez devoir changer quelques lignes pour que cela marche chez vous !

> Ligne 19 : Modifiez "L'IP_LOCAL_DE_VOTRE_PC_ICI" par votre IP locale,
cela peut être facilement fait en ouvrant une console et en tapant la commande ipconfig /all

> Ligne 49 : Modifiez "VOTRE_SSID_ICI" par le nom du réseau sur lequel vous voulez vous connecter

> Ligne 50 : Modifiez "VOTRE_PASSWORD_ICI" par le mot de passe du réseau sur lequel vous voulez vous connecter

Ensuite, vous êtes bon pour téléverser !


--------------------------


Sur la board de votre Arduino, on suppose que : 

> Une led est branchée sur la pin D19

> Un thermomètre est branché sur la pin D23

> Un photorésistor est branché sur la pin A0

--------------------------

#### Un peu d'explications sur ce code ... ####

Nous connectons l'Arduino à un réseau afin qu'il puisse communiquer à d'autres appareils présents eux aussi sur le réseau.
Ensuite avec 

> PubSubClient client(WiFiClient <randomClientWifi>); // Signature de la variable client

> client.setServer(mqtt_server, 1883);
    
> client.setCallback(mqtt_pubcallback); 

On indique sur quel serveur il doit aller chercher ses topics, ici c'est notre IP local sur le port 1883.
Comme nous n'avons pas encore exécuté notre serveur Node, il ne va pas encore marcher, mais ça va venir !

Le reste du setup concerne l'initialisation de la Led et du photorésistor, on connait.

La loop est elle plus intéressante, nous allons subscribe aux topics puis attendre un certains temps (ici 50 secondes).
Ensuite nous récupérons la température et nous construisons un objet JSON qui sera publié dans le topic correspondant
à la température

> miage/m1/sensors/temperature

Tut tut ! L'objet est parti, il doit être maintenant handle par le Node, on va voir ça tout de suite !

------------------------------
Note : Le code possède aussi des fonctionnalités pour agir sur le sensor et la lumière, il faut savoir que le node peut publier
une valeur pour le sensor afin de changer le seuil d'activation de la lumière en fonction de la lumière ambiante.


### MongoDB ###

Vous aurez besoin d'avoir mongoDB (serveur) qui tourne sur votre ordinateur pour que tout fonctionne correctement.
Ouvrez une console et tapez 

    mongod
    
Il devrait se lancer tout seul comme un grand !

### Node-RED ###

Si vous suivez bien tout depuis le début, vous devriez avoir Node-RED d'ouvert ainsi. Si ce n'est pas le cas, voici les étapes
pour l'exécuter :
 Ouvrez une console et tapez
 
    node-red
    
Ensuite ouvrez votre navigateur et tapez dans l'URL : 

    localhost:1880
    
Vous devriez arriver sur l'interface de Node-RED !

----------------------------

On va encore vous mettre un peu à contribution, vous allez devoir installer deux modules afin que le projet se déroule bien.
Cliquez en haut à droite pour ouvrir le menu, et allez dans "manage palette"

![](https://puu.sh/D1oFb/512bcaaf17.png)

Ensuite, dans l'onglet installation, saisissez dans la barre de recherche 

> node-red-contrib-mqtt-broker

Et installez-le. Faites la même chose pour 

> node-red-node-mongodb

Vous pourrez alors importer notre système en réouvrant le menu de tout à l'heure en haut à droite, et en selectionnant : 
"import" > "clipboard", et en collant ceci 

    [{"id":"d4c741b9.12e4","type":"tab","label":"Flow 1","disabled":false,"info":""},{"id":"36036fe9.efd02","type":"mqtt-broker","z":"","name":"Broker","broker":"192.168.1.111","port":"1883","clientid":"","usetls":false,"compatmode":true,"keepalive":"60","cleansession":true,"birthTopic":"","birthQos":"0","birthPayload":"","closeTopic":"","closeQos":"0","closePayload":"","willTopic":"","willQos":"0","willPayload":""},{"id":"d7b32f58.c308a","type":"mongodb","z":"","hostname":"192.168.1.111","port":"27017","db":"arduino","name":""},{"id":"e8e700aa.5e9c1","type":"mongodb","z":"","hostname":"127.0.0.1","port":"27017","db":"arduino","name":""},{"id":"8c2279e2.89f9f8","type":"mqtt-broker","z":"","name":"Broker","broker":"192.168.1.111","port":"1883","clientid":"","usetls":false,"compatmode":true,"keepalive":"60","cleansession":true,"birthTopic":"","birthQos":"0","birthPayload":"","closeTopic":"","closeQos":"0","closePayload":"","willTopic":"","willQos":"0","willPayload":""},{"id":"9ed254fa.733de8","type":"mongodb","z":"","hostname":"127.0.0.1","port":"27017","db":"db","name":""},{"id":"f04a5e1.00756a","type":"mongodb","z":"","hostname":"127.0.0.1","port":"27017","db":"sensors","name":""},{"id":"4353a68e.92d358","type":"mqtt-broker","z":"","name":"Broker","broker":"192.168.1.111","port":"1883","clientid":"","usetls":false,"compatmode":true,"keepalive":"60","cleansession":true,"birthTopic":"","birthQos":"0","birthPayload":"","closeTopic":"","closeQos":"0","closePayload":"","willTopic":"","willQos":"0","willPayload":""},{"id":"d9caf097.f4079","type":"mongodb","z":"","hostname":"127.0.0.1","port":"27017","db":"sensors","name":""},{"id":"5ff3278b.7486a8","type":"mqtt in","z":"d4c741b9.12e4","name":"","topic":"miage/m1/sensors/temperature","qos":"2","broker":"4353a68e.92d358","x":135,"y":97,"wires":[["25e5d13f.47306e","ae4b645d.682c28","9274ff6.2d0c2"]]},{"id":"e52020c6.4e498","type":"mosca in","z":"d4c741b9.12e4","mqtt_port":1883,"mqtt_ws_port":8080,"name":"","username":"","password":"","dburl":"mongodb://localhost:27017/mqtt","x":105,"y":41,"wires":[[]]},{"id":"25e5d13f.47306e","type":"debug","z":"d4c741b9.12e4","name":"","active":false,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","x":646,"y":107,"wires":[]},{"id":"9e1570be.03ace","type":"mqtt out","z":"d4c741b9.12e4","name":"","topic":"miage/m1/sensors/led","qos":"0","retain":"","broker":"4353a68e.92d358","x":533,"y":430,"wires":[]},{"id":"1ed56f4b.2c50b1","type":"inject","z":"d4c741b9.12e4","name":"","topic":"","payload":"0","payloadType":"str","repeat":"","crontab":"","once":true,"onceDelay":0.1,"x":101,"y":424,"wires":[["9e1570be.03ace"]]},{"id":"ae4b645d.682c28","type":"debug","z":"d4c741b9.12e4","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","x":373,"y":255,"wires":[]},{"id":"5df74bdb.743a04","type":"mongodb out","z":"d4c741b9.12e4","mongodb":"d9caf097.f4079","name":"","collection":"temp","payonly":true,"upsert":false,"multi":false,"operation":"insert","x":686,"y":199,"wires":[]},{"id":"9274ff6.2d0c2","type":"json","z":"d4c741b9.12e4","name":"","property":"payload","action":"","pretty":false,"x":407,"y":148,"wires":[["5df74bdb.743a04"]]},{"id":"9ca100df.87efd","type":"inject","z":"d4c741b9.12e4","name":"","topic":"","payload":"4000","payloadType":"str","repeat":"","crontab":"","once":true,"onceDelay":0.1,"x":165,"y":544,"wires":[["9e1570be.03ace"]]}]

Vous devriez alors avoir ceci

![](https://puu.sh/D1oA1/7fabae3bc5.png)

C'est le cas ? Super ! Pour faire marcher les topics, vous allez devoir changer l'ip du serveur sur lequel est le broker.
Pour cela, double-cliquez sur un topic (Exemple : miage/mi/sensors/temperature), et éditez-le en appuyant sur ce bouton comme
sur la photo ci-dessous

![](https://puu.sh/D1oCB/4fbb23bd9b.png)

Vous aurez ensuite qu'à changer l'ip en mettant celle de votre PC ! 

(Faites cette action pour les deux topics)

--------------------------

Cliquez ensuite en haut à droite sur "Deploy" et ça devrait être fin prêt !


--------------------------

Note : Vous verrez dans le schéma en bas une boîte "0" et une boîte "4000", en cliquant sur le carré situé a gauche des boîtes, vous pouvez émettre un message sur le topic "miage/m1/sensors/led". L'arduino est capable de lire ce topic et va changer le seuil d'activation de la led en fonction du photosensor, ces deux boîtes sont là pour tester si l'échange et le changement de variable se fait correctement ça devrait marcher. Ca ouvre la porte à une potentielle amélioration de notre système si on veut changer directrement par le portail le seul d'activation d'une lumière sur un objet en particulier, ou on peut simplement afficher sur le portail si la lumière est allumée dans une salle, en fonction de la valeur du photosensor. 

En gros, c'est surtout là pour vous prouver qu'on sait aussi envoyer un message à destination de l'Arduino, mais ça peut aussi être utile ! :D


### Angular & son serveur Node ###

Avant toute chose

#### Et son serveur Node ? Kwa ? ####

Oui, le front utilise un serveur node afin de communiquer avec la base mongo, y faire ses requête tout ça, il va donc falloir
ouvrir deux consoles et exécuter deux serveurs

#### Angular #### 

Pour exécuter le serveur Angular de développement, naviguez jusque dans le dossier "PortailArduino" du projet 
dans votre console

Si vous ne l'avez pas fait au tout début de la partie "Utilisation", n'oubliez pas de saisir la commande

    npm install
    
Cela devrait résoudre toutes les dépendances du projet.

Si tout s'est bien passé, vous pourrez alors exécuter Angular, saississez alors la commande 

    ng serve --open
    
Une fois le serveur lancé, une page devrait alors s'ouvrir avec le portail dessus ! Si rien ne s'affiche, c'est normal,
il faut maintenant exécuter le serveur Node capable de gérer les requêtes. 

### Node pour le portail ###

Pour cela, ouvrez une console (cela devrait normalent vous faire 4 consoles, la première étant pour MongoDB, 
la seconde pour Node-RED, la 3e pour Angular, et la 4e pour maintenant !) naviguez jusqu'à la racine du projet, et 
tapez la commande 

    node .\serverCrudWithMongo.js
    
Si tout ce passe bien, vous devriez avoir un petit message : Serveur lancé sur le port 8081



## Tout est prêt ! ##

Si tout est lancé sans erreur et que l'Arduino est bien alimenté et connecté au réseau, vous devriez commencer à voir quelque chose 
comme ça dans le portail 

![](https://puu.sh/D1uJc/dff2fff699.png)

Le serveur Node requête la base Mongo en prenant le dernier document concernant un appareil donné et affiche son statut.
Dans le code Arduino, nous avons set une température minimale & une température maximale, si la température est dans la fourchette,
alors la température s'affichera en vert, si elle ne l'est pas, alors elle s'affichera en rouge.

Chaque appareil est identifié par son @mac donc nous ne risquons pas de doublons. De plus, chaque appareil possède un champ pour
lui assigner une salle, ici pour le test nous avons mis C3, mais cela pourrait être tout et n'importe quoi.

### Axes d'amélioration ### 

Nous avons développé beaucoup de choses pour au final avoir peu d'actions possibles, mais tout est prêt pour pouvoir 
améliorer le système. Nous avons beaucoup d'idées pour ça:

1) Node-RED est configuré pour pouvoir envoyer une valeur à l'Arduino et changer la valeur de déclenchement de la lumière du
photorésistor, on pourrait alors imaginer pouvoir modifier cette valeur sur le portail. On pourrait également imaginer
afficher l'état du photorésistor dans le portail afin de voir si la lumière est allumée dans la salle, dans le cas ou
une personne aurait oublié d'éteindre la lumière

2) On pourrait pouvoir changer directement les seuils de températures maximum et minimum sur le portail

3) On pourrait pouvoir changer la salle dans laquel l'appareil est placé directement sur le portail & non dans le code

4) On pourrait afficher une évolution de la température de chaque Arduino grâce à la base de données qui garde tout en mémoire
c'est là ou réside la force d'avoir une architecture système qui stocke les données

5) On pourrait trier sur le portail pour n'afficher que les appareils hors de la fourchette de température (dans l'idée 
d'agir rapidement sur un problème de température dans les salles)

## Auteurs ##
• **Arnaud Fernandez** / arnaud.fernandez1@gmail.com

• **Anaïs Khorn** / anais.khorn@gmail.com

## Webographie ##

• [http://www.steves-internet-guide.com/install-mosca-mqtt-broker-node-red/](http://www.steves-internet-guide.com/install-mosca-mqtt-broker-node-red/)

• [https://projetsdiy.fr/nodered-mysensors-stocker-donnees-mongodb/#Les_modulesMongoDB_pour_Node-RED_disponibles](https://projetsdiy.fr/nodered-mysensors-stocker-donnees-mongodb/#Les_modulesMongoDB_pour_Node-RED_disponibles)

• [http://www.internetoflego.com/weather-station-dht11-mqtt-node-red-google-chart-oh-my/](http://www.internetoflego.com/weather-station-dht11-mqtt-node-red-google-chart-oh-my/)
