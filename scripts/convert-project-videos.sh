#!/bin/bash
# convert-project-videos.sh
# Batch convert videos for the adaptive video system

PROJECT_NAME="$1"
SQUARE_SOURCE="$2"
WIDE_SOURCE="$3"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check arguments
if [ -z "$PROJECT_NAME" ] || [ -z "$SQUARE_SOURCE" ] || [ -z "$WIDE_SOURCE" ]; then
    print_error "Missing required arguments"
    echo "Usage: $0 <project-name> <square-source.mov> <wide-source.mov>"
    echo ""
    echo "Example:"
    echo "  $0 \"my-project\" \"source-1x1.mov\" \"source-16x9.mov\""
    exit 1
fi

# Check if source files exist
if [ ! -f "$SQUARE_SOURCE" ]; then
    print_error "Square source file not found: $SQUARE_SOURCE"
    exit 1
fi

if [ ! -f "$WIDE_SOURCE" ]; then
    print_error "Wide source file not found: $WIDE_SOURCE"
    exit 1
fi

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    print_error "ffmpeg is not installed. Please install it first:"
    echo "  macOS: brew install ffmpeg"
    echo "  Ubuntu: sudo apt install ffmpeg"
    exit 1
fi

print_status "Converting videos for project: $PROJECT_NAME"
print_status "Square source: $SQUARE_SOURCE"
print_status "Wide source: $WIDE_SOURCE"
echo ""

# Create output directory if it doesn't exist
mkdir -p output

# Square versions
print_status "Creating square versions..."
ffmpeg -y -i "$SQUARE_SOURCE" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus "output/${PROJECT_NAME}-square.webm" -loglevel warning
if [ $? -eq 0 ]; then
    print_success "Created ${PROJECT_NAME}-square.webm"
else
    print_error "Failed to create square WebM"
fi

ffmpeg -y -i "$SQUARE_SOURCE" -c:v libx264 -profile:v baseline -crf 23 -c:a aac -movflags +faststart "output/${PROJECT_NAME}-square.mp4" -loglevel warning
if [ $? -eq 0 ]; then
    print_success "Created ${PROJECT_NAME}-square.mp4"
else
    print_error "Failed to create square MP4"
fi

# Wide versions
print_status "Creating wide versions..."
ffmpeg -y -i "$WIDE_SOURCE" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus "output/${PROJECT_NAME}-wide.webm" -loglevel warning
if [ $? -eq 0 ]; then
    print_success "Created ${PROJECT_NAME}-wide.webm"
else
    print_error "Failed to create wide WebM"
fi

ffmpeg -y -i "$WIDE_SOURCE" -c:v libx264 -profile:v baseline -crf 23 -c:a aac -movflags +faststart "output/${PROJECT_NAME}-wide.mp4" -loglevel warning
if [ $? -eq 0 ]; then
    print_success "Created ${PROJECT_NAME}-wide.mp4"
else
    print_error "Failed to create wide MP4"
fi

# Compatible versions (from wide source)
print_status "Creating compatible fallback versions..."
ffmpeg -y -i "$WIDE_SOURCE" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus "output/${PROJECT_NAME}-compatible.webm" -loglevel warning
if [ $? -eq 0 ]; then
    print_success "Created ${PROJECT_NAME}-compatible.webm"
else
    print_error "Failed to create compatible WebM"
fi

ffmpeg -y -i "$WIDE_SOURCE" -c:v libx264 -profile:v baseline -crf 23 -c:a aac -movflags +faststart "output/${PROJECT_NAME}-compatible.mp4" -loglevel warning
if [ $? -eq 0 ]; then
    print_success "Created ${PROJECT_NAME}-compatible.mp4"
else
    print_error "Failed to create compatible MP4"
fi

# Simple version (smaller, final fallback)
print_status "Creating simple fallback version..."
ffmpeg -y -i "$WIDE_SOURCE" -c:v libx264 -profile:v baseline -crf 26 -c:a aac -movflags +faststart "output/${PROJECT_NAME}-simple.mp4" -loglevel warning
if [ $? -eq 0 ]; then
    print_success "Created ${PROJECT_NAME}-simple.mp4"
else
    print_error "Failed to create simple MP4"
fi

echo ""
print_success "✅ Conversion complete for $PROJECT_NAME"
echo ""
print_status "Files created in output/ directory:"
ls -lah output/"${PROJECT_NAME}"-*.{webm,mp4} 2>/dev/null | awk '{print "  " $5 " " $9}' | sed 's|output/||'

echo ""
print_status "Next steps:"
echo "  1. Copy files to your project directory:"
echo "     cp output/${PROJECT_NAME}-*.{webm,mp4} source/_posts/Your-Project-Name/"
echo ""
echo "  2. Copy files to public directory:"
echo "     cp output/${PROJECT_NAME}-*.{webm,mp4} public/YYYY/MM/DD/Your-Project-Name/"
echo ""
echo "  3. Update your project markdown:"
echo "     cover_image: /YYYY/MM/DD/Your-Project-Name/${PROJECT_NAME}-simple.mp4"
echo ""
print_warning "Remember to use ${PROJECT_NAME}-simple.mp4 as your cover_image path!" 