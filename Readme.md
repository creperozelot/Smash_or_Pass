# Smash or Pass Game

Welcome to the **Smash or Pass** game! This interactive application presents users with a set of items, and they choose whether to "Smash" (like) or "Pass" (dislike) each item. The game is simple to set up and run with the provided instructions.

---

## Table of Contents
1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Game JSON Format](#game-json-format)
4. [Usage](#usage)
5. [License](#license)

---

## Installation

To set up the game, follow these steps:

1. **Clone the repository** to your local machine:
   ```bash
   git clone https://github.com/your-repo/smash-or-pass.git
   cd smash-or-pass
    ```
2. **Create Environment Variables:** Copy the example environment file and fill in the required details:
   ```bash
   cp .env.example .env
    ```
3. **Install Dependencies:** Install the necessary packages using npm:
    ```bash
    npm install
     ```
4. **Build the Application:** Start the application:
    ```bash
    node app.js
     ```
   
---

## Configuration
In the `.env` file, fill in any required details. This may include configuration settings such as API keys, database URLs, or any other environment-specific variables required by the game.

---

## Game JSON Format
To add custom games, create a JSON file with the following format:
```json
{
    "unique_id": "main",
    "display_name": "Test Game",
    "creator": "author",
    "items": [
        { "name": "Person", "image": "https://via.placeholder.com/150" },
        { "name": "Country", "image": "https://via.placeholder.com/150" },
        { "name": "Item", "image": "https://via.placeholder.com/150" }
    ]
}
```

### Sample JSON Explanation
- **unique_id:** Unique identifier for each game instance.
- **display_name:** Name of the game that will be displayed to users.
- **creator:** The creator of the game, used to attribute game creation.
- **items:** A list of objects representing each item, with:
   * **name:** Name of the item (e.g., "Person," "Country").
   * **image:** URL to an image representing the item.
    
