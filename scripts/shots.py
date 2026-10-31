# Gera as imagens das demos usadas no carrossel. Uso: python scripts/shots.py
import pathlib, subprocess, tempfile
from PIL import Image

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
raiz = pathlib.Path(__file__).resolve().parent.parent
saida = raiz / "public" / "shots"
saida.mkdir(exist_ok=True)

for demo in ["odonto", "barbearia", "estetica", "advocacia", "loja"]:
    with tempfile.TemporaryDirectory() as tmp:
        png = pathlib.Path(tmp) / "shot.png"
        subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                        f"--user-data-dir={tmp}/perfil", "--window-size=1280,800",
                        "--virtual-time-budget=4000", f"--screenshot={png}",
                        (raiz / "public" / "demos" / f"{demo}.html").as_uri()],
                       check=True, timeout=60, capture_output=True)
        Image.open(png).convert("RGB").save(saida / f"{demo}.webp", quality=82)
