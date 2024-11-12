echo "Building app..."
npm run build
echo "Deploy files to server..."
# scp -r dist/* root@103.90.227.69:/var/www/html/
scp -r dist/* root@103.90.227.69:/var/www/SWP391-KOIFARMSHOP-FE/src/
echo "Done!"