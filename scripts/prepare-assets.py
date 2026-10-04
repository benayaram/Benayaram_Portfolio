"""Prepare user-supplied images and download self-hosted fonts/official logos."""
from pathlib import Path
import argparse, shutil, urllib.request
from PIL import Image, ImageOps, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
def download(url, dest):
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=45) as r: dest.write_bytes(r.read())
    print(dest.relative_to(ROOT), flush=True)

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--source', type=Path, required=True)
    p.add_argument('--portrait', type=Path, required=True)
    a=p.parse_args()
    public=ROOT/'public'
    for folder in ['projects','certificates','logos','hero']: (public/folder).mkdir(parents=True,exist_ok=True)
    shutil.copy2(a.source/'Benayaram_Rekha - Flutter.pdf',public/'Benayaram-Rekha-Resume.pdf')
    shutil.copy2(a.source/'Senior Devloper intern -RCTS.jpg',public/'certificates/senior-developer-intern.jpg')
    for name,source in [('tega','Tega App.webp'),('hrm','Empiqo HRM app.png'),('ao-crm','AO CRM  Website.png'),('fbgl','FBGL ministries app.png')]:
        im=Image.open(a.source/source).convert('RGB'); im.thumbnail((1400,900))
        im.save(public/f'projects/{name}.webp',quality=87)
    portrait=ImageOps.fit(Image.open(a.portrait).convert('RGB'),(480,600),centering=(.5,.35))
    portrait.save(public/'portrait-bust.webp',quality=90)
    og=Image.new('RGB',(1200,630),'#f4f2ee'); og.paste(ImageOps.fit(portrait,(420,525)),(740,55))
    d=ImageDraw.Draw(og)
    fontpath='C:/Windows/Fonts/arial.ttf'
    for text,xy,size in [('BENAYARAM REKHA',(65,180),46),('Software Developer',(65,265),36),('Flutter / Web / Android',(65,340),23)]:
        d.text(xy,text,fill='#0d0d0d',font=ImageFont.truetype(fontpath,size))
    og.save(public/'og.jpg',quality=90)
    fonts=ROOT/'src/fonts'; fonts.mkdir(parents=True,exist_ok=True)
    for package,file,out in [
        ('@fontsource-variable/inter-tight','inter-tight-latin-wght-normal.woff2','inter-tight-latin.woff2'),
        ('@fontsource/instrument-serif','instrument-serif-latin-400-normal.woff2','instrument-serif-latin.woff2'),
        ('@fontsource/instrument-serif','instrument-serif-latin-400-italic.woff2','instrument-serif-italic-latin.woff2'),
        ('@fontsource-variable/jetbrains-mono','jetbrains-mono-latin-wght-normal.woff2','jetbrains-mono-latin.woff2')]:
        download(f'https://cdn.jsdelivr.net/npm/{package}/files/{file}',fonts/out)
        download(f'https://cdn.jsdelivr.net/npm/{package}/LICENSE',fonts/(package.split('/')[-1]+'-LICENSE.txt'))
    logos=['flutter','dart','android','kotlin','react','html5','css3','javascript','materialui','bootstrap','nodejs','firebase','flask','postgresql','mysql','sqlite','python','git','github','jira','androidstudio','vscode','postman']
    for logo in logos:
        download(f'https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/{logo}/{logo}-original.svg',public/f'logos/{logo}.svg')
    download('https://raw.githubusercontent.com/devicons/devicon/v2.17.0/LICENSE',public/'logos/LICENSE')
if __name__=='__main__': main()
