import csv

opening_scores = {}

with open('openings_scores.csv', 'r') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='"')

    for row in reader:
        opening_scores[row[0]] = [row[1], row[2], row[3]]

print(f'OPENING SCORES COLLECTED [{len(opening_scores)}]')

opening_data = []

with open('openings.csv', 'r') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='"')

    for row in reader:
        try:
            eco = row[0].rstrip()
            name = row[1].rstrip()
            moves = row[2].rstrip()
            white = opening_scores[eco][0]
            draw = opening_scores[eco][1]
            black = opening_scores[eco][2]
            opening_data.append([eco, name, moves, white, draw, black])
        except KeyError as e:
            print(e)

print(f'OPENING DATA MERGED [{len(opening_data)}]')

sorted_opening_data = sorted(opening_data, key=lambda item: (int(item.partition(' ')[0]) if item[0].isdigit() else float('inf'), item))

print(f'OPENING DATA SORTED [{len(opening_data)}]')

with open('openings_data.csv', 'w') as csvfile:
    writer = csv.writer(csvfile, delimiter=',', quotechar='"')

    writer.writerow(['openingECO', 'openingName', 'openingMoves', 'openingWhiteScore', 'openingDrawScore', 'openingBlackScore'])
    for row in sorted_opening_data:
        writer.writerow(row)
        print(f'WROTE {row}')

print(f'OPENING DATA WROTE [{len(opening_data)}]')
