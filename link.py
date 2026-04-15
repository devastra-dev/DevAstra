import re

def convert_drive_link(link):
    # pattern to extract file ID
    match = re.search(r'/d/([a-zA-Z0-9_-]+)', link)
    
    if match:
        file_id = match.group(1)
        direct_link = f"https://drive.google.com/uc?export=download&id={file_id}"
        return direct_link
    else:
        return "❌ Invalid Google Drive link"

# input from user
link = input("Enter Google Drive link: ")
print("\n✅ Direct Download Link:")
print(convert_drive_link(link))