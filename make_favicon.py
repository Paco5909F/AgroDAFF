from PIL import Image

def process_favicon(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    # Make square by adding transparent padding if not square, or crop
    w, h = img.size
    new_size = max(w, h)
    
    squared = Image.new("RGBA", (new_size, new_size), (255, 255, 255, 0))
    squared.paste(img, ((new_size - w) // 2, (new_size - h) // 2))
    img = squared

    # Remove white background
    datas = img.getdata()
    newData = []
    for item in datas:
        # If it's pure white or very close, make transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240 and item[3] > 100:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    # Resize to perfect 256x256 for icon
    img = img.resize((256, 256), Image.Resampling.LANCZOS)
    
    img.save(output_path, "PNG")
    print("Done generating perfect favicon at", output_path)

if __name__ == "__main__":
    process_favicon("/home/rogelio/.gemini/antigravity/brain/2e044bb1-85ce-4049-beba-7f9553b9f29d/media__1775759125096.png", "src/app/icon.png")
