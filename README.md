# nginx-cheatsheet
This chectsheet is a quick glanceable document when dealing with Nginx.

> Make sure you are logged in as `root` user. If not enter `sudo su` to become the root user

# Install Nginx
Here is how you can install Nginx on Ubuntu (probably will work in other versions of Debian as well)

To install Nginx, first we will ensure that our repositories are up to date
```
sudo apt update -y && sudo apt upgrade -y
```

We will ensure that all old files of any previous installation (if any) are removed.
```
sudo apt remove --purge nginx nginx-full nginx-common -y
```

Install Nginx
```
sudo apt install nginx -y
```

Start Nginx
```
sudo systemctl start nginx
```

To ensure Nginx starts automatically at boot:
```
sudo systemctl enable nginx
```

Status of Nginx (if you get stuck, press `q` to un-stuck yourself)
```
sudo systemctl status nginx
```

---

### Additional commands to control Nginx

Verify Nginx config files
```
nginx -t
```

To reload Nginx (quick reload)
```
systemctl reload nginx
```

To restart Nginx
```
systemctl restart nginx
```

To stop Nginx
```
sudo systemctl status nginx
```

# Responding to one domain
To configure Nginx to respond to one domain, we will have to do two things.
1. Configure the server to deny requests for any domainn or IP
2. Configure the server to respond to our domain only
3. Create symbolic links

## Configure the server to deny any request
Edit the document `/etc/nginx/sites-available/default`.

Comment the following lines with a `#` at the start of the line.
```
root /var/www/html;

index index.html index.htm index.nginx-debian.html;
```

Add the following line right before the end of the `server` block (Denoted by the `}`)
```
return 444;
```

## Configure the server to respond to requests for one domain
Create a new file with the name of the domain, and add the following contents.
```
server {
       listen 80;
       listen [::]:80;
       server_name nginx-2.duckdns.org;

       root /var/www/html;
       index index.html;

       location / {
               try_files $uri $uri/ =404;
       }
}
```
Where `/var/www/html` is the public folder for your website.

Note: You can host multiple websites this way by simply adding the files to a new folder and the routing Nginx and a new domain to it.

## Create symbolic links
Symbolic links allow us link a file along with all its contents.

This is an important step since, only the configuration files in the `/etc/nginx/sites-enabled` folder are applied.

### Create symbolic links
```
ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
```
Make sure to change `example.com` to the domain/hostname you are using.

### Remove symbolic links
Simply delete the file to remove the link (Not the original file).

So if I want to delete the symbolic link for `/etc/nginx/sites-enabled/example.com`, I will run
```
rm /etc/nginx/sites-enabled/example.com
```

# Configure SSL on domain

To configure SSL on the domain, we will `python3-certbot-nginx` .

Before we begin make sure the following is configured
1. Firewall ports 80 and 443 are open
2. The domain we will have SSL on must have an A record directed to your server.

Install Cert bot
```
sudo apt install certbot python3-certbot-nginx -y
```

Now we will run Cert bot to get us a certificate for Nginx domain example.com (Replace with your own domain)
```
sudo certbot --nginx -d example.com
```

Follow the steps to install certificate. You need to agree to the terms but can exclude yourself from your email being shared.

# Reverse proxy & Load Balance to a local port

## Reverse proxy
To reverse proxy to a local port, simply create another file with the name of the domain that you will use.

Paste the following contents into the file
```
upstream api_backend { 
        server localhost:3000;
}

server {
    listen 80;
    server_name example.com; 
    location / {
        proxy_pass http://api_backend; 
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
Make sure to replace `example.com` with your domain name.

Note: The `upstream` will be used for load balancing later, and hence this kind of a config file is recommended. <u>Make sure that the name of the upstream, which in this case is `api_backend` is unique.</u>

## Load balance
If you multiple instances of your app running on different ports, you can load balance between them by simply modifying the upstream section.
```
upstream api_backend { 
        server localhost:3000;
        server localhost:3001;
        server localhost:3001;
}
```
