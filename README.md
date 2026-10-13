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

## Deploy (VPS with nginx)

Copy the repo to the server and point nginx at the folder, e.g.:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/abdallah-site;   # the cloned repo
    index index.html;
    location / { try_files $uri $uri/ =404; }
}
```

Then `sudo nginx -t && sudo systemctl reload nginx`.

## Still to fill in

- Final social links (LinkedIn / Upwork / Instagram handles)
- Real case-study result numbers (the `add …` placeholders in Work)
