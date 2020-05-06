rm -rf dist/
mkdir dist/

cp youtube.js dist/
cp reddit.js dist/
cp manifest.json dist/

cd dist/

zip -r ../dark-mode-sync.zip .
