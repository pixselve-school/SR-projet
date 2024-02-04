#show link: underline

#grid(columns: 2,
  align(center)[
    #image("./images/esir.png", width: 50%)
  ],
  align(center)[
    #image("./images/univ-rennes.png", width: 67%)
  ],
  column-gutter: 100pt
)

#pad(bottom: 10pt, top: 40pt)[
  // Title row.
  #align(center)[
    #block(text(1.5em, link("https://github.com/pixselve-school/SR-projet")[
      #box(image("./images/MdiGithub.svg", height: 1em)) pixselve-school/SR-projet]))
    ]
]

#pad(bottom: 0pt, top: 0pt)[
  // Title row.
  #align(center)[
    #block(text(weight: 700, 1.75em)[Rapport individuel de projet SR])
  ]
]

#pad(bottom: 20pt, top: 10pt)[
  // Title row.
  #align(center)[
    #block(text(1.5em)[Mael KERICHARD])
  ]
]

= Notre Solution

== Préambule du Projet

Avant l'initiation de notre projet, une réunion préparatoire a été organisée pour définir notre vision, ainsi que les étapes clés à atteindre. Dès le départ, notre ambition était de ne pas nous restreindre à un prototype de base, mais plutôt de concevoir un jeu complet, tant sur le plan visuel que fonctionnel.

Bien que l'idée initiale ait été de créer un jeu de tir à la première personne en multijoueur (FPS), nous avons rapidement écarté cette option en raison de sa complexité et du temps limité à notre disposition.

Nous avons finalement opté pour le développement d'un *clone du célèbre jeu #link("https://fr.wikipedia.org/wiki/Slither.io")[Slither.io]*, tirant parti de notre expérience antérieure commune sur plusieurs projets.

== Choix Technologiques

En tant que duo passionné par le développement web, cumulant plusieurs années d'expérience dans ce domaine (bien que non professionnelles), nous avons privilégié l'utilisation de technologies familières pour accélérer le développement.

Bien que cette décision ait été prise à contrecœur, faute de temps pour explorer de nouvelles avenues, elle s'est avérée pragmatique étant donné nos contraintes. Ainsi, notre pile technologique incluait :

- Une architecture client-serveur, avec *TypeScript*.
- #link("https://nextjs.org")[*Next.JS*] pour le client, malgré sa surdimension pour notre projet, car nous n'avons pas exploité ses capacités de rendu côté serveur (SSR) ni d'optimisation d'image.
- #link("https://socket.io")[*Socket.io*] pour la communication, offrant une abstraction au-dessus de WebSocket et améliorant l'expérience de développement.

=== Intégration et Déploiement Continus (CI/CD)

Un effort particulier a été consacré à l'automatisation du processus de construction et de déploiement de notre jeu. Le code, hébergé sur GitHub et ouvert à la contribution, utilise GitHub Actions pour l'automatisation. Le front-end, statique, est déployé sur GitHub Pages, tandis que le back-end utilise une image Docker construite et déployée automatiquement sur GitHub Packages. Cela me permet de déployer facilement l'image du serveur via Docker sur mon Homelab.

== Développement du Serveur

La répartition des tâches a vu ma responsabilité se concentrer sur le serveur, tandis que mon collègue s'occupait du client.

=== Première Version

Un produit minimal viable (MVP) a été rapidement mis en place, permettant le mouvement d'un serpent dans un espace défini. La carte entière était envoyée au client 60 fois par seconde, et le client transmettait en retour plusieurs fois par seconde une direction pour le mouvement de la tête du serpent. Cette communication utilisait le format JSON.

#figure(
  caption: [La première version du jeu]
)[#image("./images/first-version.png")]

=== Optimisations

==== Système de Chunks

Pour améliorer les performances, nous nous sommes inspirés de Minecraft en divisant la carte en carrés de taille déterminée. Seuls les chunks proches du joueur lui sont transmis, réduisant ainsi la charge de calcul pour la détection des collisions.

==== Paquets Binaires

Nous avons remplacé le format JSON par des données binaires pour réduire la taille des paquets transmis. Utilisant la bibliothèque #link("https://www.npmjs.com/package/structurae")[structurae], nous avons optimisé la structure des données pour minimiser l'utilisation de la bande passante et améliorer l'efficacité du décodage.

```typescript
id: { type: 'string', minLength: 5, maxLength: 5 },
x: { type: 'integer', btype: 'uint16' },
y: { type: 'integer', btype: 'uint16' },
points: { type: 'integer', minimum: 1, maximum: 10, btype: 'uint8' },
color: {
  type: 'integer',
  maximum: colors.length - 1,
  minimum: 0,
  btype: 'uint8',
},
```

Ces optimisations ont significativement réduit la consommation de bande passante et amélioré l'expérience utilisateur grâce à une meilleure performance de décodage.