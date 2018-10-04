#!/bin/bash

if [ -d "dist" ]; then
  rm -rf dist
fi
mkdir dist
cp index.html dist
mkdir dist/node_modules
cp -r node_modules/@mikewesthad dist/node_modules
cp -r node_modules/socket.io-client dist/node_modules
cp -r build dist
mkdir dist/assets
mkdir dist/assets/tilesets
mkdir dist/assets/sheets
cp assets/sheets/chara2.png dist/assets/sheets
cp assets/tilesets/dungeon.png dist/assets/tilesets