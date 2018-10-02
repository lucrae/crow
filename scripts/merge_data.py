import csv

opening_scores = {}

with open('openings_scores.csv', 'r') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='"')

    for row in reader:
        opening_scores[row[0]] = [row[1], row[2], row[3]]

opening_data = []

with open('openings.csv', 'r') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='"')

    for row in reader:
        try:
            eco = row[0]
            name = row[1]
            moves = row[2]
            white = opening_scores[eco][0]
            draw = opening_scores[eco][1]
            black = opening_scores[eco][2]
            opening_data.append([eco, name, moves, white, draw, black])
        except KeyError as e:
            print(e)

with open('openings_data.csv', 'w') as csvfile:
    writer = csv.writer(csvfile, delimiter=',', quotechar='"')

    writer.writerow(['openingECO', 'openingName', 'openingMoves', 'openingWhiteScore', 'openingDrawScore', 'openingBlackScore'])
    for row in opening_data:
        writer.writerow(row)
        print(f'MERGED {row}')