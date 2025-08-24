# Use official PHP image with necessary extensions
FROM php:8.2-cli

# Install dependencies
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    curl \
    libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql

# Install Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Expose Render port
EXPOSE 10000

# Run Laravel server
CMD php artisan serve --host 0.0.0.0 --port 10000
