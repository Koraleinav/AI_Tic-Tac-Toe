# 🕹️ Angular Tic-Tac-Toe Game

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Angular](https://img.shields.io/badge/Angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

## ✨ Introduction

This is a classic Tic-Tac-Toe game built using Angular. You can play against another human player or challenge the computer AI. The game features a clean and intuitive user interface, along with basic game state management and win/draw detection. For the player vs. computer mode, a smart AI opponent utilizes the Minimax algorithm to provide a challenging experience.

## 🚀 Features

* **Player vs. Player Mode:** Enjoy a classic game of Tic-Tac-Toe with your friends.
* **Player vs. Computer Mode:** Test your skills against an AI opponent that uses the Minimax algorithm to make intelligent moves.
* **Responsive Design:** The game layout adapts to different screen sizes for a seamless experience on various devices.
* **Clear Game State:** Easily see the current player, winner (if any), or if the game is a draw.
* **Win Highlighting:** When a player wins, the winning combination of cells is clearly indicated.
* **Score Tracking:** Keeps track of the number of wins for Player X and Player O.
* **Winning Streak:** Records the current winning streak for each player.
* **New Game Button:** Quickly start a fresh game at any point.

## 🛠️ Technologies Used

* **Angular:** A powerful JavaScript framework for building web applications.
* **TypeScript:** A statically typed superset of JavaScript that enhances development.
* **HTML5:** The standard markup language for creating web pages.
* **CSS3:** The latest evolution of the Cascading Style Sheets language for styling web content.

## ⚙️ How to Run

Follow these simple steps to get the game running on your local machine:

1.  **Prerequisites:** Make sure you have Node.js and npm (or yarn) installed on your system. You also need the Angular CLI installed globally. If not, you can install them using the following commands:
    ```bash
    # Install Node.js and npm (check their official websites for the latest versions)

    # Install Angular CLI globally
    npm install -g @angular/cli
    ```

2.  **Clone the Repository:** If you have the project code in a repository, clone it to your local machine.
    ```bash
    git clone [repository-url]
    cd [project-directory]
    ```

3.  **Install Dependencies:** Navigate to the project directory in your terminal and install the project's dependencies.
    ```bash
    npm install
    # or
    yarn install
    ```

4.  **Run the Application:** Start the Angular development server.
    ```bash
    ng serve -o
    # or
    yarn start
    ```

    This command will build the project and open it in your default web browser. You can usually access the game at `http://localhost:4200`.

## 🎮 Game Modes

You can switch between two game modes:

* **Player vs. Player:** Two human players take turns marking cells on the board with 'X' and 'O'.
* **Player vs. Computer:** You play as 'X' against the computer AI ('O').

You can select the desired game mode using the provided controls in the game interface.

## 🤖 AI Opponent (Player vs. Computer)

When playing against the computer, the AI opponent uses the **Minimax algorithm** to determine its best move. The Minimax algorithm is a recursive decision-making algorithm used in game theory for minimizing the possible loss for a worst-case scenario.

Here's a simplified explanation of how it works in this Tic-Tac-Toe game:

* The AI explores all possible moves from the current board state.
* For each move, it recursively evaluates the resulting board state, assuming the opponent will also play optimally.
* It assigns a score to each possible outcome:
    * `+10`: Computer ('O') wins.
    * `-10`: Human player ('X') wins.
    * `0`: Draw.
* The AI aims to choose the move that maximizes its score (or minimizes the opponent's score).

The `bestMove()` function in the code implements this logic. It calls the `minimax()` function to evaluate potential moves and selects the one that leads to the best possible outcome for the computer. The `minimax()` function recursively explores the game tree, alternating between maximizing and minimizing levels until a terminal state (win, loss, or draw) is reached.

The AI also includes a check to block immediate winning moves by the human player, ensuring a more strategic opponent.

## 🏆 Winning Condition

A player wins the game if they get three of their marks ('X' or 'O') in a row, either horizontally, vertically, or diagonally.

## 🤝 Draw Condition

The game is a draw if all nine cells on the board are filled, and neither player has achieved a winning combination.

## 🔮 Possible Future Enhancements

* **Improved AI Difficulty Levels:** Implement different levels of AI difficulty by adjusting the depth of the Minimax search.
* **User Interface Improvements:** Enhance the visual design and user experience with animations or more styling.
* **Online Multiplayer:** Allow users to play against each other online.
* **Move History:** Display a history of the moves made during the game.
* **Persistent Score Tracking:** Store and display persistent win/loss records.

## ✍️ Author

[![GitHub](https://img.shields.io/badge/GitHub-Profile-lightgrey?style=for-the-badge&logo=github)](https://github.com/Koraleinav)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/koral-einav/)


---

Thank you for playing the Angular Tic-Tac-Toe game! Feel free to contribute or provide feedback.