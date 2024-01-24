<h1 align="center">Projet SR</h1>
<h4 align="center">Mael KERICHARD - Cody ADAM</h4>
<p align="center">
   <img src="https://img.shields.io/badge/-ESIR-orange" alt="ESIR">
   <img src="https://img.shields.io/badge/-SR-red" alt="SR">
</p>

# 📁 Architecture

Le projet est divisé en 3 packages : client, server et shared.

```text
packages/
├── client
├── server
└── shared
```

# 😆 Utilisation

**TODO**


# MVP 

- Players are dots
- Players collect dots to gain points
- Move towards mouse
- Client - Serverr architecture
- Client sends inputs each frames
- Server sends game state each frames

# Improvement 1

- Send to the client only the relevant informations
- Player grow in length when collecting dots

# Improvement 2

- Collision between players to kill them
- Death drop dots depending on your current score

# Improvement 3

- Add a dash while pressing space bar
- Dash consume poing (and length)
