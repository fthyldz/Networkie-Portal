# Networkie-Portal

Bu proje, Angular framework'ü kullanılarak geliştirilmiş bir web uygulamasıdır.

## Kullanılan Teknolojiler ve Sürümler

- Angular: v19.2.0
- Node.js: v20.x (önerilen)
- TypeScript: v5.7.2
- TailwindCSS: v4.0.15
- Chart.js: v4.4.9
- ng2-charts: v8.0.0

## Geliştirme Ortamı Kurulumu

1. Node.js'i yükleyin (v20.x önerilir)
2. Projeyi klonlayın:
   ```bash
   git clone [proje-url]
   cd networkie-app
   ```
3. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

## Geliştirme Sunucusunu Başlatma

```bash
npm start
```
Uygulama `http://localhost:4200` adresinde çalışacaktır.

## Projeyi Derleme

```bash
npm run build
```
Derlenen dosyalar `dist/` klasöründe oluşturulacaktır.

## Docker ile Çalıştırma

Projeyi Docker ile çalıştırmak için:

```bash
docker build -t networkie-app .
docker run -p 80:80 networkie-app
```

## Özellikler

- Angular Material UI bileşenleri
- Responsive tasarım (TailwindCSS)
- Grafik ve istatistik gösterimi (Chart.js)
- Google Maps entegrasyonu
- Telefon numarası doğrulama
- Tarih işlemleri (date-fns)
