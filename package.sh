
cp sw.js ./dist/sw.js
mkdir ./dist/icon
cp icon/launcher-icon-1x.png ./dist/icon/launcher-icon-1x.png 
cp icon/launcher-icon-2x.png ./dist/icon/launcher-icon-2x.png 
cp icon/launcher-icon-4x.png ./dist/icon/launcher-icon-4x.png 
cp icon/launcher-icon-8x.png ./dist/icon/launcher-icon-8x.png 
cp favicon.ico ./dist/favicon.ico
cp app.css ./dist/app.css

# Replace the ci build path with deployment path
index_content=$(<index.html)
current="./dist/app.min.js"
replacement="./app.min.js"
echo "${index_content//$current/$replacement}" > ./dist/index.html

webpack

cp -r ./dist/ ../drawingServer/

cd ../drawingServer

zip -r ../deploy/deploy$1.zip ./*