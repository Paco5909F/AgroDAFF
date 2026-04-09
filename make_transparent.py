from PIL import Image

def remove_white(input_path, output_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()
        
        newData = []
        # threshold for white
        for item in datas:
            if item[0] >= 240 and item[1] >= 240 and item[2] >= 240:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
                
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully converted {input_path} to {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

remove_white("public/images/logo-agrodaff.jpg", "public/images/logo-agrodaff.png")
remove_white("src/app/icon.jpg", "src/app/icon.png")
