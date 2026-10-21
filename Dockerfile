FROM nginx:1.31-alpine

# Apply security updates available for the Alpine base image.
RUN apk upgrade --no-cache

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html 404.html 50x.html styles.css script.js robots.txt sitemap.xml /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY legal /usr/share/nginx/html/legal

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1/healthz || exit 1
