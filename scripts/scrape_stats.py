import urllib
from bs4 import BeautifulSoup
import csv

def get_eco_info():
    url = 'http://www.chessgames.com/chessecohelp.html'
    page = urllib.request.urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    items = soup.find('table').findChildren('tr', recursive=False)
    eco_info = {}
    for item in items:
        elements = item.findChildren('td')
        eco_info[elements[0].text.strip()] = elements[1].find('b').text.strip()

    return eco_info

# specify the url
def get_scores(eco):
    url = f'https://www.365chess.com/eco/{eco}'
    page = urllib.request.urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    games_played = soup.find('table', attrs={'class': 'light'}).find('tr').findChildren('td', recursive=False)[1].text.strip()
    white_score = soup.find('td', attrs={'background': 'https://www.365chess.com/images/opbkw.gif.pagespeed.ce.Orrko29Ywq.gif'}).text.strip()
    draw_score = soup.find('td', attrs={'background': 'https://www.365chess.com/images/opbkd.gif.pagespeed.ce.eddg-sJv3Z.gif'}).text.strip()
    black_score = soup.find('td', attrs={'background': 'https://www.365chess.com/images/opbkb.gif.pagespeed.ce.lw33PDRZL2.gif'}).text.strip()

    return games_played, white_score, draw_score, black_score

eco_info = get_eco_info()

eco_list = []
total_games_played = 0 # 15185230

for c in ['A', 'B', 'C', 'D', 'E']:
    for i in range(0, 100):
        if i < 10:
            eco_list.append(f'{c}0{i}')
        else:
            eco_list.append(f'{c}{i}')

with open('openings_stats.csv', 'w') as csvfile:
    writer = csv.writer(csvfile, delimiter=',', quotechar='"')

    for eco in eco_list:
        games_played, white_score, draw_score, black_score = get_scores(eco)
        subcategory = eco_info[eco]
        total_games_played += int(games_played)

        writer.writerow([eco, subcategory, games_played, white_score[:-1], draw_score[:-1], black_score[:-1]])
        print(f'[{eco}]: WRITTEN [{eco}, {subcategory}, {games_played}, {white_score}, {draw_score}, {black_score}]')

print(f'TOTAL GAMES PLAYED: {total_games_played}')
