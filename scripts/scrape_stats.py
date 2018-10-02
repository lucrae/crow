import urllib
from bs4 import BeautifulSoup
import csv

# specify the url
def get_scores(eco):
    url = f'https://www.365chess.com/eco/{eco}'
    page = urllib.request.urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    white_score = soup.find('td', attrs={'background': 'https://www.365chess.com/images/opbkw.gif.pagespeed.ce.Orrko29Ywq.gif'}).text.strip()
    draw_score = soup.find('td', attrs={'background': 'https://www.365chess.com/images/opbkd.gif.pagespeed.ce.eddg-sJv3Z.gif'}).text.strip()
    black_score = soup.find('td', attrs={'background': 'https://www.365chess.com/images/opbkb.gif.pagespeed.ce.lw33PDRZL2.gif'}).text.strip()
    
    return white_score, draw_score, black_score

eco_list = []

for c in ['A', 'B', 'C', 'D', 'E']:
    for i in range(0, 100):
        if i < 10:
            eco_list.append(f'{c}0{i}')
        else:
            eco_list.append(f'{c}{i}')

with open('openings_scores.csv', 'w') as csvfile:
    writer = csv.writer(csvfile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)

    for eco in eco_list:
        white_score, draw_score, black_score = get_scores(eco)
        writer.writerow([f'"{eco}"', f'"{white_score[:-1]}"', f'"{draw_score[:-1]}"', f'"{black_score[:-1]}"'])
        print(f'[{eco}]: WRITTEN [{eco}, {white_score}, {draw_score}, {black_score}]')