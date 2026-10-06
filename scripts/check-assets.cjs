const urls = [
  'https://nourishspoon.com/assets/images/product-1-main.png',
  'https://nourishspoon.com/assets/images/product-2-main.png',
  'https://nourishspoon.com/assets/images/our-story-image.png',
  'https://nourishspoon.com/assets/images/logo-2.jpg',
  'https://nourishspoon.com/assets/images/banner-2.png',
];

async function check() {
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'GET' });
      const buf = await res.arrayBuffer();
      const type = res.headers.get('content-type') ?? '?';
      console.log(res.status, type, Math.round(buf.byteLength / 1024) + 'KB', url.split('/').pop());
    } catch (error) {
      console.log('FAIL', String(error.cause?.code ?? error.message).slice(0, 70), url.split('/').pop());
    }
  }
  process.exit(0);
}
check();
