import type { IdeaMode } from '../types'

export interface Idea {
  text: string
  source: 'arşiv' | 'derleme'
}

export const IDEA_MODE_LABELS: Record<IdeaMode, string> = {
  fikir: 'Fikir',
  soru: 'Soru',
  egzersiz: 'Egzersiz',
}

export const IDEA_MODE_HINTS: Record<IdeaMode, string> = {
  fikir: 'Henüz uygulanmamış, üzerine düşünülecek bir fikir.',
  soru: 'Cevabını bilmediğin, ama düşünmekten fayda gördüğün bir soru.',
  egzersiz: 'Hemen şimdi yapabileceğin, kısa bir yaratıcılık egzersizi.',
}

/* -------------------------------------------------------------------------- */
/* Arşivden hazır kayıtlar                                                   */
/* -------------------------------------------------------------------------- */

const ARCHIVE_IDEAS: string[] = [
  'Bir fikri, sahibinin adını bilmediğiniz bir kütüphaneye bırakın.',
  'Bir gün boyunca hiçbir şeyi optimize etmeyin: yavaş olmayı tercih edin.',
  'Herhangi bir nesneyi üç gün boyunca aynı açıdan fotoğraflayın.',
  'Bir konuşmayı yazıya dökün ve yalnızca duraklamaları bırakın.',
  'Bir şehri, tanımadığınız birinin günlüğü gibi yazın.',
  'En son okuduğunuz kitabın tek bir cümlesini alıp başka bir konuya yapıştırın.',
  'Bir kaybettiğiniz eşyayı tarif edin; tarifiniz bir portreye dönüşebilir.',
  'Bir alışkanlığınızı iki hafta askıya alın ve boşluğu doldurun.',
  'Bir müzik parçasının ritmini bir hikâyenin nabzına uydurun.',
  'Tanımadığınız birinin bıraktığı bir not bulun ve ona cevap yazın.',
  'Bir harita çizin; sadece gitmediğiniz yerleri gösterin.',
  'Günde bir cümle yazıp altı ay sonra hepsini tek bir paragrafa dönüştürün.',
  'Bir kavramı, çocuğun açıklayacağı dilde anlatın.',
  'Elinizdeki ilk nesneyi iki dakika inceleyin; sonra adını değiştirin.',
  'Bir mektupla başlayan hikâye yazın ve mektubun geri kalanını hiç yazmayın.',
  'Bir günün tek bir saniyesini seçin ve o saniyeyi ayrıntılı anlatın.',
  'Bir aracın koltuk başlığını okuyun; sahibi hakkında bir portre çıkarın.',
  'Şehrinizin en az kullanılan yolunu bir düğüm noktası gibi düşünün.',
  'Bir tarifi tarif etmeyin; tarifin uygulanışını anlatın.',
  'Bir kitaptan aldığınız ilk cümleyi, hiç o kitaba bakmadan yeniden yazın.',
  'Bir kural koyun: bu hafta hiçbir şeyi hızlandırmayın.',
  'Bir bitkiyi bir ay boyunca aynı saatte fotoğraflayın.',
  'Gürültüyü bir müzik aleti gibi dinleyin: ritim, tempo, suskunluk.',
  'Bir yabancıya kendinizi üç kelimeyle anlatın; sonra bu kelimeleri değiştirin.',
  'Bir kararı, sonucunu bilmeden gerekçelendirin.',
  'En sevdiğiniz yeri, kimsenin gitmediği bir saatte yeniden ziyaret edin.',
  'Bir mektup yazın ama asla göndermeyin.',
  'Bir gün boyunca yalnızca soru sorun; hiçbir cevap vermeyin.',
]

