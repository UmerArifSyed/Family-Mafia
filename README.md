### Mafia: The Game 🃏

A real-time, full-stack multiplayer Mafia game built for the web.

---

### 🌟 Project Overview

This project is a web-based, real-time implementation of the classic party game, Mafia (also known as Werewolf). It is designed to be a streamlined, easy-to-use platform for friends to play together, with a focus on a single-page application experience. The game is moderated by one of the players, who guides the flow of the game, while all other players secretly receive a role and try to outwit their opponents.

---

### ✨ Features

* **Real-Time Gameplay:** All game state changes—from players joining to roles being assigned and players being eliminated—are instantly broadcast to all connected clients.
* **Dynamic UI:** The user interface changes dynamically based on the current game phase and the player's role, providing a tailored experience for the Moderator, Mafia, Detective, Doctor, and Townsfolk.
* **Player & Moderator Roles:** One player can claim the role of Moderator, who has full control over the game flow, including starting the game, moving between phases, and resetting the game.
* **Core Game Loop:** The application handles the full game cycle, including:
    * A Lobby for players to gather and join.
    * Role Assignment.
    * A Night Phase for secret actions by Mafia, Doctor, and Detective.
    * A Day Phase for open discussion and voting.
    * Win Condition checks to determine the winning team.
* **Customizable Roles:** The game logic is easily configurable to adjust the number of Mafia and other special roles based on the number of players.

---

### 💻 Technologies Used

* **Frontend:** React.js
    * **State Management:** React Hooks (`useState`, `useEffect`)
    * **Styling:** Custom CSS
* **Backend:** Node.js
* **Real-Time Communication:** Socket.IO
    * Facilitates bi-directional, low-latency communication between the server and all connected clients.
* **Server Framework:** Express.js
    * Provides a simple, un-opinionated server for handling connections.

---

### 🚀 How to Run the Project

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-url]
    cd [your-repo-name]
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the backend server:**
    ```bash
    npm start
    ```

4.  **Start the frontend development server:**
    Open a new terminal and run:
    ```bash
    cd front
    npm start
    ```

5.  **Play the game:**
    Open `http://localhost:3000` in your web browser. Have other players join by opening the same URL on their devices.
