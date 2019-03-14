# Glass

Bringing the transparency of EOS Bps!

## Structure

- bpwatcher: nodejs script that scrapes all the producers and bp.json files, and save it in mongodb
- backend: nodejs express webserver, serves data from mongodb
- frontend: application UI interface in ReactJS

## Setup

1 - Setup bpwatcher to run every X minutes as a cronjob.   
2 - Build backend and serve with pm2.     
3 - Build the frontend and serve it in your static webserver.   

### Backend Setup

First time running `bpwatcher` prior the cronjob:
```
cd bpwatcher
npm install
node index.js
```

First time install (setting up pm2)
```
npm install pm2 -g
cd backend
npm install
npm run build
cd dist
pm2 start index.js
```

Subsequential deployments:
```
cd backend
npm install
npm run build
pm2 restart 0         # assuming your pm2 installation above added glass service with id 0
```

### Frontend Setup

```
cd frontend
npm run build && sudo rm -rf /var/www/html && sudo mv build /var/www/html
```

## Misc

### Apache config file

It just allows apache to recognize the frontend as a single page app, edit
the file /etc/apache2/sites-enabled/000-default.conf and set the below content:

```
<VirtualHost *:80>
        #ServerName www.example.com

        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined

        <Directory "/var/www/html">
                RewriteEngine on
                RewriteCond %{REQUEST_FILENAME} -f [OR]
                RewriteCond %{REQUEST_FILENAME} -d
                RewriteRule ^ - [L]
                RewriteRule ^ index.html [L]
        </Directory>

        ProxyPass /api http://localhost:8080/api/
        ProxyPassReverse /api http://localhost:8080/api/

</VirtualHost>
```

## Using Docker Compose for Development

- Install Docker
- Run `docker-compose -up --build -d && yarn start`
