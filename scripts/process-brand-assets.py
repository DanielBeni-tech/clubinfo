#!/usr/bin/env python3
"""Prepare Club Info brand marks, favicons and web-ready photos."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont
import numpy as np

ROOT = Path("/home/daniel/clubinfo")
PUBLIC = ROOT / "public"
ASSETS = ROOT / "assets"
BRAND = ROOT / "src" / "assets" / "brand"
PHOTOS_SRC = ROOT / "src" / "assets" / "images"
STOCK = ROOT / "src" / "assets"

NAVY = (0, 27, 61, 255)
BLUE = (0, 71, 173, 255)
CYAN = (47, 180, 224, 255)
WHITE = (255, 255, 255, 255)

GEN_BLUE = Path("/home/daniel/.cursor/projects/home-daniel-clubinfo/assets/logo-mark-clean.png")
GEN_WHITE = Path("/home/daniel/.cursor/projects/home-daniel-clubinfo/assets/logo-mark-white.png")
ORIG = PUBLIC / "logo.jpeg"


def knock_white(im: Image.Image, threshold: int = 242, soft: int = 18) -> Image.Image:
    rgba = im.convert("RGBA")
    arr = np.array(rgba).astype(np.float32)
    rgb = arr[:, :, :3]
    mn = rgb.min(axis=2)
    mx = rgb.max(axis=2)
    near_white = (mn >= threshold) & ((mx - mn) < 28)
    luma = rgb.mean(axis=2)
    alpha = arr[:, :, 3]
    fade = np.clip((threshold + soft - luma) / soft, 0, 1) * 255
    alpha = np.where(near_white, 0, np.minimum(alpha, fade))
    # also punch very light leftovers
    alpha = np.where(luma >= 250, 0, alpha)
    arr[:, :, 3] = alpha
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def crop_alpha(im: Image.Image, pad_ratio: float = 0.12) -> Image.Image:
    arr = np.array(im)
    ys, xs = np.where(arr[:, :, 3] > 12)
    if len(xs) == 0:
        return im
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    crop = im.crop((x0, y0, x1 + 1, y1 + 1))
    side = max(crop.size)
    pad = int(side * pad_ratio)
    canvas = Image.new("RGBA", (side + pad * 2, side + pad * 2), (0, 0, 0, 0))
    ox = (canvas.size[0] - crop.size[0]) // 2
    oy = (canvas.size[1] - crop.size[1]) // 2
    canvas.alpha_composite(crop, (ox, oy))
    return canvas


def fit_on(im: Image.Image, size: int, bg: tuple[int, int, int, int] | None = None, scale: float = 0.72) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), bg if bg else (0, 0, 0, 0))
    target = int(size * scale)
    icon = im.copy()
    icon.thumbnail((target, target), Image.Resampling.LANCZOS)
    x = (size - icon.size[0]) // 2
    y = (size - icon.size[1]) // 2
    canvas.alpha_composite(icon, (x, y))
    return canvas


def save(im: Image.Image, path: Path, **kwargs) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, **kwargs)
    print("wrote", path, im.size)


def extract_original_mark() -> Image.Image:
    src = Image.open(ORIG).convert("RGBA")
    # original mark lives in the upper center; cut the wordmark
    w, h = src.size
    mark = src.crop((int(w * 0.28), int(h * 0.26), int(w * 0.72), int(h * 0.60)))
    return crop_alpha(knock_white(mark, threshold=238, soft=22), pad_ratio=0.10)


def grade_photo(im: Image.Image) -> Image.Image:
    im = ImageEnhance.Contrast(im).enhance(1.07)
    im = ImageEnhance.Color(im).enhance(1.04)
    im = ImageEnhance.Sharpness(im).enhance(1.12)
    im = ImageEnhance.Brightness(im).enhance(0.98)
    return im


def crop_aspect(im: Image.Image, tw: int, th: int, bias_y: float = 0.78) -> Image.Image:
    w, h = im.size
    target = tw / th
    src = w / h
    if src > target:
        nh = h
        nw = int(h * target)
        left = (w - nw) // 2
        top = 0
    else:
        nw = w
        nh = int(w / target)
        left = 0
        top = int((h - nh) * bias_y)
        top = max(0, min(top, h - nh))
    cropped = im.crop((left, top, left + nw, top + nh))
    return grade_photo(cropped.resize((tw, th), Image.Resampling.LANCZOS))


def write_svg(path: Path) -> None:
    """Geometric C-network mark using currentColor — crisp at any size."""
    nodes = [
        (34, 26, 5.2),
        (46, 18, 3.6),
        (58, 22, 4.4),
        (70, 18, 2.1),
        (24, 40, 4.6),
        (38, 38, 6.4),
        (50, 34, 3.2),
        (54, 48, 4.0),
        (68, 46, 4.8),
        (80, 44, 2.8),
        (78, 56, 2.0),
        (22, 54, 3.4),
        (34, 58, 4.4),
        (46, 56, 3.0),
        (40, 70, 4.6),
        (54, 66, 2.6),
        (18, 22, 1.8),
        (62, 12, 1.7),
        (84, 36, 1.9),
        (20, 68, 1.8),
        (72, 64, 1.6),
    ]
    edges = [
        (0, 1), (1, 2), (0, 4), (4, 5), (5, 0), (5, 6), (6, 2),
        (5, 7), (7, 8), (8, 9), (4, 11), (11, 12), (12, 5),
        (12, 14), (14, 15), (7, 12), (5, 12),
    ]
    circles = "\n".join(
        f'    <circle cx="{x}" cy="{y}" r="{r}" />' for x, y, r in nodes
    )
    lines = "\n".join(
        f'    <line x1="{nodes[a][0]}" y1="{nodes[a][1]}" x2="{nodes[b][0]}" y2="{nodes[b][1]}" '
        f'stroke-width="{min(nodes[a][2], nodes[b][2]) * 1.15}" />'
        for a, b in edges
    )
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 88" role="img" aria-label="Club Informatique SUP'PTIC">
  <title>Club Info</title>
  <g fill="currentColor" stroke="currentColor" stroke-linecap="round">
{lines}
{circles}
  </g>
</svg>
"""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(svg)
    print("wrote", path)


