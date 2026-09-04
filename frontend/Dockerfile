FROM nginx:alpine

# Copy the pre-built static files created by Jenkins
# Note: If you are using Vite, change "build" to "dist"
COPY dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]