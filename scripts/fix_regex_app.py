with open("public/app.js", "r") as f:
    text = f.read()

# Fix broken regex
text = text.replace(".replace(/### (.*?)\n/g", ".replace(/### (.*?)\\n/g")

with open("public/app.js", "w") as f:
    f.write(text)

print("Regex syntax fixed in public/app.js")
