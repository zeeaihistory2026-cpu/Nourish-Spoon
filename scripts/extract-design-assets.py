"""Extract artwork from supplied references, excluding device frames and labels."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'Nourish_Spoon_HD_UI_Designs (1)/Nourish_Spoon_HD_UI_Designs/Final_Screens_HD'
OUT = ROOT / 'apps/mobile/assets/design'
OUT.mkdir(parents=True, exist_ok=True)

def crop(name, rect, output):
    Image.open(REF / name).crop(rect).save(OUT / output)

crop('signup.png', (404, 140, 683, 366), 'brand.png')
crop('06_Payment_and_Delivery_Screen_HD.png', (626, 101, 824, 280), 'botanical.png')
crop('01_Home_Screen_HD.png', (497, 392, 823, 997), 'home-food.jpg')
crop('01_Home_Screen_HD.png', (58, 1275, 424, 1483), 'energy-card.jpg')
crop('01_Home_Screen_HD.png', (443, 1275, 807, 1483), 'panjeeri-card.jpg')
crop('02_Products_Screen_Latest_HD.png', (62, 327, 879, 580), 'energy-catalog.jpg')
crop('02_Products_Screen_Latest_HD.png', (62, 982, 879, 1213), 'panjeeri-catalog.jpg')
crop('03_Energy_Balls_Product_Detail_HD.png', (39, 112, 823, 687), 'energy-detail.jpg')
crop('04_Homemade_Panjeeri_Product_Detail_HD.png', (34, 111, 829, 679), 'panjeeri-detail.jpg')
crop('08_Our_Story_Screen_HD.png', (39, 205, 824, 675), 'founder.jpg')
crop('splash 1.png', (229, 691, 856, 1280), 'splash-food.jpg')
crop('onboarding.png', (229, 800, 857, 1228), 'onboarding-food.jpg')
crop('login.png', (230, 1145, 854, 1371), 'login-food.jpg')
crop('10_Contact_and_More_Screen_HD.png', (531, 214, 806, 535), 'contact-food.jpg')
crop('07_Customer_Reviews_Screen_HD.png', (81, 760, 487, 852), 'review-proof.png')

# Use the separately supplied ingredient photography instead of crops containing labels.
ingredient_dir = ROOT / 'extracted_assets/ingredients/date and energy ball icons'
mapping = {'dates':'whole_medjool_dates', 'almonds':'whole_raw_almonds',
    'walnuts':'whole_shelled_walnuts', 'cashews':'raw_cashew_nuts',
    'raisins':'golden_raisins', 'figs':'dried_whole_figs', 'coconut':'fresh_coconut',
    'desi_ghee':'golden_desi_ghee', 'cardamom':'green_cardamom',
    'lotus_seeds':'roasted_lotus_seeds', 'pumpkin_seeds':'green_pumpkin',
    'sunflower_seeds':'sunflower_seeds', 'white_sesame_seeds':'white_sesame'}
for name, match in mapping.items():
    source = next(ingredient_dir.glob('*' + match + '*.png'))
    img = Image.open(source).convert('RGB')
    img.thumbnail((240, 240))
    img.save(OUT / (name + '.jpg'), quality=90)
source = next((ROOT / 'extracted_assets/ingredients/panjeeri icons').glob('*semolina*.png'))
img = Image.open(source).convert('RGB')
img.thumbnail((240, 240))
img.save(OUT / 'semolina.jpg', quality=90)

# Launcher icon contains only the brand mark, never the mockup's camera cutout.
logo = Image.open(OUT / 'brand.png').convert('RGB')
icon = Image.new('RGB', (1024, 1024), '#FFF9EC')
logo.thumbnail((590, 590))
icon.paste(logo, ((1024-logo.width)//2, (1024-logo.height)//2))
icon.save(OUT / 'icon.png')
print('Extracted', len(list(OUT.iterdir())), 'design assets')

# Payment and delivery badges from the supplied design, without surrounding text.
import shutil
payment_reference = Image.open(REF / '06_Payment_and_Delivery_Screen_HD.png')
badges = {
    'icon_bank.png': (96, 534, 211, 646),
    'icon_easypaisa.png': (96, 676, 211, 788),
    'icon_jazzcash.png': (96, 813, 211, 928),
    'icon_delivery_sargodha.png': (96, 1232, 211, 1344),
    'icon_delivery_tcs.png': (93, 1366, 214, 1480),
    'icon_delivery_foodpanda.png': (96, 1497, 211, 1609),
    'icon_delivery_pickup.png': (96, 1624, 211, 1713),
}
for name, rect in badges.items():
    output = ROOT / 'apps/mobile/assets/icons' / name
    payment_reference.crop(rect).save(output)
    shutil.copy2(output, ROOT / 'apps/admin/public/assets/icons' / name)
