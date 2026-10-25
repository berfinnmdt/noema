# NOEMA

**Fikir, bir yerde bekliyor.**

NOEMA; düşüncelerin, kısa metinlerin, dijital sanatın ve keşif hissinin toplandığı etkileşimli bir
dijital deneyim platformudur. Sunucu, veritabanı veya hesap yoktur: her şey tarayıcıda çalışır.

---

## Teknoloji

| Katman      | Seçim                                             |
| ----------- | ------------------------------------------------- |
| Derleyici   | Vite 8                                            |
| UI          | React 19                                          |
| Dil         | TypeScript 6 (`strict` açık)                       |
| Stil        | Projeye özel CSS (token + katmanlı dosyalar)      |
| Durum       | React Context + özel hook'lar                     |
| Depolama    | `localStorage` (güvenli sarmalayıcı ile)          |
| Test        | Playwright ile tarayıcı üzerinde otomatik senaryo |

Ek paket bağımlılığı yoktur: yazı tipi dışında hiçbir dış servis kullanılmaz.

## Kurulum

```bash
cd noema
npm install
```

## Çalıştırma

```bash
npm run dev      # geliştirme sunucusu  -> http://localhost:5173
npm run build    # tsc -b + vite build  -> dist/
npm run preview  # üretim çıktısını yerelde sun
npm run lint     # oxlint ile statik kontrol
```

Tarayıcıda `http://localhost:5173` adresini açın. Sunucu çalışırken terminalde açık kalsın; kapatmak
için `Ctrl + C`.

## Bölümler

| # | Bölüm                | İçerik                                                                      |
| - | -------------------- | --------------------------------------------------------------------------- |
| 00 | **Hero**             | Maskeli satır giriş animasyonu, canvas "düşünce alanı", canlı sayı istatistikleri |
| 01 | **Keşfet**           | 18 arşiv kaydı · kategori filtreleri · arama · beğeni · günlüğe aktarma      |
| 02 | **Fikir Laboratuvarı** | Fikir / soru / egzersiz üretimi · 660 kayıtlık havuz · geçmiş · panoya kopyalama |
| 03 | **Dijital Günlük**   | Not ekle / düzenle / sil · etiket ve sıralama filtreleri · JSON dışa aktarma   |
| 04 | **Hakkında**         | Manifesto, üç ilke, yönlendirme çağrıları                                   |

## Öne çıkan işlevler

- **Navigasyon** yumuşak kaydırmalı, aktif bölümü işaretleyen (scroll-spy) bir üst çubuk; 900px
  altında tam ekran mobil menüye dönüşür (Escape ile kapanır, odak tuzağı içerir).
- **Fikir üretimi** her tıklamada farklı bir kayıt verir; arşiv havuzu ile şablonlardan derlenen
  kayıtlar harmanlanır, art arda tekrar engellenir.
- **Günlük** notları `noema.journal.v1` anahtarıyla `localStorage`'a yazılır. Başlık (3–80), not
  (10–2000 karakter) ve etiket kuralları doğrulanır; hatalı alana odaklanılır.
- **Beğeniler** `noema.likes.v1` anahtarında saklanır.
- **Boş durumlar** hem Keşfet'te (sonuç yoksa) hem Günlük'te (kayıt yokken) karşılanır.
- Bozuk veya erişilemez `localStorage` verisi uygulamayı düşürmez; okunamayan veri yok sayılır.

## Proje yapısı

```
src/
├── components/          # SiteHeader, SiteFooter, NoemaField (canvas), Marquee, Grain
│   └── ui/              # Button, Field, Chip, EmptyState, Reveal, ConfirmDialog, Icons
├── context/             # JournalProvider + journal-context (günlük durumu)
├── data/                # explore.ts (arşiv kayıtları), ideas.ts (üretim havuzu)
├── hooks/               # useJournal, useToast, useLocalStorage, useActiveSection, ...
├── lib/                 # storage, validation, format, scroll
├── sections/            # Hero, Explore, IdeaLab, Journal, About
├── styles/              # tokens → base → components → sections
├── types.ts
├── App.tsx
└── main.tsx
```

## Tasarım dili

- **Renk:** derin gece mavisi / siyaha yakın yüzeyler, kırık beyaz metin, kontrollü mor vurgu
  (`#8b5cf6` / `#b79cff`).
- **Tipografi:** başlıklarda yüksek kontrastlı serif *Instrument Serif*, gövdede geometrik grotesk
  *Space Grotesk*, üst veri etiketlerinde mono *JetBrains Mono*. Yazı tipi yüklenemezse sistem
  fontlarına düşer.
- **Kompozisyon:** 12 kolonlu asimetrik ızgara, geniş negatif alan, hairline çizgiler, katalog
  numaralandırması (`01 / KEŞİF`).
- **Hareket:** açılışta maskeli satır girişi, kaydırmayla belirme, mikro etkileşim geçişleri.
  `prefers-reduced-motion` açıksa tüm animasyonlar kapanır ve canvas tek kare olarak çizilir.

## Erişilebilirlik

Atlama bağlantısı, semantik yer işaretleri (`header / nav / main / section / footer`), tüm form
alanlarında etiket ve `aria-invalid` / `aria-describedby`, `role="status"` bildirim alanı, native
`<dialog>` ile onay kutusu, görünür odak halkası ve tam klavye desteği.

## Tarayıcıda otomatik test

Geliştirme sunucusu çalışırken Playwright ile gerçek tarayıcıda doğrulanabilir:

```bash
npm install --no-save playwright-core
node test/noema.e2e.cjs   # senaryolar: navigasyon, filtre, üretim, günlük CRUD, mobil, a11y
```

> Betik, `channel: 'chrome'` ile sistemde kurulu Chrome'u kullanır ve `http://localhost:5173`
> adresine bağlanır.
