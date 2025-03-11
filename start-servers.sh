#!/bin/bash

# Start-servers.sh - Script to start both the Yahoo Finance proxy and Cohere Analysis Assistant servers
# This script ensures both servers are running and will restart them if they crash

echo "Starting Corp-analyst servers..."

# Function to check if a port is in use
is_port_in_use() {
  lsof -i :$1 > /dev/null 2>&1
  return $?
}

# Function to start the Yahoo Finance proxy server (port 3001)
start_yahoo_server() {
  echo "Starting Yahoo Finance proxy server on port 3001..."
  cd "$(dirname "$0")/server"
  node server.js &
  YAHOO_PID=$!
  echo "Yahoo Finance proxy server started with PID: $YAHOO_PID"
}

# Function to start the Cohere Analysis Assistant server (port 3000)
start_cohere_server() {
  echo "Starting Cohere Analysis Assistant server on port 3000..."
  cd "$(dirname "$0")/corp-analyst-app"
  node src/index.js &
  COHERE_PID=$!
  echo "Cohere Analysis Assistant server started with PID: $COHERE_PID"
}

# Check if Yahoo Finance server is already running
if is_port_in_use 3001; then
  echo "Yahoo Finance proxy server is already running on port 3001"
else
  start_yahoo_server
fi

# Check if Cohere Analysis Assistant server is already running
if is_port_in_use 3000; then
  echo "Cohere Analysis Assistant server is already running on port 3000"
else
  start_cohere_server
fi

echo "Both servers are now running."
echo "- Yahoo Finance proxy: http://localhost:3001"
echo "- Cohere Analysis Assistant: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to press Ctrl+C
trap 'echo "Stopping servers..."; kill $YAHOO_PID $COHERE_PID 2>/dev/null; exit 0' INT TERM

# Keep script running
while true; do
  # Check if Yahoo Finance server is still running
  if ! is_port_in_use 3001 && [ -n "$YAHOO_PID" ]; then
    echo "Yahoo Finance proxy server has stopped. Restarting..."
    start_yahoo_server
  fi
  
  # Check if Cohere Analysis Assistant server is still running
  if ! is_port_in_use 3000 && [ -n "$COHERE_PID" ]; then
    echo "Cohere Analysis Assistant server has stopped. Restarting..."
    start_cohere_server
  fi
  
  sleep 5
done