def write_full_svg(path: Path) -> None:
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 88" role="img" aria-label="Club Informatique SUP'PTIC">
  <title>Club Informatique SUP'PTIC</title>
  <g fill="currentColor" stroke="currentColor" stroke-linecap="round">
    <line x1="34" y1="26" x2="46" y2="18" stroke-width="4.1"/>
    <line x1="46" y1="18" x2="58" y2="22" stroke-width="4.1"/>
    <line x1="34" y1="26" x2="24" y2="40" stroke-width="5.3"/>
    <line x1="24" y1="40" x2="38" y2="38" stroke-width="5.3"/>
    <line x1="38" y1="38" x2="34" y2="26" stroke-width="6.0"/>
    <line x1="38" y1="38" x2="50" y2="34" stroke-width="3.7"/>
    <line x1="50" y1="34" x2="58" y2="22" stroke-width="3.7"/>
    <line x1="38" y1="38" x2="54" y2="48" stroke-width="4.6"/>
    <line x1="54" y1="48" x2="68" y2="46" stroke-width="4.6"/>
    <line x1="68" y1="46" x2="80" y2="44" stroke-width="3.2"/>
    <line x1="24" y1="40" x2="22" y2="54" stroke-width="3.9"/>
    <line x1="22" y1="54" x2="34" y2="58" stroke-width="3.9"/>
    <line x1="34" y1="58" x2="38" y2="38" stroke-width="5.1"/>
    <line x1="34" y1="58" x2="40" y2="70" stroke-width="5.1"/>
    <line x1="40" y1="70" x2="54" y2="66" stroke-width="3.0"/>
    <line x1="54" y1="48" x2="34" y2="58" stroke-width="3.5"/>
    <circle cx="34" cy="26" r="5.2"/>
    <circle cx="46" cy="18" r="3.6"/>
    <circle cx="58" cy="22" r="4.4"/>
    <circle cx="70" cy="18" r="2.1"/>
    <circle cx="24" cy="40" r="4.6"/>
    <circle cx="38" cy="38" r="6.4"/>
    <circle cx="50" cy="34" r="3.2"/>
    <circle cx="54" cy="48" r="4.0"/>
    <circle cx="68" cy="46" r="4.8"/>
    <circle cx="80" cy="44" r="2.8"/>
    <circle cx="78" cy="56" r="2.0"/>
    <circle cx="22" cy="54" r="3.4"/>
    <circle cx="34" cy="58" r="4.4"/>
    <circle cx="46" cy="56" r="3.0"/>
    <circle cx="40" cy="70" r="4.6"/>
    <circle cx="54" cy="66" r="2.6"/>
    <circle cx="18" cy="22" r="1.8"/>
    <circle cx="62" cy="12" r="1.7"/>
    <circle cx="84" cy="36" r="1.9"/>
    <circle cx="20" cy="68" r="1.8"/>
    <circle cx="72" cy="64" r="1.6"/>
  </g>
  <g fill="currentColor">
    <text x="108" y="40" font-family="Poppins, Inter, Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="0.04em">CLUB INFO</text>
    <text x="108" y="62" font-family="Inter, Arial, sans-serif" font-size="9.5" font-weight="500" letter-spacing="0.18em" opacity="0.72">SUP'PTIC · YAOUNDÉ</text>
  </g>
