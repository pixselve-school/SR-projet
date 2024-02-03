<h1 align="center">Projet SR</h1>
<h4 align="center">Mael KERICHARD - Cody ADAM</h4>
<p align="center">
   <img src="https://img.shields.io/badge/-ESIR-orange" alt="ESIR">
   <img src="https://img.shields.io/badge/-SR-red" alt="SR">
</p>

# 📁 Architecture

The project is divided into 3 packages:

```text
packages/
├── client
├── server
└── shared
```

# 😆 Usage

**TODO**


# MVP 

- [x] Players are dots
- [x] Players collect dots to gain points
- [x] Move towards mouse
- [x] Client - Serverr architecture
- [x] Client sends inputs each frames
- [x] Server sends game state each frames

# Improvement 1

- [x] Player grow in length when collecting dots
- [x] Add a dash while pressing space bar
- [x] Dash consume poing (and length) drop orbs

# Improvement 2

- [x] Collision between players to kill them
- [x] Client side position interpolation
- [ ] Death drop dots depending on your current score

# Improvement 3

- [ ] Add a leaderboard
- [ ] Send leaderboard on a less frequent basis
- [ ] Send to the client only the relevant informations
- [ ] Dynamic player size depending on score

# Improvement 4
