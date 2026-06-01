import sys
import os
import subprocess

# Ensure PIL is installed
try:
    from PIL import Image
except ImportError:
    print("Installing Pillow...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

def make_background_transparent(image_path, output_path):
    if not os.path.exists(image_path):
        print(f"Error: {image_path} does not exist.")
        return
        
    print(f"Processing {image_path}...")
    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    
    pixels = img.load()
    
    # Helper to check if a pixel is white-ish (RGB > 240)
    def is_white(x, y):
        r, g, b, a = pixels[x, y]
        # Check if color is close to white
        return r > 240 and g > 240 and b > 240
        
    visited = set()
    transparent_pixels = set()
    
    # We will do a flood fill from the 4 corners and the border pixels
    # to ensure all background white pixels are cleared even if they touch the border
    to_visit = []
    # Corners
    to_visit.extend([(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)])
    # Borders
    for x in range(width):
        to_visit.append((x, 0))
        to_visit.append((x, height-1))
    for y in range(height):
        to_visit.append((0, y))
        to_visit.append((width-1, y))
        
    queue = []
    for pt in to_visit:
        if pt not in visited and is_white(*pt):
            queue.append(pt)
            visited.add(pt)
            
    while queue:
        x, y = queue.pop(0)
        transparent_pixels.add((x, y))
        
        # Check 4 neighbors
        for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited and is_white(nx, ny):
                    visited.add((nx, ny))
                    queue.append((nx, ny))
                    
    # Now set the alpha of all flood-filled pixels to 0
    for x, y in transparent_pixels:
        r, g, b, a = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        
    img.save(output_path, "PNG")
    print(f"Saved transparent image to {output_path}")

if __name__ == "__main__":
    make_background_transparent("assets/images/hijab_teacher.png", "assets/images/hijab_teacher.png")
    make_background_transparent("assets/images/hijab_student.png", "assets/images/hijab_student.png")