</svg>
"""
    path.write_text(svg)
    print("wrote", path)


def make_og(mark: Image.Image) -> Image.Image:
    w, h = 1200, 630
    img = Image.new("RGBA", (w, h), NAVY)
    draw = ImageDraw.Draw(img)
    # soft cyan glow
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse(((-80, -120), (520, 420)), fill=(47, 180, 224, 48))
    gd.ellipse(((780, -80), (1380, 380)), fill=(0, 71, 173, 90))
    img = Image.alpha_composite(img, glow)
    icon = fit_on(mark, 280, scale=0.88)
    img.alpha_composite(icon, (96, (h - icon.size[0]) // 2))
    try:
        title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 54)
        sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
        tiny = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    except OSError:
        title = sub = tiny = ImageFont.load_default()
    draw = ImageDraw.Draw(img)
    draw.text((420, 230), "Club Informatique", font=title, fill=WHITE)
    draw.text((420, 300), "SUP'PTIC", font=title, fill=CYAN)
    draw.text((420, 380), "Une école, un esprit, une intelligence", font=sub, fill=(210, 224, 238, 255))
    draw.text((420, 430), "Yaoundé  ·  Cameroun", font=tiny, fill=(160, 184, 204, 255))
    return img.convert("RGB")


def cut_ceiling(im: Image.Image, top: float = 0.22, bottom: float = 0.0) -> Image.Image:
    w, h = im.size
    return im.crop((0, int(h * top), w, int(h * (1 - bottom))))


def process_photos() -> None:
    jobs = [
        ("IMG_2480.JPG.jpeg", STOCK / "hero-bg.jpg", 1920, 1080, 0.55, 86, 0.20),
        ("IMG_1506.JPG.jpeg", STOCK / "project-supone.jpg", 1200, 800, 0.40, 86, 0.0),
        ("IMG_2476.JPG.jpeg", STOCK / "project-cyber.jpg", 1200, 800, 0.70, 86, 0.26),
        ("IMG_2477.JPG.jpeg", STOCK / "project-iot.jpg", 1200, 800, 0.62, 86, 0.22),
        ("IMG_2478.JPG.jpeg", STOCK / "gallery-hackathon.jpg", 1200, 900, 0.55, 86, 0.16),
        ("IMG_2476.JPG.jpeg", STOCK / "gallery-formation.jpg", 1200, 900, 0.75, 86, 0.24),
        ("IMG_1506.JPG.jpeg", STOCK / "gallery-team.jpg", 1200, 900, 0.35, 86, 0.0),
        ("IMG_2479.JPG.jpeg", STOCK / "gallery-conference.jpg", 1200, 900, 0.50, 86, 0.14),
        ("IMG_2480.JPG.jpeg", STOCK / "gallery-talk.jpg", 1200, 900, 0.50, 86, 0.16),
        ("IMG_2477.JPG.jpeg", STOCK / "gallery-speaker.jpg", 1200, 900, 0.60, 86, 0.20),
        ("IMG_4218.PNG", STOCK / "president.jpg", 900, 900, 0.12, 88, 0.0),
    ]
    for src_name, dest, tw, th, bias, quality, ceiling in jobs:
        src = Image.open(PHOTOS_SRC / src_name).convert("RGB")
        if ceiling:
            src = cut_ceiling(src, top=ceiling)
        out = crop_aspect(src, tw, th, bias_y=bias)
        save(out, dest, quality=quality, optimize=True)


def main() -> None:
    BRAND.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)

    blue = crop_alpha(knock_white(Image.open(GEN_BLUE), threshold=244, soft=16), pad_ratio=0.08)
    white = crop_alpha(knock_white(Image.open(GEN_WHITE), threshold=8, soft=12), pad_ratio=0.08)
    # white generator may have kept white-on-white; rebuild from blue instead
    white = Image.new("RGBA", blue.size, (0, 0, 0, 0))
    b = np.array(blue)
    warr = np.array(white)
    visible = b[:, :, 3] > 10
    warr[visible, 0] = 255
    warr[visible, 1] = 255
    warr[visible, 2] = 255
    warr[visible, 3] = b[visible, 3]
    white = Image.fromarray(warr, "RGBA")

    official = extract_original_mark()

    save(blue, BRAND / "logo-mark.png")
    save(white, BRAND / "logo-mark-white.png")
    save(official, BRAND / "logo-mark-official.png")
    save(blue.resize((512, 512), Image.Resampling.LANCZOS), PUBLIC / "logo.png")
    save(white.resize((512, 512), Image.Resampling.LANCZOS), PUBLIC / "logo-white.png")

    # favicon family
    ico_sizes = [16, 32, 48]
    ico_imgs = [fit_on(blue, s, scale=0.92).convert("RGBA") for s in ico_sizes]
    PUBLIC.mkdir(exist_ok=True)
    ico_imgs[0].save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
        append_images=ico_imgs[1:],
    )
    print("wrote", PUBLIC / "favicon.ico")

    save(fit_on(blue, 32, scale=0.92), PUBLIC / "favicon-32x32.png")
    save(fit_on(blue, 16, scale=0.92), PUBLIC / "favicon-16x16.png")
    save(fit_on(white, 180, NAVY, scale=0.70), PUBLIC / "apple-touch-icon.png")
    save(fit_on(white, 512, NAVY, scale=0.68), PUBLIC / "android-chrome-512x512.png")
    save(fit_on(white, 192, NAVY, scale=0.68), PUBLIC / "android-chrome-192x192.png")
    save(make_og(blue), PUBLIC / "og-image.jpg", quality=88, optimize=True)

    write_svg(PUBLIC / "favicon.svg")
    write_svg(BRAND / "logo-mark.svg")
    write_full_svg(BRAND / "logo-full.svg")
    write_full_svg(PUBLIC / "logo-full.svg")

    process_photos()


if __name__ == "__main__":
    main()
