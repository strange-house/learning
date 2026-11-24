from PIL import Image, ImageDraw
import os

INDIGO = (76, 111, 255, 255)   # #4C6FFF
WHITE = (255, 255, 255, 255)
TRANSPARENT = (0, 0, 0, 0)

def draw_book(d, cx, cy, scale, color):
    half_w = int(280 * scale)
    half_h = int(144 * scale)
    gap = int(10 * scale)
    radius = int(44 * scale)
    lw = max(1, int(14 * scale))
    lr = max(1, int(7 * scale))
    line_color = WHITE if color[3] != 0 else (255, 255, 255, 255)
    # left page
    d.rounded_rectangle([cx - half_w, cy - half_h, cx - gap, cy + half_h], radius=radius, fill=color)
    # right page
    d.rounded_rectangle([cx + gap, cy - half_h, cx + half_w, cy + half_h], radius=radius, fill=color)
    # page lines (white)
    d.rounded_rectangle([cx - half_w + int(40*scale), cy - int(56*scale), cx - gap - int(40*scale), cy - int(56*scale) + lw], radius=lr, fill=line_color)
    d.rounded_rectangle([cx - half_w + int(40*scale), cy - int(12*scale), cx - gap - int(72*scale), cy - int(12*scale) + lw], radius=lr, fill=line_color)
    d.rounded_rectangle([cx + gap + int(40*scale), cy - int(56*scale), cx + half_w - int(40*scale), cy - int(56*scale) + lw], radius=lr, fill=line_color)
    d.rounded_rectangle([cx + gap + int(72*scale), cy - int(12*scale), cx + half_w - int(40*scale), cy - int(12*scale) + lw], radius=lr, fill=line_color)

base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets')
os.makedirs(base, exist_ok=True)

# icon.png（白底 + 靛蓝打开的书）
img = Image.new('RGBA', (1024, 1024), WHITE)
draw_book(ImageDraw.Draw(img), 512, 512, 1.0, INDIGO)
img.save(os.path.join(base, 'icon.png'))
print('icon.png')

# adaptive-icon.png（透明底，前景图）
img2 = Image.new('RGBA', (1024, 1024), TRANSPARENT)
draw_book(ImageDraw.Draw(img2), 512, 512, 0.8, INDIGO)
img2.save(os.path.join(base, 'adaptive-icon.png'))
print('adaptive-icon.png')

# splash.png（白底 + 稍小的书）
img3 = Image.new('RGBA', (1024, 1024), WHITE)
draw_book(ImageDraw.Draw(img3), 512, 512, 0.5, INDIGO)
img3.save(os.path.join(base, 'splash.png'))
print('splash.png')

# favicon.png（缩小的图标）
img4 = img.resize((64, 64), Image.LANCZOS)
img4.save(os.path.join(base, 'favicon.png'))
print('favicon.png')
