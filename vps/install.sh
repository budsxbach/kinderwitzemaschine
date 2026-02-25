#!/bin/bash
# ============================================================
# Kinderwitzemaschine — VPS Setup Script
# Verwendung: bash install.sh DEINE_DOMAIN
# Beispiel:   bash install.sh kinderwitzemaschine.duckdns.org
# ============================================================

set -e  # Bei Fehler sofort stoppen

DOMAIN="${1}"
APP_DIR="/opt/kinderwitzemaschine"

# --- Domain prüfen ------------------------------------------
if [ -z "$DOMAIN" ]; then
  echo ""
  echo "FEHLER: Bitte Domain angeben!"
  echo "Beispiel: bash install.sh kinderwitzemaschine.duckdns.org"
  echo ""
  exit 1
fi

echo ""
echo "=================================================="
echo "  Kinderwitzemaschine VPS Setup"
echo "  Domain: $DOMAIN"
echo "=================================================="
echo ""

# --- System aktualisieren -----------------------------------
echo ">> System aktualisieren..."
sudo apt-get update -q

# --- Node.js 20 installieren --------------------------------
echo ">> Node.js 20 installieren..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
echo "   Node.js Version: $(node --version)"

# --- PM2 installieren ---------------------------------------
echo ">> PM2 installieren..."
sudo npm install -g pm2 --quiet

# --- Nginx installieren -------------------------------------
echo ">> Nginx installieren..."
sudo apt-get install -y nginx

# --- Certbot installieren -----------------------------------
echo ">> Certbot installieren..."
sudo apt-get install -y certbot python3-certbot-nginx

# --- Git installieren ---------------------------------------
echo ">> Git installieren..."
sudo apt-get install -y git

# --- App deployen -------------------------------------------
echo ">> App vom GitHub holen..."
if [ -d "$APP_DIR" ]; then
  echo "   Ordner existiert bereits — aktualisiere..."
  cd "$APP_DIR"
  git pull
else
  sudo git clone https://github.com/budsxbach/kinderwitzemaschine.git "$APP_DIR"
  cd "$APP_DIR"
fi
sudo chown -R "$USER:$USER" "$APP_DIR"

echo ">> npm install..."
npm install --production --quiet

# --- App mit PM2 starten ------------------------------------
echo ">> App mit PM2 starten..."
pm2 stop kinderwitzemaschine 2>/dev/null || true
pm2 start server.js --name kinderwitzemaschine
pm2 startup 2>/dev/null | grep "sudo" | bash 2>/dev/null || true
pm2 save

# --- Nginx konfigurieren ------------------------------------
echo ">> Nginx konfigurieren..."
sudo tee /etc/nginx/sites-available/kinderwitzemaschine > /dev/null <<NGINX
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Host              \$host;
        proxy_set_header   X-Real-IP         \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300;
        proxy_buffering    off;
    }
}
NGINX

# Standard-Config deaktivieren (falls vorhanden)
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/kinderwitzemaschine /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# --- Fertig! ------------------------------------------------
echo ""
echo "=================================================="
echo "  SETUP FERTIG!"
echo "=================================================="
echo ""
echo "  App laeuft auf:  http://$DOMAIN"
echo "  PM2 Status:      pm2 status"
echo ""
echo "  NAECHSTER SCHRITT: HTTPS aktivieren"
echo "  Folgenden Befehl ausfuehren:"
echo ""
echo "  sudo certbot --nginx -d $DOMAIN"
echo ""
echo "=================================================="
