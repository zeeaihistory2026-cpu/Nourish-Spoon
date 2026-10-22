const { test } = require("node:test");
const assert = require("node:assert/strict");
const sharp = require("sharp");
const { preparePhoto } = require("../src/customerPhotos");

test("photo validation rejects arbitrary files, oversized payloads and corrupt JPEGs", async () => {
  for (const input of [
    undefined,
    "data:image/svg+xml;base64,PHN2Zz4=",
    "data:image/jpeg;base64," + "A".repeat(180000),
    "data:image/jpeg;base64,YmFk",
  ])
    await assert.rejects(preparePhoto(input));
});
test("uploaded photos are bounded JPEGs with metadata removed", async () => {
  const bytes = await sharp({
    create: { width: 1400, height: 700, channels: 3, background: "#003e31" },
  })
    .jpeg()
    .withMetadata({ exif: { IFD0: { Artist: "Private uploader" } } })
    .toBuffer();
  const photo = await preparePhoto(
    "data:image/jpeg;base64," + bytes.toString("base64"),
    320,
  );
  const output = Buffer.from(photo.data, "base64");
  const meta = await sharp(output).metadata();
  assert.equal(meta.format, "jpeg");
  assert.equal(meta.width, 320);
  assert.equal(meta.height, 160);
  assert.equal(meta.exif, undefined);
  assert.ok(output.length <= 80 * 1024);
});
