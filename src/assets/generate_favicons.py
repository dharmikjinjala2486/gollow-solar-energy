import os
from PIL import Image, ImageDraw

def draw_sun(size):
    # Create image with transparent background
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Scale factor from 24x24 viewBox
    scale = size / 24.0
    stroke_width = max(1, int(round(2.0 * scale)))
    
    # Yellow stroke color (#F9B233)
    yellow = (249, 178, 51, 255)
    
    # Draw central circle
    # circle cx=12, cy=12, r=4
    cx, cy, r = 12 * scale, 12 * scale, 4 * scale
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=yellow, width=stroke_width)
    
    # Draw the radiating rays
    # 24x24 lines
    lines = [
        # (x1, y1, x2, y2)
        (12, 2, 12, 4),
        (12, 20, 12, 22),
        (4.93, 4.93, 6.34, 6.34),
        (17.66, 17.66, 19.07, 19.07),
        (2, 12, 4, 12),
        (20, 12, 22, 12),
        (6.34, 17.66, 4.93, 19.07),
        (19.07, 4.93, 17.66, 6.34)
    ]
    
    for x1, y1, x2, y2 in lines:
        draw.line(
            [x1 * scale, y1 * scale, x2 * scale, y2 * scale],
            fill=yellow,
            width=stroke_width
        )
        
    return img

def main():
    public_dir = "/Users/dharmikjinjala/Downloads/GOL LOW SOLAR ENERGY SYSTEMS RENTAL/public"
    
    # 1. PNG sizes
    sizes = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "apple-touch-icon.png": 180,
        "android-chrome-192.png": 192,
        "android-chrome-512.png": 512,
        "mstile-150x150.png": 150
    }
    
    for filename, size in sizes.items():
        img = draw_sun(size)
        filepath = os.path.join(public_dir, filename)
        img.save(filepath, "PNG")
        print(f"Generated {filename} ({size}x{size})")
        
    # 2. Generate favicon.ico (contains 16x16 and 32x32)
    ico_path = os.path.join(public_dir, "favicon.ico")
    img_16 = draw_sun(16)
    img_32 = draw_sun(32)
    img_32.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32)])
    print("Generated favicon.ico")

if __name__ == "__main__":
    main()