const ARCHIVE_QUESTIONS: string[] = [
  'Bir fikri en çok hangi anta değer kazandırır: yazıldığı an, paylaşıldığı an, yoksa sessizce sende kaldığı an?',
  'En son neyi öğrenmek istediğiniz şey, neden hâlâ öğrenmediniz?',
  'Bir düşüncenin ağırlığını ne belirler: doğruluğu mu, yoksa ne kadar zor kazanıldığı mı?',
  'Bugün sessizce karar verdiğiniz şeylerden hangisi sizi en çok rahatsız ediyor?',
  'Bir fikri reddetmek, onu hiç üretmemekten daha mı zordur?',
  'Hangi alışkanlığınız size ait değil de sadece alınmış?',
  'Bir şeyi bilmemek, onu yanlış bilmekten ne kadar farklı?',
  'İnsanları en çok ne etkiler: ne dedikleri mi, neyi sessizce yaptıkları mı?',
  'Bir işi yarım bırakmanın en dürüst gerekçesi nedir?',
  'Bir fikri saklamak, onu kaybetmekten daha mı güvenli?',
  'En zor okuduğunuz şeyi ilk kez ne zaman anladınız?',
  'Bir günü geçirirken zamanın hangi kısmı gerçekten sizin?',
  'Bir fikrin sahibi olmadan onu taşımak ne demek?',
  'Bir şeyi anlatmanın en zor yolu hangisi: anlatmak mı, unutmak mı?',
  'Bir konuda sustuğunuzda, söylediğinizden fazla mı şey söylenmiş olur?',
  'Herkesin bildiği ama kimsenin söylemediği bir şey var mı?',
  'Bir fikir, sahibini değiştirdiğinde aynı fikir midir?',
  'En çok hangi işi yapmadığınız için kendinizi kınıyorsunuz?',
  'Bir şeyi düşünmek ile onu yapmak arasındaki mesafe neden bu kadar büyük?',
  'Bir günün sonunda aklınızda kalan şey, o günün önemini nasıl belirler?',
  'Bir soruyu güzel sormak, güzel cevaplamaktan daha mı zor?',
  'Bir fikrin ne zaman “yeterince olgun” sayıldığını kim belirler?',
  'Hiç kimsenin beğenmediği bir iş yapmış olmak nasıl bir şey?',
  'Bir hatırayı ne zaman “anı” saymaya başlarsınız?',
  'En sevdiğiniz düşünceniz, size neyi yaptırmasıyla tanımlanır?',
  'Bir şeyi bilmemek hiç sorun değilse, o zaman neden herkes öğrenmekten bahsediyor?',
  'Zihin boşken hangi düşüncelere daha kolay yakalanırsınız?',
  'Bir fikri paylaşmanın doğru anı nasıl seçilir?',
]

const ARCHIVE_EXERCISES: string[] = [
  'Bir sayfa boyunca, yalnızca “bugün” kelimesini kullanarak yazın.',
  'Masadaki ilk beş nesneyi isimlerinden yoksun olarak tarif edin.',
  'Bir düğmeye basıp yarım saat boyunca çıkan sesi dinleyin.',
  'Bugün gördüğünüz üç yabancının ayaklarını tarif edin.',
  'Bir filmi sessizce izleyin ve yalnızca görüntüyle hikâyesini anlatın.',
  'On dakika boyunca aynı cümleyi farklı tonlarla yazın.',
  'Bir mektup kâğıdını üç parçaya katlayıp katlama çizgilerini not edin.',
  'Şu an bulunduğunuz odayı, mobilyaları saymadan tarif edin.',
  'Bir sesinü çalın ve ona bir isim verin.',
  'Günde beş adım atın ve her adımı bir kelimeyle adlandırın.',
  'Bir kâğıda elinizdeki üç şeyi yazın; sonra kâğıdı katlayıp saklayın.',
  'Bir yabancının cümlesini tek bir emojiyle özetleyin.',
  'Pencerenizden görünen üç şeyi, hiç sıfat kullanmadan yazın.',
  'Bir müzik parçasının ilk on saniyesini üç farklı hikâyeye bağlayın.',
  'Günün en sıkıcı anını, en iyi hâliyle anlatın.',
  'Bir kitaptan aldığınız son cümleyi ezberden yazın.',
  'Bir koku hayal edin ve o kokunun bulunduğu odayı çizmeye çalışın.',
  'Bir düğmeyi, bir kapıyı ve bir sandalyeyi tek bir sahnede birleştirin.',
  'Yarım saat boyunca tek bir kelime seçin ve gün boyunca onu kullanın.',
  'Bir anı, hiç duygu kelimesi kullanmadan anlatın.',
  'Üç nesneyi seçin ve aralarındaki ortak özelliği yazın.',
  'Bir yere gidin ve orada yalnızca dokunduğunuz şeyleri sayın.',
  'Bugün duyduğunuz en yüksek ses ile en alçak sesi karşılaştırın.',
  'Bir fotoğrafınızın köşesine, görmediğiniz bir mevsim için bir not düşün.',
  'Bir dakika boyunca nefesinizi sayın ve sonra bir cümle yazın.',
  'Bir yere gidin ve oradaki en sıradan nesneyi olağanüstü biçimde tarif edin.',
  'Üç cümlelik bir hikâye kurun ve orta cümleyi değiştirin.',
  'Çevrenizdeki en gizemli nesneyi bulun ve ona bir dosya açın.',
]

/* -------------------------------------------------------------------------- */
/* Derleme için parça havuzları                                                */
/* -------------------------------------------------------------------------- */

const SUBJECTS: string[] = [
  'gölgenin kendisi',
  'eski bir fotoğraf',
  'sessizlik',
  'kalabalık',
  'yağmur sonrası asfalt',
  'eski bir dil',
  'rüya',
  'gecikme',
  'kilitli bir kapı',
  'titreşim',
  'kâğıt',
  'tek bir far',
  'merdiven',
  'kaynaktaki çiçek',
  'radyo',
  'bir yabancının gülümsemesi',
  'bulutların gölgesi',
  'kapanan bir kitap',
  'elektrik kesintisi',
  'bir hayaleti',
  'kırık bir saat',
  'soğuk bir bardak',
  'uzaktan gelen bir düdük',
  'kar taneleri',
]

