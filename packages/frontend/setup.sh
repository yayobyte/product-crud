# This script helps Vercel install dependencies
echo "Setting up Node and pnpm..."

# Use Node.js 20.x
export NODE_VERSION=20

# Install pnpm
echo "Installing pnpm..."
npm install -g pnpm@9

# Install dependencies
echo "Installing dependencies..."
pnpm install --no-frozen-lockfile

echo "Setup complete!"
