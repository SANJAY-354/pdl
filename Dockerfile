
# Stage 1: Build React + Vite frontend
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve frontend with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN printf '%s\n' \
'server {' \
'    listen 80;' \
'    server_name _;' \
'    root /usr/share/nginx/html;' \
'    index index.html;' \
'    location / {' \
'        try_files $uri $uri/ /index.html;' \
'    }' \
'    location /api/ {' \
'        proxy_pass https://mediflow-ai-iqnd.onrender.com/api/;' \
'        proxy_ssl_server_name on;' \
'        proxy_set_header Host mediflow-ai-iqnd.onrender.com;' \
'        proxy_set_header X-Real-IP $remote_addr;' \
'        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' \
'        proxy_set_header X-Forwarded-Proto $scheme;' \
'    }' \
'    location /ws/ {' \
'        proxy_pass https://mediflow-ai-iqnd.onrender.com/ws/;' \
'        proxy_ssl_server_name on;' \
'        proxy_http_version 1.1;' \
'        proxy_set_header Upgrade $http_upgrade;' \
'        proxy_set_header Connection "upgrade";' \
'        proxy_set_header Host mediflow-ai-iqnd.onrender.com;' \
'    }' \
'}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
