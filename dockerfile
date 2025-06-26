FROM node:20

# Install yt-dlp and ffmpeg
RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    ffmpeg \
    python3-pip && \
    pip3 install --upgrade pip && \
    pip3 install yt-dlp && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Expose the port your app listens on
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
