# Step 1: Use official PHP image
FROM php:8.1-fpm-alpine

# Step 2: Install system dependencies
RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    zlib-dev \
    libxpm-dev \
    libzip-dev \
    nginx \
    supervisor \
    bash \
    git \
    curl

# Step 3: Install PHP extensions
RUN docker-php-ext-configure zip
RUN docker-php-ext-install zip exif pdo pdo_mysql

# Step 4: Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Step 5: Set working directory
WORKDIR /var/www

# Step 6: Copy application files
COPY . .

# Step 7: Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Step 8: Set permissions for storage and cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Step 9: Configure Nginx
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Step 10: Expose port
EXPOSE 80

# Step 11: Start PHP-FPM and Nginx
CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
