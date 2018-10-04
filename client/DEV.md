#Build
    parcel build index.html

Output will go in dist directory.

#Development
This will download any dependencies:
    npm install

This will automatically compile any changes:
    ./node_modules/.bin/webpack-cli --watch

This will give you a quick web server:
    python -m http.server 3000