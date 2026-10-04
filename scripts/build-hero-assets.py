"""Build a synchronized cross-faded loop. Requires ffmpeg, ffprobe and numpy.

The supplied full-width seated video uses --crop 1280:720:0:0. Change --crop for a new
source; this is an explicit art-directed crop, not automatic person detection.
Frames are never retimed; fps normalization only samples the source timestamps.
"""
import argparse, json, subprocess, tempfile, wave
from pathlib import Path
import numpy as np

def run(args):
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y',*map(str,args)],check=True)

def main():
    p=argparse.ArgumentParser()
    p.add_argument('source',type=Path); p.add_argument('--crop',default='1280:720:0:0')
    p.add_argument('--seconds',type=float,default=None); p.add_argument('--start',type=float,default=0)
    p.add_argument('--fade',type=float,default=.5); p.add_argument('--output',type=Path,default=Path('public/hero'))
    a=p.parse_args(); a.output.mkdir(parents=True,exist_ok=True)
    info=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_format','-show_streams','-of','json',str(a.source)]))
    source_duration=float(info['format']['duration'])-a.start
    duration=source_duration if a.seconds is None else min(a.seconds,source_duration)
    if duration <= 2*a.fade: raise ValueError('Clip must be longer than twice the fade.')
    if not any(s['codec_type']=='audio' for s in info['streams']): raise ValueError('Source needs an audio track.')
    # The output starts at t=fade. At the end, source tail blends into source
    # head; the next loop resumes at t=fade, giving synchronized picture/audio.
    rate=48000; fade=round(a.fade*rate); total=round(duration*rate)
    scratch=Path(__file__).resolve().parents[1]/'tmp'
    scratch.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(dir=scratch) as tmp:
        tmp=Path(tmp); raw=tmp/'audio.f32'; wav=tmp/'loop.wav'
        run(['-ss',a.start,'-i',a.source,'-t',duration,'-vn','-ar',rate,'-ac',2,'-f','f32le',raw])
        samples=np.fromfile(raw,dtype='<f4').reshape(-1,2)
        if len(samples)<total: samples=np.pad(samples,((0,total-len(samples)),(0,0)))
        samples=samples[:total]
        weight=np.linspace(0,1,fade,endpoint=False,dtype=np.float32)[:,None]
        blended=samples[-fade:]*(1-weight)+samples[:fade]*weight
        audio=np.concatenate((samples[fade:-fade],blended))
        with wave.open(str(wav),'wb') as w:
            w.setnchannels(2);w.setsampwidth(2);w.setframerate(rate)
            w.writeframes((np.clip(audio,-1,1)*32767).astype('<i2').tobytes())
        base=f'crop={a.crop},scale=1280:-2,fps=24,setsar=1,colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,format=yuv420p'
        graph=(f'[0:v]{base},split=2[body][head];'
               f'[body]trim=start={a.fade}:end={duration},setpts=PTS-STARTPTS[b];'
               f'[head]trim=start=0:end={a.fade},setpts=PTS-STARTPTS[h];'
               f'[b][h]xfade=transition=fade:duration={a.fade}:offset={duration-2*a.fade},format=yuv420p[v]')
        common=['-ss',a.start,'-t',duration,'-i',a.source,'-i',wav,'-filter_complex',graph,'-map','[v]','-map','1:a','-t',duration-a.fade]
        run([*common,'-c:v','libx264','-crf','24','-preset','slow','-c:a','aac','-b:a','96k','-movflags','+faststart',a.output/'hero.mp4'])
        run([*common,'-c:v','libvpx-vp9','-crf','36','-b:v','0','-cpu-used','3','-row-mt','1','-c:a','libopus','-b:a','80k',a.output/'hero.webm'])
        run(['-ss','1','-i',a.output/'hero.mp4','-frames:v','1','-c:v','libwebp','-quality','88',a.output/'poster.webp'])
    print(f'Built {duration-a.fade:.2f}s loop with synchronized audio in {a.output}')
if __name__=='__main__': main()
