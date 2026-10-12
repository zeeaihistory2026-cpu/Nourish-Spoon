# Website typography and mobile hero artwork

On 12 October 2026 the live https://nourishspoon.com/ computed styles and loaded font faces were checked: headings use Cormorant Garamond (700), body and buttons use Jost, including 400/500/600/700 weights. The app bundles these fonts locally. The website still links an older Playfair/Inter stylesheet, but those fonts were not used by the inspected headings/body/buttons.

Three illustrative food backgrounds were created with built-in imagegen, not the CLI, using the owner's supplied home mockups and original food photos. They contain no baked-in text or brand marks. App copy remains accessible native text. All are 1774×887 (2:1), contained in the same fixed minimum-height hero, with cream gradient blending and reduced-motion-aware crossfades. These are photographic illustrations, not new catalogue products.

Workspace assets:
- `apps/mobile/assets/hero/panjeeri.png`
- `apps/mobile/assets/hero/energy-balls.png`
- `apps/mobile/assets/hero/ingredients.png`

## Panjeeri generation prompt

Create a photographic background ONLY for the home hero of Nourish Spoon. Image 1 is a UI style reference: follow the light cream food banner in the THIRD (rightmost) phone only, not its logo, lettering or interface. Image 2 shows the actual panjeeri food to represent. Create a bright warm beige/cream tabletop with a beautiful carved wooden bowl of golden homemade panjeeri, almonds and pistachios on the RIGHT half. Preserve the real panjeeri appearance. LEFT half should be calm plain cream with subtle soft botanical shadows and no objects, for readable app text to be overlaid in code. No text, labels, logos, jars, ratings, UI, frames or borders anywhere. Natural soft daylight, premium food photography, gentle warm highlights, not dark brown restaurant lighting. Wide landscape composition. Keep the entire bowl inside the right half, with comfortable margins. Place all important food within the central 65 percent of the image's HEIGHT so this can fit an approximately 2:1 mobile banner without cutting the bowl. No artificial glowing effects.

References: `Nourish Spoon App Launch Flow.png` and original website `banner-5.png`.

## Energy balls generation prompt

Create a photographic background ONLY for a Nourish Spoon mobile home hero. Image 1 is a visual style reference: follow the soft cream food photography of its FIRST home hero, ignore all phone chrome, branding and text. Image 2 shows the actual date-and-nut energy balls to represent. Produce a 2:1 WIDE landscape banner with three or four appetizing date-and-nut energy balls in a small beautiful carved wooden bowl on the RIGHT half, a few almonds and cashews nearby. Bright warm cream tabletop/background with soft green leaves blurred at upper right, daylight and gentle realistic shadows. The LEFT half is clean quiet cream negative space for app text placed later in code. No jars, typography, words, logo, ratings, UI, borders or frames. Keep the bowl fully visible with comfortable margins and all important food inside the central 65 percent of image height. Match the first reference's smooth premium natural cream/green/brown palette, avoid dark brown scene lighting.

References: premium `05-home.png` and original website `banner-4.png`.

## Ingredients generation prompt

Generate a photographic background for a Nourish Spoon food app hero, matching the smooth warm cream lighting and carved bowl in the FIRST hero of this UI reference image. Reference only its photographic style, not its text, branding or phone UI. Wide 2:1 landscape composition: a carved wooden bowl filled with almonds, cashews, walnuts, pistachios and dates on the RIGHT half, with a few natural nuts beside it. The LEFT half is quiet light cream negative space for app copy to be overlaid in code. Soft green leaves and botanical shadows in the upper right, elegant daylight food photography. No text, logos, jars, labels, review badges, UI, frames or borders. Keep the whole bowl visible, away from the edges, and all important food within the central 65 percent of image height. Match beige, cream, leaf green and warm brown, not a dark scene. This illustrates ingredients, not a new product.

Reference: premium `05-home.png`.
