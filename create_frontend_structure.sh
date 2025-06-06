#!/bin/bash

# This script will create a React frontend project + custom folder structure for MeneNet

# Project name
PROJECT_NAME="frontend"

echo "🚀 Creating React project: $PROJECT_NAME"

# Create React app
npx create-react-app $PROJECT_NAME

# Go into project folder
cd $PROJECT_NAME || exit

# Create custom folders
echo "🚀 Creating folders: services/, pages/, components/"

mkdir -p src/services
mkdir -p src/pages
mkdir -p src/components

# Create base files
echo "🚀 Creating base files..."

touch src/services/api.js
touch src/pages/UsersPage.js
touch src/pages/UserProfilePage.js
touch src/pages/LoginPage.js
touch src/components/UserCard.js
touch src/components/FamilyTree.js

# Show structure
echo "🚀 Frontend structure created:"
tree -L 2 src

echo "✅ Done! Now run:"
echo "cd $PROJECT_NAME"
echo "npm install"
echo "npm start"
