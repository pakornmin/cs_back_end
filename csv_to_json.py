import csv
from email import header
import json
from operator import index

with open("table.csv", "r") as f:
    reader = csv.reader(f)
    data = {"companies": []}
    index = next(reader)
    for row in reader:
        # has 55 indexes 0-54
        new_entry = {}
        for i in range(0, 2):
            new_entry[index[i]] = row[i]
        new_entry[index[2]] = int(row[2])
        contributions = []
        for i in range(0, 49):
            contributions.append(int(row[i+3]))
        new_entry["contributions"] = contributions
        top_three = [row[52], row[53], row[54]]
        new_entry["top_three"] = top_three
        new_entry["category"] = ""
        new_entry["iconPath"] = ""
        data["companies"].append(new_entry)
    with open("data.json", "w") as f:
        json.dump(data, f, indent=4)
