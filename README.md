# Abdallah Helal — personal site

Static personal website for Abdallah Helal, AI automation engineer. One page,
no build step. Built on the Abdallah Helal design system (deep teal + warm
sunset-gradient accent, Tajawal type).

## Structure

```
index.html        # the whole page
css/tokens.css    # design tokens (colors, type, spacing, motion)
css/styles.css    # all component + layout styles
js/main.js        # icons, nav pill, scroll progress, reveals, count-up
assets/img/       # photos (web-optimized) + logo marks
assets/logos/     # tool logos (SVG)
```

## Run locally

It's plain static files. Either open `index.html` directly, or serve it:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy (VPS with nginx) — abdallahhelal.com

Clone the repo on the server:

```bash
cd /var/www
git clone https://github.com/Abdallah-hilal/abdallah-helal-site.git
```

Point an nginx server block at it (`/etc/nginx/sites-available/abdallahhelal.com`):

```nginx
server {
    listen 80;
    server_name abdallahhelal.com www.abdallahhelal.com;
    root /var/www/abdallah-helal-site;
    index index.html;
    location / { try_files $uri $uri/ =404; }
}
```

Enable it, test, reload:

```bash
sudo ln -s /etc/nginx/sites-available/abdallahhelal.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Point the domain's DNS A records (`abdallahhelal.com` and `www`) at the VPS IP,
then add free HTTPS with Certbot:

```bash
sudo certbot --nginx -d abdallahhelal.com -d www.abdallahhelal.com
```

### Updating later

On the server, just pull the latest:

```bash
cd /var/www/abdallah-helal-site && git pull
```

## Still to fill in

- Final social links (LinkedIn / Upwork / Instagram handles)
- Real case-study result numbers (the `add …` placeholders in Work)
