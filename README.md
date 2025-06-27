# GDRSM System

> LingoLah is a web application that helps people learn the Malay language through interactive flashcards, quizzes, videos, and a community forum.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [Contributing](#contributing)

## About

LingoLah is a website that helps people learn the Malay language in a fun and easy way. It has four main parts: flashcards to help you remember new words, quizzes to practice grammar and understanding, videos with subtitles to improve listening skills, and a forum where you can ask questions or chat with other learners. You can track your progress, join discussions, and use different types of learning tools all in one place. LingoLah is made for everyone, whether you are just starting out or already know some Malay.

Try the live application here: [LingoLah](https://lingolah.haziqrozaidi.me/)

## Features

- Practice and review Malay vocabulary using interactive flashcards with spaced repetition
- Take quizzes with different formats (multiple choice, fill-in-the-blank, matching) to reinforce grammar and comprehension
- Watch authentic Malay videos with subtitles and follow-up questions to improve listening skills
- Join a community forum to ask questions, share experiences, and discuss topics related to Malay language and culture

## Tech Stack

A list of technologies, frameworks, and tools used in the project. For example:

- **Frontend**: Vue.js, PrimeVue, TailwindCSS, Pinia
- **Backend**: Express.js, PostgreSQL, Prisma, Clerk
- **DevOps**: Docker, Coolify, DigitalOcean
- **Languages**: HTML, CSS, JavaScript, SQL

## Getting Started

Instructions on how to set up and use the project locally.

### Prerequisites

Before running the project, make sure you have the following installed:

- `Docker`

### Installation

Step-by-step instructions on how to install your project:

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   ```

2. **Create the environment configuration file**

   In the root directory of the project, create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

3. **Build the Docker containers**

   ```bash
   docker compose build
   ```

4. **Start the application**

   ```bash
   docker compose up
   ```

### Usage

Once the system is up and running, you can start using the application by following these steps:

1. Open your web browser and go to:  
   ```
   http://localhost:5173/
   ```

2. Log in using one of the following accounts:
   - **Admin**
     - Email: `admin@gmail.com`
     - Password: `cv27o6ot07`
   - **Learner**
     - Email: `learner@gmail.com`
     - Password: `cv27o6ot07`

3. After logging in, explore the features:
   - Practice vocabulary with flashcards
   - Take quizzes to test your knowledge
   - Watch Malay videos with subtitles
   - Join discussions in the forum

4. Track your progress and enjoy learning Malay!

## Contributing

We welcome contributions to **LingoLah**! If you'd like to contribute, follow these steps:

1. **Fork the Repository**  
   Click the "Fork" button at the top-right of this repository to create a copy of the project under your GitHub account.

2. **Create a Feature Branch**  
   After forking, create a new branch for your feature or bug fix:

   ```bash
   git checkout -b my-new-feature
   ```

3. **Make Your Changes**  
   Implement the changes or additions you want to contribute.

4. **Commit Your Changes**  
   Once you're happy with the changes, commit them with a clear and concise message:

   ```bash
   git commit -m 'Add a new feature or fix a bug'
   ```

5. **Push to Your Branch**  
   Push your changes to your forked repository:

   ```bash
   git push origin my-new-feature
   ```

6. **Create a Pull Request**  
   Go to your repository on GitHub and open a pull request to the main repository. Provide a description of the changes you’ve made.
