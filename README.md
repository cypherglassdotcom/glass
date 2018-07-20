# Glass

Bringing the transparency of EOS Bps!

## Structure

- bpwatcher: nodejs script that scrapes all the producers and bp.json files, and save it in mongodb
- backend: nodejs express webserver, serves data from mongodb
- frontend: application UI interface in ReactJS

## Setup

1 - Setup bpwatcher to run every X minutes as a cronjob.
2 - Build backend and serve with pm2
3 - Build the frontend and serve it in your static webserver

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
