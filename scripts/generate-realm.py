"""Generate the original block-built DSC island. No external art or dependencies."""
from pathlib import Path
import random
random.seed(17)
shapes=[]
def project(x,y,z): return (760+(x-y)*25,180+(x+y)*12.5-z*25)
def polygon(points,color): return '<polygon points="'+' '.join(f'{x:g},{y:g}' for x,y in points)+f'" fill="{color}"/>'
def block(x,y,z,w=1,d=1,h=1,colors=('#75ac57','#426d3c','#527f44'),texture=False):
    a,b,c,e=[project(*p) for p in [(x,y,z+h),(x+w,y,z+h),(x+w,y+d,z+h),(x,y+d,z+h)]]
    f,g,j=[project(*p) for p in [(x+w,y,z),(x+w,y+d,z),(x,y+d,z)]]
    s=polygon([b,c,g,f],colors[1])+polygon([c,e,j,g],colors[2])+polygon([a,b,c,e],colors[0])
    if texture:
        for dx,dy in [(0.1,0.12),(.55,.6)]:
            s+=polygon([project(x+dx,y+dy,z+h+.005),project(x+dx+.22,y+dy,z+h+.005),project(x+dx+.22,y+dy+.25,z+h+.005),project(x+dx,y+dy+.25,z+h+.005)],random.choice(['#8dbb5d','#649946','#9bc269']))
    shapes.append((x+y+w+d,z,s))
def group(start,depth):
    parts=shapes[start:]; del shapes[start:]
    shapes.append((depth,0,"".join(s for _,_,s in parts)))
def tree(x,y):
    start=len(shapes)
    block(x+.35,y+.35,1, .5,.5,2.5,('#a57a48','#533d2e','#705136'))
    for z,w in [(2.8,2.7),(3.7,2.2),(4.4,1.3)]:block(x+1-w/2,y+1-w/2,z,w,w,.9,('#548c49','#244b39','#376941'))
    group(start,x+y+3)
def house(x,y,w,d,color):
    start=len(shapes)
    block(x,y,1,w,d,2.1,('#d8be8c','#806c50','#ac9264'))
    for i in range(3):block(x-.3+i*.4,y-.3+i*.4,3.1+i*.4,w+.6-i*.8,d+.6-i*.8,.42,color)
    block(x+w-.03,y+.5,1.7,.07,.7,.8,('#80dbe0','#74dce6','#3d929f'))
    block(x+.8,y+d-.01,1,.7,.04,1.35,('#805a36','#3b3027','#574332'))
    block(x+2,y+d-.01,1.7,.7,.04,.7,('#80dbe0','#74dce6','#5cb9c4'))
    group(start,x+y+w+d)
# Irregular grass island and exposed dirt/stone cliff faces.
for x in range(23):
    for y in range(21):
        if ((x-11)/12)**2+((y-10)/11)**2>1.06:continue
        h=random.choice([2,2.5,3,3.5])
        block(x,y,-h,1,1,h+1,('#537542','#4a3c34','#6b503b'))
        water=10<=x<=13 and 3<=y<=15
        path=(y in (11,12) or x in (7,8)) and not water
        colors=('#55b9c8','#286a89','#388eaa') if water else (('#d4bb7f','#997c4e','#ad915e') if path else ('#77a951','#456d36','#5b813f'))
        block(x,y,.85,1,1,.15,colors,not water and not path)
        if x in (20,21) or y in (18,19):
            if random.random()<.4:block(x,y,-1.7,1,1,.4,('#6c7771','#3e4847','#58615d'))
# Bridge, club house, lab, studio, command station.
block(9.5,10.7,1.15,5,2.6,.2,('#bfa078','#70553c','#93704f'))
for y in (10.65,13.25):
    block(9.5,y,1.3,5,.13,.65,('#a3885f','#5c4933','#80633f'))
house(3,6,4,3,('#b37049','#75412e','#935033'))
house(15,4,3,3,('#4cb6b4','#286c78','#398b91'))
house(15,14,3,3,('#b283bc','#664c82','#8c6098'))
house(5,15,3,2.5,('#638699','#364d69','#49647f'))
# Beacon tower and luminous cap.
tower_start=len(shapes)
block(17,8,1,2,2,4,('#b1b3a1','#687d78','#89988a'))
block(16.6,7.6,5,2.8,2.8,.5,('#d1d5ba','#7f968e','#a0b7a7'))
block(17.4,8.4,5.5,1.2,1.2,1,('#d1fff4','#57d3cb','#94efdd'))
group(tower_start,29)
# Obsidian portal.
for x in (4,7):block(x,2,1, .7,.9,4.8,('#665678','#262638','#41354e'))
block(4,2,5.5,3.7,.9,.7,('#6d5b85','#2a293c','#463a55'))
block(4.7,2.3,1.2,2.3,.2,4.3,('#ca96f5','#9355d3','#b775e7'))
block(5.1,2.55,1.8,.18,.03,2.6,('#e2b9ff','#d393ff','#dba4ff'))
# Arena stepped seats.
for i in range(3):block(15+i*.3,18+i*.3,1+i*.35,4-i*.6,1.5-i*.3,.4,('#b7aa87','#77715b','#968b6f'))
# Trees around the border.
for x,y in [(2,10),(2,14),(5,19),(9,18),(19,12),(20,7),(12,1),(8,1),(17,2),(0,8)]:tree(x,y)
# Torch lights and flower blocks.
for x,y in [(7,10),(8,14),(14,10),(14,13),(4,12),(18,12)]:
    block(x,y,1,.16,.16,.7,('#b18c50','#705637','#917149'));block(x-.1,y-.1,1.7,.36,.36,.3,('#ffe69a','#e9a04c','#ffc56b'))
for x,y in [(5,13),(3,16),(19,16),(7,5),(9,8),(14,6)]:
    block(x,y,1,.15,.15,.4,('#789a48','#3d723a','#518547'));block(x-.13,y-.13,1.35,.4,.4,.15,('#f2c981','#cd7656','#e89b65'))
# Explorer character near the bridge, facing the village.
block(8.9,10,1,.28,.3,.65,('#474b69','#303c55','#3d4c67'));block(9.3,10,1,.28,.3,.65,('#474b69','#303c55','#3d4c67'))
block(8.85,9.9,1.65,.8,.5,.8,('#57c4c1','#267e91','#39a2ad'))
block(8.92,9.9,2.45,.65,.55,.65,('#845f46','#bb8d69','#d9ad81'))
shapes.sort(key=lambda p:(p[0],p[1]))
svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="100 60 1300 850" role="img"><title>The DSC world: a block-built island with a village, lab, portal, and beacon</title>'
svg+='<path d="M765 382 1300 655 760 925 210 650Z" fill="#070f1b" opacity=".28"/>'
svg+=''.join(s for _,_,s in shapes)+'</svg>'
Path('public/dsc-realm.svg').write_text(svg)
