import os
import shutil

# Define paths
src_images = {
    'welcome_bg.png': r'C:\Users\Lenovo\.gemini\antigravity\brain\781e7879-4008-44c9-8849-2bf10e13ab93\welcome_bg_1780307651391.png',
    'instruction_kid.png': r'C:\Users\Lenovo\.gemini\antigravity\brain\781e7879-4008-44c9-8849-2bf10e13ab93\instruction_kid_1780307685698.png',
    'tujuan_kid.png': r'C:\Users\Lenovo\.gemini\antigravity\brain\781e7879-4008-44c9-8849-2bf10e13ab93\tujuan_kid_1780307706966.png',
    'menu_boy_stilts.png': r'C:\Users\Lenovo\.gemini\antigravity\brain\781e7879-4008-44c9-8849-2bf10e13ab93\menu_boy_stilts_1780307730533.png',
    'adventure_kids.png': r'C:\Users\Lenovo\.gemini\antigravity\brain\781e7879-4008-44c9-8849-2bf10e13ab93\adventure_kids_1780307753322.png'
}

dest_dir = r'c:\Users\Lenovo\Documents\UG\metodebelajar1\assets\images'

def main():
    # Create directories
    os.makedirs(dest_dir, exist_ok=True)
    os.makedirs(r'c:\Users\Lenovo\Documents\UG\metodebelajar1\css', exist_ok=True)
    os.makedirs(r'c:\Users\Lenovo\Documents\UG\metodebelajar1\js', exist_ok=True)
    
    print("Directories created.")
    
    # Copy files
    for filename, src_path in src_images.items():
        dest_path = os.path.join(dest_dir, filename)
        if os.path.exists(src_path):
            shutil.copy(src_path, dest_path)
            print(f"Copied {src_path} to {dest_path}")
        else:
            print(f"Warning: Source path {src_path} does not exist!")

if __name__ == '__main__':
    main()
