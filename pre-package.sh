
rm -rf ./dist
mkdir ./dist
cp -r ./public/* ./dist

# mkdir ./dist/icon
# cp icon/launcher-icon-1x.png ./dist/icon/launcher-icon-1x.png 
# cp icon/launcher-icon-2x.png ./dist/icon/launcher-icon-2x.png 
# cp icon/launcher-icon-4x.png ./dist/icon/launcher-icon-4x.png 
# cp icon/launcher-icon-8x.png ./dist/icon/launcher-icon-8x.png 
# cp manifest.json ./dist/manifest.json
# cp favicon.ico ./dist/favicon.ico
# cp app.css ./dist/app.css

# # Replace the ci build path with deployment path
# index_content=$(<index.html)
# sw_content=$(<sw.js)
# current="./dist/app.min.js"
# replacement="./app.min.js"
# sw_replacement="./app.min.js', \n  'demo.html', \n  'demo-manifest.json"
# echo "${index_content//$current/$replacement}" > ./dist/index.html
# echo "${sw_content//$current/$sw_replacement}" > ./dist/sw.js

