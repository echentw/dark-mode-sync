rm -rf dist/
mkdir dist/

cp manifest.json dist/

cp youtube.js dist/
cp reddit.js dist/
cp stackoverflow.js dist/
cp twitter.js dist/
cp twitch.js dist/

cp logo32.png dist/
cp logo128.png dist/

cd dist/

zip -r ../dark-mode-sync.zip .
