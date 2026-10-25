/**
 * NOEMA — tarayıcı üzerinde uçtan uca senaryolar.
 *
 * Çalıştırma:
 *   1) `npm run dev` ile geliştirme sunucusunu başlatın (varsayılan http://localhost:5173)
 *   2) `npm run test:e2e`
 *
 * Sistemde kurulu Chrome kullanılır (Playwright tarayıcı indirmez).
 */
const { chromium } = require('playwright-core')

const BASE = process.env.NOEMA_URL || 'http://localhost:5173/'
const results = []
let failures = 0

function check(name, ok, detail = '') {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' :: ' + detail : ''}`)
  if (!ok) failures += 1
}

// Yumuşak kaydırma tamamen oturana kadar bekler.
async function waitForScrollSettle(page, timeout = 8000) {
  const start = Date.now()
  let last = -1

  while (Date.now() - start < timeout) {
    const y = await page.evaluate(() => window.scrollY)
    if (y === last) {
      await page.waitForTimeout(250)
      const after = await page.evaluate(() => window.scrollY)
      if (after === last) return last
    }
    last = y
    await page.waitForTimeout(120)
  }

  return last
}

async function main() {
  const browser = await chromium.launch({
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-gpu'],
  })

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`))

  await page.goto(BASE, { waitUntil: 'networkidle' })

  /* ------------------------------- Hero ------------------------------- */
  const heading = (await page.locator('h1#hero-title').innerText()).replace(/\s+/g, ' ').trim()
  check('Hero başlığı görünür', heading.length > 0, heading)
  check('Hero başlığı doğru metin', heading.includes('Fikir') && heading.includes('bekliyor'), heading)

  const stats = await page.locator('.hero__stat b').allInnerTexts()
  check(
    'Hero istatistikleri hesaplanmış',
    stats.length === 3 && stats.every((value) => value.trim() !== ''),
    stats.join(' | '),
  )

  check('Canvas alanı var', (await page.locator('.stage canvas').count()) === 1)

  const desktopOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  check('Masaüstünde yatay taşma yok', desktopOverflow <= 1, `overflow=${desktopOverflow}`)

  /* ---------------------------- Navigasyon ---------------------------- */
  check('4 nav bağlantısı', (await page.locator('.hdr__nav a').count()) === 4)

  await page.locator('.hdr__nav a').nth(0).click()
  await waitForScrollSettle(page)
  const kesifTop = await page.locator('#kesif').evaluate((el) => el.getBoundingClientRect().top)
  check('Nav ile Keşfet bölümüne kaydı', Math.abs(kesifTop) < 140, `top=${Math.round(kesifTop)}`)

  /* ----------------------------- Keşfet ------------------------------- */
  const totalCards = await page.locator('.explore__grid .card').count()
  check('Keşfet kartları listeleniyor', totalCards > 10, `kart=${totalCards}`)

  await page.locator('#kesif .chip').nth(2).click()
  await page.waitForTimeout(400)
  const filtered = await page.locator('.explore__grid .card').count()
  check('Kategori filtresi çalışıyor', filtered > 0 && filtered < totalCards, `filtre=${filtered}`)

  await page.locator('#kesif .chip').nth(0).click()
  await page.waitForTimeout(300)

  await page.locator('.explore__search input').fill('gölge')
  await page.waitForTimeout(400)
  const searched = await page.locator('.explore__grid .card').count()
  check('Arama filtreliyor', searched > 0 && searched < totalCards, `arama=${searched}`)

  await page.locator('.explore__search input').fill('zzzqqqxxxyyy')
  await page.waitForTimeout(400)
  check('Boş durum mesajı çıkıyor', await page.locator('#kesif .empty').isVisible())

  await page.locator('#kesif .empty button').click()
  await page.waitForTimeout(400)
  check(
    'Filtreler sıfırlanıyor',
    (await page.locator('.explore__grid .card').count()) === totalCards,
  )

  await page.locator('.explore__grid .card').first().locator('button[aria-expanded]').click()
  await page.waitForTimeout(300)
  check(
    'Kart detayı açılıyor',
    await page.locator('.explore__grid .card .card__body').first().isVisible(),
  )

  const likeButton = page.locator('.explore__grid .card button[aria-pressed]').first()
  await likeButton.click()
  await page.waitForTimeout(300)
  check('Beğeni durumu değişiyor', (await likeButton.getAttribute('aria-pressed')) === 'true')

  const likes = await page.evaluate(() => window.localStorage.getItem('noema.likes.v1'))
  check('Beğeni localStorage’a yazılıyor', !!likes && likes.includes('x-'), String(likes))

  await page.locator('#kesif .chip', { hasText: 'Beğenilenler' }).click()
  await page.waitForTimeout(400)
  check(
    'Beğenilenler filtresi çalışıyor',
    (await page.locator('.explore__grid .card').count()) === 1,
    `kart=${await page.locator('.explore__grid .card').count()}`,
  )
  await page.locator('#kesif .chip').nth(0).click()
  await page.waitForTimeout(300)

  /* ------------------------ Fikir Laboratuvarı ------------------------ */
  await page.locator('.hdr__nav a').nth(1).click()
  await waitForScrollSettle(page)

  const ideaOne = await page.locator('#lab-output').innerText()
  check('Laboratuvar çıktısı var', ideaOne.trim().length > 10, ideaOne.slice(0, 45))

  await page.locator('.lab__card button', { hasText: 'Yeni kayıt üret' }).click()
  await page.waitForTimeout(700)
  const ideaTwo = await page.locator('#lab-output').innerText()
  check('Yeni üretim farklı kayıt veriyor', ideaOne.trim() !== ideaTwo.trim(), ideaTwo.slice(0, 45))

  await page.locator('.lab__tab').nth(1).click()
  await page.waitForTimeout(700)
  const ideaThree = await page.locator('#lab-output').innerText()
  check('Mod değişimi (soru) çalışıyor', ideaThree.trim().length > 10 && ideaThree !== ideaTwo)

  await page.locator('.lab__tab').nth(2).click()
  await page.waitForTimeout(700)
  const ideaFour = await page.locator('#lab-output').innerText()
  check('Mod değişimi (egzersiz) çalışıyor', ideaFour.trim().length > 10 && ideaFour !== ideaThree)

  check('Üretim geçmişi listeleniyor', (await page.locator('.lab__history-item').count()) > 0)

  await page.locator('.lab__card button', { hasText: 'Günlüğe ekle' }).click()
  await page.waitForTimeout(400)
  check(
    'Laboratuvardan günlüğe ekleme çalışıyor',
    (await page.locator('.note').count()) === 1,
    `not=${await page.locator('.note').count()}`,
  )

  /* ------------------------------ Günlük ------------------------------ */
  await page.locator('.hdr__nav a').nth(2).click()
  await waitForScrollSettle(page)

  await page.locator('#gunluk-form button[type="submit"]').click()
  await page.waitForTimeout(300)
  check('Boş form doğrulaması çalışıyor', (await page.locator('.field__error').count()) >= 2)

  const focusedId = await page.evaluate(() => document.activeElement && document.activeElement.id)
  check('İlk hatalı alana odaklanıyor', focusedId === 'journal-title', `focus=${focusedId}`)

  await page.locator('#journal-title').fill('ab')
  await page.locator('#journal-body').fill('kısa')
  await page.locator('#gunluk-form button[type="submit"]').click()
  await page.waitForTimeout(300)
  check('Minimum uzunluk doğrulaması çalışıyor', (await page.locator('.field__error').count()) >= 2)

  await page.locator('#journal-title').fill('Test notu — birinci deneme')
  await page.locator('#journal-body').fill(
    'Bu not, otomatik test tarafından oluşturulmuştur ve düzenlenebilir olmalıdır.',
  )

  const counter = await page.locator('.journal__counter').innerText()
  check('Karakter sayacı çalışıyor', /\d+ \/ 2000/.test(counter) && !counter.startsWith('0 /'), counter)

  await page.locator('#journal-tags').fill('test, otomasyon')
  await page.locator('#gunluk-form button[type="submit"]').click()
  await page.waitForTimeout(500)

  check('Not eklendi', (await page.locator('.note').count()) === 2)

  const stored = await page.evaluate(() => window.localStorage.getItem('noema.journal.v1'))
  check('Not localStorage’a yazıldı', !!stored && stored.includes('Test notu'), String(stored).slice(0, 60))

  await page.locator('.note .note__actions button').nth(0).click()
  await page.waitForTimeout(700)
  const editingTitle = await page.locator('#journal-title').inputValue()
  check('Düzenleme formu dolduruluyor', editingTitle.length > 0, editingTitle)

  await page.locator('#journal-title').fill('Test notu — düzenlendi')
  await page.locator('#gunluk-form button[type="submit"]').click()
  await page.waitForTimeout(500)
  check(
    'Not düzenleniyor',
    (await page.locator('.note__title').first().innerText()).includes('düzenlendi'),
  )
  check('Güncellendi rozeti görünüyor', (await page.locator('.note__meta', { hasText: 'güncellendi' }).count()) >= 1)

  await page.locator('#gunluk .chip', { hasText: '#test' }).first().click()
  await page.waitForTimeout(400)
  check('Etiket filtresi çalışıyor', (await page.locator('.note').count()) === 1)
  await page.locator('#gunluk .chip', { hasText: 'Tüm etiketler' }).first().click()
  await page.waitForTimeout(300)

  await page.locator('.journal__toolbar input').fill('olmayan kelime')
  await page.waitForTimeout(400)
  check('Not arama boş durumu', await page.locator('#gunluk .empty').isVisible())
  await page.locator('.journal__toolbar input').fill('')
  await page.waitForTimeout(300)

  await page.locator('.note .note__actions button').nth(1).click()
  await page.waitForTimeout(500)
  check('Silme onay diyaloğu açılıyor', await page.locator('dialog.modal[open]').isVisible())

  await page.locator('dialog.modal[open] button', { hasText: 'Sil' }).click()
  await page.waitForTimeout(600)
  check('Not silindi', (await page.locator('.note').count()) === 1)
  check('Not varken boş durum gösterilmiyor', !(await page.locator('#gunluk .empty').isVisible()))

  await page.locator('.note .note__actions button').nth(1).click()
  await page.waitForTimeout(500)
  await page.locator('dialog.modal[open] button', { hasText: 'Sil' }).click()
  await page.waitForTimeout(600)
  check('Tüm notlar silinince boş durum çıkıyor', await page.locator('#gunluk .empty').isVisible())

  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  check('Yenilemeden sonra boş durum korunuyor', await page.locator('#gunluk .empty').isVisible())

  /* ---------------------------- Mobil menü ---------------------------- */
  const mobile = await context.newPage()
  await mobile.setViewportSize({ width: 390, height: 844 })
  await mobile.goto(BASE, { waitUntil: 'networkidle' })
  await mobile.waitForTimeout(500)

  check('Mobilde hamburger görünür', await mobile.locator('.hdr__burger').isVisible())
  await mobile.locator('.hdr__burger').click()
  await mobile.waitForTimeout(600)
  check(
    'Mobil menü açılıyor',
    await mobile.locator('.mmenu').evaluate((el) => el.classList.contains('is-open')),
  )
  check('Mobilde 4 menü bağlantısı', (await mobile.locator('.mmenu__link').count()) === 4)

  const locked = await mobile.evaluate(() => getComputedStyle(document.body).overflow)
  check('Mobil menü açıkken kaydırma kilitli', locked === 'hidden', `overflow=${locked}`)

  await mobile.locator('.mmenu__link').nth(2).click()
  await waitForScrollSettle(mobile)
  check(
    'Mobil menü bağlantıdan sonra kapanıyor',
    await mobile.locator('.mmenu').evaluate((el) => !el.classList.contains('is-open')),
  )

  const mobileTop = await mobile.locator('#gunluk').evaluate((el) => el.getBoundingClientRect().top)
  check('Mobilde bölüme kaydı', Math.abs(mobileTop) < 140, `top=${Math.round(mobileTop)}`)

  const mobileOverflow = await mobile.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  check('Mobilde yatay taşma yok', mobileOverflow <= 1, `overflow=${mobileOverflow}`)

  await mobile.keyboard.press('Escape')
  await mobile.waitForTimeout(300)
  check(
    'Escape menüyü kapatır',
    await mobile.locator('.mmenu').evaluate((el) => !el.classList.contains('is-open')),
  )
  await mobile.close()

  /* --------------------------- Erişilebilirlik -------------------------- */
  await page.locator('.skip-link').focus()
  check(
    'Atlama bağlantısı odaklanabiliyor',
    await page.evaluate(() => document.activeElement.classList.contains('skip-link')),
  )

  const unlabeled = await page.evaluate(() =>
    Array.from(document.querySelectorAll('input, textarea')).filter((el) => {
      if (el.getAttribute('aria-label')) return false
      if (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) return false
      return true
    }).length,
  )
  check('Etiketsiz form alanı yok', unlabeled === 0, `eksik=${unlabeled}`)

  const namelessButtons = await page.evaluate(() =>
    Array.from(document.querySelectorAll('button'))
      .filter((btn) => !(btn.textContent || '').trim() && !btn.getAttribute('aria-label'))
      .map((btn) => btn.className),
  )
  check('Metni/etiketi olmayan buton yok', namelessButtons.length === 0, namelessButtons.join(' | '))

  const duplicateIds = await page.evaluate(() => {
    const seen = new Set()
    const duplicates = []
    document.querySelectorAll('[id]').forEach((el) => {
      if (seen.has(el.id)) duplicates.push(el.id)
      seen.add(el.id)
    })
    return duplicates
  })
  check('Tekrar eden id yok', duplicateIds.length === 0, duplicateIds.join(','))

  /* ---------------------------- Duyarlılık ---------------------------- */
  for (const [width, height, label] of [
    [1920, 1080, 'masaüstü geniş'],
    [1280, 800, 'masaüstü'],
    [768, 1024, 'tablet'],
    [390, 844, 'telefon'],
  ]) {
    const tab = await context.newPage()
    await tab.setViewportSize({ width, height })
    await tab.goto(BASE, { waitUntil: 'networkidle' })
    await tab.waitForTimeout(600)

    const overflow = await tab.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    const navHidden = await tab.locator('.hdr__nav').evaluate((el) => getComputedStyle(el).display === 'none')
    const burgerShown = await tab
      .locator('.hdr__burger')
      .evaluate((el) => getComputedStyle(el).display !== 'none')

    check(`${label} (${width}px): yatay taşma yok`, overflow <= 1, `overflow=${overflow}`)
    check(
      `${label}: menü durumu doğru`,
      width <= 900 ? navHidden && burgerShown : !navHidden,
      `nav=${!navHidden} burger=${burgerShown}`,
    )
    await tab.close()
  }

  /* -------------------------- Azaltılmış hareket ----------------------- */
  const reduced = await context.newPage()
  await reduced.emulateMedia({ reducedMotion: 'reduce' })
  await reduced.goto(BASE, { waitUntil: 'networkidle' })
  await reduced.waitForTimeout(1200)

  check(
    'Azaltılmış harekette içerik görünür',
    (await reduced.evaluate(() => getComputedStyle(document.querySelector('.hero__title')).opacity)) === '1',
  )

  const painted = await reduced.evaluate(() => {
    const canvas = document.querySelector('.stage canvas')
    const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data
    let count = 0
    for (let i = 3; i < data.length; i += 4) if (data[i] > 0) count++
    return count
  })
  check('Azaltılmış harekette canvas statik çiziliyor', painted > 500, `painted=${painted}`)
  await reduced.close()

  /* --------------------------- Bozuk depolama -------------------------- */
  const corrupt = await context.newPage()
  await corrupt.goto(BASE, { waitUntil: 'networkidle' })
  await corrupt.evaluate(() => window.localStorage.setItem('noema.journal.v1', '{{{bozuk json'))
  await corrupt.reload({ waitUntil: 'networkidle' })
  await corrupt.waitForTimeout(900)

  check(
    'Bozuk localStorage uygulamayı kırmıyor',
    await corrupt.evaluate(() => document.querySelector('#root').children.length > 0),
  )
  check('Bozuk veri boş duruma düşüyor', await corrupt.locator('#gunluk .empty').isVisible())
  await corrupt.close()

  /* ----------------------------- Konsol -------------------------------- */
  check('Konsol hatası yok', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))

  await browser.close()

  console.log(results.join('\n'))
  console.log(`\n${results.length - failures}/${results.length} senaryo geçti.`)
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((error) => {
  console.error('TEST HATASI:', error)
  console.log(results.join('\n'))
  process.exit(1)
})
