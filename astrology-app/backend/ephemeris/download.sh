#!/bin/bash

# Swiss Ephemeris Data Files Downloader
# Downloads ephemeris data files from astro.com

echo "Swiss Ephemeris Data Files Downloader"
echo "======================================"
echo ""

BASE_URL="https://www.astro.com/ftp/swisseph/ephe"

# Required files for accurate calculations
FILES=(
    "seas_18.se1"  # Asteroids
    "semo_18.se1"  # Moon
    "sepl_18.se1"  # Planets
)

echo "This script will download the following files:"
for file in "${FILES[@]}"; do
    echo "  - $file"
done
echo ""
echo "Total size: ~150MB"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Download cancelled."
    exit 1
fi

# Download files
for file in "${FILES[@]}"; do
    echo "Downloading $file..."
    curl -O "$BASE_URL/$file"
    
    if [ $? -eq 0 ]; then
        echo "✓ $file downloaded successfully"
    else
        echo "✗ Failed to download $file"
    fi
    echo ""
done

echo "Download complete!"
echo ""
echo "Files are now ready for use with Swiss Ephemeris."
echo "Make sure EPHEMERIS_PATH in .env points to this directory."
