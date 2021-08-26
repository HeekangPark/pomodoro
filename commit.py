import sys
import os

with open("package.json", "r") as f:
    lines = f.readlines()

version = [int(x) for x in lines[2].strip().split(": ")[1].split(",")[0][1:-1].split(".")]

if len(sys.argv) > 1:
    if sys.argv[1] == "+":
        version[2] = version[2] + 1
    elif sys.argv[1] == "++":
        version[1] = version[1] + 1
        version[2] = 0
    elif sys.argv[1] == "+++":
        version[0] = version[0] + 1
        version[1] = 0
        version[2] = 0

version = f"{'.'.join([str(x) for x in version])}"
print(f"commiting v{version}")

with open("package.json", "w") as f:
    lines[2] = f'  "version": "{version}",\n'
    f.write(''.join(lines))

with open("src/store/index.js", "r") as f:
    lines = f.readlines()

with open("src/store/index.js", "w") as f:
    lines[0] = f'const VERSION = "{version}"\n'
    f.write(''.join(lines))

with open("src/service-worker.js", "r") as f:
    lines = f.readlines()

with open("src/service-worker.js", "w") as f:
    lines[0] = f'const VERSION = "{version}"\n'
    f.write(''.join(lines))

os.system("yarn build")
os.system("git add .")
os.system(f"git commit -m v{version}")
os.system("git push origin v1")