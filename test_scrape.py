import urllib.request
import re

try:
    req = urllib.request.Request('https://satu.xl.co.id/', headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    files = set(re.findall(r'https?://[^\s\"\'\>]+', html))
    api_or_data = [f for f in files if 'json' in f or 'api' in f or 'map' in f or 'coverage' in f]
    for f in api_or_data:
        print(f)
except Exception as e:
    print('Failed:', e)