const IDEA_TEMPLATES: string[] = [
  '“{s}” üzerine, kimsenin beklemediği bir arşiv kur.',
  '“{s}” görüntüsünü tamamen sil; geriye ne kalıyor, onu yaz.',
  'Her gün aynı saatte “{s}” üzerine üç cümle yaz.',
  '“{s}”i kaybettiğini fark et ve onu arayan birini kaleme al.',
  '“{s}” ile “{s2}” arasındaki boşluğu tek bir hikâyeye dönüştür.',
  '“{s}” üzerine bir kurallar künyesi yaz: ne yapılabilir, ne yapılamaz.',
  '“{s}”i kimseye göstermeden sakla; bir hafta sonra açıp ne değiştiğini yaz.',
  '“{s}”den bir müzik parçası çıkar: ritmi, temposu ve suskunluğu tarif et.',
]

const QUESTION_TEMPLATES: string[] = [
  '“{s}” seni en çok hangi soruya zorluyor?',
  '“{s}” ile karşılaştığında sessiz kalmayı seçtiğin an oldu mu?',
  '“{s}” üzerine bir fikir üretirsen, onu kimse okumadan önce kendine ne sorardın?',
  '“{s}”ın hayatınındaki karşılığı ne olurdu?',
  '“{s}”ı anlatırken hangi kelimeyi kastettiğini sandığın hâlde başka anlaşıldı?',
  '“{s}” olmasaydı bugün hangi kararı farklı verirdin?',
  '“{s}”ı bir yabancıya tanıtsan, ilk olarak neyi gösterirdin?',
  '“{s}” üzerine bir kitap yazsaydın, kitabın ilk cümlesi ne olurdu?',
]

const EXERCISE_TEMPLATES: string[] = [
  '“{s}” üzerine yedi dakika boyunca kesintisiz yaz.',
  '“{s}”ı gözlerini kapatarak tarif et; açtığında yazdığınla karşılaştır.',
  '“{s}” için üç ayrı başlık bul ve her birinin altına iki satır yaz.',
  '“{s}”ı bir mektuba dönüştür: alıcıyı sen seç.',
  '“{s}”la ilgili beş nesne listele ve listedeki en tuhafını çiz.',
  '“{s}” üzerine bir soru yaz, sonra ona otuz saniye içinde cevap ver.',
  '“{s}”ı bir müzik parçasının ortasına yerleştir; akışı bozmadan.',
  '“{s}”dan bir kısa film senaryosu çıkar: tek sahne, tek replik.',
]

/* -------------------------------------------------------------------------- */
/* Üretim motoru                                                              */
/* -------------------------------------------------------------------------- */

/** Üretim havuzunun toplam büyüklüğü (arşiv + şablon türevleri). */
export const IDEA_POOL_SIZE =
  ARCHIVE_IDEAS.length +
  ARCHIVE_QUESTIONS.length +
  ARCHIVE_EXERCISES.length +
  (IDEA_TEMPLATES.length + QUESTION_TEMPLATES.length + EXERCISE_TEMPLATES.length) * SUBJECTS.length

const POOLS: Record<IdeaMode, string[]> = {
  fikir: ARCHIVE_IDEAS,
  soru: ARCHIVE_QUESTIONS,
  egzersiz: ARCHIVE_EXERCISES,
}

const TEMPLATES: Record<IdeaMode, string[]> = {
  fikir: IDEA_TEMPLATES,
  soru: QUESTION_TEMPLATES,
  egzersiz: EXERCISE_TEMPLATES,
}

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)]
}

function pickDifferent<T>(list: T[], avoid: T | undefined): T {
  if (list.length < 2) return list[0]
  let candidate = pick(list)
  let guard = 0
  while (candidate === avoid && guard < 12) {
    candidate = pick(list)
    guard += 1
  }
  return candidate
}

/** Belirli bir mod için yeni bir fikir/soru/egzersiz üretir. */
export function generateIdea(mode: IdeaMode, previous?: Idea): Idea {
  const archivePool = POOLS[mode]

  // %55 ihtimalle arşivden, %45 ihtimalle şablonlardan derlenmiş kayıt.
  if (Math.random() < 0.55) {
    return { text: pickDifferent(archivePool, previous?.text), source: 'arşiv' }
  }

  const template = pick(TEMPLATES[mode])
  const subject = pick(SUBJECTS)
  const secondary = pickDifferent(SUBJECTS, subject)

  return {
    text: template.replace('{s2}', secondary).replace('{s}', subject),
    source: 'derleme',
  }
}
