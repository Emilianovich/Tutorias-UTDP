FROM php:8.3-fpm

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx \
    supervisor \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensiones PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Copiar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar composer files
COPY composer.json composer.lock ./

# Instalar dependencias
RUN composer install --no-dev --no-scripts --no-autoloader

# Copiar código
COPY . .

# Finalizar instalación
RUN composer dump-autoload --optimize --no-dev

# Configuración Nginx y Supervisor
COPY docker/nginx.conf /etc/nginx/sites-available/default
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Permisos
RUN mkdir -p storage/logs storage/framework/{cache/data,sessions,views} bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache

# Optimizar
RUN php artisan config:cache && php artisan route:cache

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]