from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote
import hashlib,json
root=Path(__file__).resolve().parent/'dist'
class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=set();self.refs=[];self.h1=0;self.errors=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:
            if a['id'] in self.ids:self.errors.append('Duplicate ID: '+a['id'])
            self.ids.add(a['id'])
        if tag=='h1':self.h1+=1
        if tag=='img' and not a.get('alt'):self.errors.append('Missing image alt')
        if a.get('target')=='_blank' and 'noopener' not in a.get('rel',''):self.errors.append('Missing noopener')
        for key in ['href','src']:
            if a.get(key):self.refs.append(a[key])
pages={}
errors=[]
for path in root.rglob('*.html'):
    page=Page();page.feed(path.read_text(encoding='utf-8'));pages[path.resolve()]=page
    errors += [str(path.relative_to(root))+': '+e for e in page.errors]
    if page.h1!=1:errors.append(str(path)+': expected one h1')
checked=0
for path,page in pages.items():
    for ref in page.refs:
        parsed=urlparse(ref)
        if parsed.scheme or parsed.netloc:continue
        target=(path.parent/unquote(parsed.path)).resolve() if parsed.path else path
        if not target.is_file():errors.append(f'{path.name}: missing {ref}');continue
        if parsed.fragment and target in pages and parsed.fragment not in pages[target].ids:errors.append(f'{path.name}: missing fragment {ref}')
        checked+=1
report={'pages':len(pages),'local_references_checked':checked,'errors':errors,'sha256':{str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(root.rglob('*')) if p.is_file()}}
print(json.dumps(report,indent=2))
raise SystemExit(bool(errors))
